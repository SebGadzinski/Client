<template>
	<q-page id="home-page" class="table-spacing-around">
		<!-- <div class="q-mt-lg">
			<q-tabs inline-label v-model="tab" class="tabs-div text-white">
				<q-tab
					:class="tab === 'work' ? 't-yellow' : 't-fade-yellow'"
					name="work"
					style="border-radius: 5px"
					icon="work"
					:label="$t('Work')"
					@click="updateTabInfo"
				/>

				<q-tab
					:class="tab === 'classes' ? 't-yellow' : 't-fade-yellow'"
					style="border-radius: 5px"
					name="classes"
					icon="run_circle"
					:label="$t('Classes')"
					@click="updateTabInfo"
				/>
			</q-tabs>
		</div>
		<div class="q-mt-sm" v-if="!hasTyped">
			<div
				v-if="tab === 'work'"
				:class="
					($q.screen.gt.sm ? 'text-h4' : 'text-h6') +
					' text-center t-yellow'
				"
			>
				{{ $t("Search for work!").toUpperCase() }}
			</div>
			<div
				v-else
				:class="
					($q.screen.gt.sm ? 'text-h4' : 'text-h6') +
					' text-center t-yellow'
				"
			>
				{{ $t("Search for Classes!").toUpperCase() }}
			</div>
		</div> -->

		<div class="search-div q-mx-auto q-mt-lg">
			<input
				type="text"
				v-model="search"
				:placeholder="$t(currentPlaceholder)"
				class="custom-input"
				@input="handleInput"
			/>
		</div>
		<q-table
			v-if="search.length > 0"
			:rows="tab === 'work' ? workCards : classCards"
			:grid="true"
			:loading="loading"
			:class="$q.screen.gt.sm ? 'q-mt-lg q-px-lg' : ''"
			:columns="columns"
			:filter="search"
			:rows-per-page-options="[0]"
		>
			<template v-slot:item="props">
				<div
					:class="
						($q.screen.gt.sm
							? 'col-4 q-mb-lg q-pa-md'
							: 'q-pa-sm col-12') + ' cursor-pointer'
					"
				>
					<q-card
						flat
						bordered
						@click="
							navigate(
								props.row.categorySlug,
								props.row.serviceSlug
							)
						"
						class="select-card"
					>
						<div v-if="$q.screen.gt.sm" class="media-container">
							<img :src="props.row.thumbnailImg" class="fit" />
						</div>
						<q-card-section>
							<div class="text-h6" style="margin-bottom: 0px">
								{{ $t(props.row.service) }}
							</div>
						</q-card-section>
					</q-card>
				</div>
			</template>
			<template v-slot:bottom></template>
		</q-table>
		<div class="flex justify-center q-mt-lg" v-else>
			<q-btn
				color="accent"
				class="text-h6"
				:label="$t('Feel Like Browsing?')"
				to="/browse"
			/>
			<div v-if="$q.screen.lt.md" class="full-width">
				<h6
					class="text-h6 text-center"
					style="margin: 20px auto 5px auto"
				>
					{{ $t("Featured Services") }}
				</h6>
				<q-separator />
			</div>
			<div class="full-width">
				<q-table
					:rows="
						tab === 'work'
							? getWorkFeaturedRows()
							: getClassFeaturedRows()
					"
					:grid="true"
					:loading="loading"
					:class="$q.screen.gt.sm ? 'q-mt-sm q-px-lg' : ''"
					:rows-per-page-options="[0]"
				>
					<template v-slot:item="props">
						<div
							:class="
								($q.screen.gt.sm
									? 'col-3 q-mb-lg q-pa-md'
									: 'col-12 q-pa-sm') + '  cursor-pointer'
							"
						>
							<q-card
								flat
								bordered
								@click="
									navigate(
										props.row.categorySlug,
										props.row.serviceSlug
									)
								"
								class="select-card"
							>
								<div class="feature-media-container">
									<img
										:src="props.row.thumbnailImg"
										class="fit"
										style="max-width: 100%"
									/>
								</div>
								<q-card-section>
									<div
										:class="
											$q.screen.gt.sm
												? 'text-h6'
												: 'text-body1 text-center '
										"
									>
										{{ $t(props.row.service) }}
									</div>
								</q-card-section>
							</q-card>
						</div>
					</template>
					<template v-slot:bottom></template>
				</q-table>
			</div>
		</div>
	</q-page>
</template>
<script>
import dataService from "../services/data.service";
import { useQuasar } from "quasar";

export default {
	name: "SearchPage",
	components: {},
	data() {
		return {
			loading: false,
			search: "",
			workCards: [],
			workFeaturedCards: [],
			classCards: [],
			classFeaturedCards: [],
			hasTyped: false,
			columns: [
				{
					name: "category",
					field: (row) => this.$t(row.category),
				},
				{
					name: "service",
					field: (row) => this.$t(row.service),
				},
			],
			tab: "work",
			$q: useQuasar(),
			workPlaceholderTexts: [
				"Search",
				"Software Testing",
				"Brochure Design",
				"AI Email Systems",
			],
			classPlaceholderTexts: [
				"Search",
				"Chair Yoga",
				"Pec Dancing",
				"Figma",
			],
			currentPlaceholderIndex: 0,
			currentPlaceholder: "Search",
		};
	},
	async mounted() {
		this.startPlaceholderRotation();
		const newCards = await dataService.getSearchPageData();
		this.workCards = newCards.workCards;
		this.workFeaturedCards = newCards.workCards
			.filter((x) => x.featured)
			.sort((a, b) => a.service.localeCompare(b.service));
		this.classCards = newCards.classCards;
		this.classFeaturedCards = newCards.classCards
			.filter((x) => x.featured)
			.sort((a, b) => a.service.localeCompare(b.service));
	},
	methods: {
		updateTabInfo() {
			const placeholders =
				this.tab === "work"
					? this.workPlaceholderTexts
					: this.classPlaceholderTexts;
			this.currentPlaceholderIndex = 0;

			this.currentPlaceholder =
				placeholders[this.currentPlaceholderIndex];
		},
		startPlaceholderRotation() {
			setInterval(() => {
				const placeholders =
					this.tab === "work"
						? this.workPlaceholderTexts
						: this.classPlaceholderTexts;
				this.currentPlaceholderIndex =
					(this.currentPlaceholderIndex + 1) % placeholders.length;

				this.currentPlaceholder =
					placeholders[this.currentPlaceholderIndex];
			}, 1500); // Change every 3 seconds
		},
		handleInput() {
			if (!this.hasTyped) {
				this.hasTyped = true;
			}
		},
		navigate(categorySlug, serviceSlug) {
			this.$router.push(`/${categorySlug}/${serviceSlug}`);
		},
		getWorkFeaturedRows() {
			return this.workFeaturedCards;
		},
		getClassFeaturedRows() {
			return this.classFeaturedCards;
		},
	},
};
</script>
<style>
.tabs-div .q-tab__label {
	font-size: larger !important;
}
.card-container {
	height: fit-content;
}
</style>
<style scoped>
.text-type * {
	font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif !important;
}
.t-yellow {
	color: #f8a701;
}
.t-fade-yellow {
	color: #664400;
}
.custom-input {
	text-align: center;
	width: 100%;
	padding: 10px;
	font-size: 40px;
	background-color: transparent;
	border: none;
	caret-color: #f8a701;
	color: #f8a701;
	border-radius: 5px;
	border-bottom: 6px solid #664400;
	outline: none;
	transition: border-bottom 0.5s ease, caret-color 0.5s ease;
}

.custom-input:hover {
	border-bottom: 6px solid #f8a701; /* Color changes when focused */
}

.custom-input:focus {
	border-bottom: 6px solid #f8a701; /* Color changes when focused */
}

.select-card:hover {
	background-color: #f8a701;
}

@media (min-width: 601px) {
	.custom-card {
		width: 1000px;
	}
	.feature-media-container {
		width: 100%; /* Ensure the container takes full width of the parent */
		height: 250px; /* Set a fixed height as needed */
		overflow: hidden; /* Hide overflow to ensure uniform image display */
	}

	.media-container {
		height: 300px;
	}
	.search-div {
		width: 50%;
	}
}

@media (max-width: 600px) {
	.feature-media-container {
		width: 100%; /* Ensure the container takes full width of the parent */
		height: 50; /* Set a fixed height as needed */
		overflow: hidden; /* Hide overflow to ensure uniform image display */
	}
	.media-container {
		height: 150px;
	}
	.custom-input {
		font-size: 30px;
	}
	.search-div {
		width: 90%;
	}
	.tabs-div {
		width: 90%;
		margin: auto auto;
	}
}
.feature-media-container img.fit {
	width: 100%;
	height: 100%;
	object-fit: cover; /* Ensure the image covers the container while maintaining its aspect ratio */
}
.card-description {
}
</style>
