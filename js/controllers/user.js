(function (emberApp) {
    emberApp.FeedsController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['postDate'],
        sortAscending: false,

        dataLoaded: false
    });
    
    emberApp.MessagesIndexController = Ember.ArrayController.extend({});
    emberApp.MessagesMessageController = Ember.ArrayController.extend({});

    emberApp.FriendsIndexController = Ember.ArrayController.extend({});
    emberApp.FriendsFriendController = Ember.ObjectController.extend({});

    emberApp.ChatsIndexController = Ember.ArrayController.extend({});
    emberApp.ChatsChatroomController = Ember.ArrayController.extend({});

    emberApp.AboutController = Ember.ObjectController.extend({});   
})(window.Initialzr)