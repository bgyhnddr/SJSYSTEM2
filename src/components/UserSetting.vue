<template>
    <button @click="addUser" class="btn btn-default">添加用戶</button>
    <div style="position:relative">
        <spinner size="md" text="loading..."></spinner>
        <vue-strap-table :data.sync="data" :get-data-event="getData" :columns="columns"></vue-strap-table>
    </div>
    <modal :show.sync="showUserModel" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
                添加用戶
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <alert :type="alertType">
                {{alertText}}
            </alert>
            <form-group :valid.sync="valid.account">
                <bs-input :value.sync="account" label="账号" required></bs-input>
            </form-group>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click="showUserModel=false">关闭</button>
            <button :disabled="submitting" type="button" class="btn btn-success" @click="submitAddAccount">創建</button>
        </div>
    </modal>
</template>

<script>
import VueStrapTable from './extend/vue-strap-table'
import { spinner,modal,formGroup,alert,input as bsInput }  from 'vue-strap'
import RBAC from '../api/RBAC'

export default {
  props:{
      selectable:{
          type:Boolean,
          default:false
      },
      selectEvent:{
          type:String,
          default:'select'
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
      let columns= [ 
                { "header":"賬號", "bind":"account" }, 
                { "header":"密碼", "bind":"password" }, 
                { "header":"創建日期", "bind":"created_at"}, 
                { "header":"修改時間", "bind":"updated_at" }, 
                { "header":"操作", "type":"action", "items":[ 
                    { 
                        eventName:"reset", 
                        tag:"button",
                        class:"btn-xs", 
                        text:"重置密碼" 
                    }, 
                    { 
                        eventName:"delete", 
                        tag:"button", 
                        class:"btn-xs", 
                        text:"刪除" 
                    }
                ]}
            ]
            if(this.selectable){ 
                columns.unshift({ "header":"", "type":"action", "items":[ 
                    { 
                        eventName:this.selectEvent, 
                        tag:"button",
                        class:"btn-xs", 
                        text:"選擇" 
                    }] 
                }) 
            }
      return {
      submitting:false,
      getData:"getData",
      valid:{},
      account:"",
      showUserModel:false,
      data:{},
      serverMsg:"",
      columns:columns
    }
  },
  computed: {
        alertType(){
            return this.valid.account?"success":"warning"
        },
        alertText(){
            if(this.serverMsg)
            {
                return this.serverMsg;
            }
            let returnText = "请输入创建账户";
            if(!this.valid.account)
            {
                returnText= "请输入创建账户"
            }
            return returnText
        }
  },
  methods:{
      addUser(){
          this.account = ""
          this.showUserModel = true
      },
      submitAddAccount(){
          if(this.valid.account)
          {
              var that = this
              that.submitting = true
              RBAC.addUser({account:that.account}).then(function(result){
                  that.$broadcast("refreshData")
                  that.showUserModel = false
                  that.submitting = false
              },function(err){
                  that.serverMsg=err
                  that.submitting = false
              })
          }
      },
      resetPassword(account){
          if(window.confirm("是否確認重置："+account+"的密碼?")){
              var that = this
              RBAC.resetPassword({account:account}).then(function(result){
                  that.$broadcast("refreshData")
              },function(err){
                  window.alert(err)
              })
          }
      },
      deleteUser(account){
          if(window.confirm("是否確認刪除："+account+"?")){
              var that = this
              RBAC.deleteUser({account:account}).then(function(result){
                  that.$broadcast("refreshData")
              },function(err){
                  window.alert(err)
              })
          }
      }
  },
  events:{
      "delete":function(row){
          this.deleteUser(row.account)
      },
      "getData":function(pageNum,countPerPage,filterKey,append){
          let that = this
          that.$broadcast('show::spinner')
          RBAC.getUsers(pageNum,countPerPage,filterKey).then(function(result){
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
      },
      'reset':function(row){
          this.resetPassword(row.account)
      }
  }
}
</script>