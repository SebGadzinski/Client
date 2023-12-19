<template>
	<q-page class="flex column q-py-lg">
		<q-infinite-scroll
			class="flex row justify-center w-full"
			@load="loadMore"
		>
			<div
				v-for="(category, index) in categorys"
				:key="index"
				class="full-width"
			>
				<q-card
					:id="`custom-card-${index}`"
					class="q-my-lg custom-card"
					flat
					bordered
					@mouseenter="hideImage(index)"
					@mouseleave="showImage(index)"
					@click="navigateToCategory(category.name)"
				>
					<div class="media-container">
						<img
							:class="`category-picture-${index}`"
							:src="category.thumbnail"
						/>
						<div
							class="q-pa-md"
							:class="`category-list-${index} hidden`"
						>
							<q-list bordered separator>
								<q-item
									clickable
									v-ripple
									v-for="(item, dlIndex) in category.services"
									:to="item.link"
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
							{{ $t(category.name) }}
						</div>
						<div class="row no-wrap items-center">
							<span class="text-caption text-grey q-ml-sm">{{
								$t(`${category.services.length} Services`)
							}}</span>
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
import dataService from "../services/data.service";
import { useQuasar, QSpinnerGears, QInfiniteScroll } from "quasar";
import VanillaTilt from "vanilla-tilt";

export default {
	name: "HomePage",
	components: {
		QSpinnerGears,
		QInfiniteScroll,
	},
	data() {
		return {
			loading: false,
			categorys: [
				// ... initial categories ...
			],
			players: [],
			$q: useQuasar(),
			currentPage: 1,
		};
	},
	methods: {
		onListItemClick(event, link) {
			if (this.$q.screen.gt.sm) {
				event.stopPropagation(); // Prevents event from bubbling up
				this.$router.push(link); // Manually handling the navigation
			}
		},
		hideImage(index) {
			if (this.$q.screen.gt.sm) {
				let list = document.getElementsByClassName(
					`category-list-${index}`
				)[0];
				let picture = document.getElementsByClassName(
					`category-picture-${index}`
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
					`category-list-${index}`
				)[0];
				let picture = document.getElementsByClassName(
					`category-picture-${index}`
				)[0];

				list.classList.add("hidden");

				// Start fading out the picture and fading in the video
				picture.style.opacity = "1";
				list.style.opacity = "0";
			}
		},
		navigateToCategory(category) {
			this.$router.push(`/${category}`);
		},
		async loadMore() {
			const newCategories = await dataService.fetchCategories(
				this.currentPage
			);
			console.log(newCategories);

			if (newCategories && newCategories.length > 0) {
				for (let i = 0; newCategories.length < i; i++) {
					console.log("pushing:");
					console.log(newCategories[i]);
					this.categorys.push(newCategories[i]);
					this.currentPage++;
				}
			}
			console.log(this.categorys);
			this.loading = false;
			// this.$nextTick(() => {
			// 	// Access DOM elements here
			// 	for (let i = 0; i < this.categorys.length; i++) {
			// 		const tiltElement = document.getElementById(
			// 			`custom-card-${i}`
			// 		);
			// 		VanillaTilt.init(tiltElement, {
			// 			max: 2,
			// 			glare: false,
			// 			"max-glare": 1,
			// 		});
			// 	}
			// });
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
				glare: false,
				"max-glare": 1,
			});
		},
	},
};
</script>
<style>
.card-container {
	height: fit-content;
}
.media-container iframe {
	position: absolute !important;
	top: 50% !important;
	left: 50% !important;
	transform: translate(
		-50%,
		-50%
	) !important; /* Translate the iframe back by half of its width and half of its height to center it */
	width: 100% !important;
	height: 100% !important;
}
</style>
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

@media (min-width: 992px) {
	.custom-card {
		width: 1000px;
	}
}

@media (max-width: 991px) {
	.custom-card {
		width: 90vw;
	}
}
</style>
