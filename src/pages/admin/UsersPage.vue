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
											props.row.userId
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
								color="secondary"
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
					field: (row) => row.userId,
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
		//Gather Data
		let grabbedRows = [
			{
				userId: "user01",
				fullName: "John Doe",
				email: "john.doe@example.com",
				emailConfirmed: true,
				phoneNumber: "123-456-7890",
				mfa: false,
				monthlyCost: 75.0,
				totalCost: 55.9,
			},
			{
				userId: "user02",
				fullName: "Jane Smith",
				email: "jane.smith@example.com",
				emailConfirmed: false,
				phoneNumber: "234-567-8901",
				mfa: true,
				monthlyCost: 75.0,
				totalCost: 55.9,
				actions: [{ name: "Delete", link: "somelink" }],
			},
			{
				userId: "user03",
				fullName: "Alice Johnson",
				email: "alice.johnson@example.com",
				emailConfirmed: true,
				phoneNumber: "345-678-9012",
				mfa: false,
				monthlyCost: 0,
				totalCost: 9,
			},
			{
				userId: "user04",
				fullName: "Bob Brown",
				email: "bob.brown@example.com",
				emailConfirmed: false,
				phoneNumber: "456-789-0123",
				mfa: true,
				monthlyCost: 76.0,
				totalCost: 52.9,
			},
			{
				userId: "user05",
				fullName: "Carol White",
				email: "carol.white@example.com",
				emailConfirmed: true,
				phoneNumber: "567-890-1234",
				mfa: false,
				monthlyCost: 76.0,
				totalCost: 52.9,
			},
		];
		this.users = grabbedRows;
		//Validate that jwt token can not let admin who edited app settings on browser through to admin endpoint
	},
	unmounted() {},
	async updated() {},
	methods: {},
};
</script>

<style scoped></style>
