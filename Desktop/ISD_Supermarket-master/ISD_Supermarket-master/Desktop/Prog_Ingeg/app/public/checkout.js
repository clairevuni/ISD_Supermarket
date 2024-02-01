document.addEventListener('DOMContentLoaded', function () {
    // Recupera il carrello dal local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Funzione per inserire dinamicamente gli elementi nel riepilogo dell'ordine
    function insertCheckoutItems() {
      const checkoutContainer = document.getElementById('checkout-content');
  
      // Popola il riepilogo dell'ordine
      cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.classList.add('checkout-item');
  
        const itemName = document.createElement('p');
        itemName.textContent = `Nome: ${item.name}`;
  
        const itemPrice = document.createElement('p');
        itemPrice.textContent = `Prezzo: ${item.price}`;
        
         const itemQuantity = document.createElement('p');
        itemQuantity.textContent = `Quantità: ${item.quantity}`;
  
        // Aggiungi gli elementi al riepilogo dell'ordine
        checkoutItem.appendChild(itemName);
        checkoutItem.appendChild(itemPrice);
        checkoutItem.appendChild(itemQuantity);
  
        // Aggiungi l'elemento al riepilogo dell'ordine
        checkoutContainer.appendChild(checkoutItem);
      });
    }
  
    // Chiamata alla funzione per inserire gli elementi nel riepilogo dell'ordine
    insertCheckoutItems();

// Funzione per aprire la modal di pagamento
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
  }
  
  // Funzione per chiudere la modal di pagamento
  function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
  }
  
  // Funzione per processare il pagamento (da implementare)
  function processPayment() {
    // Qui dovresti implementare la logica per processare il pagamento
    // Ad esempio, puoi fare una richiesta al tuo server per elaborare il pagamento
    // e visualizzare un messaggio di conferma nella modal.
    alert('Pagamento confermato! Grazie per il tuo ordine.');
    closePaymentModal();
  }

  });
  



  