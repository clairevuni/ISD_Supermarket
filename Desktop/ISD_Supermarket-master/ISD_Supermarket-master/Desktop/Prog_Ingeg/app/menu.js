// menu.js

$(document).ready(function() {
    // Aggiungi un gestore di eventi per i link del menu
    $("#menu a").on("click", function(event) {
      // Impedisci il comportamento predefinito del link
      event.preventDefault();
  
      // Ottieni l'ID dell'ancora a cui si deve scorrere
      var target = $(this).attr("href");
  
      // Esegui uno scorrimento verticale alla sezione corrispondente
      $("html, body").animate({
        scrollTop: $(target).offset().top
      }, 800); // L'800 è la durata dell'animazione in millisecondi
    });
  });
  