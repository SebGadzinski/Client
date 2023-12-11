// Ensure a layout is given in tabRoutes object

const layout = {
  path: '/',
  component: () => import('layouts/main/HeaderLayout.vue'),
  children: [
    { path: '', redirect: '/home' },
    { path: 'home', component: () => import('pages/HomePage.vue') },
    { name: 'category', path: ':category', component: () => import('pages/CategoryPage.vue') },
    { name: 'service', path: ':category/:service', component: () => import('pages/ServicePage.vue') },
    { path: 'confirmation/:workId', component: () => import('pages/ConfirmationPage.vue'), },
    { path: 'meeting', component: () => import('pages/MeetingPage.vue') },
    { path: 'profile', component: () => import('pages/ProfilePage.vue'), },
    { path: 'profile/user/:userId', component: () => import('pages/ProfilePage.vue'), },
    { path: 'work', component: () => import('pages/work/WorkIndexPage.vue'), },
    { path: 'work/user/:userId', component: () => import('pages/work/WorkIndexPage.vue'), },
    { path: 'work/item/:workId', component: () => import('pages/work/WorkPage.vue'), },
    { path: 'work/create', component: () => import('pages/work/WorkEditorPage.vue'), },
    { path: 'work/edit/:workId', component: () => import('pages/work/WorkEditorPage.vue'), },
    { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    {
      path: ':catchAll(.*)*',
      component: () => import('pages/Error404.vue')
    }
  ]
};

const routes = [
  layout,
  {
    path: '/auth',
    component: () => import('layouts/auth/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      { path: 'login', component: () => import('pages/auth/LoginPage.vue'), meta: { title: 'Login' }},
      { path: 'signUp', component: () => import('pages/auth/SignUpPage.vue'), meta: { title: 'Sign Up' } },
      { path: 'forgotPassword', component: () => import('pages/auth/ForgotPasswordPage.vue'), meta: { title: 'Forgot Password' } },
      { path: 'resetPassword', component: () => import('pages/auth/ResetPasswordPage.vue'), meta: { title: 'Reset Password' } },
      { path: 'confirmation', component: () => import('pages/auth/EmailConfirmationPage.vue'), meta: { title: 'Confirm Email' } },
      {
        path: ':catchAll(.*)*',
        component: () => import('pages/Error404.vue')
      }
    ]
  },

  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
