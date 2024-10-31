<template>
	<div class="home-page">
		<!-- Phone Section -->
		<section class="phone-section" id="phone-section">
			<q-space />
			<div class="container">
				<div v-if="$q.screen.lt.md" class="phone">
					<img class="fit" src="/home/mobile-app.png" />
				</div>
				<div class="phones" v-else>
					<img class="phones-img" src="/home/mobile-apps.png" />
				</div>
				<div
					class="picture-header"
					href="/software/mobile-app-development"
				>
					{{ $t("Build A Mobile App?") }}
				</div>
			</div>
			<q-space />
			<a class="scroll-down-div" href="#laptop-section">
				<div class="scroll-down">
					<span color="accent" class="material-icons next-arrow"
						>arrow_downward</span
					>
				</div>
			</a>
		</section>

		<!-- Spacer -->
		<div style="height: 100px"></div>

		<!-- Laptop Section -->
		<section class="laptop-section" id="laptop-section">
			<div class="container" style="display: flex; flex: 0.9">
				<div style="margin: auto">
					<div v-if="$q.screen.lt.md" class="laptop">
						<img class="fit" src="/home/web-app.png" />
					</div>
					<div class="phones" v-else>
						<img class="phones-img" src="/home/web-apps.png" />
					</div>
					<div
						class="picture-header"
						href="/software/web-development"
					>
						{{ $t("Web Application?") }}
					</div>
				</div>
			</div>
			<a class="scroll-down-div" href="#software-services-section">
				<div class="scroll-down">
					<span color="accent" class="material-icons next-arrow"
						>arrow_downward</span
					>
				</div>
			</a>
		</section>

		<!-- Software Services Section -->
		<section
			class="software-services-section"
			id="software-services-section"
		>
			<div
				class="container"
				style="display: flex; flex: 0.9; justify-content: center"
			>
				<div class="container-section">
					<div class="picture-header">
						{{ $t("Software's Our Specialty") }}
					</div>
					<div class="fade-in-fast text-body1 q-py-md">
						{{ $t("software-info") }}
					</div>
					<div class="fade-in-fast">
						<a
							v-for="(service, key) in $q.screen.gt.sm
								? software
								: softwareMobile"
							:key="key"
							:href="`/software/${service.slug}`"
						>
							<button class="service-btn sectional">
								{{ $t(service.name) }}
							</button>
						</a>
					</div>
					<div class="fade-in-fast">
						<a :href="'/software'">
							<button class="service-btn sectional view-all">
								{{ $t("View All Services") }}
							</button>
						</a>
					</div>
				</div>
			</div>
			<div class="text-body1 q-py-sm">{{ $t("We also do design!") }}</div>
			<a class="scroll-down-div" href="#design-services-section">
				<div class="scroll-down">
					<span color="accent" class="material-icons next-arrow"
						>arrow_downward</span
					>
				</div>
			</a>
		</section>

		<!-- Design Services Section -->
		<section class="design-services-section" id="design-services-section">
			<div
				class="container"
				style="display: flex; flex: 0.9; justify-content: center"
			>
				<div class="container-section">
					<div class="picture-header">
						{{ $t("We Design Systems & Products!") }}
					</div>
					<div class="fade-in-fast text-body1 q-py-md">
						{{ $t("design-info") }}
					</div>
					<div class="fade-in-fast">
						<a
							v-for="(service, key) in design"
							:key="key"
							:href="`/design/${service.slug}`"
						>
							<button class="service-btn sectional">
								{{ $t(service.name) }}
							</button>
						</a>
					</div>
				</div>
			</div>
			<div class="text-body1 q-py-sm">
				{{ $t("Contact Us Via Email!") }}
			</div>
			<button class="service-btn text-body1" @click="copyEmail">
				{{ $t("Copy Email") }}
			</button>
		</section>
	</div>
</template>

<script>
export default {
	name: "HomePage",
	data() {
		return {
			softwareMobile: [
				{
					name: "Business Site",
					slug: "business-site",
				},
				{
					name: "Web Development",
					slug: "web-development",
				},
				{
					name: "Software Testing",
					slug: "software-testing",
				},
				{
					name: "UI/UX Design",
					slug: "ui-ux-design",
				},
				{
					name: "Mobile App Development",
					slug: "mobile-app-development",
				},

				{
					name: "Database Report Service",
					slug: "database-report-service",
				},
			],
			software: [
				{
					name: "Client Server Generator",
					slug: "client-server-generator",
				},
				{
					name: "Project Upgrading",
					slug: "project-upgrading",
				},
				{
					name: "Project Maintenance",
					slug: "project-maintenance",
				},
				{
					name: "Web Development",
					slug: "web-development",
				},
				{
					name: "Mobile App Development",
					slug: "mobile-app-development",
				},
				{
					name: "Business Site",
					slug: "business-site",
				},
				{
					name: "Custom GPT Communication",
					slug: "custom-gpt-communication",
				},
				{
					name: "Web Scraping and Automation",
					slug: "web-scraping-automation",
				},
				{
					name: "Software Consulting",
					slug: "software-consulting",
				},
				{
					name: "Virtual Machine",
					slug: "virtual-machine",
				},
				{
					name: "Error Logging",
					slug: "error-logging",
				},
				{
					name: "Information Tunnels",
					slug: "information-tunnels",
				},
				{
					name: "Cloud Services",
					slug: "cloud-services",
				},
				{
					name: "Database Report Service",
					slug: "database-report-service",
				},
				{
					name: "UI/UX Design",
					slug: "ui-ux-design",
				},
				{
					name: "Web 3.0",
					slug: "web-3",
				},
				{
					name: "Software Testing",
					slug: "software-testing",
				},
			],
			design: [
				{
					name: "Packaging Design",
					slug: "packaging-design",
				},
				{
					name: "Logo Design",
					slug: "logo-design",
				},
				{
					name: "Web Design",
					slug: "web-design",
				},
				{
					name: "Mobile App Design",
					slug: "mobile-app-design",
				},
				{
					name: "Email Marketing Design",
					slug: "email-marketing-design",
				},
				{
					name: "Brochure Design",
					slug: "brochure-design",
				},
			],
		};
	},
	async mounted() {
		// Cache the scroll event handler to remove it later
		this.scrollHandler = (e) => {
			e.preventDefault();
			const targetId = e.currentTarget.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
				});
			}
		};

		// Add scroll event listener to each .scroll-down link
		document.querySelectorAll(".scroll-down-div").forEach((el) => {
			el.addEventListener("click", this.scrollHandler);
		});

		// Intersection Observer for animations
		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate");
						this.observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observe elements
		document
			.querySelectorAll(
				".phone, .phones, .laptop, .picture-header, .fade-in-fast"
			)
			.forEach((el) => {
				this.observer.observe(el);
			});
	},
	beforeUnmount() {
		// Remove scroll event listeners
		document.querySelectorAll(".scroll-down-div").forEach((el) => {
			el.removeEventListener("click", this.scrollHandler);
		});

		// Disconnect the observer to prevent memory leaks
		if (this.observer) {
			this.observer.disconnect();
		}
	},
	methods: {
		async copyEmail() {
			const email = "sebastiangadzinskiwork@gmail.com";
			await navigator.clipboard.writeText(email);
			this.$q.notify({
				message: "Email copied to clipboard!",
				color: "positive",
				icon: "content_copy",
			});
		},
	},
};
</script>

<style>
.service-btn {
	padding: 12px 24px;
	font-size: 16px;
	font-weight: bold;
	color: white;
	background: linear-gradient(to right, var(--q-primary), var(--q-secondary));
	border: none;
	border-radius: 25px;
	cursor: pointer;
	transition: background 1s ease, transform 0.5s ease, box-shadow 1s ease;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.service-btn:hover {
	background: linear-gradient(to left, var(--q-accent), var(--q-secondary));
	transform: translateY(-2px);
	box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
.service-btn:focus {
	outline: none;
	box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
}
.home-page {
	margin: 0;
	padding: 0;
	height: 100%;
	font-family: Arial, sans-serif;
	scroll-behavior: smooth;
}
section {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.phone-section {
	height: calc(100vh - 120px);
}
.container {
	text-align: center;
}
.phone {
	height: 60vh;
	border-radius: 30px;
	position: relative;
	overflow: hidden;
	margin: 0px auto 20px auto;
	opacity: 0;
	transform: translateY(50px);
}
.phone.animate {
	animation: phoneAppear 1s forwards;
}
.phones {
	width: 100%;
	height: fit-content;
	position: relative;
	transform: translateY(50px);
}
.phones.animate {
	animation: phoneAppear 1s forwards;
}
.phones-img {
	height: calc((100vh - 100px) * 0.6);
	margin: auto;
}
@keyframes phoneAppear {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
.scroll-down-div:link {
	color: var(--q-background);
	background-color: var(--q-primary);
	text-decoration: none;
}
.scroll-down-div:visited {
	color: var(--q-background);
	background-color: var(--q-primary);
	text-decoration: none;
}
.scroll-down-div:hover {
	color: var(--q-background);
	background-color: var(--q-primary);
	text-decoration: underline;
}
.scroll-down-div:active {
	color: var(--q-background);
	background-color: var(--q-primary);
	text-decoration: underline;
}
.scroll-down {
	color: var(--q-background);
}

.laptop {
	width: 300px;
	height: 200px;
	border-radius: 10px;
	position: relative;
	margin: 0px auto 20px auto;
	transform-style: preserve-3d;
	transform: perspective(1000px) rotateX(90deg);
	opacity: 0;
}
.laptop.animate {
	animation: laptopOpen 1s forwards;
}
@keyframes laptopOpen {
	to {
		transform: perspective(1000px) rotateX(10deg);
		opacity: 1;
	}
}
.laptop-keyboard {
	width: 320px;
	height: 20px;
	background-color: #555;
	position: absolute;
	bottom: -20px;
	left: -10px;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.picture-header {
	font-size: x-large;
	font-weight: 500;
}
.picture-header {
	/* color: #333; */
	margin-top: 20px;
	opacity: 0;
}
.picture-header.animate {
	animation: fadeIn 1s forwards;
}
.fade-in-fast {
	opacity: 0;
}
.fade-in-fast.animate {
	animation: fadeIn 1s forwards;
}
@keyframes fadeIn {
	to {
		opacity: 1;
	}
}
.scroll-down-div {
	background: linear-gradient(to right, var(--q-primary), var(--q-secondary));
	padding: 0px 50px;
	border-radius: 10px;
}
.next-arrow {
	font-size: 50px;
	animation: bounce 2s infinite;
}
@keyframes bounce {
	0%,
	20%,
	50%,
	80%,
	100% {
		transform: translateY(0) translateX(0);
	}
	40% {
		transform: translateY(-10px) translateX(0);
	}
	60% {
		transform: translateY(-5px) translateX(0);
	}
}
.service-btn.sectional.view-all {
	background: var(--q-primary);
}
.service-btn.sectional {
	font-size: small;
	margin: 5px;
}
.container-section {
	margin: auto;
	width: 95vw;
}

@media (min-width: 601px) {
	.container-section {
		margin: auto;
		width: 80vw;
	}
	.service-btn.sectional {
		margin: 10px;
		font-size: large;
	}
	.picture-header {
		font-size: 3rem;
	}
	.next-arrow {
		font-size: 50px;
	}
}
@media (min-width: 901px) {
	.container-section {
		margin: auto;
		width: 75vw;
	}
	.service-btn.sectional {
		margin: 10px;
		font-size: larger;
	}
	.picture-header {
		font-size: 4rem;
	}
	.next-arrow {
		font-size: 60px;
	}
	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0) translateX(0);
		}
		40% {
			transform: translateY(-30px) translateX(0);
		}
		60% {
			transform: translateY(-15px) translateX(0);
		}
	}
}
</style>
