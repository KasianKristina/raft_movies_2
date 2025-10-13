import type { Movie, Suggestion, SuggestionMovie, User } from '@prisma/client';

export type MovieCardType = Movie & {
	isAlreadyWatched: boolean;
};

export type SuggestionWithDetailsType = Suggestion & {
	movies: Movie[];
	author: User;
};

export type SuggestionMovieViewsType = SuggestionMovie & {
	movie: Movie;
};
