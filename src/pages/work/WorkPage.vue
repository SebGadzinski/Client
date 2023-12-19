<template>
	<q-page padding>
		<div>
			<WorkComponent
				:work="work"
				v-if="work && Object.keys(work).length > 0"
			/>
		</div>
		<div></div>
		<div>
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
import { useQuasar, QSpinnerGears } from "quasar";
import WorkComponent from "src/components/WorkComponent.vue";

export default {
	name: "WorkPage",
	components: { WorkComponent },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			work: {},
		};
	},
	async mounted() {
		//Get Work Item
		this.work = {
			user: {
				email: "seb.gadzy@gmail.com",
			},
			category: "Software",
			service: "Custom Personal Assistant UI",
			status: "Pending",
			workItems: [
				{
					id: "oidfn3",
					name: "Add Databases",
					description: "This is a description",
					links: [{ link: "https://tits", name: "Tits" }],
					status: "New",
				},
				{
					id: "aoifna3",
					name: "Write Code",
					description: "This is a description",
					status: "Working",
				},
			],
			paymentItems: [
				{
					id: "oidfn3",
					name: "Add Databases",
					description: "This is a description",
					payment: 5000,
					status: "New",
				},
				{
					id: "aoifna3",
					name: "Write All Code",
					description: "This is a description",
					payment: 200,
					status: "Working",
				},
			],
			payment: {
				initialPayment: 600,
				subscription: {
					payment: 100.0,
					interval: "7 Days",
				},
			},
			paymentStatus: "Pending",
		};
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
};
</script>

<style scoped></style>
