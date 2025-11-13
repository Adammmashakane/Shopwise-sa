// ai.js (type="module")
// Runs MobileNet in the browser and hooks into your existing UI.
// Usage: the index.html "Scan Product" button should call detectProduct()

import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.8.0/dist/tf.min.js";
import * as mobilenet from "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.2.2/dist/mobilenet.esm.js";

let model = null;
let loading = false;

async function loadModel() {
  if (model || loading) return;
  loading = true;
  try {
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log("MobileNet loaded");
  } catch (err) {
    console.error("Failed to load MobileNet:", err);
  } finally {
    loading = false;
  }
}

loadModel();

/**
 * detectProduct
 * Called when the user taps "Scan Product"
 */
export async function detectProduct() {
  const resultEl = document.getElementById("scanResult");
  const fileInput = document.querySelector("input[type=file]");

  if (!fileInput) {
    alert("No file input found.");
    return;
  }

  const file = fileInput.files && fileInput.files[0];
  if (!file) {
    alert("Please choose or take a photo first.");
    return;
  }

  if (!model) {
    resultEl.innerText = "Loading AI model… please wait.";
    await loadModel();
    if (!model) {
      resultEl.innerText = "Model failed to load.";
      return;
    }
  }

  resultEl.innerText = "Analyzing image…";

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;

  img.onload = async () => {
    try {
      const predictions = await model.classify(img);

      if (!predictions || predictions.length === 0) {
        resultEl.innerText = "No labels detected.";
        URL.revokeObjectURL(url);
        return;
      }

      const topLabels = predictions
        .slice(0, 3)
        .map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`)
        .join("\n");

      resultEl.innerText = `Detected:\n${topLabels}`;

      const topLabel = predictions[0].className.split(",")[0].trim();
      const searchInput = document.getElementById("searchInput");

      if (searchInput) {
        searchInput.value = topLabel;

        if (typeof window.searchProduct === "function") {
          setTimeout(() => window.searchProduct(), 150);
        }
      }
    } catch (err) {
      console.error("AI error:", err);
      resultEl.innerText = "Error analyzing image.";
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  img.onerror = () => {
    resultEl.innerText = "Failed to read image.";
    URL.revokeObjectURL(url);
  };
}

window.detectProduct = detectProduct;
window.loadShopwiseModel = loadModel;
