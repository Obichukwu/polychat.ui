(function (emberApp) {

    emberApp.Router.map(function () {
        this.route('about');

        this.resource('user', { path: '/user' }, function () {
            this.route('password');
        });

        this.route('feeds');
        this.resource('messages', function () {
            this.route('message', { path: '/message/:discussion_id' });
        });
        this.resource('friends', function () {
            this.route('friend', { path: '/friend/:profile_id' });
        });
        this.resource('chats', function () {
            this.route('chat', { path: '/chat/:chatroom_id' });
        });

        this.resource('admin', function () {
            this.route('faculties');
            this.route('departments');
            this.route('profiles');
        });
    });

    emberApp.ApplicationRoute = Ember.Route.extend({
        events: {
            logout: function () {
                this.set('controller.user', null);
                Initialzr.database.removeItem('UserProfile');
                this.transitionTo("index");
            }
        }
    })

    emberApp.IndexRoute = Ember.Route.extend({
        enter: function () {
            var auth = emberApp.get('auth');
            if (!Ember.isEmpty(auth)) {
                if (!Ember.isEmpty(auth.get('profileId')) && !Ember.isEmpty(auth.get('authToken'))) {
                    if (auth.get('roleId') === 1) {
                        this.transitionTo("admin.faculties");
                    }
                    else {
                        this.transitionTo("feeds");
                    }
                }
            }
        },
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'account');

            controller.set('content', emberApp.AccountModel.create());

            emberApp.dataStore.loginReadObject().then(function (result) {
                var dep = [];
                result.forEach(function (item) {
                    dep.pushObject(Ember.Object.create({ title: item.title, id: item.departmentId }));
                });
                controller.set('departments', dep)
            });
        },
        events: {
            easyLogin: function (type) {
                loginValue = "";
                if (type === 1) {
                    loginValue = '{"profileId":2,"firstName":"Christabel","lastName":"Ika","sex":"female","about":"Fun loving and high spirited girl","email":"ika@polychat.com","password":"student","roleId":1,"departmentId":1,"authToken":"aWthQHBvbHljaGF0LmNvbTpzdHVkZW50"}';
                } else {
                    loginValue = '{"profileId":2,"firstName":"Christabel","lastName":"Ika","sex":"female","about":"Fun loving and high spirited girl","email":"ika@polychat.com","password":"student","roleId":2,"departmentId":1,"authToken":"aWthQHBvbHljaGF0LmNvbTpzdHVkZW50"}';
                }

                emberApp.set('auth', emberApp.Profile.create($.parseJSON(loginValue)));
                Initialzr.database.setItem('UserProfile', loginValue);
                if (emberApp.get('auth.roleId') === 1) {
                    this.transitionTo("admin.faculties");
                }
                else {
                    this.transitionTo("feeds");
                }
            },
            login: function () {
                var model = this.get('controller.content');
                var isError = false;
                if (Ember.isEmpty(model.get('email'))) {
                    model.set('emailError', true);
                    isError = true;
                } else { model.set('emailError', false); }
                if (Ember.isEmpty(model.get('password'))) {
                    model.set('passwordError', true);
                    isError = true;
                } else { model.set('passwordError', false); }

                if (isError) {
                    return;
                }
                var self = this;
                emberApp.dataStore.loginObject(model.get('email'), model.get('password')).then(function (result) {
                    emberApp.set('auth', emberApp.Profile.create(result));
                    Initialzr.database.setItem('UserProfile', JSON.stringify(result));
                    if (result.roleId === 1) {
                        self.transitionTo("admin.faculties");
                    }
                    else {
                        self.transitionTo("feeds");
                    }
                });
            },
            register: function (model) {
                var model = this.get('controller.content');

                var isError = false;
                if (Ember.isEmpty(model.get('email'))) {
                    model.set('emailError', true);
                    isError = true;
                } else { model.set('emailError', false); }

                if (Ember.isEmpty(model.get('password'))) {
                    model.set('passwordError', true);
                    isError = true;
                } else { model.set('passwordError', false); }

                if (Ember.isEmpty(model.get('password2'))) {
                    model.set('password2Error', true);
                    isError = true;
                } else { model.set('password2Error', false); }
                //Password and Confirm password must match
                if (model.get('password') !== model.get('password2')) {
                    model.set('password2Error', true);
                    isError = true;
                }

                if (Ember.isEmpty(model.get('departmentId')) || model.get('departmentId') < 0) {
                    model.set('departmentIdError', true);
                    isError = true;
                } else { model.set('departmentIdError', false); }

                if (Ember.isEmpty(model.get('firstName'))) {
                    model.set('firstNameError', true);
                    isError = true;
                } else { model.set('firstNameError', false); }

                if (Ember.isEmpty(model.get('lastName'))) {
                    model.set('lastNameError', true);
                    isError = true;
                } else { model.set('lastNameError', false); }

                if (Ember.isEmpty(model.get('sex'))) {
                    model.set('sexError', true);
                    isError = true;
                } else { model.set('sexError', false); }

                if (Ember.isEmpty(model.get('about'))) {
                    model.set('aboutError', true);
                    isError = true;
                } else { model.set('aboutError', false); }

                if (isError) {
                    return;
                }

                var self = this;
                this.get('datastore').loginCreateObject(model).then(function (result) {
                    emberApp.set('auth', emberApp.Profile.create(result));
                    self.transitionToRoute("feeds");
                });
            }
        }

    });

    emberApp.AuthRoute = Ember.Route.extend({
        enter: function () {
            var auth = emberApp.get('auth');
            if (Ember.isEmpty(auth)) {
                this.transitionTo('index');
            } else {
                if (Ember.isEmpty(auth.get('profileId')) || Ember.isEmpty(auth.get('authToken'))) {
                    this.transitionTo('index');
                }
            }
        }
    });

    emberApp.UsersIndexRoute = emberApp.AuthRoute.extend({

    });
    emberApp.UsersPasswordRoute = emberApp.AuthRoute.extend({});

    emberApp.FeedsRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'post');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Post.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        events: {
            postNew: function () {
                // do validation
                var post = this.get('controller.newPost');

                var post = emberApp.Post.create();
                post.set('content', this.get('controller.newPost'));
                post.set('postDate', new Date());
                post.set('contentType', 1);

                this.set('controller.dataLoaded', true);
                this.get("controller.content").pushObject(post);

                this.set('controller.newPost', '');
            }

        }
    });

    emberApp.MessagesIndexRoute = emberApp.AuthRoute.extend({});
    emberApp.MessagesMessageRoute = emberApp.AuthRoute.extend({});

    emberApp.FriendsIndexRoute = emberApp.AuthRoute.extend({});
    emberApp.FriendsFriendRoute = emberApp.AuthRoute.extend({});

    emberApp.ChatsIndexRoute = emberApp.AuthRoute.extend({});
    emberApp.ChatsChatroomRoute = emberApp.AuthRoute.extend({});


    emberApp.AdminFacultiesRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'faculty');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Faculty.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        events: {
            create: function () {
                var ob = emberApp.Faculty.create();
                ob.set('facultyId', 0);
                ob.set('isEditing', true);

                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                this.get('controller.content').pushObject(ob);
            },
            edit: function (model) {
                this.set('controller.editTitle', model.get('title'));
                this.set('controller.editDescription', model.get('description'));

                model.set('isEditing', true);
            },
            cancel: function (model) {
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                if (model.get('facultyId') > 0)
                    model.set('isEditing', false);
                else
                    this.get('controller.content').removeObject(model);
            },
            save: function (model) {
                model.set('isEditing', false);

                model.set('title', this.get('controller.editTitle'));
                model.set('description', this.get('controller.editDescription'));

                if (model.get('facultyId') > 0)
                    emberApp.dataStore.update(model.get('facultyId'), model);
                else {
                    var self = this;
                    emberApp.dataStore.create(model).then(function (result) {
                        self.get("controller.content").pushObject(emberApp.Faculty.create(result));
                    });
                    this.get('controller.content').removeObject(model);
                }
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

            },
            remove: function (model) {
                emberApp.dataStore.deleteItem(model.get('facultyId'));
                this.get('content').removeObject(model);
            }
        }
    });
    emberApp.AdminDepartmentsRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'faculty');
            emberApp.dataStore.read('').then(function (result) {
                var fac = [];
                result.forEach(function (item) {
                    fac.pushObject(Ember.Object.create({ title: item.title, id: item.facultyId }));
                });
                controller.set("faculties", dataItems);
            });
            emberApp.dataStore.set('store', 'department');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Department.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        events: {
            create: function () {
                var ob = emberApp.Department.create();
                ob.set('departmentId', 0);
                ob.set('isEditing', true);

                this.set('controller.editFacultyId', '');
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                this.get('controller.content').pushObject(ob);
            },
            edit: function (model) {
                this.set('controller.editFacultyId', model.get('facultyId'));
                this.set('controller.editTitle', model.get('title'));
                this.set('controller.editDescription', model.get('description'));

                model.set('isEditing', true);
            },
            cancel: function (model) {
                this.set('controller.editFacultyId', '');
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                if (model.get('departmentId') > 0) {
                    model.set('isEditing', false);
                } else {
                    this.get('controller.content').removeObject(model);
                }
            },
            save: function (model) {
                model.set('isEditing', false);

                model.set('facultyId', this.get('editFacultyId'));
                model.set('title', this.get('editTitle'));
                model.set('description', this.get('editDescription'));

                this.set('editFacultyId', '');
                this.set('editTitle', '');
                this.set('editDescription', '');

                if (model.get('departmentId') > 0)
                    emberApp.dataStore.update(model.get('departmentId'), model);
                else {
                    var self = this;
                    emberApp.dataStore.create(model).then(function (result) {
                        self.get("controller.content").pushObject(emberApp.Department.create(result));
                    });
                    this.get('controller.content').removeObject(model);
                }
            },
            remove: function (model) {
                emberApp.dataStore.deleteItem(model.get('departmentId'));
                this.get('controller.content').removeObject(model);
            }
        }
    });
    emberApp.AdminProfilesRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'faculty');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Faculty.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        events: {
            create: function () {
                var ob = emberApp.Faculty.create();
                ob.set('facultyId', 0);
                ob.set('isEditing', true);

                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                this.get('controller.content').pushObject(ob);
            },
            edit: function (model) {
                this.set('controller.editTitle', model.get('title'));
                this.set('controller.editDescription', model.get('description'));

                model.set('isEditing', true);
            },
            cancel: function (model) {
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

                if (model.get('facultyId') > 0)
                    model.set('isEditing', false);
                else
                    this.get('controller.content').removeObject(model);
            },
            save: function (model) {
                model.set('isEditing', false);

                model.set('title', this.get('controller.editTitle'));
                model.set('description', this.get('controller.editDescription'));

                if (model.get('facultyId') > 0)
                    emberApp.dataStore.update(model.get('facultyId'), model);
                else {
                    var self = this;
                    emberApp.dataStore.create(model).then(function (result) {
                        self.get("controller.content").pushObject(emberApp.Faculty.create(result));
                    });
                    this.get('controller.content').removeObject(model);
                }
                this.set('controller.editTitle', '');
                this.set('controller.editDescription', '');

            },
            remove: function (model) {
                emberApp.dataStore.deleteItem(model.get('facultyId'));
                this.get('content').removeObject(model);
            }
        }
    });

    emberApp.ApplicationView = Em.View.extend({
        template: 'application',
        didInsertElement: function () {
            this.$('a.toggle-menu').on('click', function (e) {
                var el = $(this).parents('#header').siblings('.wrapper').find('.inner');
                if (el.hasClass('show-menu')) {
                    el.removeClass('show-menu');
                } else {
                    el.addClass('show-menu');
                }
            })
        }
    });
})(window.Initialzr);