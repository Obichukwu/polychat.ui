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

    emberApp.UserIndexController = Ember.ObjectController.extend({
        content: null,
        gender: ["Male", "Female"]
    });
    emberApp.UserPasswordController = Ember.ObjectController.extend({
        oldPassword:null,
        newPassword:null,
        newPassword2:null,

        oldPasswordError:null,
        newPasswordError:null,
        newPasswordError2:null
    });

})(window.Initialzr)