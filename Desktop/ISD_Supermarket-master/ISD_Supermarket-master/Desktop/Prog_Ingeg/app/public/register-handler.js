// register-handler.js

// JavaScript code to handle form submission and redirection
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Make an AJAX request to the registration endpoint
  fetch('/register', {
    method: 'POST',
    body: new FormData(this), // Assuming your form contains username and password fields
  })
  .then(response => response.json())
  .then(data => {
    // Display the registration success message
    document.getElementById('registration-message').textContent = data.message;

    // Redirect to the specified URL
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Display error message or handle error as needed
    document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
    document.getElementById('errorModal').style.display = 'block';
  });
});
