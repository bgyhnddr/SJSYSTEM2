<template>
<div id="hourReport">
  <table>
    <thead>
      <tr>
        <th rowspan="2"></th>
        <th rowspan="2">報價號</th>
        <th rowspan="2">盤名</th>
        <th rowspan="2">工程項目</th>
        <th class="workdate" v-for="i in getLastDay()">
          {{i+getFirstDay()}}
        </th>
        <th rowspan="2">小計</th>
        <th rowspan="2">合計</th>
      </tr>
      <tr>
        <th class="workdate" v-for="i in getLastDay()">
          {{getDayOfWeek(i+getFirstDay())}}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="staff in list">
        <tr v-for="quotation in staff.quotations">
          <td v-if="$index==0" :rowspan="staff.quotations.length+1">
            {{staff.name}}
          </td>
          <td>{{quotation.no}}</td>
          <td>{{quotation.building.name}}</td>
          <td>{{quotation.project_type}}</td>
          <td v-for="i in getLastDay()">
            {{getHourOfDay(quotation,i+getFirstDay())}}
          </td>
          <td>{{quotation.lsum}}</td>
          <td></td>
        </tr>
        <tr>
          <td :colspan="getLastDay()+4"></td>
          <td>{{staff.sum}}</td>
        </tr>
</template>
  </tbody>
</table>
</div>
</template>
<script>
import view_quotation from '../api/view_quotation'
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    getHourReport() {
      var that = this
      var query = {
        year: that.$route.query.year,
        month: that.$route.query.month,
        manager: that.$route.query.manager
      }
      if (that.$route.query.front) {
        query.front = that.$route.query.front
      }
      view_quotation.getHourReport(query).then((result) => {
        that.list = result
      }).catch((err) => {
        window.alert(err)
      })
    },
    getFirstDay() {
      return this.$route.query.front ? 1 : 16
    },
    getLastDay() {
      if (this.$route.query.front) {
        return 15
      } else {
        var year = this.$route.query.year
        var month = this.$route.query.month
        var new_year = year; //取当前的年份
        var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) {
          new_month -= 12; //月份减
          new_year++; //年份增
        }
        var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate() - 15; //获取当月最后一天日期
      }
    },
    getDayOfWeek(date) {
      var day = new Date(this.$route.query.year + "-" + this.$route.query.month + "-" + date).getDay()
      switch (day) {
        case 1:
          return "一"
        case 2:
          return "二"
        case 3:
          return "三"
        case 4:
          return "四"
        case 5:
          return "五"
        case 6:
          return "六"
        case 0:
          return "日"
      }
    },
    getHourOfDay(quotation, day) {
      var date = new Date(this.$route.query.year + "-" + this.$route.query.month + "-" + day).Format("yyyy-MM-dd")
      var find = quotation.project_hours.filter(o => o.begin_date == date)
      return find.length > 0 ? find[0].hour : ""
    }
  },
  route: {
    data() {
      this.getHourReport()
    }
  }
}
</script>
<style>
#title {
  text-align: center;
  font-size: 10mm;
  text-decoration: underline;
}

#splitMonth {
  margin-left: 50mm;
}

#hourReport table {
  width: 297mm;
  border: 1px solid black;
  border-collapse: collapse;
  table-layout: fixed;
}

#hourReport table td {
  border: 1px solid black;
  word-wrap: break-word;
}

#hourReport table thead tr:nth-child(1) th:nth-child(1) {
  width: 15mm;
}

#hourReport table thead tr:nth-child(1) th:nth-child(2) {
  width: 40mm;
}

#hourReport table thead tr:nth-child(1) th:nth-last-child(1) {
  width: 15mm;
}

#hourReport table thead tr:nth-child(1) th:nth-last-child(2) {
  width: 15mm;
}

#hourReport table th.workdate {
  width: 9mm;
}

#hourReport table th {
  border: 1px solid black;
}

#hourReport .printContainer {
  width: 297mm;
  overflow: hidden;
  margin: auto;
  position: relative;
}

#hourReport @media print {
  .printHide {
    display: none;
  }
  #modelContent {
    min-height: 0;
    border: none;
  }
}
</style>
