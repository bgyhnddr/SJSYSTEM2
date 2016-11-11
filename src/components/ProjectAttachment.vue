<template>
	<div class="panel panel-default">
		<div class="panel-heading">資料上傳</div>
		<div class="panel-body">
			<button @click="addAttachment" class="btn btn-default">新增資料</button>
			<ul class="list-group">
				<li class="list-group-item" v-for="att in attachments">
					{{att.content}}
					<vue-strap-upload v-on:uploaded="uploadAttachmentCallback(att)" :file-id.sync="att.attachment_id"></vue-strap-upload>
					<button @click="deleteAttachment(att)" class="btn btn-default btn-xs">刪除資料</button>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import create_quotation from '../api/create_quotation'
    import view_quotation from '../api/view_quotation'
    import VueStrapUpload from './extend/vue-strap-upload'

    export default {
        props: {
            project: {
                type: Object
            }
        },
        components: {
            VueStrapUpload
        },
        data() {
            return {
                attachments: []
            }
        },
        methods: {
            checkPermission,
            getProjectAttachments() {
                var that = this
                view_quotation.getProjectAttachments({
                    id: that.project.id
                }).then((result) => {
                    var list = result.map((o) => {
                        if (o.attachment == null) {
                            o.attachment = {
                                name: ""
                            }
                        }
                        return o
                    })
                    that.attachments = list
                }).catch((err) => {
                    window.alert(err)
                })
            },
            uploadAttachmentCallback(att) {
                var that = this
                create_quotation.saveProjectAttachment({
                    id: att.id,
                    attachment_id: att.attachment_id,
                    project_id: att.project_id
                }).then(function() {
                    that.getProjectAttachments()
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            addAttachment() {
                var that = this
                var content = window.prompt("輸入資料名")
                if (content) {
                    create_quotation.addProjectAttachment({
                        content: content,
                        project_id: that.project.id
                    }).then(function() {
                        that.getProjectAttachments()
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            },
            deleteAttachment(row) {
                var that = this
                if (confirm("是否刪除資料：" + row.content + "?")) {
                    create_quotation.deleteProjectAttachment({
                        id: row.id,
                        project_id: row.project_id
                    }).then(function() {
                        that.getProjectAttachments()
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            }
        },
        watch: {
            'project': function() {
                this.getProjectAttachments()
            }
        },
        ready() {
            if (this.project) {
                this.getProjectAttachments()
            }
        }
    }
</script>