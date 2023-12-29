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
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import WorkComponent from "src/components/WorkComponent.vue";

export default {
	name: "WorkConfirmationPage",
	components: { WorkComponent },
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			acceptTNC: false,
			route: useRoute(),
			work: {},
		};
	},
	async mounted() {
		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Accepting..."),
			});
			console.log(this.route?.params?.workId);
			this.work = await dataService.getWorkConfirmationPageData(
				this.route?.params?.workId
			);
			console.log(this.work);
		} catch (err) {
			console.error(err);
		} finally {
			this.$q.loading.hide();
			this.loading = false;
		}
	},
	unmounted() {},
	async updated() {},

	methods: {
		async handleSubmit() {
			try {
				if (this.acceptTNC) {
					this.loading = true;
					this.$q.loading.show({
						spinner: QSpinnerGears,
						backgroundColor: "#1e5499",
						message: this.$t("Accepting..."),
					});
					await dataService.confirmWork(this.route?.params?.workId);
					// await dataService.confirmWork("658bb6316343683f4a39095d");
					this.$q
						.dialog({
							title: this.$t("Work Confirmed"),
							message: this.$t("The work has been confirmed."),
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
