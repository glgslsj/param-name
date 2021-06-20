<template>
	<div style="margin-left: 5px; margin-right: 5px">
		<div style="font-size: medium; font-weight: bold">
			<a style="float: left" @click="toparam">切换变量名工具</a>
			<span>工具</span>
			<a style="float: right" @click="totomato">切换番茄工具</a>
		</div>
		<div class="all_blank">{{ position.x }} , {{ position.y }}</div>

		<div class="all_blank">
			<a-button @click="robotmove">move</a-button>
			<a-button @click="robotclick">click</a-button>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag'
export default {
	name: 'tomato',
	data() {
		return {
			position: { x: 1, y: 1 },
		}
	},
	computed: {},
	methods: {
		robotmove: function() {
			//robot.moveMouse(100, 100);
			console.log(process.versions)
		},
		robotclick: function() {
			//robot.mouseClick();
		},
		totomato: function() {
			this.$router.push('/tomato')
		},
		toparam: function() {
			this.$router.push('/')
		},
	},
}
</script>

<style scoped>
.all_blank {
	margin: 5px;
}
</style>
