import type { Movie, Suggestion, SuggestionMovie, User } from '@prisma/client';

export interface MovieCardInterface extends Movie {
	isAlreadyWatched: boolean;
}

export interface SuggestionInterface extends Suggestion {
	movies: Movie[];
	author: User;
}

export interface SuggestionMovieViews extends SuggestionMovie {
	movie: Movie;
}
