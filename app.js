// ShopWise SA - Version 1 Core Logic

console.log("ShopWise SA loaded successfully!");

// ========= PRODUCT IMAGE UPLOAD =========
const fileInput = document.querySelector("input[type=file]");

if (fileInput) {
    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            alert("📸 Image uploaded! (Recognition will be added in next step)");
        }
    });
}

// ========= SEARCH PRODUCT =========
function searchProduct() {
    const query = prompt("Enter product name:");
    if (query) {
        alert(`🔍 Searching for: ${query}\n(Real search coming soon)`);
    }
}

// ========= PRICE COMPARISON =========
function comparePrices() {
    alert("💰 Price comparison loading...\n(Will read supermarket data in next step)");
}

// ========= SHOPPING LIST =========
let shoppingList = [];

function addToShoppingList() {
    const item = prompt("Add item to shopping list:");
    if (item) {
        shoppingList.push(item);
        alert(`📝 Added to list: ${item}`);
    }
}

function showShoppingList() {
    alert("🛒 Your Shopping List:\n\n" + shoppingList.join("\n"));
}

// ========= SUPERMARKET SELECTOR =========
const supermarkets = [
    "Shoprite",
    "Checkers",
    "Pick n Pay",
    "Spar",
    "Woolworths",
    "Boxer",
    "Food Lover's Market",
    "Makro",
    "Game",
];

function chooseSupermarket() {
    let menu = "🏪 Choose Supermarket:\n\n";
    supermarkets.forEach((s, i) => {
        menu += `${i + 1}. ${s}\n`;
    });

    const choice = prompt(menu);

    if (choice && supermarkets[choice - 1]) {
        alert(`You selected: ${supermarkets[choice - 1]}`);
    }
}
