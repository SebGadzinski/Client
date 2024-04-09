<template>
	<q-page class="table-spacing-around" padding>
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:rows="classes"
			:grid="true"
			:loading="loading"
			class="q-mt-lg"
			:columns="columns"
			row-key="id"
			:filter="search"
			:pagination="initialPagination"
		>
			<template v-slot:item="props">
				<div class="q-pa-xs q-mb-lg cursor-pointer" style="width: 60vh">
					<q-card :id="`custom-card-${props.row.id}`" flat bordered>
						<q-card-section>
							<div class="text-h6 text-center">
								{{ $t(props.row.name) }}
							</div>
						</q-card-section>
						<div class="media-container">
							<img v-lazy="props.row.thumbnailImg" />
						</div>
						<q-card-section v-if="props.row?.joinUrl">
							<q-btn
								class="text-h6 full-width"
								color="accent"
								:href="`${props.row.joinUrl}`"
								target="_blank"
								:label="$t(`Join!`)"
								@click.stop
							/>
						</q-card-section>
						<q-card-section v-if="props.row?.nextClass">
							<q-list bordered separator>
								<q-item v-if="$q.screen.gt.sm">
									<q-item-section avatar>
										<q-badge class="text-h6">
											<q-icon name="timer" />
											<span class="q-mx-sm">{{
												$t(`Next Class`)
											}}</span>
										</q-badge>
									</q-item-section>
									<q-space />
									<q-item-section class="text-h6" avatar>
										{{ $d(props.row?.nextClass) }}
									</q-item-section>
								</q-item>
								<q-item v-else class="column">
									<q-item-section avatar>
										<q-badge class="text-h6 q-mx-auto">
											<q-icon name="timer" />
											<span class="q-mx-sm">{{
												$t(`Next Class`)
											}}</span>
										</q-badge>
									</q-item-section>
									<q-space />
									<q-item-section
										class="text-h6 q-mx-auto q-mt-sm"
										avatar
									>
										{{ $d(props.row?.nextClass) }}
									</q-item-section>
								</q-item>
							</q-list>
						</q-card-section>
						<!-- <q-card-section>
							<q-badge
								class="text-h6 text-center"
								:label="$t('Instructors')"
							/>
							<div class="text-h6">
								{{ $t(props.row.instructors) }}
							</div>
						</q-card-section>

						 -->
					</q-card>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
import DateService from "../../services/date.service";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import VanillaTilt from "vanilla-tilt";
import { ref } from "vue";

export default {
	name: "ClassesIndexPage",
	data() {
		return {
			loading: true,
			search: "",
			classes: [],
			initialPagination: {
				sortBy: "name",
				descending: false,
				page: 1,
				rowsPerPage: 15,
			},
			// columns: [
			// 	{
			// 		name: "name",
			// 		align: "left",
			// 		label: "Name",
			// 		field: (row) => row.name,
			// 		sortable: true,
			// 	},
			// 	{
			// 		name: "instructors",
			// 		align: "left",
			// 		label: "Instrcutors",
			// 		field: (row) => row.instructors,
			// 	},
			// 	{
			// 		name: "nextClass",
			// 		align: "left",
			// 		label: "Next Class",
			// 		field: (row) => row.description,
			// 	},
			// 	{
			// 		name: "instructors",
			// 		align: "left",
			// 		label: "Instrcutors",
			// 		field: (row) => row.instructors,
			// 	},
			// ],
			route: useRoute(),
			$q: useQuasar(),
			expandVideo: false,
			watchMeImg: null,
			watchMeLink: null,
		};
	},
	async mounted() {
		this.loading = true;
		const data = await dataService.getClassesPageData();
		console.log(data);
		const newClasses = data?.classes;
		if (newClasses && newClasses.length > 0) {
			for (let i = 0; i < newClasses.length; i++) {
				newClasses[i].id = i;
				this.classes.push(newClasses[i]);
			}
		}
		this.loading = false;
		// this.$nextTick(() => {
		// 	// Access DOM elements here
		// 	for (let i = 0; i < this.classes.length; i++) {
		// 		const tiltElement = document.getElementById(`custom-card-${i}`);
		// 		VanillaTilt.init(tiltElement, {
		// 			max: 5,
		// 			glare: true,
		// 			"max-glare": 1,
		// 		});
		// 	}
		// });
	},
	unmounted() {},
	async updated() {},
	computed: {},
	methods: {
		$d(date) {
			console.log("Attemptign to convert");
			return DateService.convertISOLocalDisplay(date);
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
}

.media-container {
	position: relative;
	width: 100%;
	padding-top: 56.25%;
}

.media-container > img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
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
