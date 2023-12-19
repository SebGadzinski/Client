<template>
	<q-page padding>
		<!-- Meta Data -->
		<div class="form-class">
			<h3 class="text-center">{{ $t("Meta Data") }}</h3>
			<div class="flex row flex-center">
				<q-list>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("User")
							}}</q-item-label>
							<div class="readonly-text">
								{{ work.user.email }}
							</div>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Category")
							}}</q-item-label>
							<div class="readonly-text">{{ work.category }}</div>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Service")
							}}</q-item-label>
							<div class="readonly-text">{{ work.service }}</div>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Status")
							}}</q-item-label>
							<div class="readonly-text">{{ work.status }}</div>
						</q-item-section>
					</q-item>
				</q-list>
			</div>
		</div>
		<!-- Work Items -->
		<h3 class="text-center">{{ $t("Work Items") }}</h3>
		<q-table
			:rows="work.workItems"
			:grid="$q.screen.lt.md"
			class="q-mt-lg"
			:columns="workItemCols"
			row-key="id"
			:hide-bottom="true"
			:visible-columns="workItemVisibleCols"
		>
			<template v-if="$q.screen.gt.sm" v-slot:body="props">
				<q-tr :props="props">
					<q-td key="id" :props="props">{{ props.row.id }}</q-td>
					<q-td key="name" :props="props">{{ props.row.name }}</q-td>
					<q-td key="description" :props="props">{{
						props.row.description
					}}</q-td>
					<q-td key="links" :props="props">
						<div
							v-for="(link, index) in props.row.links"
							:key="index"
						>
							<div class="readonly-text">
								{{ $t("Name") }}: {{ link.name }}
							</div>
							<div class="readonly-text">
								{{ $t("URL") }}: {{ link.link }}
							</div>
						</div>
					</q-td>
					<q-td key="status" :props="props">{{
						props.row.status
					}}</q-td>
				</q-tr>
			</template>
			<template v-if="$q.screen.lt.md" v-slot:item="props">
				<div class="q-pa-xs col-12">
					<q-card flat bordered>
						<q-card-section
							class="flex justify-between bg-secondary"
						>
							<span>ID: {{ props.row.id }}</span>
						</q-card-section>
						<q-card-section>
							<q-list>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Name")
										}}</q-item-label>
										<div class="readonly-text">
											{{ props.row.name }}
										</div>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Description")
										}}</q-item-label>
										<div class="readonly-text">
											{{ props.row.description }}
										</div>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Links")
										}}</q-item-label>
										<div
											v-for="(link, index) in props.row
												.links"
											:key="index"
										>
											<div class="readonly-text">
												{{ $t("Name") }}:
												{{ link.name }}
											</div>
											<div class="readonly-text">
												{{ $t("URL") }}: {{ link.link }}
											</div>
										</div>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Status")
										}}</q-item-label>
										<div class="readonly-text">
											{{ props.row.status }}
										</div>
									</q-item-section>
								</q-item>
							</q-list>
						</q-card-section>
					</q-card>
				</div>
			</template>
		</q-table>
		<!-- Metting Agreements -->
		<h3 class="text-center">{{ $t("Meeting Agreements") }}</h3>
		<q-list>
			<q-item class="column">
				<q-table
					:rows="work.paymentItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg full-width"
					:columns="paymentItemCols"
					row-key="id"
					:hide-bottom="true"
					:visible-columns="paymentItemVisibleCols"
				>
					<template v-if="$q.screen.gt.sm" v-slot:body="props">
						<q-tr :props="props">
							<q-td key="id" :props="props">{{
								props.row.id
							}}</q-td>
							<q-td key="name" :props="props">{{
								props.row.name
							}}</q-td>
							<q-td key="description" :props="props">{{
								props.row.description
							}}</q-td>
							<q-td key="payment" :props="props">{{
								props.row.payment
							}}</q-td>
							<q-td key="status" :props="props">{{
								props.row.status
							}}</q-td>
						</q-tr>
					</template>
					<template v-if="$q.screen.lt.md" v-slot:item="props">
						<div class="q-pa-xs col-12">
							<q-card flat bordered>
								<q-card-section
									class="flex justify-between bg-secondary"
								>
									<span>ID: {{ props.row.id }}</span>
								</q-card-section>
								<q-card-section>
									<q-list>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Name")
												}}</q-item-label>
												<div class="readonly-text">
													{{ props.row.name }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Description")
												}}</q-item-label>
												<div class="readonly-text">
													{{ props.row.description }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Payment")
												}}</q-item-label>
												<div class="readonly-text">
													{{ props.row.payment }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Status")
												}}</q-item-label>
												<div class="readonly-text">
													{{ props.row.status }}
												</div>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
							</q-card>
						</div>
					</template>
				</q-table>
			</q-item>
			<q-item>
				<q-item-section class="flex flex-center">
					<q-item-label caption>{{
						$t("$ Initial Payment")
					}}</q-item-label>
					<div class="readonly-text">
						{{ work.payment.initialPayment }}
					</div>
				</q-item-section>
			</q-item>
			<q-item class="flex flex-center">
				<div class="subscription-div">
					<q-item-label caption>{{
						$t("$ Subscription")
					}}</q-item-label>
					<div class="readonly-text">
						{{ work.payment.subscription.payment }}
					</div>
				</div>
				<div class="subscription-div">
					<q-item-label caption>{{ $t("Interval") }}</q-item-label>
					<div class="readonly-text">
						{{ work.payment.subscription.interval }}
					</div>
				</div>
			</q-item>
			<q-item>
				<q-item-section class="flex flex-center">
					<q-item-label caption>{{
						$t("Payment Status")
					}}</q-item-label>
					<div class="readonly-text">{{ work.paymentStatus }}</div>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";

export default {
	name: "WorkComponent",
	props: {
		work: Object,
	},
	data() {
		return {
			loading: false,
			$q: useQuasar(),
			workItemCols: [
				{
					name: "id",
					align: "left",
					label: "Id",
					field: (row) => row.id,
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
					name: "description",
					align: "left",
					label: "Description",
					field: (row) => row.description,
					sortable: true,
				},
				{
					name: "links",
					align: "left",
					label: "Links",
				},
				{
					name: "status",
					align: "left",
					label: "Status",
					field: (row) => row.status,
					sortable: true,
				},
			],
			paymentItemCols: [
				{
					name: "id",
					align: "left",
					label: "Id",
					field: (row) => row.id,
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
					name: "description",
					align: "left",
					label: "Description",
					field: (row) => row.description,
					sortable: true,
				},
				{
					name: "payment",
					align: "left",
					label: "Payment",
					field: (row) => row.payment,
					sortable: true,
				},
				{
					name: "status",
					align: "left",
					label: "Status",
					field: (row) => row.status,
					sortable: true,
				},
			],
			workItemVisibleCols: ref([
				"id",
				"name",
				"description",
				"links",
				"status",
			]),
			paymentItemVisibleCols: ref([
				"id",
				"name",
				"description",
				"payment",
				"status",
			]),
		};
	},
	async mounted() {
		console.log("Mounted");
	},
	async updated() {
		console.log(this.work);
	},
	methods: {},
};
</script>

<style scoped>
.subscription-div {
	width: fit-content;
	margin: 5px;
}
</style>
