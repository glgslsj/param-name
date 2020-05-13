<template>
	<div>
		<div>变量名工具</div>
		<a-input v-model="searchContent"></a-input>
		<a-input v-model="setparamEn"></a-input>
		<a-button @click="addParams">新增搜索名称</a-button>
		<a-button @click="addParamConnet">新增搜索连接</a-button>
		<a-list style="background-color: white" item-layout="horizontal" :dataSource="getparamEn">
			<a-list-item slot="renderItem" slot-scope="item">
				<a-list-item-meta>
					<div class="m-l-10 font-16" slot="title">{{item.title}}</div>
				</a-list-item-meta>
				<a slot="actions" @click="cutEn(item)">复制</a>
			</a-list-item>
		</a-list>
		<div v-for="(item,index) in articles" :key="index">
			{{item.title}}
		</div>
	</div>
</template>

<script>
    import gql from 'graphql-tag'
    export default {
        name: "paramMain",
        data() {
            return {
                rencent3Words: [
										{},
										{},
										{}
								],
								searchContent:"",
								setparamEn:''
            }
        },
        apollo: {
            articles: {
                query:
                    gql`query {
               article(order_by: {created_at: asc}) {
          owner
          created_at
          content
          title
          readTimes
          updated_at
          id
        }
      }`,

                update(data) {
                    // 返回的值将更新 vue 属性 'allTodos'
                    return data.article
                },
                result({data, loading, networkStatus}) {
                    // console.log(data)
                },
                // 错误处理
                error(error) {
                    console.error('We\'ve got an error!', error)
                }
            },
            getparamEn: {
                query:
                    gql`query {
               article(order_by: {created_at: asc}) {
          owner
          created_at
          content
          title
          readTimes
          updated_at
          id
        }
      }`,

                update(data) {
                    // 返回的值将更新 vue 属性 'allTodos'
                    return data.article
                },
                result({data, loading, networkStatus}) {
                    // console.log(data)
                },
                // 错误处理
                error(error) {
                    console.error('We\'ve got an error!', error)
                }
            },
        },
				methods:{
							async addParams() {
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
									if (data){
                      console.log(data)
									}
              },
            async addParamConnet() {
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
                if (data){
                    this.$message.success('成功')
								}
            },
            cutEn: function () {
                // todo: 复制变量英语并增加一次数据
            },

        }
    }
</script>

<style scoped>

</style>
