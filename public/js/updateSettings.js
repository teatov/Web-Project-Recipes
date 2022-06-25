/* eslint-disable no-restricted-globals */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { showAlert } from "./alerts";

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        type === "password"
          ? "Пароль успешно обновлён!"
          : "Данные успешно обновлены!"
      );
    }
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
