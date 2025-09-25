export const ERROR_MESSAGES = {
	AUTH: {
		INVALID_CREDENTIALS: 'Неверный email или пароль',
		UNAUTHORIZED: 'Необходима авторизация',
		INTERNAL_ERROR: 'Ошибка при входе',
		REGISTRATION_FAILED: 'Ошибка при регистрации',
	},

	VALIDATION: {
		REQUIRED: 'Поле обязательно для заполнения',
		INVALID_EMAIL: 'Неверный формат email',
		PASSWORD_TOO_SHORT: 'Пароль слишком короткий',
		PASSWORDS_DONT_MATCH: 'Пароли не совпадают',
		EMAIL_EXISTS: 'Этот email уже занят',
		INVALID_ID: 'Неверный идентификатор',
		MOVIE_ALREADY_IN_SUGGESTION: 'Этот фильм уже добавлен в выбранную подборку',
		SUGGESTION_REQUIRED: 'Необходимо выбрать подборку',
	},

	COMMON: {
		NOT_FOUND: 'Ресурс не найден',
		SERVER_ERROR: 'Внутренняя ошибка сервера',
		NETWORK_ERROR: 'Ошибка сети',
		LOAD_FAILED: 'Не удалось загрузить данные',
	},
} as const;

export type ErrorCode =
	| keyof typeof ERROR_MESSAGES.AUTH
	| keyof typeof ERROR_MESSAGES.VALIDATION
	| keyof typeof ERROR_MESSAGES.COMMON;
