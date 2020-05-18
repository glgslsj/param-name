<template>
	<div>
		<div style="font-size: medium;font-weight: bold">变量名工具</div>
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

		<a-list style="background-color: white" item-layout="horizontal" :dataSource="getparamEn">
			<a-list-item slot="renderItem" slot-scope="item">
				<a-list-item-meta>
					<div class="m-l-10 font-16" slot="title">{{item.props}}</div>
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
				<a slot="actions" @click="cutEn(item)">复制变量名</a>
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
          searchContent: '',
          setparamEn: '',
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
				propsConnectsRecent: {
						// 最近的三次连接
				query:
									gql`query {
								 propskit_propsConnect(order_by: {referTimes: asc}) {
						 referTimes
				created_at
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
				propsConnectsNow: {
						// 这次的连接
						query:
															gql`query($content:String!) {
																							propskit_propsConnect(where: {prop: {content: {_like: $content}, _or: {content: {_similar: $content}}}}) {
								referTimes
								created_at
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
        getparamEn: {
              // 给一个arr查6个英语
          query:
						gql`query ($props:String!) {
						 propskit_propsEn(where: {props: {_eq:$props}}) {
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
          hh: function () {
              console.log(this.getparam)
              console.log(this.propsConnectsNow)
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
      copy: function (param) {
          clipboard.writeText(param)
      },
    async addParams () {
							    // todo:开始搜索，如果数据库够5个就显示。不够的话就展示翻译
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
            console.log(data)
          }
        },
        async addParamConnet () {
							    // todo:增加paramEn并增加一个connect
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
              content: this.searchContent
            }
          }).catch((error) => {
            // 错误
            console.log(error)
          })
          if (data) {
            this.$message.success('成功')
          }
        },
        cutEn: function () {
          // todo: 复制变量英语并增加一次数据
        }
      },
			mounted: function () {
			},
    }
</script>

<style scoped>

</style>
