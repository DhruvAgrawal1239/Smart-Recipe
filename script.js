const apiKey = "YOUR_API_KEY";
const ingredientInput = document.getElementById("ingredientInput");
const recipeContainer = document.getElementById("recipes");
const nutritionContainer = document.getElementById("nutritionInfo");
const foodTypeFilter = document.getElementById("foodType");
const toggleNutritionBtn = document.getElementById("toggleNutrition");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
ingredientInput.addEventListener("focus", function () {
    this.placeholder = "";
});
ingredientInput.addEventListener("blur", function () {
    this.placeholder = "Enter ingredients (comma-separated)";
});
async function fetchRecipes(ingredients, foodType) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`;
    const response = await fetch(url);
    const recipes = await response.json();
    displayRecipes(recipes, foodType);
}
async function fetchRecipeInfo(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;
    const response = await fetch(url);
    return response.ok ? response.json() : null;
}

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
            continue; 
        }
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
        `;
        recipeContainer.appendChild(recipeDiv);
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

    gsap.from(".recipe", { opacity: 0, y: 50, stagger: 0.2, duration: 0.6 });
}
toggleNutritionBtn.addEventListener("click", function () {
    nutritionContainer.classList.toggle("show");
});
toggleDarkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});
document.getElementById("searchBtn").addEventListener("click", function () {
    const ingredients = ingredientInput.value.trim();
    const foodType = foodTypeFilter.value;
    if (ingredients) {
        fetchRecipes(ingredients, foodType);
    }
});
