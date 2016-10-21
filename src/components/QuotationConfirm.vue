<template>
	<div v-if="checkPermission()">
		<button class="btn btn-default">確認報價</button>
		<p>報價單確認狀態：{{confirmText}}</p>
        <p v-if="projectInfo.belowprofitability">利潤率不達標，需要BOSS確認</p>
        <p v-if="projectInfo.overtotalprofit">工程總額過高，需要BOSS確認</p>
		<button :disabled="editing" v-if="allowEdit" @click="editQuotation" class="btn btn-default">{{editing?'loading':'修改報價'}}</button>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    import create_quotation from '../api/create_quotation'
    import edit_quotation from '../api/edit_quotation'
    export default {
        props: {
            projectState: {
                type: Object,
                default: {
                    state: "",
                    manager_approve: false,
                    boss_approve: false
                }
            },
            projectId: {
                type: Number,
                default: undefined
            }
        },
        data() {
            return {
                state: window.state,
                projectInfo: {},
                editing: false
            }
        },
        computed: {
            allowEdit() {
                if (this.projectState) {
                    if (this.projectState.state == "quotation_save") {
                        if (!this.projectState.manager_approve && !this.projectState.boss_approve) {
                            return this.checkPermission(["create_quotation"])
                        } else {
                            return this.checkPermission(["edit_quotation"])
                        }
                    }
                }
                return false
            },
            confirmText() {
                if (this.projectState) {
                    switch (this.projectState.state) {
                        case "quotation_save":
                            if (this.projectState.boss_approve) {
                                return "BOSS已確認"
                            } else if (this.projectState.manager_approve) {
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
                            return "";
                    }
                }
                return ""
            },
            allowConfirm() {
                if (this.projectState) {}
            }
        },
        methods: {
            checkPermission,
            editQuotation() {
                var that = this
                that.editing = true
                if (!that.projectState.manager_approve && !that.projectState.boss_approve) {
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
            getProjectConfirmInfo(id) {
                var that = this
                return view_quotation.getProjectConfirmInfo(id).then(function(result) {
                    that.projectInfo = result
                    console.log(result)
                })
            }
        },
        watch: {
            'projectId': {
                handler: function(val) {
                    if (val) {
                        this.getProjectConfirmInfo(val)
                    }
                }
            }
        },
        ready() {
            if (this.projectId) {
                this.getProjectConfirmInfo(this.projectId)
            }
        }
    }
</script>