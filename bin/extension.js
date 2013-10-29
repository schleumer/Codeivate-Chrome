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

        Extension.prototype.request = function (updateFunction) {
            console.log('requesting from server');
            var request = new XMLHttpRequest();
            request.onreadystatechange = function (xhr) {
                var response = xhr.srcElement;
                console.dir(xhr);
                if (response.readyState === 4) {
                    console.dir(response);
                    updateFunction(response);
                }
            };
            request.open("GET", this.baseUrl + this.userName + ".json", true);
            request.send();
        };

        Extension.prototype.authenticate = function (authenticateFunction) {
            console.log('authenticating');

              var _this = this;
              _this.request(authenticateFunction);
        };

        Extension.prototype.update = function () {

            this.request(function(){
                var _this = this;
                if (request.status === 200) {
                            var data = JSON.parse(request.responseText);
                            var profile = new Codeivate.User(data);
                            _this.updateExtension(profile);
                } else {
                    console.error("status code: " + request.status);
                }                
            });
        };

        Extension.prototype.updateExtension = function (profile) {
            var _this = this;
            chrome.browserAction.setBadgeText({
                text: profile.level.toString()
            });
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
            this.isCoding = data['programming_now'];
        }
        return User;
    })();
    Codeivate.User = User;
})(Codeivate || (Codeivate = {}));
