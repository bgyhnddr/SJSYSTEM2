<template>
    <div>
        <a target="_blank" href="{{href}}">{{filename}}</a>
        <input v-model="file" v-el:uploadinput v-show="false" type="file" />
        <button @click="chooseFile" class="btn btn-default btn-xs">選擇文件</button>
        {{file}}
        <label v-if="uploading">{{percent+"%"}}</label>
        <button v-if="file" @click="upload" class="btn btn-default btn-xs">開始上傳</button>
        <button v-if="uploading" @click="cancelUpload" class="btn btn-default btn-xs">取消</button>
    </div>
</template>
<script>
    import Vue from 'vue'

    export default {
        props: {
            fileId: {
                type: String,
                default: ""
            },
            percent: {
                type: Number,
                default: 0
            },
            msg: {
                type: String,
                default: ""
            },
            uploading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                file: "",
                filename: "",
                uploadRequest: undefined
            }
        },
        computed: {
            href() {
                return "/service/private/view_quotation/getAttachment?id=" + this.fileId
            }
        },
        methods: {
            chooseFile() {
                this.$els.uploadinput.click()
            },
            upload() {
                var that = this
                var formData = new FormData();
                formData.append('ufile', this.$els.uploadinput.files[0])
                that.uploading = true
                Vue.http.post('/service/private/upload/file', formData, {
                    progress: function(event) {
                        that.percent = Math.round((event.loaded / event.total) * 100)
                    },
                    before(request) {
                        that.uploadRequest = request
                    }
                }).then(function(result) {
                    that.clear()
                    console.log(result)
                    if (result.body) {
                        that.fileId = result.body.id
                        that.filename = result.body.name
                    }
                }).catch(function(error) {
                    that.clear()
                    console.log(error)
                })
            },
            cancelUpload() {
                if (this.uploadRequest) {
                    this.uploadRequest.abort()
                    this.clear()
                }
            },
            clear() {
                this.uploading = false
                this.percent = 0
                this.uploadRequest = undefined
                this.file = ""
            }
        }
    }
</script>