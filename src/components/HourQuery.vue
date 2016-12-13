<template>
<div class="container-fluid">
  <label>工程負責人</label>
  <p>{{manager}}</p>
  <button v-if="!openManagerSelect" @click="openManagerSelect=true" class="btn btn-default">選擇</button>
  <button v-if="openManagerSelect" @click="openManagerSelect=false" class="btn btn-default">關閉</button>
  <project-manager-setting v-if="openManagerSelect" select-event="managerSelect" :selectable="true">
  </project-manager-setting>
  <bs-input style="width:140px" type="number" :value.sync="year" label="年份"></bs-input>
  <label>月份</label>
  <p>
    <v-select :value.sync="month">
      <v-option v-for="i in 12" :value="i+1">{{i+1}}</v-option>
    </v-select>
  </p>
  <p>
    <v-select :value.sync="front">
      <v-option value="up">上旬</v-option>
      <v-option value="down">下旬</v-option>
    </v-select>
  </p>
  <a v-if="vaild()" target="_blank" :href="'/#!/report/hours'+getQuery()" class="btn btn-default">查看報表</a>
</div>
</template>
<script>
import ProjectManagerSetting from './ProjectManagerSetting'
import {
  input as bsInput,
  select as vSelect,
  option as vOption
} from 'vue-strap'
export default {
  data() {
    return {
      manager: "",
      openManagerSelect: false,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      front: "up"
    }
  },
  components: {
    ProjectManagerSetting,
    bsInput,
    vSelect,
    vOption
  },
  methods: {
    vaild() {
      return this.manager && this.year && this.month
    },
    getQuery() {
      var query = "?manager=" + this.manager +
        "&year=" + this.year +
        "&month=" + this.month
      if (this.front == "up") {
        query += "&front=true"
      }
      return query
    }
  },
  events: {
    'managerSelect': function(row) {
      this.manager = row.user_account
      this.openManagerSelect = false
    }
  },
  ready() {}
}
</script>
