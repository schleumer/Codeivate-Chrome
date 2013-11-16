module Codeivate {

	export class Settings {

		codingColor: number[];
		nonCodingColor: number[];
		notificationLangLevel: boolean;
		notificationStoppedCoding: boolean;
		notificationHourGained: boolean;

		constructor(){
			this.notificationLangLevel = localStorage['notificationLangLevel'];
			this.notificationStoppedCoding = localStorage['notificationStoppedCoding'];
			this.notificationHourGained = localStorage['notificationHourGained'];

		}


	}

}