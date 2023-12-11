// Uses: // Bottom Bar Navigation
<template>
	<q-footer elevated class="bg-primary text-white" ref="bottomNav">
		<q-tabs elevated align="center">
			<q-route-tab
				v-for="(route, key) in routes"
				:key="'route' + key"
				:to="route.to"
				style="width: 25%"
				min-width="48"
				class="px-0"
				:icon="route.icon"
				:label="$t(route.name)"
			>
				<q-badge v-if="route.count" color="red" floating>{{
					route.count
				}}</q-badge>
			</q-route-tab>
		</q-tabs>
	</q-footer>
</template>

<script>
export default {
	name: "BottomNav",
	data() {
		return {
			routes: [
				{
					icon: "format_align_left",
					name: "page1",
					to: "/page1",
					count: null,
				},
				{
					icon: "hub",
					name: "page2",
					to: "/page2",
				},
				{
					icon: "settings",
					name: "settings",
					to: "/settings",
				},
			],
		};
	},
	mounted() {},
};
</script>
