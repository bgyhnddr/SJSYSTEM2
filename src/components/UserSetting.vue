<template>
    <h3>用戶</h3>
    <button @click="addUser" class="btn btn-default">添加用戶</button>
    <div style="position:relative">
        <spinner size="md" text="loading..."></spinner>
        <vue-strap-table :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
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
            <button type="button" class="btn btn-success" @click="submitAddAccount">創建</button>
        </div>
    </modal>
</template>

<script>
import VueStrapTable from './extend/vue-strap-table'
import { spinner,modal,formGroup,alert,input as bsInput }  from 'vue-strap'
import RBAC from '../api/RBAC'

export default {
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
      valid:{},
      account:"",
      showUserModel:false,
      data:{},
      serverMsg:"",
      columns:[
          {
              "header":"賬號",
              "bind":"account"
          },
          {
              "header":"密碼",
              "bind":"password"
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
              "header":"action",
              "type":"action",
              "items":[
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
        show: 
        { 
            get () 
            { 
                return this.isShowLoginModal 
            }, 
            set (val) { 
                if(!val)
                {
                    this.hideLoginModal()
                }
            } 
        },
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
              window.alert(this.account)
          if(this.valid.account)
          {
              var that = this
              RBAC.addUser({account:that.account}).then(function(result){
                  that.$broadcast("refreshData")
                  that.showUserModel = false
              },function(err){
                  that.serverMsg=err
              })
          }
      },
      deleteUser(account){
          var that = this
          RBAC.deleteUser({account:account}).then(function(result){
              that.$broadcast("refreshData")
          },function(err){
              that.serverMsg=err
          })
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
      }
  }
}
</script>