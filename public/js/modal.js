export const openModalImage = function (src, modalContainerImage, modal) {
  modalContainerImage.src = src;
  modal.style.display = "flex";
};

export const zoomModalImage = function (modalContainerImage) {
  modalContainerImage.classList.toggle("zoomed");
};

export const closeModal = function (modalContainerImage, modal) {
  modal.style.display = "none";
  modalContainerImage.classList.remove("zoomed");
};
