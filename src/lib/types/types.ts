interface BaseMovie {
	id: string;
	name: string;
	score: string;
	imgSrc?: string;
}

export interface MovieCardInterface extends BaseMovie {
	isAlreadyWatched: boolean;
}

export interface SuggestionInterface {
	id: string;
	name: string;
	description: string;
	author: string;
	authorId: string;
	countAlreadyWatched: number;
	countAll: number;
}

export interface MovieInterface extends BaseMovie {
	description: string;
	genres: string[];
	number_of_seasons: number;
	year_of_production: number;
	country: string;
	film_director: string;
	time: number;
	backgroundImgSrc: string;
}
