document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // --- Hardcoded user accounts ---
    const users = [
        { username: 'JJ', password: 'admin' },
        { username: 'Waigoon', password: 'joi' },
        { username: 'Thimphu', password: 'Phayom' },
        { username: 'Meepooh', password: 'Meepooh' },
        { username: 'Win', password: 'Eovs' }
    ];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const foundUser = users.find(user => user.username === username && user.password === password);

        if (foundUser) {
            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'test.html';
        } else {
            errorMessage.style.display = 'block';
        }
    });
});
