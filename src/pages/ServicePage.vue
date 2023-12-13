<template>
	<q-page :class="'flex column'">
		<div class="q-pa-md carousel-outer-div">
			<q-carousel
				animated
				swipeable
				v-model="slide"
				arrows
				navigation
				:navigation-position="$q.screen.lt.md ? 'top' : 'bottom'"
				:autoplay="autoplay"
				transition-prev="slide-right"
				transition-next="slide-left"
				@mouseleave="autoplay = true"
				class="carousel-div"
				:height="$q.screen.lt.md ? '400px' : ''"
			>
				<q-carousel-slide
					v-for="(slide, index) in slides"
					:key="index"
					:name="index"
					:img-src="$q.screen.lt.md ? slide.image : ''"
				>
					<div
						v-if="$q.screen.gt.sm"
						class="row"
						:class="{ 'reverse-row': index % 2 === 0 }"
					>
						<div class="col-8">
							<img class="carousel-image" :src="slide.image" />
						</div>
						<div class="col-4 flex flex-center">
							<h4>{{ $t(slide.text) }}</h4>
						</div>
					</div>
					<div
						class="absolute-bottom custom-caption"
						v-if="$q.screen.lt.md"
					>
						<div class="text-h4 text-center">
							{{ $t(slide.text) }}
						</div>
					</div>
				</q-carousel-slide>
			</q-carousel>
		</div>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
	name: "ServicePage",
	data() {
		return {
			loading: true,
			category: "",
			service: "",
			slides: [
				{
					image: "https://www.pixelstalk.net/wp-content/uploads/2016/10/Cool-high-resolution-pictures.jpg",
					text: "Important Info",
				},
				{
					image: "https://www.pixelstalk.net/wp-content/uploads/2016/10/Cool-high-resolution-pictures.jpg",
					text: "Important Info",
				},
			],
			route: useRoute(),
			$q: useQuasar(),
			slide: ref(0),
			autoplay: ref(true),
		};
	},
	async mounted() {
		this.category = this.route?.params?.category;
		this.service = this.route?.params?.service;
	},
	unmounted() {},
	async updated() {},
	methods: {},
};
</script>

<style scoped>
.carousel-div {
	width: 100%;
	height: fit-content;
}
.carousel-image {
	width: 100%;
	height: 800px;
}
.reverse-row {
	flex-direction: row-reverse;
}

@media (min-width: 800px) {
	.carousel-outer-div {
	}
}
</style>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
