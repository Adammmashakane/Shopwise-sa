import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const image = body.base64Image;

    if (!image) {
      return res.status(400).json({ result: "Error: No image received." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Identify the product name and brand ONLY." },
            { type: "input_image", image_url: image }
          ]
        }
      ]
    });

    const result =
      response.output?.[0]?.content?.[0]?.text ||
      "Error: Could not identify product.";

    return res.status(200).json({ result });

  } catch (error) {
    console.error("VISION ERROR:", error);
    return res.status(500).json({ result: "Error scanning product." });
  }
}
