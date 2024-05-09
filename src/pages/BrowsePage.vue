<template>
	<q-page :class="$q.screen.gt.sm ? 'table-spacing-around' : ''" padding>
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:rows="categorys"
			:grid="true"
			:loading="loading"
			class="q-mt-lg"
			:columns="columns"
			row-key="id"
			:filter="search"
			:rows-per-page-options="[0]"
		>
			<template v-slot:item="props">
				<div
					v-if="$q.screen.gt.sm"
					style="width: 48%"
					class="q-pa-xs q-mb-lg cursor-pointer"
				>
					<q-card
						:id="`custom-card-${props.row.id}`"
						flat
						bordered
						@mouseenter="hideImage(props.row.id)"
						@mouseleave="showImage(props.row.id)"
						@click="navigateToCategory(props.row.slug)"
					>
						<div class="media-container">
							<img
								:class="`category-picture-${props.row.id}`"
								v-lazy="props.row.thumbnailImg"
							/>
							<div
								class="q-pa-md"
								:class="`category-list-${props.row.id} hidden`"
							>
								<q-list bordered separator>
									<q-item
										clickable
										v-ripple
										v-for="(service, dlIndex) in props.row
											.services"
										:to="`/${props.row.slug}/${service.slug}`"
										@click="
											(event) =>
												onListItemClick(
													event,
													props.row.slug,
													service.slug
												)
										"
										:key="dlIndex"
									>
										<q-item-section>
											<q-item-label overline>{{
												$t(service.name)
											}}</q-item-label>
											<q-item-label>{{
												$t(service.description)
											}}</q-item-label>
										</q-item-section>
									</q-item>
								</q-list>
							</div>
						</div>
						<q-card-section>
							<div class="text-h6 q-mb-xs">
								{{ $t(props.row.name) }}
							</div>
							<div class="row no-wrap items-center">
								<span class="text-caption text-grey q-ml-sm">{{
									$t("servicesCount", {
										count: props.row.services.length,
									})
								}}</span>
							</div>
						</q-card-section>
					</q-card>
				</div>
			</template>
			<template v-slot:bottom></template>
		</q-table>
	</q-page>
</template>
<script>
import dataService from "../services/data.service";
import { useQuasar } from "quasar";
import VanillaTilt from "vanilla-tilt";

export default {
	name: "BrowsePage",
	components: {},
	data() {
		return {
			loading: false,
			search: "",
			columns: [
				{
					name: "name",
					align: "left",
					label: "Name",
					field: (row) => row.name,
				},
				{
					name: "slug",
					align: "left",
					label: "Slug",
					field: (row) => row.slug,
				},
			],
			categorys: [],
			players: [],
			$q: useQuasar(),
		};
	},
	async mounted() {
		const newCategories = await dataService.getHomePageData();
		if (newCategories && newCategories.length > 0) {
			for (let i = 0; i < newCategories.length; i++) {
				newCategories[i].id = i;
				this.categorys.push(newCategories[i]);
			}
		}
		this.loading = false;
		this.$nextTick(() => {
			// Access DOM elements here
			for (let i = 0; i < this.categorys.length; i++) {
				const tiltElement = document.getElementById(`custom-card-${i}`);
				VanillaTilt.init(tiltElement, {
					max: 2,
					glare: false,
					"max-glare": 1,
				});
			}
		});
	},
	methods: {
		onListItemClick(event, categorySlug, serviceSlug) {
			event.stopPropagation(); // Prevents event from bubbling up
			this.$router.push(`/${categorySlug}/${serviceSlug}`); // Manually handling the navigation
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

				picture.style["z-index"] = 1;
				list.style["z-index"] = 2;
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

				picture.style["z-index"] = 2;
				list.style["z-index"] = 1;
				// Start fading out the picture and fading in the video
				picture.style.opacity = "1";
				list.style.opacity = "0";
			}
		},
		navigateToCategory(category) {
			this.$router.push(`/${category}`);
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
}
</style>
