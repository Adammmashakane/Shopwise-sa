import OpenAI from "openai";

export default async function handler(req, res) {
    try {
        const { query } = JSON.parse(req.body);

        if (!query) {
            return res.status(400).json({ result: "No search query provided." });
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: [
                        { type: "input_text", text: "Return the closest matching product for: " + query }
                    ]
                }
            ]
        });

        const answer =
            response.output?.[0]?.content?.[0]?.text ||
            "No matching product found.";

        return res.status(200).json({ result: answer });

    } catch (err) {
        console.error("SEARCH ERROR:", err);
        return res.status(500).json({ result: "Error searching product." });
    }
}
