const menu = document.querySelector(".menu");
const nav = document.querySelector(".navlinks");

menu.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".navlinks a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

document.getElementById("year").textContent = new Date().getFullYear();
