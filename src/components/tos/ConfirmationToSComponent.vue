<template>
	<q-card style="max-width: none">
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

			<h4>{{ $t("Acceptance of Terms") }}</h4>
			<p>
				{{ $t("tos_conf_accept", { company }) }}
			</p>

			<h4>{{ $t("Registration and Account Security") }}</h4>
			<p>
				{{ $t("tos_conf_reg") }}
			</p>

			<h4>{{ $t("Scope of Services") }}</h4>
			<p>
				{{ $t("tos_conf_scope", { company }) }}
			</p>

			<h4>{{ $t("Payments and Billing") }}</h4>
			<p>
				{{ $t("tos_conf_payments", { company }) }}
			</p>

			<h4>{{ $t("Cancellation and Refund Policy") }}</h4>
			<p>
				{{ $t("tos_conf_cancel", { company }) }}
				{{ $t("no_refund_csg") }}
			</p>

			<h4>{{ $t("Intellectual Property Rights") }}</h4>
			<p>
				{{ $t("tos_conf_intel", { company }) }}
			</p>

			<h4>{{ $t("Limitations of Liability") }}</h4>
			<p>
				{{ $t("tos_conf_limits", { company }) }}
			</p>

			<h4>{{ $t("Amendment of Terms") }}</h4>
			<p>
				{{ $t("tos_conf_amend") }}
			</p>
			<h4>{{ $t("Governing Law") }}</h4>
			<p>
				{{ $t("tos_conf_gover") }}
			</p>

			<h4>{{ $t("Contact Information") }}</h4>
			<p>
				{{ $t("tos_conf_email", { email }) }}
			</p>

			<h4>{{ $t("Agreement") }}</h4>
			<p>
				{{ $t("tos_conf_agreement", { company }) }}
			</p>
		</q-card-section>
		<div class="flex justify-center">
			<q-btn
				:class="
					($q.screen.gt.sm ? 'text-h3' : 'text-h6') +
					'text-center q-mb-sm'
				"
				style="width: 50%"
				color="primary"
				v-close-popup
				:label="$t('Agree')"
			/>
		</div>
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
