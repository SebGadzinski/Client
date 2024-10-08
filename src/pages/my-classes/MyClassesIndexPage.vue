<template>
	<template v-if="classes.length > 0 || loading">
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
					<div
						class="q-pa-xs q-mb-lg cursor-pointer"
						style="width: 60vh"
					>
						<q-card
							:id="`custom-card-${props.row.id}`"
							flat
							bordered
						>
							<q-card-section
								style="
									height: fit-content;
									padding: 5px 0px !important;
								"
								class="text-center"
							>
								<div
									style="
										width: 100%;
										position: relative;
										height: fit-content;
									"
								>
									<h6
										class="q-my-none q-mx-auto"
										style="width: 80%"
									>
										{{ $t(props.row.name) }}
									</h6>
									<q-btn
										v-if="!props.row?.myClass"
										flat
										icon="settings"
										@click="classSettings(props.row.id)"
										style="
											position: absolute;
											right: 0;
											top: 50%;
											transform: translateY(-50%);
										"
									></q-btn>
								</div>
								<q-badge
									v-if="props.row?.myClass"
									class="text-caption q-mx-auto"
									color="primary"
									:label="$t('My Class')"
								/>
								<q-badge
									v-if="
										props.row?.classType ===
										'Single Session'
									"
									class="text-caption q-mx-auto"
									color="primary"
									:label="$t('Single Session')"
								/>
								<q-badge
									v-if="
										props.row?.classType ===
											'Single Session' &&
										props.row?.workStatus === 'In Use'
									"
									class="text-caption q-ml-sm"
									color="positive"
									:label="$t('Using')"
								/>
							</q-card-section>
							<div class="media-container">
								<img :src="props.row.thumbnailImg" />
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
											props.row?.workId,
											props.row?.myClass,
											props.row?.id
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
										<q-item v-if="props.row?.canJoin">
											<q-item-section avatar>
												<q-badge class="text-h6">
													<q-icon name="videocam" />
													<span class="q-mx-sm">{{
														$t(`Zoom`)
													}}</span>
												</q-badge>
											</q-item-section>
											<q-space />
											<q-item-section
												v-if="
													props.row?.showZoomDetails
												"
											>
												<div class="text-body1">
													{{ $t("ID: ") }}
													<a>{{
														props.row?.meetingId
													}}</a>
												</div>
												<div class="text-body1">
													{{ $t("PW: ") }}
													{{
														props.row
															?.meetingPassword
													}}
												</div>
											</q-item-section>
											<q-item-section class="" v-else>
												<q-btn
													color="primary"
													:label="$t('Show ID & PW')"
													@click="
														getZoomDetails(
															props.row?.id,
															props.row?.myClass
														)
													"
												/>
											</q-item-section>
										</q-item>
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
											<q-item-section
												class="text-h6"
												avatar
											>
												{{ $d(props.row?.nextClass) }}
											</q-item-section>
										</q-item>
										<q-item
											v-if="
												props.row?.instructorInfo
													?.length > 0
											"
										>
											<q-item-section avatar>
												<q-badge
													class="text-h6 q-mx-auto"
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
												v-for="(
													instructor, index
												) in props.row.instructorInfo"
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
											v-if="props.row?.canJoin"
											class="column"
										>
											<q-item-section>
												<q-badge
													class="text-h6 flex justify-center full-width"
												>
													<q-icon name="videocam" />
													<span class="q-mx-sm">{{
														$t(`Zoom`)
													}}</span>
												</q-badge>
											</q-item-section>
											<q-space />
											<q-item-section
												v-if="
													props.row?.showZoomDetails
												"
												class="q-mx-auto q-mt-sm"
											>
												<div class="text-body1">
													{{ $t("ID: ") }}
													<a>{{
														props.row?.meetingId
													}}</a>
												</div>
												<div class="text-body1">
													{{ $t("PW: ") }}
													{{
														props.row
															?.meetingPassword
													}}
												</div>
											</q-item-section>
											<q-item-section
												class="q-mx-auto q-mt-sm"
												v-else
											>
												<q-btn
													color="primary"
													:label="$t('Show ID & PW')"
													@click="
														getZoomDetails(
															props.row?.id,
															props.row.myClass
														)
													"
												/>
											</q-item-section>
										</q-item>
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
												!props.row?.myClass &&
												props.row?.instructorInfo
													?.length > 0
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
												v-for="(
													instructor, index
												) in props.row.instructorInfo"
												:key="index"
												class="q-mx-auto q-mt-sm"
												avatar
											>
												<div class="text-h6 q-mx-auto">
													{{ instructor.fullName }}
												</div>
												<div
													class="text-caption q-mx-auto"
												>
													{{ instructor.email }}
												</div>
											</q-item-section>
										</q-item>
									</template>
									<q-item v-if="props.row?.myClass">
										<q-item-section>
											<q-btn
												v-if="
													props.row?.students
														?.length > 0
												"
												color="primary"
												:label="$t('View Students')"
												@click="
													viewStudents(props.row.id)
												"
											/>
											<q-btn
												v-else
												color="negative"
												:label="$t('No Students')"
												@click="
													$q.dialog({
														title: $t(
															'No Students'
														),
														message: $t(
															'No zoom meeting will be created until a student enters the class'
														),
													})
												"
											/>
										</q-item-section>
									</q-item>
								</q-list>
							</q-card-section>
						</q-card>
					</div>
				</template>
			</q-table>
		</q-page>
		<q-dialog v-model="studentsCard.visible" position="top">
			<q-card class="student-card text-center">
				<q-card-section class="row q-pb-none">
					<div class="text-h6 q-mx-auto">
						{{ $t(studentsCard.title) }}
					</div>
				</q-card-section>
				<q-card-section>
					<div class="q-pb-sm">
						<q-input
							v-model="studentsCard.search"
							placeholder="Search"
						/>
					</div>
					<q-table
						:rows="studentsCard.students"
						:columns="studentsCard.columns"
						row-key="userId"
						:filter="studentsCard.search"
						:pagination="studentsCard.initialPagination"
						bordered
					/>
				</q-card-section>
			</q-card>
		</q-dialog>
		<q-dialog v-model="classCard.visible">
			<q-card class="text-center">
				<q-card-section class="row q-pb-none">
					<div class="text-h6 q-mx-auto">
						{{ $t(classCard.title) }}
					</div>
				</q-card-section>
				<!-- Remove? -->
				<q-card-section>
					<q-btn
						class="text-h6"
						color="negative"
						:label="$t('Drop Class')"
						@click="dropClass(classCard.workId)"
					/>
				</q-card-section>
			</q-card>
		</q-dialog>
		<q-dialog v-model="inCancellation">
			<q-card class="text-center">
				<q-card-section class="row q-pb-none">
					<div class="text-h6 q-mx-auto">{{ $t("Current") }}</div>
				</q-card-section>
				<q-card-section>
					<q-btn
						class="text-h6"
						color="negative"
						:label="$t('Drop Class')"
						@click="dropClass(classCard.workId)"
					/>
				</q-card-section>
			</q-card>
		</q-dialog>
	</template>
	<template v-else>
		<q-page class="flex flex-center column">
			<div class="text-h4">{{ $t("No Classes!") }}</div>
			<q-btn
				to="/classes"
				:label="$t(`Browse Classes`)"
				color="primary"
				class="text-h6 q-my-lg"
			/>
		</q-page>
	</template>
</template>

<script>
import dataService from "../../services/data.service";
import DateService from "../../services/date.service";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import VanillaTilt from "vanilla-tilt";

export default {
	name: "MyClassesIndexPage",
	data() {
		return {
			loading: true,
			search: "",
			studentSearch: "",
			classes: [],
			initialPagination: {
				sortBy: "customSort",
				descending: false,
				page: 1,
				rowsPerPage: 15,
			},
			columns: [
				{
					name: "name",
					field: (row) => row.name,
				},
				{
					name: "customSort",
					field: (row) => {
						if (row?.canJoin) {
							return `a_${row.name}`;
						} else if (row?.nextClass) {
							return `b_${row.nextClass}`;
						} else {
							return `c_${row.name}`;
						}
					},
					sortable: true,
				},
			],
			route: useRoute(),
			$q: useQuasar(),
			classCard: {
				visible: false,
				title: "",
				workId: "",
			},
			studentsCard: {
				visible: false,
				title: "",
				students: [],
				search: "",
				columns: [
					{
						name: "email",
						label: this.$t("Email"),
						field: "email",
						align: "left",
					},
					{
						name: "workClassType",
						label: this.$t("Class Type"),
						field: "workClassType",
						align: "left",
					},
					{
						name: "workStatus",
						label: this.$t("Work Status"),
						field: "workStatus",
						align: "left",
					},
				],
				initialPagination: {
					sortBy: "email",
					descending: false,
					page: 1,
					rowsPerPage: 15,
				},
			},
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
				newClasses[i].meetingId = null;
				newClasses[i].meetingPassword = null;
				this.classes.push(newClasses[i]);
			}
		}
		this.loading = false;
		this.$nextTick(() => {
			for (let i = 0; i < this.classes.length; i++) {
				let name = this.route?.query?.name;
				if (name) {
					this.search = name;
				}
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
		viewStudents(rowId) {
			this.studentsCard.title = this.classes[rowId].name;
			this.studentsCard.search = "";
			this.studentsCard.students = this.classes[rowId].students;
			this.studentsCard.visible = true;
		},
		$d(date) {
			return DateService.convertISOLocalPretty(date);
		},
		classSettings(rowId) {
			this.classCard.visible = true;
			this.classCard.title = this.classes[rowId].name;
			this.classCard.workId = this.classes[rowId].workId;
		},
		async getZoomDetails(rowId, myClass) {
			try {
				const data = await (myClass
					? dataService.getZoomInfo(this.classes[rowId].serviceSlug)
					: dataService.joinClass(this.classes[rowId].workId));
				this.classes[rowId].meetingId = data.meetingId;
				this.classes[rowId].meetingPassword = data.meetingPassword;
				this.classes[rowId].showZoomDetails = true;
			} catch (err) {
				this.$q.dialog({
					title: this.$t("Issue Getting Details"),
					message: err.toString(),
				});
			}
		},
		dropClass(workId) {
			try {
				this.classCard.visible = false;
				this.$q
					.dialog({
						title: this.$t("Drop Class?"),
						message: this.$t(
							`Drop ${this.classCard.title}? You will have to repurchase to get this back.`
						),
						ok: {
							label: this.$t("Drop"),
							color: "negative",
						},
						cancel: {
							label: this.$t("Cancel"),
							color: "primary",
						},
					})
					.onOk(async () => {
						await dataService.dropClass(workId);
						this.$q
							.dialog({ title: this.$t("Class Dropped") })
							.onDismiss(() => {
								location.reload();
							});
					});
			} catch (err) {
				if (
					err?.response?.data?.message ===
					"Cancellation Process Required"
				) {
					this.$router.push(`work/cancel/${workId}`);
				} else {
					this.$q.dialog({ title: this.$t("Issue Joining") });
				}
			}
		},
		async joinClass(classType, workId, myClass, rowId) {
			try {
				let title = "Join Class?";
				let body = "If password needed, check your email.";
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
							const data = await (myClass
								? dataService.getZoomInfo(
										this.classes[rowId].serviceSlug
								  )
								: dataService.joinClass(workId));
							const newWindow = window.open(
								data.meetingLink,
								"_blank"
							);

							// Check if the new window is blocked and inform the user if so.
							if (
								!newWindow ||
								newWindow.closed ||
								typeof newWindow.closed === "undefined"
							) {
								// Inform the user that the popup was blocked, or provide an alternative way.
								this.$q.notify({
									type: "negative",
									message: this.$t(
										"Unable to open the link. Please disable your popup blocker and try again."
									),
								});
								this.$q
									.dialog({
										title: this.$t("Join Again"),
										message: this.$t(
											"Please select ok to rejoin."
										),
										ok: {
											label: this.$t("Ok"),
											color: "accent",
										},
									})
									.onOk(() => {
										window
											.open(data.meetingLink, "_blank")
											.focus();
									});
							} else {
								this.$q.dialog({
									title: this.$t("Joined Class"),
									message: this.$t(
										"You have joined the class."
									),
								});
							}
						} catch (err) {
							this.$q.dialog({
								title: this.$t("Issue Joining"),
								message: err.toString(),
							});
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
	.student-card {
		width: 50vw;
	}
}

@media (max-width: 767px) {
	.custom-card {
		width: 90vw;
	}
	.student-card {
		width: 90vw;
	}
}
</style>
