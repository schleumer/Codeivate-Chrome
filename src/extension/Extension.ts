module Codeivate {

	export class Extension {

		userName: string;
		updateInterval: number = 10000;
		updateIntervalToken: number;
		baseUrl: string = "http://codeivate.com/users/";
		settings: Codeivate.Settings;

		constructor(name: string) {
			this.userName = name;
			if (!localStorage['settings']) {
				this.settings = new Codeivate.Settings();
				this.settings.codingColor = [125,255,125, 255];
				this.settings.nonCodingColor = [255,95,95, 255];
				this.settings.notificationLangLevel = false;
				this.settings.notificationStoppedCoding = false;
				this.settings.notificationHourGained = false;



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

		cleanup(): void {
			delete localStorage['lastProfile'];
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

		notifyUser(title: string, message: string): void {
			chrome.notifications.create("", {
				type: "basic",
				title: title,
				message: message,
				iconUrl: "icon256.png",
			}, function() {});
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
			if (!localStorage['lastProfile']) {
				localStorage['lastProfile'] = JSON.stringify(profile);
			}
			//cast the last profile from object to Codeivate.User
			var lastProfile = <Codeivate.User> JSON.parse(localStorage['lastProfile']);

			/**
			 * Notifications, maybe this logic should be refactored elsewhere..
			 */


			if (this.settings.notificationStoppedCoding && profile.isCoding === false && lastProfile.isCoding === true) {
				this.notifyUser('Stopped programming!?', 'You should probably get back into it..');
			}

			if(this.settings.notificationLangLevel) {
				for (var k in profile.languages) {
					var language = profile.languages[k];
					var oldLanguage = <Codeivate.Language> lastProfile.languages[k];
					if((language.level - oldLanguage.level) > 0){
						console.log(language.name + ":" + (language.level - oldLanguage.level));
						if( (Math.floor(language.level) - Math.floor(oldLanguage.level)) > 0) {
							//you have gained a level
							this.notifyUser('You gained a level in ' + language.name, 'Welcome to level ' + Math.floor(language.level));
						}
					}
				}
			}

			if(this.settings.notificationHourGained && (profile.hoursSpent - lastProfile.hoursSpent) > 0) {
				this.notifyUser('+1 hour', 'You have now programmed for ' + profile.hoursSpent + "hours");
			}


			if (profile.isCoding === true) {
				chrome.browserAction.setBadgeBackgroundColor(
					{color: this.settings.codingColor});
			} else {
				chrome.browserAction.setBadgeBackgroundColor(
					{color: this.settings.nonCodingColor});
			}
			//preserver current profile for level up
			localStorage['lastProfile'] = JSON.stringify(profile);
		}



	}

}