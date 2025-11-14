// script.js – Frontend logic for ShopWise SA

// Detect Product (AI Vision)
async function detectProduct() {
    const fileInput = document.getElementById("imageInput");
    const scanResult = document.getElementById("scanResult");

    if (!fileInput.files.length) {
        scanResult.textContent = "⚠️ Please upload an image first.";
        return;
    }

    const file = fileInput.files[0];
    scanResult.textContent = "⏳ Scanning product… Please wait.";

    // Convert uploaded image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {console.log("BASE64:", base64Image);

        const base64Image = reader.result;

        try {
            // Send image to your Vercel API
            const response = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64Image   // IMPORTANT: correct field name
                })
            });

            const data = await response.json();

            if (!data.result) {
                scanResult.textContent = "❌ Could not identify this product.";
                return;
            }

            scanResult.textContent = "✅ Product detected: " + data.result;

        } catch (error) {
            console.error("Scan Error:", error);
            scanResult.textContent = "❌ Error scanning product.";
        }
    };
}
