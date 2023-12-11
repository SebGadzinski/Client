<template>
	<div class="">
		<q-layout
			view="hHh Lpr lff"
			container
			style="height: 100vh"
			class="shadow-2"
		>
			<q-header class="bg-primary">
				<q-toolbar>
					<q-btn
						flat
						@click="drawer = !drawer"
						round
						dense
						icon="menu"
					/>
					<q-toolbar-title>{{
						$t("Work Website")
					}}</q-toolbar-title>
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
		</q-layout>
	</div>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapState } from "pinia";

import { useSettingsState } from "../../stores/settings.state";

export default {
	name: "DrawerLayout",
	data() {
		return {
			settingsState: useSettingsState(),
			drawer: ref(false),
			routes: [
				{
					icon: "format_align_left",
					name: "Page 1",
					to: "/page1",
					count: null,
				},
				{
					icon: "hub",
					name: "Page 2",
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
	computed: {
		...mapState(useSettingsState, ["language"]),
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
.menu-list .q-item
  border-radius: 0 32px 32px 0
</style>
