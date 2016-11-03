<template>
	<div>
		<div v-if="checkPermission()">
			<button v-if="project.project_state.state=='quotation_contract'" @click="beginWork" class="btn btn-default">開工</button>
			<div v-else>
				<label>工程負責人:{{project.quotation.manager}}</label>
                <project-attachment :project="project"></project-attachment>
                <project-hour :count="hourCount" :project="project"></project-hour>
				<div v-if="project.project_state.state=='working'">
					<button @click="endWork" class="btn btn-default">完工</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import create_quotation from '../api/create_quotation'
    import view_quotation from '../api/view_quotation'
    import VueStrapUpload from './extend/vue-strap-upload'
    import ProjectHour from './ProjectHour'
    import ProjectAttachment from './ProjectAttachment'

    export default {
        props: {
            project: {
                type: Object
            }
        },
        components: {
            VueStrapUpload,
            ProjectAttachment,
            ProjectHour
        },
        data() {
            return {
                hourCount: 0
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

            }
        },
        ready() {}
    }
</script>