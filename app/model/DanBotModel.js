var $ = require('jquery-deferred');
var util = require('../lib/util');

module.exports = {

    imgurGalleryId: '5CoxY',

    advice: [
        'Oh hey, {handle}. Don\'t get married. Just kidding it\'s great.',
        'Oh hey, {handle}. Don\'t eat street meat. Just kidding it\'s great.',
        'Seriously. Don\'t have kids. {handle}, you know what I\'m talking about...',
        '{handle}, pull my finger. C\'mon... Do it.',
        'Have you seen CakeFarts? {handle} hasn\'t seen it, guys!' +
            'Go to cakefarts.com. So funny, you guys.',
        '{handle}, check out 2 girls 1 cup. So gross. Google it. Seriously.'
    ],

    getAdvice: function (handle) {
        var def = $.Deferred();
        def.resolve({
            success: true,
            text: util.getRandomIndex(this.advice).replace('{handle}', handle || 'Guys')
        });
        return def.promise();
    },

    getWeatherReport: function (data, handle) {
        var def = $.Deferred();
        var current = data.current || {};
        var temp = +(current.feelslike || current.temperature);
        var msg = this.getTemperatureMsg(temp);
        def.resolve({
            success: true,
            text: msg.replace('{handle}', handle || 'Guys')
        });
        return def.promise();
    },

    getTemperatureMsg: function (temp) {

        if (temp >= 90) {
            return 'So sweaty, {handle}. Had to sleep on the couch. Better call in sick.';
        }
        if (temp >= 80) {
            return 'So sweaty, {handle}. Seriously. Metro North is so gross.';
        }
        if (temp >= 75) {
            return 'Getting kind of sweaty, {handle}. Too hot for rollerblading. ' +
                'Might be a good day for Hershey Park.';
        }
        if (temp >= 65) {
            return 'Should be a good day for Hershey Park, {handle}. ' +
                'Or Rollerblading. Better leave early.';
        }
        if (temp >= 45) {
            return 'Warm enough for rollerblading. Not quite nice enough for Hershey Park. ' +
                '{handle}, you know what I\'m talking about.';
        }

        return 'Way too cold for Rollerblading, ' +
            'but they\'re turning up the heat on the Metro North.' +
            'So sweaty. Better sleep on the couch.';

    }

};
