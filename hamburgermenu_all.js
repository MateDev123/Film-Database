const gpopupContainer = document.querySelector(".gpopup-container");
const openButton = document.querySelector(".open-gpopup-button");
const closeButton = document.querySelector(".close-gpopup");

openButton.addEventListener("click", function() {
  gpopupContainer.style.display = "block";
  gpopupContainer.style.bottom = "0";
});

closeButton.addEventListener("click", function() {
  gpopupContainer.style.bottom = "-100%";
  gpopupContainer.style.display = "none";
});

gpopupContainer.addEventListener("click", function(e) {
  if (e.target === gpopupContainer) {
    gpopupContainer.style.bottom = "-100%";
    gpopupContainer.style.display = "none";
  }
});