export const ERROR_MESSAGES = {
	AUTH: {
		INVALID_CREDENTIALS: 'Неверный email или пароль',
		UNAUTHORIZED: 'Необходима авторизация',
		INTERNAL_ERROR: 'Ошибка при входе',
		REGISTRATION_FAILED: 'Ошибка при регистрации',
		PASSWORD_HASHING_FAILED: 'Не удалось хэшировать пароль',
		SESSION_CREATION_FAILED: 'Не удалось создать сессию',
	},

	VALIDATION: {
		REQUIRED: 'Поле обязательно для заполнения',
		INVALID_EMAIL: 'Неверный формат email',
		PASSWORD_TOO_SHORT: 'Пароль слишком короткий',
		PASSWORDS_DONT_MATCH: 'Пароли не совпадают',
		EMAIL_EXISTS: 'Этот email уже занят',
		INVALID_ID: 'Неверный идентификатор',
		MOVIE_ALREADY_IN_SUGGESTION: 'Этот фильм уже добавлен в выбранную подборку',
		MOVIE_WITH_SAME_NAME_ALREADY_EXISTS: 'Фильм с таким названием уже существует',
		SUGGESTION_REQUIRED: 'Необходимо выбрать подборку',
	},

	COMMON: {
		NOT_FOUND: 'Ресурс не найден',
		SERVER_ERROR: 'Внутренняя ошибка сервера',
		NETWORK_ERROR: 'Ошибка сети',
		LOAD_FAILED: 'Не удалось загрузить данные',
		CREATE_ERROR_SUGGESTION: 'Не удалось создать подборку',
		CREATE_ERROR_MOVIE: 'Не удалось создать фильм',
		DUPLICATE_MOVIE_ERROR: 'Фильм с таким названием уже есть',
	},
} as const;

export type ErrorCode =
	| keyof typeof ERROR_MESSAGES.AUTH
	| keyof typeof ERROR_MESSAGES.VALIDATION
	| keyof typeof ERROR_MESSAGES.COMMON;
