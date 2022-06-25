/* eslint-disable no-restricted-globals */
import axios from "axios";

const addTypeBtn = document.querySelector(".type-add");
const deleteTypeBtns = document.querySelectorAll(".type-delete");
const addCategoryBtns = document.querySelectorAll(".category-add");
const deleteCategoryBtns = document.querySelectorAll(".category-delete");
const addSubcategoryBtns = document.querySelectorAll(".subcategory-add");
const deleteSubcategoryBtns = document.querySelectorAll(".subcategory-delete");
const newTypeNameInput = document.getElementById("new-type-name");

addTypeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await axios({
    method: "POST",
    url: `/api/v1/dishTypes`,
    data: {
      name: newTypeNameInput.value,
    },
  });
  location.reload();
});

deleteTypeBtns.forEach((el) => {
  el.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(el.parentElement.dataset.id);
    await axios({
      method: "DELETE",
      url: `/api/v1/dishTypes/${el.parentElement.dataset.id}`,
    });
    location.reload();
  });
});

addCategoryBtns.forEach((el) => {
  el.addEventListener("click", async (e) => {
    e.preventDefault();
    await axios({
      method: "POST",
      url: `/api/v1/dishTypes/${el.parentElement.dataset.id}`,
      data: {
        name: newTypeNameInput.value,
      },
    });
    location.reload();
  });
});

deleteCategoryBtns.forEach((el) => {
  el.addEventListener("click", async (e) => {
    e.preventDefault();
    await axios({
      method: "DELETE",
      url: `/api/v1/dishTypes/${el.parentElement.parentElement.dataset.id}/${el.parentElement.dataset.id}`,
    });
    location.reload();
  });
});

addSubcategoryBtns.forEach((el) => {
  el.addEventListener("click", async (e) => {
    e.preventDefault();
    await axios({
      method: "POST",
      url: `/api/v1/dishTypes/${el.parentElement.parentElement.dataset.id}/${el.parentElement.dataset.id}`,
      data: {
        name: newTypeNameInput.value,
      },
    });
    location.reload();
  });
});

deleteSubcategoryBtns.forEach((el) => {
  el.addEventListener("click", async (e) => {
    e.preventDefault();
    await axios({
      method: "DELETE",
      url: `/api/v1/dishTypes/${el.parentElement.parentElement.parentElement.dataset.id}/${el.parentElement.parentElement.dataset.id}/${el.parentElement.dataset.id}`,
    });
    location.reload();
  });
});
