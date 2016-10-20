<template>
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
							<quotation-confirm v-if="showQuotationConfirm" :project-id="project.id" :project-state="project.project_state"></quotation-confirm>
							<quotation :editable="quotationSetting.quotation_editable" :quotation_no.sync="project.quotation_no"></quotation>
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
    import {
        alert
    } from 'vue-strap'
    export default {
        data() {
            return {
                alertText: "",
                project: {},
                state: window.state,
                quotationSetting: {
                    quotation_editable: false
                },
                test: false
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
            alert
        },
        methods: {
            checkPermission,
            getProject(id) {
                var that = this
                return view_quotation.getProject({
                    id: id
                }).then((result) => {
                    that.project = result
                    that.quotationSetting.quotation_editable = result.project_state.state == "draft"
                    that.alertText = ""
                }).catch((err) => {
                    that.alertText = err
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