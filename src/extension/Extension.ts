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
			if (localStorage['last_user'] !== undefined) {
				var lastProfile = new Codeivate.User(JSON.parse(localStorage['last_user']));

				// stopped programming
				if (profile.isCoding === false && lastProfile.isCoding === true) {
					var notification = webkitNotifications.createNotification(
						'/icon.png', // icon url - can be relative
						'Stopped programming!?', // notification title
						'You should probably get back into it..' // notification body text
					);
					notification.show();
				}

				profile.languages.forEach((l, i) => {
					var curr = l;
					var old = lastProfile.languages[i];
					if ((curr.level - old.level) > 0) {
						console.log(l.name + ":" + (curr.level - old.level));
						if ((Math.floor(curr.level) - Math.floor(old.level)) > 0) {
							//you have gained a level
							var notification = webkitNotifications.createNotification(
								'/icon.png', // icon url - can be relative
								'You gained a level in ' + l.name, // notification title
								'Welcome to level ' + Math.floor(curr.level)
							);
							notification.show();
						}
					}
				});
			}
			var color = [];
			if (profile.isCoding === true) {
				color = [125,255,125,255];
			} else {
				color = [255,95,95,255];
			}
			chrome.browserAction.setBadgeBackgroundColor({color: color});
			var set = (id: string, value: any) => {
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
				set(field, profile[field]);
			});
			localStorage['last_user'] = JSON.stringify(profile);
		}

	}

}