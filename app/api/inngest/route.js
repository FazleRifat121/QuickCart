import { serve } from "inngest/next";
import {
	createUserOrder,
	inngest,
	syncUserCreation,
	syncUserDeletion,
	syncUserUpdatation,
} from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		syncUserCreation,
		syncUserUpdatation,
		syncUserDeletion,
		createUserOrder,
	],
});
