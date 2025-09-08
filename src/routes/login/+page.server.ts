import { loginSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { fail, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { verify } from '@node-rs/argon2';
import { lucia } from '$lib/server/auth';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		try {
			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				return setError(form, 'email', 'Неверный email или пароль');
			}

			const isValid = await verify(user.password, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			if (!isValid) {
				return setError(form, 'email', 'Неверный email или пароль');
			}

			const session = await lucia.createSession(user.id.toString(), {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			//event.cookies.set(sessionCookie.name, sessionCookie.value, {
			//	path: ".",
			//	...sessionCookie.attributes
			//});

			//locals.auth.setSession(session);

			return { form };
		} catch (err: any) {
			console.log(err);
			return setError(form, 'email', 'Ошибка при входе');
		}
	},
};
