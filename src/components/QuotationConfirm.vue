<template>
	<div v-if="checkPermission()">
		<button class="btn btn-default">確認報價</button>
		<p>報價單確認狀態：{{confirmText}}</p>
		<button v-if="allowEdit" @click="editQuotation" class="btn btn-default">修改報價</button>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    export default {
        props: {
            projectState: {
                type: Object,
                default: {
                    state: "",
                    manager_approve: false,
                    boss_approve: false,
                    need_boss: false
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
                projectInfo: {}
            }
        },
        computed: {
            allowEdit() {
                if (this.projectState) {
                    switch (this.projectState.state) {
                        case "quotation_save":
                            return !this.projectState.manager_approve && !this.projectState.boss_approve
                        default:
                            return false;
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
                                return "PIC已確認"
                            } else {
                                return "等待確認"
                            }
                        default:
                            return false;
                    }
                }
                return ""
            }
        },
        methods: {
            checkPermission,
            editQuotation() {
                this.projectId = 1
            },
            getProjectConfirmInfo(id) {
                return view_quotation.getProjectConfirmInfo(id).then(function(result) {
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