/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const streamNameToIdDictionary = {
    'classic eurodisco' : 'ClassicEuroDisco',
    'classic euro disco' : 'ClassicEuroDisco',
    'vocal trance' : 'VocalTrance',
    'nightcore' : 'NightCore',
    'classic eurodance': 'ClassicEuroDance',
    'classic euro dance':'ClassicEuroDance',
    'latin house': 'LatinHouse',
    'russian club hits': 'RussianClubHits'
};

function getStreamId(streamName){
    if (streamName in streamNameToIdDictionary)
        return (streamNameToIdDictionary[streamName]);
    else
        return null;
}

const streamIdToDataDictionary = {
    'ClassicEuroDisco':
    {
        imageUrl : 'https://cdn-images.audioaddict.com/0/1/0/a/6/6/010a6648f8afc52654b07c07c68e9cad.png?size=145x145',
        streamUrl: process.env.streamUriClassicEuroDisco
    },
    'VocalTrance':
    {
        imageUrl : 'https://cdn-images.audioaddict.com/3/0/9/f/2/4/309f243a8a181ad83e8c5e15cd4b24c3.png?size=145x145',
        streamUrl: process.env.streamUriVocalTrance
    },
    'NightCore': 
    {
        imageUrl : 'https://cdn-images.audioaddict.com/e/f/8/f/b/e/ef8fbe63f86e496f0ce514ee2e85c30a.png?size=145x145',
        streamUrl: process.env.streamUriNightcore
    },
    'ClassicEuroDance':
    {
        imageUrl : 'https://cdn-images.audioaddict.com/a/9/8/1/5/3/a98153e6c9fcee321fd6dff0c8a6d0ba.png?size=145x145',
        streamUrl: process.env.streamUriClassicEuroDance
    },
    'LatinHouse':
    {
        imageUrl : 'https://cdn-images.audioaddict.com/6/0/1/7/6/e/60176ec05138ad9b621cb92de7f0c8c8.png?size=145x145',
        streamUrl: process.env.streamUriLatinHouse
    },
    'RussianClubHits':
    {
        imageUrl : 'https://cdn-images.audioaddict.com/f/b/4/4/6/7/fb44679c744da52cede329f18ef2b4f5.jpg?size=200x200',
        streamUrl: process.env.streamUriRussianClubHits
    },
};

function getAllStreamNames(){
    var channelNames = '';
    for (var key in streamIdToDataDictionary)
        channelNames = channelNames + ', ' + key;
    return channelNames;
}


function getStreamData(streamId){
    if (streamId in streamIdToDataDictionary)
        return (streamIdToDataDictionary[streamId]);
    else
        return null;
}

function getStreamInfo(streamName){
    const streamId = getStreamId(streamName);
    const streamData = getStreamData(streamId);
    return streamData;
}



const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Willkommen bei Digitally Imported. Um einen Sender zu starten, sage: Spiele Channel - Beispielsweise: Spiele Vocal Trance. Für eine Liste der verfügbaren Channel sage: Hilfe.');
    },
    'AMAZON.PauseIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },
    'AMAZON.ResumeIntent': function () {
        this.emit(':tell', 'Und weiter gehts');
    },
    'AudioPlayer.PlaybackStarted': function () {
        this.emit(':tell', 'Gestartet');
    },
    'AudioPlayer.PlaybackFailed': function () {
        this.emit(':tell', 'Fehlgeschlagen');
    },
    'StartPlayIntent': function () {
        var channelSlot = this.event.request.intent.slots.Channel;
        var channelName = 'vocal trance';
        if (channelSlot && channelSlot.value) {
            channelName = channelSlot.value.toLowerCase();
        }
        const channelInfo = getStreamInfo(channelName);
        if (channelInfo == null){
            const speechOutput = 'Den Channel ' + channelName + ' kenne ich nicht. Bitte wähle einen verfügbaren Channel';
            this.emit(':ask', speechOutput);
            return;
        }
        const url = channelInfo.streamUrl;
        const channelImageUrl = channelInfo.imageUrl;
        const channelIcon = {
          smallImageUrl : channelImageUrl,
          largeImageUrl : channelImageUrl
        };

        this.attributes['enqueuedToken'] = null;
        this.response.speak("Starte Digitally Imported, Channel "+channelName);
        this.response.cardRenderer("Digitally Imported","DI.fm: "+channelName,channelIcon);
        this.response.audioPlayerPlay('REPLACE_ALL',url, 'token', null, 0);
        this.emit(':responseReady');    
        
        
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Sage: Spiele Channel - Beispielsweise: Spiele Vocal Trance. Verfügbare Channels sind '+getAllStreamNames();
        this.emit(':ask', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};
