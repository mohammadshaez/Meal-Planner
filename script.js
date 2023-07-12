let weight = document.querySelector("#weight");
let height = document.querySelector("#height");
let age = document.querySelector("#age");
let gender = document.querySelector("#gender");
let activity = document.querySelector("#activity");
let btn_generate = document.querySelector("#submit");
const mealPlanURL =
  "https://content.newtonschool.co/v1/pr/64995a40e889f331d43f70ae/categories";
const recipesUrl =
  "https://content.newtonschool.co/v1/pr/64996337e889f331d43f70ba/recipes";
const form = document.querySelector("#form");
form.addEventListener("click", (e) => e.preventDefault());
const cards = document.querySelector(".cards");
const recipeTable = document.querySelector(".recipe-table");
const tableBody = document.querySelector("#table-body");

let bmr;
const calculateBmr = () => {
  if (gender.value === "female") {
    bmr =
      655.1 + 9.563 * weight.value + 1.85 * height.value - 4.676 * age.value;
  } else if (gender.value === "male") {
    bmr =
      66.47 + 13.75 * weight.value + 5.003 * height.value - 6.755 * age.value;
  }

  let calorieRequired = 0;

  if (activity.value === "light") {
    calorieRequired = bmr * 1.375;
  } else if (activity.value === "moderate") {
    calorieRequired = bmr * 1.55;
  } else {
    calorieRequired = bmr * 1.725;
  }

  console.log("calorie Required ", calorieRequired);
  console.log("bmr ", bmr);
  generateMealPlan(calorieRequired);
};

btn_generate.addEventListener("click", calculateBmr);

const generateMealPlan = async (calorieRequired) => {
  try {
    const response = await fetch(mealPlanURL);
    const data = await response.json();
    const filteredData = data.filter((item) => {
      return calorieRequired >= item.min && calorieRequired <= item.max;
    });
    let html = "";
    const mealTime = ["Breakfast", "Lunch", "Dinner"];
    const maxLengthOfTitle = 15;
    mealTime.forEach((meal) => {
      const mealData = filteredData[0][meal.toLocaleLowerCase()];
      const mealTitle = mealData.title;
      let newTitle = mealTitle;
      if (mealTitle.length > maxLengthOfTitle) {
        newTitle = mealTitle.substring(0, maxLengthOfTitle) + "...";
      }
      html += `
                <div class="card">
                  <div class="card-upper">
                    <h3>${meal}</h3>
                  </div>
                  <div class="card-below">
                    <div class="card-img">
                      <img src="${mealData.image}" alt="card-image"/>
                    </div>
                    <div class="card-details">
                       <h4>${newTitle}</h4>
                       <h5>Ready in ${mealData.readyInMinutes} minutes</h5>
                      <button onclick="generateGetRecipe(${mealData.id})">Get Recipe</button>
                    </div>
                  </div>
                </div>
              `;
      cards.innerHTML = html;
    });
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};

const generateGetRecipe = async (id) => {
  try {
    const response = await fetch(recipesUrl);
    const data = await response.json();
    const filteredData = data.filter((item) => item.id === id);
    // console.log(filteredData)
    let html = "";
    filteredData.map((item) => {
      html += `
      <tbody>
      <tr>
      <td id="title">${item.title}</td>
          <td id="ingredients"></td>
          <td><ol id="steps"></ol></td>
          </tr>
      </tbody>
      `;
      tableBody.innerHTML = html;

      const ingredientData = document.querySelector("#ingredients");
      const stepsData = document.querySelector("#steps");

      const ingredients = item.ingredients.split(',');
      for (ingredient in ingredients) {
        const liElement = document.createElement('li');
        liElement.textContent = ingredients[ingredient];
        ingredientData.appendChild(liElement);
      }

      const steps = item.steps.split('.');
      for (step in steps) {
        const liElement = document.createElement('li');
        liElement.textContent = steps[step];
        stepsData.appendChild(liElement);
      }
    });
  } catch (error) {
    console.error("Error", error);
  }
};
