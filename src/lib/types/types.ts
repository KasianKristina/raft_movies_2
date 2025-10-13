import type { Movie, Suggestion, SuggestionMovie, User } from '@prisma/client';

export interface MovieCardInterface extends Movie {
	isAlreadyWatched: boolean;
}

export interface SuggestionInterface extends Suggestion {
	movies: Movie[];
	author: User;
}

export interface SuggestionMovieViews extends SuggestionMovie {
	id: number;
	movie_id: number;
	suggestion_id: number;
	movie: Movie;
}
