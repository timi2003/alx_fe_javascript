const quotesKey = "quotesData";
let quotes = [];
let selectedCategory = "all";
const apiUrl = "https://jsonplaceholder.typicode.com/posts";

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const importFile = document.getElementById("importFile");

function loadQuotes() {
    const storedQuotes = localStorage.getItem(quotesKey);
    quotes = storedQuotes ? JSON.parse(storedQuotes) : [
        { text: "Believe in yourself!", category: "Motivation" },
        { text: "Keep pushing forward.", category: "Motivation" },
        { text: "Success requires consistency.", category: "Success" },
    ];
    saveQuotes();
}

function saveQuotes() {
    localStorage.setItem(quotesKey, JSON.stringify(quotes));
}

function showRandomQuote() {
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" - (${randomQuote.category})`;
}

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (!newQuoteText || !newQuoteCategory) {
        alert("Please enter both a quote and category.");
        return;
    }

    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
}

function populateCategories() {
    const categories = ["all", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format!");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

async function syncWithServer() {
    try {
        const response = await fetch(apiUrl);
        const serverQuotes = await response.json();
        serverQuotes.slice(0, 5).forEach(q => {
            const text = q.title;
            if (!quotes.some(quote => quote.text === text)) {
                quotes.push({ text, category: "General" });
            }
        });
        saveQuotes();
        populateCategories();
        alert("Quotes synced with server!");
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    populateCategories();
    selectedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = selectedCategory;
    showRandomQuote();
    createAddQuoteForm();
});

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);
importFile.addEventListener("change", importFromJsonFile);
