<template>
	<div class="">
		<q-layout
			view="hHh Lpr lff"
			container
			style="height: 100vh"
			class="shadow-2 hide-scroll"
		>
			<q-header class="bg-primary q-py-sm" style="width: 100vw">
				<q-toolbar class="toolbar-custom">
					<q-btn
						flat
						@click="drawer = !drawer"
						round
						dense
						icon="menu"
					/>
					<router-link class="route-link-container" to="/">
						<img
							src="logo.svg"
							alt="Logo"
							class="q-mr-md logo-image"
						/>
					</router-link>
					<!-- <q-btn
						v-if="this.$q.screen.gt.sm"
						to="/"
						flat
						class="route-link-container text-h4 q-py-none"
						label="Gadzy Work"
					/> -->
				</q-toolbar>
			</q-header>

			<q-drawer
				v-model="drawer"
				show-if-above
				elevated
				:width="200"
				:breakpoint="500"
			>
				<q-scroll-area class="fit">
					<q-list padding class="menu-list">
						<q-item
							v-for="route in routes"
							:key="route.name"
							:to="route.to"
							clickable
							v-ripple
						>
							<q-item-section avatar>
								<q-icon :name="route.icon" />
							</q-item-section>

							<q-item-section>
								{{ $t(route.name) }}
							</q-item-section>
						</q-item>
					</q-list>
				</q-scroll-area>
			</q-drawer>

			<q-page-container>
				<router-view />
			</q-page-container>
			<div class="extra-space"></div>
		</q-layout>
	</div>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useSettingsState } from "../../stores/settings.state";

export default {
	name: "DrawerLayout",
	data() {
		return {
			settingsState: useSettingsState(),
			authState: useAuthState(),
			drawer: ref(false),
			routes: [],
		};
	},
	mounted() {
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
					icon: "work",
					name: "Work",
					to: "/work",
				},
			];
			if (this?.user?.roles?.includes("admin")) {
				this.routes.push(
					...[
						{
							icon: "grid_view",
							name: "Templates",
							to: "/work/template",
						},
						{
							icon: "group",
							name: "Users",
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
		...mapState(useSettingsState, ["language"]),
		...mapState(useAuthState, ["user"]),
	},
	created() {
		// Set the default language
		let langName = this.language;
		if (!langName)
			(langName = "en-US"),
				console.log("SETTING DEFAULT LANGUAGE TO ENGLISH");
		this.settingsState.setLanguage(langName);
		import(`quasar/lang/${langName}`).then((lang) => {
			this.$q.lang.set(lang.default);
		});
		this.$i18n.locale = langName;
	},
};
</script>

<style lang="sass" scoped>
.route-link-container
  position: absolute
  left: 50%
  transform: translateX(-50%)

.toolbar-custom
  display: flex
  justify-content: space-between

.toolbar-title
  display: flex
  justify-content: center
  width: 100%

.logo-image
  width: 2.5rem
  height: 2.5rem

.ellipsis
  overflow: none !important

.menu-list .q-item
  border-radius: 0 32px 32px 0

.extra-space
  height: 200px
  width: 100%
</style>
