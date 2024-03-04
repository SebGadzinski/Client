<template>
	<div class="flex full-width">
		<WorkReceiptComponent :receipt="receipt" />
	</div>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import WorkReceiptComponent from "src/components/WorkReceiptComponent.vue";
import { useRoute } from "vue-router";
import { useSettingsState } from "src/stores/settings.state";
import { mapActions } from "pinia";

export default {
	name: "WorkReceiptPage",
	components: {
		WorkReceiptComponent,
	},
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			receipt: {},
			route: useRoute(),
			settingsState: useSettingsState(),
		};
	},
	async mounted() {
		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Printing..."),
			});
			this.receipt = await dataService.generatePaymentReceipt(
				this.route.params.workId
			);

			this.$q.loading.hide();
			this.loading = false;

			// print page
			const wasDark = this.$q.dark;
			this.settingsState.toggleDarkMode(false);
			setTimeout(() => {
				if (this.$q.dark) {
					window.print();
					if (wasDark) {
						this.settingsState.toggleDarkMode(true);
					}
				}
			}, 1000);
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
	computed: {
		...mapActions(useSettingsState, ["toggleDarkMode"]),
	},
};
</script>

<style scoped></style>
