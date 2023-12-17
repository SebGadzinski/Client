<template>
	<q-page padding class="">
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:rows="works"
			:grid="$q.screen.lt.md"
			class="q-mt-lg"
			:columns="columns"
			row-key="id"
			:filter="search"
			:visible-columns="visibleColumns"
		>
			<template v-if="$q.screen.gt.sm" v-slot:top>
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
			<template v-if="$q.screen.gt.sm" v-slot:body-cell-actions="props">
				<q-td :key="props.name">
					<q-btn-dropdown color="primary">
						<q-list>
							<q-item
								clickable
								v-close-popup
								:to="`/work/edit/${props.row.workId}`"
							>
								<q-item-section>
									<q-item-label>{{
										$t("Edit")
									}}</q-item-label>
								</q-item-section>
							</q-item>
							<q-item
								v-for="(action, index) in props.row.actions"
								:key="index"
								:to="action.link"
								clickable
								v-close-popup
							>
								<q-item-section>
									<q-item-label>{{
										$t(action.name)
									}}</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
			<template v-if="$q.screen.lt.md" v-slot:item="props">
				<div class="q-pa-xs col-12">
					<q-card flat bordered>
						<q-card-section
							class="flex justify-between bg-secondary"
						>
							<span>ID:{{ props.row.workId }}</span>
							<q-badge>{{ $t(props.row.status) }}</q-badge>
						</q-card-section>
						<q-card-section>
							<q-list bordered separator>
								<q-item>
									<q-item-section avatar>
										<q-icon name="inbox" />
									</q-item-section>

									<q-item-section>{{
										props.row.email
									}}</q-item-section>
								</q-item>
								<q-item>
									<q-item-section avatar>
										<q-icon name="work" />
									</q-item-section>

									<q-item-section>
										<div>
											<q-badge>{{
												$t(props.row.category)
											}}</q-badge>
											<q-badge color="black">{{
												$t(props.row.service)
											}}</q-badge>
										</div>
									</q-item-section>
								</q-item>
								<q-item v-if="props.row.subscription?.interval">
									<q-item-section avatar>
										<q-icon name="payments" />
									</q-item-section>

									<q-item-section
										>${{ props.row.subscription.cost }}
										{{ $t("Every ") }}
										{{
											props.row.subscription.interval
												.amount +
											" " +
											$t(
												props.row.subscription.interval
													.unit
											)
										}}
									</q-item-section>
								</q-item>
							</q-list>
							<q-btn
								color="secondary"
								:label="$t('Edit')"
								:to="`/work/edit/${props.row.workId}`"
								class="full-width"
							/>
							<q-btn
								v-for="(action, index) in props.row.actions"
								:key="index"
								color="secondary"
								:label="$t(action.name)"
								:to="action.link"
								class="full-width"
							/>
						</q-card-section>
					</q-card>
				</div>
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
					name: "id",
					align: "left",
					label: "Id",
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
					field: (row) =>
						row?.subscription?.interval?.amount +
							row?.subscription?.interval?.unit ?? "N/A",
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
				"id",
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
				actions: [{ name: "ToLink", link: "somelink" }],
			},
			{
				workId: "weoi33",
				email: "john.mitcjh@example.com",
				category: "Photography",
				service: "Single Picture",
				status: "Pending",
				createdDate: new Date().toDateString(),
				subscription: {
					interval: {
						amount: 7,
						unit: "Days",
					},
					cost: 75.0,
				},
			},
		];
		//Get Filtering Info
		// - Add Accept meeting button if any have status new,should lead to WorkEditor
		let anySubscriptions = false;
		grabbedWorks.forEach((element) => {
			console.log(anySubscriptions);
			if (!anySubscriptions && element.subscription) {
				anySubscriptions = true;
			}
		});
		//Editing Col Visibilit
		if (anySubscriptions) {
			this.visibleColumns.push("paymentInterval");
			this.visibleColumns.push("cost");
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
