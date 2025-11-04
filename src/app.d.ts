import type { AuthSession, User } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: AuthSession | null;
		}

		namespace Superforms {
			type Message = {
				text: string;
			};
		}
	}
}

export {};
