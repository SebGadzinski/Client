import { defineStore } from "pinia";
import { Dark, setCssVar } from "quasar";
import { lightTheme, darkTheme } from "src/themes/gray";

/**
 * Parsed settings from localStorage.
 * @type {Object}
 */
const _settings = JSON.parse(localStorage.getItem("settings"));

/**
 * Default initial state.
 * @type {Object}
 */
const defaultState = {
	notificationsEnabled: false,
	eventLog: [],
	debug: false,
	darkMode: false,
	language: "en-US",
	currency: "CAD",
};

/**
 * Merges the default state with the settings from localStorage.
 * @param {Object} settings - The settings from localStorage.
 * @param {Object} defaultState - The default state.
 * @returns {Object} The merged state.
 */
const mergeWithDefaultState = (settings, defaultState) => {
	const mergedState = { ...defaultState };
	if (settings && typeof settings === "object") {
		Object.keys(defaultState).forEach((key) => {
			if (Object.hasOwnProperty.call(settings, key)) {
				mergedState[key] = settings[key];
			}
		});
	}
	return mergedState;
};

/**
 * Initial state by merging _settings with defaultState.
 * @type {Object}
 */
const initialState = mergeWithDefaultState(_settings, defaultState);

Dark.set(initialState.darkMode);
console.log("Dark mode on: " + initialState.darkMode);

/**
 * Settings store definition.
 * @exports
 */
export const useSettingsState = defineStore("Settings", {
	state: () => ({ ...initialState, eventLog: [] }),
	actions: {
		/** Initializes dark mode settings and applies the theme. */
		initializeDarkMode() {
			Dark.set(this.darkMode);
			this.applyTheme(this.darkMode ? darkTheme : lightTheme);
		},
		/**
		 * Toggles dark mode.
		 * @param {boolean} value - The value to set dark mode to.
		 */
		toggleDarkMode(value) {
			this.darkMode = value ?? false;
			Dark.set(this.darkMode);
			this.applyTheme(this.darkMode ? darkTheme : lightTheme);

			saveState(this);
		},
		/**
		 * Sets notification enablement.
		 * @param {boolean} bool - The value to set notification enablement to.
		 */
		setNotificationsEnable(bool) {
			this.notificationsEnabled = bool;
			saveState(this);
		},
		/**
		 * Sets the language.
		 * @param {string} lang - The language to set.
		 */
		setLanguage(lang) {
			this.language = lang;
			saveState(this);
		},
		/**
		 * Sets the currency.
		 * @param {string} cur - The currency to set.
		 */
		setCurrency(cur) {
			this.currency = cur;
			saveState(this);
		},
		/**
		 * Adds an entry to the event log.
		 * @param {string} entry - The entry to add to the event log.
		 */
		addToEventLog(entry) {
			if (typeof this.eventLog != typeof []) this.eventLog = [];
			this.eventLog.unshift(entry);
			this.eventLog.length = Math.min(this.eventLog.length, 15);
		},
		/**
		 * Sets debug mode.
		 * @param {boolean} bool - The value to set debug mode to.
		 */
		setDebug(bool) {
			this.debug = bool;
			saveState(this);
		},
		/**
		 * Applies the theme.
		 * @param {Object} theme - The theme to apply.
		 */
		applyTheme(theme) {
			setCssVar("primary", theme["primary"]);
			setCssVar("secondary", theme["secondary"]);
			setCssVar("accent", theme["accent"]);
			setCssVar("positive", theme["positive"]);
			setCssVar("negative", theme["negative"]);
			setCssVar("info", theme["info"]);
			setCssVar("warning", theme["warning"]);
			setCssVar("background", theme["background"]);
			setCssVar("dark", theme["background"]);
			setCssVar("dark-page", theme["background"]);
		},
	},
});

/**
 * Saves the state to localStorage.
 * @param {Object} that - The current context of the store.
 */
let saveState = (that) => {
	let object = {
		theme: that.theme || "light",
		notificationsEnabled: that.notificationsEnabled || false,
		debug: that.debug || false,
		darkMode: that.darkMode || false,
		language: that.language || "en-US",
		currency: that.currency || "CAD",
	};
	localStorage.setItem("settings", JSON.stringify(object));
};
