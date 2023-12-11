<template>
	<q-layout>
		<q-header :class="{ 'header-transparent': hasScrolled }">
			<q-toolbar>
				<q-toolbar-title>
					<router-link to="/">
						<img
							src="logo.svg"
							alt="Logo"
							class="q-mr-md logo-image"
						/>
					</router-link>
				</q-toolbar-title>
				<div class="q-toolbar__links">
					<!-- If user exists -->
					<template v-if="user">
						<q-btn flat label="Profile"></q-btn>
						<q-btn flat label="Purchases"></q-btn>
					</template>
					<!-- If user does not exist -->
					<template v-else>
						<q-btn flat label="Login" to="/auth/login"></q-btn>
					</template>
					<q-btn flat icon="settings" to="/settings"></q-btn>
					<q-btn
						@click="toggleMenu"
						icon="menu"
						class="menu-button"
					></q-btn>
				</div>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	data() {
		return {
			authState: useAuthState(),
			hasScrolled: false,
		};
	},
	mounted() {
		console.log(this.user);
		window.addEventListener("scroll", this.onScroll);
	},
	beforeUnmount() {
		window.removeEventListener("scroll", this.onScroll);
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		onScroll() {
			this.hasScrolled = window.scrollY > 0;
		},
		toggleMenu() {
			// Logic to toggle your menu
		},
	},
};
</script>

<style scoped>
.header-transparent {
	background: rgba(255, 255, 255, 0.4); /* 80% transparent white background */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	transition: background-color 0.3s;
	box-shadow: none;
}

.header-transparent:hover {
	background: rgba(255, 255, 255, 1); /* Fully opaque on hover */
}

.q-toolbar__links {
	display: flex;
	align-items: center;
}
.q-page-container {
	padding-top: 50px; /* Adjust based on your header's height */
}
@media (max-width: 767px) {
	.q-toolbar__links {
		display: none;
	}
	.logo-image {
		width: 25px;
		height: 25px;
	}
}

/* Style for desktop */
@media (min-width: 768px) {
	.logo-image {
		width: 50px;
		height: 50px;
	}
	.menu-button {
		display: none; /* Hide the menu button on desktop */
	}
}
</style>
