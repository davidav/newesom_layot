//=== Menu burger ===
let iconMenu = document.querySelector(".icon-menu");
let menuBody = document.querySelector(".menu__body");
iconMenu.addEventListener("click", (e) => {
  iconMenu.classList.toggle("_active");
  menuBody.classList.toggle("_active");
});
menuBody.addEventListener("click", (e) => {
  iconMenu.classList.remove("_active");
  menuBody.classList.remove("_active");
});

//=== / Menu burger ===

