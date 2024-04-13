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
						<q-card-section
							v-if="props.row?.canJoin"
							class="q-pb-none"
						>
							<q-btn
								class="text-h6 full-width"
								color="accent"
								@click="
									joinClass(
										props.row?.classType,
										props.row?.workId
									)
								"
								:label="$t(`Join!`)"
							/>
						</q-card-section>
						<q-card-section
							class="text-center q-pb-none"
							v-else-if="!props.row?.nextClass"
						>
							<q-badge
								class="text-h6 q-px-lg q-my-none"
								:label="$t('Custom Meetings')"
								@click="
									$q.dialog({
										title: 'Your instructor will send you meeting links',
									})
								"
							/>
						</q-card-section>
						<q-card-section>
							<q-list bordered separator>
								<template v-if="$q.screen.gt.sm">
									<q-item v-if="props.row?.nextClass">
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
									<q-item
										v-if="
											props.row?.instructorInfo?.length >
											0
										"
									>
										<q-item-section avatar>
											<q-badge class="text-h6 q-mx-auto">
												<q-icon name="person" />
												<span class="q-mx-sm">{{
													props.row.instructorInfo
														.length > 1
														? $t(`Instructors`)
														: $t(`Instructor`)
												}}</span>
											</q-badge>
										</q-item-section>
										<q-item-section
											v-for="(instructor, index) in props
												.row.instructorInfo"
											:key="index"
											class="text-h6 q-ml-auto q-mt-sm"
											avatar
										>
											<div class="text-h6">
												{{ instructor.fullName }}
											</div>
											<div class="text-caption">
												{{ instructor.email }}
											</div>
										</q-item-section>
									</q-item>
								</template>
								<template v-else>
									<q-item
										v-if="props.row?.nextClass"
										class="column"
									>
										<q-item-section>
											<q-badge
												class="text-h6 flex justify-center full-width"
											>
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
									<q-item
										v-if="
											props.row?.instructorInfo?.length >
											0
										"
										class="column"
									>
										<q-item-section>
											<q-badge
												class="text-h6 flex justify-center full-width"
											>
												<q-icon name="person" />
												<span class="q-mx-sm">{{
													props.row.instructorInfo
														.length > 1
														? $t(`Instructors`)
														: $t(`Instructor`)
												}}</span>
											</q-badge>
										</q-item-section>
										<q-item-section
											v-for="(instructor, index) in props
												.row.instructorInfo"
											:key="index"
											class="q-mx-auto q-mt-sm"
											avatar
										>
											<div class="text-h6 q-mx-auto">
												{{ instructor.fullName }}
											</div>
											<div class="text-caption q-mx-auto">
												{{ instructor.email }}
											</div>
										</q-item-section>
									</q-item>
								</template>
							</q-list>
						</q-card-section>
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
	name: "MyClassesIndexPage",
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
			columns: [
				{
					name: "name",
					align: "left",
					label: "Name",
					field: (row) => row.name,
					sortable: true,
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
		this.$nextTick(() => {
			// Access DOM elements here
			for (let i = 0; i < this.classes.length; i++) {
				const tiltElement = document.getElementById(`custom-card-${i}`);
				VanillaTilt.init(tiltElement, {
					max: 5,
					glare: true,
					"max-glare": 0.15,
				});
			}
		});
	},
	unmounted() {},
	async updated() {},
	computed: {},
	methods: {
		$d(date) {
			return DateService.convertISOLocalPretty(date);
		},
		joinClass(classType, workId) {
			try {
				let title = "Join Class?";
				let body = "Check your email for a password";
				console.log(classType);
				if (classType === "Single Session") {
					title = "Use Single Session?";
					body =
						"This will put your work item status to 'In Use'. " +
						body;
				}
				this.$q
					.dialog({
						title: this.$t(title),
						message: this.$t(body),
						ok: {
							label: this.$t("Join"),
							color: "accent",
						},
						cancel: {
							label: this.$t("Cancel"),
							color: "primary",
						},
					})
					.onOk(async () => {
						try {
							const data = await dataService.joinClass(workId);
							window.open(data.meetingLink, "_blank");
						} catch (err) {
							this.$q.dialog({ title: this.$t("Issue Joining") });
						}
					});
			} catch (err) {
				console.error(err);
			}
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
