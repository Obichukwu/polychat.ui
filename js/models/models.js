(function (emberApp){
    emberApp.BaseObject  = Ember.Object.extend({
        isEditing: false
    });

    emberApp.Faculty  = emberApp.BaseObject.extend({
        facultyId: null,
        title: null,
        description: null
    });

    emberApp.Department  = emberApp.BaseObject.extend({
        departmentId: null,
        facultyId: null,
        facultytitle: null,
        title: null,
        description: null
    });

    emberApp.Profile  = emberApp.BaseObject.extend({
        profileId: null,
        firstName: null,
        lastName: null,
        sex: null,
        about: null,
        email: null,
        password: null,
        phone:null,
        roleId: null,
        departmentId:null,
        authToken:null,
        isAdministrator: Ember.computed(function() {
            return this.get('roleId') == 1;
        }).property('roleId')
    });

    emberApp.Message  = Ember.Object.extend({
        messageId: null,
        lastMessageDate: null,
        participants: [],
        participant1: Ember.computed(function() {
            return this.get('participants')[0];
        }).property('participants'),
        participant2: Ember.computed(function() {
            return this.get('participants')[1];
        }).property('participants')
    });

    emberApp.MessageDiscussion  = Ember.Object.extend({
        messageDiscussionId: null,
        messageId: null,
        note: null,
        date: null,
        posterId:null,
        isMe: Ember.computed(function() {
            return this.get('posterId') == emberApp.get('auth.profileId');
        }).property('posterId')
    });

    emberApp.Post  = Ember.Object.extend({
        postId: null,
        postDate: null,
        content: null,
        contentType: null,
        ownerId: null,
        ownername:null,

        isMe: Ember.computed(function() {
            return this.get('ownerId') == emberApp.get('auth.profileId');
        }).property('ownerId'),

        isTextContent: Ember.computed(function() {
            return this.get('contentType') == 1;
        }).property('contentType')
    });

    emberApp.PostDiscussion  = Ember.Object.extend({
        postDiscussionId: null,
        postId: null,
        note: null,
        date: null,
        poster:null
    });
    
    emberApp.ChatDiscussion  = Ember.Object.extend({
        chatDiscussionId: null,
        note: null,
        date: null,
        departmentId:null,
        profileId:null,

        isMe: Ember.computed(function() {
            return this.get('profileId') == emberApp.get('auth.profileId');
        }).property('profileId')
    });
    
    emberApp.AccountModel  = Ember.Object.extend({
        departmentId:null,
        firstName: null,
        lastName: null,
        sex: null,
        about: null,
        email: null,
        password: null,
        password2: null
    });
})(window.Initialzr)
