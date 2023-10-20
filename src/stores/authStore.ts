import {defineStore} from 'pinia';

interface AuthenticationInfo {
    authToken: string | null;
    username: string | null;
    userId: bigint | null;
    role: string | null;
}

const buildExpirationTokenDate = (millis: number) => {
    const now = new Date().getTime();
    const newTime = now + millis;
    return new Date(newTime);
}

// @ts-ignore
export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticationInfo: null as AuthenticationInfo | null,
    }),
    persist: {
        storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
    },
    getters: {
        getUsername: (state) => state.authenticationInfo?.username || '',
        getUserRole: (state) => state.authenticationInfo?.role || '',
        getUserId: (state) => state.authenticationInfo?.userId || ''
    },

    actions: {
        saveAuthenticationInfo(data: any) {
            this.authenticationInfo = {
                authToken: data['auth_token'],
                userId: data['user_id'],
                username: data['username'],
                role: data['role'],
                tokenExpirationTimestamp: buildExpirationTokenDate(data['token_ttl_ms'])
            };
        },
        isAuthenticated(): boolean {
            return this.authenticationInfo?.authToken != null;
        },
        isTokenExpired(): boolean {
            const expirationDate: Date = this.authenticationInfo?.tokenExpirationTimestamp
            return new Date(expirationDate).getTime() < new Date().getTime();
        },
        getAuthToken(): string {
            return this.authenticationInfo?.authToken || '';
        },
        clearAuthData() {
            this.authenticationInfo = null;
        },
        isAdmin(): boolean {
            return this.authenticationInfo?.role.toLowerCase() === 'admin';
        },
        isDeveloper(): boolean {
            return this.authenticationInfo?.role.toLowerCase() === 'developer';
        },
        isUser(): boolean {
            return this.authenticationInfo?.role.toLowerCase() === 'user';
        },
        hasRole(aRole: string): boolean {
            return this.authenticationInfo?.role.toLowerCase() === aRole.toLowerCase();
        }
    },
});
