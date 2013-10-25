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
        currentEdit: null,
        gender: ["Male", "Female"],
        roles: [Ember.Object.create({ title: 'Administrator', id: 1 }),
            Ember.Object.create({ title: 'User', id: 2 })],
        departments: [],

        dataLoaded: false
    });
})(window.Initialzr)