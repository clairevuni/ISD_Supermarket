// register.js

// JavaScript to handle registration
function registerUser() {
  // Get values from input fields
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Make axios.post request with dynamic data
  axios.post('http://localhost:4000/users/register', {
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

// register.js

// JavaScript to handle registration

