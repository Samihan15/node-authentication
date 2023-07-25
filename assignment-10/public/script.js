const login = document.getElementById('login');
const register = document.getElementById('signin');

login.addEventListener('click', loginUser);
register.addEventListener('click', registerUser);

function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };
    console.log(data);

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(res => {
        if (res.status === 200) {
            // Redirect to '/home' on successful login
            window.location.href = '/home.html';
        } else {
            // Handle login failure (status code other than 200)
            alert('Login failed');
            window.location.href = '/signin.html';
        }
    })
    .catch(err => {
        // Handle fetch error (network error, server not reachable, etc.)
        console.error(err);
        alert('An error occurred while processing the request');
    });
};

