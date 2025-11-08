export const searchByWords = <T extends { name: string }>(items: T[], searchText: string): T[] => {
	const searchTerms = searchText
		.toLowerCase()
		.trim()
		.split(/\s+/)
		.filter((term) => term.length > 0);

	if (searchTerms.length === 0) {
		return items;
	}

	return items.filter((item) => {
		const itemText = item.name.toLowerCase();
		return searchTerms.every((term) => itemText.includes(term));
	});
};
