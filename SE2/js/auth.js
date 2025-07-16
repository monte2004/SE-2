class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    login(email, password) {
        // In a real app, this would call an API
        const user = { email, name: "User" };
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

const auth = new Auth();