<template>
	<div class="sidebar q-pa-md">
		<h2 class="text-h6 q-mb-md text-primary">Top 10 Movies</h2>
		<q-list bordered separator>
			<q-item v-for="(movie, index) in movies" :key="index">
				<q-item-section>
					<q-item-label class="text-secondary"
						>{{ index + 1 }}. {{ movie.title }}</q-item-label
					>
					<q-item-label caption class="text-info">{{
						movie.rating
					}}</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</div>
</template>

<script>
export default {
	name: "SideBar",
	data() {
		return {
			movies: [
				{ title: "The Great Adventure", rating: "9.8" },
				{ title: "Mystic River", rating: "9.7" },
				{ title: "Skyline Journey", rating: "9.6" },
				{ title: "Sunset Dreams", rating: "9.5" },
				{ title: "Winter Tale", rating: "9.4" },
				{ title: "Summer Joy", rating: "9.3" },
				{ title: "Autumn Whispers", rating: "9.2" },
				{ title: "Spring Breeze", rating: "9.1" },
				{ title: "Galactic Voyage", rating: "9.0" },
				{ title: "Ocean Mysteries", rating: "8.9" },
			],
		};
	},
};
</script>

<style scoped>
.sidebar {
	background-color: var(--q-color-background);
	border: 1px solid var(--q-color-secondary);
	border-radius: 8px;
}
</style>
