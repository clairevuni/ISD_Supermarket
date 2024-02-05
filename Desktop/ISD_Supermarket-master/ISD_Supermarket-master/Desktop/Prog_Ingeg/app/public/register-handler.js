// register-handler.js serve per evitare gli script inline nella register


document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  
  fetch('/register', {
    method: 'POST',
    body: new FormData(this), 
  })
  .then(response => response.json())
  .then(data => {
    
    document.getElementById('registration-message').textContent = data.message;

   
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    
    document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
    document.getElementById('errorModal').style.display = 'block';
  });
});
