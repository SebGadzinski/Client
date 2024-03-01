<template>
	<div class="q-pa-md">
		<q-list>
			<!-- <template v-if="user?.roles.includes('admin')">
				<template v-if="this.$q.screen.lt.md">
					<q-item>
						<q-item-section>
							<q-btn
								color="primary"
								to="/work/template"
								class="full-width"
								:label="$t('Templates')"
							></q-btn>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-btn
								color="primary"
								to="/admin/users"
								class="full-width"
								:label="$t('Users')"
							></q-btn>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-btn
								color="primary"
								to="/admin/vmStatusReport"
								class="full-width"
								:label="$t('VM Status Reports')"
							></q-btn>
						</q-item-section>
					</q-item>
				</template>
			</template> -->
			<!-- Work Status -->
			<q-item v-if="user?.roles.includes('admin')" clickable v-ripple>
				<q-item-section>{{ $t("Edit Work Status") }}</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						to="/admin/work-status"
						class="full-width"
						:label="$t('Status')"
					></q-btn>
				</q-item-section>
			</q-item>
			<!-- View Profile -->
			<q-item v-if="user" clickable v-ripple>
				<q-item-section>{{ $t("Edit Profile") }}</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						to="/profile"
						class="full-width"
						:label="$t('Profile')"
					></q-btn>
				</q-item-section>
			</q-item>
			<!-- Refresh Session -->
			<q-item v-if="user" clickable v-ripple>
				<q-item-section>{{ $t("Refresh Session") }}</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						@click="handleRefreshSession"
						class="full-width"
						:label="$t('Refresh')"
					/>
				</q-item-section>
			</q-item>
			<!-- LOGOUT -->
			<q-item v-if="user" clickable v-ripple>
				<q-item-section>{{ $t("Logout") }}</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						@click="handleLogout"
						class="full-width"
						:label="$t('logout')"
					/>
				</q-item-section>
			</q-item>
			<!-- Confirmation -->
			<q-item v-if="user && !user.emailConfirmed" clickable v-ripple>
				<q-item-section>{{ $t("Email Confirmation") }}</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						@click="handleConfirmation"
						class="full-width"
						:label="$t('Send Email')"
					/>
				</q-item-section>
			</q-item>

			<q-separator />

			<!-- SET Language -->
			<q-item tag="label" v-ripple>
				<q-item-section>
					<q-item-label>{{ $t("Language") }}:</q-item-label>
				</q-item-section>
				<q-item-section>
					<q-btn-dropdown
						color="primary"
						class="full-width"
						split
						:label="langText"
					>
						<q-list>
							<q-item
								v-for="(lan, index) in languages"
								:key="index"
								clickable
								v-close-popup
								@click="onLanguageClick(lan.value)"
							>
								<q-item-section>
									<q-item-label>{{ lan.name }}</q-item-label>
								</q-item-section>
							</q-item>

							<q-item
								clickable
								v-close-popup
								@click="onLanguageClick('fr')"
							>
								<q-item-section>
									<q-item-label>Français</q-item-label>
								</q-item-section>
							</q-item>

							<!-- <q-item clickable v-close-popup @click="onItemClick">
							<q-item-section>
								<q-item-label>Español</q-item-label>
							</q-item-section>
							</q-item> -->
						</q-list>
					</q-btn-dropdown>
				</q-item-section>
			</q-item>

			<!-- SET Currency -->
			<q-item tag="label" v-ripple>
				<q-item-section>
					<q-item-label>{{ $t("Currency") }}:</q-item-label>
				</q-item-section>
				<q-item-section>
					<q-btn-dropdown
						color="primary"
						class="full-width"
						split
						:label="currencyText"
					>
						<q-list>
							<q-item
								v-for="(cur, index) in currencies"
								:key="index"
								clickable
								v-close-popup
								@click="onCurrencyClick(cur)"
							>
								<q-item-section>
									<q-item-label>{{ cur }}</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-item-section>
			</q-item>
			<q-separator />

			<!-- CHECK FOR UPDATE -->
			<q-item
				clickable
				v-ripple
				@click="checkForUpdate"
				v-if="platform != 'web'"
			>
				<q-item-section>
					{{ $t("Version") }}:
					<span class="text-weight-bold">{{ $t(this.version) }}</span>
				</q-item-section>
				<q-item-section>
					<q-btn
						color="primary"
						class="full-width"
						:label="$t('Check for Update')"
					/>
				</q-item-section>
			</q-item>
			<q-item clickable v-ripple v-else>
				<q-item-section>{{ $t("Version") }}:</q-item-section>
				<q-item-section side top>
					<span class="text-weight-bold">{{ $t(this.version) }}</span>
				</q-item-section>
			</q-item>
			<q-separator v-if="platform != 'web'" />

			<!-- NOTIFICATIONS -->
			<q-item tag="label" v-ripple v-if="user && platform != 'web'">
				<q-item-section>
					<q-item-label>{{ $t("Notifications") }}:</q-item-label>
					<q-item-label caption>
						{{
							this.notificationsEnabled
								? $t("Enabled")
								: $t("Disabled")
						}}
					</q-item-label>
				</q-item-section>
				<q-item-section side top>
					<q-toggle
						color="primary"
						v-model="_notificationsEnabled"
						val="bool"
					/>
				</q-item-section>
			</q-item>

			<!-- DARK MODE -->
			<q-item tag="label" v-ripple>
				<q-item-section>
					<q-item-label>{{ $t("Dark Mode") }}:</q-item-label>
					<q-item-label caption>
						{{
							settingsState.darkMode
								? $t("Enabled")
								: $t("Disabled")
						}}
					</q-item-label>
				</q-item-section>
				<q-item-section side top>
					<q-toggle color="primary" v-model="darkMode" val="bool" />
				</q-item-section>
			</q-item>

			<div
				class="full-width bg-negative text-white rounded-borders non-selectable row flex-center"
				style="height: 30px"
				v-if="message"
			>
				<div>{{ message }}</div>
			</div>

			<q-separator />
			<template v-if="user?.roles.includes('admin')">
				<q-item clickable v-ripple>
					<q-item-section>{{ $t("Git Pull Server") }}</q-item-section>
					<q-item-section>
						<q-btn
							color="primary"
							@click="gitPullServer"
							class="full-width"
							:label="$t('Pull')"
						/>
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple>
					<q-item-section>{{ $t("Git Pull Client") }}</q-item-section>
					<q-item-section>
						<q-btn
							color="primary"
							@click="gitPullClient"
							class="full-width"
							:label="$t('Pull')"
						/>
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple>
					<q-item-section>{{ $t("Reseed DB") }}</q-item-section>
					<q-item-section>
						<q-btn
							color="primary"
							@click="reseedDB"
							class="full-width"
							:label="$t('Reseed')"
						/>
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple>
					<q-item-section>{{ $t("Reset Stats") }}</q-item-section>
					<q-item-section>
						<q-btn
							color="primary"
							@click="resetStats"
							class="full-width"
							:label="$t('Reset')"
						/>
					</q-item-section>
				</q-item>
			</template>
			<q-item
				tag="label"
				v-ripple
				v-if="user && user.email == 'sebastiangadzinskiwork@gmail.com'"
			>
				<q-item-section>
					<q-item-label>Debug</q-item-label>
				</q-item-section>
				<q-item-section side top>
					<q-toggle color="primary" v-model="debug" val="debug" />
				</q-item-section>
			</q-item>
			<q-separator />
		</q-list>
		<!--         <q-toolbar class="version" elevated align="center">
            <q-toolbar-title
                >Resource Version:{{ this.version }}</q-toolbar-title
            >
        </q-toolbar>-->
	</div>
</template>

<script>
import Notify from "../services/pushNotifications";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import DataService from "../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";
import { mapActions, mapState } from "pinia";
import { useSettingsState } from "../stores/settings.state";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "SettingsPage",
	data() {
		return {
			settingsState: useSettingsState(),
			loading: false,
			platform: Capacitor.getPlatform(),
			mainLayout: "tab",
			version: require("../../package.json").version,
			message: null,
			filter: null,
			authState: useAuthState(),
			currencies: ["CAD", "USD", "EUR", "PLN", "MXN"],
			languages: [
				{
					name: "English",
					value: "en-US",
				},
				{
					name: "Français",
					value: "fr",
				},
			],
		};
	},
	computed: {
		...mapState(useAuthState, ["user"]),
		// ...mapState(useSelectState, ["stores"]),
		...mapState(useSettingsState, [
			"tempUnits",
			"controllerUser",
			"notificationsEnabled",
			"language",
			"darkMode",
			"currency",
		]),
		darkMode: {
			get() {
				return this.settingsState.darkMode;
			},
			set(bool) {
				this.settingsState.toggleDarkMode(bool);
			},
		},
		debug: {
			get() {
				return this.settingsState.debug;
			},
			set(bool) {
				this.settingsState.setDebug(bool);
			},
		},
		langText: {
			get() {
				switch (this.language) {
					case "en-US":
						return "English";
					case "fr":
						return "Français";
					default:
						return "English";
				}
			},
		},
		currencyText: {
			get() {
				return this.settingsState.currency;
			},
		},
		_notificationsEnabled: {
			get() {
				return this.notificationsEnabled
					? this.notificationsEnabled
					: false;
			},
			set(bool) {
				try {
					if (bool == true) {
						Notify.register({
							notificationsEnabled: bool,
						})
							.then((result) => {
								Notify.addListeners(this.$router);
							})
							.catch((err) => {
								console.error(err);
								this.setNotificationsEnable(false);
								this.$q.dialog({
									title: "Registration Error",
									message: err,
									cancel: true,
								});
							});
					} else {
						Notify.unregister()
							.then((result) => {
								console.log(result);
							})
							.catch((err) => {
								console.error(err);
								this.setNotificationsEnable(false);
							});
					}
					this.setNotificationsEnable(bool);
				} catch (e) {
					this.$q.dialog({
						title: "Error Updating Notification Preferences",
						message: e.message,
					});
				}
			},
		},
	},
	async mounted() {
		console.log(this.settingsState.darkMode);
		console.log(this.user);
		try {
			let keys =
				(await Capacitor.getPlatform()) == "web"
					? null
					: await Preferences.keys();
			if (keys && keys.keys) {
				let count = 0;
				for (let i = 0; i < keys.keys.length; i++) {
					const key = keys.keys[i];
					if (key.startsWith("images/layouts")) count++;
				}
				this.mapStorage = count;
			}
		} catch (e) {}
		//this.mapStorage = await Capacitor.getPlatform() == 'web' ? null : await Storage.keys()
	},
	methods: {
		...mapActions(useAuthState, [
			"logout",
			"sendEmailConfirmation",
			"refreshSession",
		]),
		...mapActions(useSettingsState, [
			"setTempUnits",
			"setNotificationsEnable",
			"toggleDarkMode",
		]),
		onLanguageClick(langName) {
			console.log(langName);
			this.settingsState.setLanguage(langName);
			import(
				/* webpackInclude: /(fr|en-US)\.js$/ */
				`quasar/lang/${langName}`
			).then((lang) => {
				this.$q.lang.set(lang.default);
			});
			this.$i18n.locale = langName;
		},
		onCurrencyClick(currency) {
			this.settingsState.setCurrency(currency);
		},
		async updateNotifications() {
			Notify.register({
				notificationsEnabled: this.notificationsEnabled,
			}).catch(() => {
				this.setNotificationsEnable(false);
			});
		},
		async handleLogout() {
			if (Capacitor.getPlatform() != "web") {
				try {
					let file = await Preferences.clear();
				} catch (e) {}
			}
			this.logout().then(
				() => {
					this.$router.push("/");
				},
				(error) => {
					this.loading = false;
					this.message =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString();
				}
			);
		},
		async handleRefreshSession() {
			try {
				await this.refreshSession();
				window.location.reload();
			} catch (err) {
				this.$q.dialog({
					title: this.$t("Cannot Refresh Session"),
					message: err.message,
				});
			}
		},
		async handleConfirmation() {
			try {
				await this.sendEmailConfirmation();
				this.$q.dialog({
					title: this.$t("Email Sent"),
				});
			} catch (err) {
				this.$q.dialog({
					title: this.$t("Cannot Send Email"),
					message: err.message,
				});
			}
		},
		async checkForUpdate() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				spinnerColor: "white",
				messageColor: "white",
				backgroundColor: "#1e5499",
				message: this.$t("Checking for Update...."),
			});
			try {
				DataService.checkForUpdate()
					.then((response) => {
						this.$q.loading.hide();
						console.log("Made it here");

						if (!response || !response.message)
							return console.log("No response.message");
						switch (response.message) {
							case "No Update Available":
								this.$q.dialog({
									title: this.$t("No Update Available"),
									message:
										this.$t(
											"You are on the current version"
										) +
										" " +
										this.version,
								});
								break;
							case "Update Available":
								if (
									!response.data?.url ||
									!response.data?.newVersion
								)
									return console.log(
										"No reponse.url or response.newVersion"
									);
								this.$q
									.dialog({
										title: this.$t("New Version Available"),
										message: this.$t("updateVersion", {
											version: this.version,
											newVersion:
												response.data?.newVersion,
										}),
										cancel: true,
									})
									.onOk(async () => {
										console.log(response.data);
										const version =
											await CapacitorUpdater.download({
												url: response.data?.url,
												version:
													response.data?.newVersion,
											});
										SplashScreen.show();
										let result = await CapacitorUpdater.set(
											version
										);
										SplashScreen.hide(); // in case the set fail,
										document.location.href = "index.html";
									});
								break;
							default:
								this.$q.dialog({
									title: this.$t("Update Error"),
									message: this.$t(response.message),
								});
								break;
						}
					})
					.catch((message, code) => {
						console.error(`Error Code ${code} ${message}`);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Update Error"),
							message: this.$t("errorCodeMessage", {
								code,
								message,
							}),
						});
					});
			} catch (error) {
				console.error(`Error 123 ${error}`);
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Update Error"),
					message: this.$t("errorInfo", {
						error: error ? error.toString() : "Unknown Error",
					}),
				});
			}
		},
		filterFn(val, update, abort) {
			this.filter = val;
			update(() => {
				console.log("update");
				console.log("update");
				// this.stores = this.stores;
			});
		},
		async reseedDB() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				spinnerColor: "white",
				messageColor: "white",
				backgroundColor: "#1e5499",
				message: this.$t("Reseeding...."),
			});
			try {
				DataService.reseedDB()
					.then((data) => {
						console.log(data);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("VM Reseed Process Started"),
						});
					})
					.catch((message, code) => {
						console.error(`Error Code ${code} ${message}`);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Update Error"),
							message: this.$t("errorCodeMessage", {
								code,
								message,
							}),
						});
					});
			} catch (error) {
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Error"),
					message: this.$t("errorInfo", {
						error: error ? error.toString() : "Unknown Error",
					}),
				});
			}
		},
		async gitPullServer() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				spinnerColor: "white",
				messageColor: "white",
				backgroundColor: "#1e5499",
				message: this.$t("Pulling Git...."),
			});
			try {
				DataService.gitPullServer()
					.then((data) => {
						console.log(data);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Git Pull Started"),
						});
					})
					.catch((message, code) => {
						console.error(`Error Code ${code} ${message}`);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Update Error"),
							message: this.$t("errorCodeMessage", {
								code,
								message,
							}),
						});
					});
			} catch (error) {
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Error"),
					message: this.$t("errorInfo", {
						error: error ? error.toString() : "Unknown Error",
					}),
				});
			}
		},
		async gitPullClient() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				spinnerColor: "white",
				messageColor: "white",
				backgroundColor: "#1e5499",
				message: this.$t("Updating Client"),
			});
			try {
				await DataService.gitPullClient();
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Update Complete"),
				});
			} catch (error) {
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Error"),
					message: this.$t("errorInfo", {
						error: error ? error.toString() : "Unknown Error",
					}),
				});
			}
		},
		async resetStats() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				spinnerColor: "white",
				messageColor: "white",
				backgroundColor: "#1e5499",
				message: this.$t("Resetting Stats...."),
			});
			try {
				DataService.resetStats()
					.then(() => {
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Stats Reset"),
						});
					})
					.catch((message, code) => {
						console.error(`Error Code ${code} ${message}`);
						this.$q.loading.hide();
						this.$q.dialog({
							title: this.$t("Update Error"),
							message: this.$t("errorCodeMessage", {
								code,
								message,
							}),
						});
					});
			} catch (error) {
				this.$q.loading.hide();
				this.$q.dialog({
					title: this.$t("Error"),
					message: this.$t("errorInfo", {
						error: error ? error.toString() : "Unknown Error",
					}),
				});
			}
		},
	},
};
</script>

<style scoped>
.q-card {
	width: 360px;
}

.version {
	position: fixed;
	bottom: 72px;
	width: 100%;
	align-content: center;
}
</style>
