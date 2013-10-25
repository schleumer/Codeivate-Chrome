module Codeivate {
	
	export class User {

		level: number;
		name: string;
		signatureUrl: string;
		timeSpent: string;
		currentLanguage: string;
		isCoding: boolean;

		constructor(data: {}) {
			//..parsing...
			this.level = Math.floor(data['level']);
			this.name = data['name'];
			this.signatureUrl = "http://www.codeivate.com/users/"+this.name+"/signature.png";
			this.timeSpent = (data['time_spent'] / 60 / 60).toFixed(2) + " Hours";
			this.currentLanguage = data['current_language'];
			this.isCoding = data['programming_now'];
		}

	}

}