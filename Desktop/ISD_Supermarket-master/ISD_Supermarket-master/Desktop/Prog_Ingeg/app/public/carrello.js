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


function getCartProducts() {
  const token = getToken();
  const cartContainer = document.getElementById('cartContainer');

  fetch('http://localhost:4000/users/carrello', {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      return response.text();
    })
    .then(html => {
      cartContainer.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
    });
}


function emptyCart() {
  const cartContainer = document.getElementById('cartContainer');
  cartContainer.innerHTML = '<p>Nessun prodotto nel carrello.</p>';
}

const emptyCartButton = document.getElementById('emptyCartButton');
emptyCartButton.addEventListener('click', emptyCart);

getCartProducts();
