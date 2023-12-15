<template>
	<q-page padding class="">
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			title="Work"
			:rows="works"
			class="q-mt-lg"
			:columns="columns"
			row-key="workId"
			:filter="search"
			:visible-columns="visibleColumns"
		>
			<template v-slot:top>
				<q-space />

				<q-select
					v-model="visibleColumns"
					multiple
					outlined
					dense
					options-dense
					:display-value="$q.lang.table.columns"
					emit-value
					map-options
					:options="columns"
					option-value="name"
					options-cover
					style="min-width: 150px"
				/>
			</template>
			<template v-slot:body-cell-actions="props">
				<q-td :key="props.name">
					<q-btn-dropdown color="primary">
						<q-list>
							<q-item clickable v-close-popup>
								<q-item-section>
									<q-item-label>{{
										$t("Test")
									}}</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
	name: "WorkIndexPage",
	data() {
		return {
			loading: true,
			route: useRoute(),
			$q: useQuasar(),
			authState: useAuthState(),
			search: "",
			works: [],
			columns: [
				{
					name: "workId",
					align: "left",
					label: "WorkId",
					field: (row) => row.workId,
					sortable: true,
				},
				{
					name: "email",
					align: "left",
					label: "Email",
					field: (row) => row.email,
					sortable: true,
				},
				{
					name: "category",
					align: "left",
					label: "Category",
					field: (row) => row.category,
					sortable: true,
				},
				{
					name: "service",
					align: "left",
					label: "Service",
					field: (row) => row.service,
					sortable: true,
				},
				{
					name: "status",
					align: "left",
					label: "Status",
					field: (row) => row.status,
					sortable: true,
				},
				{
					name: "paymentInterval",
					align: "left",
					label: "Payment Interval",
					field: (row) => row?.subscription?.interval ?? "N/A",
					sortable: true,
				},
				{
					name: "cost",
					align: "left",
					label: "cost",
					field: (row) => row?.subscription?.cost ?? "N/A",
					sortable: true,
				},
				{
					name: "createdDate",
					align: "left",
					label: "Created Date",
					field: (row) => row.createdDate,
					sortable: true,
				},
				{
					name: "actions",
					align: "left",
					label: "Actions",
					field: "actions",
					field: (row) => row.actions,
				},
			],
			visibleColumns: ref([
				"workId",
				"category",
				"service",
				"email",
				"status",
				"createdDate",
				"actions",
			]),
		};
	},
	async mounted() {
		let grabbedWorks = [
			{
				workId: "1283bh",
				email: "john.doe@example.com",
				category: "Software",
				service: "Email",
				status: "Working",
				createdDate: new Date().toDateString(),
			},
			{
				workId: "weoi33",
				email: "john.mitcjh@example.com",
				category: "Photography",
				service: "Single Picture",
				status: "Pending",
				createdDate: new Date().toDateString(),
				subscription: {
					interval: "7 Days",
					cost: 75.0,
				},
			},
		];
		//Get Filtering Info
		let anySubscriptions = false;
		grabbedWorks.forEach((element) => {
			console.log(anySubscriptions);
			if (!anySubscriptions && element.subscription) {
				anySubscriptions = true;
			}
		});
		//Editing Col Visibilit
		if (this.$q.screen.lt.lg) {
			if (!this.user?.roles?.includes("admin")) {
				this.visibleColumns = ref(["service", "status", "actions"]);
			} else {
				this.visibleColumns = ref([
					"service",
					"email",
					"status",
					"actions",
				]);
				if (anySubscriptions) {
					this.visibleColumns.push("paymentInterval");
					this.visibleColumns.push("cost");
				}
			}
		} else {
			if (!this.user?.roles?.includes("admin")) {
				this.visibleColumns = ref([
					"category",
					"service",
					"status",
					"createdDate",
					"actions",
				]);
			} else {
				this.visibleColumns = ref([
					"workId",
					"category",
					"service",
					"email",
					"status",
					"createdDate",
					"actions",
				]);
			}
			if (anySubscriptions) {
				this.visibleColumns.push("paymentInterval");
				this.visibleColumns.push("cost");
			}
		}
		this.works = grabbedWorks;
		this.$nextTick(() => {
			let userEmail = this.route?.params?.email;
			if (userEmail) {
				this.search = userEmail;
			}
		});
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	unmounted() {},
	async updated() {},

	methods: {},
};
</script>

<style scoped></style>
