// menu.js

$(document).ready(function() {
    // Array dei link del menu
    const menuItems = [
      { label: 'Chi siamo', link: '#' },
      { label: 'Cosa vendiamo', link: '#' },
      { label: 'Contatti', link: '#' },
      { label: 'Loggati', link: '/login' }
    ];
  
    // Genera dinamicamente i link del menu
    const menuElement = $('#menu');
    menuItems.forEach(item => {
      const linkElement = $('<a>').attr('href', item.link).text(item.label);
      menuElement.append(linkElement);
    });
  });
  