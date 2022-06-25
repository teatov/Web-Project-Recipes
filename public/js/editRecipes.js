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

    showAlert("success", "Рецепт удалён");
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const createRecipe = async function (requestType, slug) {
  const form = new FormData();
  form.append("imageCover", document.getElementById("image").files[0]);
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
  const ingredients = [];
  ingredientNames.forEach((el, i) => {
    if (el.value) {
      ingredients.push({
        name: el.value,
        amount: ingredientAmounts[i].value.trim(),
      });
    }
  });

  const stepTexts = [...document.querySelectorAll(".steps-text")];
  const stepImages = [...document.querySelectorAll(".steps-image")];
  let number = 0;
  const steps = [];
  stepTexts.forEach((el, i) => {
    if (el.value) {
      number++;
      steps.push({ text: el.value, number });
      form.append("stepImage", stepImages[i].files[0]);
      form.append("stepNumbers", stepImages[i].files[0] ? i : "");
      form.append("stepTexts", el.value);
    }
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
  if (slug) {
    recipe.slug = slug;
  }
  try {
    const res = await axios({
      method: requestType,
      url: `/api/v1/recipes/`,
      data: recipe,
    });
    form.append("idRecipe", res.data.data.data._id);
    await axios({
      method: "PATCH",
      url: `/api/v1/recipes/${res.data.data.data._id}`,
      data: form,
    });

    showAlert(
      "success",
      requestType === "POST" ? "Рецепт создан" : "Рецепт обновлён"
    );
    location.assign(`/recipes/${res.data.data.data.slug}`);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const addElement = function (el, html) {
  el.insertAdjacentHTML("beforebegin", html);
};

export const removeElement = function (el) {
  el.parentElement.remove();
};

export const searchRecipe = function (search) {
  const contains = search || document.getElementById("contains").value;
  const dishType = document.getElementById("dish-type")?.value;
  const sortBy = document.getElementById("sort")?.value;

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
  location.assign(`/recipes?${params.toString()}`);
};

export const copyLink = function () {
  navigator.clipboard.writeText(window.location.href);
  showAlert("success", "Ссылка скопирована!");
};

export const addToBookmarks = async function (id) {
  try {
    await axios({
      method: "POST",
      url: `/api/v1/bookmarks`,
      data: { recipe: id },
    });

    showAlert("success", "Рецепт добавлен в ваши закладки");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const deleteBookmark = async function (id) {
  try {
    await axios({
      method: "DELETE",
      url: `/api/v1/bookmarks/${id}`,
    });

    showAlert("success", "Рецепт удалён из закладок");
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const printRecipe = function () {
  window.print();
};
