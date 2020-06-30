<template>
	<div>
		<div style="font-size: medium;font-weight: bold">
			<span>变量名工具</span>
			<a style="float: right" @click="switchKit">切换命令行工具</a>
		</div>
		<div>
			<a-row type="flex" justify="center">
				<a-col :span="12" style="padding: 10px">
					<a-input v-model="searchContent" style="margin-bottom: 5px"></a-input>
					<a-button @click="addParams" style="margin: auto;display: block">新增搜索名称</a-button>
				</a-col>
				<a-col :span="12" style="padding: 10px">
					<a-input v-model="setparamEn" style="margin-bottom: 5px"></a-input>
					<a-button @click="addParamConnet" style="margin: auto;display: block">新增搜索连接</a-button>
				</a-col>
			</a-row>
		</div>

		<a-list style="background-color: white" item-layout="horizontal" :dataSource="propsConnectsNow">
			<a-list-item slot="renderItem" slot-scope="item">
				<a-list-item-meta>
					<div class="m-l-10 font-16" slot="title">{{item.propsEn.props}}</div>
				</a-list-item-meta>
				<a slot="actions" @click="cutEn(item)">复制</a>
			</a-list-item>
		</a-list>

		<a-list style="background-color: white" item-layout="horizontal" :dataSource="transItems">
			<a-list-item slot="renderItem" slot-scope="item">
				<a-list-item-meta>
					<div class="m-l-10 font-16" slot="title">{{item.title}}   {{item.content}}</div>
				</a-list-item-meta>
				<a slot="actions" @click="copy(item.content)">复制</a>
			</a-list-item>
		</a-list>

		<div style="font-size: medium;font-weight: bold">最近用的三个变量</div>
		<a-list style="background-color: white" item-layout="horizontal" :dataSource="propsConnectsRecent">
			<a-list-item slot="renderItem" slot-scope="item">
				<a-list-item-meta>
					<div class="m-l-10 font-16" slot="title">变量意思：{{item.prop.content}}；   变量名：{{item.propsEn.props}}</div>
				</a-list-item-meta>
				<a slot="actions" @click="cutEnRecent(item)">复制变量名</a>
			</a-list-item>
		</a-list>
	</div>
</template>

<script>
    const {clipboard} = require('electron')
    import axios from 'axios'
    import gql from 'graphql-tag'
    export default {
      name: 'paramMain',
      data () {
        return {
          searchContent: '',// 绑定的是第一input
          setparamEn: '',// 绑定的是第二input
					googleTransRes:'等待查询',
					youdaoTransRes:'等待查询',
					transItems:[
					{
					    title:'google翻译',
							content:'等待查询'
					},
					{
					    title:'有道翻译',
							content:'等待查询'
					}
					],
            enProps:''
        }
      },
      apollo: {
          newProps:{
              query:
                  gql`query ($content:String!){
																 propskit_props(where: {content: {_eq: $content}}) {
										id
										created_at
										content
									}
								}`,
              variables () {
                  return {
                      content:this.searchContent
                  }
              },
              update (data) {
                  // 返回的值将更新 vue 属性 'allTodos'
                  return data.propskit_props
              }
					},
				propsConnectsRecent: {
						// 最近的三次连接
				query:
									gql`query {
								 propskit_propsConnect(limit:3,order_by: {referTimes: asc}) {
						 referTimes
				created_at
				id
				propsEn {
					props
					id
				}
				prop {
					content
					id
				}
			}
		}`,
				update (data) {
					// 返回的值将更新 vue 属性 'allTodos'
					return data.propskit_propsConnect
				}
			},
          newPropsConnect: {
              // 是否存在旧连接
              query:
									gql`query ($propsEnId: uuid!, $propsId: uuid!){
														 propskit_propsConnect(where:{propsId:{_eq:$propsId},propsEnId:{_eq:$propsEnId}}) {
												 referTimes
										created_at
										id
										propsEn {
											props
											id
										}
										prop {
											content
											id
										}
									}
								}`,
              variables () {
                  return {
                      propsId:this.getparam[0].id ,
                      propsEnId:this.getparamEn[0].id
                  }
              },
              update (data) {
                  // 返回的值将更新 vue 属性 'allTodos'
                  return data.propskit_propsConnect
              },
							skip() {
                  let bool1 = this.getparam&&this.getparam.hasOwnProperty(length)&&this.getparam.length>0
									 let bool2 = this.getparamEn&&this.getparamEn.hasOwnProperty(length)&&this.getparamEn.length>0
									 let flag = bool1&&bool2
									 return !flag
              }
          },
				propsConnectsNow: {
						// 这次的连接，根据input内输入的来
						query:
							gql`query($content:String!) {
															propskit_propsConnect(limit:6 ,order_by: {referTimes: asc}, where: {prop: {content: {_like: $content}, _or: {content: {_similar: $content}}}}) {
								referTimes
								created_at
								propsEn {
									props
									id
									propsConnects{
										id
										propsId
									}
								}
								prop {
									content
									id
								}
							}
						}`,
						variables () {
								return {
                    content:this.getparam.length===0?'':this.getparam[0].content
								}
						},
						update (data) {
								return data.propskit_propsConnect
						},
						skip () {
								if (!this.getparam) return true
								if (this.getparam.length===0) return true
						},
				},
        getNewParamEn: {
              // 查是否存在这个英语，新
          query:
						gql`query ($props:String!) {
						 propskit_propsEn(where: {props: {_eq:$props}}) {
						 	propsConnects{
								id
								propsId
							}
							props
							id
						}
					}`,
					variables () {
							return {
                  props:this.enProps
							}
					},
          update (data) {
            return data.propskit_propsEn
          }
        },
          getparamEn: {
              // 查是否存在这个英语
              query:
                  gql`query ($props:String!) {
						 propskit_propsEn(where: {props: {_eq:$props}}) {
							props
							id
						}
					}`,
              variables () {
                  return {
                      props:this.setparamEn
                  }
              },
              update (data) {
                  // 返回的值将更新 vue 属性 'allTodos'
                  return data.propskit_propsEn
              }
          },
          getparam: {
              //看看是否存在这个变量名
							query:
																		gql`query($content:String){
							propskit_props(where: {content: {_eq: $content}}) {
								id
								content
							}
						}`,
						variables () {
								return {
										content:this.searchContent
								}
						},
						update (data) {
								return data.propskit_props
						}
				},
      },
		watch: {
        searchContent: async function (val) {
            if (val === '') {
                this.transItems[0].content = '等待查询'
                this.transItems[1].content = '等待查询'
								return
            }
            let text = this.searchContent
            let uri1 = 'http://translate.google.cn/translate_a/single'
            let params1 = {
                client: 'gtx',
                dt: 't',
                dj: 1,
                sl: 'zh-CN',
                tl: 'en',
                text: text
            }
            let url1 = this.parseParams(uri1, params1)
            let data1 = await axios.post('http://112.126.102.214:8808/api/curl', {
                url: url1,
            })
						this.transItems[0].content = data1.data.data.sentences[0].trans
            let uri2 = 'http://fanyi.youdao.com/translate'
            let params2 = {
                doctype: 'json',
                type: 'ZH_CN2EN',
                i: text
            }
            let url2 = this.parseParams(uri2, params2)
            let data2 = await axios.post('http://112.126.102.214:8808/api/curl', {
                url: url2,
            })
            this.transItems[1].content = data2.data.data.translateResult[0][0].tgt
        }
		},
  methods: {
      switchKit: function () {
          this.$router.push('/commandKit')
      },
				min: function () {
						let ipc = require('electron').ipcRenderer
						ipc.send('window-min')
				},
      sleep (time) {
          return new Promise(resolve => {
              setTimeout(() => {
                  resolve()
              }, time)
          })
      },
      parseParams  (uri, params) {
          // 拼接url字符串
          const paramsArray = []
          Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`))
          if (uri.search(/\?/) === -1) {
              uri += `?${paramsArray.join('&')}`
          } else {
              uri += `&${paramsArray.join('&')}`
          }
          return uri
      },
    async addParams () {
						if (this.getparam.length===1) {
								this.$message.success('已有变量，不用新增')
								return
						}
          let data = await this.$apollo.mutate({
            mutation: gql`mutation($content:String!){
								insert_propskit_props(objects: {content: $content}) {
									returning {
										content
										id
										created_at
									}
								}
							}`,
            variables: {
              content: this.searchContent
            }
          }).catch((error) => {
            this.$message.error('出错了，请重试')
          })
          if (data) {
						this.$message.success('成功')
						this.min()
          }
        },
			putNewprops: async function () {
          // 新建一个prop
          let res = await this.$apollo.mutate({
              mutation: gql`mutation($content: String!) {
											insert_propskit_props(objects: {content: $content}) {
												returning {
													created_at
													id
												}
											}
										}`,
              variables: {
                  content: this.searchContent
              }
          }).catch((error) => {
              // 错误
              console.log(error)
          })
					return Promise.resolve(res)
      },
			putNewpropEn: async function () {
          let res = await this.$apollo.mutate({
              mutation: gql`mutation($props: String!) {
												insert_propskit_propsEn(objects: {props: $props}) {
													returning {
														id
														created_at
													}
												}
											}`,
              variables: {
                  props: this.setparamEn
              }
          }).catch((error) => {
              // 错误
              console.log(error)
          })
          return res
      },
			putNewconnect: async function (propsId,propsEnId) {
          let data = await this.$apollo.mutate({
              mutation: gql`mutation($propsEnId: uuid!, $propsId: uuid!) {
												insert_propskit_propsConnect(objects: {propsEnId: $propsEnId, propsId: $propsId}) {
													returning {
														id
														created_at
													}
												}
											}`,
              variables: {
                  propsId: propsId,
                  propsEnId: propsEnId
              }
          }).catch((error) => {
              // 错误
              console.log(error)
          })
					return data
      },
			ConnectAndone: async function (id) {
          let data = await this.$apollo.mutate({
              mutation: gql`mutation($id: uuid!) {
												update_propskit_propsConnect(where: {id: {_eq: $id}}, _inc: {referTimes: 1}) {
													returning {
														id
														referTimes
														updated_at
													}
												}
											}`,
              variables: {
                  id: id
              }
          }).catch((error) => {
              // 错误
              console.log(error)
          })
					return data
      },
        async addParamConnet () {
						let propsId = ''
						let propsEnId = ''
						let data
						let hasconnet = null
						let createFlag = this.getparam.length >0&&this.getparamEn.length>0
						if (this.getparam.length === 0) {
						    // 新建一个prop
                let res = await this.putNewprops()
                propsId = res.data.insert_propskit_props.returning[0].id
            }else {
                propsId=this.getparam[0].id
						}
						if (this.getparamEn.length === 0) {
						    // 新建一个propen
                let res1 = await this.putNewpropEn()
									propsEnId = res1.data.insert_propskit_propsEn.returning[0].id
            }else {
                propsEnId=this.getparamEn[0].id
								if (createFlag) {
                    let connects = this.getparamEn[0].propsConnects
										if(connects){
                        hasconnet = connects.find( function (i) {
                            return i.propsId === this.getparam[0].id
                        },this)
										}
								}
						}
            await this.$apollo.queries.getparam.refetch()
            await this.$apollo.queries.getparamEn.refetch()
						// 结束判断使用的判断skip是否为false
						if (createFlag && hasconnet) {
                // 给connect新增1
                data = await this.ConnectAndone(hasConnect.id)
						}
						else{
								// 新增一个connect
                data = await this.putNewconnect(propsId,propsEnId)
						}
          if (data) {
              this.$message.success('复制成功')
							clipboard.writeText(this.setparamEn)
							this.min()
          }

        },
        cutEn: async function (i) {
            // i.propsEn.id	这次英语肯定存在，先看有没有中文，然后再看有没有连接，然后再新建或者加次数
						let data
						this.setparamEn = i.propsEn.props
            await this.$apollo.queries.getparamEn.refetch()
            if (this.newProps.length === 0) {
                await this.putNewprops()
                await this.$apollo.queries.getparam.refetch()
                data = await this.putNewconnect(this.getparam[0].id,i.propsEn.id)
            }else if (this.newPropsConnect.length >0) {
                // 存在连接
                data = await this.ConnectAndone(this.newPropsConnect[0].id)
						} else {
                // 不存在连接
                data = await this.putNewconnect(this.getparam[0].id,i.propsEn.id)
						}
            if (data) {
                clipboard.writeText(this.setparamEn)
                this.$message.success('复制成功')
                this.min()
            }
        },
				cutEnRecent: async function (i) {
            let data = await this.ConnectAndone(i.id)
						if (data){
                clipboard.writeText(i.propsEn.props)
                this.$message.success('复制成功')
                this.min()
						}
        },
				copy: async function (param) {
            // 先看汉语和英语是否存在，然后新建，最后看看连接存不存在，新建
						if (param ==='等待查询'){
						    return
						}
            this.setparamEn = param
            await this.$apollo.queries.getparamEn.refetch()
            await this.addParamConnet()
            this.min()
        }
      }
    }
</script>

<style scoped>

</style>
