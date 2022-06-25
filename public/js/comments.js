/* eslint-disable no-restricted-globals */
import axios from "axios";
import { showAlert } from "./alerts";

export const createComment = async function (text, slug) {
  try {
    await axios({
      method: "POST",
      url: `/api/v1/comments`,
      data: {
        text,
        slug,
      },
    });

    showAlert("success", "Comment sent");
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const editRecipe = function (src, modalContainerImage, modal) {
  modalContainerImage.src = src;
  modal.style.display = "flex";
};
