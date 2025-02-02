document.addEventListener("DOMContentLoaded", () => {
const newQuoteButton = document.getElementById('newQuote');
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const newQuoteText = document.getElementById("newQuoteText");
const importFileInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const addquoteButton = document.getElementById("adddQuotebtn");
const quote = [
    { text: "jesus is lord", category: "category1"},
    { text: "there is safety in the multitude of counsel", category: "category2"},
    { text: "the tough get going in though times", category: "category3"},
    { text: "count your cost", category: "category4"},
    { text: "embrace righteousness", category: "category1"},
    { text: "emulate purity", category: "category2"},
    { text: "the tough get going in though times", category: "category 3"},
    { text: "know the truth", category: "category4"}, 
    { text: "emulate purity", category: "category1"}
];

const populateCategories = () => {
    const categories = [...new Set(quote.map(q => q.category.trim()))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
};

const filterQuotes = () => {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quote : quote.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.textContent = `${randomQuote.text} - ${randomQuote.category}`;
    } else {
        quoteDisplay.textContent = 'No quotes available for this category.';
    }
    localStorage.setItem('selectedCategory', selectedCategory);
};

const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quote.length);
    const randomQuote = quote[randomIndex];
    quoteDisplay.textContent = `${randomQuote.text} - ${randomQuote.category}`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    };
function addQuote(){
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
        quote.push({ text, category });
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        alert('quote added successfully')
    
   
        let storedQuote = JSON.parse(localStorage.getItem('quote')) || [];
        storedQuote.push({ text, category})
        localStorage.setItem('quote', JSON.stringify(storedQuote));
    } else {
        alert('please enter both the text and the category')
    }
}
addQuote();
    const exportQuote = () => {
        const quoteJson = JSON.stringify(quote);
        const blob = new Blob([quoteJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    };
       const exportQuoteButton = document.createElement('button');
        exportQuoteButton.textContent = 'Export-Quote';
        exportQuoteButton.addEventListener('click', exportQuote)
        document.body.appendChild(exportQuoteButton);

        function importFromJsonFile(event) {
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
              const importedQuotes = JSON.parse(event.target.result);
              quote.push(...importedQuotes);
              saveQuotes();
              alert('Quotes imported successfully!');
            };
            fileReader.readAsText(event.target.files[0]);
          }

          const fetchQuotesFromServer = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API endpoint
                const serverQuotes = await response.json();
                // Simulate server quotes structure
                const newQuotes = serverQuotes.map(q => ({ text: q.title, category: 'server' }));
                quote.push(...newQuotes);
                populateCategories();
                filterQuotes();
                alert('Quotes synced with server!');
            } catch (error) {
                console.error('Error fetching quotes from server:', error);
            }
        };
    
        // Periodically fetch new quotes from the server
        setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
    

          populateCategories();
          const savedCategories = localStorage.getItem('selectedCategory') || 'all';
          categoryFilter.value = savedCategories;
          filterQuotes();

addquoteButton.addEventListener('click', addQuote);
newQuoteButton.addEventListener("click", showRandomQuote);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);
});