import { z } from 'zod';

export const registrationSchema = z.object({
	email: z.string().email('Некорректный email').max(254, 'Email слишком длинный'),
	password: z
		.string()
		.min(6, 'Пароль должен содержать минимум 6 символов')
		.max(128, 'Пароль слишком длинный')
		.regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
		.regex(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
	firstName: z
		.string()
		.min(1, 'Имя обязательно')
		.max(254, 'Имя слишком длинное')
		.regex(/^[a-zA-Zа-яА-Я\s'-]+$/, 'Имя может содержать только буквы'),
	lastName: z
		.string()
		.min(1, 'Фамилия обязательна')
		.max(254, 'Фамилия слишком длинная')
		.regex(/^[a-zA-Zа-яА-Я\s'-]+$/, 'Фамилия может содержать только буквы'),
});

export const loginSchema = z.object({
	email: z.string().email('Некорректный email'),
	password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegistrationSchema = z.infer<typeof registrationSchema>;
