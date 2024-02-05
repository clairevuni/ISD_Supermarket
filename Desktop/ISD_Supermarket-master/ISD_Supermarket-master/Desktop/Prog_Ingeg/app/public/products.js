
const cartCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;

const cartIcon = document.createElement('div');
cartIcon.style = 'position: fixed; top: 10px; right: 10px; cursor: pointer;';
cartIcon.innerHTML = `<i class="fas fa-shopping-cart"></i> <span>${cartCount}</span>`;

cartIcon.addEventListener('click', () => {
  window.location.href = '/carrello';
});

document.body.appendChild(cartIcon);

function insertProducts(products) {
  console.log('Chiamato insertProducts con i seguenti prodotti:', products);
  const productsContainer = document.getElementById('productsContainer');

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
    addToCartButton.textContent = 'Aggiungi al Carrello';

    addToCartButton.addEventListener('click', () => {
      console.log(`Prodotto aggiunto al carrello: ${product.name} - ID: ${product.id}`);
      console.log('Token prima di addToCart:', getToken());
      addToCart(product.id);
      
    });

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(productId);
    card.appendChild(price);
    card.appendChild(addToCartButton);


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
      return decodeURIComponent(value); 
    }
  }

  return null;
}



function addToCart(productId, callback) {
  const token = getToken(); 
  //console.log(token);
  if (token) {
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
      })
      .catch(error => {
        console.error('Errore durante l\'aggiunta al carrello1:', error);
      });
  } else {
    console.error("Token non definito");
  }
}


fetch('/get-products')
  .then(response => response.json())
  .then(data => insertProducts(data))
  .catch(error => console.error('Error fetching products:', error));
