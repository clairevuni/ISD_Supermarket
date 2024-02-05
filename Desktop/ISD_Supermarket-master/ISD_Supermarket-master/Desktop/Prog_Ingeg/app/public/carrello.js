// Recupera il carrello dal local storage->devo riguardare


// Funzione per inserire dinamicamente gli elementi nella lista del carrello
/*function insertCartItems() {
  const cartContainer = document.getElementById('cartContainer');

  // Popola la lista del carrello
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const itemId = document.createElement('p');
    itemId.textContent = `Nome: ${item.id}`;

    const itemName = document.createElement('p');
    itemName.textContent = `Nome: ${item.name}`;

    const itemQuantity = document.createElement('p');
    itemQuantity.textContent = `Quantità: ${item.quantity}`;

    const itemPrice = document.createElement('p');
    itemPrice.textContent = `Prezzo: ${item.price}`;

    // Aggiungi gli elementi alla lista del carrello
    cartItem.appendChild(itemId);
    cartItem.appendChild(itemName);
    cartItem.appendChild(itemQuantity);
    cartItem.appendChild(itemPrice);

    // Aggiungi l'elemento alla lista del carrello
    cartContainer.appendChild(cartItem);
  });

  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCart);
});



  // Funzione per svuotare il carrello
  function emptyCart() {
    // Rimuovi tutti gli elementi dal carrello
    cart.length = 0;

    // Salva il carrello vuoto nel localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Rimuovi gli elementi dal DOM
    const cartContainer = document.getElementById('cartContainer');
    while (cartContainer.firstChild) {
      cartContainer.removeChild(cartContainer.firstChild);
    }
  }

  const emptyCartButton = document.getElementById('emptyCartButton');
  emptyCartButton.addEventListener('click', emptyCart);



}

// Chiamata alla funzione per inserire gli elementi nel carrello
insertCartItems();*/

// Recupera il carrello dal local storage
//const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funzione per inserire dinamicamente gli elementi nella lista del carrello
// Rimuovi la funzione insertCartItems attuale

// Aggiungi questa funzione per ottenere i prodotti del carrello

const cartContainer = document.getElementById('cartContainer');

function generateHTMLFromJSON(jsonData) {
  let html = '';

  // Verifica se il JSON contiene una chiave "products"
  if (jsonData.products && Array.isArray(jsonData.products)) {
    // Itera su ciascun prodotto nel JSON e genera HTML
    jsonData.products.forEach(product => {
      html += 
        <div class="product">
          <h2>${product.name}</h2>
          <p>Prezzo: ${product.price}</p>
          <p>Quantità: ${product.quantity}</p>
        </div>
      ;
    });
  } else {
    // Messaggio di errore se la struttura del JSON non è come atteso
    html = '<p>Errore: Struttura JSON non valida o dati mancanti.</p>';
  }

  return html;
}

// Funzione per ottenere i prodotti nel carrello dal server
function getCartProducts() {
  const token = getToken();

  fetch('http://localhost:4000/users/carrello', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore nella richiesta');
    }
    return response.json();
  })
  .then(data => {
    const productListHTML = generateHTMLFromJSON(data);
    cartContainer.innerHTML = productListHTML;
  })
  .catch(error => {
    console.error(error);
  });
}

// Chiamata alla funzione per ottenere gli elementi nel carrello
getCartProducts();

// Funzione per ottenere il token dal cookie
function getToken() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name.trim() === 'token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}
