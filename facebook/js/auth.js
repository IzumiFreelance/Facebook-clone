// Advanced Authentication Module for Nexus
class AuthenticationManager {
    constructor() {
        this.currentUser = null;
        this.tokenKey = 'nexus_auth_token';
        this.userKey = 'nexus_user';
        this.sessionTimeout = 3600000; // 1 hour
        this.refreshThreshold = 300000; // 5 minutes
        this.initializeFromStorage();
    }

    // Initialize user session from storage
    initializeFromStorage() {
        const storedUser = localStorage.getItem(this.userKey);
        const storedToken = localStorage.getItem(this.tokenKey);
        
        if (storedUser && storedToken) {
            try {
                this.currentUser = JSON.parse(storedUser);
                if (this.isTokenValid(storedToken)) {
                    this.setupAutoRefresh();
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Session initialization failed:', error);
                this.logout();
            }
        }
    }

    // Token validation
    isTokenValid(token) {
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            return tokenData.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    // Auto refresh session
    setupAutoRefresh() {
        setInterval(() => {
            const token = localStorage.getItem(this.tokenKey);
            if (token) {
                try {
                    const tokenData = JSON.parse(atob(token.split('.')[1]));
                    const timeUntilExpiry = tokenData.exp * 1000 - Date.now();
                    
                    if (timeUntilExpiry < this.refreshThreshold) {
                        this.refreshToken();
                    }
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            }
        }, 60000); // Check every minute
    }

    // Refresh authentication token
    async refreshToken() {
        try {
            const response = await this.makeAuthRequest('/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(this.tokenKey)}`
                }
            });

            if (response.token) {
                localStorage.setItem(this.tokenKey, response.token);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            return false;
        }
    }

    // Make authenticated API request
    async makeAuthRequest(endpoint, options = {}) {
        const baseUrl = 'https://api.nexus.com'; // Replace with actual API URL
        const url = `${baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password, rememberMe = false) {
        try {
            // For demo purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate server response
            const response = {
                token: this.generateDemoToken(),
                user: {
                    id: Math.floor(Math.random() * 10000),
                    email,
                    name: email.split('@')[0],
                    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`,
                    preferences: {
                        theme: 'light',
                        notifications: true,
                        language: 'en'
                    },
                    roles: ['user'],
                    createdAt: new Date().toISOString()
                }
            };

            // Store authentication data
            this.currentUser = response.user;
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response.user));

            if (rememberMe) {
                this.setupPersistentSession();
            }

            this.setupAutoRefresh();
            return response.user;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Invalid credentials');
        }
    }

    // Generate demo token
    generateDemoToken() {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + 3600,
            iat: Math.floor(Date.now() / 1000),
            sub: 'demo-user'
        }));
        const signature = btoa('demo-signature');
        return `${header}.${payload}.${signature}`;
    }

    // Setup persistent session
    setupPersistentSession() {
        const refreshToken = this.generateDemoToken();
        localStorage.setItem('nexus_refresh_token', refreshToken);
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem('nexus_refresh_token');
        window.location.href = '/login.html';
    }

    // Register new user
    async register(userData) {
        try {
            // For demo purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Validate user data
            if (!this.validateUserData(userData)) {
                throw new Error('Invalid user data');
            }

            // Simulate server response
            const response = {
                token: this.generateDemoToken(),
                user: {
                    id: Math.floor(Math.random() * 10000),
                    ...userData,
                    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${userData.email}`,
                    preferences: {
                        theme: 'light',
                        notifications: true,
                        language: 'en'
                    },
                    roles: ['user'],
                    createdAt: new Date().toISOString()
                }
            };

            // Store authentication data
            this.currentUser = response.user;
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response.user));

            return response.user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    // Validate user data
    validateUserData(userData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!userData.email || !emailRegex.test(userData.email)) {
            throw new Error('Invalid email address');
        }

        if (!userData.password || !passwordRegex.test(userData.password)) {
            throw new Error('Password must be at least 8 characters long and contain both letters and numbers');
        }

        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        return true;
    }

    // Reset password
    async resetPassword(email) {
        try {
            // For demo purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate password reset email
            console.log(`Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        }
    }

    // Update user profile
    async updateProfile(profileData) {
        try {
            if (!this.currentUser) {
                throw new Error('User not authenticated');
            }

            // For demo purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update user data
            const updatedUser = {
                ...this.currentUser,
                ...profileData,
                updatedAt: new Date().toISOString()
            };

            this.currentUser = updatedUser;
            localStorage.setItem(this.userKey, JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser && !!localStorage.getItem(this.tokenKey);
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser?.roles?.includes(role) || false;
    }
}

// Notification Manager for auth-related notifications
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}

// Form Validator
class FormValidator {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validatePassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    }

    static validateName(name) {
        return name.length >= 2 && name.length <= 50;
    }

    static validateForm(formData) {
        const errors = {};

        if (!formData.email || !this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password || !this.validatePassword(formData.password)) {
            errors.password = 'Password must be at least 8 characters long and contain both letters and numbers';
        }

        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.name && !this.validateName(formData.name)) {
            errors.name = 'Name must be between 2 and 50 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Initialize authentication system
const auth = new AuthenticationManager();
const notifications = new NotificationManager();

// Export modules
export { auth, notifications, FormValidator };
