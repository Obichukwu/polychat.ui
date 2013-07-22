(function (emberApp) {
    emberApp.AdminFacultiesController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['title'],
        sortAscending: true,

        dataLoaded: false,
        editTitle: null,
        editDescription: null
    });

    emberApp.AdminDepartmentsController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['title'],
        sortAscending: true,
        faculties: [],

        dataLoaded: false,
        editFacultyId: null,
        editTitle: null,
        editDescription: null
    });

    emberApp.AdminProfilesController = Ember.ArrayController.extend({
        content: [],
        sortProperties: ['firstName', 'lastName'],
        sortAscending: true,

        dataLoaded: false
    });
})(window.Initialzr)