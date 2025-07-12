import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Framework from '@/views/Framework.vue'
import Order from '@/views/Order.vue'
import Nursing from '@/views/Nursing.vue'
import Mine from '@/views/Mine.vue'
import Home from '@/views/Home.vue'
import Record from '@/views/Record.vue'
import OrderHistory from "@/views/OrderHistory.vue";
import Agent from  '@/views/Agent.vue'
const routes = [
	// {
	//   path: '/',
	//   name: 'home',
	//   component: HomeView
	// },
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/Framework',
		name: 'Framework',
		component: Framework,
		children:[
			{
				path: '/Framework/Home',
				name: 'Home',
				component: Home
			},
			{
				path: '/Framework/Order',
				name: 'Order',
				component: Order
			},
			{
				path: '/Framework/Nursing',
				name: 'Nursing',
				component: Nursing,
			},
			{
				path: '/Framework/Record',
				name: 'Record',
				component: Record
			},
			{
				path: '/Framework/Mine',
				name: 'Mine',
				component: Mine
			},
			{
				path: '/Framework/OrderHistory',
				name: 'OrderHistory',
				component: OrderHistory
			},
			{
				path: '/Framework/Agent',
				name: 'Agent',
				component: Agent
			}
		]
	},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
