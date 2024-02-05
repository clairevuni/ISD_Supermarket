// menu.js ->non sono sicura che serva

$(document).ready(function() {
    
    $("#menu a").on("click", function(event) {
      
      event.preventDefault();
  
      
      var target = $(this).attr("href");
  
      
      $("html, body").animate({
        scrollTop: $(target).offset().top
      }, 800);
    });
  });
  