module Codeivate {

	export class Extension {

		userName: string;
		updateInterval: number = 10000;
		updateIntervalToken: number;
		baseUrl: string = "http://codeivate.com/users/";
		doc: any;
		lastUser: Codeivate.User;
		settings: Codeivate.Settings;

		constructor(name: string, doc: any) {
			this.userName = name;
			this.doc = doc;
			if (!localStorage['settings']) {
				this.settings = new Codeivate.Settings();
				this.settings.codingColor = [125,255,125, 255];
				this.settings.nonCodingColor = [255,95,95, 255];
				localStorage['settings'] = JSON.stringify(this.settings);
			}
			this.settings = <Codeivate.Settings> JSON.parse(localStorage['settings']);
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
			//set the icon badge to the level
			chrome.browserAction.setBadgeText({
				text: profile.level.toString()
			});
			//check if settings changed, if so load them.
			if (localStorage['settings']) {
				this.settings = <Codeivate.Settings> JSON.parse(localStorage['settings']);
			}
			//use current porfile if there is no previous
			if (!localStorage['last_user']) {
				localStorage['last_user'] = JSON.stringify(profile);
			}
			//cast the last profile from object to Codeivate.User
			var lastProfile = <Codeivate.User> JSON.parse(localStorage['last_user']);
			if (profile.isCoding === false && lastProfile.isCoding === true) {
				var notification = webkitNotifications.createNotification(
					'/icon.png',
					'Stopped programming!?',
					'You should probably get back into it..'
				);
				notification.show();
			}
			//check for level changes
			profile.languages.forEach((language, index) => {
				var oldLangauge = lastProfile.languages[index];
				if ((language.level - oldLangauge.level) > 0) {
					var notification = webkitNotifications.createNotification(
						'/icon.png',
						'You gained a level in ' + language.name,
						'Welcome to level ' + Math.floor(language.level)
					);
					notification.show();
				}
			});
			console.log(this.settings);
			if (profile.isCoding === true) {
				chrome.browserAction.setBadgeBackgroundColor(
					{color: this.settings.codingColor});
			} else {
				chrome.browserAction.setBadgeBackgroundColor(
					{color: this.settings.nonCodingColor});
			}
			var setValue = (id: string, value: any) => {
				if (value === false) value = "None";
				if (this.doc) this.doc.getElementById(id).innerText = value.toString();
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