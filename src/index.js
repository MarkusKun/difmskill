/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
        this.emit('StartStreamIntent');
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
        var channelName = 'vocaltrance';
        if (channelSlot && channelSlot.value) {
            channelName = channelSlot.value.toLowerCase();
        }
        var url = process.env.streamUri;
        if (channelName == 'vocaltrance'){
            url = process.env.streamUriVocalTrance;
        }
        if (channelName == 'classic eurodisco'){
            url = process.env.streamUriClassicEuroDisco;
        }
        if (channelName == 'nightcore'){
            url = process.env.streamUriNightcore;
        }
        if (channelName == 'classic eurodance'){
            url = process.env.streamUriClassicEuroDance;
        }
        
        this.response.audioPlayerPlay('REPLACE_ALL',url, 'token', null, 0);
        this.emit(':responseReady');    
        
        
    },
    'StartStreamIntent': function () {
        
        this.attributes['enqueuedToken'] = null;
        const url = process.env.streamUri;
        
        this.response.audioPlayerPlay('REPLACE_ALL',url, 'token', null, 0);
        this.emit(':responseReady');    
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Musik sollte automatisch starten';
        this.emit(':tell', speechOutput);
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
