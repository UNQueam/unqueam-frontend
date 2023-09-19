import {defineStore} from 'pinia';

interface AuthenticationInfo {
    authToken: string | null;
    username: string | null;
    userId: bigint | null;
    role: string | null;
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
        isAuthenticated: (state) => state.authenticationInfo?.authToken !== null,
        getAuthToken: (state) => state.authenticationInfo?.authToken || '',
        getUsername: (state) => state.authenticationInfo?.username || '',
        getUserRole: (state) => state.authenticationInfo?.role || ''
    },

    actions: {
        saveAuthenticationInfo(data: any) {
            console.log(data)
            this.authenticationInfo = {
                authToken: data['auth_token'],
                userId: data['user_id'],
                username: data['username'],
                role: data['role']
            };
        },

        clearAuthData() {
            this.authenticationInfo = null;
        },
    },
});
