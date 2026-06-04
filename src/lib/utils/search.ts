import FlexSearch from 'flexsearch';

export function createSearchIndex<T>(items: T[], getIndexText: (item: T) => string) {
	const index = new FlexSearch.Index({ tokenize: 'forward' });

	items.forEach((item, position) => {
		index.add(position, getIndexText(item));
	});

	return {
		search: (query: string): T[] => {
			if (!query.trim()) return items;
			return (index.search(query) as number[]).map((position) => items[position]);
		},
	};
}
