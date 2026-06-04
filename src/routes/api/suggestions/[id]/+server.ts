import { json } from '@sveltejs/kit';
import { deleteSuggestion } from '$lib/server/services/suggestionService';
import { ValidationError } from '$lib/errors/errors';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'UNAUTHORIZED' }, { status: 401 });
	}

	try {
		await deleteSuggestion(params.id, locals.user.id);
		return json({ success: true });
	} catch (error: unknown) {
		if (error instanceof ValidationError && error.code === 'NOT_AUTHORIZED') {
			return json({ error: 'NOT_AUTHORIZED' }, { status: 403 });
		}
		if (error instanceof ValidationError && error.code === 'SUGGESTION_NOT_FOUND') {
			return json({ error: 'SUGGESTION_NOT_FOUND' }, { status: 404 });
		}
		throw error;
	}
}
