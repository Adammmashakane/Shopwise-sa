// Load supermarket prices
let database = null;

async function loadDatabase() {
    try {
        const res = await fetch("data/supermarkets.json");
        database = await res.json();
        console.log("Database loaded:", database);
    } catch (e) {
        console.error("Database failed to load", e);
    }
}

loadDatabase();

// ========== PRODUCT SCAN / UPLOAD ==========
function detectProduct() {
    document.getElementById("scanResult").innerText =
        "📸 AI product recognition coming in Version 2!";
}

// ========== SEARCH PRODUCT ==========
function searchProduct() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultBox = document.getElementById("searchResult");

    if (!query) {
        resultBox.innerText = "Please enter a product name.";
        return;
    }

    if (!database) {
        resultBox.innerText = "Loading database...";
        return;
    }

    const matches = database.products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        resultBox.innerText = "No matching products found.";
        return;
    }

    let output = "🛒 Products found:\n\n";

    matches.forEach(product => {
        output += `${product.name} (${product.brand})\n`;
        output += "Prices:\n";

        database.stores.forEach(store => {
            const price = product.prices[store];
            output += `• ${store}: ${price ? "R " + price : "N/A"}\n`;
        });

        output += "\n";
    });

    resultBox.innerText = output;
}

// ========== SHOPPING LIST ==========
let shoppingList = [];

function addToList() {
    const item = document.getElementById("itemInput").value.trim();
    if (!item) return;

    shoppingList.push(item);

    const listElement = document.getElementById("shoppingList");
    const li = document.createElement("li");
    li.textContent = "• " + item;
    listElement.appendChild(li);

    document.getElementById("itemInput").value = "";
}
