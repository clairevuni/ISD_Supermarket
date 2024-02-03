// Recupera il carrello dal local storage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funzione per inserire dinamicamente gli elementi nella lista del carrello
function insertCartItems() {
  const cartContainer = document.getElementById('cartContainer');

  // Popola la lista del carrello
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const itemName = document.createElement('p');
    itemName.textContent = `Nome: ${item.name}`;

    const itemQuantity = document.createElement('p');
    itemQuantity.textContent = `Quantità: ${item.quantity}`;

    const itemPrice = document.createElement('p');
    itemPrice.textContent = `Prezzo: ${item.price}`;

    // Aggiungi gli elementi alla lista del carrello
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

// Funzione per gestire l'aggiunta al carrello
async function addToCart(event) {
  // Recupera l'id del prodotto dal bottone cliccato
  const productId = event.target.dataset.productId;

  // Effettua la richiesta al server per aggiungere il prodotto al carrello
  try {
    const response = await axios.post('/aggiungi-al-carrello', { productId });
    alert(response.data.message);  // Mostra un messaggio di successo
  } catch (error) {
    console.error(error);
    alert('Errore durante l\'aggiunta al carrello');  // Mostra un messaggio di errore
  }
}

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
insertCartItems();
