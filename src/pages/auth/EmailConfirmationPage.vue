<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div class="column items-center">
			<!-- Spinner -->
			<q-spinner v-if="confirming" color="primary" size="40px" />

			<!-- Confirmation Message -->
			<div v-if="confirming" class="q-mt-md text-h6">
				{{ $t("Confirm Email...") }}
			</div>
			<div v-else class="flex flex-center column">
				<h6>{{ $t("Confirmed!") }}</h6>
				<p class="text-body1">
					{{ $t("You can close this browser.") }}
				</p>
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
			confirming: true,
			route: useRoute(),
			settingsState: useSettingsState(),
		};
	},
	mounted() {
		try {
			const token = this.route?.query?.token;
			this.confirmEmail(token).then(
				() => {
					setTimeout(() => {
						this.loading = false;
						this.confirming = false;
						this.$q.loading.hide();
					}, 1500);
				},
				(error) => {
					this.loading = false;
					this.$q.loading.hide();
					this.$q.dialog({
						title:
							(error?.response &&
								error?.response?.data &&
								error?.response?.data?.message) ||
							error?.message ||
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
