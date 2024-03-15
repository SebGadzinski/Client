<template>
	<q-page v-if="Object.keys(service).length > 0" :class="'flex column'">
		<div class="q-pa-md carousel-outer-div">
			<q-carousel
				animated
				swipeable
				v-model="slide"
				arrows
				navigation
				:navigation-position="$q.screen.lt.md ? 'top' : 'bottom'"
				:autoplay="autoplay"
				transition-prev="slide-right"
				transition-next="slide-left"
				@mouseleave="autoplay = true"
				class="carousel-div"
				:height="$q.screen.lt.md ? '400px' : ''"
			>
				<q-carousel-slide
					v-for="(slide, index) in service.slides"
					:key="index"
					:name="index"
					:img-src="$q.screen.lt.md ? slide.image : ''"
				>
					<div
						v-if="$q.screen.gt.sm"
						class="row"
						:class="{ 'reverse-row': index % 2 === 0 }"
					>
						<div class="col-8">
							<img class="carousel-image" v-lazy="slide.image" />
						</div>
						<div class="col-4 flex flex-center">
							<h4>{{ $t(slide.text) }}</h4>
						</div>
					</div>
					<div
						class="absolute-bottom custom-caption"
						v-if="$q.screen.lt.md"
					>
						<div class="text-h4 text-center">
							{{ $t(slide.text) }}
						</div>
					</div>
				</q-carousel-slide>
			</q-carousel>
		</div>
		<div>
			<div
				v-for="(detail, index) in service.details"
				:key="index"
				class="text-center"
			>
				<h3>{{ $t(detail.header) }}</h3>
				<p
					class="text-body1"
					v-html="$t(detail.info).replace(/\\n/g, '<br>')"
				></p>
			</div>
		</div>
		<!-- Contractors (Templates) -->
		<template v-if="service?.workers?.length > 0">
			<h3 class="text-center">
				{{
					$t(
						categorySlug === "classes"
							? "Instructors"
							: "Contractors"
					)
				}}
			</h3>
			<div class="flex row justify-center">
				<q-card
					v-for="(worker, index) in service.workers"
					:key="index"
					class="q-mt-sm q-px-sm q-mx-sm text-center"
					:style="this.$q.screen.gt.sm ? { width: '25rem' } : {}"
				>
					<!-- Thumbnail -->
					<div class="q-mt-sm q-mx-auto">
						<img
							class="fit rounded-borders"
							v-lazy="worker.thumbnailImg"
						/>
					</div>
					<!-- Video -->
					<!-- Name -->
					<h5 class="q-py-sm q-my-none">{{ worker.name }}</h5>
					<!-- Summary using quasar list? -->
					<q-list bordered padding class="rounded-borders text-left">
						<q-item
							v-for="(summary, sIndex) in worker.summary"
							:key="sIndex"
						>
							<q-item-section>
								<q-item-label overline>{{
									$t(summary.title)
								}}</q-item-label>
								<q-item-label>{{
									$t(summary.text)
								}}</q-item-label>
							</q-item-section>

							<q-item-section v-if="summary?.icon" side>
								<q-icon
									:name="summary.icon.name"
									:color="summary?.icon?.color ?? 'accent'"
								/>
							</q-item-section>
							<q-item-section v-if="summary?.badge" side top>
								<q-badge
									:color="summary?.badge?.color ?? 'accent'"
									:label="summary.badge.label"
								/>
							</q-item-section>
						</q-item>
						<q-item v-if="worker?.socials">
							<q-item-section>
								<q-item-label overline>{{
									$t("Socials")
								}}</q-item-label>
								<div class="q-mt-sm">
									<!-- Instagram Link -->
									<a
										v-if="worker?.socials?.instagram"
										:href="worker.socials.instagram"
										target="_blank"
										class="q-mr-md"
									>
										<q-btn
											color="purple"
											text-color="purple"
											outline
										>
											<q-icon
												name="photo_camera"
												left
											></q-icon>
											<span>Insta</span>
										</q-btn>
									</a>
									<!-- YouTube Link -->
									<a
										v-if="worker?.socials?.youtube"
										:href="worker.socials.youtube"
										target="_blank"
									>
										<q-btn
											color="red"
											text-color="red"
											outline
										>
											<q-icon
												name="ondemand_video"
												left
											></q-icon>
											<span>YouTube</span>
										</q-btn>
									</a>
								</div>
							</q-item-section>
						</q-item>
					</q-list>
				</q-card>
			</div>
		</template>
		<!-- Class Templates -->
		<template v-if="service?.templates?.length > 0">
			<h3 class="text-center">
				{{ $t("Packages") }}
			</h3>
			<div class="row q-py-sm full-width" style="flex-direction: column">
				<q-btn
					v-for="(template, tIndex) in service?.templates"
					:key="tIndex"
					:to="`/work/template/${template._id}`"
					color="primary"
					class="text-h5 col-10 col-md-4 q-my-sm q-mx-auto"
					:label="template.name"
				/>
			</div>
		</template>
		<!-- Meeting Times -->
		<div class="text-center" v-if="categorySlug === 'classes'">
			<h3>{{ $t("Meeting Times") }}</h3>
			<div
				v-for="(meetingTime, m) in meetingTimes"
				:key="m"
				class="text-center q-my-sm"
			>
				<div class="text-body1">
					<q-badge class="q-pa-sm" color="secondary">Zoom</q-badge>
					<q-badge class="q-pa-sm q-mx-sm"
						>{{ meetingTime.weekday }} at {{ meetingTime.time }} -
						{{ meetingTime.timezone }}</q-badge
					>
				</div>
			</div>
		</div>
		<div class="flex justify-center text-center">
			<div v-if="categorySlug === 'classes'" class="full-width">
				<h3 class="q-mb-none">{{ $t("Book Meeting") }}</h3>
				<h6 class="q-mt-none">
					{{ $t("Want something more custom?") }}
				</h6>
			</div>
			<div v-else class="full-width">
				<h3>{{ $t("Book Meeting") }}</h3>
			</div>
			<q-btn
				class="text-h6 consultation-meeting-btn"
				color="primary"
				:to="`/${categorySlug}/${serviceSlug}/meeting`"
				>{{ $t("Set Up Meeting") }}</q-btn
			>
		</div>
		<div
			class="flex justify-center text-center"
			v-if="service.faqs.length > 0"
		>
			<div class="full-width">
				<h3>{{ $t("FAQs") }}</h3>
			</div>
			<q-list bordered class="rounded-borders">
				<q-expansion-item
					v-for="(faq, index) in service.faqs"
					:key="index"
					style="color: white"
					class="bg-primary text-subtitle1 faq-section text-left"
					expand-icon-class="text-white"
					:default-opened="false"
					:label="$t(faq.question)"
				>
					<q-card class="card-text-color">
						<q-card-section class="text-body1">
							{{ $t(faq.answer) }}
						</q-card-section>
					</q-card>
				</q-expansion-item>
			</q-list>
		</div>
	</q-page>
</template>

<script>
import { DateTime } from "luxon";
import dataService from "../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
	name: "ServicePage",
	data() {
		return {
			loading: true,
			categorySlug: "",
			serviceSlug: "",
			route: useRoute(),
			$q: useQuasar(),
			slide: ref(0),
			autoplay: ref(true),
			service: {},
			meetingTimes: [],
		};
	},
	async mounted() {
		try {
			this.categorySlug = this.route?.params?.category;
			this.serviceSlug = this.route?.params?.service;
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Loading..."),
			});
			this.service = await dataService.getServicePageData(
				this.categorySlug,
				this.serviceSlug
			);
			if (this.service?.meetingTimes) {
				for (const time of this.service.meetingTimes) {
					const dateTime = DateTime.fromISO(time); // Assuming the time is in ISO format
					const weekday = dateTime.toFormat("cccc"); // 'cccc' format for full weekday name, use 'ccc' for abbreviated
					const timeStr = dateTime.toFormat("T"); // 'T' for time in 24-hour format. Use 't' for 12-hour format
					const timezone = dateTime.zoneName; // This will get the IANA timezone name (e.g., "America/New_York")

					this.meetingTimes.push({
						weekday,
						time: timeStr,
						timezone,
					});
				}
			}

			this.$q.loading.hide();
			this.loading = false;
		} catch (err) {
			this.$q.loading.hide();
			this.loading = false;
			console.error(err);
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
	methods: {},
};
</script>

<style scoped>
.carousel-div {
	width: 100%;
	height: fit-content;
}
.carousel-image {
	width: 100%;
	height: 80vh;
}
.reverse-row {
	flex-direction: row-reverse;
}

.consultation-meeting-btn {
	width: 60vw;
}

.faq-section {
	width: 60vw;
}

.card-text-color {
	color: black;
}

.body--dark .card-text-color {
	color: white;
}

@media (max-width: 800px) {
	.consultation-meeting-btn {
		width: 80vw;
	}

	.faq-section {
		width: 80vw;
	}
}
</style>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
