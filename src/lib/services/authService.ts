import { hash, verify } from '@node-rs/argon2';
import { prisma } from '$lib/server/prisma';
import { ERROR_MESSAGES } from '$lib/constants/error-messages';
import { AuthError } from '$lib/errors/errors';
import { ARGON2_CONFIG } from '$lib/constants/auth';

export class AuthService {
	static async registerUser(email: string, password: string, firstName: string, lastName: string) {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			throw new Error(ERROR_MESSAGES.VALIDATION.EMAIL_EXISTS);
		}

		const passwordHash = await this.hashPassword(password);

		try {
			return await prisma.user.create({
				data: {
					email,
					password: passwordHash,
					first_name: firstName,
					last_name: lastName,
				},
			});
		} catch (error: any) {
			if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
				throw new Error(ERROR_MESSAGES.VALIDATION.EMAIL_EXISTS);
			}
			throw new Error('USER_CREATION_FAILED');
		}
	}

	static async loginUser(email: string, password: string) {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			// защита от timing attacks
			await this.dummyHashVerification();
			throw new AuthError('INVALID_CREDENTIALS');
		}

		const isValid = await verify(user.password, password, ARGON2_CONFIG);

		if (!isValid) {
			throw new AuthError('INVALID_CREDENTIALS');
		}

		return user;
	}

	private static async hashPassword(password: string) {
		try {
			return await hash(password, ARGON2_CONFIG);
		} catch {
			throw new AuthError('PASSWORD_HASHING_FAILED');
		}
	}

	private static async dummyHashVerification() {
		const dummyHash = '$argon2id$v=19$m=19456,t=2,p=1$dummy$dummy';
		try {
			await verify(dummyHash, 'dummy_password', ARGON2_CONFIG);
		} catch {
			// empty
		}
	}
}
