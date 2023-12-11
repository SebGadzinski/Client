import { FCM } from "@capacitor-community/fcm";

import { PushNotifications } from "@capacitor/push-notifications";
import DataService from "./data.service";
import { i18n } from "../boot/i18n";
import { Notify as qNotifiy } from 'quasar';

const Notify = {
	/**
	 * Registers notification settings.
	 *
	 * @param {Object} options - The settings for notifications.
	 * @param {boolean} options.notificationsEnabled - Indicates whether notifications are enabled.
	 * @param {boolean} options.notificationsAllStores - Indicates whether notifications are enabled for all stores.
	 * @param {string[]} options.notificationsStoreList - A list of store identifiers for which notifications are enabled.
	 * @returns {void} - This function does not return anything.
	 */
	register({
		notificationsEnabled
	}) {
		return new Promise((resolve, reject) => {
			try {
				if (!notificationsEnabled)
					return reject("Not Enabled"), Notify.unregister();

				PushNotifications.removeAllListeners();

				// On success, we should be able to receive notifications
				PushNotifications.addListener("registration", (token) => {
					localStorage.setItem(
						"firebaseToken",
						JSON.stringify(token)
					);
					//alert(`Registration Success: ${JSON.stringify(token)}`)
					DataService.updateNotificationSubscription({
						token: token.value,
						enable: true,
					})
						.then((result) => {
							console.log(
								`Register Token to server success: ${JSON.stringify(
									result
								)}`
							);
							//alert(`Register Token to server success: ${JSON.stringify(result)}`)

							return resolve(result);
						})
						.catch((err) => {
							console.error(`Registration Error Caught: ${err}`);
							// alert(
							// 	i18n.global.t("Registration Error Caught: {error}", {
							// 		error: JSON.stringify(err),
							// 	})
							// );
							return reject(err);
						});
				});

				// Some issue with our setup and push will not work
				PushNotifications.addListener("registrationError", (error) => {
					console.error(`Registration Error ${error}`);
					//alert(`Registration Error: ${error.error}`)
					return reject(error.error);
				});

				PushNotifications.requestPermissions().then((result) => {
					if (result.receive === "granted") {
						// Register with Apple / Google to receive push via APNS/FCM
						console.log("PUSH NOTIFICATION PERMISSIONS GRANTED");
						//alert('Permissions Allowed')
						PushNotifications.register();
					} else {
						// Show some error
						alert(
							i18n.global.t("errorRequestingPushNotifications", {
								error: JSON.stringify(result),
							})
						);
					}
				});
			} catch (err) {
				alert(i18n.global.t("alertError", { error: err.toString() }));
				reject(err);
			}
		});
	},
	/**
	 * Unregisters all push notifications
	 * @returns
	 */
	unregister() {
		return new Promise((resolve, reject) => {
			try {
				PushNotifications.removeAllListeners();
			} catch (err) {
				reject(err);
			}
		});
	},
	/**
	 * Adds push notification listeners to router
	 * @param {Router} router
	 */
	addListeners(router) {
		console.log(JSON.stringify(location));
		Notify.PushNotifications.removeAllListeners();
		Notify.PushNotifications.addListener(
			"pushNotificationReceived",
			(notification) => {
				console.log(JSON.stringify(notification));
				qNotifiy.create({
					progress: true,
					message: "Cannot parse notification",
					color: "accent",
					position: 'center',
					avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
					actions: [
						{ label: 'Go', color: 'secondary', handler: () => {
							router.push({
								name: "notification",
								params: {
									notification: JSON.stringify(notification),
									openedFrom: "inApp",
								},
							});
						 } }
					  ]
				});
			}
		);

		Notify.PushNotifications.addListener(
			"pushNotificationActionPerformed",
			async (event) => {
				console.log(event);
				let { actionId, notification } = event;
				router.push({
					name: "notification",
					params: {
						notification: JSON.stringify(notification),
						openedFrom: "notificationClick",
					},
				});
			}
		);
	},
	PushNotifications,
};

export default Notify;
