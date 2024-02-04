
// Recupera il numero di prodotti nel carrello dal localStorage
const cartCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;

// Ottieni l'elemento HTML dell'icona del carrello
const cartIcon = document.createElement('div');
cartIcon.style = 'position: fixed; top: 10px; right: 10px; cursor: pointer;';
cartIcon.innerHTML = `<i class="fas fa-shopping-cart"></i> <span>${cartCount}</span>`;

// Aggiungi un event listener per la navigazione al carrello
cartIcon.addEventListener('click', () => {
  // Reindirizza alla pagina del carrello
  window.location.href = '/carrello';
});

// Aggiungi l'icona del carrello al body del documento
document.body.appendChild(cartIcon);

// Funzione per inserire dinamicamente le card dei prodotti
function insertProducts(products) {
  console.log('Chiamato insertProducts con i seguenti prodotti:', products);
  const productsContainer = document.getElementById('productsContainer');

  // Popolamento delle card
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const image = document.createElement('img');
    image.src = product.image; // Assicurati che l'oggetto prodotto abbia una proprietà 'image' con il percorso dell'immagine
    image.alt = product.name;

    const name = document.createElement('h3');
    name.textContent = product.name;

    const productId = document.createElement('p');
    productId.textContent = `ID: ${product.id}`;

    const price = document.createElement('p');
    price.textContent = `Prezzo: ${product.price}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Aggiungi al Carrello';

    // Aggiungi un gestore di eventi per il clic sul bottone
    addToCartButton.addEventListener('click', () => {
      console.log(`Prodotto aggiunto al carrello: ${product.name} - ID: ${product.id}`);
      // Richiama la funzione addToCart con l'ID del prodotto
      console.log('Token prima di addToCart:', getToken());
      addToCart(product.id);
      // Personalizza questa parte per gestire l'aggiunta del prodotto al carrello
      
    });

    // Aggiungi gli elementi alla card
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(productId);
    card.appendChild(price);
    card.appendChild(addToCartButton);

    // Aggiungi la card al contenitore
    productsContainer.appendChild(card);
  });
}

function getToken() {
  const cookies = document.cookie.split(';');
  console.log('Cookies:', cookies);

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    console.log('Name:', name.trim(), 'Value:', value);

    if (name.trim() === 'token') {
      return decodeURIComponent(value); // Decodifica il valore del cookie
    }
  }

  return null;
}



// Funzione per aggiungere al carrello
function addToCart(productId, callback) {
  const token = getToken(); // Ottieni il token di autenticazione dai cookie
  //console.log(token);
  if (token) {
    // Nota: Aggiorna il percorso API in base alla tua configurazione
    fetch('http://localhost:3000/aggiungi-al-carrello', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (callback) {
          callback();
        }
        // Puoi gestire la risposta, ad esempio aggiornare la visualizzazione del carrello
      })
      .catch(error => {
        console.error('Errore durante l\'aggiunta al carrello1:', error);
      });
  } else {
    console.error("Token non definito");
  }
}




// Richiedi al server di ottenere i prodotti
fetch('/get-products')
  .then(response => response.json())
  .then(data => insertProducts(data))
  .catch(error => console.error('Error fetching products:', error));
