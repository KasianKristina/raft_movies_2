import { registrationSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { hash } from '@node-rs/argon2';
import { fail, superValidate, message, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(registrationSchema));
	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(registrationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, firstName, lastName } = form.data;

		try {
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			const user = await prisma.user.create({
				data: {
					email,
					password: passwordHash,
					first_name: firstName,
					last_name: lastName,
				},
			});

			await locals.auth.createKey({
				userId: user.id.toString(),
				providerId: 'email',
				providerUserId: email,
				password: passwordHash,
			});

			const session = await locals.auth.createSession({
				userId: user.id.toString(),
				attributes: {},
			});

			locals.auth.setSession(session);

			return message(form, 'Регистрация прошла успешно!');
		} catch (e: any) {
			if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
				return setError(form, 'email', 'Этот email уже занят');
			}
			console.error(e);
			return setError(form, 'email', 'Ошибка регистрации');
		}
	},
};
