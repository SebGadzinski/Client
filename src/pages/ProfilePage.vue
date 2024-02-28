<template>
	<q-page class="flex flex-center column">
		<div class="row full-width justify-center">
			<q-form
				class="col-10 col-md-3 q-px-sm form-class"
				name="Profile"
				@submit.prevent="handleSave"
			>
				<q-input
					v-model="pUser.name"
					type="name"
					:label="$t('Name')"
					@update:model-value="checkChanges"
					:rules="[(val) => !!val || $t('Name is required')]"
					:dense="false"
				/>
				<q-input
					v-model="pUser.phoneNumber"
					:label="$t('Phone Number')"
					@update:model-value="checkChanges"
					:dense="false"
				/>
				<!-- Admin -->
				<template v-if="user?.roles?.includes('admin')">
					<br />
					<q-input
						v-model="pUser.email"
						:label="$t('Email')"
						@update:model-value="checkChanges"
						:rules="[(val) => !!val || $t('Email is required')]"
						:dense="false"
					/>
					<q-checkbox
						v-model="pUser.emailConfirmed"
						@update:model-value="checkChanges"
						:label="$t('Email Confirmed')"
					/>
					<br />
				</template>
				<br />
				<div class="flex flex-center">
					<q-btn
						:disable="!changesMade"
						label="Save"
						type="submit"
						color="primary"
					/>
				</div>
			</q-form>
		</div>
	</q-page>
</template>
<script>
import dataService from "../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";
import _ from "lodash";

export default {
	name: "ProfilePage",
	data() {
		return {
			loading: true,
			changesMade: false,
			$q: useQuasar(),
			pUser: {},
			authState: useAuthState(),
			route: useRoute(),
		};
	},
	async mounted() {
		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Gathering Info..."),
			});

			this.oldUser = await dataService.getProfile(
				this.route?.params?.userId
			);

			this.pUser = _.cloneDeep(this.oldUser);
		} catch (err) {
			this.$q
				.dialog({
					title: this.$t("Error"),
					message: this.$t(err.toString()),
				})
				.onDismiss(() => {
					this.$router.push("/");
				});
			console.error(err);
		} finally {
			this.$q.loading.hide();
			this.loading = false;
		}
	},
	unmounted() {},
	async updated() {},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		checkChanges() {
			this.changesMade = !_.isEqual(this.pUser, this.oldUser);
		},
		async handleSave() {
			try {
				if (this.changesMade) {
					this.loading = true;
					this.$q.loading.show({
						spinner: QSpinnerGears,
						backgroundColor: "#1e5499",
						message: this.$t("Saving..."),
					});
					this.oldUser = await dataService.saveProfile(
						this.route?.params?.userId,
						this.pUser
					);
					this.$q
						.dialog({
							title: this.$t("Profile Saved"),
							message: this.$t("Content has been updated."),
						})
						.onDismiss(() => {
							this.$router.push("/settings");
						});
				}
			} catch (err) {
				console.error(err);
			} finally {
				this.$q.loading.hide();
				this.loading = false;
			}
		},
	},
};
</script>

<style scoped></style>
