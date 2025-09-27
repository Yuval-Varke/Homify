// src/client/services/auth.ts

export const login = async (username: string, password: string): Promise<any> => {
    // Logic for logging in the user
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};

export const logout = async (): Promise<void> => {
    // Logic for logging out the user
    await fetch('/api/auth/logout', {
        method: 'POST',
    });
};