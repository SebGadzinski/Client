import { api } from "../boot/axios";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { i18n } from "../boot/i18n";

class DataService {
	/**
	 * Checks to see if there is a update available for the application
	 * @returns {Object}
	 */
	async checkForUpdate() {
		return new Promise((resolve, reject) => {
			let currentVersion = require("../../package.json").version;
			if (!currentVersion) reject(null);

			api.post("/app/checkForUpdate", { currentVersion })
				.then((response) => {
					if (!response.data) return reject("No Data In Response");

					resolve(response.data);
				})
				.catch((err) => {
					let { message } = err;
					if (message.includes("304")) {
						// no update available
						return resolve({ message: "No Update Available" });
					}
					reject(message);
				});
		});
	}

	/**
	 * Updates Subscriptio for firebase notification
	 * @param {String} token
	 * @param {String} enable
	 * @returns
	 */
	updateNotificationSubscription({ token, enable }) {
		return new Promise((resolve, reject) => {
			if (!token) return reject("No Token for updateNotification");

			let obj = {
				token,
				enable,
			};
			api.post("/app/updateNotificationSubscription", obj)
				.then((resp) => {
					if (resp.data.success) {
						resolve(true);
					} else {
						console.log("Message: ");
						console.log(resp.data.message);
						throw new Error("Could not turn on notififications");
					}
				})
				.catch(({ message }) => {
					reject(message);
				});
		});
	}

	async getHomePageData() {
		return await this.call(
			api.get("/data/getHomePageData"),
			"Could not get home page data"
		);
	}

	async getCategoryPageData(categorySlug) {
		return await this.call(
			api.post("/data/getCategoryPageData", { categorySlug }),
			"Could not get category page data"
		);
	}

	async getServicePageData(categorySlug, serviceSlug) {
		return await this.call(
			api.post("/data/getServicePageData", { categorySlug, serviceSlug }),
			"Could not get service page data"
		);
	}

	async getMeetingPageData(categorySlug, serviceSlug) {
		return await this.call(
			api.post("/data/getMeetingPageData", {
				categorySlug,
				serviceSlug,
				date: new Date(),
			}),
			"Could not get meeting page data"
		);
	}

	async findUnavailableDurations(date) {
		return await this.call(
			api.post("/data/meeting/findUnavailableDurations", { date }),
			"Could not find unavailable durations"
		);
	}

	async bookMeeting({
		categorySlug,
		serviceSlug,
		startDate,
		templateId,
		bookingMessage,
	}) {
		try {
			return await api.post("/data/meeting/book", {
				categorySlug,
				serviceSlug,
				templateId,
				startDate,
				bookingMessage,
				onError: {
					route: {
						query: `book-meeting=true`,
					},
				},
			});
		} catch (err) {
			throw err;
		}
	}

	async getWorkPageData() {
		return await this.call(
			api.get("/data/getWorkPageData"),
			"Could not get work page data"
		);
	}

	async getWorkConfirmationPageData(workId) {
		return await this.call(
			api.post("/data/getWorkConfirmationPageData", { workId }),
			"Could not get work confirmation page data"
		);
	}

	async getWorkCancelPageData(workId) {
		return await this.call(
			api.post("/data/getWorkCancelPageData", { workId }),
			"Could not get work cancel page data"
		);
	}

	async confirmWork(workId) {
		return await this.call(api.post(`/data/work/confirm/${workId}`));
	}

	async cancelWork(workId) {
		return await this.call(api.post(`/data/work/cancel/${workId}`));
	}

	async getWorkViewComponent(workId) {
		return await this.call(api.get(`/data/work/${workId}`));
	}

	async getWorkEditorPageData(workId, isNew = false) {
		return await this.call(
			api.post("/data/getWorkEditorPageData", { workId, isNew }),
			"Could not get work editor page data"
		);
	}

	async upsertWork(work) {
		return await this.call(api.post("/data/work/upsert", work));
	}

	async getUserPageData() {
		return await this.call(
			api.get("/data/admin/getUserPageData"),
			"Could not get work data"
		);
	}

	async getStatusReports() {
		return await this.call(
			api.get("/data/admin/getVMStatusReport"),
			"Could not get vm status data"
		);
	}

	async downloadVMStatusReport(id) {
		const formData = new FormData();
		formData.append("id", id);

		try {
			let response = await api.post(
				"data/admin/vm/downloadVMStatusReport",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					responseType: "blob",
					timeout: 600000,
				}
			);

			// Download the file if the response is successful
			if (response.status === 200) {
				const url = window.URL.createObjectURL(
					new Blob([response.data])
				);
				const link = document.createElement("a");
				link.href = url;
				const contentDisposition =
					response.headers["content-disposition"];
				let fileName = "downloaded_file.json"; // default file name
				if (contentDisposition) {
					fileName = contentDisposition.split("attachment; ")[1];
				}
				link.setAttribute("download", fileName);
				document.body.appendChild(link);
				link.click();
				link.remove();
			}

			// Get the errors from headers and handle them
			const errors = JSON.parse(response.headers["x-errors"] || "{}");
			if (Object.keys(errors).length > 0) {
				// Handle or display the errors accordingly
				console.error(errors);
			}
		} catch (error) {
			if (
				error &&
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				console.log(error.response.data.message);
			}
			throw new Error("Could not send information");
		}
	}

	async getProfile(userId) {
		let body = {
			onError: {
				route: {
					query: `redirectPath=/profile`,
				},
			},
		};
		if (userId) {
			body.userId = userId;
		}
		return await this.call(
			api.post(`/data/getProfile`, body),
			"Could not get profile"
		);
	}

	async saveProfile(userId, user) {
		return await this.call(api.post("/data/saveProfile", { userId, user }));
	}

	async generateConfirmationPayment({ workId, type, paymentItemId = null }) {
		let body = {
			workId,
			type,
			paymentItemId,
		};
		const result = await this.call(api.post("/data/work/pay", body));
		return result;
	}

	async confirmPaymentIntent(paymentHistoryId) {
		return await this.call(
			api.get(`data/work/pay/confirm?id=${paymentHistoryId}`)
		);
	}

	async loadingMoreSubCardHistory(workId, paymentHistoryIndex) {
		return await this.call(
			api.post(`data/work/sub/paymentHistory`, {
				workId,
				paymentHistoryIndex,
			})
		);
	}

	async addCardToSubscription(workId, cardToken) {
		return await this.call(
			api.post(`data/work/sub/paymentMethod/add`, { workId, cardToken })
		);
	}

	async reseedDB() {
		return await this.call(api.post("/vm/reseedDB"), "Could not reseed");
	}

	async gitPullServer() {
		return await this.call(api.post("/vm/gitPullServer"), "Could not pull");
	}

	async gitPullClient() {
		return await this.call(
			api.post("/vm/gitPullClient", {}, { timeout: 60000 }),
			"Could not pull"
		);
	}

	async resetStats() {
		return await this.call(
			api.post("/data/resetStats"),
			"Could not reset Stats"
		);
	}

	async getWorkTemplates(query) {
		return await this.call(api.post(`data/work/template/find`, query));
	}
	async saveWorkTemplate(data) {
		return await this.call(api.post(`data/work/template/save`, data));
	}
	async getWorkTemplateEditorPageData({ workTemplateId, isNew = false }) {
		return await this.call(
			api.post("/data/getWorkTemplateEditorPageData", {
				workTemplateId,
				isNew,
			}),
			"Could not get work editor page data"
		);
	}
	async getWorkTemplatePageData() {
		return await this.call(
			api.get("/data/getWorkTemplatePageData"),
			"Could not get work template page data"
		);
	}
	async getWorkTemplateComponent(workTemplateId) {
		return await this.call(
			api.post("/data/work/template", { id: workTemplateId }),
			"Could not get work template component"
		);
	}
	async deleteWorkTemplate(id) {
		return await this.call(
			api.delete(`/data/work/template/delete/${id}`),
			"Could not delete template"
		);
	}
	async enrollmentStatus(templateId) {
		return await this.call(
			api.post(`/data/work/class/enroll/status/${templateId}`, {
				onError: {
					route: {
						query: `redirectPath=/work/template/${templateId}`,
					},
				},
			})
		);
	}
	async enrollInClass(templateId) {
		return await this.call(
			api.post(`/data/work/class/enroll/${templateId}`),
			{
				onError: {
					route: {
						query: `enroll=${templateId}`,
					},
				},
			},
			"Could not enroll."
		);
	}
	async useSingleSession(workId) {
		return await this.call(
			api.post(`/data/work/class/use/single-session/${workId}`),
			"Could not use session."
		);
	}
	async deleteCard(workId) {
		return await this.call(
			api.delete(`/data/work/sub/paymentMethod/delete/${workId}`)
		);
	}
	async getAcceptingWorkState() {
		return await this.call(api.get(`/data/admin/acceptingWorkState`));
	}
	async saveAcceptingWorkState(state) {
		return await this.call(
			api.post(`/data/admin/acceptingWorkState/save`, { state })
		);
	}
	async generatePaymentReceipt(workId) {
		return await this.call(api.get(`data/work/receipt/${workId}`));
	}

	async getClassesPageData() {
		return await this.call(
			api.get("/data/getClassesPageData"),
			"Could not get classes page data"
		);
	}

	async joinClass(workId) {
		return await this.call(api.get(`data/classes/join/${workId}`));
	}

	async dropClass(workId) {
		return await this.call(api.post(`data/classes/drop/${workId}`));
	}

	async call(func, customError = null) {
		try {
			const result = await func;
			if (customError) {
				if (result.data.success) {
					return result.data.data;
				} else {
					console.log("Message: ");
					console.log(result.data.message);
					throw new Error(customError);
				}
			} else {
				if (!result?.data?.success)
					throw new Error(result?.data?.message ?? "Unknown");
			}

			return result.data.data;
		} catch (err) {
			throw err;
		}
	}
}

export default new DataService();
