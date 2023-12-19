<template>
	<q-page padding>
		<!-- Meta Data -->
		<q-form class="form-class" name="Work" @submit.prevent="handleSave">
			<h3 class="text-center">{{ $t("Meta Data") }}</h3>
			<div class="flex row flex-center">
				<q-list>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("User")
							}}</q-item-label>
							<q-select
								v-model="user.email"
								:options="visibleUserOptions"
								class="full-width"
								use-input
								@filter="userFilter"
							/>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Category")
							}}</q-item-label>
							<q-select
								v-model="category"
								:options="categoryOptions"
								class="full-width"
							/>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Service")
							}}</q-item-label>
							<q-select
								v-model="service"
								:options="serviceOptions"
								class="full-width"
							/>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Status")
							}}</q-item-label>
							<q-select
								v-model="status"
								:options="workStatusOptions"
								class="full-width"
							/>
						</q-item-section>
					</q-item>
				</q-list>
			</div>
			<!-- Work Items -->
			<h3 class="text-center">{{ $t("Work Items") }}</h3>
			<q-btn
				label="Add New Work Item"
				color="primary"
				class="q-mb-md full-width"
				@click="addNewWorkItem"
			/>
			<q-table
				:rows="workItems"
				:grid="$q.screen.lt.md"
				class="q-mt-lg"
				:columns="workItemCols"
				row-key="workItemId"
				:hide-bottom="true"
				:visible-columns="workItemVisibleCols"
			>
				<template v-if="$q.screen.gt.sm" v-slot:body="props">
					<q-tr :props="props">
						<q-td key="id" :props="props">
							{{ props.row.id }}
						</q-td>
						<q-td key="name" :props="props">
							<q-input
								v-model="props.row.name"
								type="name"
								:rules="[
									(val) => !!val || $t('Name is required'),
								]"
								:dense="true"
							/>
						</q-td>
						<q-td key="description" :props="props">
							<q-input
								v-model="props.row.description"
								filled
								type="textarea"
								:rules="[
									(val) =>
										!!val || $t('Description is required'),
								]"
								:dense="true"
							/>
						</q-td>
						<q-td key="links" :props="props">
							<div
								v-for="(link, index) in props.row.links"
								:key="index"
								class="q-mb-md"
							>
								<q-input
									v-model="link.name"
									:label="$t('Name')"
									dense
									filled
								/>
								<q-input
									v-model="link.link"
									:label="$t('URL')"
									dense
									filled
									class="q-mt-sm"
								/>
								<q-btn
									label="Delete Link"
									flat
									class="full-width"
									color="negative"
									@click="deleteLink(props.row.id, link.name)"
								/>
							</div>
							<q-btn
								label="Add New Link"
								flat
								class="full-width"
								color="positive"
								@click="addNewLink(props.row.id)"
							/>
						</q-td>
						<q-td key="status" :props="props">
							<q-select
								v-model="props.row.status"
								:options="workStatusOptions"
							/>
						</q-td>
						<q-td key="delete" :props="props">
							<q-btn
								color="red"
								:label="$t('Delete')"
								@click="deleteWorkItem(props.row.id)"
								class="full-width"
							/>
						</q-td>
					</q-tr>
				</template>
				<template v-if="$q.screen.lt.md" v-slot:item="props">
					<div class="q-pa-xs col-12">
						<q-card flat bordered>
							<q-card-section
								class="flex justify-between bg-secondary"
							>
								<span>ID:{{ props.row.workId }}</span>
							</q-card-section>
							<q-card-section>
								<q-list>
									<q-item>
										<q-item-section>
											<q-item-label caption>{{
												$t("Name")
											}}</q-item-label>
											<q-input
												v-model="props.row.name"
												type="name"
												:rules="[
													(val) =>
														!!val ||
														$t('Name is required'),
												]"
												:dense="true"
											/>
										</q-item-section>
									</q-item>
									<q-item>
										<q-item-section>
											<q-item-label caption>{{
												$t("Description")
											}}</q-item-label>
											<div style="height: 5px"></div>
											<q-input
												v-model="props.row.description"
												filled
												type="textarea"
												:rules="[
													(val) =>
														!!val ||
														$t(
															'Description is required'
														),
												]"
												:dense="true"
											/>
										</q-item-section>
									</q-item>
									<q-item>
										<q-item-section>
											<q-item-label caption>{{
												$t("Links")
											}}</q-item-label>
											<div style="height: 5px"></div>
											<div
												v-for="(link, index) in props
													.row.links"
												:key="index"
												class="q-mb-md"
											>
												<q-input
													v-model="link.name"
													:label="$t('Name')"
													dense
													filled
												/>
												<q-input
													v-model="link.link"
													:label="$t('URL')"
													dense
													filled
													class="q-mt-sm"
												/>
												<q-btn
													label="Delete Link"
													flat
													class="full-width"
													color="negative"
													@click="
														deleteLink(
															props.row.id,
															link.name
														)
													"
												/>
											</div>
											<q-btn
												label="Add New Link"
												flat
												class="full-width"
												color="positive"
												@click="
													addNewLink(props.row.id)
												"
											/>
										</q-item-section>
									</q-item>
									<q-item>
										<q-item-section>
											<q-item-label caption>{{
												$t("Status")
											}}</q-item-label>
											<q-select
												v-model="props.row.status"
												:options="workStatusOptions"
											/>
										</q-item-section>
									</q-item>
									<q-item>
										<q-item-section>
											<q-btn
												color="red"
												:label="$t('Delete')"
												@click="
													deleteWorkItem(props.row.id)
												"
												class="full-width"
											/>
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
					<q-btn
						label="Add New Payment Item"
						color="primary"
						class="q-mb-md"
						@click="addNewCostItem"
					/>
					<q-table
						:rows="paymentItems"
						:grid="$q.screen.lt.md"
						class="q-mt-lg full-width"
						:columns="paymentItemCols"
						row-key="paymentItemId"
						:hide-bottom="true"
						:visible-columns="paymentItemVisibleCols"
					>
						<template v-if="$q.screen.gt.sm" v-slot:body="props">
							<q-tr :props="props">
								<q-td key="id" :props="props">
									{{ props.row.id }}
								</q-td>
								<q-td key="name" :props="props">
									<q-input
										v-model="props.row.name"
										type="name"
										:rules="[
											(val) =>
												!!val || $t('Name is required'),
										]"
									/>
								</q-td>
								<q-td key="description" :props="props">
									<q-input
										v-model="props.row.description"
										filled
										type="textarea"
										:rules="[
											(val) =>
												!!val ||
												$t('Description is required'),
										]"
										:dense="true"
									/>
								</q-td>
								<q-td key="payment" :props="props">
									<q-input
										v-model="props.row.payment"
										type="number"
										:rules="[
											(val) =>
												val >= 0 ||
												$t('Value must be above 0'),
										]"
										placeholder="Enter amount"
										prefix="$"
									/>
								</q-td>
								<q-td key="status" :props="props">
									<q-select
										v-model="props.row.status"
										:options="paymentStatusOptions"
										:dense="true"
									/>
								</q-td>
								<q-td key="delete" :props="props">
									<q-btn
										color="red"
										:label="$t('Delete')"
										@click="deleteCostItem(props.row.id)"
										class="full-width"
									/>
								</q-td>
							</q-tr>
						</template>
						<template v-if="$q.screen.lt.md" v-slot:item="props">
							<div class="q-pa-xs col-12">
								<q-card flat bordered>
									<q-card-section
										class="flex justify-between bg-secondary"
									>
										<span>ID:{{ props.row.workId }}</span>
									</q-card-section>
									<q-card-section>
										<q-list>
											<q-item>
												<q-item-section>
													<q-item-label caption>{{
														$t("Name")
													}}</q-item-label>
													<q-input
														v-model="props.row.name"
														type="name"
														:rules="[
															(val) =>
																!!val ||
																$t(
																	'Name is required'
																),
														]"
													/>
												</q-item-section>
											</q-item>
											<q-item>
												<q-item-section>
													<q-item-label caption>{{
														$t("Description")
													}}</q-item-label>
													<div
														style="height: 5px"
													></div>
													<q-input
														v-model="
															props.row
																.description
														"
														filled
														type="textarea"
														:rules="[
															(val) =>
																!!val ||
																$t(
																	'Description is required'
																),
														]"
														:dense="true"
													/>
												</q-item-section>
											</q-item>
											<q-item>
												<q-item-section>
													<q-item-label caption>{{
														$t("Payment")
													}}</q-item-label>
													<q-input
														v-model="
															props.row.payment
														"
														type="number"
														:rules="[
															(val) =>
																val >= 0 ||
																$t(
																	'Value must be above 0'
																),
														]"
														placeholder="Enter amount"
														prefix="$"
													/>
												</q-item-section>
											</q-item>
											<q-item>
												<q-item-section>
													<q-item-label caption>{{
														$t("Status")
													}}</q-item-label>
													<q-select
														v-model="
															props.row.status
														"
														:options="
															paymentStatusOptions
														"
													/>
												</q-item-section>
											</q-item>
											<q-item>
												<q-item-section>
													<q-btn
														color="red"
														:label="$t('Delete')"
														@click="
															deleteCostItem(
																props.row.id
															)
														"
														class="full-width"
													/>
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
					<q-item-section>
						<q-item-label caption>{{
							$t("$ Initial Payment")
						}}</q-item-label>
						<q-input
							v-model="payment.initialPayment"
							type="number"
							:rules="[
								(val) =>
									val >= 0 || $t('Value must be above 0'),
							]"
							placeholder="Enter amount"
							prefix="$"
						/>
					</q-item-section>
					<q-item-section>
						<q-item-label caption>{{
							$t("$ Subscription")
						}}</q-item-label>
						<q-input
							v-model="payment.subscription.payment"
							type="number"
							:rules="[
								(val) =>
									val >= 0 || $t('Value must be above 0'),
							]"
							placeholder="Enter amount"
							prefix="$"
						/>
					</q-item-section>
					<q-item-section>
						<q-item-label caption>{{
							$t("interval")
						}}</q-item-label>
						<q-input
							v-model="payment.subscription.interval"
							type="text"
							:rules="[
								(val) =>
									payment.subscription?.payment <= 0 ||
									val !== '' ||
									$t('Interval Required'),
							]"
							placeholder="Interval"
						/>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>{{
							$t("Payment Status")
						}}</q-item-label>
						<q-select
							v-model="paymentStatus"
							:options="paymentStatusOptions"
							class="full-width"
						/>
					</q-item-section>
				</q-item>
				<q-item class="q-mt-lg">
					<q-item-section>
						<q-btn
							class="text-h3"
							type="submit"
							:label="$t(`Submit`)"
							color="primary"
						>
						</q-btn>
					</q-item-section>
				</q-item>
			</q-list>
		</q-form>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";

export default {
	name: "WorkEditorPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			user: {},
			visibleUserOptions: [],
			userOptions: [],
			workStatusOptions: [],
			categoryOptions: [],
			serviceOptions: [],
			workItems: [],
			paymentItems: [],
			service: "",
			category: "",
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
				{
					name: "delete",
					align: "center",
					label: "Delete",
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
				{
					name: "delete",
					align: "center",
					label: "Delete",
				},
			],
			workItemVisibleCols: ref([
				"id",
				"name",
				"description",
				"links",
				"status",
				"delete",
			]),
			paymentItemVisibleCols: ref([
				"id",
				"name",
				"description",
				"payment",
				"status",
				"delete",
			]),
			payment: {
				initialPayment: 0,
				subscription: {
					payment: 0.0,
					interval: "",
				},
			},
			status: "",
			paymentStatus: "",
		};
	},
	async mounted() {
		this.emptyWorkItem = [
			{
				id: "oidfn3",
				name: "",
				description: "",
				links: [],
				status: "New",
			},
		];
		this.emptyPaymentItem = [
			{
				id: "oidfn3",
				name: "",
				description: "",
				payment: 0.0,
				status: "New",
			},
		];
		//Gather Data
		//Get Status Options
		this.user = {
			email: "sebastian.gadzinski@kalder.com",
		};
		this.category = "Software";
		this.service = "Custom Personal Assistant UI";
		this.status = "Pending";
		this.paymentStatus = "Pending";
		let grabbedUserOptions = [
			"sebastian.gadzinski@kalder.com",
			"user@gmail.com",
		];
		let grabbedServiceOptions = [
			"App Creation",
			"Maintain App ",
			"Custom Personal Assistant UI",
		];
		let grabbedCatgoryOptions = ["Software", "Photography", "Videography"];
		let grabbedWorkStatusOptions = [
			"New",
			"Pending",
			"Working",
			"Completed",
		];
		let grabbedPaymentStatusOptions = [
			"New",
			"Pending",
			"Working",
			"Completed",
		];

		let grabbedWorkRows = [
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
		];
		let grabbedPaymentRows = [
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
		];
		this.userOptions = grabbedUserOptions;
		this.categoryOptions = grabbedCatgoryOptions;
		this.serviceOptions = grabbedServiceOptions;
		this.workStatusOptions = grabbedWorkStatusOptions;
		this.paymentStatusOptions = grabbedPaymentStatusOptions;
		this.workItems = grabbedWorkRows;
		this.paymentItems = grabbedPaymentRows;
	},
	unmounted() {},
	async updated() {},
	methods: {
		deleteLink(workItemId, name) {
			let workItem = this.workItems.find((x) => x.id === workItemId);
			workItem.links = workItem.links.filter((x) => x.name !== name);
		},
		addNewLink(workItemId) {
			let workItem = this.workItems.find((x) => x.id === workItemId);
			if (!workItem.links) workItem.links = [];
			workItem.links.push({
				name: `Link ${workItem.links.length}`,
				link: "",
			});
		},
		deleteWorkItem(workItemId) {
			this.workItems = this.workItems.filter((x) => x.id !== workItemId);
		},
		deleteCostItem(paymentItemId) {
			console.log("test");
			this.paymentItems = this.paymentItems.filter(
				(x) => x.id !== paymentItemId
			);
		},
		addNewWorkItem() {
			const newWorkItem = {
				id: `new_${this.workItems.length}`, // Generate a unique ID
				name: "",
				description: "",
				links: [],
				status: "New", // Default status or make it blank as per your need
			};
			this.workItems.push(newWorkItem);
		},

		addNewCostItem() {
			const newCostItem = {
				id: `new_${this.paymentItems.length}`, // Generate a unique ID
				name: "",
				description: "",
				status: "New", // Default status or make it blank as per your need
			};
			this.paymentItems.push(newCostItem);
		},
		userFilter(val, update) {
			if (val === "") {
				update(() => {
					this.visibleUserOptions = []; // reset your options or set them to your default list
				});
			} else {
				update(() => {
					// Filter your options based on the input
					const needle = val.toLowerCase();
					this.visibleUserOptions = this.userOptions.filter(
						(v) => v.toLowerCase().indexOf(needle) > -1
					);
				});
			}
		},
		async handleSave() {
			try {
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
