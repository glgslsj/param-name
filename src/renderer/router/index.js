import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'paramMain',
      component: require('@/components/paramMain').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
