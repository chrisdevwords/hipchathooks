var imgurGallery = require('./imgurGallery');
var imgurSearch = require('./imgurSearch');
var imgurServiceErrors = require('./imgurServiceErrors');
var youtubeSearch = require('./youtubeSearch');
var youtubeEmptySearch = require('./youtubeEmptySearch');
var youtubeBadKey = require('./youtubeInvalidKey');
var weatherDataMSN = require('./weatherDataMSN');
var webHook = require('./webHook');

module.exports = {
    hipChat: webHook,
    imgur: {
        serviceError: {
            apiKey: JSON.stringify(imgurServiceErrors.apiKey),
            emptySearch: JSON.stringify(imgurServiceErrors.emptySearch),
            albumNotFound: JSON.stringify(imgurServiceErrors.albumNotFound)
        },
        album: JSON.stringify(imgurGallery),
        search:  JSON.stringify(imgurSearch)
    },
    youtube: {
        serviceError: {
            invalidKey: JSON.stringify(youtubeBadKey),
            emptySearch: JSON.stringify(youtubeEmptySearch)
        },
        search: JSON.stringify(youtubeSearch)
    },
    weatherMSN: {
        connecticut: JSON.stringify(weatherDataMSN)
    }
};
