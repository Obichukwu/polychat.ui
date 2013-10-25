(function (emberApp) {

    emberApp.Router.map(function () {
        this.route('about');

        this.resource('user', { path: '/user' }, function () {
            this.route('password');
        });

        this.resource('feeds', function () {
            this.route('feed', { path: '/feed/:post_id' });
        });
        this.resource('messages', function () {
            this.route('message', { path: '/message/:discussion_id' });
        });
        this.resource('friends', function () {
            this.route('friend', { path: '/friend/:discussion_id' });
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
        actions: {
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
        actions: {
            easyLogin: function (type) {
                loginValue = "";
                if (type === 1) {
                    loginValue = '{"profileId":2,"firstName":"Christabel","lastName":"Ika","sex":"Female","about":"Fun loving and high spirited girl","email":"ika@polychat.com","password":"student","roleId":1,"departmentId":1,"authToken":"aWthQHBvbHljaGF0LmNvbTpzdHVkZW50"}';
                } else {
                    loginValue = '{"profileId":2,"firstName":"Christabel","lastName":"Ika","sex":"Female","about":"Fun loving and high spirited girl","email":"ika@polychat.com","password":"student","roleId":2,"departmentId":1,"authToken":"aWthQHBvbHljaGF0LmNvbTpzdHVkZW50"}';
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
            register: function () {
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
                emberApp.dataStore.loginCreateObject(model).then(function (result) {
                    emberApp.set('auth', emberApp.Profile.create(result));
                    Initialzr.database.setItem('UserProfile', JSON.stringify(result));
                    self.transitionTo("feeds");
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

    emberApp.UserIndexRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'profile');
            var auth = emberApp.get('auth');
            controller.set("content", auth);

        },
        actions: {
            updateInfo: function () {
                var model = this.get("controller.content");

                var isError = false;
                if (Ember.isEmpty(model.get('firstName'))) {
                    this.set('controller.firstNameError', true);
                    isError = true;
                }
                if (Ember.isEmpty(model.get('lastName'))) {
                    this.set('controller.lastNameError', true);
                    isError = true;
                }
                if (Ember.isEmpty(model.get('about'))) {
                    this.set('controller.aboutError', true);
                    isError = true;
                }

                if (isError) {
                    return;
                }

                emberApp.dataStore.update(model.get('profileId'), model).then(function (result) {
                    emberApp.set('auth', emberApp.Profile.create(result));
                    Initialzr.database.setItem('UserProfile', JSON.stringify(result));
                });
            }
        }
    });
    emberApp.UserPasswordRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'profile');
            controller.set("oldPassword", '');
            controller.set("newPassword", '');
            controller.set("newPassword2", '');
        },
        actions: {
            updatePassword: function () {
                var oldPwd = this.get("controller.oldPassword");
                var newPwd = this.get("controller.newPassword");
                var newPwd2 = this.get("controller.newPassword2");

                var isError = false;
                this.set('controller.oldPasswordError', false);
                this.set('controller.newPasswordError', false);
                this.set('controller.newPasswordError2', false);

                if (Ember.isEmpty(oldPwd)) {
                    this.set('controller.oldPasswordError', true);
                    isError = true;
                }
                if (Ember.isEmpty(newPwd)) {
                    this.set('controller.newPasswordError', true);
                    isError = true;
                }
                if (Ember.isEmpty(newPwd2)) {
                    this.set('controller.newPasswordError2', true);
                    isError = true;
                }

                if (newPwd !== newPwd2) {
                    this.set('controller.newPasswordError2', true);
                    isError = true;
                }

                var auth = emberApp.get('auth');

                if (auth.get('password') !== oldPwd) {
                    this.set('controller.oldPasswordError', true);
                    isError = true;
                }

                if (isError) {
                    return;
                }

                auth.set('password', newPwd);
                emberApp.dataStore.update(auth.get('profileId'), auth).then(function (result) {
                    emberApp.set('auth', emberApp.Profile.create(result));
                    Initialzr.database.setItem('UserProfile', JSON.stringify(result));
                });
            }
        }
    });

    emberApp.FeedsIndexRoute = emberApp.AuthRoute.extend({
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
        actions: {
            navigateToDetails: function (post) {
                this.transitionTo('feeds.feed', post);
            },
            postNew: function () {
                var post = this.get('controller.newPost');

                if (Ember.isEmpty(post)) {
                    this.set('controller.newPostError', true);
                    return;
                }

                var post = emberApp.Post.create();
                post.set('content', post);
                post.set('postDate', new Date());
                post.set('contentType', 1);

                var auth = emberApp.get('auth');
                post.set('ownerId', auth.get('profileId'));

                this.set('controller.dataLoaded', true);
                this.get("controller.content").pushObject(post);

                var self = this;
                emberApp.dataStore.create(post).then(function (result) {
                    self.get('controller.content').removeObject(post);
                    self.get("controller.content").pushObject(emberApp.Post.create(result));
                });

                this.set('controller.newPost', '');
            }
        }
    });
    emberApp.FeedsFeedRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'postDiscussion');
            controller.set('content', model);
            controller.set('dataLoaded', true);
        },
        actions: {
            postComment: function () {
                var comment = this.get('controller.newComment');

                if (Ember.isEmpty(comment)) {
                    this.set('controller.newCommentError', true);
                    return;
                }

                var postDiss = emberApp.PostDiscussion.create();
                postDiss.set('postId', this.get('controller.content.postId'));
                postDiss.set('note', comment);
                postDiss.set('date', new Date());
                var auth = emberApp.get('auth');
                postDiss.set('posterId', auth.get('profileId'));

                var diss = this.get("controller.content.discussion");
                diss.pushObject(postDiss);
                emberApp.dataStore.create(postDiss).then(function (result) {
                    diss.removeObject(postDiss);
                    diss.pushObject(emberApp.PostDiscussion.create(result));
                });

                this.set('controller.newComment', '');
            }
        }
    });

    emberApp.MessagesIndexRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'message');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Message.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        actions: {
            navigateToDetails: function (post) {
                this.transitionTo('messages.message', post);
            }
        }
    });
    emberApp.MessagesMessageRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'message');
            controller.set('parentMessage', model);
            var msgId = model.get('messageId');
            emberApp.dataStore.read(msgId).then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.MessageDiscussion.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        actions: {
            sendMessage: function () {
                var message = this.get('controller.newMessage');

                if (Ember.isEmpty(message)) {
                    this.set('controller.newMessageError', true);
                    return;
                }

                var messageDiss = emberApp.MessageDiscussion.create();
                messageDiss.set('messageId', this.get('controller.parentMessage.messageId'));
                messageDiss.set('note', message);
                messageDiss.set('date', new Date());
                var auth = emberApp.get('auth');
                messageDiss.set('posterId', auth.get('profileId'));

                var diss = this.get("controller.content");
                diss.pushObject(messageDiss);
                emberApp.dataStore.create(messageDiss).then(function (result) {
                    diss.removeObject(messageDiss);
                    diss.pushObject(emberApp.MessageDiscussion.create(result));
                });

                this.set('controller.newMessage', '');
            }
            //Todo: Every 1mins update the message list.
        }
    });

    emberApp.FriendsIndexRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'department');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(Ember.Object.create({ title: item.title, id: item.departmentId }));
                });
                controller.set("departments", dataItems);
            });

            emberApp.dataStore.set('store', 'Department2');
            emberApp.dataStore.read(0).then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Profile.create(item));
                });
                controller.set("content", dataItems);
                controller.set('searchLoaded', true);
            });
        },
        actions: {
            search: function () {
                var selId = this.get('controller.selectedDepartmentId');
                if (Ember.isEmpty(selId))
                    selId = 0;

                this.set('controller.searchLoaded', false);
                emberApp.dataStore.set('store', 'Department2');

                var self = this;
                emberApp.dataStore.read(selId).then(function (result) {
                    var dataItems = [];
                    result.forEach(function (item) {
                        dataItems.pushObject(emberApp.Profile.create(item));
                    });
                    self.set("controller.content", dataItems);
                    self.set('controller.searchLoaded', true);
                });
            },
            message: function (profile) {
                var proId = profile.get('profileId');

                emberApp.dataStore.set('store', 'Message');
                var self = this;
                //Abusing the Delete Method, i am using it as a select method
                emberApp.dataStore.deleteItem(proId).then(function (result) {
                    var msg = emberApp.Message.create(result)
                    self.transitionTo('messages.message', msg);
                });
            }
        }
    });

    emberApp.ChatsIndexRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'department');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Department.create(item));
                });
                controller.set("content", dataItems);
                controller.set("dataLoaded", true);
            });
        },
        actions: {
            enterRoom: function (dept) {
                //var deptId = dept.get('departmentId');
                this.transitionTo('chats.chat', dept);
            }
        }
    });
    emberApp.ChatsChatRoute = emberApp.AuthRoute.extend({
        setupController: function (controller, model) {
            emberApp.dataStore.set('store', 'chat');
            controller.set('department', model);
            var msgId = model.get('departmentId');
            emberApp.dataStore.read(msgId).then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.ChatDiscussion.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        actions: {
            sendMessage: function () {
                var message = this.get('controller.newMessage');

                if (Ember.isEmpty(message)) {
                    this.set('controller.newMessageError', true);
                    return;
                }
                this.set('controller.newMessageError', false);

                var messageDiss = emberApp.ChatDiscussion.create();
                messageDiss.set('departmentId', this.get('controller.department.departmentId'));
                messageDiss.set('note', message);
                messageDiss.set('date', new Date());
                var auth = emberApp.get('auth');
                messageDiss.set('profileId', auth.get('profileId'));

                var diss = this.get("controller.content");
                diss.pushObject(messageDiss);
                emberApp.dataStore.create(messageDiss).then(function (result) {
                    diss.removeObject(messageDiss);
                    diss.pushObject(emberApp.ChatDiscussion.create(result));
                });

                this.set('controller.newMessage', '');
            }
            //Todo: Every 1mins update the message list.
        }
    });


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
        actions: {
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
                this.get('controller.content').removeObject(model);
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
                controller.set("faculties", fac);
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
        actions: {
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
            emberApp.dataStore.set('store', 'department');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(Ember.Object.create({ title: item.title, id: item.departmentId }));
                });
                controller.set("departments", dataItems);
            });

            emberApp.dataStore.set('store', 'profile');
            emberApp.dataStore.read('').then(function (result) {
                var dataItems = [];
                result.forEach(function (item) {
                    dataItems.pushObject(emberApp.Profile.create(item));
                });
                controller.set("content", dataItems);
                controller.set('dataLoaded', true);
            });
        },
        actions: {
            create: function () {
                var ob = emberApp.Faculty.create();
                ob.set('profileId', 0);
                ob.set('isEditing', true);
                ob.set('password', 'password');

                this.get('controller.content').pushObject(ob);

                var cpy = emberApp.Faculty.create();

                this.set('controller.currentEdit', cpy);
            },
            edit: function (model) {
                model.set('isEditing', true);

                var dtr = JSON.stringify(model)
                var cpy = Initialzr.Profile.create(Ember.$.parseJSON(dtr));

                this.set('controller.currentEdit', cpy);
            },
            cancel: function (model) {
                this.set('controller.currentEdit', null);

                if (model.get('facultyId') > 0)
                    model.set('isEditing', false);
                else
                    this.get('controller.content').removeObject(model);
            },
            save: function (model) {
                model.set('isEditing', false);

                var cpy = this.get('controller.currentEdit');
                model.set('departmentId', cpy.get('departmentId'));
                model.set('firstName', cpy.get('firstName'));
                model.set('lastName', cpy.get('lastName'));
                model.set('sex', cpy.get('sex'));
                model.set('about', cpy.get('about'));
                model.set('email', cpy.get('email'));
                model.set('phone', cpy.get('phone'));

                if (model.get('profileId') > 0)
                    emberApp.dataStore.update(model.get('profileId'), model);
                else {
                    var self = this;
                    emberApp.dataStore.create(model).then(function (result) {
                        self.get("controller.content").pushObject(emberApp.Profile.create(result));
                    });
                    this.get('controller.content').removeObject(model);
                }
                this.set('controller.currentEdit', null);

            },
            remove: function (model) {
                emberApp.dataStore.deleteItem(model.get('profileId'));
                this.get('controller.content').removeObject(model);
            }
        }
    });

    emberApp.ApplicationView = Em.View.extend({
        didInsertElement: function () {
            this.$('a.toggle-menu').on('click', this.maMenuClick);
            this.$('#nav-list').on('click', 'li a', this.maMenuClick);
        },
        maMenuClick: function (e) {
            var el = $('#header').siblings('.wrapper').find('.inner');
            if (el.hasClass('show-menu')) {
                el.removeClass('show-menu');
            } else {
                el.addClass('show-menu');
            }
        }
    });
})(window.Initialzr);