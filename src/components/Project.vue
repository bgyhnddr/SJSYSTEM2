<template>
	<div>
		<div v-if="checkPermission()">
			<alert v-if="alertText" type="success">
				{{alertText}}
			</alert>
			<div v-if="project.id">
				<div class="panel-group">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/quotation' }">报价单</a>
							</h4>
						</div>
						<div class="panel-collapse collapse in">
							<div class="panel-body">
								<project-contract v-if="project.project_state.state!='draft'" :project.sync="project" :project-info="projectInfo"></project-contract>
								<quotation-confirm v-if="showQuotationConfirm" :project.sync="project" :project-info="projectInfo"></quotation-confirm>
								<quotation :quotation_no.sync="project.quotation_no"></quotation>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import Quotation from './Quotation'
    import QuotationConfirm from './QuotationConfirm'
    import view_quotation from '../api/view_quotation'
    import ProjectContract from './ProjectContract'
    import {
        alert
    } from 'vue-strap'
    export default {
        data() {
            return {
                alertText: "",
                project: {},
                projectInfo: {},
                state: window.state
            }
        },
        computed: {
            showQuotationConfirm() {
                return (this.project.project_state && this.project.project_state.state == "quotation_save")
            }
        },
        components: {
            Quotation,
            QuotationConfirm,
            ProjectContract,
            alert
        },
        methods: {
            checkPermission,
            getProject(id) {
                var that = this
                return view_quotation.getProject({
                    id: id
                }).then((result) => {
                    console.log(that.project.quotation_no)
                    that.project = result
                    that.alertText = ""
                }).catch((err) => {
                    that.alertText = err
                })
            },
            getProjectConfirmInfo(id) {
                var that = this
                return view_quotation.getProjectConfirmInfo(id).then(function(result) {
                    that.projectInfo = result
                })
            }
        },
        ready() {
            var that = this
            that.getProject(that.$route.params.id)
        },
        events: {
            'refreshProject': function() {
                this.getProject(this.$route.params.id)
                this.getProjectConfirmInfo(this.$route.params.id)
            }
        },
        route: {
            deactivate(transition) {
                if (transition.from.path.indexOf("/index/ProjectManagement/Project/") >= 0) {
                    if (this.state.quotation_change) {
                        if (window.confirm("存在未保存内容，是否離開頁面？")) {
                            this.state.quotation_change = false
                        } else {
                            transition.abort()
                        }
                    }
                }
                transition.next()
            }
        }
    }
</script>