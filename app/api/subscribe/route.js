const API_KEY = process.env.CONVERTKIT_API_KEY;
const FORM_ID = process.env.CONVERTKIT_FORM_ID;
const BASE_URL = "https://api.convertkit.com/v3";
const email_required_message = "Email is required";
const error_message = "There was a problem, please try again.";
const success_message =
	"🎉 You have been added to the wait list! Check your email to confirm your interest.";

export async function POST(req) {
	try {
		const { email } = await req.json();

		if (!email) {
			return new Response(JSON.stringify({ message: email_required_message }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const url = `${BASE_URL}/forms/${FORM_ID}/subscribe`;

		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ api_key: API_KEY, email }),
		});

		const data = await response.json();

		if (!response.ok || data.error) {
			return new Response(
				JSON.stringify({ message: data.error || error_message }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}

		return new Response(JSON.stringify({ message: success_message }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("ConvertKit subscribe error:", err);
		return new Response(JSON.stringify({ message: error_message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
