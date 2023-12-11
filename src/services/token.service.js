/**
 * A service for managing user tokens and user information in local storage.
 */
class TokenService {

  /**
   * Retrieves the refresh token from local storage.
   * @returns {string|null} The refresh token, or null if it doesn't exist.
   */
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  }

  /**
   * Sets the refresh token in local storage.
   * @param {string} token - The refresh token.
   * @returns {string|null} The refresh token that was set, or null if the user doesn't exist.
   */
  setLocalRefreshToken(token) {
    const user = JSON.parse(localStorage.getItem("user"));
    user.refreshToken = token;
    localStorage.setItem("user", JSON.stringify(user));
    return user?.refreshToken;
  }

  /**
   * Retrieves the token from local storage.
   * @returns {string|null} The token, or null if it doesn't exist.
   */
  getLocalToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  }

  /**
   * Sets the token in local storage.
   * @param {string} token - The token.
   * @returns {string|null} The token that was set, or null if the user doesn't exist.
   */
  setLocalToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
    return user?.token;
  }

  /**
   * Updates the token in local storage.
   * @param {string} token - The new token.
   */
  updateLocalToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Retrieves the user object from local storage.
   * @returns {Object|null} The user object, or null if it doesn't exist.
   */
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  /**
   * Sets the user object in local storage.
   * @param {Object} user - The user object.
   */
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Removes the user object from local storage.
   */
  removeUser() {
    localStorage.removeItem("user");
  }
}

export default new TokenService();
