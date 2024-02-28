<template>
	<q-layout>
		<q-page-container>
			<q-tabs
				v-if="!$q.screen.xs"
				inline-label
				v-model="tab"
				class="q-pa-sm"
				active-color="primary"
				indicator-color="primary"
			>
				<q-tab
					v-for="route in routes"
					:key="route.name"
					:name="route.name"
					:to="route.to"
					:label="$t(route.name)"
					:icon="route.icon"
				/>
			</q-tabs>
			<!-- Mobile View -->
			<q-header class="bg-primary" v-if="$q.screen.xs">
				<q-toolbar>
					<q-btn
						flat
						@click="drawer = !drawer"
						round
						dense
						icon="menu"
					/>
					<q-toolbar-title>{{ $t("Gadzy Work") }}</q-toolbar-title>
				</q-toolbar>
			</q-header>

			<q-drawer
				v-model="drawer"
				show-if-above
				elevated
				:width="200"
				:breakpoint="500"
				v-if="$q.screen.xs"
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

			<q-page class="row q-col-gutter-md full-height">
				<div
					class="col-12 col-md-8 scroll"
					style="overflow-y: auto; height: 100%"
				>
					<router-view />
				</div>
				<div
					class="col-12 col-md-4 scroll"
					style="overflow-y: auto; height: 100%"
				>
					<SideBarContent />
				</div>
			</q-page>
		</q-page-container>
		<div class="extra-space"></div>
	</q-layout>
</template>

<script>
import SideBarContent from "../partials/SideBarComponent.vue";
import { mapActions, mapState } from "pinia";
import { ref } from "vue";

import { useSettingsState } from "../../stores/settings.state";

export default {
	data() {
		return {
			settingsState: useSettingsState(),
			drawer: false,
			tab: null, // Add this line
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
	components: {
		SideBarContent,
	},
};
</script>

<style scoped>
.scroll {
	max-height: 100%;
	overflow-y: auto;
}
.extra-space {
	height: 200px;
	width: 100%;
}
</style>
