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
				@change="onHourSelect"
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
		async date(newVal, oldVal) {
			if (newVal) {
				const newDate = new Date(newVal);
				const oldDate = new Date(oldVal);

				const newDay = newDate.getDay();
				const oldDay = oldVal ? oldDate.getDay() : -1;

				if (newDay !== oldDay) {
					await this.updateDay(newDate);
				}
			}
		},
	},
	methods: {
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
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					backgroundColor: "#1e5499",
					message: this.$t("Booking..."),
				});
				setTimeout(() => {
					this.$q.loading.hide();
					this.loading = false;
				}, 2000);

				let response = await dataService.bookMeeting({
					categorySlug: this.categorySlug,
					serviceSlug: this.serviceSlug,
					startDate: new Date(this.date),
				});
				if (!response.data.success) {
					if (response.data.message === "Sign Up Required") {
						this.$router.push("/auth/login");
					}
				} else {
					this.$router.push("/work");
				}
			} catch (err) {
				this.$q.loading.hide();
				this.loading = false;
				console.error(err);
			}
		},
		updateDay(date) {
			this.updateTime(date);
			//Figoure out what is selectable for this day
			if (this.hourOptionsTime.length > 0) {
				let date = new Date(this.date);
				date.setHours(this.hourOptionsTime[0]);
				this.date = this.formatDateTime(date.toISOString());
			} else {
				//get next closest time?
			}
		},
		updateTime(date) {
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
			let hourArray = Array.from(hourOptions).filter(
				(x) => x >= 7 && x < 22
			);

			// If its today ensure nothing before NOW can be accepted:
			const daysDate = selectedDate.setHours(0, 0, 0, 0);
			const currentDateTime = new Date();
			let currentHour = currentDateTime.getHours();
			const currentDate = currentDateTime.setHours(0, 0, 0, 0);

			if (daysDate === currentDate) {
				hourArray = hourArray.filter((x) => x > currentHour);
			}

			// Convert the Set to an array, sort it, and update hourOptionsTime
			this.hourOptionsTime = Array.from(hourArray).sort((a, b) => a - b);
		},

		formatHour(hour) {
			return hour < 10 ? `0${hour}:00` : `${hour}:00`;
		},
		getNextAvailableDate() {
			let nextAvailable = new Date();
			nextAvailable.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to zero

			// Move to the next hour if the current time is not at the start of an hour
			if (nextAvailable.getTime() !== new Date().setMinutes(0, 0, 0)) {
				nextAvailable.setHours(nextAvailable.getHours() + 1);
			}

			// Check if the time is within any unavailable period
			while (
				this.unavailablePeriods.some((period) => {
					const start = new Date(period.start);
					const end = new Date(period.end);
					return nextAvailable >= start && nextAvailable < end;
				})
			) {
				// Move to the next hour and check again
				nextAvailable.setHours(nextAvailable.getHours() + 1);
			}

			return nextAvailable;
		},
		dateFunction(date) {
			const inputDate = new Date(date).setHours(0, 0, 0, 0);
			const currentDate = new Date().setHours(0, 0, 0, 0);

			if (inputDate < currentDate) return false;

			// Check against each unavailable period
			for (const period of this.unavailablePeriods) {
				const startDate = new Date(period.start).setHours(0, 0, 0, 0);
				const endDate = new Date(period.end).setHours(0, 0, 0, 0);

				// Check if the input date is within any unavailable period
				if (inputDate >= startDate && inputDate <= endDate) {
					// Check if the entire day is unavailable
					if (inputDate === startDate && inputDate === endDate) {
						return false; // The entire day is unavailable
					}
					// Check if the period starts and ends on the same day as the input date
					if (startDate < inputDate && endDate > inputDate) {
						return false; // Part of the day is unavailable, making the entire day unavailable
					}
				}
			}

			return true; // Date is available (not found in unavailable periods)
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
