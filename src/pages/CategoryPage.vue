<template>
	<q-page class="flex column q-py-lg">
		<q-infinite-scroll
			class="flex justify-center w-full flex-wrap"
			@load="loadMore"
		>
			<div
				v-for="(service, index) in services"
				:key="index"
				class="card-container"
			>
				<q-card
					:id="`custom-card-${index}`"
					class="q-my-lg custom-card"
					flat
					bordered
					@mouseenter="hideImage(index)"
					@mouseleave="showImage(index)"
					@click="navigateToService(service.service_link)"
				>
					<div class="media-container">
						<img
							:class="`service-picture-${index}`"
							:src="service.thumbnail"
						/>
						<div
							class="q-pa-md"
							:class="`service-list-${index} hidden`"
						>
							<q-list bordered separator>
								<q-item
									clickable
									v-ripple
									v-for="(
										item, dlIndex
									) in service.descriptionList"
									:key="dlIndex"
								>
									<q-item-section>
										<q-item-label overline>{{
											$t(item.header)
										}}</q-item-label>
										<q-item-label>{{
											$t(item.details)
										}}</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</div>
					</div>
					<q-card-section>
						<div class="text-h6 q-mb-xs">
							{{ $t(service.service) }}
						</div>
					</q-card-section>
				</q-card>
			</div>

			<div v-if="loading" class="q-mt-md flex flex-center column">
				<q-spinner-gears size="5em" />
				<h1 class="text-h1">{{ $t(`Loading`) }}</h1>
			</div>
		</q-infinite-scroll>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import VanillaTilt from "vanilla-tilt";

export default {
	name: "CategoryPage",
	data() {
		return {
			loading: true,
			category: "",
			services: [],
			route: useRoute(),
			$q: useQuasar(),
		};
	},
	async mounted() {
		this.category = this.route?.params?.category;
	},
	unmounted() {},
	async updated() {},

	methods: {
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
		navigateToService(service) {
			this.$router.push(`/${this.category}/${service}`);
		},
		async loadMore() {
			this.loading = true;
			// Fetch or generate more categories here
			// For example, you could make an API call to get more categories
			// Simulate a delay for demonstration
			// Add new categories to the list
			this.services.push({
				thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
				service: "Email",
				service_link: "email",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});
			this.services.push({
				thumbnail:
					"http://getwallpapers.com/wallpaper/full/9/b/9/7401.jpg",
				service: "Project Maintence",
				service_link: "project_maintence",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});
			this.services.push({
				thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
				service: "Email",
				service_link: "email",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});
			this.services.push({
				thumbnail:
					"http://getwallpapers.com/wallpaper/full/9/b/9/7401.jpg",
				service: "Project Maintence",
				service_link: "project_maintence",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});
			this.services.push({
				thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
				service: "Email",
				service_link: "email",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});
			this.services.push({
				thumbnail:
					"http://getwallpapers.com/wallpaper/full/9/b/9/7401.jpg",
				service: "Project Maintence",
				service_link: "project_maintence",
				stars: 4,
				descriptionList: [
					{
						header: "Header Info",
						details:
							"This is why you should hire me for work. i am cheap",
					},
				],
			});

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
