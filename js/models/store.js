(function (emberApp) {
    emberApp.Store = Ember.Object.extend({
        /*baseAddress:"http://polychat.apphb.com/api/",
        baseAddress: "http://localhost:1031/api/",
        */
        baseAddress:"http://polychat.apphb.com/api/",
        store: '',

        checkNetwork: function (req) {
            if (emberApp.get('isOnline') == false) {
                req.abort();
                emberApp.displayMessage("System not connected to network. Please connect to the internet and try again.");
            }
        },

        beforeSending: function (req) {
            if (emberApp.get('isOnline') == false) {
                req.abort();
                emberApp.displayMessage("System not connected to network. Please connect to the internet and try again.");
            }
            req.setRequestHeader('Authorization', 'Basic ' + emberApp.get('auth').get('authToken'));
        },

        read: function (id) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/' + id,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: null, //JSON.stringify({ 'id': id }),
                type: 'GET',
                error: emberApp.displayError,
                beforeSend: self.beforeSending
            });
        },

        create: function (object) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(object),
                type: 'POST',
                error: emberApp.displayError,
                beforeSend: self.beforeSending
            });
        },

        update: function (id, object) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/' + id,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(object),
                type: 'PUT',
                error: emberApp.displayError,
                beforeSend: self.beforeSending
            });
        },

        deleteItem: function (id) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/' + id,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: null, //JSON.stringify({ 'id': id }),
                type: 'DELETE',
                error: emberApp.displayError,
                beforeSend: self.beforeSending
            });
        },

        loginObject: function (uname, pword) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: 'username=' + uname + '&password=' + pword,
                error: emberApp.displayError,
                type: 'GET',
                beforeSend: self.checkNetwork
            });
        },
        loginReadObject: function () {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: null,
                error: emberApp.displayError,
                type: 'GET',
                beforeSend: self.checkNetwork
            });
        },
        loginCreateObject: function (object) {
            var self = this;
            return $.ajax({
                url: this.baseAddress + self.get('store') + '/',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(object),
                error: emberApp.displayError,
                type: 'POST',
                beforeSend: self.checkNetwork
            });
        }
    });

})(window.Initialzr);