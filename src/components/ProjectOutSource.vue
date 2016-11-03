<template>
	<div class="panel panel-default">
		<div class="panel-heading">外判記錄</div>
		<div class="panel-body">
			<button @click="addOutSources" class="btn btn-default">新增外判記錄</button>
			<modal :show.sync="ShowOutSourceModel" effect="fade">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						工時
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<div>
						<label>外判</label>
						<p>{{submitData.out_source}}
							<button type="button" class="btn btn-default" @click="showOutSourceContractorModel=true">選擇</button>
						</p>
					</div>
					<bs-input type="textarea" :value.sync="submitData.content" label="工程外判内容"></bs-input>
					<bs-input type="textarea" :value.sync="submitData.comments" label="外判資料備注"></bs-input>
					<bs-input type="date" :value.sync="submitData.finish_date" label="開工日期"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="ShowOutSourceModel=false">关闭</button>
					<button :disabled="submittingOutSource" type="button" class="btn btn-success" @click="submitOutSource">確認</button>
				</div>
			</modal>
			<div :class="{'in':showOutSourceContractorModel}" class="modal fade" :style="{zIndex:(showOutSourceContractorModel?undefined:-1)}"
				style="display:block;overflow-y:auto;">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">
								外判
							</h4>
						</div>
						<div class="modal-body">
							<out-source-contractor-setting select-event="outSourceSelect" :selectable="true"></out-source-contractor-setting>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="showOutSourceContractorModel=false">关闭</button>
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
							外判
						</th>
						<th>
							内容
						</th>
						<th>
							收費
						</th>
						<th>
							附件
						</th>
						<th>
							備注
						</th>
						<th>
							完工日期
						</th>
						<th>
							操作
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row of outSources">
						<td>{{row.out_source}}</td>
						<td>{{row.content}}</td>
						<td>{{row.cost}}</td>
						<td>{{row.attachment_id}}</td>
						<td>{{row.comments}}</td>
						<td>{{row.finish_date}}</td>
						<td>
							<button @click="editOutSource(row)" class="btn btn-default btn-xs">修改</button>
							<button @click="deleteOutSource(row)" class="btn btn-default btn-xs">刪除</button>
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
    import OutSourceContractorSetting from './OutSourceContractorSetting'
    import {
        spinner,
        modal,
        alert,
        input as bsInput
    } from 'vue-strap'

    export default {
        components: {
            modal,
            bsInput,
            OutSourceContractorSetting
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
                outSources: [],
                submittingOutSource: false,
                ShowOutSourceModel: false,
                showOutSourceContractorModel: false,
                submitData: {
                    id: "",
                    out_source: "",
                    content: "",
                    cost: 0,
                    attachment_id: "",
                    comments: "",
                    finish_date: "",
                    project_id: ""
                }
            }
        },
        methods: {
            vaild() {
                var data = this.submitData
                return data.out_source
            },
            getProjectOutSources(id) {
                var that = this
                view_quotation.getProjectOutSources({
                    id: id
                }).then((result) => {
                    that.outSources = result
                    that.count = that.outSources.length
                })
            },
            submitProjectOutSource(obj) {
                var that = this
                create_quotation.submitProjectOutSource(obj).then((result) => {
                    that.getProjectOutSources(that.project.id)
                })
            },
            addOutSources() {
                this.submitData = {
                    id: "",
                    out_source: "",
                    content: "",
                    cost: 0,
                    attachment_id: "",
                    comments: "",
                    finish_date: "",
                    project_id: ""
                }
                this.ShowOutSourceModel = true
            },
            submitProjectOutSource() {
                var that = this
                if (that.vaild()) {
                    that.submittingOutSource = true
                    that.submitData.project_id = that.project.id
                    create_quotation.submitProjectOutSource(that.submitData).then((result) => {
                        that.submittingOutSource = false
                        that.ShowOutSourceModel = false
                        that.getProjectOutSources(that.project.id)
                    }).catch((err) => {
                        window.alert(err)
                        that.submittingOutSource = false
                    })
                } else {
                    window.alert("請填寫完善")
                }
            },
            deleteOutSource(row) {
                var that = this
                create_quotation.deleteProjectOutSource({
                    id: row.id,
                    project_id: row.project_id
                }).then((result) => {
                    that.getProjectOutSources(that.project.id)
                }).catch((err) => {
                    window.alert(err)
                })
            },
            editOutSource(row) {
                this.submitData = {
                    id: row.id,
                    out_source: row.out_source,
                    content: row.content,
                    cost: row.cost,
                    attachment_id: row.attachment_id,
                    comments: row.comments,
                    finish_date: row.finish_date,
                    project_id: row.project_id
                }
                this.ShowOutSourceModel = true
            }
        },
        events: {
            "outSourceSelect": function(val) {
                this.submitData.out_source = val.name
                this.showOutSourceContractorModel = false
            }
        },
        watch: {
            'project': function() {
                this.getProjectOutSources(this.project.id)
            }
        },
        ready() {
            if (this.project) {
                this.getProjectOutSources(this.project.id)
            }
        }
    }
</script>