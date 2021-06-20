<template>
	<div style="margin-left: 5px; margin-right: 5px">
		<div style="font-size: medium; font-weight: bold">
			<span>番茄工具</span>
			<a @click="switchrobot">切换工具</a>
			<a style="float: right" @click="switchKit">切换变量名工具</a>
		</div>

		<div style="margin-bottom: 10px; margin-top: 20px">
			今日已完成数量 {{ todayCount }}
		</div>
		<div class="all_blank">
			<div>
				<div>本次内容</div>
				<a-input v-model="content" style="margin-bottom: 5px"></a-input>
			</div>
			<div>剩余时间</div>
			<div>{{ minute }}:{{ second }}</div>
			<a-button @click="getTime">start</a-button>
			<a-button @click="stopTime">stop</a-button>
		</div>
		<div class="all_blank">
			<a-input v-model="tomatoTime" style="margin-bottom: 5px"></a-input>
		</div>
		<div>
			<!--<div>
				<div>是否完成内容</div>
			</div>-->
			<!--<a-button @click="increaseCount">保存数据</a-button>-->
		</div>

		<div></div>

		<div class="all_blank">
			<div>休息剩余时间</div>
			<div>{{ resMinute }}:{{ resSecond }}</div>
			<a-button @click="startRes">start</a-button>
			<a-button @click="stopRes">stop</a-button>
		</div>
		<div class="all_blank">
			<a-input v-model="resTime" style="margin-bottom: 5px"></a-input>
		</div>

		<div class="all_blank">
			<div>今天完成的番茄</div>
			<div>
				<div v-for="(item, index) in tomatos" :key="index">
					{{ index + 1 }} : {{ item.content }}
					{{ item.isCompleted ? '完成' : '未完' }} 时长:{{
						item.time
					}}
				</div>
			</div>
		</div>

		<a-modal
			v-model="showFinished"
			title="保存番茄数据"
			ok-text="确认"
			cancel-text="取消"
			@ok="updateMessage"
		>
			<div>
				内容
				<a-input v-model="content" style="margin-bottom: 5px"></a-input>
			</div>
			<div>
				是否完成
				<a-switch default-checked v-model="isComplete" />
			</div>
		</a-modal>
	</div>
</template>

<script>
import gql from 'graphql-tag'
export default {
	name: 'tomato',
	data() {
		return {
			/*minute:25,
								second:0,*/
			isComplete: true,
			showFinished: false,
			lastFinishedTime: null,
			content: '',
			tomatoTime: 25,
			count: 1,
			isStart: false,
			startTime: 0,
			nowTime: 0,
			timer: null,
			resTime: 5,
			resStartTime: 0,
			resNowTime: 0,
			resTimer: null,
		}
	},
	apollo: {
		tomatos: {
			query: gql`
				query($today: timestamptz, $tomorow: timestamptz) {
					manager_tomato(
						where: { created_at: { _gte: $today, _lte: $tomorow } }
						order_by: { created_at: asc }
					) {
						content
						isCompleted
						finishedTime
						time
					}
				}
			`,
			variables() {
				return {
					today: new Date(
						new Date().setHours(0, 0, 0, 0)
					).toISOString(),
					tomorow: new Date(
						new Date().setHours(23, 59, 59, 999)
					).toISOString(),
				}
			},
			update(data) {
				// 返回的值将更新 vue 属性 'allTodos'
				return data.manager_tomato
			},
		},
	},
	computed: {
		todayCount: function() {
			return this.tomatos ? this.tomatos.length : 0
		},
		minute: function() {
			return Math.floor(
				(this.remianTime - (this.nowTime - this.startTime)) / 60
			)
		},
		second: function() {
			return (this.remianTime - (this.nowTime - this.startTime)) % 60
		},
		remianTime: function() {
			return this.tomatoTime * 60
		},
		resMinute: function() {
			return Math.floor(
				(this.remainResTime - (this.resNowTime - this.resStartTime)) /
					60
			)
		},
		resSecond: function() {
			return (
				(this.remainResTime - (this.resNowTime - this.resStartTime)) %
				60
			)
		},
		remainResTime: function() {
			return this.resTime * 60
		},
	},
	methods: {
		switchrobot: function() {
			this.$router.push('/moveKit')
		},
		updateMessage: async function() {
			console.log(this.lastFinishedTime)
			let data = await this.$apollo
				.mutate({
					mutation: gql`
						mutation(
							$content: String
							$finishedTime: timestamptz
							$time: Int
							$isComplete: Boolean
						) {
							insert_manager_tomato(
								objects: {
									content: $content
									finishedTime: $finishedTime
									time: $time
									isCompleted: $isComplete
								}
							) {
								returning {
									id
									created_at
								}
							}
						}
					`,
					variables: {
						content: this.content,
						finishedTime: this.lastFinishedTime,
						time: this.tomatoTime,
						isComplete: this.isComplete,
					},
				})
				.catch((error) => {
					// 错误
					console.log(error)
				})
			if (data) {
				await this.$apollo.queries.tomatos.refetch()
				if (this.isComplete) {
					this.content = ''
				}
				this.showFinished = false
			}
		},
		switchKit: function() {
			this.$router.push('/')
		},
		increaseCount: function() {
			alert('时间到')
			this.showFinished = true
		},
		startRes: function() {
			this.resStartTime = Math.floor(new Date().getTime() / 1000)
			this.resNowTime = Math.floor(new Date().getTime() / 1000)
			this.resTimer = setInterval(this.changeResTime, 1000)
		},
		stopRes: function() {
			clearInterval(this.resTimer)
			this.resNowTime = 0
			this.resStartTime = 0
		},
		getTime() {
			this.startTime = Math.floor(new Date().getTime() / 1000)
			this.nowTime = Math.floor(new Date().getTime() / 1000)
			this.timer = setInterval(this.changeTime, 1000)
		},
		stopTime: function() {
			clearInterval(this.timer)
			this.nowTime = 0
			this.startTime = 0
		},
		changeTime() {
			this.nowTime = Math.floor(new Date().getTime() / 1000)
			if (this.nowTime - this.startTime >= this.remianTime) {
				clearInterval(this.timer)
				this.lastFinishedTime = new Date().toISOString()
				this.nowTime = 0
				this.startTime = 0
				this.increaseCount()
			}
		},
		changeResTime: function() {
			this.resNowTime = Math.floor(new Date().getTime() / 1000)
			if (this.resNowTime - this.resStartTime >= this.remainResTime) {
				clearInterval(this.resTimer)
				alert('休息结束了')
				this.resNowTime = 0
				this.resStartTime = 0
			}
		},
	},
}
</script>

<style scoped>
.all_blank {
	margin: 5px;
}
</style>
