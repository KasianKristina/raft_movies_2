import { z } from 'zod';

export const registrationSchema = z.object({
	email: z.string().email('Некорректный email').max(254, 'Email слишком длинный'),
	password: z
		.string()
		.min(6, 'Пароль должен содержать минимум 6 символов')
		.regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
		.regex(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
	name: z
		.string()
		.min(1, 'Имя обязательно')
		.regex(/^[a-zA-Zа-яА-Я]+$/, 'Имя может содержать только буквы'),
	surname: z.string().min(1, 'Фамилия обязательна'),
});

export const loginSchema = z.object({
	email: z.string().email('Некорректный email'),
	password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegistrationSchema = z.infer<typeof registrationSchema>;
