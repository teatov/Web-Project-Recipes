/* eslint-disable no-restricted-globals */
/* eslint-disable node/no-missing-import */
/* eslint-disable import/no-unresolved */
import { login, logout, signup } from "./auth";
import { updateSettings } from "./updateSettings";
import { openModalImage, zoomModalImage, closeModal } from "./modal";
import {
  deleteRecipe,
  createRecipe,
  addElement,
  removeElement,
  searchRecipe,
} from "./editRecipes";
import { createComment } from "./comments";

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".logout-btn");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const menu = document.querySelector(".header-nav");
const menuBtn = document.querySelector(".hamburger-menu");
const modalImages = document.querySelectorAll(".modal-image");
const btnCloseModal = document.querySelector(".modal button");
const modalContainerImage = document.querySelector(".modal img");
const modal = document.querySelector(".modal");
const recipeDeleteBtns = document.querySelectorAll(".delete-recipe");
const sendCommentBtn = document.querySelector(".send-comment");
const recipeCreateForm = document.querySelector(".recipe-create-form");
const addIngredientBtn = document.querySelector(".add-ingredient");
const addStepBtn = document.querySelector(".add-step");
const removeIngredientBtns = document.querySelectorAll(".remove-ingredient");
const removeStepBtns = document.querySelectorAll(".remove-step");
const recipeUpdateForm = document.querySelector(".recipe-update-form");
const searchHeader = document.querySelector(".search-header");
const searchForm = document.querySelector(".search-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    signup(name, email, password, passwordConfirm);
  });
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    updateSettings({ name, email }, "data");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById(
      "password-new-confirm"
    ).value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.getElementById("password-current").value = "";
    document.getElementById("password-new").value = "";
    document.getElementById("password-new-confirm").value = "";
  });
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

if (modalImages) {
  modalImages.forEach((el) => {
    el.addEventListener("click", () =>
      openModalImage(el.src, modalContainerImage, modal)
    );
  });

  btnCloseModal.addEventListener("click", () => {
    closeModal(modalContainerImage, modal);
  });
  modal.addEventListener("click", () => {
    closeModal(modalContainerImage, modal);
  });
  modalContainerImage.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomModalImage(modalContainerImage);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display !== "none") {
      closeModal(modalContainerImage, modal);
    }
  });
}

if (recipeDeleteBtns) {
  recipeDeleteBtns.forEach((el) => {
    el.addEventListener("click", () => deleteRecipe(el.dataset.recipe));
  });
}

if (sendCommentBtn) {
  sendCommentBtn.addEventListener("click", () => {
    const commentText = document.querySelector(".comment-text").value;
    console.log(commentText);
    createComment(commentText, sendCommentBtn.dataset.recipe);
    document.querySelector(".comment-text").value = "";
  });
}

if (recipeCreateForm) {
  recipeCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    createRecipe("POST", null);
  });
}

if (addIngredientBtn) {
  addIngredientBtn.addEventListener("click", () => {
    addElement(
      addIngredientBtn.parentElement,
      `<div class="flex justify-space-between align-flex-end">
      <textarea
        class="flex-grow comment-text ingredients-name"
        name=""
        rows="1"
      ></textarea>
      <div>
        <h3>Количество:</h3>
        <input
          type="text"
          name=""
          class="ingredients-amount input-narrow no-flex-grow"
        />
      </div>
      <button type="button" class="bg-orange remove-ingredient">
        <span class="icon icon--cross"></span>
      </button>
    </div>`
    );
    addIngredientBtn.parentElement.previousElementSibling
      .querySelector("button")
      .addEventListener("click", function () {
        console.log(this.parentElement);
        removeElement(this);
      });
  });
}

if (addStepBtn) {
  addStepBtn.addEventListener("click", () => {
    addElement(
      addStepBtn.parentElement,
      `<div class="flex justify-space-between align-flex-end">
      <textarea
        class="flex-grow comment-text steps-text"
        name=""
        rows="1"
      ></textarea>
      <div class="flex flex-column">
        <h3>Фотография:</h3>
        <label for="image" class="file-upload btn">
          <span class="icon icon--plus"></span>
          Загрузить файл...
        </label>
        <input
          type="file"
          accept="image/png, image/jpg, image/gif, image/jpeg"
          name=""
          class="steps-images"
        />
      </div>
      <button type="button" class="bg-orange remove-step">
        <span class="icon icon--cross"></span>
      </button>
    </div>`
    );
    addStepBtn.parentElement.previousElementSibling
      .querySelector("button")
      .addEventListener("click", function () {
        console.log(this.parentElement);
        removeElement(this);
      });
  });
}

if (removeIngredientBtns) {
  removeIngredientBtns.forEach((el) => {
    console.log(el);
    el.addEventListener("click", () => removeElement(el));
  });
}

if (removeStepBtns) {
  removeStepBtns.forEach((el) => {
    el.addEventListener("click", () => removeElement(el));
  });
}

if (recipeUpdateForm) {
  recipeUpdateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    createRecipe("PATCH", recipeUpdateForm.dataset.recipe);
  });
}

if (searchHeader) {
  searchHeader.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = document.getElementById("search-header-text").value;
    searchRecipe(search);
  });
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchRecipe();
  });
}
