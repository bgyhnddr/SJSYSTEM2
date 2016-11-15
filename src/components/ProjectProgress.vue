<template>
<div>
	<div>
		<button v-if="project.project_state.state=='quotation_contract'&&checkPermission(['create_quotation'])" @click="beginWork" class="btn btn-default">開工</button>
		<div v-else>
			<label>工程負責人:{{project.quotation.manager}}</label>
			<project-attachment :project="project"></project-attachment>
			<project-hour :count.sync="outSourceCount" :project="project"></project-hour>
			<project-out-source :count.sync="hourCount" :project="project"></project-out-source>
			<div v-if="project.project_state.state=='working'">
				<button v-if="(hourCount||outSourceCount)&&checkPermission(['create_quotation'])" @click="endWork" class="btn btn-default">完工</button>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import create_quotation from '../api/create_quotation'
import view_quotation from '../api/view_quotation'
import ProjectHour from './ProjectHour'
import ProjectOutSource from './ProjectOutSource'
import ProjectAttachment from './ProjectAttachment'

export default {
	props: {
		project: {
			type: Object
		}
	},
	components: {
		ProjectAttachment,
		ProjectHour,
		ProjectOutSource
	},
	data() {
		return {
			hourCount: 0,
			outSourceCount: 0
		}
	},
	methods: {
		checkPermission,
		beginWork() {
			var that = this
			if (confirm("是否確認開工？")) {
				create_quotation.beginWork({
					id: that.project.id
				}).then((result) => {
					that.project.project_state.state = "working"
				}).catch((err) => {
					window.alert(err)
				})
			}
		},
		endWork() {
			var that = this
			if (confirm("是否確認完工？")) {
				create_quotation.endWork({
					id: that.project.id
				}).then((result) => {
					that.project.project_state.state = "counting"
				}).catch((err) => {
					window.alert(err)
				})
			}
		}
	},
	ready() {}
}
</script>
