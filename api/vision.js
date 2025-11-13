// Vercel API Route – /api/vision.js
import OpenAI from "openai";

export default async function handler(req, res) {
    try {
        // Parse incoming JSON (Vercel uses req.body directly)
        const { image } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        if (!image) {
            return res.status(400).json({ result: "No image received." });
        }

        // Initialize OpenAI with server-side API key
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Request vision analysis
        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: "Identify the product in this picture. Respond ONLY with the product name."
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
            response.output?.[0]?.content?.[0]?.text ||
            "Could not identify product.";

        return res.status(200).json({ result });

    } catch (error) {
        console.error("Vision API Error:", error);
        return res.status(500).json({ result: "Error scanning product." });
    }
            }
