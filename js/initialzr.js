(function (win) {
    win.Initialzr = Ember.Application.create({
        VERSION: '2.0',
        rootElement: '#emberApp',
        LOG_TRANSITIONS: true,

        auth: null,
        dataStore: null,
        isOnline: false,
        ApplicationController: Ember.Controller.extend({
            userBinding: 'Initialzr.auth' //Ember.Binding.oneWay('Initialzr.auth')
        }),

        ready: function () {
            Initialzr.set('dataStore', Initialzr.Store.create());

            var prof = Initialzr.database.getItem('UserProfile');
            if (!Ember.isEmpty(prof)) {
                Initialzr.set('auth', Initialzr.Profile.create($.parseJSON(prof)));
            }
        },

        displayError: function (req, exception) {
            var message;
            var statusErrorMap = {
                '400': "Server understood the request but request content was invalid.",
                '401': "Unauthorised access.",
                '403': "Forbidden resouce can't be accessed",
                '404': "Resource not found",
                '500': "Internal Server Error.",
                '503': "Service Unavailable"
            };
            if (req.status) {
                message = statusErrorMap[req.status];
                if (!message) {
                    message = "Unknow Error \n.";
                }
            } else if (exception == 'parsererror') {
                message = "Error.\nParsing JSON Request failed.";
            } else if (exception == 'timeout') {
                message = "Request Time out.";
            } else if (exception == 'abort') {
                message = "Request was aborted by the server";
            } else {
                message = "Unknow Error \n.";
            }
            win.Initialzr.displayMessage(message);
        },

        displayMessage: function (message) {
            alert(message);
        },

        database: win.localStorage,

        networkOnline: function () {
            win.Initialzr.set('isOnline', true);
        },

        networkOffline: function () {
            win.Initialzr.set('isOnline', false);
        }
    });
    win.Initialzr.deferReadiness();

    win.onDeviceReady = function () {
        document.addEventListener("offline", win.Initialzr.networkOffline, false);
        document.addEventListener("online", win.Initialzr.networkOnline, false);
        //document.addEventListener("menubutton", onMenuKeyDown, false);

        var networkState = navigator.connection.type;
        if (networkState != Connection.NONE) {
            win.Initialzr.networkOnline();
        }
        win.Initialzr.advanceReadiness();
    }
})(window);

Ember.Handlebars.registerBoundHelper('moment_date', function(date) {
  return moment(date).fromNow();
});


