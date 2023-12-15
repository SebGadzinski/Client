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
		<div>
			<div
				v-for="(detail, index) in details"
				:key="index"
				class="text-center"
			>
				<h3>{{ $t(detail.header) }}</h3>
				<p class="text-body1">{{ $t(detail.info) }}</p>
			</div>
		</div>
		<div class="flex justify-center text-center">
			<div class="full-width">
				<h3>{{ $t("Book Meeting") }}</h3>
			</div>
			<q-btn
				class="text-h6 consultation-meeting-btn"
				color="primary"
				:to="`/${category}/${service}/meeting`"
				>{{ $t("Set Up Meeting") }}</q-btn
			>
		</div>
		<div class="flex justify-center text-center" v-if="faqs.length > 0">
			<div class="full-width">
				<h3>{{ $t("FAQs") }}</h3>
			</div>
			<q-list bordered class="rounded-borders">
				<q-expansion-item
					v-for="(faq, index) in faqs"
					:key="index"
					class="bg-primary text-subtitle1 faq-section text-left"
					expand-icon-class="text-white"
					:default-opened="false"
					:label="$t(faq.question)"
				>
					<q-card>
						<q-card-section class="text-body1">
							{{ $t(faq.answer) }}
						</q-card-section>
					</q-card>
				</q-expansion-item>
			</q-list>
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
			details: [
				{
					header: "Description",
					info: "This data is what will be used for information.",
				},
				{
					header: "Examples",
					info: "Email marketing campaign, Email subscriptions, Email Sender UI, Email reporting system. Custom Email Functionality",
				},
				{ header: "Price", info: "Based off project size." },
				{ header: "Service Time", info: "Based off project size." },
			],
			faqs: [
				{
					question: "why am i so hot",
					answer: "Cause your a hot pocket",
				},
				{
					question: "why am i so hot",
					answer: "Cause your a hot pocket",
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
	height: 80vh;
}
.reverse-row {
	flex-direction: row-reverse;
}

.consultation-meeting-btn {
	width: 60vw;
}

.faq-section {
	width: 60vw;
}

@media (max-width: 800px) {
	.consultation-meeting-btn {
		width: 80vw;
	}

	.faq-section {
		width: 80vw;
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
