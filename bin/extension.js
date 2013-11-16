var Codeivate;
(function (Codeivate) {
    var Extension = (function () {
        function Extension(name) {
            this.updateInterval = 10000;
            this.baseUrl = "http://codeivate.com/users/";
            this.userName = name;
            if (!localStorage['settings']) {
                this.settings = new Codeivate.Settings();
                this.settings.codingColor = [125, 255, 125, 255];
                this.settings.nonCodingColor = [255, 95, 95, 255];
                this.settings.notificationLangLevel = true;
                this.settings.notificationStoppedCoding = true;
                this.settings.notificationHourGained = true;

                localStorage['settings'] = JSON.stringify(this.settings);
            }
            this.settings = JSON.parse(localStorage['settings']);
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

        Extension.prototype.cleanup = function () {
            delete localStorage['lastProfile'];
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

        Extension.prototype.notifyUser = function (title, message) {
            console.debug('notifying use:' + message);
            chrome.notifications.create("", {
                type: "basic",
                title: title,
                message: message,
                iconUrl: "icon256.png"
            }, function () {
            });
        };

        Extension.prototype.updateExtension = function (profile) {
            //set the icon badge to the level
            chrome.browserAction.setBadgeText({
                text: profile.level.toString()
            });

            if (localStorage['settings']) {
                this.settings = JSON.parse(localStorage['settings']);
            }

            if (!localStorage['lastProfile']) {
                localStorage['lastProfile'] = JSON.stringify(profile);
            }

            //cast the last profile from object to Codeivate.User
            var lastProfile = JSON.parse(localStorage['lastProfile']);

            if (this.settings.notificationStoppedCoding && profile.isCoding === false && lastProfile.isCoding === true) {
                this.notifyUser('Stopped programming!?', 'You should probably get back into it..');
            }

            if (this.settings.notificationLangLevel) {
                for (var k in profile.languages) {
                    var language = profile.languages[k];
                    var oldLanguage = lastProfile.languages[k];
                    if ((language.level - oldLanguage.level) > 0) {
                        console.log(language.name + ":" + (language.level - oldLanguage.level));
                        if ((Math.floor(language.level) - Math.floor(oldLanguage.level)) > 0) {
                            //you have gained a level
                            this.notifyUser('You gained a level in ' + language.name, 'Welcome to level ' + Math.floor(language.level));
                        }
                    }
                }
            }

            if (this.settings.notificationHourGained && (profile.hoursSpent - lastProfile.hoursSpent) > 0) {
                this.notifyUser('+1 hour', 'You have now programmed for ' + profile.hoursSpent + "hours");
            }

            if (profile.isCoding === true) {
                chrome.browserAction.setBadgeBackgroundColor({ color: this.settings.codingColor });
            } else {
                chrome.browserAction.setBadgeBackgroundColor({ color: this.settings.nonCodingColor });
            }

            //preserver current profile for level up
            localStorage['lastProfile'] = JSON.stringify(profile);
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
    var Settings = (function () {
        function Settings() {
            this.notificationLangLevel = localStorage['notificationLangLevel'];
            this.notificationStoppedCoding = localStorage['notificationStoppedCoding'];
            this.notificationHourGained = localStorage['notificationHourGained'];
        }
        return Settings;
    })();
    Codeivate.Settings = Settings;
})(Codeivate || (Codeivate = {}));
var Codeivate;
(function (Codeivate) {
    var User = (function () {
        function User(data) {
            this.languages = {};
            //..parsing...
            this.level = Math.floor(data['level']);
            this.name = data['name'];
            this.signatureUrl = "http://www.codeivate.com/users/" + this.name + "/signature.png";
            this.timeSpent = (data['time_spent'] / 60 / 60).toFixed(2) + " Hours";
            this.hoursSpent = Math.floor(data['time_spent'] / 60 / 60);
            this.currentLanguage = data['current_language'];
            this.isCoding = data['programming_now'];
            this.isStreaking = data['streaking_now'];
            for (var l in data['languages']) {
                //raw langauge data
                var rLang = data['languages'][l];

                //parsed data
                var lang = new Codeivate.Language(l, rLang['level'], rLang['points']);

                //add it to the languages
                this.languages[l] = lang;
            }
        }
        return User;
    })();
    Codeivate.User = User;
})(Codeivate || (Codeivate = {}));
