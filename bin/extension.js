var Codeivate;
(function (Codeivate) {
    var Extension = (function () {
        function Extension(name, doc) {
            this.updateInterval = 30000;
            this.baseUrl = "http://codeivate.com/users/";
            this.userName = name;
            this.doc = doc;
        }
        Extension.prototype.start = function () {
            var _this = this;
            this.updateIntervalToken = setInterval(function () {
                _this.update();
            }, this.updateInterval);
        };

        Extension.prototype.stop = function () {
            clearInterval(this.updateIntervalToken);
        };

        Extension.prototype.request = function (cb) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function (req) {
                if (request.readyState === 4) {
                    cb(request.responseText, request.status);
                }
            };
            request.open("GET", this.baseUrl + this.userName + ".json", true);
            request.send();
        };

        Extension.prototype.update = function () {
            var _this = this;
            this.request(function (res, status) {
                if (status === 200) {
                    var data = JSON.parse(res);
                    var profile = new Codeivate.User(data);
                    _this.updateExtension(profile);
                } else {
                    console.error("status code: " + status);
                }
            });
        };

        Extension.prototype.updateExtension = function (profile) {
            var _this = this;
            chrome.browserAction.setBadgeText({
                text: profile.level.toString()
            });
            if (localStorage['last_user'] !== undefined) {
                var lastProfile = new Codeivate.User(JSON.parse(localStorage['last_user']));

                if (profile.isCoding === false && lastProfile.isCoding === true) {
                    var notification = webkitNotifications.createNotification('/icon.png', 'Stopped programming!?', 'You should probably get back into it..');
                    notification.show();
                }

                profile.languages.forEach(function (l, i) {
                    var curr = l;
                    var old = lastProfile.languages[i];
                    if ((curr.level - old.level) > 0) {
                        console.log(l.name + ":" + (curr.level - old.level));
                        if ((Math.floor(curr.level) - Math.floor(old.level)) > 0) {
                            //you have gained a level
                            var notification = webkitNotifications.createNotification('/icon.png', 'You gained a level in ' + l.name, 'Welcome to level ' + Math.floor(curr.level));
                            notification.show();
                        }
                    }
                });
            }
            var color = [];
            if (profile.isCoding === true) {
                color = [125, 255, 125, 255];
            } else {
                color = [255, 95, 95, 255];
            }
            chrome.browserAction.setBadgeBackgroundColor({ color: color });
            var set = function (id, value) {
                if (value === false)
                    value = "None";
                _this.doc.getElementById(id).innerText = value.toString();
            };
            var fields = [
                "name",
                "level",
                "currentLanguage",
                "timeSpent"
            ];
            fields.forEach(function (field) {
                set(field, profile[field]);
            });
            localStorage['last_user'] = JSON.stringify(profile);
        };
        return Extension;
    })();
    Codeivate.Extension = Extension;
})(Codeivate || (Codeivate = {}));
var Codeivate;
(function (Codeivate) {
    var Language = (function () {
        function Language(name, level, points) {
            this.name = name;
            this.level = level;
            this.points = points;
        }
        return Language;
    })();
    Codeivate.Language = Language;
})(Codeivate || (Codeivate = {}));
var Codeivate;
(function (Codeivate) {
    var User = (function () {
        function User(data) {
            this.languages = [];
            //..parsing...
            this.level = Math.floor(data['level']);
            this.name = data['name'];
            this.signatureUrl = "http://www.codeivate.com/users/" + this.name + "/signature.png";
            this.timeSpent = (data['time_spent'] / 60 / 60).toFixed(2) + " Hours";
            this.currentLanguage = data['current_language'];
            this.isCoding = data['programming_now'];
            this.isStreaking = data['streaking_now'];
            for (var l in data['languages']) {
                var lang = new Codeivate.Language(l, data['languages']['level'], data['languages']['points']);
                this.languages.push(lang);
            }
        }
        return User;
    })();
    Codeivate.User = User;
})(Codeivate || (Codeivate = {}));
