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
								v-if="user?.roles?.includes('admin')"
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
								clickable
								v-close-popup
								:to="`/work/${props.row.workId}`"
							>
								<q-item-section>
									<q-item-label>{{
										$t("View")
									}}</q-item-label>
								</q-item-section>
							</q-item>
							<a
								v-for="(action, index) in props.row.actions"
								:key="index"
								:href="action.link"
								target="_blank"
								@click.stop
							>
								<q-item clickable v-close-popup>
									<q-item-section>
										<q-item-label>{{
											$t(action.name)
										}}</q-item-label>
									</q-item-section>
								</q-item>
							</a>
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
										>${{ props.row.subscription.payment }}
										{{
											this.$t(
												"Every " +
													props.row.subscription
														.interval
											)
										}}
									</q-item-section>
								</q-item>
							</q-list>
							<q-btn
								color="secondary"
								:label="$t('View')"
								:to="`/work/${props.row.workId}`"
								class="text-color full-width"
							/>
							<q-btn
								v-if="user?.roles?.includes('admin')"
								color="secondary"
								:label="$t('Edit')"
								:to="`/work/edit/${props.row.workId}`"
								class="text-color full-width"
							/>
							<q-btn
								v-for="(action, index) in props.row.actions"
								:key="index"
								color="secondary"
								:label="$t(action.name)"
								:to="action.link"
								class="text-color full-width"
							/>
						</q-card-section>
					</q-card>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
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
					label: "Subscription Interval",
					field: (row) => row?.subscription?.interval ?? "N/A",
					sortable: true,
				},
				{
					name: "cost",
					align: "left",
					label: "Subscription Cost",
					field: (row) => row?.subscription?.payment ?? "N/A",
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
		const data = await dataService.getWorkPageData();
		data.work.sort((a, b) => {
			// Check for 'Meeting' status
			const statusA = a.status === "Meeting" ? 0 : 1;
			const statusB = b.status === "Meeting" ? 0 : 1;

			if (statusA !== statusB) {
				return statusA - statusB; // Sort by status first
			} else {
				if (a.createdDate > b.createdDate) {
					return -1;
				} else if (a.createdDate < b.createdDate) {
					return 1;
				} else {
					return 0;
				}
			}
		});

		const isAdmin = this.user.roles.includes("admin");

		data.work.map((x) => {
			x.createdDate = new Date(x.createdDate).toDateString();
			x.actions = [];
			if (x.status === "Meeting") {
				x.actions.push({ name: "Go To Meeting", link: x.meetingLink });
				x.actions.push({
					name: "Cancel Meeting",
					link: `/work/cancel/${x.workId}`,
				});
			} else if (x.status === "Confirmation Required") {
				x.actions.push({
					name: "Confirm Meeting Agreements",
					link: `/work/confirmation/${x.workId}`,
				});
			} else if (x.status === "Cancellation Set Up") {
				x.actions.push({
					name: "Cancel Work",
					link: `/work/cancel/${x.workId}`,
				});
			}
			return x;
		});

		//Get Filtering Info
		// - Add Accept meeting button if any have status new,should lead to WorkEditor
		let anySubscriptions = false;
		data.work.forEach((element) => {
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

		if (!isAdmin) {
			this.visibleColumns = this.visibleColumns.filter(
				(x) => x !== "email"
			);
		}

		this.works = data.work;
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

<style scoped>
.text-color {
	color: black !important;
}

.body--dark .text-color {
	color: white !important;
}
</style>
