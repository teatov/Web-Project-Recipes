"use strict";

const modal = document.querySelector(".modal");
const modalContainerImage = document.querySelector(".modal img");
const btnCloseModal = document.querySelector(".modal button");
const modalImages = document.querySelectorAll(".modal-image");

const openModalImage = function (src) {
  modalContainerImage.src = src;
  modal.style.display = "flex";
};

const zoomModalImage = function () {
  modalContainerImage.classList.toggle("zoomed");
};

const closeModal = function () {
  modal.style.display = "none";
  modalContainerImage.classList.remove("zoomed");
};

modalImages.forEach((el) => {
  el.addEventListener("click", () => openModalImage(el.src));
});

btnCloseModal.addEventListener("click", closeModal);
modal.addEventListener("click", closeModal);
modalContainerImage.addEventListener("click", (e) => {
  e.stopPropagation();
  zoomModalImage();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal.style.display !== "none") {
    closeModal();
  }
});
