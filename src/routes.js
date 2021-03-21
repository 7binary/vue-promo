import Vue from 'vue';
import Router from 'vue-router';
/* AUTH */
import Index from './pages/auth/index/Index.vue';
import Login from './pages/auth/login/Login.vue';
import LoginExternal from './pages/auth/loginExternal/LoginExternal.vue';
import Register from './pages/auth/register/Register.vue';
import RemindPassword from './pages/auth/remindPassword/RemindPassword.vue';
/* PRIZES */
import Orders from './pages/prizes/orders/Orders.vue';
import Prizes from './pages/prizes/prizes/Prizes.vue';
import EpsCard from './pages/prizes/epsCard/EpsCard.vue';
/* PROFILE */
import Dashboard from './pages/profile/dashboard/Dashboard.vue';
import ProfilePassport from './pages/profile/profilePassport/ProfilePassport.vue';
import ProfileEdit from './pages/profile/profileEdit/ProfileEdit.vue';
import ProfilePurse from './pages/profile/profilePurse/ProfilePurse.vue';
import ProfileBonuses from './pages/profile/profileBonuses/ProfileBonuses.vue';
/* COURSES */
import Courses from './pages/courses/courses/Courses.vue';
import Course from './pages/courses/course/Course.vue';
import Test from './pages/courses/test/Test.vue';
import Results from './pages/courses/result/Results.vue';
/* SALES */
import Sales from './pages/sales/sales/Sales.vue';
import AddSale from './pages/sales/addSale/AddSale.vue';
/* NEWS & INSTRUCTIONS */
import News from './pages/news/news/News.vue';
import Publication from './pages/news/publication/Publication.vue';
import Instructions from './pages/news/instructions/Instructions.vue';
import Instruction from './pages/news/instruction/Instruction.vue';
/* TICKETS */
import Tickets from './pages/tickets/tickets/Tickets.vue';
/* NOTIFICATIONS */
import MobileNotifications from './pages/mobileNotifications/MobileNotifications.vue';
/* COMMON */
import Feedback from './pages/feedback/Feedback.vue';
import NotFound from './pages/NotFound.vue';
import Reset from './pages/Reset.vue';
/* SHOP */
import Shop from './pages/shop/products/Products.vue';
import ShopProduct from './pages/shop/product/Product.vue';
/* CART */
import Cart from './pages/cart/Cart.vue';
import Actions from './pages/sales/actions/Actions.vue';

Vue.use(Router);

const routes = [
  { name: '', path: '/', component: Index, meta: { requiresGuest: true } },
  { name: 'login', path: '/login', component: Login, meta: { requiresGuest: true } },
  { name: 'login-external', path: '/login-external/:id/:token', component: LoginExternal, props: true, meta: { requiresGuest: true } },
  { name: 'register', path: '/register/:usertype', component: Register, props: true, meta: { requiresGuest: true } },
  { name: 'remind', path: '/remind', component: RemindPassword, meta: { requiresGuest: true } },
  { name: 'orders', path: '/orders', component: Orders, meta: { requiresAuth: true, approved: true } },
  { name: 'prizes', path: '/prizes', component: Prizes, meta: { requiresAuth: true, approved: true } },
  { name: 'eps', path: '/eps/:type', component: EpsCard, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'dashboard', path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { name: 'passport', path: '/passport', component: ProfilePassport, meta: { requiresAuth: true, approved: true } },
  { name: 'profile', path: '/profile', component: ProfileEdit, meta: { requiresAuth: true, approved: true } },
  { name: 'purse', path: '/purse', component: ProfilePurse, meta: { requiresAuth: true, approved: true } },
  { name: 'bonuses', path: '/bonuses', component: ProfileBonuses, meta: { requiresAuth: true, approved: true } },
  { name: 'courses', path: '/courses', component: Courses, meta: { requiresAuth: true, approved: true } },
  { name: 'course', path: '/course/:id', component: Course, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'test', path: '/test/:id', component: Test, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'results', path: '/results/:id', component: Results, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'news', path: '/news', component: News, meta: { requiresAuth: true, approved: true } },
  { name: 'publication', path: '/publication/:id', component: Publication, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'instructions', path: '/instructions', component: Instructions, meta: { requiresAuth: true, approved: true } },
  { name: 'instruction', path: '/instruction/:id', component: Instruction, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'cart', path: '/cart', component: Cart, meta: { requiresAuth: true, approved: true } },
  { name: 'shop', path: '/shop', component: Shop, meta: { requiresAuth: true, approved: true } },
  { name: 'shop-product', path: '/shop-product/:id', component: ShopProduct, props: true, meta: { requiresAuth: true, approved: true } },
  { name: 'notifications', path: '/notifications', component: MobileNotifications, meta: { requiresAuth: true, approved: true } },
  { name: 'tickets', path: '/tickets/', component: Tickets, meta: { requiresAuth: true } },
  { path: '/sales', component: Sales, meta: { requiresAuth: true } },
  { path: '/sale/:action_id/:id', component: AddSale, props: true, meta: { requiresAuth: true } },
  { path: '/actions', component: Actions, meta: { requiresAuth: true, requiresChecked: true } },
  { name: 'reset', path: '/reset', component: Reset },
  { name: 'feedback', path: '/feedback', component: Feedback },
  { name: '', path: '*', component: NotFound },
];

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  Vue.notify({ group: 'error', clean: true });
  const { requiresGuest, requiresAuth, approved } = to.meta;
  let isAuthenticated = false;
  let isBlocked = true;
  const storage = localStorage.getItem('promo');

  if (storage !== null) {
    const { token, user } = JSON.parse(storage);
    if (token !== undefined && token !== null) {
      isAuthenticated = true;
    }
    if (isAuthenticated && user && user.blocked_at === null) {
      isBlocked = false;
    }
  }

  if (requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }

  if (isAuthenticated && isBlocked && approved) {
    next('/dashboard');
  } else {
    next();
  }

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
