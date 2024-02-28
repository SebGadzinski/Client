<template>
	<q-page class="q-pa-md">
		<q-card>
			<q-card-section>
				<div class="text-h6">{{ notification.title }}</div>
				<div>{{ notification.body }}</div>
			</q-card-section>
			<q-card-section v-if="notification.data">
				<div class="text-subtitle2">Data</div>
				<q-markup-table>
					<template
						v-for="(value, key) in notification.data"
						:key="key"
					>
						<tr>
							<td>{{ key }}</td>
							<td>{{ value }}</td>
						</tr>
					</template>
				</q-markup-table>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

// With notifications, do not pass in all the data you would want,
// rather keep the data to a id, and use data service to grab data based off that id

export default {
	data() {
		return {
			route: useRoute(),
			notification: {
				title: "Title",
				body: "Body",
				data: {},
			},
		};
	},
	mounted() {
		try {
			this.notification = JSON.parse(this.route?.params?.notification);
		} catch (err) {
			this.$q.notify({
				progress: true,
				message: "Cannot parse notification",
				color: "primary",
				avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
				onDismiss: () => {
					this.$router.back();
				},
			});
		}
	},
	updated() {},
};
</script>

<style scoped></style>
