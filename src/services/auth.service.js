import {api} from '../boot/axios';
import TokenService from './token.service';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';

class AuthService {
    /**
     * Logs user in
     * @param {String} email
     * @param {String} password
     * @returns Logged in user
     */
    login(email, password) {
        console.log(`"${email}" "${password}"`);
        return api.post('/auth', {email, password}).then((response) => {
            if (response.data.success) {
                TokenService.setUser(response.data.data.user);
                TokenService.setLocalToken(response.data.data.token);
                return response.data.data.user;
            }else{
                throw new Error(response.data?.message ?? response);
            }
        });
    }
     /**
     * Signs a user up using their email and password.
     * @param {Object} params - Object containing email, password and confirmPassword.
     * @param {string} params.email - User's email.
     * @param {string} params.password - User's password.
     * @param {string} params.confirmPassword - Confirmation of user's password.
     * @throws Will throw an error if passwords do not match.
     * @returns {Promise} A promise that resolves if the sign-up is successful, otherwise rejects with an error message.
     */
    signUp({email, password, confirmPassword}) {
        if(password !== confirmPassword) throw new Error("Passwords not matching");
        console.log(`"${email}" Signing Up...`)
        return api.post('/auth/signUp', {email, password}
        ).then((response) => {
            if(response.data.success){
                return;
            }else{
                throw new Error(response.data.message);
            }
        });
    }
    /**
     * Sends reset password email to users email
     * @param {String} email
     * @returns
     */
    forgotPassword(email){
        if(!email || email.length < 3 || !email.includes("@")) throw new Error("Invalid Email");
        console.log(`Sending Password Reset: "${email}"`)
        return api.post('/auth/sendEmailResetPassword', {email}
        ).then((response) => {
            if(response.data.success){
                return;
            }else{
                throw new Error(response.data.message);
            }
        });
    }
    /**
     * Sends reset password info to server to reset the passsword attached to this token
     * @param {String} newPassword
     * @param {String} token
     * @returns
     */
    resetPassword(newPassword, token){
        return api.post(`/auth/${token}/resetPassword`, {password: newPassword}
        ).then((response) => {
            if(response.data.success){
                return;
            }else{
                throw new Error(response.data.message);
            }
        });
    }
    sendEmailConfirmation(){
        return api.post(`/auth/sendEmailConfirmation`
        ).then((response) => {
            if(response.data.success){
                return;
            }else{
                throw new Error(response.data.message);
            }
        });
    }
    confirmEmail(token){
        return api.post(`/auth/${token}/confirmEmail`
        ).then((response) => {
            if(response.data.success){
                return;
            }else{
                throw new Error(response.data.message);
            }
        });
    }
    async refreshSession(){
        const rs = await api.post('/auth/refresh', {token: TokenService.getLocalRefreshToken()});
        console.log(rs);
        if (!rs || !rs.data.success) {
            this.logout();
            return;
        }

        // Success, can refresh token
        console.log(rs.data);
        const {token, refreshToken, user} = rs.data.data;

        TokenService.setUser(user);
        TokenService.setLocalRefreshToken(refreshToken);
        TokenService.setLocalToken(token);
    }
    /**
     * Logs user out and removes token
     */
    async logout(reload = true) {
        TokenService.removeUser();
        if (Capacitor.getPlatform() != 'web') {
            try {
                let file = await Preferences.clear()
            } catch (e) {}
            if(reload) location.reload()
        } else {
            if(reload) location.reload()
        }
    }
}

export default new AuthService();
