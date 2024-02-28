<template>
	<q-page padding class="">
		<div class="flex row flex-center q-my-sm">
			<q-btn
				class="col-8 col-md-3 q-mx-sm"
				:label="$t('Create Template')"
				color="primary"
				to="/work/template/edit?isNew=true"
			/>
		</div>
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:rows="templates"
			:grid="$q.screen.lt.md"
			:loading="loading"
			class="q-mt-lg"
			:columns="columns"
			row-key="id"
			:filter="search"
			:visible-columns="visibleColumns"
			:pagination="{ rowsPerPage: $q.screen.lt.md ? 5 : 25 }"
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
								:to="`/work/template/${props.row._id}`"
							>
								<q-item-section>
									<q-item-label>{{
										$t("View")
									}}</q-item-label>
								</q-item-section>
							</q-item>
							<template v-if="user?.roles?.includes('admin')">
								<q-item
									clickable
									v-close-popup
									:to="`/work/template/edit/${props.row._id}`"
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
									@click="deleteTemplate(props.row._id)"
								>
									<q-item-section>
										<q-item-label>{{
											$t("Delete")
										}}</q-item-label>
									</q-item-section>
								</q-item>
							</template>
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
							<span>ID:{{ props.row._id }}</span>
							<q-badge>{{ $t(props.row.name) }}</q-badge>
						</q-card-section>
						<q-card-section>
							<q-list bordered separator>
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

								<q-item v-if="props.row?.initialPayment > 0">
									<q-item-section avatar>
										<q-icon name="payments" />
									</q-item-section>

									<q-item-section
										>${{ props.row.initialPayment
										}}{{ $t(" Initial Payment") }}
									</q-item-section>
								</q-item>
								<q-item
									v-if="props.row?.subscription?.payment > 0"
								>
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
								<q-item
									v-if="props.row?.cancellationPayment > 0"
								>
									<q-item-section avatar>
										<q-icon name="payments" />
									</q-item-section>

									<q-item-section
										>${{ props.row.cancellationPayment
										}}{{ $t(" Cancellation") }}
									</q-item-section>
								</q-item>
							</q-list>

							<q-btn
								color="secondary q-mt-sm"
								:label="$t('View')"
								:to="`/work/template/${props.row._id}`"
								class="text-color full-width"
							/>
							<template v-if="user?.roles?.includes('admin')">
								<q-btn
									color="accent"
									:label="$t('Edit')"
									:to="`/work/template/edit/${props.row._id}`"
									class="text-color full-width q-mt-sm"
								/>
								<q-btn
									color="negative"
									:label="$t('Delete')"
									@click="deleteTemplate(props.row._id)"
									class="text-color full-width q-mt-sm"
								/>
							</template>
						</q-card-section>
					</q-card>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import dataService from "../../../services/data.service";
import DateService from "../../../services/date.service";
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
					field: (row) => row._id,
					sortable: true,
				},
				{
					name: "name",
					align: "left",
					label: "Name",
					field: (row) => row.name,
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
					name: "initialPayment",
					align: "left",
					label: "Initial $",
					field: (row) => this.$c(row.initialPayment),
					sortable: true,
				},
				{
					name: "paymentInterval",
					align: "left",
					label: "Subscription Interval",
					field: (row) =>
						row?.subscription?.payment > 0
							? row?.subscription?.interval
							: this.$t("Disabled"),
					sortable: true,
				},
				{
					name: "cost",
					align: "left",
					label: "Subscription $",
					field: (row) =>
						row?.subscription?.payment > 0
							? this.$c(row?.subscription?.payment)
							: this.$t("0"),
					sortable: true,
					sort: (a, b) => this.sortCurrency(a, b),
				},
				{
					name: "cancellationPayment",
					align: "left",
					label: "Cancellation $",
					field: (row) => this.$c(row.cancellationPayment),
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
				"name",
				"category",
				"service",
				"initialPayment",
				"cancellationPayment",
				"actions",
			]),
		};
	},
	async mounted() {
		const templates = await dataService.getWorkTemplatePageData();
		const isAdmin = this.user.roles.includes("admin");

		templates.map((x) => {
			console.log(x.createdAt);
			x.createdDate = DateService.convertISOLocalDisplay(x.createdAt);
			x.actions = [];
			// idk why would ever need these
			return x;
		});

		//Get Filtering Info
		// - Add Accept meeting button if any have status new,should lead to WorkEditor
		let anySubscriptions = false;
		templates.forEach((element) => {
			if (!anySubscriptions && element?.subscription?.payment > 0) {
				anySubscriptions = true;
			}
		});
		//Editing Col Visibility
		if (anySubscriptions) {
			this.visibleColumns.push("paymentInterval");
			this.visibleColumns.push("cost");
		}

		this.templates = templates;
		this.$nextTick(() => {
			let id = this.route?.query?.id;
			if (id) {
				this.search = id;
				this.visibleColumns.push("id");
			}
			this.loading = false;
		});
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	unmounted() {},
	async updated() {},
	methods: {
		// Parse a currency string to a number
		parseCurrency(value) {
			return Number(value.replace(/[^0-9.-]+/g, ""));
		},
		// Custom sort function for currency fields
		sortCurrency(a, b) {
			console.log(a);
			return this.parseCurrency(a) - this.parseCurrency(b);
		},
		async deleteTemplate(id) {
			this.$q
				.dialog({
					title: "Delete Template?",
					message: `Are you sure you want to delete template?`,
					ok: true,
					cancel: true,
				})
				.onOk(async () => {
					this.loading = true;
					this.$q.loading.show({
						spinner: QSpinnerGears,
						backgroundColor: "#1e5499",
						message: this.$t("Deleting Template..."),
					});
					await dataService.deleteWorkTemplate(id);
					this.$q.loading.hide();
					this.loading = false;
					window.location.reload();
				});
		},
	},
};
</script>

<style scoped>
.no-link-style {
	color: inherit; /* Inherit the color from the parent */
	text-decoration: none; /* Remove underline */
	/* Add any other styles you want to reset or apply */
}
.text-color {
	color: black !important;
}

.body--dark .text-color {
	color: white !important;
}
</style>
