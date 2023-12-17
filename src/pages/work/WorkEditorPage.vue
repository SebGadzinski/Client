<template>
	<q-page padding>
		<q-table
			:rows="workItems"
			:grid="$q.screen.lt.md"
			class="q-mt-lg"
			:columns="workItemCols"
			row-key="workItemId"
			:hide-bottom="true"
			:visible-columns="workItemVisibleCols"
		>
			<template v-if="$q.screen.gt.sm" v-slot:body="props">
				<q-tr :props="props">
					<q-td key="id" :props="props">
						{{ props.row.id }}
					</q-td>
					<q-td key="name" :props="props">
						<q-input
							v-model="props.row.name"
							type="name"
							:rules="[(val) => !!val || $t('Name is required')]"
							:dense="true"
						/>
					</q-td>
					<q-td key="description" :props="props">
						<q-input
							v-model="props.row.description"
							filled
							type="textarea"
							:rules="[
								(val) => !!val || $t('Description is required'),
							]"
							:dense="true"
						/>
					</q-td>
					<q-td key="links" :props="props">
						<div
							v-for="(link, index) in props.row.links"
							:key="index"
							class="q-mb-md"
						>
							<q-input
								v-model="link.name"
								:label="$t('Name')"
								dense
								filled
							/>
							<q-input
								v-model="link.link"
								:label="$t('URL')"
								dense
								filled
								class="q-mt-sm"
							/>
						</div>
						<q-btn
							label="Add New Link"
							flat
							class="full-width"
							color="positive"
							@click="addNewLink(props.row.id)"
						/>
					</q-td>
					<q-td key="status" :props="props">
						<q-select
							v-model="props.row.status"
							:options="statusOptions"
						/>
					</q-td>
					<q-td key="delete" :props="props">
						<q-btn
							color="red"
							:label="$t('Delete')"
							@click="deleteWorkItem(props.row.id)"
							class="full-width"
						/>
					</q-td>
				</q-tr>
			</template>
			<template v-if="$q.screen.lt.md" v-slot:item="props">
				<div class="q-pa-xs col-12">
					<q-card flat bordered>
						<q-card-section
							class="flex justify-between bg-secondary"
						>
							<span>ID:{{ props.row.workId }}</span>
						</q-card-section>
						<q-card-section>
							<q-list>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Name")
										}}</q-item-label>
										<q-input
											v-model="props.row.name"
											type="name"
											:rules="[
												(val) =>
													!!val ||
													$t('Name is required'),
											]"
											:dense="true"
										/>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Description")
										}}</q-item-label>
										<div style="height: 5px"></div>
										<q-input
											v-model="props.row.description"
											filled
											type="textarea"
											:rules="[
												(val) =>
													!!val ||
													$t(
														'Description is required'
													),
											]"
											:dense="true"
										/>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Links")
										}}</q-item-label>
										<div style="height: 5px"></div>
										<div
											v-for="(link, index) in props.row
												.links"
											:key="index"
											class="q-mb-md"
										>
											<q-input
												v-model="link.name"
												:label="$t('Name')"
												dense
												filled
											/>
											<q-input
												v-model="link.link"
												:label="$t('URL')"
												dense
												filled
												class="q-mt-sm"
											/>
										</div>
										<q-btn
											label="Add New Link"
											flat
											class="full-width"
											color="positive"
											@click="addNewLink(props.row.id)"
										/>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Status")
										}}</q-item-label>
										<q-select
											v-model="props.row.status"
											:options="statusOptions"
										/>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-btn
											color="red"
											:label="$t('Delete')"
											@click="
												deleteWorkItem(props.row.id)
											"
											class="full-width"
										/>
									</q-item-section>
								</q-item>
							</q-list>
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
	name: "WorkEditorPage",
	data() {
		return {
			loading: true,
			$q: useQuasar(),
			search: "",
			statusOptions: [],
			workItems: [],
			workItemCols: [
				{
					name: "id",
					align: "left",
					label: "Id",
					field: (row) => row.id,
					sortable: true,
				},
				{
					name: "name",
					align: "left",
					label: "Name",
					field: (row) => row.name,
					sortable: true,
				},
				{
					name: "description",
					align: "left",
					label: "Description",
					field: (row) => row.description,
					sortable: true,
				},
				{
					name: "links",
					align: "left",
					label: "Links",
				},
				{
					name: "status",
					align: "left",
					label: "Status",
					field: (row) => row.status,
					sortable: true,
				},
				{
					name: "delete",
					align: "center",
					label: "Delete",
				},
			],
			workItemVisibleCols: ref([
				"id",
				"name",
				"description",
				"links",
				"status",
				"delete",
			]),
		};
	},
	async mounted() {
		//Gather Data
		//Get Status Options
		let grabbedStatusOptions = ["New", "Pending", "Working", "Completed"];
		let grabbedRows = [
			{
				id: "oidfn3",
				name: "Add Databases",
				description: "This is a description",
				links: [{ link: "https://tits", name: "Tits" }],
				status: "New",
			},
			{
				id: "aoifna3",
				name: "Write Code",
				description: "This is a description",
				status: "Working",
			},
		];
		this.statusOptions = grabbedStatusOptions;
		this.workItems = grabbedRows;
	},
	unmounted() {},
	async updated() {},
	methods: {
		addNewLink(workItemId) {
			let workItem = this.workItems.find((x) => x.id === workItemId);
			workItem.links.push({ name: "", link: "" });
		},
		deleteWorkItem(workItemId) {
			this.workItems = this.workItems.filter((x) => x.id !== workItemId);
		},
	},
};
</script>

<style scoped></style>
