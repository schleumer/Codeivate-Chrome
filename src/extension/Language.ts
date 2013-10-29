module Codeivate {
	
	export class Language {

		name: string;
		level: number;
		points: number;

		constructor(name: string, level: number, points: number) {
			this.name = name;
			this.level = level;
			this.points = points;
		}

	}

}