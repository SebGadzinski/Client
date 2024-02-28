<template>
	<q-page padding>
		<div v-if="template && Object.keys(template).length > 0">
			<WorkTemplateComponent
				:template="template"
				:isAdmin="user && user?.roles.includes('admin')"
				:allowPurchase="allowPurchase"
				v-if="template && Object.keys(template).length > 0"
			/>
		</div>
	</q-page>
</template>

<script>
import dataService from "../../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import WorkTemplateComponent from "src/components/WorkTemplateComponent.vue";
import { useRoute } from "vue-router";
import { mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "WorkTemplatePage",
	components: { WorkTemplateComponent },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			template: {},
			authState: useAuthState(),
			route: useRoute(),
			allowPurchase: true,
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
			console.log(this.route?.params?.workTemplateId);
			this.template = await dataService.getWorkTemplateComponent(
				this.route?.params?.workTemplateId
			);
		} catch (err) {
			console.error(err);
			this.$q
				.dialog({
					title: this.$t("Error"),
					message: this.$t(err.toString()),
				})
				.onDismiss(() => {
					this.$router.push("/work/template");
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
				console.log("Printing Receipt");
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
	computed: {
		...mapState(useAuthState, ["user"]),
	},
};
</script>

<style scoped></style>
