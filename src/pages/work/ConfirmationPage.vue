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
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import WorkComponent from "src/components/WorkComponent.vue";

export default {
	name: "ConfirmationPage",
	components: { WorkComponent },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			acceptTNC: false,
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
		async handleSubmit() {
			try {
				if (this.acceptTNC) {
					console.log("Timing out");
					this.loading = true;
					this.$q.loading.show({
						spinner: QSpinnerGears,
						backgroundColor: "#1e5499",
						message: this.$t("Saving"),
					});
					setTimeout(() => {
						this.$q.loading.hide();
					}, 2000);
				}
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
