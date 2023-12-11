<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div class="column items-center">
			<!-- Spinner -->
			<q-spinner color="primary" size="40px" />

			<!-- Confirmation Message -->
			<div class="q-mt-md text-h6">
				{{ $t("Confirm Email...") }}
			</div>
		</div>
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
	name: "EmailConfirmationPage",
	data() {
		return {
			route: useRoute(),
			settingsState: useSettingsState(),
		};
	},
	mounted() {
		try {
			const token = this.route?.query?.token;
			this.confirmEmail(token).then(
				() => {
					this.logout();
					this.loading = false;
					this.$q.loading.hide();
					this.$q
						.dialog({
							title: this.$t(
								"Email Confirmed. Please Sign In Again."
							),
						})
						.onOk(() => {
							this.$router.push("/");
						})
						.onDismiss(() => {
							this.$router.push("/");
						});
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
		} catch (err) {
			this.$q.dialog({ title: this.$t("Failed Getting Token") });
			setTimeout(() => {
				this.$router.push("/");
			}, 3000);
		}
	},
	methods: {
		...mapActions(useAuthState, ["confirmEmail", "logout"]),
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
	},
	components: {},
};
</script>

<style scoped></style>
