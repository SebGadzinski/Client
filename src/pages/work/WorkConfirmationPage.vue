<template>
	<q-page padding>
		<div>
			<h3 class="bg-accent text-center q-py-lg">
				{{ $t("Confirmation") }}
			</h3>
			<WorkComponent
				:work="work"
				v-if="work && Object.keys(work).length > 0"
			/>
		</div>
		<div></div>
		<div>
			<q-form
				v-if="Object.keys(work).length > 0"
				class="form-class q-px-lg"
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
					class="text-h4 full-width"
					type="submit"
					:label="$t(`Pay And Accept`)"
					color="primary"
					:disabled="!acceptTNC"
				>
				</q-btn>
				<q-btn
					v-else
					class="text-h3 full-width"
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
	<template v-if="showPayment && paymentIntent.sessionId !== ''">
		<stripe-checkout
			ref="checkoutRef"
			mode="payment"
			:pk="pk"
			:session-id="paymentIntent.sessionId"
		/>
	</template>
</template>

<script>
import { ref } from "vue";
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import ConfirmationToSComponent from "src/components/tos/ConfirmationToSComponent.vue";
import WorkComponent from "src/components/WorkComponent.vue";
import { StripeCheckout } from "@vue-stripe/vue-stripe";

export default {
	name: "WorkConfirmationPage",
	components: {
		WorkComponent,
		ConfirmationToSComponent,
		StripeCheckout,
	},
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			acceptTNC: false,
			route: useRoute(),
			work: {},
			pks: {
				software: process.env.STRIPE_PUBLIC_KEY_SOFTWARE,
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
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Accepting..."),
			});
			console.log(this.route?.params?.workId);
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
				console.log("set true");
				this.showToS = true;
			}
		},
	},
	methods: {
		async pay() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Getting Payment Ready..."),
			});
			this.showPayment = true;
			this.paymentIntent = await dataService.generateConfirmationPayment(
				this.route?.params?.workId,
				"confirmation"
			);
			this.$nextTick(() => {
				this.$refs.checkoutRef.redirectToCheckout();
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
								this.$router.push("/work");
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
						this.$router.push("/");
					});
				console.error(err);
			} finally {
				this.$q.loading.hide();
				this.loading = false;
			}
		},
	},
};
</script>

<style scoped></style>
