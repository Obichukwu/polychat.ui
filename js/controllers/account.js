(function (emberApp) {
    emberApp.IndexController = Ember.ObjectController.extend({
        content: null,
        viewMode: 0,
        gender: ["Male", "Female"],
        departments: [],

        SwitchView: function (mode) {
            //login=0, register=1
            this.set("viewMode", mode);
        }
    });

    emberApp.UsersIndexController = Ember.ObjectController.extend({});
    emberApp.UsersPasswordController = Ember.ObjectController.extend({});

})(window.Initialzr)