module Codeivate {

	export class Extension {

		userName: string;
		updateInterval: number = 30000;
		updateIntervalToken: number;
		baseUrl: string = "http://codeivate.com/users/";
		doc: any;
		lastUser: Codeivate.User;

		constructor(name: string, doc: any) {
			this.userName = name;
			this.doc = doc;
		}

		start(): void {
			this.updateIntervalToken = setInterval(() => {
				this.update();
			}, this.updateInterval);
		}

		stop(): void {
			clearInterval(this.updateIntervalToken);
		}

		request(cb: (res, status) => void): void {
			var request = new XMLHttpRequest();
			request.onreadystatechange = (req) => {
				if (request.readyState === 4) {
					cb(request.responseText, request.status);
				}
			}
			request.open("GET", this.baseUrl + this.userName+".json", true);
			request.send();
		}

		update(): void {
			this.request((res, status) => {
				if (status === 200) {
					var data = JSON.parse(res);
					var profile = new Codeivate.User(data);
					this.updateExtension(profile);
				} else {
					console.error("status code: "+status);
				}
			});
		}

		updateExtension(profile: Codeivate.User): void {
			chrome.browserAction.setBadgeText({
				text: profile.level.toString()
			});
			//use current porfile if there is no previous
			if (localStorage['last_user'] !== undefined) {
				localStorage['last_user'] = JSON.stringify(profile);
			}
			var lastProfile = <Codeivate.User> JSON.parse(localStorage['last_user']);
			if (profile.isCoding === false && lastProfile.isCoding === true) {
				var notification = webkitNotifications.createNotification('/icon.png',
					'Stopped programming!?',
					'You should probably get back into it..'
				);
				notification.show();
			}
			//check for level changes
			profile.languages.forEach((language, i) => {
				var oldLangauge = lastProfile.languages[i];
				if ((language.level - oldLangauge.level) > 0) {
					var notification = webkitNotifications.createNotification('/icon.png',
						'You gained a level in ' + language.name, // notification title
						'Welcome to level ' + Math.floor(language.level)
					);
					notification.show();
				}
			});
			var color = [];
			if (profile.isCoding === true) {
				color = [125,255,125,255];
			} else {
				color = [255,95,95,255];
			}
			chrome.browserAction.setBadgeBackgroundColor({color: color});
			var setValue = (id: string, value: any) => {
				if (value === false) value = "None";
				this.doc.getElementById(id).innerText = value.toString();
			};
			var fields = [
				"name",
				"level",
				"currentLanguage",
				"timeSpent"
			];
			fields.forEach((field) => {
				setValue(field, profile[field]);
			});
			//preserver current profile for level up
			localStorage['last_user'] = JSON.stringify(profile);
		}

	}

}