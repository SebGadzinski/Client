<template>
	<q-page :class="'flex flex-center bg-primary'">
		<div>
			<h1>Meeting</h1>
		</div>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";

export default {
	name: "MeetingPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
		};
	},
	async mounted() {},
	unmounted() {},
	async updated() {},

	methods: {},
};
</script>

<style scoped></style>
