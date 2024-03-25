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
				:isAdmin="isAdmin"
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
import { mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "WorkPage",
	components: { WorkComponent },
	data() {
		return {
			loading: true,
			isAdmin: false,
			$q: useQuasar(),
			work: {},
			route: useRoute(),
		};
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	async mounted() {
		try {
			this.isAdmin = this.user?.roles?.includes("admin");
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
