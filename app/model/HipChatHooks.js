/**
 * listing of Available HipChat hooks
 */
module.exports = {

    getHooks: function (req) {

        var stubUrl = req ? req.protocol + '://' + req.get('host') + req.originalUrl : '/';

        return {

            stubUrl: stubUrl,

            hooks: [
                {
                    slug: '/gif',
                    name: 'GifBot',
                    endpoint: stubUrl + 'api/gif',
                    description: 'searches imgur api for a gif. ' +
                        'Better than HipChat\'s native /gif, which uses Giphy. ' +
                        'IMHO, Imgur is better.'
                },

                {
                    slug: '/jif',
                    name: 'JifBot',
                    endpoint: stubUrl + 'api/jif',
                    description: 'Same as the /gif hook but doesn\'t conflict with native /gif.' +
                        'Use this if you want both.'
                },

                {
                    slug: '/tube',
                    name: 'TubeBot',
                    endpoint: stubUrl + 'api/tube',
                    description: 'Searches Youtube for videos, ' +
                        'posts 1 of the top 5 videos matching a given search string.'
                },

                {
                    'slug': '/vigoda',
                    'name': 'VigodaBot',
                    'endpoint': stubUrl + 'api/vigoda',
                    'description': 'Tells you if a famous person is or isn\'t dead. ' +
                        '(according to Wikipedia)'
                },

                {
                    'slug': '/twitty',
                    'name': 'TwittyBot',
                    'endpoint': stubUrl + 'api/twitty',
                    'description': 'You can call him Conway. Searches Twitter for tweets.'
                },

                {
                    'slug': '/dan',
                    'name': 'DanBot',
                    'endpoint': stubUrl + 'api/dan',
                    'description': 'Official HipChat Integration of the Dan Curis Fanclub, ' +
                        'DUMBO chapter. Don\'t install this just kidding it\'s great.'
                },
                {
                    'slug': '/perf',
                    'name': 'PerfBot',
                    'endpoint': stubUrl + 'api/perf',
                    'description': 'Google PSI rating for any website. ' +
                    'This one is very much a work in progress.'
                }
            ]
        };
    }
};
