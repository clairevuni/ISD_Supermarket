// Recupera l'username dal local storage (se presente)
const username = JSON.parse(localStorage.getItem('username'));

// Recupera il numero di prodotti nel carrello dal localStorage
const cartCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;

// Ottieni l'elemento HTML dell'icona del carrello
const cartIcon = document.createElement('div');

// Aggiungi un event listener per la navigazione al carrello
cartIcon.addEventListener('click', () => {
  // Reindirizza alla pagina del carrello
  window.location.href = '/carrello';
});

// Aggiungi l'icona del carrello al body del documento
document.body.appendChild(cartIcon);

// Funzione per inserire dinamicamente le card dei prodotti
function insertProducts(products, username) {
  const productsContainer = document.getElementById('productsContainer');

  // Popolamento delle card
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;

    const name = document.createElement('h3');
    name.textContent = product.name;

    const productId = document.createElement('p');
    productId.textContent = `ID: ${product.id}`;

    const price = document.createElement('p');
    price.textContent = `Prezzo: ${product.price}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = '';

    const supermarketNameElement = document.createElement('p');
    supermarketNameElement.classList.add('username');
    //supermarketNameElement.textContent = `Supermercato: ${username}`;

    // Aggiungi un gestore di eventi per il clic sul bottone
    addToCartButton.addEventListener('click', () => {
      // Recupera il carrello dal local storage (se presente)
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Verifica se il prodotto è già nel carrello (in base all'ID)
      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        // Se il prodotto è già nel carrello, incrementa la quantità
        existingProduct.quantity += 1;
      } else {
        // Altrimenti, aggiungi il prodotto al carrello con la quantità 1
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }

      // Salva il carrello aggiornato nel local storage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Aggiorna il conteggio nell'icona del carrello
      const updatedCartCount = cart.reduce((total, item) => total + item.quantity, 0);
      const cartCountSpan = document.querySelector('.fa-shopping-cart + span');
      cartCountSpan.textContent = updatedCartCount;

      // Personalizza questa parte per gestire l'aggiunta del prodotto al carrello
      console.log(`Prodotto aggiunto al carrello: ${product.name}`);
    });

    // Aggiungi gli elementi alla card
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(productId);
    card.appendChild(price);
    card.appendChild(supermarketNameElement); // Aggiunto qui
    card.appendChild(addToCartButton);

    // Aggiungi la card al contenitore
    productsContainer.appendChild(card);
  });
}

// Richiedi al server di ottenere i prodotti
fetch('/get-products')
  .then(response => response.json())
  .then(data => insertProducts(data, username)) // Passa l'username dinamico alla funzione
  .catch(error => console.error('Error fetching products:', error));
