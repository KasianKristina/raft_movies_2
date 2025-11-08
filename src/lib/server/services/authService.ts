import { prisma } from '$lib/server/db/prisma';
import { hash, verify } from '@node-rs/argon2';
import { ARGON2_CONFIG } from '$lib/constants/auth';
import { AuthError, ValidationError } from '$lib/errors/errors';

export async function registerUser(
	email: string,
	password: string,
	firstName: string,
	lastName: string,
) {
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		throw new ValidationError('EMAIL_EXISTS');
	}

	let passwordHash: string;
	try {
		passwordHash = await hash(password, ARGON2_CONFIG);
	} catch {
		throw new AuthError('PASSWORD_HASHING_FAILED');
	}

	try {
		const user = await prisma.user.create({
			data: {
				email,
				password: passwordHash,
				first_name: firstName,
				last_name: lastName,
			},
		});
		return user;
	} catch (error: any) {
		if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
			throw new ValidationError('EMAIL_EXISTS');
		}
		throw new AuthError('REGISTRATION_FAILED');
	}
}

export async function loginUser(email: string, password: string) {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		// защита от timing-attack
		await dummyVerify();
		throw new AuthError('INVALID_CREDENTIALS');
	}

	const isValid = await verify(user.password, password, ARGON2_CONFIG);
	if (!isValid) {
		throw new AuthError('INVALID_CREDENTIALS');
	}

	return user;
}

async function dummyVerify() {
	const dummyHash = '$argon2id$v=19$m=19456,t=2,p=1$dummy$dummy';
	try {
		await verify(dummyHash, 'dummy_password', ARGON2_CONFIG);
	} catch {
		// ignore
	}
}
