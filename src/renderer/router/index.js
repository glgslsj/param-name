import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'paramMain',
			component: require('@/components/paramMain').default,
		},
		{
			path: '/commandKit',
			name: 'commandKit',
			component: require('@/components/commandKit').default,
		},
		{
			path: '/moveKit',
			name: 'moveKit',
			component: require('@/components/moveKitPage').default,
		},
		{
			path: '/tomato',
			name: 'tomato',
			component: require('@/components/tomatoPage').default,
		},
	],
})
