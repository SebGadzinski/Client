<template>
	<q-page padding>
		<!-- Meta Data -->
		<div class="form-class full-width">
			<h3 class="text-center">{{ $t("Meta Data") }}</h3>
			<div class="flex row flex-center">
				<q-list>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Name")
							}}</q-item-label>
							<div class="readonly-text">
								{{ $t(template.name) }}
							</div>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Category")
							}}</q-item-label>
							<div class="readonly-text">
								{{ $t(template.category) }}
							</div>
						</q-item-section>
					</q-item>
					<q-item>
						<q-item-section>
							<q-item-label caption>{{
								$t("Service")
							}}</q-item-label>
							<div class="readonly-text">
								{{ $t(template.service) }}
							</div>
						</q-item-section>
					</q-item>
					<q-item v-if="isAdmin">
						<q-item-section>
							<q-item-label caption>{{
								$t("Status")
							}}</q-item-label>
							<div class="readonly-text">
								{{ $t(template.status) }}
							</div>
						</q-item-section>
					</q-item>
					<q-item v-if="template.category === 'Classes'">
						<q-item-section>
							<q-item-label caption>{{
								$t("Class Type")
							}}</q-item-label>
							<div class="readonly-text">
								{{ $t(template.classType) }}
							</div>
						</q-item-section>
					</q-item>
				</q-list>
			</div>
		</div>
		<!-- Work Items -->
		<div
			v-if="template?.workItems?.length > 0"
			class="flex row full-width justify-center q-mb-lg"
		>
			<div :class="!isAdmin && this.$q.screen.gt.sm ? 'col-8' : 'col-12'">
				<h3 class="text-center q-mb-none">{{ $t("Work Items") }}</h3>
				<q-table
					:rows="template.workItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg"
					:columns="workItemCols"
					row-key="id"
					:hide-bottom="true"
					:visible-columns="workItemVisibleCols"
				>
					<template v-if="$q.screen.gt.sm" v-slot:body="props">
						<q-tr :props="props">
							<q-td key="id" :props="props">{{
								props.row._id
							}}</q-td>
							<q-td key="name" :props="props">{{
								$t(props.row.name)
							}}</q-td>
							<q-td
								key="description"
								:props="props"
								style="
									white-space: normal;
									word-break: break-word;
								"
								>{{ $t(props.row.description) }}</q-td
							>
							<q-td key="links" :props="props">
								<div
									v-for="(link, index) in props.row.links"
									:key="index"
								>
									<a :href="link.url" target="_blank"
										><q-badge>{{
											$t(link.name)
										}}</q-badge></a
									>
								</div>
							</q-td>
							<q-td v-if="isAdmin" key="status" :props="props">{{
								$t(props.row.status)
							}}</q-td>
						</q-tr>
					</template>
					<template v-if="$q.screen.lt.md" v-slot:item="props">
						<div class="q-pa-xs col-12">
							<q-card flat bordered>
								<q-card-section
									class="flex justify-between bg-secondary"
								>
									<span v-if="isAdmin"
										>ID: {{ props.row._id }}</span
									>
								</q-card-section>
								<q-card-section>
									<q-list>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Name")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.name) }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Description")
												}}</q-item-label>
												<div class="readonly-text">
													{{
														$t(
															props.row
																.description
														)
													}}
												</div>
											</q-item-section>
										</q-item>
										<q-item
											v-if="props.row.links?.length > 0"
										>
											<q-item-section>
												<q-item-label caption>{{
													$t("Links")
												}}</q-item-label>
												<div
													v-for="(
														link, index
													) in props.row.links"
													:key="index"
												>
													<a
														:href="link.url"
														target="_blank"
														><q-badge>{{
															$t(link.name)
														}}</q-badge></a
													>
												</div>
											</q-item-section>
										</q-item>
										<q-item v-if="isAdmin">
											<q-item-section>
												<q-item-label caption>{{
													$t("Status")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.status) }}
												</div>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
							</q-card>
						</div>
					</template>
				</q-table>
			</div>
		</div>
		<!-- Payment Items -->
		<div
			v-if="template?.paymentItems?.length > 0"
			class="flex row full-width justify-center q-mb-lg"
		>
			<div :class="!isAdmin && this.$q.screen.gt.sm ? 'col-8' : 'col-12'">
				<h3 class="text-center q-mb-none">{{ $t("Payment Items") }}</h3>
				<q-table
					:rows="template.paymentItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg"
					:columns="paymentItemCols"
					row-key="id"
					:hide-bottom="true"
					:visible-columns="paymentItemVisibleCols"
				>
					<template v-slot:body-cell-description="props">
						<q-td
							:props="props"
							style="white-space: normal; word-break: break-word"
						>
							{{ props.row.description }}
						</q-td>
					</template>
					<template v-if="$q.screen.lt.md" v-slot:item="props">
						<div class="q-pa-xs col-12">
							<q-card flat bordered>
								<q-card-section
									class="flex justify-between bg-secondary"
								>
									<span v-if="isAdmin"
										>ID: {{ props.row._id }}</span
									>
								</q-card-section>
								<q-card-section>
									<q-list>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Name")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.name) }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Description")
												}}</q-item-label>
												<div class="readonly-text">
													{{
														$t(
															props.row
																.description
														)
													}}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("$ Payment")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $c(props.row.payment) }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Status")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.status) }}
												</div>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
							</q-card>
						</div>
					</template>
				</q-table>
			</div>
		</div>

		<q-list>
			<!--
			<h3 class="text-center">{{ $t("Payment Items") }}</h3>
			<q-item
				v-if="template?.paymentItems?.length > 0"
				class="column"
				style="width: 50% !important"
			>
				<q-table
					:rows="template.paymentItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg full-width"
					:columns="paymentItemCols"
					row-key="id"
					:hide-bottom="true"
					:visible-columns="paymentItemVisibleCols"
				>
					<template v-if="$q.screen.lt.md" v-slot:item="props">
						<div class="q-pa-xs col-12">
							<q-card flat bordered>
								<q-card-section
									class="flex justify-between bg-secondary"
								>
									<span v-if="isAdmin"
										>ID: {{ props.row._id }}</span
									>
								</q-card-section>
								<q-card-section>
									<q-list>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Name")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.name) }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Description")
												}}</q-item-label>
												<div class="readonly-text">
													{{
														$t(
															props.row
																.description
														)
													}}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("$ Payment")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $c(props.row.payment) }}
												</div>
											</q-item-section>
										</q-item>
										<q-item>
											<q-item-section>
												<q-item-label caption>{{
													$t("Status")
												}}</q-item-label>
												<div class="readonly-text">
													{{ $t(props.row.status) }}
												</div>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
							</q-card>
						</div>
					</template>
				</q-table>
			</q-item> -->
			<q-item class="flex-center">
				<div class="text-h4">
					{{ $t("Subscription") }}
				</div>
			</q-item>
			<q-item class="flex flex-center">
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("$ Payment") }}</q-item-label>
					<div class="readonly-text">
						{{ $c(template?.subscription?.payment ?? 0) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("Interval") }}</q-item-label>
					<div class="readonly-text">
						{{ template?.subscription?.interval ?? "N/A" }}
					</div>
				</div>
			</q-item>
			<q-item class="flex-center">
				<div class="text-h4">
					{{ $t("Confirmation") }}
				</div>
			</q-item>
			<q-item class="flex flex-center">
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("$ Payment") }}</q-item-label>
					<div class="readonly-text">
						{{ $c(template.initialPayment) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Payment Status")
					}}</q-item-label>
					<div class="readonly-text">
						{{ template.initialPaymentStatus }}
					</div>
				</div>
			</q-item>
			<q-item class="flex-center">
				<div class="text-h4">
					{{ $t("Cancellation") }}
				</div>
			</q-item>
			<q-item class="flex flex-center">
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("$ Payment") }}</q-item-label>
					<div class="readonly-text">
						{{ $c(template.cancellationPayment) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Payment Status")
					}}</q-item-label>
					<div class="readonly-text">
						{{ template.cancellationPaymentStatus }}
					</div>
				</div>
			</q-item>
			<q-item style="margin-top: 100px" v-if="allowPurchase">
				<q-item-section
					v-if="
						template.category === 'Classes' &&
						template.classType !== 'Time Frame'
					"
				>
					<q-btn
						:class="$q.screen.gt.sm ? 'text-h3' : 'text-h6'"
						color="primary"
						:label="
							$t(
								template.classType === 'Single Session'
									? 'Purchase'
									: 'Enroll'
							)
						"
						@click="enroll(template._id)"
					>
					</q-btn>
				</q-item-section>
				<q-item-section
					v-else-if="
						template.category === 'Software' &&
						template.service === 'Client Server Generator'
					"
				>
					<q-btn
						:class="$q.screen.gt.sm ? 'text-h3' : 'text-h6'"
						color="primary"
						:label="$t('Purchase')"
						@click="purchase(template._id)"
					>
					</q-btn>
				</q-item-section>
				<!-- <q-item-section v-else>
					<q-btn
						:class="$q.screen.gt.sm ? 'text-h3' : 'text-h6'"
						color="primary"
						:label="$t('Book Meeting')"
						:to="`/${template.categorySlug}/${template.serviceSlug}/meeting?template=${template.name}&templateId=${template._id}`"
					>
					</q-btn>
				</q-item-section> -->
				<q-item-section class="flex flex-center full-width" v-else>
					<div class="text-center">
						<p class="text-body1 email-p">
							{{ $t("template-email") }}
						</p>
						<q-btn
							:label="$t('Copy Email')"
							color="primary"
							:class="
								$q.screen.gt.sm
									? 'text-h3'
									: 'text-h6 full-width'
							"
							@click="copyEmail"
						/>
					</div>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import DateService from "../services/date.service";
import dataService from "src/services/data.service";

export default {
	name: "WorkTemplateComponent",
	props: {
		template: Object,
		isAdmin: Boolean,
		allowPurchase: Boolean,
	},
	data() {
		return {
			loading: false,
			$q: useQuasar(),
			email: "sebastiangadzinskiwork@gmail.com",
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
					label: "$ Payment",
					field: (row) => this.$c(row.payment),
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
	mounted() {
		if (!this.template.workItems.some((x) => x?.links?.length > 0)) {
			this.workItemVisibleCols = this.workItemVisibleCols.filter(
				(x) => x !== "links"
			);
		}
		if (!this.isAdmin) {
			this.workItemVisibleCols = this.workItemVisibleCols.filter(
				(x) => x !== "status" && x !== "id"
			);
			this.paymentItemVisibleCols = this.paymentItemVisibleCols.filter(
				(x) => x !== "status" && x !== "id"
			);
		}
	},
	methods: {
		async copyEmail() {
			await navigator.clipboard.writeText(this.email);
			this.$q.notify({
				message: "Email copied to clipboard!",
				color: "positive",
				icon: "content_copy",
			});
		},
		$d(date) {
			return DateService.convertISOLocalDisplay(date);
		},
		async enroll(templateId) {
			try {
				const status = await dataService.enrollmentStatus(templateId);
				if (!status?.allowed) {
					throw new Error(status.reason);
				}

				this.$q
					.dialog({
						title: this.$t("Are you sure you want to enroll?"),
						message: this.$t(
							"You will be lead to a confirmation page."
						),
						ok: {
							label: this.$t("Yes"),
							color: "accent",
						},
						cancel: true,
					})
					.onOk(async () => {
						const work = await dataService.enrollInClass(
							templateId
						);

						this.$router.push(`/work/confirmation/${work._id}`);
						this.$q.loading.hide();
					});
			} catch (err) {
				if (err.message === "Sign Up Required") {
					this.$router.push(`/auth/login?enroll=${templateId}`);
				}
				this.$q.notify({
					type: "negative",
					message: err.message,
				});
				this.$q.loading.hide();
			}
		},
		async purchase(templateId) {
			this.$q
				.dialog({
					title: this.$t("Confirm Puchase?"),
					message: this.$t(
						"You will be lead to a confirmation page."
					),
					ok: {
						label: this.$t("Yes"),
						color: "accent",
					},
					cancel: true,
				})
				.onOk(async () => {
					try {
						const work = await dataService.purchaseTemplate(
							templateId
						);

						this.$router.push(`/work/confirmation/${work._id}`);
						this.$q.loading.hide();
					} catch (err) {
						if (err.message === "Sign Up Required") {
							this.$router.push(
								`/auth/login?purchase=${templateId}`
							);
						}
						this.$q.notify({
							type: "negative",
							message: err.message,
						});
						this.$q.loading.hide();
					}
				});
		},
	},
};
</script>

<style scoped>
.bottom-section-div {
	width: fit-content;
	margin: 5px;
}
.email-p {
	width: 60%;
	margin: auto;
	padding-bottom: 20px;
}
@media (max-width: 1000px) {
	.email-p {
		width: 100%;
	}
}
</style>
