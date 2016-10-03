<template>
    <button @click="addUserRole" class="btn btn-default">添加用戶角色</button>
    <div style="position:relative">
        <spinner size="md" text="loading..."></spinner>
        <vue-strap-table :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
    </div>
    <modal :show.sync="showUserRoleModel" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
                添加用戶角色
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <alert :type="alertType">
                {{alertText}}
            </alert>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click="showUserRoleModel=false">关闭</button>
            <button :disabled="submitting" type="button" class="btn btn-success" @click="submitUserRole">確認</button>
        </div>
    </modal>
</template>

<script>
import VueStrapTable from './extend/vue-strap-table'
import { spinner,modal,formGroup,alert,input as bsInput }  from 'vue-strap'
import RBAC from '../api/RBAC'

export default {
  props:{
      user:{
          type:String,
          require:true
      }
  },
  components: {
    VueStrapTable,
    spinner,
    modal,
    formGroup,
    alert,
    bsInput
  },
  data () {
    return {
      submitting:false,
      getData:"getData",
      valid:{},
      role_code:"",
      edit:false,
      showUserRoleModel:false,
      data:{},
      serverMsg:"",
      columns:[
          {
              "header":"編碼",
              "bind":"user_account"
          },
          {
              "header":"名稱",
              "bind":"role_code"
          },
          {
              "header":"創建日期",
              "bind":"created_at"
          },
          {
              "header":"修改時間",
              "bind":"updated_at"
          },
          {
              "header":"操作",
              "type":"action",
              "items":[
                  {
                      eventName:"edit",
                      tag:"button",
                      class:"btn-xs",
                      text:"修改"
                  },
                  {
                      eventName:"delete",
                      tag:"button",
                      class:"btn-xs",
                      text:"刪除"
                  }
              ]
          }
      ]
    }
  },
  computed: {
        alertType(){
            return this.valid.all?"success":"warning"
        },
        alertText(){
            if(this.serverMsg)
            {
                return this.serverMsg;
            }
            let returnText = "請輸入";
            if(!this.valid.all)
            {
                returnText= "請輸入"
            }
            return returnText
        }
  },
  methods:{
      addUserRole(){
          this.code = ""
          this.name = ""
          this.edit = false
          this.showUserRoleModel = true
      },
      submitUserRole(){
          if(this.valid.all)
          {
              var that = this
              that.submitting = true
              RBAC.submitUserRole({code:that.code,name:that.name}).then(function(result){
                  that.submitting = false
                  that.$broadcast("refreshData")
                  that.showUserRoleModel = false
                  that.serverMsg = ""
                  that.code=""
                  that.name=""
              },function(err){
                  that.submitting = false
                  that.serverMsg=err
              })
          }
      },
      editUserRole(code,name){
          this.code = code
          this.name = name
          this.edit = true
          this.showUserRoleModel = true
      },
      deleteUserRole(code){
          if(window.confirm("是否確認刪除："+code+"?")){
              var that = this
              RBAC.deleteUserRole({code:code}).then(function(result){
                  that.$broadcast("refreshData")
              },function(err){
                  window.alert(err)
              })
          }
      }
  },
  events:{
      "edit":function(row){
          this.editUserRole(row.code,row.name)
      },
      "delete":function(row){
          this.deleteUserRole(row.code)
      },
      "getData":function(pageNum,countPerPage,filterKey,append){
          let that = this
          that.$broadcast('show::spinner')
          RBAC.getUserRoles(pageNum,countPerPage,filterKey).then(function(result){
              that.$broadcast('hide::spinner')
              if(append){
                  that.data.end = result.end
                  that.data.list=that.data.list.concat(result.list)
              }
              else{
                  that.data = result
              }
          },function(){
              that.$broadcast('hide::spinner')
          }).catch(function(){
              that.$broadcast('hide::spinner')
          })
      }
  }
}
</script>