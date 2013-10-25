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

        Extension.prototype.update = function () {
            var _this = this;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function (req) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var data = JSON.parse(request.responseText);
                        var profile = new Codeivate.User(data);
                        _this.updateExtension(profile);
                    } else {
                        console.error("status code: " + request.status);
                    }
                }
            };
            request.open("GET", this.baseUrl + this.userName + ".json", true);
            request.send();
        };

        Extension.prototype.updateExtension = function (profile) {
            var _this = this;
            chrome.browserAction.setBadgeText({
                text: profile.level.toString()
            });
            var set = function (eId, value) {
                _this.doc.getElementById(eId).innerText = value.toString();
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
        };
        return Extension;
    })();
    Codeivate.Extension = Extension;
})(Codeivate || (Codeivate = {}));
var Codeivate;
(function (Codeivate) {
    var User = (function () {
        function User(data) {
            //..parsing...
            this.level = Math.floor(data['level']);
            this.name = data['name'];
            this.signatureUrl = "http://www.codeivate.com/users/" + this.name + "/signature.png";
            this.timeSpent = (data['time_spent'] / 60 / 60).toFixed(2) + " Hours";
            this.currentLanguage = data['current_language'];
        }
        return User;
    })();
    Codeivate.User = User;
})(Codeivate || (Codeivate = {}));
