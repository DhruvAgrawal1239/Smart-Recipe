const apiKey = "80e76af08b614913812287bbdfdcefe1";
const ingredientInput = document.getElementById("ingredientInput");
const recipeContainer = document.getElementById("recipes");
const nutritionContainer = document.getElementById("nutritionInfo");
const foodTypeFilter = document.getElementById("foodType");
const toggleNutritionBtn = document.getElementById("toggleNutrition");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

// 🍎 Placeholder disappears on click
ingredientInput.addEventListener("focus", function () {
    this.placeholder = "";
});
ingredientInput.addEventListener("blur", function () {
    this.placeholder = "Enter ingredients (comma-separated)";
});

// 🔍 Fetch Recipes from Spoonacular API
async function fetchRecipes(ingredients, foodType) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`;
    const response = await fetch(url);
    const recipes = await response.json();
    
    displayRecipes(recipes, foodType);
}

// 📊 Fetch Recipe Nutrition Info
async function fetchRecipeInfo(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;
    const response = await fetch(url);
    return response.ok ? response.json() : null;
}

// 🍽️ Display Recipes & Nutrition Info
async function displayRecipes(recipes, foodType) {
    recipeContainer.innerHTML = "";
    nutritionContainer.innerHTML = "";

    if (recipes.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }

    for (let recipe of recipes) {
        const recipeInfo = await fetchRecipeInfo(recipe.id);
        if (!recipeInfo) continue;

        const isVegetarian = recipeInfo.vegetarian;
        if ((foodType === "veg" && !isVegetarian) || (foodType === "nonveg" && isVegetarian)) {
            continue; // Skip recipes that don't match the selected food type
        }

        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
        `;
        recipeContainer.appendChild(recipeDiv);

        // 🥗 Add Nutrition Info
        const nutritionDiv = document.createElement("div");
        nutritionDiv.classList.add("nutrition-data");
        nutritionDiv.innerHTML = `
            <p><strong>${recipe.title}</strong></p>
            <p>Calories: ${recipeInfo.calories} kcal</p>
            <p>Carbs: ${recipeInfo.carbs}</p>
            <p>Protein: ${recipeInfo.protein}</p>
            <hr>
        `;
        nutritionContainer.appendChild(nutritionDiv);
    }

    gsap.from(".recipe", { opacity: 0, y: 50, stagger: 0.2, duration: 0.6 });
}

// 🎛️ Toggle Nutrition Info
toggleNutritionBtn.addEventListener("click", function () {
    nutritionContainer.classList.toggle("show");
});

// 🌙 Toggle Dark Mode
toggleDarkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// 🚀 Search Button Click
document.getElementById("searchBtn").addEventListener("click", function () {
    const ingredients = ingredientInput.value.trim();
    const foodType = foodTypeFilter.value;

    if (ingredients) {
        fetchRecipes(ingredients, foodType);
    }
});
