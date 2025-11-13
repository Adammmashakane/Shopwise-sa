// ai.js - Frontend for product scanning

// Convert image file to Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

window.detectProduct = async function () {
    const fileInput = document.getElementById("imageInput");
    const scanResult = document.getElementById("scanResult");

    if (!fileInput.files.length) {
        scanResult.textContent = "⚠️ Please upload an image first.";
        return;
    }

    scanResult.textContent = "⏳ Scanning product… Please wait.";

    try {
        const file = fileInput.files[0];
        const base64Image = await toBase64(file);

        // Send image to Vercel backend
        const response = await fetch("/api/vision", {
            method: "POST",
            body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();
        scanResult.textContent = "✅ Product detected: " + data.result;

    } catch (error) {
        console.error(error);
        scanResult.textContent = "❌ Error scanning product.";
    }
};
