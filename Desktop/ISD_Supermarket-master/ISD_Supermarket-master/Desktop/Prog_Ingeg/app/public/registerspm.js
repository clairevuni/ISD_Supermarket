// registerspm.js

// JavaScript to handle registration
function registerSpm() {
    // Get values from input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Make axios.post request with dynamic data
    axios.post('http://localhost:4000/supermarkets/register-supermarket', {
      username: username,
      password: password
    })
    .then(response => {
      console.log(response.data);
  
      // Check for success and redirect if successful
      if (response.status === 200 && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    })
    .catch(error => {
      console.error(error);  // Handle error
    });
  }
  
  // registerspm.js
  
  // JavaScript to handle registration
  