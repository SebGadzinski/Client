import {boot} from 'quasar/wrappers'
import axios from 'axios'
import TokenService from '../services/token.service';
import AuthService from '../services/auth.service';

import eventBus from '../services/EventBus';


// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
        baseURL: `${
        process.env.SERVER_DOMAIN
    }`,
    timeout: 15000,
})

api.interceptors.request.use((config) => {
    const token = TokenService.getLocalToken();
    if (token) { // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers['authorization'] = token; // for Node.js Express back-end
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    //IP Blocked
    if (err.response.status === 499){
        window.location = 'ipblocked';
    }
    const originalConfig = err.config;
    if ((!originalConfig.url.includes('auth') || originalConfig.url === '/auth/sendEmailConfirmation') && err.response) { // Access Token was expired

        if (err.response.status === 401 && !originalConfig._retry) {
            if (originalConfig.url == '/auth/refresh') {
                AuthService.logout();
                return
            }
            originalConfig._retry = true;
            console.log(originalConfig)
            try {
                const rs = await api.post('/auth/refresh', {token: TokenService.getLocalRefreshToken()});
                if (!rs || !rs.data.success) {
                    AuthService.logout();
                    return
                }

                // Success, can refresh token
                console.log(rs.data);
                const {token, refreshToken, user} = rs.data.data;
                eventBus.dispatch('auth/refresh', token);

                TokenService.setUser(user);
                TokenService.setLocalRefreshToken(refreshToken);
                TokenService.setLocalToken(token);

                return api(originalConfig);
            } catch (error) {
                console.log(error)
                return Promise.reject(error);
            }
        }

        if(err.response.status === 403){
            window.location = '/error';
        }
    }

    return Promise.reject(err);
});


export default boot(({app}) => { // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
})

export {
    api
}
