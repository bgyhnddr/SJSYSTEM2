<template>
	<div class="panel panel-default">
		<div class="panel-heading">工時錄入</div>
		<div class="panel-body">
			<button v-if="project.project_state.state=='working'" @click="addHours" class="btn btn-default">新增記錄</button>
			<modal :show.sync="ShowHourModel" effect="fade">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						工時
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<bs-input type="date" :value.sync="submitData.begin_date" label="開工日期"></bs-input>
					<div>
						<label>開工員工</label>
						<p>{{submitData.staff}}
							<button type="button" class="btn btn-default" @click="showStaffModel=true">選擇</button>
						</p>
					</div>
						<label>開工時長</label>
					<v-select :value.sync="submitData.hour">
						<v-option value="0.25">0.25</v-option>
						<v-option value="0.5">0.5</v-option>
						<v-option value="0.75">0.75</v-option>
						<v-option value="1">1</v-option>
					</v-select>
					<bs-input type="textarea" :value.sync="submitData.comments" label="備注"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="ShowHourModel=false">关闭</button>
					<button v-if="vaild()" :disabled="submittingHour" type="button" class="btn btn-success" @click="submitHour">確認</button>
				</div>
			</modal>
			<div :class="{'in':showStaffModel}" class="modal fade" :style="{zIndex:(showStaffModel?undefined:-1)}" style="display:block;overflow-y:auto;">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">
								開工員工
							</h4>
						</div>
						<div class="modal-body">
							<staff-setting select-event="staffSelect" :selectable="true"></staff-setting>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="showStaffModel=false">关闭</button>
						</div>
					</div>
					<!-- /.modal-content -->
				</div>
				<!-- /.modal-dialog -->
			</div>
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th>
							開工日期
						</th>
						<th>
							開工員工
						</th>
						<th>
							開工時長
						</th>
						<th>
							備注
						</th>
						<th>
							操作
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row of hours">
						<td>{{row.begin_date}}</td>
						<td>{{row.staff}}</td>
						<td>{{row.hour}}</td>
						<td>{{row.comments}}</td>
						<td v-if="project.project_state.state=='working'">
							<button @click="editHour(row)" class="btn btn-default btn-xs">修改</button>
							<button @click="deleteHour(row)" class="btn btn-default btn-xs">刪除</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import create_quotation from '../api/create_quotation'
    import view_quotation from '../api/view_quotation'
    import VueStrapUpload from './extend/vue-strap-upload'
    import StaffSetting from './StaffSetting'
    import {
        modal,
        alert,
        input as bsInput,
        select as vSelect,
        option as vOption
    } from 'vue-strap'

    export default {
        components: {
            modal,
            bsInput,
            StaffSetting,
            vSelect,
            vOption
        },
        props: {
            project: {
                type: Object
            },
            count: {
                type: Number
            }
        },
        data() {
            return {
                hours: [],
                submittingHour: false,
                ShowHourModel: false,
                showStaffModel: false,
                submitData: {
                    id: "",
                    begin_date: "",
                    hour: 0,
                    staff: "",
                    comments: "",
                    project_id: ""
                }
            }
        },
        methods: {
            vaild() {
                var data = this.submitData
                return data.begin_date && data.hour && data.staff
            },
            getProjectHours(id) {
                var that = this
                view_quotation.getProjectHours({
                    id: id
                }).then((result) => {
                    that.hours = result
                    that.count = that.hours.length
                })
            },
            submitProjectHour(obj) {
                var that = this
                create_quotation.submitProjectHour(obj).then((result) => {
                    that.getProjectHours(that.project.id)
                })
            },
            addHours() {
                this.submitData = {
                    id: "",
                    begin_date: new Date().Format("yyyy-MM-dd"),
                    hour: 0,
                    staff: "",
                    comments: "",
                    project_id: ""
                }


                this.ShowHourModel = true
            },
            submitHour() {
                var that = this
                if (that.vaild()) {
                    that.submittingHour = true
                    that.submitData.project_id = that.project.id
                    create_quotation.submitProjectHour(that.submitData).then((result) => {
                        that.submittingHour = false
                        that.ShowHourModel = false
                        that.getProjectHours(that.project.id)
                    }).catch((err) => {
                        window.alert(err)
                        that.submittingHour = false
                    })
                } else {
                    window.alert("請填寫完善")
                }
            },
            deleteHour(row) {
                var that = this
                create_quotation.deleteProjectHour({
                    id: row.id,
                    project_id: row.project_id
                }).then((result) => {
                    that.getProjectHours(that.project.id)
                }).catch((err) => {
                    window.alert(err)
                })
            },
            editHour(row) {
                this.submitData = {
                    id: row.id,
                    begin_date: row.begin_date,
                    hour: row.hour.toString(),
                    staff: row.staff,
                    comments: row.comments,
                    project_id: row.project_id
                }
                this.ShowHourModel = true
            }
        },
        events: {
            "staffSelect": function(val) {
                this.submitData.staff = val.name
                this.showStaffModel = false
            }
        },
        watch: {
            'project': function() {
                this.getProjectHours(this.project.id)
            }
        },
        ready() {
            if (this.project) {
                this.getProjectHours(this.project.id)
            }
        }
    }
</script>
