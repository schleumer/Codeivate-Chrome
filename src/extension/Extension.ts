module Codeivate {

	export class Extension {

		userName: string;
		updateInterval: number = 30000;
		updateIntervalToken: number;
		baseUrl: string = "http://codeivate.com/users/";
		doc: any;

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

		update(): void {
			var request = new XMLHttpRequest();
			request.onreadystatechange = (req) => {
				if (request.readyState === 4) {
					if (request.status === 200) {
						var data = JSON.parse(request.responseText);
						var profile = new Codeivate.User(data);
						this.updateExtension(profile);
					} else {
						console.error("status code: "+request.status);
					}
				}
			}
			request.open("GET", this.baseUrl + this.userName+".json", true);
			request.send();
		}

		updateExtension(profile: Codeivate.User): void {
			chrome.browserAction.setBadgeText({
				text: profile.level.toString()
			});
			var set = (eId: string, value: any) => {
				this.doc.getElementById(eId).innerText = value.toString();
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
		}

	}

}