// Sample
<template>
	<div class="time-component">
		{{ currentTime }}
	</div>
</template>

<script>
export default {
	data() {
		return {
			currentTime: "",
		};
	},
	mounted() {
		setInterval(() => {
			const now = new Date();
			this.currentTime = now.toLocaleTimeString();
		}, 1000);
	},
};
</script>

<style scoped>
.time-component {
	font-size: 2rem;
	font-weight: bold;
	text-align: center;
}
</style>
