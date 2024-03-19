<template>
	<div class="column">
		<q-form
			class="form-class"
			name="Sign Up"
			@submit.prevent="handleSignUp"
		>
			<q-input
				v-model="user.email"
				:label="$t('Email')"
				:rules="[(val) => !!val || $t('Email is required')]"
				:dense="false"
			/>
			<q-input
				v-model="user.password"
				type="password"
				class="form-input"
				:label="$t('Password')"
				:rules="[(val) => !!val || $t('Password is required')]"
				:dense="false"
			/>
			<q-input
				v-model="user.confirmPassword"
				type="password"
				:label="$t('Confirm Password')"
				:rules="[
					(val) => !!val || $t('Confirm Password is required'),
					(val) =>
						val === user.password || $t('Passwords do not match'),
				]"
				:dense="false"
			/>
			<br />
			<div class="flex flex-center">
				<q-btn label="Submit" type="submit" color="primary" />
			</div>
		</q-form>
	</div>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
// import LocaleSwitcher from "../components/Select/LocalSwitcher.vue";
import { useSettingsState } from "src/stores/settings.state";
import { useRoute } from "vue-router";

export default {
	name: "SignUpPage",
	data() {
		return {
			user: {
				email: null,
				password: null,
				confirmPassword: null,
			},
			confirmPasswordTouched: false,
			loading: false,
			message: "",
			route: useRoute(),
			timer: null,
			version: require("../../../package.json").version,
			settingsState: useSettingsState(),
		};
	},
	methods: {
		...mapActions(useAuthState, ["signUp"]),
		handleSignUp() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					spinnerColor: "white",
					messageColor: "white",
					backgroundColor: "#1e5499",
					message: this.$t("Signing Up..."),
				});
				if (
					this.user.email &&
					this.user.password &&
					this.user.confirmPassword
				) {
					window.localStorage.setItem("auth-email", this.user.email);
					this.signUp(this.user).then((data) => {
						this.loading = false;
						this.$q.loading.hide();
						this.$router.push({
							path: "/auth/check-confirm/email",
							query: this.route.query,
						});
					});
				} else {
					this.message = this.$t("Missing Inputs");
					//this.message = `Must Provide Username and Password. ${inputElement.value}`;
					this.$q.loading.hide();
					this.loading = false;
				}
			} catch (error) {
				this.loading = false;
				this.$q.loading.hide();
				this.$q.dialog({
					title:
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString(),
				});
				this.$q.loading.hide();
			}
		},
		onLanguageClick(langName) {
			this.settingsState.setLanguage(langName);
			import(
				/* webpackInclude: /(fr|en-US)\.js$/ */
				`quasar/lang/${langName}`
			).then((lang) => {
				this.$q.lang.set(lang.default);
			});
			this.$i18n.locale = langName;
		},
	},
	components: {
		// LocaleSwitcher,
	},
};
</script>

<style></style>
