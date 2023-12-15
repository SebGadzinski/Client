<template>
	<q-page class="flex flex-center column">
		<q-form class="form-class" name="Profile" @submit.prevent="handleSave">
			<q-input
				v-model="pUser.name"
				type="name"
				:label="$t('Name')"
				@update:model-value="checkChanges"
				:rules="[(val) => !!val || $t('Name is required')]"
				:dense="false"
			/>
			<q-input
				v-model="pUser.email"
				:label="$t('Email')"
				@update:model-value="checkChanges"
				:rules="[(val) => !!val || $t('Email is required')]"
				:dense="false"
			/>
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
	</q-page>
</template>
<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
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
		};
	},
	async mounted() {
		//grab from db
		this.oldUser = {
			name: this.user.fullName,
			email: this.user.email,
		};

		this.pUser = _.cloneDeep(this.oldUser);
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
			//Update db
			//force refresh token here as well
		},
	},
};
</script>

<style scoped></style>
