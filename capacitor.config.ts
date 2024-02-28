import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.workwebsite.app",
	appName: "vuequasarapp",
	webDir: "www",
	bundledWebRuntime: false,
	plugins: {
		PushNotifications: {
			presentationOptions: ["badge", "sound", "alert"],
		},
		CapacitorUpdater: {
			autoUpdate: false,
		},
	},
};

export default config;
