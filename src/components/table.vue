<template>
    <div style="position:relative">
        <spinner size="md" text="loading..."></spinner>
        <vue-strap-table :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
    </div>
</template>

<script>
import VueStrapTable from './extend/vue-strap-table'
import { spinner }  from 'vue-strap'
import test from '../api/test'

export default {
  components: {
    VueStrapTable,
    spinner
  },
  data () {
    return {
      data:{},
      columns:[
          {
              "header":"column1header",
              "bind":"column1",
              format(val)
              {
                  return val+"format"
              }
          },
          {
              "header":"column2header",
              "bind":"column2"
          },
          {
              "header":"column3header",
              "bind":"column3"
          },
          {
              "header":"column4header",
              "bind":"column4"
          },
          {
              "header":"column5header",
              "bind":"column5"
          },
          {
              "header":"action",
              "type":"action",
              "items":[
                  {
                      eventName:"edit",
                      tag:"button",
                      class:"btn-xs",
                      text:"編輯"
                  },
                  {
                      eventName:"delete",
                      tag:"button",
                      class:"btn-xs",
                      text:"刪除"
                  },
                  {
                      eventName:"test",
                      tag:"button",
                      class:"btn-xs",
                      text:"test"
                  }
              ]
          }
      ]
    }
  },
  events:{
      "edit":function(row)
      {
          window.alert("edit")
          window.alert(window.JSON.stringify(row))
      },
      "delete":function(row)
      {
          window.alert("delete")
      },
      "test":function(row)
      {
          window.alert("test")
      },
      "getData":function(pageNum,countPerPage,filterKey,append){
          let that = this
          that.$broadcast('show::spinner')
          test.getTestData('/getTestData',
          pageNum,
          countPerPage,
          filterKey).then(function(result){
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