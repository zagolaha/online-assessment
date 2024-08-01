function handleLogin() {
    const token = document.getElementById('token').value;
    console.log('Attempting login with token:', token);

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            localStorage.setItem('user_id', data.user_id);
            console.log('Redirecting to LandingPage');
            window.location.href = '/LandingPage';
        } else {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            } else {
                console.error('Error message element not found');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        handleLogin();
    });
});
