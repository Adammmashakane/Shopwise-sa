function detectProduct() {
    document.getElementById("scanResult").innerText =
        "📸 Product scan feature will use AI in Version 2.";
}

function searchProduct() {
    let query = document.getElementById("searchInput").value;
    if (query === "") return;

    document.getElementById("searchResult").innerText =
        `🔍 Searching prices for "${query}"... (AI coming soon)`;
}

function addToList() {
    let item = document.getElementById("itemInput").value;
    if (item === "") return;

    let li = document.createElement("li");
    li.textContent = "• " + item;

    document.getElementById("shoppingList").appendChild(li);
    document.getElementById("itemInput").value = "";
}
