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
        dataLoaded: false,

        lastUpdateDate: null,
        updateInterval:null
    });

    emberApp.FriendsIndexController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['firstName', 'lastName'],
        sortAscending: true,
        departments: [],
        selectedDepartmentId:0,

        searchLoaded: false
    });

    emberApp.ChatsIndexController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['title'],
        sortAscending: true,

        dataLoaded: false
    });
    emberApp.ChatsChatController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['date'],
        sortAscending: false,
        department:null,
        lastUpdateDate: null,

        newMessage: null,
        dataLoaded: false,

        updateInterval:null
    });

    emberApp.AboutController = Ember.ObjectController.extend({});
})(window.Initialzr)