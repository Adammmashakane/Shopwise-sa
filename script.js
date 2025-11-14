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

    reader.onload = async () => {
        const base64Image = reader.result;

        try {
            // Send image to your Vercel API route
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

            scanResult.textContent = "✅ Product detected: " + data.result;
        } catch (error) {
            console.error("Scan Error:", error);
            scanResult.textContent = "❌ Error scanning product.";
        }
    };
}

// Search Product (basic)
function searchProduct() {
    const input = document.getElementById("searchInput").value;
    const result = document.getElementById("searchResult");

    if (!input.trim()) {
        result.textContent = "⚠️ Please enter a product name.";
        return;
    }

    result.textContent = "🔍 Searching for: " + input;
}

// Add item to shopping list
function addToList() {
    const itemInput = document.getElementById("itemInput");
    const shoppingList = document.getElementById("shoppingList");

    if (!itemInput.value.trim()) return;

    const li = document.createElement("li");
    li.textContent = itemInput.value;
    shoppingList.appendChild(li);

    itemInput.value = "";
}
