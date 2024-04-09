// Ensure a layout is given in tabRoutes object
import _ from "lodash";

const mainLayouts = {
	header: "HeaderLayout",
	drawer: "DrawerLayout",
	tab: "TabLayout",
};

const meta = { title: "Gadzy Works", favicon: "/favicon.ico" };
const layout = {
	path: "/",
	component: () => import(`layouts/main/${mainLayouts.header}.vue`),
	meta,
	children: [
		{ path: "", redirect: "/home" },
		{ path: "home", component: () => import("pages/HomePage.vue"), meta },
		{ path: "profile", component: () => import("pages/ProfilePage.vue") },
		{
			path: "profile/user/:userId",
			component: () => import("pages/ProfilePage.vue"),
		},
		{
			path: "work",
			component: () => import("pages/work/WorkIndexPage.vue"),
		},
		{
			path: "work/create",
			component: () => import("pages/work/WorkEditorPage.vue"),
		},
		{
			path: "work/:workId",
			component: () => import("pages/work/WorkPage.vue"),
		},
		{
			path: "work/template/",
			component: () =>
				import("pages/work/template/WorkTemplateIndexPage.vue"),
		},
		{
			path: "work/template/:workTemplateId",
			component: () => import("pages/work/template/WorkTemplatePage.vue"),
		},
		{
			path: "work/template/edit",
			component: () =>
				import("pages/work/template/WorkTemplateEditorPage.vue"),
		},
		{
			path: "work/template/edit/:workTemplateId",
			component: () =>
				import("pages/work/template/WorkTemplateEditorPage.vue"),
		},
		{
			path: "work/user/:email",
			component: () => import("pages/work/WorkIndexPage.vue"),
		},
		{
			path: "work/edit/:workId",
			component: () => import("pages/work/WorkEditorPage.vue"),
		},
		{
			path: "work/edit",
			component: () => import("pages/work/WorkEditorPage.vue"),
		},
		{
			path: "work/cancel/:workId",
			component: () => import("pages/work/WorkCancelPage.vue"),
		},
		{
			path: "work/confirmation/:workId",
			component: () => import("pages/work/WorkConfirmationPage.vue"),
		},
		{
			path: "work/pay/confirm/:paymentHistoryId",
			component: () => import("pages/work/WorkPaymentPage.vue"),
		},
		{
			path: "classes",
			component: () => import("pages/classes/ClassesIndexPage.vue"),
		},
		{ path: "settings", component: () => import("pages/SettingsPage.vue") },
		{
			path: "admin/users",
			component: () => import("pages/admin/UsersPage.vue"),
		},
		{
			path: "admin/vmStatusReport",
			component: () => import("pages/admin/VMStatusReportPage.vue"),
		},
		{
			path: "admin/work-status",
			component: () => import("pages/admin/WorkStatusPage.vue"),
		},
		{
			path: "ipblocked",
			component: () => import("pages/IPBlocked499.vue"),
		},
		{
			name: "category",
			path: ":category",
			component: () => import("pages/CategoryPage.vue"),
		},
		{
			name: "service",
			path: ":category/:service",
			component: () => import("pages/ServicePage.vue"),
		},
		{
			path: ":category/:service/meeting",
			component: () => import("pages/MeetingPage.vue"),
		},
		{
			path: ":catchAll(.*)*",
			component: () => import("pages/Error404.vue"),
		},
	],
};

const routes = [
	layout,
	{
		path: "/auth",
		component: () => import("layouts/auth/AuthLayout.vue"),
		meta,
		children: [
			{ path: "", redirect: "/auth/login" },
			{
				path: "login",
				component: () => import("pages/auth/LoginPage.vue"),
				meta: { title: "Login" },
			},
			{
				path: "signUp",
				component: () => import("pages/auth/SignUpPage.vue"),
				meta: { title: "Sign Up" },
			},
			{
				path: "forgotPassword",
				component: () => import("pages/auth/ForgotPasswordPage.vue"),
				meta: { title: "Forgot Password" },
			},
			{
				path: "resetPassword",
				component: () => import("pages/auth/ResetPasswordPage.vue"),
				meta: { title: "Reset Password" },
			},
			{
				path: "confirmation",
				component: () => import("pages/auth/EmailConfirmationPage.vue"),
				meta: { title: "Confirm Email" },
			},
			{
				path: "check-confirm/email",
				component: () =>
					import("pages/auth/CheckEmailConfirmationPage.vue"),
				meta: { title: "Confirmation" },
			},
			{
				path: ":catchAll(.*)*",
				component: () => import("pages/Error404.vue"),
			},
		],
	},
	{
		path: "/work/receipt/:workId",
		meta: { title: "Print" },
		component: () => import("pages/work/WorkReceiptPage.vue"),
	},
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/Error404.vue"),
	},
];

// do a binary search on the route object and for each possible object
// update it to contain the meta object if
export default routes;
