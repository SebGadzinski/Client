<template>
	<q-page padding>
		<div>
			<h3 class="bg-accent text-center q-py-lg">
				{{ $t("Payment") }}
			</h3>
			<h2 v-if="countdown > 0" class="text-huge text-center">
				{{ $t(`This will close in ${countdown}`) }}
			</h2>
			<h2 v-else class="text-huge text-center">
				{{ $t(`Close Browser`) }}
			</h2>
		</div>
		<div></div>
		<div></div>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";

export default {
	name: "WorkPaymentPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			work: {},
			countdown: 5,
			route: useRoute(),
		};
	},
	async mounted() {
		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Processing Payment..."),
			});

			const wordId = await dataService.confirmPaymentIntent(
				this.route?.params?.paymentHistoryId
			);

			this.$q.loading.hide();
			this.startCountdown(wordId);

			this.$q.notify({
				message: "Payment Completed",
				type: "positive",
			});
		} catch (err) {
			console.error(err);
			this.$q
				.dialog({
					title: this.$t("Error"),
					message: this.$t(err.toString()),
				})
				.onDismiss(() => {
					this.$router.push("/work");
				});
			this.$q.loading.hide();
			this.loading = false;
		}
	},
	unmounted() {},
	async updated() {},
	methods: {
		startCountdown(wordId) {
			const countdownInterval = setInterval(() => {
				if (this.countdown > 0) {
					this.countdown -= 1;
				} else {
					clearInterval(countdownInterval);
					try {
						window.close(); // Attempt to close the current tab
					} catch (e) {
						console.error("Could not close the window:", e);
						this.$router.push({ path: `/work/${wordId}` }); // Redirect after countdown
					}
				}
			}, 1000);
		},
	},
};
</script>

<style scoped></style>
