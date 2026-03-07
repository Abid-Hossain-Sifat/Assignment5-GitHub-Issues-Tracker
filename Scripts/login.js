document.getElementById('signIn-btn').addEventListener('click', function () {
    const textInput = document.getElementById('user-input');
    const userInput = textInput.value;

    const passInput = document.getElementById('pass-input');
    const password = passInput.value;

    if (userInput === 'admin' && password === 'admin123') {
        alert('login success');
        window.location.assign("./dashboard.html");
    } else {
        alert('login failed');
        return;
    }
});