export const SUCCESS_MESSAGES = {
	MOVIE_CREATED: 'Фильм успешно добавлен',
	MOVIE_UPDATED: 'Фильм успешно обновлен',
	MOVIE_DELETED: 'Фильм успешно удален',
	SUGGESTION_CREATED: 'Предложение успешно создано',
	SUGGESTION_UPDATED: 'Предложение успешно обновлено',
	SUGGESTION_DELETED: 'Предложение успешно удалено',
	USER_REGISTERED: 'Регистрация прошла успешно',
	AUTH_LOGIN: 'Вход выполнен успешно',
} as const;

export type SuccessCode = keyof typeof SUCCESS_MESSAGES;
