<template>
	<q-page padding class="">
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			title="User Management"
			:rows="users"
			class="q-mt-lg"
			:columns="columns"
			row-key="userId"
			:filter="search"
			:visible-columns="visibleColumns"
		>
			<template v-slot:top>
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
			<template v-slot:top-right>
				<!-- Add any additional controls here -->
			</template>
			<template v-slot:body-cell-actions="props">
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
						</q-list>
					</q-btn-dropdown>
				</q-td>
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
			users: [
				{
					userId: "user01",
					fullName: "John Doe",
					email: "john.doe@example.com",
					emailConfirmed: true,
					phoneNumber: "123-456-7890",
					mfa: false,
				},
				{
					userId: "user02",
					fullName: "Jane Smith",
					email: "jane.smith@example.com",
					emailConfirmed: false,
					phoneNumber: "234-567-8901",
					mfa: true,
				},
				{
					userId: "user03",
					fullName: "Alice Johnson",
					email: "alice.johnson@example.com",
					emailConfirmed: true,
					phoneNumber: "345-678-9012",
					mfa: false,
				},
				{
					userId: "user04",
					fullName: "Bob Brown",
					email: "bob.brown@example.com",
					emailConfirmed: false,
					phoneNumber: "456-789-0123",
					mfa: true,
				},
				{
					userId: "user05",
					fullName: "Carol White",
					email: "carol.white@example.com",
					emailConfirmed: true,
					phoneNumber: "567-890-1234",
					mfa: false,
				},
			],
			columns: [
				{
					name: "userId",
					align: "left",
					label: "User ID",
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
					visible: false,
				},
				{
					name: "mfa",
					align: "left",
					label: "MFA",
					field: (row) => row.mfa,
					sortable: true,
					visible: false,
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
				"userId",
				"fullName",
				"email",
				"emailConfirmed",
				"actions",
				"phoneNumber",
				"mfa",
			]),
		};
	},
	async mounted() {
		//if this is not a admin
		if (this.$q.screen.lt.lg) {
			this.visibleColumns = ref(["email", "actions"]);
		}
		//Validate that jwt token can not let admin who edited app settings on browser through to admin endpoint
	},
	unmounted() {},
	async updated() {},
	methods: {},
};
</script>

<style scoped></style>
