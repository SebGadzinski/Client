<template>
	<q-page class="table-spacing-around">
		<div class="q-mt-lg">
			<q-tabs inline-label v-model="tab" class="tabs-div text-white">
				<q-tab
					:class="tab === 'work' ? 't-yellow' : 't-fade-yellow'"
					name="work"
					style="border-radius: 5px"
					icon="work"
					:label="$t('Work')"
				/>

				<q-tab
					:class="tab === 'classes' ? 't-yellow' : 't-fade-yellow'"
					style="border-radius: 5px"
					name="classes"
					icon="run_circle"
					:label="$t('Classes')"
				/>
			</q-tabs>
		</div>
		<div class="q-my-lg" v-if="!hasTyped">
			<div
				v-if="tab === 'work'"
				:class="
					($q.screen.gt.sm ? 'text-h3' : 'text-h6') +
					' text-center t-yellow'
				"
			>
				{{ $t("Search for work!").toUpperCase() }}
			</div>
			<div
				v-else
				:class="
					($q.screen.gt.sm ? 'text-h3' : 'text-h6') +
					' text-center t-yellow'
				"
			>
				{{ $t("Search for Classes!").toUpperCase() }}
			</div>
		</div>

		<div class="search-div q-mx-auto">
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
			row-key="id"
			:filter="search"
			:rows-per-page-options="[0]"
		>
			<template v-slot:item="props">
				<div
					:class="
						($q.screen.gt.sm ? 'col-3 q-mb-lg' : 'col-12') +
						' q-pa-md cursor-pointer'
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
						<div class="media-container">
							<img v-lazy="props.row.thumbnailImg" class="fit" />
						</div>
						<q-card-section>
							<div class="text-h6 q-mb-xs">
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
		</div>
	</q-page>
</template>
<script>
import dataService from "../services/data.service";
import { useQuasar } from "quasar";

export default {
	name: "HomePage",
	components: {},
	data() {
		return {
			loading: false,
			search: "",
			workCards: [],
			classCards: [],
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
		const newCards = await dataService.getHomePageDataV2();
		this.workCards = newCards.workCards;
		this.classCards = newCards.classCards;
	},
	methods: {
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
	},
};
</script>
<style>
.q-tab__label {
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
	font-size: 50px;
	background-color: transparent;
	border: none;
	caret-color: #f8a701;
	color: #f8a701;
	border-radius: 5px;
	border-bottom: 6px solid #494949;
	outline: none;
	transition: border-bottom 0.5s ease, caret-color 0.5s ease;
}

.custom-input:focus {
	border-bottom: 6px solid #f8a701; /* Color changes when focused */
}

.select-card:hover {
	background-color: #f8a701;
}

@media (min-width: 992px) {
	.custom-card {
		width: 1000px;
	}
	.media-container {
		height: 300px;
	}
	.search-div {
		width: 50%;
	}
}

@media (max-width: 991px) {
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
</style>
