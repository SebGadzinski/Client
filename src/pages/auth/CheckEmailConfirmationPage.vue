<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div class="column items-center">
			<!-- Spinner -->
			<q-spinner color="primary" size="40px" />
			<!-- Next Call Message -->
			<div class="q-mt-md text-h6">
				{{ $t(`Calling In: ${timeLeft}s`) }}
			</div>
			<!-- Confirmation Message -->
			<div class="q-mt-md text-h5 text-center">
				{{ $t("Checking Email Status") }}
			</div>
			<q-btn
				class="q-mt-lg"
				color="primary"
				:label="$t('Send Confirmation Email')"
				@click="sendEmail"
			/>
		</div>
	</div>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";
import dataService from "../../services/data.service";
import AuthService from "../../services/auth.service";
import { mapActions, mapState } from "pinia";
// import LocaleSwitcher from "../components/Select/LocalSwitcher.vue";
import { useSettingsState } from "src/stores/settings.state";
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";

export default {
	name: "EmailConfirmationPage",
	data() {
		return {
			timeLeft: ref(1),
			route: useRoute(),
			settingsState: useSettingsState(),
			authState: useAuthState(),
		};
	},
	async mounted() {
		if (this?.user?.emailConfirmed) {
			// This may need to be where the user wanted to go getting sent here
			this.$router.push({ path: "/" });
			return;
		}
		await this.checkStatus();
		this.timerInterval = setInterval(async () => {
			if (this.timeLeft == 1) {
				await this.checkStatus();
				this.timeLeft = 10;
			}
			this.timeLeft--;
		}, 1000);
	},
	beforeUnmount() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		...mapActions(useAuthState, [
			"sendEmailConfirmation",
			"refreshSession",
		]),
		async sendEmail() {
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
		async checkStatus() {
			// Make the call to email confirmation endpoint
			const status = await AuthService.emailConfirmStatus();
			if (status === "noUser") {
				this.$q.notify({
					type: "accent",
					message: "Refreshing Session...",
				});
				await this.refreshSession();
				window.location.reload();
			} else if (status) {
				this.$q.notify({
					type: "positive",
					message: "Your email is confirmed",
				});
				await this.refreshSession();
				clearInterval(this.timerInterval);
				setTimeout(() => {
					const redirectURL = this.route?.query["redirectURL"];
					if (redirectURL) {
						this.$router.push(redirectURL);
						return;
					}
					const bookMeeting = this.route?.query["book-meeting"];
					const templateId = this.route?.query?.enroll;
					if (bookMeeting) {
						let possibleMeeting =
							window.localStorage.getItem("book-meeting");
						if (possibleMeeting) {
							let meeting = JSON.parse(possibleMeeting);
							dataService.bookMeeting(meeting);
						}
						this.$q
							.dialog({
								title: this.$t("Meeting Confirmed"),
								message: this.$t(
									"Meeting details sent to email."
								),
							})
							.onDismiss(() => {
								this.$router.push("/work");
							});
					} else if (templateId) {
						this.$router.push(`/work/template/${templateId}`);
					} else {
						this.$router.push("/");
					}
				}, 2000);
			}
		},
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
