<template>
	<q-page padding>
		<div>
			<h3 class="bg-accent text-center q-py-lg">
				{{ $t("Payment") }}
			</h3>
			<WorkComponent
				:work="work"
				:allow-payment="false"
				v-if="work && Object.keys(work).length > 0"
			/>
		</div>
		<div></div>
		<div></div>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import WorkComponent from "src/components/WorkComponent.vue";
import { useRoute } from "vue-router";

export default {
	name: "WorkPaymentPage",
	components: { WorkComponent },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			work: {},
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
			console.log(wordId);

			this.work = await dataService.getWorkComponent(wordId);

			this.$q.loading.hide();
			this.loading = false;

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
	methods: {},
};
</script>

<style scoped></style>
