<template>
	<div class="fullscreen bg-primary text-center q-pa-md flex flex-center">
		<div>
			<img
				class="error-logo-img"
				alt="Quasar logo"
				src="~assets/logo.svg"
				style="width: 50vw"
			/>

			<div style="font-size: 4vh; opacity: 0.4">
				Oops. Nothing here...
			</div>

			<q-btn
				class="q-mt-xl"
				color="accent"
				unelevated
				to="/"
				label="Go Home"
				no-caps
			/>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "Error404Page",
});
</script>
<style>
.error-logo-img {
	width: 60vh;
	height: 60vh;
}
</style>
