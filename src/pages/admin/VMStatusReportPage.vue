<template>
	<q-page padding class="">
		<div class="q-px-lg">
			<q-input v-model="search" placeholder="Search" />
		</div>
		<q-table
			:grid="$q.screen.lt.md"
			:rows="statusReports"
			:loading="loading"
			class="q-mt-lg"
			:columns="columns"
			row-key="is"
			:filter="search"
			:visible-columns="visibleColumns"
			:pagination="{ rowsPerPage: $q.screen.lt.md ? 5 : 25 }"
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
								@click="() => downloadReport(props.row.id)"
							>
								<q-item-section>
									<div class="flex">
										<q-icon
											name="cloud_download"
											left
											class="q-my-auto"
										></q-icon>
										<q-item-label>
											{{ $t("Download") }}
										</q-item-label>
									</div>
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
							<span v-if="props.row.severity !== 'critical'">{{
								props.row.id
							}}</span>
							<q-badge v-else color="red">{{
								props.row.id
							}}</q-badge>
						</q-card-section>
						<q-card-section>
							<q-list bordered separator>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Section")
										}}</q-item-label>
										<q-item-label>{{
											props.row.section
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Name")
										}}</q-item-label>
										<q-item-label>{{
											props.row.name
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>{{
											$t("Severity")
										}}</q-item-label>
										<q-item-label>{{
											props.row.severity
										}}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item v-if="props.row?.date">
									<q-item-section>
										<q-item-label caption>{{
											$t("Process Boot Up")
										}}</q-item-label>
										<q-item-label>
											{{ props.row.date }}
										</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
							<q-btn
								:key="index"
								color="secondary text-black"
								:label="$t('Download')"
								@click="() => downloadReport(props.row.id)"
								class="full-width"
							/>
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
import { ref } from "vue";
import dataService from "../../services/data.service";
import DateService from "../../services/date.service";

export default {
	name: "VMStatusReportPage",
	data() {
		return {
			loading: false,
			search: "",
			statusReports: [],
			columns: [
				{
					name: "id",
					align: "left",
					label: "Id",
					field: "id",
					sortable: true,
				},
				{
					name: "section",
					align: "left",
					label: "Section",
					field: "section",
					sortable: true,
				},
				{
					name: "name",
					align: "left",
					label: "Name",
					field: "name",
					sortable: true,
				},
				{
					name: "severity",
					align: "left",
					label: "Severity",
					field: "severity",
					sortable: true,
				},
				{
					name: "info",
					align: "left",
					label: "Info",
					field: "info",
					sortable: true,
				},
				{
					name: "date",
					align: "left",
					label: "Process Boot Up",
					field: "date",
					sortable: true,
				},
				{
					name: "actions",
					align: "left",
					label: "Actions",
					field: "actions",
					sortable: false,
				},
			],
			visibleColumns: ref([
				"id",
				"section",
				"name",
				"severity",
				"info",
				"date",
				"actions",
			]),
		};
	},
	methods: {
		async fetchStatusReports() {
			this.loading = true;
			try {
				// Assuming `getStatusReports` fetches the data from the server
				const unfilteredReports = await dataService.getStatusReports();
				this.statusReports = unfilteredReports.map((x) => {
					x.date = this.$d(x.date);
					return x;
				});
			} catch (error) {
				console.error("Failed to fetch status reports:", error);
				this.$q.notify({
					color: "negative",
					message: "Failed to load status reports",
				});
			} finally {
				this.loading = false;
			}
		},
		$d(date) {
			return DateService.convertISOLocalDisplay(date);
		},
		async downloadReport(id) {
			await dataService.downloadVMStatusReport(id);
		},
	},
	async mounted() {
		await this.fetchStatusReports();
	},
};
</script>

<style scoped></style>
