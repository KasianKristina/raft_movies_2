export interface MovieCardInterface {
	id: string;
	name: string;
	score: string;
	isAlreadyWatched: boolean;
	imgSrc?: string;
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
