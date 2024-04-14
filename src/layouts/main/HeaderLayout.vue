<template>
	<q-layout>
		<q-header
			:class="
				`my-header q-mt-sm q-mx-lg` +
				{
					'header-transparent': hasScrolled,
				}
			"
			@mouseenter="hoverState = true"
			@mouseleave="hoverState = false"
		>
			<q-toolbar>
				<q-toolbar-title class="flex">
					<router-link class="q-my-auto" to="/">
						<img
							src="logo.svg"
							alt="Logo"
							class="q-mr-md logo-image"
						/>
					</router-link>
					<q-btn
						class="q-my-auto text-body1 q-pa-sm"
						color="accent"
						:label="$t($q.screen.lt.md ? 'T' : 'Test Mode')"
						@click="
							() =>
								$q.dialog({
									title: $t('Test Mode'),
									message: $t(
										'Coming soon! Just need to test our new classes section!'
									),
								})
						"
					/>
				</q-toolbar-title>

				<!-- Menu button shown only on small screens -->
				<q-btn icon="menu" @click="toggleMenu" v-if="$q.screen.lt.md">
					<!-- Menu content -->
					<q-menu fit>
						<q-list>
							<template v-if="user">
								<q-item to="/work"
									><q-item-section>{{
										$t("Work History")
									}}</q-item-section></q-item
								>
								<q-item to="/my-classes"
									><q-item-section>{{
										$t("My Classes")
									}}</q-item-section></q-item
								>
								<template v-if="user?.roles?.includes('admin')">
									<q-item to="/work/template"
										><q-item-section>{{
											$t("Templates")
										}}</q-item-section></q-item
									>
									<q-item to="/admin/users"
										><q-item-section>{{
											$t("Users")
										}}</q-item-section></q-item
									>
									<q-item to="admin/vmStatusReport"
										><q-item-section>{{
											$t("VM Status Report")
										}}</q-item-section></q-item
									>
								</template>
							</template>
							<q-item v-else to="/auth/login">
								<q-item-section>{{
									$t("Login")
								}}</q-item-section></q-item
							>

							<q-item to="/settings"
								><q-item-section>{{
									$t("Settings")
								}}</q-item-section></q-item
							>
						</q-list>
					</q-menu>
				</q-btn>

				<!-- Buttons shown on larger screens -->
				<div v-if="$q.screen.gt.sm">
					<template v-if="user">
						<q-btn
							to="/work"
							flat
							:label="this.$t('Work History')"
						/>
						<q-btn
							to="/my-classes"
							flat
							:label="this.$t('My Classes')"
						/>
						<template v-if="user.roles.includes('admin')">
							<q-btn
								to="/work/template"
								flat
								:label="this.$t('Templates')"
							></q-btn>
							<q-btn
								to="/admin/users"
								flat
								:label="this.$t('Users')"
							></q-btn>
							<q-btn
								to="/admin/vmStatusReport"
								flat
								:label="this.$t('VM Status Report')"
							></q-btn>
						</template>
					</template>
					<template v-else>
						<q-btn
							flat
							:label="this.$t('Login')"
							to="/auth/login"
						></q-btn>
					</template>
					<q-btn flat icon="settings" to="/settings"></q-btn>
				</div>
			</q-toolbar>
		</q-header>

		<q-page-container class="q-mx-sm">
			<router-view />
		</q-page-container>
		<div class="extra-space"></div>
	</q-layout>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";

export default {
	data() {
		return {
			authState: useAuthState(),
			scrollOpacity: 1,
			hasScrolled: false,
			menuOpened: false,
		};
	},
	mounted() {
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
			const currentScrollPosition =
				window.pageYOffset || document.documentElement.scrollTop;

			let headers = document.getElementsByClassName("my-header");
			if (headers.length > 0) {
				if (currentScrollPosition < this.lastScrollPosition) {
					// Scrolling up
					if (
						currentScrollPosition < 30 ||
						currentScrollPosition <
							this.lastScrollDownPosition - 100
					) {
						headers[0].classList.remove(`fast`);
						headers[0].classList.remove(`header-transparent`);
						this.isScrollingUp = true;
					}
				} else {
					// Scrolling down
					if (window.scrollY > 400) {
						if (window.scrollY > 800) {
							headers[0].classList.add(`fast`);
						}
						headers[0].classList.add(`header-transparent`);
					}

					this.isScrollingUp = false;
					this.lastScrollDownPosition = currentScrollPosition;
				}
			}

			// Update lastScrollPosition
			this.lastScrollPosition = currentScrollPosition;
		},
		toggleMenu() {
			this.menuOpened = !this.menuOpened;
		},
	},
};
</script>
<style scoped>
.my-header {
	top: 0;
	left: 20px;
	right: 20px;
	padding: 20px;
	position: fixed;
	backdrop-filter: blur(10px);
}
.header-transparent {
	background: var(
		--q-color-accent
	) !important; /* Uses Quasar primary color variable */
	transition: background-color 2s;
	box-shadow: none;
}

.fast.header-transparent {
	transition: background-color 0.2s !important;
}

.header-transparent:hover {
	background: var(
		--q-color-primary
	) !important; /* Uses Quasar primary color variable */
}
.q-toolbar__links {
	display: flex;
	align-items: center;
}
.q-page-container {
	padding-top: 50px; /* Adjust based on your header's height */
}
.logo-image {
	width: 2.5rem;
	height: 2.5rem;
}

.extra-space {
	height: 200px;
	width: 100%;
}

/* Style for desktop */
@media (min-width: 800px) {
	.menu-button {
		display: none; /* Hide the menu button on desktop */
	}
}
</style>
