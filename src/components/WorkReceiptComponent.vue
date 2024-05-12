<template>
	<div v-if="Object.keys(receipt).length > 0" class="q-pa-md flex full-width">
		<q-card class="full-width" id="receipt-card">
			<q-card-section class="flex no-wrap">
				<img
					@click="this.$router.push('/')"
					src="logo.svg"
					alt="Logo"
					class="q-mr-md logo-image q-mt-auto cursor-pointer"
				/>
				<q-space />
				<h4 v-if="this.$q.screen.gt.sm" class="inline-block q-my-auto">
					Gadzy Software & Consulting
				</h4>
				<span v-else class="q-my-auto">
					Gadzy Software & Consulting
				</span>
			</q-card-section>
			<q-card-section class="large-text">
				<div class="text-h4">{{ $t("Receipt Details") }}</div>
				<div>
					<strong>{{ $t("Work ID") }}:</strong>
					{{ receipt.metaData.workId }}
				</div>
				<div>
					<strong>{{ $t("Category") }}:</strong>
					{{ receipt.metaData.category }}
				</div>
				<div>
					<strong>{{ $t("Service") }}:</strong>
					{{ receipt.metaData.service }}
				</div>
				<div>
					<strong>{{ $t("Created On") }}:</strong>
					{{ $d(receipt.metaData.createdOn) }}
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-h6">{{ $t("Payments") }}</div>
				<q-list bordered>
					<div
						v-for="(checkout, index) in receipt.checkouts"
						:key="'checkout-' + index"
					>
						<q-item>
							<q-item-section>
								<div>
									<strong>{{ $t("ID") }}:</strong>
									{{ checkout.id }}
								</div>
								<div>
									<strong>{{ $t("Payment") }}:</strong>
									{{ checkout.payment }}
								</div>
								<div>
									<strong>{{ $t("Payment Method") }}:</strong>
									{{ checkout.paymentMethod }}
								</div>
								<div>
									<strong>{{ $t("Date") }}:</strong>
									{{ $d(checkout.date) }}
								</div>
								<div>
									<strong>Items:</strong>
									<q-list bordered>
										<q-item
											v-for="item in checkout.items"
											:key="item.description"
										>
											<q-item-section>
												<q-item-label>
													{{
														item.description
													}}</q-item-label
												>
												<q-item-label caption
													>Total:
													{{ item.total }}
												</q-item-label>
											</q-item-section>
										</q-item>
									</q-list>
								</div>
							</q-item-section>
						</q-item>
						<q-separator color="secondary" style="height: 5px" />
					</div>
				</q-list>
			</q-card-section>

			<q-card-section>
				<div class="text-h6">{{ $t("Subscription Payments") }}</div>
				<q-list bordered>
					<div
						v-for="(sub, index) in receipt.subs"
						:key="'sub-' + index"
					>
						<q-item>
							<q-item-section>
								<div>
									<strong>{{ $t("ID") }}:</strong>
									{{ sub.id }}
								</div>
								<div>
									<strong>{{ $t("Payment") }}:</strong>
									{{ sub.payment }}
								</div>
								<div>
									<strong>{{ $t("Payment Method") }}:</strong>
									{{ sub.paymentMethod }}
								</div>
								<div>
									<strong>{{ $t("Date") }}:</strong>
									{{ $d(sub.date) }}
								</div>
							</q-item-section>
						</q-item>
						<q-separator color="secondary" style="height: 5px" />
					</div>
				</q-list>
			</q-card-section>

			<q-card-section>
				<div class="text-h6">{{ $t("Totals") }}</div>
				<div>
					<strong>{{ $t("Checkouts Total") }}:</strong>
					{{ receipt.totals.checkout }}
				</div>
				<div>
					<strong>{{ $t("Subscription Total") }}:</strong>
					{{ receipt.totals.sub }}
				</div>
				<div>
					<strong>{{ $t("Total to Date") }}:</strong>
					{{ receipt.totals.toDate }}
				</div>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
import DateService from "../services/date.service";
import { useQuasar } from "quasar";

export default {
	props: {
		receipt: Object,
	},
	data() {
		return {
			$q: useQuasar(),
		};
	},
	mounted() {},
	methods: {
		$d(date) {
			return DateService.convertISOLocalDisplay(date);
		},
	},
};
</script>

<style scoped>
.logo-image {
	width: 2.5rem;
	height: 2.5rem;
}

.large-text div * {
	font-size: large;
}
</style>
