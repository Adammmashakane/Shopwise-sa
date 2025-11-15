// script.js - Frontend logic for ShopWise SA

// --------------------------------------------------
// 1. Detect Product using AI Vision
// --------------------------------------------------
async function detectProduct() {
    const fileInput = document.getElementById("imageInput");
    const scanResult = document.getElementById("scanResult");

    if (!fileInput.files.length) {
        scanResult.textContent = "⚠️ Please upload an image first.";
        return;
    }

    const file = fileInput.files[0];
    scanResult.textContent = "🔄 Scanning product… Please wait.";

    // Convert image → Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        const base64Image = reader.result;

        try {
            // Send Base64 image to Vercel API
            const response = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image })
            });

            const data = await response.json();

            if (!data.result) {
                scanResult.textContent = "❌ Could not identify this product.";
                return;
            }

            scanResult.textContent = "✅ Product Detected: " + data.result;
        } catch (error) {
            console.error("Scan Error:", error);
            scanResult.textContent = "❌ Error scanning product.";
        }
    };
}

// --------------------------------------------------
// 2. Search Product (manual text search)
// --------------------------------------------------
async function searchProduct() {
    const input = document.getElementById("searchInput");
    const searchResult = document.getElementById("searchResult");

    const query = input.value.trim();
    if (!query) {
        searchResult.textContent = "⚠️ Please enter a product name.";
        return;
    }

    searchResult.textContent = "🔍 Searching…";

    try {
        // For now it just returns what you typed
        // Later we can connect it to your real database
        searchResult.textContent = "🔎 Result: " + query;
    } catch (error) {
        console.error("Search Error:", error);
        searchResult.textContent = "❌ Error searching for product.";
    }
                }
