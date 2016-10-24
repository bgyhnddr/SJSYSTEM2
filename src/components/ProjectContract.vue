<template>
	<div v-if="checkPermission()">
		<div class="panel panel-default">
			<div class="panel-heading">合同</div>
			<div class="panel-body">
                <button v-if="showConfirm" class="btn btn-default">確認合同</button>
				<vue-strap-upload :file-id.sync="id" :file-name.sync="fileName" :readonly="project.project_state.state!='quotation_save'"></vue-strap-upload>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import VueStrapUpload from './extend/vue-strap-upload'
    import view_quotation from '../api/view_quotation'
    import create_quotation from '../api/create_quotation'

    export default {
        components: {
            VueStrapUpload
        },
        props: {
            project: {
                type: Object
            },
            projectInfo: {
                type: Object
            }
        },
        data() {
            return {
                id: undefined,
                fileName: "",
                state: window.state
            }
        },
        computed: {
            showConfirm() {
                console.log(this.projectInfo.belowprofitability)
                console.log(this.projectInfo.overtotalprofit)
                var isManager = () => {
                    return this.projectInfo.manager == state.userInfo.name || checkPermission(["confirm_quotation_boss"])
                }

                if (this.projectInfo.belowprofitability == true || this.projectInfo.overtotalprofit == true) {
                    if (this.project.project_state.boss_approve == true) {
                        return isManager()
                    } else {
                        return false
                    }
                } else {
                    if (this.project.project_state.boss_approve == true || this.project.project_state.manager_approve == true) {
                        return isManager()
                    } else {
                        return false
                    }
                }
            }
        },
        methods: {
            checkPermission,
            getProjectContract(projectId) {
                var that = this
                return view_quotation.getProjectContract({
                    id: projectId
                }).then((result) => {
                    that.id = result.id
                    that.fileName = result.name
                })
            },
            saveProjectContract(id) {
                create_quotation.saveContract({
                    project_id: this.project.id,
                    attachment_id: id
                })
            }
        },
        watch: {
            'project': function(val) {
                if (val) {
                    var that = this
                    that.getProjectContract(that.project.id)
                }
            },
            'id': function(val) {
                if (val) {
                    this.saveProjectContract(val)
                }
            }
        },
        events: {},
        ready() {
            var that = this
            if (that.project) {
                that.getProjectContract(that.project.id)
            }
        }
    }
</script>