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
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	name: "BottomNav",
	data() {
		return {
			authState: useAuthState(),
			routes: [],
		};
	},
	mounted() {
		console.log(this?.user);
		if (!this?.user) {
			this.routes = [
				{
					icon: "login",
					name: "Login",
					to: "/auth/login",
				},
			];
		} else {
			this.routes = [
				{
					icon: "home",
					name: "Home",
					to: "/",
				},
				{
					icon: "work",
					name: "Work",
					to: "/work",
				},
			];
			if (this?.user?.roles?.includes("admin") && this.$q.screen.gt.sm) {
				this.routes.push(
					...[
						{
							icon: "grid_view",
							name: "templates",
							to: "/work/template",
						},
						{
							icon: "group",
							name: "users",
							to: "/admin/users",
						},
						{
							icon: "flag",
							name: "VM Report",
							to: "/admin/vmStatusReport",
						},
					]
				);
			}
		}
		this.routes.push({
			icon: "settings",
			name: "Settings",
			to: "/settings",
		});
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
};
</script>
