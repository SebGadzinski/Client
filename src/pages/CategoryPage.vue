<template>
	<q-page class="flex column q-py-lg">
		<q-infinite-scroll
			class="flex justify-center w-full flex-wrap"
			@load="loadMore"
		>
			<a class="card-container" :href="watchMeLink">
				<q-card
					:id="`custom-card-${index}`"
					class="q-my-lg custom-card"
					flat
					bordered
					@mouseenter="hideImage(index)"
					@mouseleave="showImage(index)"
				>
					<div class="media-container">
						<!-- Fix Here -->
						<img
							:class="`service-picture-${index}`"
							:src="watchMeImg"
						/>
						<div
							class="q-pa-md"
							:class="`service-list-${index} hidden`"
						>
							<span class="text-body1">{{
								$t("Watch Me!")
							}}</span>
						</div>
					</div>
					<q-card-section>
						<div class="text-h6 q-mb-xs">
							{{ $t("Watch Me!") }}
						</div>
					</q-card-section>
				</q-card>
			</a>
			<!-- Service Cards -->
			<div
				v-for="(service, index) in services"
				:key="index"
				class="card-container"
			>
				<q-card
					:id="`custom-card-${index + 1}`"
					class="q-my-lg custom-card"
					flat
					bordered
					@mouseenter="hideImage(index)"
					@mouseleave="showImage(index)"
					@click="navigateToService(service.slug)"
				>
					<div class="media-container">
						<img
							:class="`service-picture-${index}`"
							v-lazy="service.thumbnailImg"
						/>
						<div
							class="q-pa-md"
							:class="`service-list-${index} hidden`"
						>
							<span class="text-body1">{{
								$t(service.description)
							}}</span>
						</div>
					</div>
					<q-card-section>
						<div class="text-h6 q-mb-xs">
							{{ $t(service.name) }}
						</div>
					</q-card-section>
				</q-card>
			</div>
		</q-infinite-scroll>
	</q-page>
</template>

<script>
import dataService from "../services/data.service";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import VanillaTilt from "vanilla-tilt";
import { ref } from "vue";

export default {
	name: "CategoryPage",
	data() {
		return {
			loading: true,
			categorySlug: ref(""),
			services: [],
			route: useRoute(),
			$q: useQuasar(),
			expandVideo: false,
			watchMeImg: null,
			watchMeLink: null,
		};
	},
	async mounted() {
		try {
			this.categorySlug = ref(this.route?.params?.category);
			await this.loadMore();
		} catch (err) {
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
	computed: {
		baseURL() {
			// This computes the base URL dynamically based on window location
			return window.location.origin;
		},
	},
	methods: {
		expandHeight() {},
		hideImage(index) {
			if (this.$q.screen.gt.sm) {
				let list = document.getElementsByClassName(
					`service-list-${index}`
				)[0];
				let picture = document.getElementsByClassName(
					`service-picture-${index}`
				)[0];

				list.classList.remove("hidden");

				// Start fading out the picture and fading in the video
				picture.style.opacity = "0";
				list.style.opacity = "1";
			}
		},
		showImage(index) {
			if (this.$q.screen.gt.sm) {
				let list = document.getElementsByClassName(
					`service-list-${index}`
				)[0];
				let picture = document.getElementsByClassName(
					`service-picture-${index}`
				)[0];

				list.classList.add("hidden");

				// Start fading out the picture and fading in the video
				picture.style.opacity = "1";
				list.style.opacity = "0";
			}
		},
		navigateToService(serviceSlug) {
			this.$router.push(`/${this.categorySlug}/${serviceSlug}`);
		},
		async loadMore() {
			if (this.categorySlug === "") return;
			this.loading = true;
			const data = await dataService.getCategoryPageData(
				this.categorySlug
			);
			this.watchMeImg = data[0].watchMeImg;
			this.watchMeLink = data[0].watchMeLink;
			const newServices = data[0].services;
			if (newServices && newServices.length > 0) {
				for (let i = 0; i < newServices.length; i++) {
					this.services.push(newServices[i]);
				}
			}
			this.loading = false;
			this.$nextTick(() => {
				// Access DOM elements here
				for (let i = 0; i < this.services.length; i++) {
					const tiltElement = document.getElementById(
						`custom-card-${i}`
					);
					VanillaTilt.init(tiltElement, {
						max: 5,
						glare: true,
						"max-glare": 1,
					});
				}
			});
		},
		killTilt(index) {
			// Destroy the tilt effect
			const tiltElement = document.getElementById(`custom-card-${index}`);
			if (tiltElement?.vanillaTilt) {
				tiltElement.vanillaTilt.destroy();
			}
		},
		allowTilt(index) {
			const tiltElement = document.getElementById(`custom-card-${index}`);
			VanillaTilt.init(tiltElement, {
				max: 5,
				glare: true,
				"max-glare": 1,
			});
		},
	},
};
</script>

<style scoped>
.custom-card {
	display: block;
	margin: 20px auto;
	cursor: pointer;
	overflow: hidden; /* Hide overflow to maintain clean edges */
}
.media-container {
	position: relative;
	width: 100%; /* Full width of the card */
	/* Adjust the padding-top based on the aspect ratio of your video or to reduce space */
	padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.media-container > img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transition: opacity 1s ease-in-out;
}
.media-container > div {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	transition: opacity 1s ease-in-out;
}
@media (min-width: 768px) {
	.custom-card {
		width: 30vw;
		margin: 20px 20px;
	}
}

@media (max-width: 767px) {
	.custom-card {
		width: 90vw;
	}
}
</style>
