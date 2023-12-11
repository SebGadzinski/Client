<template>
	<q-page class="flex column q-py-lg">
		<q-infinite-scroll
			class="flex column justify-center w-full"
			@load="loadMore"
		>
			<q-card
				v-for="(category, index) in categorys"
				:key="index"
				class="q-my-lg custom-card"
				flat
				bordered
				@mouseenter="playVideo(index)"
				@mouseleave="hideVideo(index)"
			>
				<div class="media-container">
					<img
						:class="`category-picture-${index}`"
						:src="category.thumbnail"
					/>
					<iframe
						:id="`category-video-${index}`"
						:class="`category-video-${index} hidden`"
						:src="category.videoLink"
						frameborder="5"
						allow="autoplay; encrypted-media"
						allowfullscreen
					></iframe>
				</div>
				<q-card-section>
					<div class="text-h6 q-mb-xs">
						{{ $t(category.category) }}
					</div>
					<div class="row no-wrap items-center">
						<!-- <q-rating
							size="18px"
							v-model="stars"
							:max="5"
							:model-value="category.stars"
							color="accent"
						/> -->
						<span class="text-caption text-grey q-ml-sm">{{
							$t(`${category.services} Services`)
						}}</span>
					</div>
				</q-card-section>
			</q-card>

			<div v-if="loading" class="q-mt-md flex flex-center column">
				<q-spinner-gears size="5em" />
				<h1 class="text-h1">{{ $t(`Loading`) }}</h1>
			</div>
		</q-infinite-scroll>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears, QInfiniteScroll } from "quasar";

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
			$q: useQuasar(),
		};
	},
	methods: {
		async loadMore() {
			this.loading = true;
			// Fetch or generate more categories here
			// For example, you could make an API call to get more categories
			// Simulate a delay for demonstration
			setTimeout(() => {
				// Add new categories to the list
				for (let i = 1; i < 5; i++)
					this.categorys.push({
						thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
						videoLink: "https://www.youtube.com/embed/TOm_hLN5MZY", // Updated embed URL
						category: "Software",
						showVideo: false,
						stars: 4,
						services: 14,
					});
				this.loading = false;
			}, 2000);
		},
		playVideo(index) {
			let video = document.getElementById(`category-video-${index}`);
			let picture = document.getElementsByClassName(
				`category-picture-${index}`
			)[0];

			// Start fading out the picture
			picture.style.opacity = "0";

			// Wait for the fade-out transition to complete
			setTimeout(() => {
				picture.style.display = "none";
				video.classList.remove("hidden");
				video.style.opacity = "1";
			}, 500); // 500ms for fade-out duration
		},

		hideVideo(index) {
			let video = document.getElementById(`category-video-${index}`);
			let picture = document.getElementsByClassName(
				`category-picture-${index}`
			)[0];

			// Start fading out the video
			video.style.opacity = "0";

			// Wait for the fade-out transition to complete
			setTimeout(() => {
				video.classList.add("hidden");
				picture.style.display = "block";
				picture.style.opacity = "1";
			}, 500); // 500ms for fade-out duration
		},
	},
};
</script>

<style scoped>
.hidden {
	display: none;
	opacity: 0;
}
.category-item {
	margin-bottom: 20px;
}

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

.media-container img,
.media-container iframe {
	transition: opacity 0.5s ease-in-out;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.q-card-section {
	position: relative; /* Added to position card content correctly */
}

@media (min-width: 992px) {
	.custom-card {
		width: 1000px;
	}
}

@media (max-width: 991px) {
	.custom-card {
		width: 90%;
	}
}
</style>
