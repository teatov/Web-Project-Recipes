"use strict";

const menu = document.querySelector(".header-nav");
const menuBtn = document.querySelector(".hamburger-menu");

const toggleMenu = function () {
  menu.classList.toggle("hidden");
};

menuBtn.addEventListener("click", toggleMenu);
