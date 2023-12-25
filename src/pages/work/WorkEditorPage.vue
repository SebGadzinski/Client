<template>
	<q-page padding>
		<!-- Meta Data -->
		<q-form
			v-if="Object.keys(work).length > 0"
			class="form-class"
			name="Work"
			@submit.prevent="handleSave"
		>
			<h3 class="text-center">{{ $t("Meta Data") }}</h3>
			<div class="flex row flex-center">
				<q-list>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("User")
							}}</q-item-label>
							<q-select
								v-model="work.user.email"
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
								v-model="work.category"
								:options="categoryOptions"
								class="full-width"
								@update:model-value="onCategoryChange"
							/>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Service")
							}}</q-item-label>
							<q-select
								v-model="work.service"
								:options="servicesOptions[work.category][0]"
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
								v-model="work.status"
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
				:rows="work.workItems"
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
							{{ props.row._id }}
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
									v-model="link.url"
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
										deleteLink(props.row._id, link.name)
									"
								/>
							</div>
							<q-btn
								label="Add New Link"
								flat
								class="full-width"
								color="positive"
								@click="addNewLink(props.row._id)"
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
								@click="deleteWorkItem(props.row._id)"
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
													v-model="link.url"
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
															props.row._id,
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
													addNewLink(props.row._id)
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
													deleteWorkItem(
														props.row._id
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
						:rows="work.paymentItems"
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
									{{ props.row._id }}
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
										@click="deleteCostItem(props.row._id)"
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
																props.row._id
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
							v-model="work.payment.initialPayment"
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
							v-model="work.payment.subscription.payment"
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
						<q-select
							v-model="work.payment.subscription.interval"
							:options="subscriptionIntervalOptions"
							:rules="[
								(val) =>
									work.payment.subscription?.payment <= 0 ||
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
							v-model="work.paymentStatus"
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
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
	name: "WorkEditorPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			visibleUserOptions: [],
			usersOptions: [],
			workStatusOptions: [],
			categoryOptions: [],
			servicesOptions: [],
			workItemCols: [
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
			work: {},
			route: useRoute(),
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

		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Loading Work..."),
			});
			const data = await dataService.getWorkEditorPageData(
				this.route?.params?.workId
			);

			this.work = data.work;

			this.usersOptions = data.usersOptions;
			this.categoryOptions = data.categoryOptions;
			this.servicesOptions = data.servicesOptions;
			this.workStatusOptions = data.workStatusOptions;
			this.paymentStatusOptions = data.paymentStatusOptions;
			this.subscriptionIntervalOptions = data.subscriptionIntervalOptions;
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
		onCategoryChange(newValue) {
			this.work.service = this.servicesOptions[newValue][0][0];
		},
		deleteLink(workItemId, name) {
			let workItem = this.work.workItems.find(
				(x) => x._id === workItemId
			);
			workItem.links = workItem.links.filter((x) => x.name !== name);
		},
		addNewLink(workItemId) {
			let workItem = this.work.workItems.find(
				(x) => x._id === workItemId
			);
			if (!workItem.links) workItem.links = [];
			workItem.links.push({
				name: `Link ${workItem.links.length}`,
				link: "",
			});
		},
		deleteWorkItem(workItemId) {
			this.work.workItems = this.work.workItems.filter(
				(x) => x._id !== workItemId
			);
		},
		deleteCostItem(paymentItemId) {
			this.work.paymentItems = this.work.paymentItems.filter(
				(x) => x._id !== paymentItemId
			);
		},
		addNewWorkItem() {
			const newWorkItem = {
				_id: `new_${this.work.workItems.length}`, // Generate a unique ID
				name: "",
				description: "",
				links: [],
				status: "New", // Default status or make it blank as per your need
			};
			this.work.workItems.push(newWorkItem);
		},

		addNewCostItem() {
			const newCostItem = {
				_id: `new_${this.work.paymentItems.length}`, // Generate a unique ID
				name: "",
				description: "",
				status: "New", // Default status or make it blank as per your need
			};
			this.work.paymentItems.push(newCostItem);
		},
		userFilter(val, update) {
			if (!val || val === "") {
				update(() => {
					this.visibleUserOptions = []; // reset your options or set them to your default list
				});
			} else {
				update(() => {
					// Filter your options based on the input
					const needle = val.toLowerCase();
					this.visibleUserOptions = this.usersOptions.filter(
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
					message: this.$t("Upserting..."),
				});

				await dataService.upsertWork(this.work);

				this.$q
					.dialog({
						title: this.$t("Work Saved"),
						message: this.$t("The work has been saved."),
					})
					.onDismiss(() => {
						this.$router.push("/work");
					});
			} catch (err) {
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
