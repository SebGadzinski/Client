<template>
	<q-page class="flex column q-py-lg">
		<div class="text-center">
			<h4 class="q-mb-none">{{ $t("Book Meeting") }}</h4>
			<h6 class="q-my-none">{{ $t(category) }}</h6>
			<div class="q-my-none textbody1">{{ $t(service) }}</div>
		</div>
		<div class="flex justify-center q-pa-md">
			<q-date
				:landscape="$q.screen.gt.sm"
				v-model="date"
				mask="YYYY-MM-DD HH:mm"
				:options="dateFunction"
			>
			</q-date>
			<q-time
				:landscape="$q.screen.gt.sm"
				v-model="date"
				mask="YYYY-MM-DD HH:mm"
				:minute-options="[0]"
				format24h
				:hour-options="hourOptionsTime"
			/>
		</div>
		<div class="flex justify-center text-center q-py-lg">
			<q-badge :class="$q.screen.gt.sm ? 'text-h3' : 'text-h6'">
				{{ date }}
			</q-badge>
		</div>
		<div class="flex justify-center text-center q-pt-lg">
			<q-btn
				:disable="!date"
				class="text-h6 meeting-btn"
				color="primary"
				@click="bookMeeting"
				>{{ $t("Book") }}</q-btn
			>
		</div>
	</q-page>
</template>

<script>
import dataService from "../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { DateTime } from "luxon";

export default {
	name: "MeetingPage",
	data() {
		return {
			loading: true,
			categorySlug: "",
			serviceSlug: "",
			category: "",
			service: "",
			unavailablePeriods: [],
			$q: useQuasar(),
			route: useRoute(),
			date: ref(""),
			dateOptions: [],
			hourOptionsTime: [],
		};
	},
	async mounted() {
		this.categorySlug = this.route?.params?.categorySlug;
		this.serviceSlug = this.route?.params?.serviceSlug;

		try {
			this.categorySlug = this.route?.params?.category;
			this.serviceSlug = this.route?.params?.service;
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Gathering Meetings..."),
			});
			this.meeting = await dataService.getMeetingPageData(
				this.categorySlug,
				this.serviceSlug
			);

			// Add todays period into unavailable periods
			const currentDateTime = new Date();
			this.category = this.meeting.category;
			this.service = this.meeting.service;

			// Filter the intervals for those that match the current day of the week
			this.bookMeetingIntervals = this.meeting.bookMeetingIntervals.map(
				(dates) => ({
					start: DateTime.fromISO(dates.start, {
						zone: "utc",
					}).toLocal(),
					end: DateTime.fromISO(dates.end, { zone: "utc" }).toLocal(),
				})
			);
			this.meeting.unavailablePeriods.push({
				start: currentDateTime.setHours(0, 0, 0, 0),
				end: currentDateTime.setHours(
					currentDateTime.getHours(),
					0,
					0,
					0
				),
			});

			this.unavailablePeriods = this.meeting.unavailablePeriods;
			this.$q.loading.hide();
			this.loading = false;
		} catch (err) {
			this.$q.loading.hide();
			this.loading = false;
			console.error(err);
		}

		let myDate = this.getNextAvailableDate();
		this.date = this.formatDateTime(myDate.toISOString());
	},
	unmounted() {},
	async updated() {},
	watch: {
		// Watch for changes in the 'date' property
		date(newVal, oldVal) {
			if (newVal) {
				let newDate = new Date(newVal);
				let oldDate = new Date(oldVal);
				this.updateDay(
					new Date(newVal),
					newDate.toDateString() !== oldDate.toDateString()
				);
			}
		},
	},
	methods: {
		getAvailableHoursForDate(date) {
			if (!this.bookMeetingIntervals) return [];
			// Convert the input date to a DateTime object in the client's local timezone
			const checkDate = DateTime.fromJSDate(date);
			const dayOfWeek = checkDate.weekday;

			// Filter intervals for the same day of the week, ensuring we're using local times
			const intervalsForDay = this.bookMeetingIntervals.filter(
				(interval) => {
					// Parse the start and end times as necessary
					const startLocal =
						typeof interval.start === "string"
							? DateTime.fromISO(interval.start).toLocal()
							: interval.start.toLocal();
					const endLocal =
						typeof interval.end === "string"
							? DateTime.fromISO(interval.end).toLocal()
							: interval.end.toLocal();

					// Check if the interval matches the current day of the week
					return (
						startLocal.weekday === dayOfWeek ||
						endLocal.weekday === dayOfWeek
					);
				}
			);

			// Calculate the range of hours for the given day
			let hours = [];
			intervalsForDay.forEach((interval) => {
				const startLocal =
					typeof interval.start === "string"
						? DateTime.fromISO(interval.start).toLocal()
						: interval.start.toLocal();
				const endLocal =
					typeof interval.end === "string"
						? DateTime.fromISO(interval.end).toLocal()
						: interval.end.toLocal();

				let startHour = startLocal.hour;
				let endHour =
					endLocal.hour + (endLocal.day > startLocal.day ? 24 : 0); // Adjust for intervals that cross midnight

				// Generate hours for the interval, ensuring unique values
				for (let hour = startHour; hour <= endHour; hour++) {
					if (!hours.includes(hour % 24)) {
						hours.push(hour % 24);
					}
				}
			});

			// Sort the hours array to ensure the hours are in order
			hours.sort((a, b) => a - b);

			return hours;
		},
		cap(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		formatDateTime(isoString) {
			const date = new Date(isoString);
			const year = date.getFullYear();
			const month = this.pad(date.getMonth() + 1); // getMonth() is zero-based
			const day = this.pad(date.getDate());
			const hours = this.pad(date.getHours());
			const minutes = this.pad(date.getMinutes());
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
		pad(number) {
			return number < 10 ? "0" + number : number;
		},
		async bookMeeting() {
			try {
				//If this has a template id then
				let someMeetingInfo = "";
				if (this.route?.query?.template) {
					someMeetingInfo =
						"Interested in " + this.route.query.template;
				}
				this.$q
					.dialog({
						title: this.$t("Provide Information"),
						message: this.$t(
							"Please provide some info on what you would like"
						),
						prompt: {
							model: someMeetingInfo,
							type: "textarea",
						},
					})
					.onOk(async (bookingMessage) => {
						this.loading = true;
						this.$q.loading.show({
							spinner: QSpinnerGears,
							backgroundColor: "#1e5499",
							message: this.$t("Booking..."),
						});

						let meetingInfo = {
							categorySlug: this.categorySlug,
							serviceSlug: this.serviceSlug,
							templateId: this.route?.query?.templateId,
							startDate: new Date(this.date),
							bookingMessage,
						};
						let response = await dataService.bookMeeting(
							meetingInfo
						);
						this.$q.loading.hide();
						this.loading = false;
						if (!response.data.success) {
							if (
								response.data.message === "Not Accepting Work"
							) {
								this.$q
									.dialog({
										title: this.$t("Not Accepeting Work"),
										message: this.$t(
											"I am all booked up, sorry not sorry."
										),
									})
									.onDismiss(() => {
										this.$router.push("/");
									});
							} else if (
								response.data.message === "Sign Up Required"
							) {
								window.localStorage.setItem(
									"book-meeting",
									JSON.stringify(meetingInfo)
								);
								this.$router.push(
									"/auth/login/?book-meeting=true"
								);
							} else {
								this.$q.loading.hide();
								this.loading = false;
								console.error(response.data.message);
								this.$q.dialog({
									title: this.$t("Error Making Meeting..."),
								});
							}
						} else {
							this.$q
								.dialog({
									title: this.$t("Meeting Confirmed"),
									message: this.$t(
										"Meeting details sent to email."
									),
								})
								.onDismiss(() => {
									this.$router.push("/work");
								});
						}
					});
			} catch (err) {
				this.$q
					.dialog({
						title: this.$t("Issue"),
						message: this.$t(err.message),
					})
					.onDismiss(() => {
						this.$router.push("/work");
					});
				this.$q.loading.hide();
				console.error(err);
			}
		},
		updateDay(date, newDay = false) {
			this.updateTime(date);
			//Figoure out what is selectable for this day
			if (newDay && this.hourOptionsTime.length > 0) {
				let date = new Date(this.date);
				date.setHours(this.hourOptionsTime[0]);
				this.date = this.formatDateTime(date.toISOString());
			} else {
				//get next closest time?
			}
			const parentElement = document.querySelector(
				".q-time__header-label.row.items-center.no-wrap"
			);
			if (parentElement && parentElement.children.length > 0) {
				const firstChild = parentElement.children[0];
				firstChild.click();
			}
		},
		getHoursForDate(date) {
			const selectedDate = new Date(date);
			let hourOptions = new Set();

			// Initialize hourOptions with all hours of the day
			for (let hour = 0; hour < 24; hour++) {
				hourOptions.add(hour);
			}

			this.unavailablePeriods.forEach((period) => {
				const periodStart = new Date(period.start);
				const periodEnd = new Date(period.end);

				// Check if the period intersects with the selected date's day
				if (
					selectedDate.toDateString() ===
						periodStart.toDateString() ||
					selectedDate.toDateString() === periodEnd.toDateString() ||
					(selectedDate > periodStart && selectedDate < periodEnd)
				) {
					const startHour =
						selectedDate.toDateString() ===
						periodStart.toDateString()
							? periodStart.getHours()
							: 0;
					const endHour =
						selectedDate.toDateString() === periodEnd.toDateString()
							? periodEnd.getHours()
							: 23;

					// Remove unavailable hours
					for (let hour = startHour; hour <= endHour; hour++) {
						hourOptions.delete(hour);
					}
				}
			});

			// remove the morning and nights
			let hourArray = this.getAvailableHoursForDate(selectedDate);

			// If its today ensure nothing before NOW can be accepted:
			const daysDate = selectedDate.setHours(0, 0, 0, 0);
			const currentDateTime = new Date();
			let currentHour = currentDateTime.getHours();
			const currentDate = currentDateTime.setHours(0, 0, 0, 0);

			if (daysDate === currentDate) {
				hourArray = hourArray.filter((x) => x > currentHour);
			}

			// keep the ones in hour array from hourOptions
			const finalHours = [];
			for (const hour of hourArray) {
				if (hourOptions.has(hour)) {
					finalHours.push(hour);
				}
			}

			return finalHours;
		},
		updateTime(date) {
			const hourArray = this.getHoursForDate(date);
			// Convert the Set to an array, sort it, and update hourOptionsTime
			this.hourOptionsTime = hourArray;
		},

		formatHour(hour) {
			return hour < 10 ? `0${hour}:00` : `${hour}:00`;
		},
		getNextAvailableDate() {
			let nextAvailable = new Date();

			while (true) {
				// Convert nextAvailable to start of the day for comparison
				let comparisonDate = new Date(nextAvailable);
				comparisonDate.setHours(0, 0, 0, 0);

				// Get hours available for this date
				const hours = this.getHoursForDate(comparisonDate);

				if (hours.length > 0) {
					// If there are available hours, set nextAvailable to the first available hour on this date
					nextAvailable.setHours(hours[0], 0, 0, 0);
					break; // Exit the loop
				} else {
					// If no hours are available, move to the next day and check again
					nextAvailable.setDate(nextAvailable.getDate() + 1);
				}
			}

			return nextAvailable;
		},
		dateFunction(date) {
			const inputDate = new Date(date).setHours(0, 0, 0, 0);
			const currentDate = new Date().setHours(0, 0, 0, 0);

			if (inputDate < currentDate) return false;

			const hours = this.getHoursForDate(date);
			return hours.length > 0;
		},
		onHourSelect() {
			console.log("Updated");
		},
	},
};
</script>

<style scoped>
.meeting-btn {
	width: 40vw;
}

@media (max-width: 800px) {
	.meeting-btn {
		width: 60vw;
	}
	.non-selectable {
		background-color: #f0f0f0;
		color: #ccc;
	}
}
</style>
