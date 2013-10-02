(function (emberApp) {
    emberApp.FeedsIndexController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['postDate'],
        sortAscending: false,

        dataLoaded: false
    });
    emberApp.FeedsFeedController = Ember.ObjectController.extend({
        content:null,

        newComment: null,
        dataLoaded: false
    });

    emberApp.MessagesIndexController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['lastMessageDate'],
        sortAscending: false,

        dataLoaded: false
    });
    emberApp.MessagesMessageController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['date'],
        sortAscending: false,
        parentMessage:null,

        newMessage: null,
        dataLoaded: false
    });

    emberApp.FriendsIndexController = Ember.ArrayController.extend({});
    emberApp.FriendsFriendController = Ember.ObjectController.extend({});

    emberApp.ChatsIndexController = Ember.ArrayController.extend({});
    emberApp.ChatsChatroomController = Ember.ArrayController.extend({});

    emberApp.AboutController = Ember.ObjectController.extend({});
})(window.Initialzr)