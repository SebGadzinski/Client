<template>
	<q-page :class="$q.screen.gt.sm ? 'table-spacing-center' : ''" padding>
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:rows="services"
			:grid="true"
			:loading="loading"
			class="q-mt-lg"
			:columns="columns"
			row-key="id"
			:filter="search"
			:pagination="initialPagination"
		>
			<template v-slot:item="props">
				<div
					v-if="$q.screen.gt.sm"
					class="q-pa-xs col-4 q-mb-lg cursor-pointer"
				>
					<q-card
						:id="`custom-card-${props.row.id}`"
						flat
						bordered
						@mouseenter="hideImage(props.row.id)"
						@mouseleave="showImage(props.row.id)"
						@click="navigateToService(props.row.slug)"
					>
						<div class="media-container">
							<img
								:class="`service-picture-${props.row.id}`"
								:src="props.row.thumbnailImg"
							/>
							<div
								class="q-pa-md"
								:class="`service-list-${props.row.id} hidden`"
							>
								<span class="text-body1">{{
									$t(props.row.description)
								}}</span>
							</div>
						</div>
						<q-card-section>
							<div class="text-h6 q-mb-xs">
								{{ $t(props.row.name) }}
							</div>
						</q-card-section>
					</q-card>
				</div>
				<div v-else class="q-pa-xs col-12 q-mb-lg cursor-pointer">
					<q-card
						:id="`custom-card-${props.row.id}`"
						flat
						bordered
						@click="navigateToService(props.row.slug)"
					>
						<div class="media-container">
							<img
								:class="`service-picture-${props.row.id}`"
								:src="props.row.thumbnailImg"
							/>
							<div
								class="q-pa-md"
								:class="`service-list-${props.row.id} hidden`"
							>
								<span class="text-body1">{{
									$t(props.row.description)
								}}</span>
							</div>
						</div>
						<q-card-section>
							<div class="text-h6 q-mb-xs">
								{{ $t(props.row.name) }}
							</div>
						</q-card-section>
					</q-card>
				</div>
			</template>
		</q-table>
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
			search: "",
			categorySlug: ref(""),
			services: [],
			initialPagination: {
				sortBy: "name",
				descending: false,
				page: 1,
				rowsPerPage: 15,
			},
			columns: [
				{
					name: "name",
					align: "left",
					label: "Name",
					field: (row) => row.name,
					sortable: true,
				},
				{
					name: "slug",
					align: "left",
					label: "Slug",
					field: (row) => row.slug,
				},
				{
					name: "description",
					align: "left",
					label: "Description",
					field: (row) => row.description,
				},
			],
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
					newServices[i].id = i;
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
	overflow: hidden;
	/* Hide overflow to maintain clean edges */
}

.media-container {
	position: relative;
	width: 100%;
	/* Full width of the card */
	/* Adjust the padding-top based on the aspect ratio of your video or to reduce space */
	padding-top: 56.25%;
	/* 16:9 Aspect Ratio */
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
