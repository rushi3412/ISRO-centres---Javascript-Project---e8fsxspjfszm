const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-button");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");
let selectedCategory = "all"; // Default selected category

// Function to handle category selection
function handleCategorySelection(category) {
  selectedCategory = category;

  categoryButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const selectedButton = document.querySelector(
    `[data-category="${category}"]`
  );
  selectedButton.classList.add("active");

  fetchAndRenderResults(); // Update the results based on the selected category
}

// Add click event listeners to category buttons
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    handleCategorySelection(category);
  });
});

// Function to fetch data from the ISRO API and render the results
function fetchAndRenderResults() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Fetch data from the API
  fetch("https://isro.vercel.app/api/centres")
    .then((response) => response.json())
    .then((data) => {
      // Filter the data based on the selected category and search term
      const filteredData = data.centres.filter((center) => {
        if (selectedCategory === "all") {
          return (
            center.Place.toLowerCase().includes(searchTerm) ||
            center.State.toLowerCase().includes(searchTerm) ||
            center.name.toLowerCase().includes(searchTerm)
          );
        } else if (selectedCategory === "city") {
          return center.Place.toLowerCase().includes(searchTerm);
        } else if (selectedCategory === "state") {
          return center.State.toLowerCase().includes(searchTerm);
        } else if (selectedCategory === "center") {
          return center.name.toLowerCase().includes(searchTerm);
        }
      });

      // Clear previous results
      clearResults();

      // Render the filtered results if search term is provided
      if (searchTerm !== "") {
        renderResults(filteredData);
      } else {
        // Generate and render random results
        const randomResults = generateRandomResults(data.centres);
        renderResults(randomResults);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to clear the results container
function clearResults() {
  resultsContainer.innerHTML = "";
}

// Function to generate random results
function generateRandomResults(data) {
  const randomResults = [];
  const numResults = 3; // Number of random results to display

  // Generate random indices
  const randomIndices = [];
  while (randomIndices.length < numResults) {
    const randomIndex = Math.floor(Math.random() * data.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  // Get the corresponding data for random indices
  randomIndices.forEach((index) => {
    randomResults.push(data[index]);
  });

  return randomResults;
}

// Function to render the results in the results container
function renderResults(data) {
  // Clear previous results
  clearResults();

  if (data.length === 0) {
    // Display "No center or lab found" message
    const noResultsMessage = document.createElement("div");
    noResultsMessage.classList.add("no-results");
    noResultsMessage.textContent = "NO CENTER OR LAB FOUND!!!";
    resultsContainer.appendChild(noResultsMessage);
  } else {
    data.forEach((center) => {
      const card = document.createElement("div");
      card.classList.add("result-card");

      // Check if the result is from random generation
      if (searchInput.value.trim() === "") {
        card.classList.add("random-result");
      }

      card.innerHTML = `
        <h2>${center.name}</h2>
        <p>CITY: ${center.Place}</p>
        <p>STATE: ${center.State}</p>
      `;
      resultsContainer.appendChild(card);
    });

    categoryButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.category === selectedCategory) {
        button.classList.add("active");
      }
    });
  }
}

// Event listener for the search button click
searchButton.addEventListener("click", fetchAndRenderResults);

// Initial page load: Generate and render random results
fetchAndRenderResults();

