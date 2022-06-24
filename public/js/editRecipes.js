/* eslint-disable no-restricted-globals */
import axios from "axios";
import { showAlert } from "./alerts";

export const deleteRecipe = async function (slug) {
  try {
    await axios({
      method: "DELETE",
      url: `/api/v1/recipes/`,
      data: { slug },
    });

    showAlert("success", "Recipe deleted");
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const createRecipe = async function (requestType, slug) {
  const name = document.getElementById("name").value;
  const dishTypeSelect = document.getElementById("dish-type").value.split("/");
  const description = document.getElementById("description").value;
  const time = document.getElementById("time").value;
  const servings = document.getElementById("servings").value;
  const difficulty = document.getElementById("difficulty").value;
  const tags = document.getElementById("tags").value.split(",");

  const ingredientNames = [...document.querySelectorAll(".ingredients-name")];
  const ingredientAmounts = [
    ...document.querySelectorAll(".ingredients-amount"),
  ];
  const ingredients = ingredientNames.map((el, i) => {
    if (el.value) {
      return { name: el.value, amount: ingredientAmounts[i].value.trim() };
    }
    return null;
  });

  const stepTexts = [...document.querySelectorAll(".steps-text")];
  let number = 0;
  const steps = stepTexts.map((el, i) => {
    if (el.value) {
      number++;
      return { text: el.value, number };
    }
    return null;
  });

  const dishType = dishTypeSelect[0];
  const category = dishTypeSelect[1];
  const subcategory = dishTypeSelect[2] ? dishTypeSelect[2] : null;

  const recipe = {
    name,
    dishType,
    category,
    subcategory,
    description,
    properties: [
      {
        type: "time",
        value: time,
      },
      {
        type: "servings",
        value: servings,
      },
      {
        type: "difficulty",
        value: difficulty,
      },
    ],
    tags,
    ingredients,
    steps,
  };
  console.log(recipe, "111111111111", slug);
  try {
    const res = await axios({
      method: requestType,
      url: `/api/v1/recipes/`,
      data: { ...recipe, slug },
    });

    showAlert("success", "Recipe created");
    location.assign(`/recipes/${res.data.data.data.slug}`);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const addElement = function (el, html) {
  el.insertAdjacentHTML("beforebegin", html);
  console.log(
    el,
    el.previousElementSibling,
    el.previousElementSibling.querySelector("button")
  );
};

export const removeElement = function (el) {
  el.parentElement.remove();
};

export const searchRecipe = function (search) {
  const contains = search || document.getElementById("contains").value;
  const dishType = document.getElementById("dish-type")?.value;
  const sortBy = document.getElementById("sort")?.value;
  console.log(contains, dishType, sortBy);

  const query = {};
  if (contains) {
    query.search = contains.replace(" ", "+");
  }
  if (dishType) {
    const types = dishType.split("/");
    query.dishType = types[0];
    query.category = types[1];
    if (types[2]) {
      query.subcategory = types[2];
    }
  }
  if (sortBy !== "-createdAt") {
    query.sort = sortBy;
  }

  const params = new URLSearchParams(query);
  console.log(query, params.toString());
  location.assign(`/recipes?${params.toString()}`);
};
