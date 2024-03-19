<template>
	<div class="column">
		<q-form
			class="form-class"
			name="Reset Password"
			@submit.prevent="handleResetPassword"
		>
			<q-input
				v-model="newPassword"
				type="password"
				:label="$t('New Password')"
				:rules="[(val) => !!val || $t('Password is required')]"
				:dense="false"
			/>
			<q-input
				v-model="confirmPassword"
				type="password"
				:label="$t('Confirm Password')"
				@blur="confirmPasswordTouched = true"
				:rules="[
					(val) => !!val || $t('Confirm Password is required'),
					(val) =>
						!confirmPasswordTouched ||
						val === newPassword ||
						$t('Passwords do not match'),
				]"
				:dense="false"
			/>
			<br />
			<div class="flex flex-center">
				<q-btn :label="$t('Reset')" type="submit" color="primary" />
			</div>
		</q-form>
	</div>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
// import LocaleSwitcher from "../components/Select/LocalSwitcher.vue";
import { useSettingsState } from "src/stores/settings.state";
import { useRoute } from "vue-router";

export default {
	name: "ResetPasswordPage",
	data() {
		return {
			newPassword: null,
			confirmPassword: null,
			confirmPasswordTouched: false,
			route: useRoute(),
			loading: false,
			settingsState: useSettingsState(),
		};
	},
	methods: {
		...mapActions(useAuthState, ["resetPassword"]),
		handleResetPassword() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					spinnerColor: "white",
					messageColor: "white",
					backgroundColor: "#1e5499",
					message: this.$t("Reseting Password"),
				});
				const token = this.route?.query?.token;
				if (this.newPassword && token) {
					this.resetPassword(this.newPassword, token).then(
						() => {
							this.loading = false;
							this.$q.loading.hide();
							this.$q.dialog({
								title: this.$t("Password Reset"),
							});
							setTimeout(() => {
								this.$router.push("/auth/login");
							}, 1500);
						},
						(error) => {
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
						}
					);
				} else {
					this.$q.loading.hide();
					this.loading = false;
					this.$q.dialog({ title: this.$t("Missing Inputs") });
				}
			} catch (err) {
				console.log(err);
				this.$q.loading.hide();
				this.loading = false;
				this.$q.dialog({ title: this.$t(err) });
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
	components: {},
};
</script>

<style scoped></style>
