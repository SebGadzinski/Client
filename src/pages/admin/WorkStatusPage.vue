<template>
	<q-page class="flex column">
		<div class="row full-width justify-center">
			<q-form
				class="col-10 col-md-10 q-px-sm form-class"
				name="WorkStatus"
				@submit.prevent="handleSave"
			>
				<q-list
					class="q-mt-lg rounded-borders"
					bordered
					padding
					v-for="(categorySlug, index) in Object.keys(curState)"
					:key="index"
				>
					<q-item
						><h6 class="text-left q-my-none">
							{{ $t(categorySlug.toUpperCase()) }}
						</h6></q-item
					>
					<q-separator></q-separator>
					<q-item>
						<q-item-section>
							<p class="q-my-none">{{ $t("Status") }}</p>
						</q-item-section>
						<q-item-section>
							<q-btn
								v-if="curState[categorySlug]?.accepting"
								color="positive"
								class="full-width"
								@click="() => switchWorkStatus(categorySlug)"
								:label="$t('Accepting Work')"
							/>
							<q-btn
								v-else
								color="negative"
								class="full-width"
								@click="() => switchWorkStatus(categorySlug)"
								:label="$t('Im Lazy')"
							/>
						</q-item-section>
					</q-item>
					<q-item v-if="curState[categorySlug]?.accepting">
						<template v-if="this.$q.screen.lt.md">
							<q-item-section>
								<p class="q-mx-auto q-mb-none block">
									{{ $t("Cut Off Services") }}
								</p>
								<q-select
									v-model="curState[categorySlug].noService"
									:options="serviceOptions[categorySlug][0]"
									@update:model-value="checkChanges"
									label="Do not work in..."
									class="full-width"
									use-input
									multiple
								/>
							</q-item-section>
						</template>
						<template v-else-if="this.$q.screen.gt.sm">
							<q-item-section>
								<p class="q-my-none">
									{{ $t("Cut Off Services") }}
								</p>
							</q-item-section>
							<q-item-section>
								<q-select
									v-model="curState[categorySlug].noService"
									:options="serviceOptions[categorySlug][0]"
									@update:model-value="checkChanges"
									label="Select Services You Don't Want To Work In"
									class="full-width"
									use-input
									multiple
								/>
							</q-item-section>
						</template>
					</q-item>
				</q-list>
				<br />
				<div class="flex row q-mt-lg">
					<q-btn
						class="col-8 q-mx-auto text-h3 q-py-lg"
						style="height: "
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
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { mapActions, mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";
import _ from "lodash";

export default {
	name: "WorkStatusPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			curState: {},
			authState: useAuthState(),
			serviceOptions: {},
			changesMade: false,
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

			const data = await dataService.getAcceptingWorkState();
			this.oldState = data.acceptingWorkState;
			this.serviceOptions = data.servicesOptions;
			this.curState = _.cloneDeep(this.oldState);
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
			this.changesMade = !_.isEqual(this.curState, this.oldState);
		},
		switchWorkStatus(categorySlug) {
			this.curState[categorySlug].accepting =
				!this.curState[categorySlug].accepting;
			this.checkChanges();
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
					this.oldUser = await dataService.saveAcceptingWorkState(
						this.curState
					);
					this.$q
						.dialog({
							title: this.$t("State Saved"),
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
