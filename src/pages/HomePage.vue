<template>
	<q-page class="flex column q-py-lg">
		<q-infinite-scroll
			class="flex column justify-center w-full"
			@load="loadMore"
		>
			<div
				v-for="(category, index) in categorys"
				:key="index"
				class="card-container"
			>
				<q-card
					:id="`custom-card-${index}`"
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
						<div
							:id="`category-video-${index}`"
							@mouseenter="killTilt(index)"
							@mouseleave="allowTilt(index)"
							:class="`category-video-${index} hidden`"
						></div>
					</div>
					<q-card-section>
						<div class="text-h6 q-mb-xs">
							{{ $t(category.category) }}
						</div>
						<div class="row no-wrap items-center">
							<span class="text-caption text-grey q-ml-sm">{{
								$t(`${category.services} Services`)
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
		};
	},
	async mounted() {
		// Wait for the API script to load
		window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;

		// Load the YouTube Iframe API script
		await this.loadMore();
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	methods: {
		onYouTubeIframeAPIReady() {
			console.log(this.categorys);
			// Initialize YouTube players for each category
			this.categorys.forEach((category, index) => {
				this.players[index] = new YT.Player(`category-video-${index}`, {
					videoId: category.videoId,
					width: "",
					height: "",
					playerVars: {
						// autoplay: 1,
						enablejsapi: 1,
						controls: 1,
						// autohide: 1,
						wmode: "opaque",
						origin: "http://localhost:8081",
					},
					events: {
						onReady: this.onPlayerReady,
						onStateChange: this.onPlayerStateChange,
					},
				});
			});
		},
		onPlayerReady(event) {
			let index = event.target.g.id.split("category-video-")[1];
			if (this.players[index]) {
				let videoContainer = document.getElementById(
					`category-video-${index}`
				);

				// Add mouseenter and mouseleave event listeners to the card
				videoContainer.addEventListener("mouseenter", (event) =>
					this.killTilt(event.target.id.split("category-video-")[1])
				);
				videoContainer.addEventListener("mouseleave", (event) =>
					this.allowTilt(event.target.id.split("category-video-")[1])
				);
			}
		},
		onPlayerStateChange(event) {},
		async loadMore() {
			this.loading = true;
			// Fetch or generate more categories here
			// For example, you could make an API call to get more categories
			// Simulate a delay for demonstration
			// Add new categories to the list
			for (let i = 1; i < 10; i++) {
				this.categorys.push({
					thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
					videoId: "NYU3Np_6dq4", // Updated embed URL
					category: "Software",
					showVideo: false,
					stars: 4,
					services: 14,
					player: null,
				});
			}

			this.loading = false;
			this.$nextTick(() => {
				// Access DOM elements here
				for (let i = 0; i < this.categorys.length; i++) {
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
		playVideo(index) {
			// category.player.playVideo();
			// console.log(category.player);
			let video = document.getElementsByClassName(
				`category-video-${index}`
			)[0];
			let picture = document.getElementsByClassName(
				`category-picture-${index}`
			)[0];

			// Bring the video to the front
			video.style.zIndex = "2";
			picture.style.zIndex = "1";
			setTimeout(() => {
				video.classList.remove("hidden");
				setTimeout(() => {
					// Play the video for the specified index
					console.log(this.players[index]);
					if (
						!video.classList.contains("hidden") &&
						this.players[index] &&
						this.players[index].playVideo
					) {
						this.players[index].playVideo();
					}
				}, 500);
			}, 200);

			// Start fading out the picture and fading in the video
			picture.style.opacity = "0";
			video.style.opacity = "1";
		},

		hideVideo(index) {
			let video = document.getElementById(`category-video-${index}`);
			let picture = document.getElementsByClassName(
				`category-picture-${index}`
			)[0];

			// Bring the picture to the front
			picture.style.zIndex = "2";
			video.style.zIndex = "1";
			// Pause or stop the video for the specified index
			if (this.players[index] && this.players[index].pauseVideo) {
				this.players[index].pauseVideo();
			}
			video.classList.add("hidden");

			// Start fading out the video and fading in the picture
			video.style.opacity = "0";
			picture.style.opacity = "1";
			this.allowTilt(index);
		},
	},
};
</script>
<style>
.media-container iframe {
	position: absolute !important;
	top: 50% !important;
	left: 50% !important;
	transform: translate(
		-50%,
		-50%
	) !important; /* Translate the iframe back by half of its width and half of its height to center it */
	width: 90% !important;
	height: 90% !important;
}
</style>
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

.media-container img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.media-container img {
	transition: opacity 1s ease-in-out;
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
