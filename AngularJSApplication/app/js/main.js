var config = {
    paths: {
        angular: '../bower_components/angular/angular',
        'angular-route': '../bower_components/angular-route/angular-route',
        domReady: '../bower_components/requirejs-domready/domReady',
        jquery: '../bower_components/jquery/dist/jquery',
        twitterbootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        prototypes: 'prototypes'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'twitterbootstrap': {
            deps: ['jquery']
        }
    },
    deps: [
    // kick start application... see bootstrap.js
    './bootstrap'
    ]
};

require.config(config);