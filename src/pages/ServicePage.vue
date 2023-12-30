<template>
	<q-page v-if="Object.keys(service).length > 0" :class="'flex column'">
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
					v-for="(slide, index) in service.slides"
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
				v-for="(detail, index) in service.details"
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
				:to="`/${categorySlug}/${serviceSlug}/meeting`"
				>{{ $t("Set Up Meeting") }}</q-btn
			>
		</div>
		<div
			class="flex justify-center text-center"
			v-if="service.faqs.length > 0"
		>
			<div class="full-width">
				<h3>{{ $t("FAQs") }}</h3>
			</div>
			<q-list bordered class="rounded-borders">
				<q-expansion-item
					v-for="(faq, index) in service.faqs"
					:key="index"
					style="color: white"
					class="bg-primary text-subtitle1 faq-section text-left"
					expand-icon-class="text-white"
					:default-opened="false"
					:label="$t(faq.question)"
				>
					<q-card class="card-text-color">
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
import dataService from "../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
	name: "ServicePage",
	data() {
		return {
			loading: true,
			categorySlug: "",
			serviceSlug: "",
			route: useRoute(),
			$q: useQuasar(),
			slide: ref(0),
			autoplay: ref(true),
			service: {},
		};
	},
	async mounted() {
		try {
			this.categorySlug = this.route?.params?.category;
			this.serviceSlug = this.route?.params?.service;
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Loading..."),
			});
			this.service = await dataService.getServicePageData(
				this.categorySlug,
				this.serviceSlug
			);
			console.log(this.service);
			this.$q.loading.hide();
			this.loading = false;
		} catch (err) {
			this.$q.loading.hide();
			this.loading = false;
			console.error(err);
			this.$q
				.dialog({
					title: this.$t("Error"),
					message: this.$t(err.toString()),
				})
				.onDismiss(() => {
					this.$router.push("/");
				});
		}
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

.card-text-color {
	color: black;
}

.body--dark .card-text-color {
	color: white;
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
