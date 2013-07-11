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

    emberApp.Profile  = Ember.Object.extend({
        profileId: null,
        firstName: null,
        lastName: null,
        sex: null,
        about: null,
        email: null,
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
        participant1: null,
        participant2: null
    });

    emberApp.MessageDiscussion  = Ember.Object.extend({
        messageDiscussionId: null,
        note: null,
        date: null,
        poster:null
    });

    emberApp.Post  = Ember.Object.extend({
        postId: null,
        postDate: null,
        content: null,
        contentType: null,
        ownerId: null,

        isTextContent: Ember.computed(function() {
            return this.get('contentType') == 1;
        }).property('contentType')
    });

    emberApp.PostDiscussion  = Ember.Object.extend({
        postDiscussionId: null,
        note: null,
        date: null,
        poster:null
    });
    
    emberApp.ChatDiscussion  = Ember.Object.extend({
        chatDiscussionId: null,
        note: null,
        date: null
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
