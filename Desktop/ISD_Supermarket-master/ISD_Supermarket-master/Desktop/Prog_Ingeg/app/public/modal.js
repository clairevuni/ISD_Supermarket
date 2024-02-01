document.addEventListener("DOMContentLoaded", function () {
  const openModalButton = document.getElementById("openModalButton");
  const modal = document.getElementById("myModal");

  openModalButton.addEventListener("click", function () {
    modal.style.display = "block";
    modal.classList.add("small-modal"); // Aggiungi la classe per la modal più piccola
  });

  // Chiudi la modal cliccando fuori o sull'icona "x"
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Chiudi la modal cliccando sull'icona "x"
  const closeIcon = document.createElement("span");
  closeIcon.innerHTML = "&times;"; // Carattere "x"
  closeIcon.classList.add("close-icon");
  modal.appendChild(closeIcon);

  closeIcon.addEventListener("click", closeModal);

  // Funzione per chiudere la modal
  function closeModal() {
    modal.style.display = "none";
    modal.classList.remove("small-modal"); // Rimuovi la classe per la modal più piccola
  }
});
