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
		MOVIE_NOT_FOUND_IN_SUGGESTION: 'В подборке нет фильма с таким id',
		MOVIE_NOT_FOUND: 'Фильм не найден',
		SUGGESTION_NOT_FOUND: 'Подборка не найдена',
		NOT_AUTHORIZED_TO_EDIT_MOVIE: 'Вы не можете редактировать информацию о фильме',
		NOT_AUTHORIZED: 'Нет прав для выполнения этого действия',
	},

	COMMON: {
		NOT_FOUND: 'Ресурс не найден',
		SERVER_ERROR: 'Внутренняя ошибка сервера',
		NETWORK_ERROR: 'Ошибка сети',
		LOAD_FAILED: 'Не удалось загрузить данные',
		CREATE_ERROR_SUGGESTION: 'Не удалось создать подборку',
		CREATE_ERROR_MOVIE: 'Не удалось создать фильм',
		DUPLICATE_MOVIE_ERROR: 'Фильм с таким названием уже есть',
		IMAGE_UPLOAD_FAILED: 'Не удалось загрузить изображение',
	},
} as const;
