<template>
	<q-page padding>
		<div>
			<WorkComponent
				:work="work"
				:allow-payment="
					work.status !== 'Meeting' &&
					work.status !== 'Completed' &&
					work.status !== 'Cancelled'
				"
				:showWorkers="true"
				v-if="work && Object.keys(work).length > 0"
			/>
		</div>
		<div></div>
		<div class="full-width">
			<q-btn
				v-if="['Completed', 'Some Paid'].includes(work.paymentStatus)"
				class="text-h4 full-width"
				:label="$t(`Print Receipt`)"
				color="primary"
				@click="printReceipt"
			>
			</q-btn>
		</div>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import WorkComponent from "src/components/WorkComponent.vue";
import { useRoute } from "vue-router";

export default {
	name: "WorkPage",
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
				message: this.$t("Getting Info..."),
			});
			console.log(this.route?.params?.workId);
			this.work = await dataService.getWorkViewComponent(
				this.route?.params?.workId
			);
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
		} finally {
			this.$q.loading.hide();
			this.loading = false;
		}
	},
	unmounted() {},
	async updated() {},
	methods: {
		async printReceipt() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					backgroundColor: "#1e5499",
					message: this.$t("Printing..."),
				});
				setTimeout(() => {
					this.$q.loading.hide();
				}, 2000);
			} catch (err) {
				this.$q.loading.hide();
				this.loading = false;
				console.error(err);
			}
		},
	},
};
</script>

<style scoped></style>
