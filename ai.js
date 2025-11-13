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
    // MobileNet v2 default settings - fast and small
    model = await mobilenet.load({version: 2, alpha: 1.0});
    console.log("MobileNet loaded");
  } catch (err) {
    console.error("Failed to load MobileNet:", err);
  } finally {
    loading = false;
  }
}

// Call loadModel on import (starts downloading quietly)
loadModel();

/**
 * detectProduct - triggered by the Scan / Upload button
 * It reads the file input (first <input type="file"> on the page),
 * runs the model.classify(image), and writes results to #scanResult.
 * It will also populate the search box (#searchInput) with the top label and call searchProduct()
 */
export async function detectProduct() {
  const resultEl = document.getElementById("scanResult");
  const fileInput = document.querySelector("input[type=file]");

  if (!fileInput) {
    alert("No file input found on page.");
    return;
  }

  const file = fileInput.files && fileInput.files[0];
  if (!file) {
    alert("Please choose or take a photo first.");
    return;
  }

  // Ensure model is loaded
  if (!model) {
    resultEl.innerText = "Loading AI model — please wait a moment (may use data).";
    await loadModel();
    if (!model) {
      resultEl.innerText = "Failed to load model. Check your connection.";
      return;
    }
  }

  resultEl.innerText = "Analyzing image…";

  // Create an HTMLImageElement from the file (no upload to server)
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;

  img.onload = async () => {
    try {
      // classify returns an array of {className, probability}
      const predictions = await model.classify(img);

      if (!predictions || predictions.length === 0) {
        resultEl.innerText = "No labels detected.";
        URL.revokeObjectURL(url);
        return;
      }

      // Show the top 3 labels
      const topLabels = predictions.slice(0, 3)
        .map(p => `${p.className} (${(p.probability*100).toFixed(1)}%)`)
        .join("\n");

      resultEl.innerText = `Detected:\n${topLabels}`;

      // Set search input to the top label (take first comma-separated token)
      const topLabel = predictions[0].className.split(",")[0].trim();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.value = topLabel;
        // call existing search function if present
        if (typeof window.searchProduct === "function") {
          // small delay so UI updates
          setTimeout(() => window.searchProduct(), 150);
        }
      }
    } catch (err) {
      console.error("Classification error", err);
      resultEl.innerText = "Error analyzing image.";
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  img.onerror = () => {
    resultEl.innerText = "Failed to load image file.";
    URL.revokeObjectURL(url);
  };
}

// attach to window so existing HTML button can call detectProduct()
window.detectProduct = detectProduct;

// also expose loadModel so you can pre-warm the model from console if desired
window.loadShopwiseModel = loadModel;
