<template>
    <button @click="addRole" class="btn btn-default">添加角色</button>
    <div style="position:relative">
        <spinner size="md" text="loading..."></spinner>
        <vue-strap-table :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
    </div>
    <modal :show.sync="showRoleModel" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
                添加角色
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <alert :type="alertType">
                {{alertText}}
            </alert>
            <form-group :valid.sync="valid.all">
                <bs-input v-if="!edit" :value.sync="code" label="編碼" required></bs-input>
                <bs-input v-else :value.sync="code" label="編碼" readonly></bs-input>
                <bs-input :value.sync="name" label="名稱" required></bs-input>
            </form-group>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click="showRoleModel=false">关闭</button>
            <button :disabled="submitting" type="button" class="btn btn-success" @click="submitRole">確認</button>
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
          {
              "header":"編碼",
              "bind":"code"
          },
          {
              "header":"名稱",
              "bind":"name"
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
      code:"",
      name:"",
      edit:false,
      showRoleModel:false,
      data:{},
      serverMsg:"",
      columns:columns
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
      addRole(){
          this.code = ""
          this.name = ""
          this.edit = false
          this.showRoleModel = true
      },
      submitRole(){
          if(this.valid.all)
          {
              var that = this
              that.submitting = true
              RBAC.submitRole({code:that.code,name:that.name}).then(function(result){
                  that.submitting = false
                  that.$broadcast("refreshData")
                  that.showRoleModel = false
                  that.serverMsg = ""
                  that.code=""
                  that.name=""
              },function(err){
                  that.submitting = false
                  that.serverMsg=err
              })
          }
      },
      editRole(code,name){
          this.code = code
          this.name = name
          this.edit = true
          this.showRoleModel = true
      },
      deleteRole(code){
          if(window.confirm("是否確認刪除："+code+"?")){
              var that = this
              RBAC.deleteRole({code:code}).then(function(result){
                  that.$broadcast("refreshData")
              },function(err){
                  window.alert(err)
              })
          }
      }
  },
  events:{
      "edit":function(row){
          this.editRole(row.code,row.name)
      },
      "delete":function(row){
          this.deleteRole(row.code)
      },
      "getData":function(pageNum,countPerPage,filterKey,append){
          let that = this
          that.$broadcast('show::spinner')
          RBAC.getRoles(pageNum,countPerPage,filterKey).then(function(result){
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