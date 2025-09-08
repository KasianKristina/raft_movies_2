import type { AuthorInterface } from '$lib/types/types';
import type { Auth, Session, User } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			auth: Auth;
			session: Session | null;
		}
	}
}

export {};
