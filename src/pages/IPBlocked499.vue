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
				{{ $t("Seems your IP has been blocked...") }}
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "IPBlocked499",
});
</script>
<style>
.error-logo-img {
	width: 60vh;
	height: 60vh;
}
</style>
