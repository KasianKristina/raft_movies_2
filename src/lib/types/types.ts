import type { Movie, Suggestion, SuggestionMovie, User } from '@prisma/client';

export type MovieCardType = Pick<Movie, 'name' | 'id' | 'rating'> & {
	isAlreadyWatched: boolean;
};

export type SuggestionWithDetailsType = Omit<
	Suggestion & {
		movies: Movie[];
		author: User;
	},
	'description' | 'author_id'
>;

export type SuggestionMovieViewsType = Omit<
	SuggestionMovie & { movie: Movie },
	'suggestion_id' | 'movie_id'
>;
