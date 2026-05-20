/**
 * Cliente asíncrono para la API Spring Boot.
 * Usa fetch con async/await para comunicación segura vía HTTPS.
 */

const API = {
    baseUrl: CONFIG.API_BASE_URL,
    token: localStorage.getItem('token') || null,

    /**
     * Realiza una petición HTTP asíncrona.
     * @param {string} path - Ruta del endpoint (ej: /auth/login)
     * @param {Object} options - Opciones de fetch
     * @returns {Promise<Response>}
     */
    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error('La petición tardó demasiado. Verifica la conexión.');
            }
            throw err;
        }
    },

    /**
     * Registra un nuevo usuario.
     * POST /auth/register
     */
    async register(username, password) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Error al registrar');
        }
    },

    /**
     * Inicia sesión y obtiene el token JWT.
     * POST /auth/login
     * @returns {Promise<{token: string}>}
     */
    async login(username, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        const text = await response.text();
        let data = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch (_) {
            data = { message: text };
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || text || 'Credenciales incorrectas');
        }

        this.token = data.token;
        localStorage.setItem('token', data.token);
        return data;
    },

    /**
     * Obtiene los datos del usuario autenticado.
     * GET /api/me (requiere Bearer token)
     */
    async getMe() {
        const response = await this.request('/api/me');

        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
                throw new Error('Sesión expirada');
            }
            throw new Error('Error al obtener datos del usuario');
        }

        return response.json();
    },

    /**
     * Verifica que el backend esté disponible.
     * GET /hello
     */
    async healthCheck() {
        const response = await this.request('/hello');
        return response.ok;
    },

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }
};
