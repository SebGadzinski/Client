<template>
	<q-layout view="hHh lpR fFf">
		<!-- <q-header elevated class="bg-primary text-white" height-hint="98">
			<HeaderComp />
		</q-header> -->

		<q-page-container>
			<router-view />
		</q-page-container>

		<BottomNav />
		<div class="extra-space"></div>
	</q-layout>
</template>

<script>
// import HeaderComp from "../partials/HeaderComp.vue";
import BottomNav from "../partials/BottomNav.vue";
import { mapActions, mapState } from "pinia";

import { useSettingsState } from "../../stores/settings.state";

export default {
	name: "MainLayout",
	data() {
		return {
			settingsState: useSettingsState(),
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
		import(
			/* webpackInclude: /(fr|en-US)\.js$/ */
			`quasar/lang/${langName}`
		).then((lang) => {
			this.$q.lang.set(lang.default);
		});
		this.$i18n.locale = langName;
	},
	mounted() {
		if (process.env.NODE_ENV === "production") {
			this.$gtag.pageview("/main");
		}
	},
	components: {
		//TODO: If you want a header component uncomment this and the one above
		// HeaderComp,
		BottomNav,
	},
};
</script>
<style scoped>
q-page-container {
	height: 100% !important;
}
q-header {
	z-index: 500;
}
BottomNav {
	z-index: 500;
}
q-page-container {
	z-index: 100;
}
.extra-space {
	height: 200px;
	width: 100%;
}
</style>
