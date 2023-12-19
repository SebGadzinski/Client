<template>
	<q-page class="flex column q-py-lg">
		<div class="text-center">
			<h4 class="q-mb-none">{{ $t("Book Meeting") }}</h4>
			<h6 class="q-my-none">{{ $t(cap(service)) }}</h6>
		</div>
		<div class="flex justify-center q-pa-md">
			<q-date
				:landscape="$q.screen.gt.sm"
				v-model="date"
				mask="YYYY-MM-DD HH:mm"
			/>
			<q-time
				:landscape="$q.screen.gt.sm"
				v-model="date"
				mask="YYYY-MM-DD HH:mm"
			/>
		</div>
		<div class="flex justify-center text-center q-py-lg">
			<q-badge :class="$q.screen.gt.sm ? 'text-h3' : 'text-h6'">
				{{ date }}
			</q-badge>
		</div>
		<div class="flex justify-center text-center q-pt-lg">
			<q-btn
				class="text-h6 meeting-btn"
				color="primary"
				@click="bookMeeting"
				>{{ $t("Book") }}</q-btn
			>
		</div>
	</q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
	name: "MeetingPage",
	data() {
		return {
			loading: true,
			category: "",
			service: "",
			$q: useQuasar(),
			route: useRoute(),
			date: ref(""),
		};
	},
	async mounted() {
		this.category = this.route?.params?.category;
		this.service = this.route?.params?.service;
		//update date based on first available date
		this.date = this.formatDateTime(new Date().toISOString());
	},
	unmounted() {},
	async updated() {},
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
				console.log("Printing Receipt");
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					backgroundColor: "#1e5499",
					message: this.$t("Saving..."),
				});
				setTimeout(() => {
					this.$q.loading.hide();
				}, 2000);
				// Book meeting
				// if user is unknown go to sign up form with work url as param so they know where to go after
				// else state the user succesfully book, and go to work page which should show this with status Booked Meeting
				//This should create a work object in the database
			} catch (err) {
				this.$q.loading.hide();
				this.loading = false;
				console.error(err);
			}
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
}
</style>
