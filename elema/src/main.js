// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import goods from './components/goods/goods';
import seller from './components/seller/seller';
import ratings from './components/ratings/ratings';

import './common/sass/index.scss';

// 安装路由模块
Vue.use(VueRouter);

// 全局注册
Vue.use(VueResource);

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// });

// 定义路由组件
// const egoods = {template: goods};
// const eseller = {template: seller};
// const eratings = {template: ratings};
// const goods = { template: '<div>aaaa</div>' };
// const seller = { template: '<div>ssss</div>' };
// const ratings = { template: '<div>ratings</div>' };
// 定义路由
const routes = [
  // { path: '/', component: seller },
  { path: '/goods', component: goods },
  { path: '/seller', component: seller },
  { path: '/ratings', component: ratings }
]
// 创建router实例，然后传routes配置
const router = new VueRouter({
  routes,
  linkActiveClass:'active'
});
// 创建和挂载根实例
// const app = new Vue({
//   router
// }).$mount('#app');
new Vue({
  el:'#app',
  router,
  render:h => h(App),
  data: {
    eventHub : new Vue()
  }
});