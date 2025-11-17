import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    let body = req.body;

    // Vercel sometimes sends body as string
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const image = body.base64Image;


    if (!dataUrl) {
      return res.status(400).json({ result: "Error: No image received." });
    }

    // Extract REAL base64 (remove "data:image/...;base64,")
    const base64 = dataUrl.split(",")[1];

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Vision request
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Identify ONLY the product name and brand." },
            { type: "input_image", image_base64: base64 }
          ]
        }
      ]
    });

    const result =
      response.output?.[0]?.content?.[0]?.text ||
      "Could not identify product.";

    return res.status(200).json({ result });

  } catch (err) {
    console.error("VISION ERROR:", err);
    return res.status(500).json({ result: "Error scanning product." });
  }
}
