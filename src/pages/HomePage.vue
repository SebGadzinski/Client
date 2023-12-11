<template>
	<q-page :class="'flex flex-center'">
		<div>
			<h1>Home</h1>
		</div>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";

export default {
	name: "HomePage",
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
