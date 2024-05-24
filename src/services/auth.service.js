import { api } from "../boot/axios";
import TokenService from "./token.service";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
// import {internalIpV4} from 'internal-ip'

class AuthService {
	/**
	 * Logs user in
	 * @param {String} email
	 * @param {String} password
	 * @returns Logged in user
	 */
	login(email, password) {
		return api.post("/auth", { email, password }).then((response) => {
			if (response.data.success) {
				TokenService.setUser(response.data.data.user);
				TokenService.setLocalToken(response.data.data.token);
				return response.data.data.user;
			} else {
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
	signUp({ email, password, confirmPassword }) {
		if (password !== confirmPassword)
			throw new Error("Passwords not matching");
		return api
			.post("/auth/signUp", { email, password })
			.then((response) => {
				if (response.data.success) {
					return;
				} else {
					throw new Error(response.data.message);
				}
			});
	}
	/**
	 * Sends reset password email to users email
	 * @param {String} email
	 * @returns
	 */
	forgotPassword(email) {
		if (!email || email.length < 3 || !email.includes("@"))
			throw new Error("Invalid Email");
		return api
			.post("/auth/sendEmailResetPassword", { email })
			.then((response) => {
				if (response.data.success) {
					return;
				} else {
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
	resetPassword(newPassword, token) {
		return api
			.post(`/auth/${token}/resetPassword`, { password: newPassword })
			.then((response) => {
				if (response.data.success) {
					return;
				} else {
					throw new Error(response.data.message);
				}
			});
	}
	async sendEmailConfirmation() {
		const res = await api.post(`/auth/sendEmailConfirmation`);
		if (res?.data?.success) {
			return;
		} else {
			throw new Error(response.data.message);
		}
	}
	async confirmEmail(token) {
		const res = await api.post(`/auth/${token}/confirmEmail`);
		if (res?.data?.success) {
			return;
		} else {
			throw new Error(res.data.message);
		}
	}
	async refreshSession() {
		try {
			const rs = await api.post("/auth/refresh", {
				token: TokenService.getLocalRefreshToken(),
			});
			if (!rs || !rs?.data?.success) {
				await this.logout();
				return;
			}

			// Success, can refresh token
			const { token, refreshToken, user } = rs.data.data;

			TokenService.setUser(user);
			TokenService.setLocalRefreshToken(refreshToken);
			TokenService.setLocalToken(token);
		} catch (err) {
			await this.logout();
		}
	}

	async emailConfirmStatus() {
		return await this.call(api.get("/auth/emailConfirmStatus"));
	}

	async call(func, customError = null) {
		try {
			const result = await func;
			if (customError) {
				if (result.data.success) {
					return result.data.data;
				} else {
					console.log("Message: ");
					console.log(result.data.message);
					throw new Error(customError);
				}
			} else {
				if (result?.data?.message)
					throw new Error(result?.data?.message);
			}

			return result.data.data;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Logs user out and removes token
	 */
	async logout(reload = true, query = "") {
		TokenService.removeUser();
		const loginPath =
			(window.location.hostname !== "localhost"
				? "#/auth/login"
				: "auth/login") + (query ?? "");
		if (Capacitor.getPlatform() != "web") {
			try {
				let file = await Preferences.clear();
			} catch (e) {}
			if (reload) {
				window.location = loginPath;
			}
		} else {
			if (reload) {
				window.location = loginPath;
			}
		}
	}
}

export default new AuthService();
