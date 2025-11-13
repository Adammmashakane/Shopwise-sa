// ai.js – Real Vision AI Product Detection
import { client } from "https://esm.sh/@openai/openai@4.0.0";

// Main scanning function
window.detectProduct = async function () {
    const fileInput = document.getElementById("imageInput");
    const scanResult = document.getElementById("scanResult");

    if (!fileInput.files.length) {
        scanResult.textContent = "⚠️ Please upload an image first.";
        return;
    }

    const file = fileInput.files[0];
    scanResult.textContent = "⏳ Scanning product… Please wait.";

    try {
        // Convert image to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;

            // Call OpenAI Vision
            const response = await client.responses.create({
                model: "gpt-4o-mini",
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: "Identify the product name from this picture. Reply with ONLY the product name."
                            },
                            {
                                type: "input_image",
                                image_url: base64Image
                            }
                        ]
                    }
                ]
            });

            let resultText =
                response.output[0]?.content[0]?.text || "❌ Could not identify product.";

            scanResult.textContent = "✅ Product detected: " + resultText;
        };
    } catch (error) {
        console.error(error);
        scanResult.textContent = "❌ Error scanning image.";
    }
};
