/**
 * Lógica de la aplicación - Cliente asíncrono.
 * Conecta la UI con la API Spring Boot vía fetch.
 */

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const messageEl = document.getElementById('message');

function showMessage(text, type = 'success') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
}

function hideMessage() {
    messageEl.classList.add('hidden');
}

function showView(section) {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    section.classList.remove('hidden');
}

async function loadDashboard() {
    showView(dashboardSection);
    welcomeMessage.textContent = 'Cargando...';

    try {
        const data = await API.getMe();
        welcomeMessage.textContent = `¡Hola, ${data.username}!`;
    } catch (err) {
        showMessage(err.message, 'error');
        showView(loginSection);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    hideMessage();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showMessage('Completa todos los campos', 'error');
        return;
    }

    try {
        await API.login(username, password);
        showMessage('Inicio de sesión exitoso', 'success');
        await loadDashboard();
    } catch (err) {
        showMessage(err.message || 'Error al iniciar sesión', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    hideMessage();

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        showMessage('Completa todos los campos', 'error');
        return;
    }

    try {
        await API.register(username, password);
        showMessage('Cuenta creada. Inicia sesión.', 'success');
        showView(loginSection);
        document.getElementById('login-username').value = username;
    } catch (err) {
        showMessage(err.message || 'Error al registrar', 'error');
    }
}

function handleLogout() {
    API.logout();
    hideMessage();
    showView(loginSection);
    loginForm.reset();
}

function init() {
    if (API.token) {
        loadDashboard();
    } else {
        showView(loginSection);
    }

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        hideMessage();
        showView(registerSection);
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        hideMessage();
        showView(loginSection);
    });
}

init();
