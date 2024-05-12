<template>
	<q-page padding>
		<q-list>
			<q-item v-if="work?.meetingLink" class="column">
				<q-item-section>
					<div class="flex flex-center">
						<q-btn
							:class="
								(this.$q.screen.lt.md ? '' : 'text-h3') +
								' full-width'
							"
							color="primary"
							:label="$t('Go To Meeting')"
							@click="goToMeeting()"
						/>
					</div>
				</q-item-section>
			</q-item>
		</q-list>

		<!-- Meta Data -->
		<div class="form-class full-width">
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
					<q-item v-if="work.category === 'Classes'">
						<q-item-section>
							<q-item-label caption>{{
								$t("Class Type")
							}}</q-item-label>
							<div class="readonly-text">
								{{ work.classType }}
							</div>
						</q-item-section>
					</q-item>
					<q-item v-if="showWorkers && work?.workers?.length > 0">
						<q-item-section>
							<q-item-label caption>{{
								$t("Current Workers")
							}}</q-item-label>

							<q-list dense>
								<div
									v-for="(worker, index) in work.workers"
									:key="index"
									class="readonly-text"
								>
									{{ worker.email }}
								</div>
							</q-list>
						</q-item-section>
					</q-item>
				</q-list>
			</div>
		</div>
		<!-- Work Items -->
		<div
			v-if="work?.workItems?.length > 0"
			class="flex row full-width justify-center q-mb-lg"
		>
			<div :class="!isAdmin && this.$q.screen.gt.sm ? 'col-8' : 'col-12'">
				<h3 class="text-center q-mb-none">{{ $t("Work Items") }}</h3>
				<q-table
					:rows="work.workItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg"
					:columns="workItemCols"
					row-key="id"
					:visible-columns="workItemVisibleCols"
					:hide-bottom="true"
					:rows-per-page-options="[0]"
				>
					<template v-if="$q.screen.gt.sm" v-slot:body="props">
						<q-tr :props="props">
							<q-td key="id" :props="props">{{
								props.row._id
							}}</q-td>
							<q-td key="name" :props="props">{{
								props.row.name
							}}</q-td>
							<q-td
								key="description"
								:props="props"
								style="
									white-space: normal;
									word-break: break-word;
								"
								>{{ props.row.description }}</q-td
							>
							<q-td key="links" :props="props">
								<div
									v-for="(link, index) in props.row.links"
									:key="index"
								>
									<a :href="link.url" target="_blank"
										><q-badge>{{ link.name }}</q-badge></a
									>
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
													v-for="(
														link, index
													) in props.row.links"
													:key="index"
												>
													<a
														:href="link.url"
														target="_blank"
														><q-badge>{{
															link.name
														}}</q-badge></a
													>
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
			</div>
		</div>
		<div
			v-if="work?.paymentItems?.length > 0"
			class="flex row full-width justify-center q-mb-lg"
		>
			<div :class="!isAdmin && this.$q.screen.gt.sm ? 'col-8' : 'col-12'">
				<h3 class="text-center q-mb-none">{{ $t("Payment Items") }}</h3>
				<q-table
					:rows="work.paymentItems"
					:grid="$q.screen.lt.md"
					class="q-mt-lg"
					:columns="paymentItemCols"
					row-key="id"
					:visible-columns="paymentItemVisibleCols"
					:hide-bottom="true"
					:rows-per-page-options="[0]"
				>
					<template v-if="$q.screen.gt.sm" v-slot:body="props">
						<q-tr :props="props">
							<q-td key="id" :props="props">{{
								props.row._id
							}}</q-td>
							<q-td key="name" :props="props">{{
								props.row.name
							}}</q-td>
							<q-td
								key="description"
								:props="props"
								style="
									white-space: normal;
									word-break: break-word;
								"
								>{{ props.row.description }}</q-td
							>
							<q-td key="payment" :props="props">{{
								$c_format(props.row.payment)
							}}</q-td>
							<q-td key="status" :props="props">{{
								props.row.status
							}}</q-td>
							<q-td
								v-if="
									allowPayment &&
									props.row.status !== 'Completed'
								"
								key="pay"
								:props="props"
							>
								<q-btn
									class="siren"
									:label="$t('Pay')"
									@click="pay('paymentItem', props.row._id)"
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
													$t("$ Payment")
												}}</q-item-label>
												<div class="readonly-text">
													{{
														$c_format(
															props.row.payment
														)
													}}
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
									<q-btn
										v-if="
											allowPayment &&
											props.row.status !== 'Completed'
										"
										:label="$t('Pay')"
										@click="
											pay('paymentItem', props.row._id)
										"
										class="full-width siren"
									/>
								</q-card-section>
							</q-card>
						</div>
					</template>
				</q-table>
			</div>
		</div>

		<!-- Metting Agreements -->
		<q-list>
			<q-item class="flex-center">
				<div class="text-h4">
					{{ $t("Subscription") }}
				</div>
			</q-item>
			<q-item class="flex flex-center">
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("$ Payment") }}</q-item-label>
					<div class="readonly-text">
						{{ $c_format(work.payment.subscription.payment) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{ $t("Interval") }}</q-item-label>
					<div class="readonly-text">
						{{ work.payment.subscription.interval }}
					</div>
				</div>
				<div
					class="bottom-section-div"
					v-if="
						!work.payment.subscription.isEnabled &&
						work.payment.subscription?.dateDisabled
					"
				>
					<q-item-label caption>{{
						$t("Date Disabled")
					}}</q-item-label>
					<q-badge class="q-py-sm" color="negative">
						{{ $d(work.payment.subscription.dateDisabled) }}
					</q-badge>
				</div>
			</q-item>
			<q-item
				class="flex flex-center"
				v-if="
					work.payment.subscription.isEnabled &&
					work.payment.subscription?.nextPayment &&
					work.payment.subscription?.dateActivated
				"
			>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Date Activated")
					}}</q-item-label>
					<q-badge class="q-py-sm" color="positive">
						{{ $d(work.payment.subscription.dateActivated) }}
					</q-badge>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Next Payment")
					}}</q-item-label>
					<span>
						{{ $d(work.payment.subscription.nextPayment) }}
					</span>
				</div>
			</q-item>
			<template
				v-if="
					!work.payment.subscription?.noSub &&
					work.payment.subscription.isEnabled
				"
			>
				<div class="row justify-center" v-if="showCard">
					<div class="col-12 text-center">
						<q-item-label caption>{{
							$t("Subscription Payment Card")
						}}</q-item-label>
					</div>
					<q-card class="col-12 col-md-3 q-ma-sm q-pa-sm"
						><q-card-section
							><div
								class="full-width"
								id="card-element"
							></div></q-card-section
						><q-card-section class="row justify-center"
							><q-btn
								class="col-8"
								color="primary"
								:disable="!showSaveButton"
								:label="$t('Save')"
								@click="saveCard"
							></q-btn></q-card-section
					></q-card>
				</div>
				<div class="row justify-center q-my-sm" v-else>
					<div class="col-12 text-center">
						<q-item-label caption>{{
							$t("Subscription Payment Card")
						}}</q-item-label>
					</div>
					<q-card>
						<q-btn
							class="q-ma-sm"
							color="primary"
							:label="
								`************` +
								work.payment.subscription.last4Digits
							"
						/>
						<q-btn color="primary">
							<q-icon name="edit_square" @click="toggleCard" />
						</q-btn>
						<q-btn class="q-mx-sm" color="negative">
							<q-icon name="delete" @click="deleteCard" />
						</q-btn>
					</q-card>
				</div>
			</template>
			<q-item v-if="paymentHistory?.length > 0">
				<!-- View Payment History List - Only if viewng mode -->
				<q-expansion-item
					style="border: 1px solid"
					class="col-12 col-md-3 q-mx-auto border card-text-color text-subtitle1 faq-section text-left"
					expand-icon-class="primary"
					:default-opened="false"
					:label="$t('Payment History')"
				>
					<q-card
						v-for="(payment, index) in paymentHistory"
						:key="index"
						:class="`card-text-color q-ma-lg glass-effect`"
					>
						<q-list bordered>
							<q-item>
								<q-item-section avatar>
									<q-icon name="schedule" />
								</q-item-section>
								<q-item-section>
									<span class="text-body2">
										{{ $d(payment.date) }}
									</span>
								</q-item-section>
							</q-item>
							<q-item>
								<q-item-section avatar>
									<q-icon name="money" />
								</q-item-section>
								<q-item-section>
									<span class="text-body2">
										${{ $c_format(payment.cost) }}
									</span>
								</q-item-section>
							</q-item>
							<q-item>
								<q-item-section avatar>
									<q-icon name="credit_card" />
								</q-item-section>
								<q-item-section>
									<span class="text-body2">
										************{{ payment.last4Digits }}
									</span>
								</q-item-section>
							</q-item>
						</q-list>
					</q-card>
					<div class="row">
						<q-btn
							v-if="!this.loadingMoreSubCardHistory"
							class="col-8 q-mx-auto q-my-sm"
							color="secondary"
							@click="getMoreSubPaymentHistory"
							>{{ $t("Load More") }}</q-btn
						>
						<!-- Add Loader -->
						<div v-else class="col-8 q-mx-auto q-my-sm text-center">
							<q-spinner color="secondary" />
						</div>
					</div>
				</q-expansion-item>
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
						{{ $c_format(work.payment.initialPayment) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Payment Status")
					}}</q-item-label>
					<div class="readonly-text">
						{{ work.initialPaymentStatus }}
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
						{{ $c_format(work.payment.cancellationPayment) }}
					</div>
				</div>
				<div class="bottom-section-div">
					<q-item-label caption>{{
						$t("Payment Status")
					}}</q-item-label>
					<div class="readonly-text">
						{{ work.cancellationPaymentStatus }}
					</div>
				</div>
			</q-item>
			<q-item
				style="margin-top: 100px"
				v-if="
					allowPayment &&
					work.paymentItems.some((x) => x.status !== 'Completed')
				"
			>
				<q-item-section>
					<q-btn
						:class="
							($q.screen.lt.md ? 'text-h6' : 'text-h3') + ' siren'
						"
						:label="$t('Pay Full')"
						@click="pay('full')"
					>
					</q-btn>
				</q-item-section>
			</q-item>
			<q-item v-if="allowReceipt && work.status !== 'Meeting'">
				<q-item-section>
					<q-btn
						:class="$q.screen.lt.md ? 'text-h6' : 'text-h3'"
						color="primary"
						:label="$t('Print Receipt')"
						@click="printReceipt"
					>
					</q-btn>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";
import dataService from "../services/data.service";
import DateService from "../services/date.service";

export default {
	name: "WorkComponent",
	props: {
		showWorkers: Boolean,
		work: Object,
		allowPayment: Boolean,
		allowReceipt: Boolean,
		isAdmin: Boolean,
	},
	data() {
		return {
			receipt: {},
			showReceipt: false,
			loading: false,
			$q: useQuasar(),
			stripe: null,
			paymentHistory: [],
			showCard: false,
			loadingMoreSubCardHistory: false,
			pks: {
				classes: process.env.STRIPE_PUBLIC_KEY_CLASSES,
				software: process.env.STRIPE_PUBLIC_KEY_SOFTWARE,
				photography: process.env.STRIPE_PUBLIC_KEY_PHOTOGRAPHY,
				videography: process.env.STRIPE_PUBLIC_KEY_VIDEOGRAPHY,
			},
			pk: "",
			paymentIntent: {
				sessionId: "",
			},
			showSaveButton: false,
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
					field: (row) => this.$c_format(row.payment),
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
					name: "pay",
					align: "center",
					label: "Pay",
				},
			],
			workItemVisibleCols: ref(["name", "description", "status"]),
			paymentItemVisibleCols: ref([
				"name",
				"description",
				"payment",
				"status",
			]),
		};
	},
	mounted() {
		if (this.isAdmin) {
			this.workItemVisibleCols.push("id");
			this.paymentItemVisibleCols.push("id");
		}
		if (this.work?.workItems?.some((x) => x?.links?.length > 0)) {
			this.workItemVisibleCols.push("links");
		}
		this.showCard =
			!this.work.payment.subscription?.noSub &&
			!this.work.payment.subscription?.last4Digits &&
			this.work.payment.subscription.isEnabled;
		if (this.showCard) {
			this.loadStripe();
		}
		this.paymentHistory = this.work.payment?.subscription?.paymentHistory;
		if (this.allowPayment) {
			this.paymentItemVisibleCols.push("pay");
		}
	},
	methods: {
		toggleCard() {
			this.showCard = !this.showCard;
			if (this.showCard) {
				this.loadStripe();
			}
		},
		async deleteCard() {
			try {
				this.$q
					.dialog({
						title: "Delete Card",
						message:
							"Admin and workers will be notified if payment trying on this card.",
						ok: {
							label: this.$t("I understand"),
							color: "accent",
						},
						cancel: true,
					})
					.onOk(async () => {
						await dataService.deleteCard(this.work._id);
						window.location.reload();
					});
			} catch (err) {
				this.$q.notify({
					color: "negative",
					message: err.toString(),
				});
			}
		},
		async getMoreSubPaymentHistory() {
			try {
				if (!this.paymentHistory) return;
				this.loadingMoreSubCardHistory = true;
				const moreHistory = await dataService.loadingMoreSubCardHistory(
					this.work._id,
					this.work.payment.subscription.paymentHistory.length
				);
				this.paymentHistory.push(...moreHistory);
				this.loadingMoreSubCardHistory = false;
			} catch (err) {
				this.loadingMoreSubCardHistory = false;
				this.$q.notify({
					type: "negative",
					message: err.message,
				});
				this.$q.loading.hide();
			}
		},
		$d(date) {
			return DateService.convertISOLocalDisplay(date);
		},
		goToMeeting() {
			if (this.work.meetingLink) {
				window.open(this.work.meetingLink, "_blank");
			} else {
				// Optionally handle the case where there is no meeting link
				console.error("Meeting link not available");
				// Or use Quasar Notify for user feedback
				this.$q.notify({
					color: "negative",
					position: "top",
					message: "Meeting link is not available",
					icon: "report_problem",
				});
			}
		},
		loadStripe() {
			if (!window.Stripe) {
				let script = document.createElement("script");
				script.src = "https://js.stripe.com/v3/";
				script.onload = () => this.initializeStripe();
				document.head.appendChild(script);
			} else {
				this.initializeStripe();
			}
		},
		initializeStripe() {
			this.stripe = Stripe(this.pks[this.work.category.toLowerCase()]);
			if (this.stripe) {
				const cardStyle = {
					base: {
						color: this.$q.dark.isActive ? "white" : "black",
						fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
						fontSmoothing: "antialiased",
						fontSize: "16px",
						"::placeholder": {
							color: "#aab7c4",
						},
					},
					invalid: {
						color: "#fa755a",
						iconColor: "#fa755a",
					},
				};

				const elements = this.stripe.elements();
				this.card = elements.create("card", { style: cardStyle });

				this.$nextTick(() => {
					try {
						this.card.mount("#card-element");
						this.card.addEventListener("change", (event) => {
							this.showSaveButton =
								event.complete && !event.error;
						});
					} catch (error) {
						console.error("Error mounting card element:", error);
					}
				});
			}
		},
		async saveCard() {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Adding Card To Subscription..."),
			});
			// Create a token from the card details
			let result = await this.stripe.createToken(this.card);
			if (result.error) {
				// Inform the user if there was an error
				this.$q.notify({
					type: "negative",
					message: result.error.message,
				});
				this.$q.loading.hide();
				return;
			}

			// Retrieve the token
			const cardToken = result.token.id;

			try {
				await dataService.addCardToSubscription(
					this.work._id,
					cardToken
				);
				this.$q.notify({
					type: "positive",
					message: this.$t("Card Saved"),
				});
				this.$q.loading.hide();
				window.location.reload();
			} catch (err) {
				this.$q.notify({
					type: "negative",
					message: err.message,
				});
				this.$q.loading.hide();
			}
		},
		async removeCard() {
			try {
				// Should notify admin and user that card was removed
				await dataService.removeCardFromSubscription(this.work._id);
			} catch (err) {
				this.$q.notify({
					type: "negative",
					message: err.message,
				});
				this.$q.loading.hide();
			}
		},
		async pay(type, paymentItemId = null) {
			const workId = this.work._id;
			const subCard = this.work.payment?.subscription?.last4Digits;

			if (subCard) {
				this.$q
					.dialog({
						title: this.$t("pay_card", { card: subCard }),
						message: this.$t(
							"Would you like to pay with the card you set up for subscriptions?"
						),
						options: {
							type: "radio", // Use radio for single selection
							model: "", // No initial selection
							items: [
								{
									label: this.$t("Use Subscription Card"),
									value: "sub",
								},
								{
									label: this.$t("Use Different Card"),
									value: "new",
								},
							],
						},
					})
					.onOk(async (decision) => {
						if (decision === "sub") {
							this.$q.loading.show({
								spinner: QSpinnerGears,
								backgroundColor: "#1e5499",
								message: this.$t("Processing Payment..."),
							});
							const paymentData =
								await dataService.completePaymentViaSubCard({
									workId,
									type,
									paymentItemId,
								});
							this.$q.loading.hide();
							this.$q
								.dialog({
									title: this.$t("Please Complete Payment"),
									message: this.$t(
										"Refresh your view after payment is completed"
									),
								})
								.onDismiss(() => {
									window.location.reload();
								});
						} else if (decision === "new") {
							this.payViaNewPayment(workId, type, paymentItemId);
						}
					});
			} else {
				this.payViaNewPayment(workId, type, paymentItemId);
			}
		},
		async payViaNewPayment(workId, type, paymentItemId) {
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Getting Payment Ready..."),
			});

			this.paymentIntent = await dataService.generateConfirmationPayment({
				workId,
				type,
				paymentItemId,
			});

			this.$q.loading.hide();
			this.$nextTick(() => {
				if (this.paymentIntent && this.paymentIntent.url) {
					const newWindow = window.open(
						this.paymentIntent.url,
						"_blank"
					);

					// Check if the new window is blocked and inform the user if so.
					if (
						!newWindow ||
						newWindow.closed ||
						typeof newWindow.closed === "undefined"
					) {
						// Inform the user that the popup was blocked, or provide an alternative way.
						this.$q.notify({
							type: "negative",
							message: this.$t(
								"Unable to open the payment link. Please disable your popup blocker and try again."
							),
						});
						this.$q
							.dialog({
								title: this.$t("Please Complete Payment"),
								message: this.$t(
									"Refresh your view after payment is completed"
								),
								ok: {
									label: this.$t("Go to Payment"),
									color: "accent",
								},
							})
							.onOk(() => {
								window
									.open(this.paymentIntent.url, "_blank")
									.focus();
							})
							.onDismiss(() => {
								this.$router.push("/work");
							});
					} else {
						this.$q
							.dialog({
								title: this.$t("Please Complete Payment"),
								message: this.$t(
									"Refresh your view after payment is completed"
								),
							})
							.onDismiss(() => {
								this.$router.push("/work");
							});
					}
				}
			});
		},
		printReceipt() {
			try {
				this.$q
					.dialog({
						title: this.$t("Print Receipt?"),
						message: this.$t("Any payments made will be displayed"),
					})
					.onOk(() => {
						this.$router.push(`/work/receipt/${this.work._id}`);
					});
			} catch (err) {
				console.error(err);
			}
		},
	},
};
</script>

<style scoped>
.bottom-section-div {
	width: fit-content;
	margin: 5px;
}

#card-element {
	display: block;
	height: fit-content;
	width: 400px;
}

.glass-effect {
	background: rgba(255, 255, 255, 0.2); /* Adjust the alpha for opacity */
	backdrop-filter: blur(10px); /* Creates the frosted glass effect */
	border-radius: 10px; /* Optional: for rounded corners */
	border: 1px solid rgba(255, 255, 255, 0.3); /* Optional: adds a light border */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}
</style>
