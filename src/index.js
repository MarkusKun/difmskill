/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

function getStreamInfo(streamName){
    switch(streamName){
        case 'vocal trance':            
            return {
                imageUrl : 'https://cdn-images.audioaddict.com/3/0/9/f/2/4/309f243a8a181ad83e8c5e15cd4b24c3.png?size=145x145',
                streamUrl: process.env.streamUriVocalTrance
            };
        case 'classic eurodisco':
        case 'classic euro disco':
            return {
                imageUrl : 'https://cdn-images.audioaddict.com/0/1/0/a/6/6/010a6648f8afc52654b07c07c68e9cad.png?size=145x145',
                streamUrl: process.env.streamUriClassicEuroDisco
            };
        case 'nightcore':
            return {
                imageUrl : 'https://cdn-images.audioaddict.com/e/f/8/f/b/e/ef8fbe63f86e496f0ce514ee2e85c30a.png?size=145x145',
                streamUrl: process.env.streamUriNightcore
            };
        case 'classic eurodance':
        case 'classic euro dance':
            return {
                imageUrl : 'https://cdn-images.audioaddict.com/a/9/8/1/5/3/a98153e6c9fcee321fd6dff0c8a6d0ba.png?size=145x145',
                streamUrl: process.env.streamUriClassicEuroDance
            };
    }
    return {
        imageUrl : 'https://cdn-images.audioaddict.com/6/0/1/7/6/e/60176ec05138ad9b621cb92de7f0c8c8.png?size=145x145',
        streamUrl: process.env.streamUri
    };

}



const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Willkommen bei Digitally Imported. Um einen Sender zu starten, sage: Spiele Channel - Beispielsweise: Spiele Vocal Trance');
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
    'StartStreamIntent': function () {
        
        const speechOutput = 'Sage: Spiele Channel - Beispielsweise: Spiele Vocal Trance';
        this.emit(':ask', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Sage: Spiele Channel - Beispielsweise: Spiele Vocal Trance';
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
