// Uses: // Top Bar Navigation // Top Select State Change
<template>
	<q-toolbar
		elevated
		class="bg-primary text-white"
		style="padding-left: 2px"
		ref="header"
	>
		<img
			alt="Company logo"
			src="/logo.png"
			style="height: 32px; padding-left: 0px"
		/>
		<!-- Add whatever here -->
	</q-toolbar>
</template>

<script>
export default {
	name: "HeaderComp",
	data() {
		return {};
	},
	mounted() {},
	components: {},
};
</script>
