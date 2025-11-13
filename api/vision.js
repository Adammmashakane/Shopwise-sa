// Vercel API Route – /api/vision.js
import OpenAI from "openai";

export default async function handler(req, res) {
    try {
        const { image } = JSON.parse(req.body);

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: "Identify this product. Respond ONLY with the product name."
                        },
                        {
                            type: "input_image",
                            image_url: image
                        }
                    ]
                }
            ]
        });

        const result =
            response.output[0]?.content[0]?.text ||
            "Could not identify product.";

        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "Error scanning product." });
    }
}
