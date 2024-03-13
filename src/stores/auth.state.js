import AuthService from "../services/auth.service";
import { defineStore } from "pinia";

/**
 * Initial user state fetched from local storage.
 * @type {Object}
 */
const user = JSON.parse(localStorage.getItem("user"));

/**
 * The initial state of the authentication.
 * @type {Object}
 */
const initialState = user
	? { status: { loggedIn: true }, user }
	: { status: { loggedIn: false }, user: null };

/**
 * Authentication store definition.
 */
export const useAuthState = defineStore("Auth", {
	state: () => ({ ...initialState }),
	actions: {
		/**
		 * Attempts to log in a user.
		 * @param {Object} user - The user credentials.
		 * @returns {Promise<Object>} - A promise that resolves to the user object on successful login.
		 */
		login(email, password) {
			return AuthService.login(email, password).then(
				(user) => {
					this.user = user;
					this.status.loggedIn = true;
					return Promise.resolve(user);
				},
				(error) => {
					this.user = null;
					this.status.loggedIn = false;
					return Promise.reject(error);
				}
			);
		},

		/**
		 * Signs a user up using their email and password.
		 * @param {Object} user - Object containing email, password and confirmPassword.
		 * @param {string} params.email - User's email.
		 * @param {string} params.password - User's password.
		 * @param {string} params.confirmPassword - Confirmation of user's password.
		 * @throws Will throw an error if passwords do not match.
		 * @returns {Promise<void>} - A promise.
		 */
		signUp(user) {
			return AuthService.signUp(user)
				.then(() => {
					return this.login(user.email, user.password).then((user) =>
						Promise.resolve(user)
					);
				})
				.catch((error) => {
					this.user = null;
					this.status.loggedIn = false;
					return Promise.reject(error);
				});
		},

		/**
		 * Initiates a password reset process for a given email.
		 * @param {string} email - The email address.
		 * @returns {Promise<string>} - A promise that resolves to the email on success.
		 */
		forgotPassword(email) {
			return AuthService.forgotPassword(email)
				.then(() => {
					console.log("Sent Email");
					return Promise.resolve(email);
				})
				.catch((error) => {
					this.user = null;
					this.status.loggedIn = false;
					return Promise.reject(error);
				});
		},

		/**
		 * Resets the password using a new password and a token.
		 * @param {string} newPassword - The new password.
		 * @param {string} token - The reset token.
		 * @returns {Promise<void>} - A promise.
		 */
		resetPassword(newPassword, token) {
			return AuthService.resetPassword(newPassword, token)
				.then(() => {
					console.log("Sent Reset Password");
					return Promise.resolve();
				})
				.catch((error) => {
					this.user = null;
					this.status.loggedIn = false;
					return Promise.reject(error);
				});
		},
		/**
		 * Confirms email from token.
		 * @param {string} token - The reset token.
		 * @returns {Promise<void>} - A promise.
		 */
		confirmEmail(token) {
			return AuthService.confirmEmail(token)
				.then(() => {
					console.log("Confirmed Email");
					return Promise.resolve();
				})
				.catch((error) => {
					return Promise.reject(error);
				});
		},
		sendEmailConfirmation() {
			return AuthService.sendEmailConfirmation()
				.then(() => {
					console.log("Email Sent");
					return Promise.resolve();
				})
				.catch((error) => {
					return Promise.reject(error);
				});
		},

		/**
		 * Logs out the current user.
		 */
		logout(reload = true) {
			AuthService.logout(reload);
			this.user = null;
			this.status.loggedIn = false;
		},

		async refreshSession() {
			await AuthService.refreshSession();
		},
	},
});
