<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div v-if="!isAuthenticated" class="column items-center">
			<q-spinner color="primary" size="40px" />
			<div class="q-mt-md text-h6">
				{{ $t(`calling_email`, { count: timeLeft }) }}
			</div>
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
		<div v-else class="column items-center">
			<div class="q-mt-md text-h5 text-center">
				{{ $t("You Are Authenticated!") }}
			</div>
			<q-btn
				class="q-mt-lg"
				color="primary"
				:label="$t('Continue')"
				@click="goNext"
			/>
		</div>
	</div>
</template>

<script>
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
			isAuthenticated: false,
			settingsState: useSettingsState(),
			authState: useAuthState(),
		};
	},
	async mounted() {
		if (this?.user?.emailConfirmed) {
			this.$router.push({ path: "/" });
			return;
		}
		await this.checkStatus();
		this.timerInterval = setInterval(async () => {
			if (this.timeLeft === 1) {
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
			const status = await AuthService.emailConfirmStatus();
			if (status === "noUser") {
				this.$q.notify({
					type: "accent",
					message: "Refreshing Session...",
				});
				await AuthService.refreshSession();
				window.location.reload();
			} else if (status) {
				await AuthService.refreshSession();
				clearInterval(this.timerInterval);
				this.isAuthenticated = true;
				this.$q
					.dialog({
						title: this.$t("Email Verified"),
						message: this.$t(
							"Your email has been verified, you may now use authenticated routes."
						),
					})
					.onDismiss(() => {
						this.goNext();
					});
			}
		},
		goNext() {
			const redirectPath = this.route?.query["redirectPath"];
			if (redirectPath) {
				this.$router.push(redirectPath);
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
						message: this.$t("Meeting details sent to email."),
					})
					.onDismiss(() => {
						this.$router.push("/work");
					});
			} else if (templateId) {
				this.$router.push(`/work/template/${templateId}`);
			} else {
				this.$router.push("/");
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
