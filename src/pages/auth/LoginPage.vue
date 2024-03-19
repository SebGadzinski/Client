<template>
	<div class="column">
		<q-form class="form-class" name="Login" @submit.prevent="handleLogin">
			<q-input
				v-model="user.email"
				:label="$t('Email')"
				:rules="[(val) => !!val || $t('Email is required')]"
				:dense="false"
			/>
			<q-input
				v-model="user.password"
				type="password"
				:label="$t('Password')"
				:rules="[(val) => !!val || $t('Password is required')]"
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
import { useRoute } from "vue-router";
import { useSettingsState } from "src/stores/settings.state";

export default {
	name: "LoginPage",
	data() {
		return {
			user: {
				email: window.localStorage.getItem("auth-email") ?? null,
				password: null,
			},
			loading: false,
			message: "",
			route: useRoute(),
			timer: null,
			version: require("../../../package.json").version,
			settingsState: useSettingsState(),
		};
	},
	computed: {
		...mapState(useAuthState, ["loggedIn"]),
	},
	methods: {
		...mapActions(useAuthState, ["login"]),
		handleLogin() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					spinnerColor: "white",
					messageColor: "white",
					backgroundColor: "#1e5499",
					message: this.$t("Logging In"),
				});
				if (this.user.email && this.user.password) {
					window.localStorage.setItem("auth-email", this.user.email);
					this.login(this.user.email, this.user.password).then(
						(myUser) => {
							this.loading = false;
							this.$q.loading.hide();
							if (!myUser?.emailConfirmed) {
								this.$router.push({
									path: "/auth/check-confirm/email",
									query: this.route.query,
								});
								return;
							}
							const bookMeeting =
								this.route?.query["book-meeting"];
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
								this.$router.push(
									`/work/template/${templateId}`
								);
							} else {
								this.$router.push("/");
							}
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
					this.message = this.$t("Missing Inputs");
					//this.message = `Must Provide Email and Password. ${inputElement.value}`;
					this.$q.loading.hide();
					this.loading = false;
				}
			} catch (err) {
				this.$q.loading.hide();
				this.loading = false;
				this.message = err;
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
