<template>
	<q-layout>
		<q-header :class="`my-header q-mt-sm q-mx-lg` +
		{
			'header-transparent': hasScrolled,
		}
			" @mouseenter="hoverState = true" @mouseleave="hoverState = false">
			<q-toolbar>
				<q-toolbar-title class="flex" style="min-width: 150px">
					<router-link class="flex" to="/">
						<img src="logo.svg" alt="Logo" class="q-mr-md logo-image" />
					</router-link>
					<q-btn id="store-info-btn" flat @click="testInfo = !testInfo">
						<q-icon name="info" @click="toggleCard" color="white" />
					</q-btn>
				</q-toolbar-title>

				<!-- Menu button shown only on small screens -->
				<q-btn icon="menu" color="secondary" @click="toggleMenu" v-if="$q.screen.lt.md">
					<!-- Menu content -->
					<q-menu fit>
						<q-list>
							<q-item to="/software"><q-item-section>{{
								$t("Software")
							}}</q-item-section></q-item>
							<q-item to="/design"><q-item-section>{{
								$t("Design")
							}}</q-item-section></q-item>
							<q-item to="/photography"><q-item-section>{{
								$t("Photography")
							}}</q-item-section></q-item>
							<!-- <q-item to="/videography"
									><q-item-section>{{
										$t("Videography")
									}}</q-item-section></q-item
								> -->
							<!-- <q-item to="/classes"
									><q-item-section>{{
										$t("Classes")
									}}</q-item-section></q-item
								> -->
							<template v-if="user">
								<q-item to="/work"><q-item-section>{{
									$t("Work History")
								}}</q-item-section></q-item>
								<!-- <q-item to="/my-classes"
									><q-item-section>{{
										$t("My Classes")
									}}</q-item-section></q-item
								> -->
								<template v-if="user?.roles?.includes('admin')">
									<q-item to="/work/template"><q-item-section>{{
										$t("Templates")
									}}</q-item-section></q-item>
									<q-item to="/admin/users"><q-item-section>{{
										$t("Users")
									}}</q-item-section></q-item>
									<q-item to="admin/vmStatusReport"><q-item-section>{{
										$t("VM Status Report")
									}}</q-item-section></q-item>
								</template>
							</template>
							<q-item v-else to="/auth/login">
								<q-item-section>{{
									$t("Login")
								}}</q-item-section></q-item>

							<q-item to="/settings"><q-item-section>{{
								$t("Settings")
							}}</q-item-section></q-item>
						</q-list>
					</q-menu>
				</q-btn>

				<!-- Buttons shown on larger screens -->
				<div id="route-tabs" v-if="$q.screen.gt.sm" class="flex flex-center">
					<q-tabs align="center" class="tabs-text" indicator-color="accent">
						<q-route-tab to="/home" :label="$t('Home')" />
						<q-route-tab to="/software" :label="$t('Software')" />
						<q-route-tab to="/design" :label="$t('Design')" />
						<q-route-tab to="/photography" :label="$t('Photography')" />
						<!-- <q-route-tab
							to="/videography"
							:label="$t('Videography')"
						/>
						<q-route-tab to="/classes" :label="$t('Classes')" /> -->

						<template v-if="user">
							<q-route-tab to="/work" :label="$t('Work History')" />
							<!-- <q-route-tab
								to="/my-classes"
								:label="$t('My Classes')"
							/> -->
						</template>

						<template v-else>
							<q-route-tab to="/auth/login" :label="$t('Login')" />
						</template>
						<q-route-tab to="/settings" icon="settings">
						</q-route-tab>
						<template v-if="user?.roles?.includes('admin')">
							<q-btn-dropdown icon="admin_panel_settings" no-caps class="q-mx-sm">
								<q-list>
									<q-item to="/work/template" clickable>
										<q-item-section>
											<q-icon name="description" />
											<span>{{ $t("Templates") }}</span>
										</q-item-section>
									</q-item>
									<q-item to="/admin/users" clickable>
										<q-item-section>
											<q-icon name="group" />
											<span>{{ $t("Users") }}</span>
										</q-item-section>
									</q-item>
									<q-item to="/admin/vmStatusReport" clickable>
										<q-item-section>
											<q-icon name="assessment" />
											<span>{{
												$t("VM Status Report")
											}}</span>
										</q-item-section>
									</q-item>
								</q-list>
							</q-btn-dropdown>
						</template>
					</q-tabs>
				</div>
			</q-toolbar>
		</q-header>

		<q-page-container class="q-mx-sm">
			<router-view :key="$route.fullPath" />
		</q-page-container>
		<div class="extra-space"></div>
		<q-dialog v-model="testInfo">
			<q-card class="text-center">
				<q-card-section class="row q-pb-none">
					<div class="text-h4 q-mx-auto">
						{{ $t("Info") }}
					</div>
				</q-card-section>
				<q-card-section>
					<h6 class="q-my-none q-mb-sm" color="accent">
						{{ $t("What to do?") }}
					</h6>
					<div class="text-body1 q-mt-sm">
						{{
							$t(
								`This is a work management application. If you are interested in something like this send a
						message to
						sebastiangadzinskiwork@gmail.com.`
							)
						}}
					</div>
				</q-card-section>
				<!-- <q-card-section>
					<h6 class="q-my-none q-mb-sm" color="accent">
						{{ $t("Free Card Info") }}
					</h6>
					<q-btn
						class="text-h6"
						color="accent"
						:label="$t('4242 4242 4242 4242')"
						@click="copyTestCard"
					/>
					<div class="text-body1 q-my-sm">
						{{ $t("Click to copy!") }}
					</div>
				</q-card-section> -->
			</q-card>
		</q-dialog>
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
			testInfo: false,
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
	padding: 5px;
	position: fixed;
	backdrop-filter: blur(10px);
	background: linear-gradient(to right, var(--q-primary), var(--q-secondary));
	border-radius: 5px;
}

.header-transparent {
	background: var(--q-color-accent) !important;
	/* Uses Quasar primary color variable */
	transition: background-color 2s;
	box-shadow: none;
}

.tabs-text {
	transition: background 2s ease;
	color: white;
}

.header-transparent .tabs-text {
	background: linear-gradient(to right, var(--q-primary), var(--q-secondary));
}

.transparent {
	background: transparent;
	background-color: transparent;
}

.fast.header-transparent {
	transition: background-color 0.2s !important;
}

.q-toolbar__links {
	display: flex;
	align-items: center;
}

.q-page-container {
	padding-top: 50px;
	/* Adjust based on your header's height */
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
		display: none;
		/* Hide the menu button on desktop */
	}
}
</style>
