import type { Movie, Suggestion, SuggestionMovie, User } from '@prisma/client';

export type MovieViewType = {
	is_watched: boolean;
	user_id: string;
	rating: number | null;
};

export type MovieWithViewsType = Movie & {
	views: MovieViewType[];
};

export type SuggestionMovieType = SuggestionMovie & {
	movie: MovieWithViewsType;
};

export type SuggestionWithRelationsType = Omit<Suggestion, 'author_id'> & {
	author: User;
	movies: SuggestionMovieType[];
};

export type RateMovieResultType = {
	userRating: number;
	movieRating: number;
};
