document.addEventListener("DOMContentLoaded", function () {
    const openModalButton = document.getElementById("openModalButton");
    const modal = document.getElementById("myModal");
  
    openModalButton.addEventListener("click", function () {
      modal.style.display = "block";
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });