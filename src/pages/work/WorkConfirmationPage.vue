<template>
	<q-page padding>
		<div>
			<h3 class="bg-accent text-center q-py-lg">
				{{ $t("Confirmation") }}
			</h3>
			<WorkComponent
				:work="work"
				:isAdmin="isAdmin"
				v-if="work && Object.keys(work).length > 0"
			/>
		</div>
		<div></div>
		<div class="full-width">
			<q-form
				v-if="Object.keys(work).length > 0"
				class="form-class q-px-lg full-width"
				@submit.prevent="handleSubmit"
			>
				<br />
				<br />
				<q-checkbox
					v-model="acceptTNC"
					:label="$t('Accept Terms & Conditions')"
				/>
				<br />
				<br />
				<q-btn
					v-if="work.payment.initialPayment > 0"
					:class="
						$q.screen.lt.md
							? 'text-h6 full-width'
							: 'text-h3 full-width'
					"
					type="submit"
					:label="$t(`Pay And Accept`)"
					color="primary"
					:disabled="!acceptTNC"
				>
				</q-btn>
				<q-btn
					v-else
					:class="
						$q.screen.lt.md
							? 'text-h6 full-width'
							: 'text-h3 full-width'
					"
					type="submit"
					:label="$t(`Accept`)"
					color="primary"
					:disabled="!acceptTNC"
				>
				</q-btn>
			</q-form>
		</div>
	</q-page>
	<q-dialog
		v-model="showToS"
		persistent
		:maximized="maximizedToggle"
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<ConfirmationToSComponent />
	</q-dialog>
</template>

<script>
import { ref } from "vue";
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import ConfirmationToSComponent from "src/components/tos/ConfirmationToSComponent.vue";
import WorkComponent from "src/components/WorkComponent.vue";
import { mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "WorkConfirmationPage",
	components: {
		WorkComponent,
		ConfirmationToSComponent,
	},
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			acceptTNC: false,
			route: useRoute(),
			work: {},
			isAdmin: false,
			pks: {
				software: process.env.STRIPE_PUBLIC_KEY_SOFTWARE,
				classes: process.env.STRIPE_PUBLIC_KEY_CLASSES,
				photography: process.env.STRIPE_PUBLIC_KEY_PHOTOGRAPHY,
				videography: process.env.STRIPE_PUBLIC_KEY_VIDEOGRAPHY,
			},
			pk: "",
			confirm: true,
			showToS: ref(false),
			showPayment: ref(false),
			paymentIntent: {
				sessionId: "",
			},
			stripeCardRef: ref(null),
		};
	},
	async mounted() {
		try {
			this.isAdmin = this.user?.roles?.includes("admin");
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Accepting..."),
			});
			this.work = await dataService.getWorkConfirmationPageData(
				this.route?.params?.workId
			);
			this.pk = this.pks[this.work.category.toLowerCase()];
		} catch (err) {
			console.error(err);
		} finally {
			this.$q.loading.hide();
			this.loading = false;
		}
	},
	unmounted() {},
	async updated() {},
	watch: {
		acceptTNC(newValue) {
			if (newValue === true) {
				this.showToS = true;
			}
		},
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		async pay() {
			// Ask user if they want to pay with Subscription Payment Card
			const workId = this.route?.params?.workId;
			const subCard = this.work.payment?.subscription?.last4Digits;
			if (subCard) {
				this.$q
					.dialog({
						title: this.$t("pay_card", { card: subCard }),
						message: this.$t(
							"Would you like to pay with the card you set up for subscriptions?"
						),
						options: {
							type: "radio", // Use radio for single selection
							model: "", // No initial selection
							items: [
								{
									label: this.$t("Use Subscription Card"),
									value: "sub",
								},
								{
									label: this.$t("Use Different Card"),
									value: "new",
								},
							],
						},
					})
					.onOk(async (decision) => {
						if (decision === "sub") {
							this.$q.loading.show({
								spinner: QSpinnerGears,
								backgroundColor: "#1e5499",
								message: this.$t("Processing Payment..."),
							});
							const paymentData =
								await dataService.completePaymentViaSubCard({
									workId,
									type: "confirmation",
								});
							this.$q.loading.hide();
							this.$q
								.dialog({
									title: this.$t("Please Complete Payment"),
									message: this.$t(
										"Refresh your view after payment is completed"
									),
								})
								.onDismiss(() => {
									this.advance();
								});
						} else if (decision === "new") {
							this.payViaNewPayment(workId);
						}
					});
			} else {
				await payViaNewPayment(workId);
			}
		},
		async payViaNewPayment(workId) {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Getting Payment Ready..."),
			});
			this.paymentIntent = await dataService.generateConfirmationPayment({
				workId,
				type: "confirmation",
			});
			this.$nextTick(() => {
				if (this.paymentIntent && this.paymentIntent.url) {
					const newWindow = window.open(
						this.paymentIntent.url,
						"_blank"
					);
					this.$q.loading.hide();
					// Check if the new window is blocked and inform the user if so.
					if (
						!newWindow ||
						newWindow.closed ||
						typeof newWindow.closed === "undefined"
					) {
						// Inform the user that the popup was blocked, or provide an alternative way.
						this.$q.notify({
							type: "negative",
							message: this.$t(
								"Unable to open the payment link. Please disable your popup blocker and try again."
							),
						});
						this.$q
							.dialog({
								title: this.$t("Please Complete Payment"),
								message: this.$t(
									"Refresh your view after payment is completed"
								),
								ok: {
									label: this.$t("Go to Payment"),
									color: "accent",
								},
							})
							.onOk(() => {
								window
									.open(this.paymentIntent.url, "_blank")
									.focus();
							})
							.onDismiss(() => {
								this.advance();
							});
					} else {
						this.$q
							.dialog({
								title: this.$t("Please Complete Payment"),
								message: this.$t(
									"Refresh your view after payment is completed"
								),
							})
							.onDismiss(() => {
								this.advance();
							});
					}
				}
			});
		},
		async handleSubmit() {
			try {
				if (this.acceptTNC) {
					this.$q.loading.show({
						spinner: QSpinnerGears,
						backgroundColor: "#1e5499",
						message: this.$t("Accepting..."),
					});
					if (this.work.payment.initialPayment > 0) {
						await this.pay();
					} else {
						await dataService.confirmWork(
							this.route?.params?.workId
						);
						this.$q
							.dialog({
								title: this.$t("Work Confirmed"),
								message: this.$t(
									"The work has been confirmed."
								),
							})
							.onDismiss(() => {
								this.advance();
							});
					}
				}
			} catch (err) {
				this.$q
					.dialog({
						title: this.$t("Error"),
						message: this.$t(err.toString()),
					})
					.onDismiss(() => {
						const stayOnPageRes = new Set();
						stayOnPageRes.add("Please Fill out card information");
						stayOnPageRes.add("Please provide a payment method");
						let errorMessage = err
							.toString()
							.replace("Error: ", "");

						if (!stayOnPageRes.has(errorMessage)) {
							this.$router.push("/");
						}
					});
				console.error(err);
			} finally {
				this.$q.loading.hide();
				this.loading = false;
			}
		},
		advance() {
			const path =
				this.work.category !== "Classes" ? "/work" : "/my-classes";
			this.$router.push(path);
		},
	},
};
</script>

<style scoped></style>
