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
				<h4 class="inline-block q-my-auto">
					Gadzy Software & Consulting
				</h4>
			</q-card-section>
			<q-card-section>
				<div class="text-h6">{{ $t("Receipt Details") }}</div>
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
				<div class="text-h6">{{ $t("Checkouts") }}</div>
				<q-list bordered>
					<q-item
						v-for="(checkout, index) in receipt.checkouts"
						:key="'checkout-' + index"
					>
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
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>

			<q-card-section>
				<div class="text-h6">{{ $t("Subscriptions") }}</div>
				<q-list bordered>
					<q-item
						v-for="(sub, index) in receipt.subs"
						:key="'sub-' + index"
					>
						<q-item-section>
							<div>
								<strong>{{ $t("ID") }}:</strong> {{ sub.id }}
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

export default {
	props: {
		receipt: Object,
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		$d(date) {
			return DateService.convertISOLocalDisplay(date);
		},
		print() {
			// Get the HTML content of the component
			const componentHtml =
				document.getElementById("receipt-card").outerHTML;
			// Open a new window or tab
			const printWindow = window.open("", "_blank");

			// Write the component's HTML to the new window, along with some basic styling
			printWindow.document.write(`
				<html>
				<head>
					<title>Print</title>
					<style>
					body {
						font-family: Arial, sans-serif;
						margin: 0;
						padding: 20px;
					}
					.receipt-card {
						/* Your styles here */
					}
					/* Add other styles if needed */
					</style>
				</head>
				<body>
					${componentHtml}
				</body>
				</html>
			`);

			// Close the document for writing to render the content
			printWindow.document.close();

			// Wait for the new document to load to ensure styles are applied
			printWindow.onload = function () {
				// Focus the new window, invoke the print dialog, and close after printing
				printWindow.focus();
				printWindow.print();
				printWindow.onafterprint = function () {
					printWindow.close();
				};
			};
		},
	},
};
</script>

<style lang="sass" scoped>
.logo-image
  width: 2.5rem
  height: 2.5rem
</style>
