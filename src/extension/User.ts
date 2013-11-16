module Codeivate {

	export class User {

		level: number;
		name: string;
		signatureUrl: string;
		timeSpent: string;
		hoursSpent: number;
		currentLanguage: string;
		isCoding: boolean;
		languages: {} = {};
		isStreaking: boolean;

		constructor(data: {}) {
			//..parsing...
			this.level = Math.floor(data['level']);
			this.name = data['name'];
			this.signatureUrl = "http://www.codeivate.com/users/"+this.name+"/signature.png";
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

	}

}