<template>
	<q-card style="max-width: none">
		<q-bar>
			<q-space />
			<q-btn dense flat icon="close" v-close-popup>
				<q-tooltip class="bg-white text-primary">{{
					$t("Close")
				}}</q-tooltip>
			</q-btn>
		</q-bar>
		<q-card-section class="row items-center">
			<div class="text-h6">
				{{ $t("Terms of Service Agreement") }}
			</div>
		</q-card-section>

		<q-separator></q-separator>

		<q-card-section class="left-aligned-stack q-pa-md">
			<p>
				<strong>{{ $t("tos_welcome", { company }) }} </strong>
				{{ $t("tos_welcome_info") }}
			</p>

			<h2>{{ $t("Acceptance of Terms") }}</h2>
			<p>
				{{ $t("tos_conf_accept", { company }) }}
			</p>

			<h2>{{ $t("Registration and Account Security") }}</h2>
			<p>
				{{ $t("tos_conf_reg") }}
			</p>

			<h2>{{ $t("Scope of Services") }}</h2>
			<p>
				{{ $t("tos_conf_scope", { company }) }}
			</p>

			<h2>{{ $t("Payments and Billing") }}</h2>
			<p>
				{{ $t("tos_conf_payments", { company }) }}
			</p>

			<h2>{{ $t("Cancellation and Refund Policy") }}</h2>
			<p>
				{{ $t("tos_conf_cancel", { company }) }}
			</p>

			<h2>{{ $t("Intellectual Property Rights") }}</h2>
			<p>
				{{ $t("tos_conf_intel", { company }) }}
			</p>

			<h2>{{ $t("Limitations of Liability") }}</h2>
			<p>
				{{ $t("tos_conf_limits", { company }) }}
			</p>

			<h2>{{ $t("Amendment of Terms") }}</h2>
			<p>
				{{ $t("tos_conf_amend") }}
			</p>
			<h2>{{ $t("Governing Law") }}</h2>
			<p>
				{{ $t("tos_conf_gover") }}
			</p>

			<h2>{{ $t("Contact Information") }}</h2>
			<p>
				{{ $t("tos_conf_email", { email }) }}
			</p>

			<h2>{{ $t("Agreement") }}</h2>
			<p>
				{{ $t("tos_conf_agreement", { company }) }}
			</p>
		</q-card-section>
	</q-card>
</template>

<script>
export default {
	name: "ConfirmationToSComponent",
	props: {
		show: Boolean,
	},
	data() {
		return {
			company: "Gadzy Software & Consulting",
			email: "sebastiangadzinskiwork@gmail.com",
			maximizedToggle: true,
		};
	},
};
</script>

<style>
.left-aligned-stack {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
</style>
