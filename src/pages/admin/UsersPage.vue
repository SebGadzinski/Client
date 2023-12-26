<template>
	<q-page padding class="">
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:grid="$q.screen.lt.md"
			:rows="users"
			class="q-mt-lg"
			:columns="columns"
			row-key="is"
			:filter="search"
			:visible-columns="visibleColumns"
		>
			<template v-if="$q.screen.gt.sm" v-slot:top>
				<q-space />

				<q-select
					v-model="visibleColumns"
					multiple
					outlined
					dense
					options-dense
					:display-value="$q.lang.table.columns"
					emit-value
					map-options
					:options="columns"
					option-value="name"
					options-cover
					style="min-width: 150px"
				/>
			</template>
			<template v-if="$q.screen.gt.sm" v-slot:body-cell-actions="props">
				<q-td :key="props.name">
					<q-btn-dropdown color="primary">
						<q-list>
							<q-item
								clickable
								v-close-popup
								:to="`/work/user/${props.row.email}`"
							>
								<q-item-section>
									<q-item-label>{{
										$t("View Work")
									}}</q-item-label>
								</q-item-section>
							</q-item>
							<q-item
								clickable
								v-close-popup
								:to="`/profile/user/${props.row._id}`"
							>
								<q-item-section>
									<q-item-label>{{
										$t("Edit Profile")
									}}</q-item-label>
								</q-item-section>
							</q-item>
							<q-item
								v-for="(action, index) in props.row.actions"
								:key="index"
								:to="action.link"
								clickable
								v-close-popup
							>
								<q-item-section>
									<q-item-label>{{
										$t(action.name)
									}}</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</q-td>
			</template>
			<template v-if="$q.screen.lt.md" v-slot:item="props">
				<div class="q-pa-xs col-12">
					<q-card flat bordered>
						<q-card-section
							class="flex justify-between bg-secondary"
						>
							<span v-if="props.row.emailConfirmed">{{
								props.row.email
							}}</span>
							<q-badge v-else color="red">{{
								props.row.email
							}}</q-badge>
						</q-card-section>
						<q-card-section>
							<q-list bordered separator>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("ID")
										}}</q-item-label>
										<q-item-label>{{
											props.row._id
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Name")
										}}</q-item-label>
										<q-item-label>{{
											props.row.fullName
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("$ Monthly")
										}}</q-item-label>
										<q-item-label>{{
											props.row.monthlyCost
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("$ Total")
										}}</q-item-label>
										<q-item-label>{{
											props.row.totalCost
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section
										v-if="props.row?.phoneNumber"
									>
										<q-item-label caption>{{
											$t("Phone")
										}}</q-item-label>
										<q-item-label>{{
											props.row.phoneNumber
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("MFA")
										}}</q-item-label>
										<q-item-label>{{
											props.row.mfa
										}}</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
							<q-btn
								v-for="(action, index) in props.row.actions"
								:key="index"
								color="secondary text-black"
								:label="$t(action.name)"
								:to="action.link"
								class="full-width"
							/>
						</q-card-section>
					</q-card>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import dataService from "../../services/data.service";
import { useQuasar, QSpinnerGears } from "quasar";
import { ref } from "vue";

export default {
	name: "UsersPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			search: "",
			users: [],
			columns: [
				{
					name: "id",
					align: "left",
					label: "Id",
					field: (row) => row._id,
					sortable: true,
				},
				{
					name: "fullName",
					align: "left",
					label: "Full Name",
					field: (row) => row.fullName,
					sortable: true,
				},
				{
					name: "email",
					align: "left",
					label: "Email",
					field: (row) => row.email,
					sortable: true,
				},
				{
					name: "emailConfirmed",
					align: "left",
					label: "Email Confirmed",
					field: (row) => row.emailConfirmed,
					sortable: true,
				},
				{
					name: "phoneNumber",
					align: "left",
					label: "Phone Number",
					field: (row) => row.phoneNumber,
					sortable: true,
				},
				{
					name: "monthlyCost",
					align: "left",
					label: "Monthly $",
					field: (row) => row.monthlyCost,
					sortable: true,
				},
				{
					name: "totalCost",
					align: "left",
					label: "Total $",
					field: (row) => row.totalCost,
					sortable: true,
				},
				{
					name: "mfa",
					align: "left",
					label: "MFA",
					field: (row) => row.mfa,
					sortable: true,
				},
				{
					name: "actions",
					align: "left",
					label: "Actions",
					field: "actions",
					field: (row) => row.actions,
				},
			],
			visibleColumns: ref([
				"id",
				"fullName",
				"email",
				"emailConfirmed",
				"actions",
				"phoneNumber",
				"mfa",
				"monthlyCost",
				"totalCost",
			]),
		};
	},
	async mounted() {
		try {
			this.loading = true;
			this.$q.loading.show({
				spinner: QSpinnerGears,
				backgroundColor: "#1e5499",
				message: this.$t("Getting Info..."),
			});
			console.log(this.route?.params?.workId);
			this.users = await dataService.getUserPageData();
			console.log(this.users);
		} catch (err) {
			console.error(err);
		} finally {
			this.$q.loading.hide();
			this.loading = false;
		}
		//Validate that jwt token can not let admin who edited app settings on browser through to admin endpoint
	},
	unmounted() {},
	async updated() {},
	methods: {},
};
</script>

<style scoped></style>
