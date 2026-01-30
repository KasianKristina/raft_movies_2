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

export type MovieViewType = {
	is_watched: boolean;
	user_id: string;
};

export type MovieWithViewsType = Movie & {
	views: MovieViewType[];
};

export type SuggestionMovieType = SuggestionMovie & {
	movie: Movie & {
		id: string;
		name: string;
		rating: number;
		views: MovieViewType[];
		img_src: string | null;
	};
};

export type SuggestionWithRelationsType = Omit<Suggestion, 'author_id'> & {
	author: User;
	movies: SuggestionMovieType[];
};
