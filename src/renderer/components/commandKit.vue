<template>
	<div>
		<div style="font-size: medium;font-weight: bold">
			<span>命令行工具</span>
			<a style="float: right" @click="switchKit">切换变量名工具</a>
		</div>
		<div class="m-5 font-20 font-bold">命令行</div>

		<tk-flex column class="m-t-5 m-r-20">
			<tk-flex between class="full-width">
				<tk-flex gutter="8">
					<a-button @click="newFixed">新增固定</a-button>
					<a-button @click="newFree">新增自由</a-button>
					<a-button @click="newBlank">新增空格</a-button>
				</tk-flex>
				<tk-flex>
					<a-button @click="addCommandBox">确认增加</a-button>
				</tk-flex>
			</tk-flex>
			<tk-flex middle column>
				<!--这里是放需要新添加的命令的行-->
				<div>
					新命令
				</div>
				<tk-flex v-if="newCommand.length">
					<div v-for="(item,index) in newCommandType" :key="index" class="m-r-5">
						<div v-if="item === 'fixed'">
							<a-input v-model="newCommand[index]" style="width: 100px"></a-input>
						</div>
						<div disabled v-if="item === 'free'">
							<a-input disabled style="width: 100px"></a-input>
						</div>
						<div v-if="item === 'blank'" >
							<a-input disabled style="width: 3px"></a-input>
						</div>
					</div>
				</tk-flex>
				<tk-flex column v-else>
					<a-input value="请添加项目" disabled style="width: 100px"></a-input>
					<a-input value="请添加描述" disabled style="width: 100px"></a-input>
				</tk-flex>
				<tk-flex>
					<div v-for="(item,index) in newCommandScript" :key="index" class="m-r-5">
						<div v-if="newCommandType[index] === 'fixed'">
							<a-input v-model="newCommandScript[index]" style="width: 100px"></a-input>
						</div>
						<div v-if="newCommandType[index] === 'free'">
							<a-input v-model="newCommandScript[index]" style="width: 100px"></a-input>
						</div>
						<div v-if="newCommandType[index] === 'blank'">
							<a-input v-model="newCommandScript[index]" disabled style="width: 3px"></a-input>
						</div>
					</div>
				</tk-flex>
			</tk-flex>

			<div class="m-t-5">最近用过的命令行</div>
			<tk-flex  column v-for="(item,index) in commandsRecently" :key="index" class="full-width">
				<tk-flex between class="full-width">
					<tk-flex middle column>
						<tk-flex v-if="item.content.length">
							<div v-for="(contentType,index0) in item.contentType" :key="index0" class="m-r-5">
								<div v-if="contentType === 'fixed'">
									<a-input v-model="item.content[index0]" :style="'width:'+ item.content[index0].length*9+'px'"></a-input>
								</div>
								<div disabled v-if="contentType === 'free'">
									<a-input v-model="item.content[index0]" style="width: 100px"></a-input>
								</div>
								<div v-if="contentType === 'blank'">
									<a-input disabled style="width: 3px"></a-input>
								</div>
							</div>
						</tk-flex>

						<tk-flex>
							<div v-for="(script,index1) in item.script" :key="index1" class="m-r-5">
								<div v-if="item.contentType[index1] === 'fixed'">
									<a-input v-model="item.script[index1]" :style="'width:'+ item.content[index1].length*9+'px'"></a-input>
								</div>
								<div v-if="item.contentType[index1] === 'free'">
									<a-input v-model="item.script[index1]" style="width: 100px"></a-input>
								</div>
								<div v-if="item.contentType[index1] === 'blank'">
									<a-input disabled v-model="item.script[index1]" style="width: 3px"></a-input>
								</div>
							</div>
						</tk-flex>
					</tk-flex>
					<tk-flex middle column class="m-t-4">
						<div class="m-b-4">描述：{{item.mainScript}}</div>
						<a-button @click="copyCommand(item)">复制命令</a-button>
					</tk-flex>

				</tk-flex>

			</tk-flex>
			<div>显示哪些命令</div>
			<tk-flex class="full-width" between="">
				<tk-flex style="width: 25%" class="m-y-5">
					<!--改做了多选框，显示所有的label-->
					<a-select
							mode="multiple"
							placeholder="选择需要命令的label"
							:value="checkedLabels"
							style="width: 100%"
							@change="handleChangeChecked"
					>
						<a-select-option v-for="item in filteredChecked" :key="item.id" :value="item.content">
							{{ item.content }}
						</a-select-option>
					</a-select>
				</tk-flex>

				<tk-flex style="width: 50%">
					<tk-flex middle>
						<div style="white-space: nowrap;" class="m-r-5">增加label</div>
						<a-input v-model="newLabel" style="width: 100px"></a-input>
					</tk-flex>
					<div class="m-l-5">
						<a-button @click="addLabel">增加</a-button>
					</div>
					<div></div>
				</tk-flex>
			</tk-flex>

			<div class="m-t-5">选中的命令</div>
			<tk-flex column v-for="(item,index) in commandsSelected" :key="index" class="full-width">
				<tk-flex between class="full-width">
					<tk-flex middle column>
						<tk-flex v-if="item.content.length">
							<!--这里放一行固定或者空格或者自由-->
							<div v-for="(contentType,index0) in item.contentType" :key="index0" class="m-r-5">
								<div v-if="contentType === 'fixed'">
									<a-input disabled v-model="item.content[index0]" style="width: 100px"></a-input>
								</div>
								<div disabled v-if="contentType === 'free'">
									<a-input v-model="item.content[index0]" style="width: 100px"></a-input>
								</div>
								<div v-if="contentType === 'blank'" >
									<a-input disabled style="width: 3px"></a-input>
								</div>
							</div>
						</tk-flex>

						<tk-flex>
							<!--这里放一行详细描述-->
							<div v-for="(script,index1) in item.script" :key="index1" class="m-r-5">
								<div v-if="item.contentType[index1] === 'fixed'">
									<a-input disabled v-model="item.script[index1]" style="width: 100px"></a-input>
								</div>
								<div v-if="item.contentType[index1] === 'free'">
									<a-input disabled v-model="item.script[index1]" style="width: 100px"></a-input>
								</div>
								<div v-if="item.contentType[index1] === 'blank'">
									<a-input disabled v-model="item.script[index1]" style="width: 3px"></a-input>
								</div>
							</div>
						</tk-flex>
					</tk-flex>
					<tk-flex column>
						<div class="m-b-4">描述：{{item.mainScript}}</div>
						<a-button @click="copyCommand(item)">复制命令</a-button>
					</tk-flex>
				</tk-flex>
			</tk-flex>
		</tk-flex>

		<a-modal v-model="addCommand" title="新增命令" ok-text="确认" cancel-text="取消" @ok="confirmAddCommand" center>
			<div>请添加和这个命令相关的描述和标签</div>
			<div class="m-y-5">
				<a-input placeHolder="内容" v-model="newCommandMainscript"></a-input>
			</div>

			<a-select
					mode="multiple"
					placeholder="选择合适的label"
					:value="relatedLabels"
					style="width: 100%"
					@change="handleChangeRelated"
					class="m-y-5"
			>
				<a-select-option v-for="item in filteredRelated" :key="item.id" :value="item.content">
					{{ item.content }}
				</a-select-option>
			</a-select>

			<tk-flex middle class="m-y-5">
				<div style="white-space: nowrap;" class="m-r-5">增加label</div>
				<a-input v-model="newLabel" style="width: 100px"></a-input>
				<div class="m-l-5">
					<a-button @click="addLabel">增加</a-button>
				</div>
			</tk-flex>
		</a-modal>
	</div>
</template>

<script>
    const {clipboard} = require('electron')
    import axios from 'axios'
    import gql from 'graphql-tag'
    export default {
        name: 'commandKit',
        data () {
            return {
                addCommand: false,
                commandConnect: [],
                newCommandMainscript: '',
                newCommand: [], // 放新增的命令
                newCommandType: [], // 放新增命令的类型
                newCommandScript: [], // 放新增命令的描述
                newLabel: '', // 新增的label
                checkedLabels: [], // 选中的label
                relatedLabels: [] // 相关的标签
            }
        },
        apollo: {
            labels: {
                query:
                    gql`query {
                            propskit_commandLabel(order_by: {created_at: asc}) {
          id
          content
        }
      }`,
                update (data) {
                    return data.propskit_commandLabel
                },
                result ({ data, loading, networkStatus }) {
                },
                // 错误处理
                error (error) {
                    console.error('We\'ve got an error!', error)
                }
            },
            commandsRecently: {
                // todo:这里要写最近用过的，暂时不做
                query:
                    gql`query {
                                  propskit_command(order_by: {created_at: desc}, limit: 5) {
          content
          contentType
          created_at
          id
          mainScript
          script
        }
      }`,
                update (data) {
                    return data.propskit_command
                },
                result ({ data, loading, networkStatus }) {
                },
                // 错误处理
                error (error) {
                    console.error('We\'ve got an error!', error)
                }
            },
            commandsSelected: {
                query:
                    gql`query ($selectList:[String!]){
                                              propskit_command(order_by: {created_at: asc}, where: {commandConnects: {commandLabel: {content: {_in: $selectList}}}}) {
          id
          content
          contentType
          mainScript
          script
        }
      }`,
                variables () {
                    return {
                        selectList: this.checkedLabels
                    }
                },
                update (data) {
                    console.log(data)
                    return data.propskit_command
                },
                result ({ data, loading, networkStatus }) {
                },
                // 错误处理
                error (error) {
                    console.error('We\'ve got an error!', error)
                },
                skip () {
                    return !this.checkedLabels.length
                }
            }
        },
        methods: {
            switchKit: function () {
                this.$router.push('/')
            },
            newFixed: function () {
                // 增加固定词
                this.newCommand.push('')
                this.newCommandType.push('fixed')
                this.newCommandScript.push('固定')
            },
            newFree: function () {
                // 增加灵活词
                this.newCommand.push('')
                this.newCommandType.push('free')
                this.newCommandScript.push('')
            },
            newBlank: function () {
                // 增加空格
                this.newCommand.push('')
                this.newCommandType.push('blank')
                this.newCommandScript.push('_')
            },
            addCommandBox: function () {
                // 确认增加命令
                this.addCommand = true
                console.log(this.labels)
            },
            commandReset: function () {
                this.newCommand = []
                this.newCommandType = []
                this.newCommandScript = []
                this.newCommandMainscript = ''
                this.addCommand = false
                this.relatedLabels = []
            },
            confirmAddCommand: async function () {
                if (!this.relatedLabels) {
                    this.$message.error('不能为空')
                    return
                }
                let relatedLabels = this.labels.filter(o => this.relatedLabels.includes(o.content))
                let ids = relatedLabels.map((item) => {
                    return { labelId: item.id }
                })
                let data = await this.$apollo.mutate({
                    mutation: gql`mutation($content:jsonb,$contentType:jsonb,$script:jsonb,$mainScript:String,$ids:[propskit_commandConnect_insert_input!]!){
                            insert_propskit_command(objects: {commandConnects: {data: $ids},content: $content, contentType: $contentType, mainScript: $mainScript, script: $script}) {
            returning {
              id
              created_at
              mainScript
            }
          }
        }`,
                    variables: {
                        content: this.newCommand,
                        contentType: this.newCommandType,
                        script: this.newCommandScript,
                        mainScript: this.newCommandMainscript,
                        ids: ids
                    }
                }).catch((error) => {
                    this.$message.error('出错了，请重试')
                    console.log(error)
                })
                if (data) {
                    this.$apollo.queries.commandsRecently.refetch()
                    this.$apollo.queries.commandsSelected.refetch()
                    this.$message.success('成功')
                    this.newLabel = ''
                    this.commandReset()
                }
            },
            addLabel: async function () {
                // 增加label
                let data = await this.$apollo.mutate({
                    mutation: gql`mutation($content:String!){
                    insert_propskit_commandLabel(objects: {content: $content}) {
            returning {
              content
              id
            }
          }
        }`,
                    variables: {
                        content: this.newLabel
                    }
                }).catch((error) => {
                    this.$message.error('出错了，请重试')
                    console.log(error)
                })
                if (data) {
                    this.$apollo.queries.labels.refetch()
                    this.$message.success('成功')
                    this.newLabel = ''
                }
            },
            copyCommand: function (item) {
                let str = ''
                console.log(item)
                item.content.forEach((i, index) => {
                    if (item.contentType[index] === 'blank') {
                        str += ' '
                    } else {
                        str += i
                    }
                })
                this.$copyText(str).then(() => {
                    this.$message.success('复制成功')
                })
            },
            handleChangeRelated (relatedLabels) {
                this.relatedLabels = relatedLabels
            },
            handleChangeChecked (checkedLabels) {
                this.checkedLabels = checkedLabels
            }
        },
        computed: {
            filteredChecked () {
                if (!this.labels || !this.labels.length) return []
                return this.labels.filter(o => !this.checkedLabels.includes(o.content))
            },
            filteredRelated () {
                if (!this.labels || !this.labels.length) return []
                return this.labels.filter(o => !this.relatedLabels.includes(o.content))
            }
        }
    }
</script>

<style scoped>

</style>
