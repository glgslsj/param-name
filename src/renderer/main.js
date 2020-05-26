/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import VueApollo from 'vue-apollo'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { createHttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'


import App from './App'
import router from './router'
import store from './store'

Vue.use(VueApollo)
Vue.use(Antd)

const httpLink = createHttpLink({
  uri: 'http://112.126.102.214:8080/v1/graphql',
  headers: {
    'x-hasura-admin-secret': '333'
  }
})
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  apolloProvider,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
