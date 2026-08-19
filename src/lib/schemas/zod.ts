import { z } from 'zod';

z.setErrorMap((issue, ctx) => {
	if (
		issue.code === z.ZodIssueCode.invalid_type &&
		(issue.received === 'undefined' || issue.received === 'null')
	) {
		return { message: 'Это поле обязательно' };
	}

	return { message: ctx.defaultError };
});

export { z };
