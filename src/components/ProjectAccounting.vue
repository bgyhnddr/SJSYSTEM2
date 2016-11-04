<template>
	<div>
		<div v-if="isEdit">
			<button @click="saveChange" v-if="changed" class="btn btn-default">保存修改</button>
			<button class="btn btn-default">確認信息</button>
			<bs-input type="number" :value.sync="submitData.ecost" label="工程預計成本"></bs-input>
			<bs-input type="number" :value.sync="submitData.acost" label="工程實際成本"></bs-input>
			<bs-input type="number" :value.sync="submitData.income" label="工程實際收入"></bs-input>
			工程實際綠潤：{{profit}}
		</div>
		<div v-else>
			工程預計成本：{{submitData.ecost}} 工程實際成本：{{submitData.acost}} 工程實際收入：{{submitData.income}} 工程實際綠潤：{{profit}}
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    import {
        modal,
        alert,
        spinner,
        input as bsInput
    } from 'vue-strap'

    export default {
        props: {
            project: {
                type: Object
            }
        },
        components: {
            bsInput
        },
        data() {
            return {
                submitData: {
                    id: "",
                    ecost: undefined,
                    acost: undefined,
                    income: undefined
                },
                changed: false
            }
        },
        computed: {
            isEdit() {
                return this.checkPermission(['confirm_quotation_boss']) || (this.project && this.project.project_state.state != 'counting')
            },
            profit() {
                return this.submitData.acost - this.submitData.income
            }
        },
        methods: {
            checkPermission,
            getProjectAccounting(project_id) {
                var that = this
                console.log(project_id)
                view_quotation.getProjectAccounting({
                    project_id: project_id
                }).then((result) => {
                    that.submitData = result
                })
            },
            saveChange() {
                var that = this
                view_quotation.saveProjectAcounting({
                    ecost: that.submitData.ecost,
                    acost: that.submitData.acost,
                    income: that.submitData.income,
                    project_id: that.project.id
                }).then((result) => {
                    that.changed = false
                }).catch((err) => {
                    window.alert(err)
                })
            }
        },
        watch: {
            'project': function() {
                this.getProjectAccounting(this.project.id)
            },
            'submitData.ecost': function(val, val2) {
                if (val2 != undefined) {
                    this.changed = true
                }
            },
            'submitData.acost': function(val, val2) {
                if (val2 != undefined) {
                    this.changed = true
                }
            },
            'submitData.income': function(val, val2) {
                if (val2 != undefined) {
                    this.changed = true
                }
            }
        },
        ready() {
            if (this.project) {
                this.getProjectAccounting(this.project.id)
            }
        }
    }
</script>