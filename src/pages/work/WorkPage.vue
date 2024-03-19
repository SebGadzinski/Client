<template>
	<q-page padding>
		<div>
			<WorkComponent
				:work="work"
				:allowPayment="
					work.status !== 'Meeting' &&
					work.status !== 'Completed' &&
					work.status !== 'Cancelled'
				"
				:allowReceipt="true"
				:showWorkers="true"
				v-if="work && Object.keys(work).length > 0"
			/>
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
	methods: {},
};
</script>

<style scoped></style>
