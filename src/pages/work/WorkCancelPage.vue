<template>
	<q-page padding>
		<div>
			<h3 class="bg-accent text-center q-py-lg">
				{{ $t("Cancellation") }}
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
				<q-btn
					v-if="work.payment.cancellationPayment > 0"
					:class="
						$q.screen.lt.md
							? 'text-h6 full-width'
							: 'text-h3 full-width'
					"
					type="submit"
					:label="$t(`Pay And Accept`)"
					color="primary"
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
				>
				</q-btn>
			</q-form>
		</div>
	</q-page>
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
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import WorkComponent from "src/components/WorkComponent.vue";
import { StripeCheckout } from "@vue-stripe/vue-stripe";
import { mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "WorkConfirmationPage",
	components: { WorkComponent, StripeCheckout },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			route: useRoute(),
			isAdmin: false,
			work: {},
			pks: {
				classes: process.env.STRIPE_PUBLIC_KEY_CLASSES,
				software: process.env.STRIPE_PUBLIC_KEY_SOFTWARE,
				photography: process.env.STRIPE_PUBLIC_KEY_PHOTOGRAPHY,
				videography: process.env.STRIPE_PUBLIC_KEY_VIDEOGRAPHY,
			},
			pk: "",
			paymentIntent: {
				sessionId: "",
			},
			showPayment: false,
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
			const data = await dataService.getWorkCancelPageData(
				this.route?.params?.workId
			);
			this.work = data.work;
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
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		async pay() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Getting Payment Ready..."),
			});
			this.showPayment = true;
			this.paymentIntent = await dataService.generateConfirmationPayment({
				workId: this.route?.params?.workId,
				type: "cancellation",
			});
			this.$nextTick(() => {
				this.$refs.checkoutRef.redirectToCheckout();
			});
		},
		async handleSubmit() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					backgroundColor: "#1e5499",
					message: this.$t("Accepting..."),
				});

				if (this.work.payment.cancellationPayment > 0) {
					await this.pay();
				} else {
					await dataService.cancelWork(this.route?.params?.workId);
					this.$q
						.dialog({
							title: this.$t("Work Cancelled"),
							message: this.$t("The work has been cancelled."),
						})
						.onDismiss(() => {
							this.$router.push("/work");
						});
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
