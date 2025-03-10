const apiKey = "YOUR_SPOONACULAR_API_KEY";
const ingredientInput = document.getElementById("ingredientInput");
const recipeContainer = document.getElementById("recipes");
const nutritionContainer = document.getElementById("nutritionInfo");
const toggleNutritionBtn = document.getElementById("toggleNutrition");
const searchBtn = document.getElementById("searchBtn");
ingredientInput.addEventListener("focus", function () {
    this.placeholder = "";
});
ingredientInput.addEventListener("blur", function () {
    this.placeholder = "Enter ingredients (comma-separated)";
});
async function fetchRecipes(ingredients) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = "<p>Failed to fetch recipes. Please try again later.</p>";
    }
}
async function fetchRecipeInfo(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching nutrition info:", error);
        return null;
    }
}
async function displayRecipes(recipes) {
    recipeContainer.innerHTML = "";
    nutritionContainer.innerHTML = "";
    if (recipes.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }
    for (const recipe of recipes) {
        const recipeInfo = await fetchRecipeInfo(recipe.id);
        if (!recipeInfo) continue;

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
    }

    gsap.from(".recipe", { opacity: 0, y: 50, stagger: 0.2, duration: 0.6 });
}
toggleNutritionBtn.addEventListener("click", function () {
    nutritionContainer.classList.toggle("show");
});
searchBtn.addEventListener("click", function () {
    const ingredients = ingredientInput.value.trim();
    if (ingredients) {
        fetchRecipes(ingredients);
    }
});