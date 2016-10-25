<template>
	<div>
		<div v-if="checkPermission()">
			<div class="panel panel-default">
				<div class="panel-heading">報價單確認</div>
				<div class="panel-body">
					<button v-if="showConfirm" @click="confirmQuotation" class="btn btn-default">確認報價</button>
					<button :disabled="editing" v-if="allowEdit" @click="editQuotation" class="btn btn-default">{{editing?'loading':'修改報價'}}</button>
					<p>報價單確認狀態：{{confirmText}}</p>
					<p v-if="projectInfo.belowprofitability">利潤率不達標</p>
					<p v-if="projectInfo.overtotalprofit">工程總額過高</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    import create_quotation from '../api/create_quotation'
    import edit_quotation from '../api/edit_quotation'
    import confirm_quotation from '../api/confirm_quotation'
    import confirm_quotation_boss from '../api/confirm_quotation_boss'

    export default {
        components: {},
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
                state: window.state,
                editing: false
            }
        },
        computed: {
            allowEdit() {
                if (this.project.project_state) {
                    if (this.project.project_state.state == "quotation_save") {
                        if (!this.project.project_state.manager_approve && !this.project.project_state.boss_approve) {
                            return this.checkPermission(["create_quotation"])
                        } else {
                            return this.checkPermission(["edit_quotation"])
                        }
                    }
                }
                return false
            },
            confirmText() {
                if (this.project.project_state) {
                    switch (this.project.project_state.state) {
                        case "quotation_save":
                            if (this.project.project_state.boss_approve) {
                                return "BOSS已確認"
                            } else if (this.project.project_state.manager_approve) {
                                if (this.projectInfo.belowprofitability || this.projectInfo.overtotalprofit) {
                                    return "等待BOSS確認"
                                } else {
                                    return "PIC已確認"
                                }
                            } else {
                                if (this.projectInfo.belowprofitability || this.projectInfo.overtotalprofit) {
                                    return "等待BOSS確認"
                                } else {
                                    return "等待PIC或BOSS確認"
                                }
                            }
                        default:
                            return ""
                    }
                }
                return ""
            },
            showConfirm() {
                if (this.project.project_state) {
                    if (this.project.project_state.state == "quotation_save") {
                        if (this.checkPermission(["confirm_quotation_boss"])) {
                            return !this.project.project_state.boss_approve
                        } else {
                            if (!this.projectInfo.belowprofitability && !this.projectInfo.overtotalprofit) {
                                return this.projectInfo.manager == this.state.userInfo.name && !this.project.project_state.manager_approve
                            }
                        }
                    }
                }
                return false
            }
        },
        methods: {
            checkPermission,
            editQuotation() {
                var that = this
                that.editing = true
                if (!that.project.project_state.manager_approve && !that.project.project_state.boss_approve) {
                    create_quotation.editQuotation({
                        no: that.projectInfo.quotation_no
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        window.alert(err)
                        that.editing = false
                    })
                } else {
                    edit_quotation.editQuotation({
                        no: that.projectInfo.quotation_no
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        window.alert(err)
                        that.editing = false
                    })
                }
            },
            confirmQuotation() {
                var that = this
                that.reqConfirm().then((result) => {
                    that.$dispatch("refreshProject")
                }).catch((err) => {
                    window.alert(err)
                })
            },
            reqConfirm() {
                var that = this
                if (that.checkPermission(["confirm_quotation_boss"])) {
                    return confirm_quotation_boss.confirmQuotation({
                        id: that.project.id
                    })
                } else {
                    return confirm_quotation.confirmQuotation({
                        id: that.project.id
                    })
                }
            }
        },
        watch: {},
        events: {},
        ready() {}
    }
</script>