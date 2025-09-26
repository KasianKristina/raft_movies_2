interface BaseMovie {
	id: string;
	name: string;
	rating: string;
	imgSrc?: string;
}

export interface MovieCardInterface extends BaseMovie {
	isAlreadyWatched: boolean;
}

export interface SuggestionInterface {
	id: string;
	name: string;
	description: string;
	author: AuthorInterface;
	movies: BaseMovie[];
}

export interface MovieInterface extends BaseMovie {
	description: string;
	genres: string[];
	number_of_seasons: number;
	year_of_production: number;
	countries: string[];
	film_director: string;
	duration: number;
	backgroundImgSrc: string;
}

export interface AuthorInterface {
	id: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
}

export interface SuggestionMovieViews {
	id: number;
	movie_id: number;
	suggestion_id: number;
	movie: BaseMovie;
}
