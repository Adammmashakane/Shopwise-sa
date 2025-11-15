// script.js – Client logic for ShopWise SA

// ======================
// 1. SCAN PRODUCT (VISION)
// ======================
async function detectProduct() {
    const fileInput = document.getElementById("imageInput");
    const scanResult = document.getElementById("scanResult");

    if (!fileInput.files.length) {
        scanResult.textContent = "⚠️ Please upload an image first.";
        return;
    }

    const file = fileInput.files[0];
    scanResult.textContent = "🔍 Scanning product... Please wait.";

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        const base64Image = reader.result; // full Data URL

        try {
            const response = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64Image })
            });

            const data = await response.json();

            scanResult.textContent = data.result.startsWith("Error")
                ? "❌ " + data.result
                : "✅ Product detected: " + data.result;

        } catch (err) {
            console.error(err);
            scanResult.textContent = "❌ Error scanning product.";
        }
    };
}


// ======================
// 2. SEARCH PRODUCT (AI)
// ======================
async function searchProduct() {
    const input = document.getElementById("searchInput").value.trim();
    const output = document.getElementById("searchResult");

    if (!input) {
        output.textContent = "⚠️ Please type something.";
        return;
    }

    output.textContent = "🔍 Searching...";

    try {
        const response = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: input })
        });

        const data = await response.json();
        output.textContent = "🔍 Result: " + data.result;

    } catch (err) {
        console.error(err);
        output.textContent = "❌ Search failed.";
    }
}
