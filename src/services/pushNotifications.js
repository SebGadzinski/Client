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

				let notifyData = {
					message: notification.body,
				};

				if(notification?.data?.jsonData){
					const data = JSON.parse(notification?.data?.jsonData);
					if(data?.to){
						notifyData.actions = [ {
							label: data.to.label,
							color: data.to.color,
							handler: () => {
								router.push(data.to.route);
							}
						} ];
					}

					if(data?.dotdotdot){
						notifyData= {
							...notifyData,
							...data.dotdotdot
						}
					}
				}


				qNotifiy.create(notifyData);
			}
		);

		Notify.PushNotifications.addListener(
			"pushNotificationActionPerformed",
			async (event) => {
				console.log(event);
				let { actionId, notification } = event;
				if(notification?.data?.jsonData){
					const data = JSON.parse(notification.data.jsonData);
					// Route should contain all the info you need to go to a route
					router.push(data.to.route);
				}
			}
		);
	},
	PushNotifications,
};

export default Notify;
