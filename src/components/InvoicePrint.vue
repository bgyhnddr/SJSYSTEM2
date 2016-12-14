<template>
<div class="printContainer">
  <div class="printHide">
    <input type="button" onclick="window.print()" value="打印" />
    <input type="button" @click="saveSnap" value="保存" />
    <select v-model="lang">
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  </div>
  <div id="seal">
    <img src="../assets/img/Chop.png" id="sealImg">
  </div>
  <div class="header">
    <img class="headlogo" src="../assets/img/logo.png" />
  </div>
  <div id="mainContent" class="mainTable">
    <div v-if="lang=='en'" class="QTitle">Invoice</div>
    <div v-else class="QTitle">發票</div>
    <table style="width: 100%">
      <thead>
        <tr>
          <th style="width: 12%"></th>
          <th style="width: 20%"></th>
          <th style="width: 5%"></th>
          <th style="width: 22%"></th>
          <th style="width: 16%"></th>
          <th style="width: 16%"></th>
        </tr>
      </thead>
      <tr>
        <td v-if="lang=='en'" class="bold">
          Send:
        </td>
        <td v-else class="bold ximingti">
          致：
        </td>
        <td colspan="3" class="tableleft">
          <span class="printShow hide">{{project.project_invoice.send}}</span>
          <input class="printHide" v-model="project.project_invoice.send" />
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Invoice No:
        </td>
        <td v-else class="bold tableRight ximingti">
          發票編號：
        </td>
        <td class="tableRight">
          {{project.project_invoice.no}}
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">
          Bill To:
        </td>
        <td v-else class="bold ximingti">
          發票致：
        </td>
        <td colspan="3" class="tableleft">
          <span class="printShow hide">{{project.project_invoice.billTo}}</span>
          <input class="printHide" v-model="project.project_invoice.billTo" />
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Invoice Date:
        </td>
        <td v-else class="bold tableRight ximingti">
          發票日期：
        </td>
        <td class="tableRight">
          {{project.project_invoice.create_date}}
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Re:
        </td>
        <td v-else class="bold ximingti">工程地點：
        </td>
        <td v-if="lang=='en'" colspan="3" class="tableleft">
          {{project.quotation.building.name_en}}
        </td>
        <td v-else colspan="3" class="tableleft">
          {{project.quotation.building.name}}
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Works Order:
        </td>
        <td v-else class="bold tableRight ximingti">
          工程單編號：
        </td>
        <td class="tableRight">
          <span class="printShow hide">{{project.project_invoice.worksOrder}}</span>
          <input class="printHide" v-model="project.project_invoice.worksOrder" />
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Add:
        </td>
        <td v-else class="bold ximingti">工程地址：
        </td>
        <td v-if="lang=='en'" colspan="3" class="tableleft">
          <span class="printShow hide">{{project.quotation.building.address_en}}</span>
          <input class="printHide" v-model="project.quotation.building.address_en" />
        </td>
        <td v-else colspan="3" class="tableleft">
          <span class="printShow hide">{{project.quotation.building.address}}</span>
          <input class="printHide" v-model="project.quotation.building.address" />
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Quotation No:
        </td>
        <td v-else class="bold tableRight ximingti">
          報價單編號：
        </td>
        <td class="tableRight">
          {{project.quotation_no}}
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Attn:
        </td>
        <td v-else class="bold ximingti">收件人
        </td>
        <td v-if="lang=='en'" colspan="3" class="tableleft">
          {{project.quotation.building.attn_en}}
        </td>
        <td v-else colspan="3" class="tableleft">
          {{project.quotation.building.attn}}
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Completed Date:
        </td>
        <td v-else class="bold tableRight ximingti">
          完工日期：
        </td>
        <td class="tableRight">
          <span class="printShow hide">{{project.project_invoice.completedDate}}</span>
          <input type="date" class="printHide" v-model="project.project_invoice.completedDate" />
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Tel:
        </td>
        <td v-else class="bold ximingti">電話：
        </td>
        <td class="tableleft">
          {{project.quotation.building.tel}}
        </td>
        <td v-if="lang=='en'" class="bold">Fax:
        </td>
        <td v-else class="bold ximingti">傳真
        </td>
        <td class="tableleft">
          {{project.quotation.building.fax}}
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          Completed No:
        </td>
        <td v-else class="bold tableRight ximingti">
          完工單編號：
        </td>
        <td class="tableRight">
          <span class="printShow hide">{{project.project_invoice.completedNo}}</span>
          <input class="printHide" v-model="project.project_invoice.completedNo" />
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Mgt:
        </td>
        <td v-else class="bold ximingti">管理處
        </td>
        <td class="tableleft">
          {{project.quotation.building.mgt_tel}}
        </td>
        <td class="bold">
        </td>
        <td class="tableleft">
          {{project.quotation.building.mgt_fax}}
        </td>
        <td v-if="lang=='en'" class="tableRight bold">
          In Charge:
        </td>
        <td v-else class="bold tableRight ximingti">
          負責人
        </td>
        <td class="tableRight">
          {{project.quotation.manager}}
        </td>
      </tr>
      <tr>
        <td v-if="lang=='en'" class="bold">Email:
        </td>
        <td v-else class="bold ximingti">電郵地址：
        </td>
        <td colspan="3" class="tableleft">
          {{project.quotation.building.email}}
        </td>
      </tr>
    </table>
    <div id="projectContent">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr class="bold underline tableCenter">
              <th v-if="lang=='en'">Item No</th>
              <th v-else>項目</th>
              <th v-if="lang=='en'">Descrption</th>
              <th v-else>内容</th>
              <th v-if="lang=='en'">
                <div>Qty</div>
                <div>Pcs</div>
              </th>
              <th v-else>數量</th>
              <th v-if="lang=='en'">
                <div>Unit</div>
                <div>Price</div>
              </th>
              <th v-else>單價</th>
              <th v-if="lang=='en'">
                <div>Amount</div>
                <div>HK$</div>
              </th>
              <th style="width:200px" v-else>金額（港幣 HK$）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td colspan="4" class="bold underline">{{project.quotation.project_name}}</td>
            </tr>
            <tr v-for="item in project.project_invoice.project_invoice_details">
              <td class="tableCenter">{{$index+1}}</td>
              <td>
                <span class="printShow hide">{{item.quotation_job.content}}</span>
                <input class="printHide" v-model="item.quotation_job.content" />
              </td>
              <td class="tableCenter">
                <span class="printShow hide">{{(item.quotation_job.count&&item.quotation_job.count!='0')?item.quotation_job.count:""}}</span>
                <input style="width:50px" type="number" class="printHide" v-model="item.quotation_job.count" />
              </td>
              <td class="tableCenter">
                <span class="printShow hide">{{(item.quotation_job.count&&item.quotation_job.count!='0')?formatCurrency(item.quotation_job.retail):""}}</span>
                <input style="width:50px" type="number" class="printHide" v-model="item.quotation_job.retail" />
              </td>
              <td class="tableCenter">
                <label>{{(item.quotation_job.count&&item.quotation_job.count!='0')?formatCurrency(item.quotation_job.count*item.quotation_job.retail):""}}</label>
              </td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2" class="tableCenter">
                <div v-if="lang=='en'" style="margin-top:20px">
                  TOTAL:
                </div>
                <div v-else style="margin-top:20px">
                  總額：
                </div>
              </td>
              <td class="tableCenter">
                <div class="total" style="margin-top:20px">
                  {{countTotal()}}
                </div>
              </td>
            </tr>
            <tr v-for="item in project.customList">
              <td colspan="2" class="tableRight">
                <button class="printHide" @click="deleteCount(item)">刪除</button>
              </td>
              <td colspan="2" class="tableCenter">
                <div>
                  <input class="printHide" v-model="item.name" />
                  <span class="printShow hide">{{item.name}}</span>
                </div>
              </td>
              <td class="tableCenter">
                <div>
                  <input class="printHide" type="number" v-model="item.value" />
                  <span class="printShow hide">{{formatCurrency(item.value)}}</span>
                </div>
              </td>
            </tr>
            <tr class="printHide">
              <td colspan="4"></td>
              <td class="tableCenter">
                <button @click="addCount">添加内容</button>
              </td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2" class="tableCenter">
                <div v-if="lang=='en'" style="margin-top:20px">
                  Balance due:
                </div>
                <div v-else style="margin-top:20px">
                  發票總額：
                </div>
              </td>
              <td class="tableCenter">
                <div class="due" style="margin-top:20px">
                  {{countBalanceDue()}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <div class="printHide">
        <div>
          <select v-model="currentComments">
            <option value="">新增</option>
            <option :value="item.code" v-for="item in commentsList">
              {{item.code}}
            </option>
          </select>
          <button v-if="changed" @click="submitComments">保存</button>
          <button @click="deleteComments()">刪除</button>
        </div>
      </div>
      <div class="sign">
        <table id="signTable">
          <tbody>
            <tr>
              <td style='width: 50%;font-family: "Microsoft JhengHei UI";font-size: 10pt;text-align: left;'>付款方式 :
              </td>
              <td style="width: 50%">
                <div class="bold">順基工程有限公司</div>
                <div class="bold">Smooth Prospect Engineering Limited</div>
              </td>
            </tr>
            <tr>
              <td rowspan="2">
                <div style='font-family: "Microsoft JhengHei UI";font-size: 10pt;text-align: left;' v-el:comments @input="commentsChange" contenteditable="true" id="modelContent"></div>
              </td>
              <td>
                <div style="border-bottom: 1px dotted black; width: 70%; margin: auto;height:130px"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import view_quotation from '../api/view_quotation'
import invoice from '../api/invoice'
export default {
  data() {
    return {
      project: {
        quotation: {
          building: {}
        },
        project_invoice: {
          project_invoice_details: []
        },
        customList: []
      },
      isEn: false,
      lang: "zh",
      prepared_by: "",
      currentComments: "",
      commentsList: [],
      submitCommentsText: "",
      changed: false
    }
  },
  methods: {
    getInvoice(id) {
      var that = this
      return view_quotation.getInvoice({
        id: id
      }).then((result) => {
        for (var k in result) {
          that.project[k] = result[k]
        }
        that.alertText = ""
        that.getPreparedBy(that.project.quotation_no)
      }).catch((err) => {
        window.alert(err)
      })
    },
    countTotal() {
      return this.formatCurrency(this.project.project_invoice.project_invoice_details.reduce((sum, o) => {
        return sum += o.quotation_job.retail * o.quotation_job.count
      }, 0))
    },
    getPreparedBy(quotation_no) {
      var that = this
      return view_quotation.getPreparedBy({
        quotation_no: quotation_no
      }).then(function(result) {
        that.prepared_by = result
      }).catch((err) => {
        window.alert(err)
      })
    },
    formatDate(stringDate) {
      var date = new Date(stringDate)
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      var day = date.getDate().toString()
      if (day.length == 1) {
        day = "0" + day
      }

      return day + "-" + months[date.getMonth()] + "-" + date.getFullYear()
    },
    formatCurrency(num) {
      num = num.toString().replace(/\$|\,/g, '');
      if (isNaN(num))
        num = "0";
      var sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * 100 + 0.50000000001);
      var cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10)
        cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
      return (((sign) ? '' : '-') + num + '.' + cents);
    },
    getComments() {
      var that = this
      view_quotation.getInvoiceComments().then((result) => {
        that.commentsList = result
        if (result.length > 0 && !that.currentComments) {
          that.currentComments = result[0].code
        }
      }).catch((err) => {
        window.alert(err)
      })
    },
    commentsChange(event) {
      this.changed = true
      this.submitCommentsText = event.currentTarget.innerText
    },
    submitComments() {
      var that = this
      if (!that.currentComments) {
        var code = prompt("請輸入備注名")
        if (code) {
          that.currentComments = code
        }
      }
      invoice.submitInvoiceComments({
        code: that.currentComments,
        content: that.submitCommentsText
      }).then(() => {
        that.getComments()
        that.changed = false
      }).catch((err) => {
        window.alert(err)
      })
    },
    deleteComments() {
      if (confirm("是否確認刪除備注?")) {
        var that = this
        invoice.deleteInvoiceComments({
          code: that.currentComments
        }).then(() => {
          that.currentComments = ""
          that.getComments()
        }).catch((err) => {
          window.alert(err)
        })
      }
    },
    saveSnap() {
      invoice.saveInvoiceSnapshot({
        id: this.project.project_invoice.id,
        content: JSON.stringify(this.project)
      }).then(() => {
        window.alert("saved")
      })
    },
    addCount() {
      var list = this.project.customList
      list.push({
        name: "",
        value: ""
      })
      this.project.customList = list
    },
    deleteCount(item) {
      this.project.customList.$remove(item)
    },
    countBalanceDue() {
      var total = this.project.project_invoice.project_invoice_details.reduce((sum, o) => {
        return sum += o.quotation_job.retail * o.quotation_job.count
      }, 0)
      return this.formatCurrency(this.project.customList.reduce((sum, o) => {
        return sum + (parseFloat(o.value) ? parseFloat(o.value) : 0)
      }, total))
    }
  },
  watch: {
    'currentComments': function(val) {
      console.log(val)
      if (val && this.commentsList.length > 0) {
        var list = this.commentsList.filter(o => o.code == val)
        if (list.length > 0) {
          this.submitCommentsText =
            this.$els.comments.innerText =
            list[0].content
        }
      } else {
        this.submitCommentsText =
          this.$els.comments.innerText = ""
      }
    }
  },
  ready() {
    this.getInvoice(this.$route.params.id)
    this.getComments()
  }
}
</script>
<style>
.printContainer {
  width: 210mm;
  overflow: hidden;
  margin: auto;
  position: relative;
}

.printContainer header {
  text-align: center;
}

img.headlogo {
  width: 210mm;
}

#modelContent {
  min-height: 130px;
  border: 1px solid black;
}

.QTitle {
  text-align: center;
  font-size: 28pt;
  text-decoration: underline;
  font-family: "Times New Roman", Georgia, Serif;
}

.mainTable {
  font-size: 12pt;
  font-family: "Times New Roman", Georgia, Serif;
}

.total {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.due {
  border-top: 1px solid black;
  border-bottom-style: double;
}

#seal {
  position: absolute;
  bottom: 0;
  right: 17mm;
  width: 70mm;
  height: 50mm;
  text-align: center;
}

#sealImg {
  width: 50mm;
  height: 50mm;
}

#draft {
  color: red;
  font-size: 20mm;
  margin-top: 21mm;
  border: 2mm solid;
  border-radius: 3mm;
}

.tableleft {
  text-align: left;
}

.tableRight {
  text-align: right;
}

.tableCenter {
  text-align: center;
}

.bold {
  font-weight: bold
}

.underline {
  text-decoration: underline
}

#projectContent {
  margin-top: 25px;
}

#projectContent>div>table {
  width: 100%;
  text-align: left;
  table-layout: fixed;
}

#projectContent>div>table td {
  word-wrap: break-word;
}

#projectContent>div>table th:nth-child(1) {
  width: 10%;
}

#projectContent>div>table th:nth-child(2) {
  width: 50%;
}

#projectContent>div>table th:nth-child(3) {
  width: 13%;
}

#projectContent>div>table th:nth-child(4) {
  width: 12%;
}

#projectContent>div>table th:nth-child(5) {
  width: 15%;
}

#signTable {
  text-align: center;
  width: 100%;
}

#signTable td {
  vertical-align: top;
}

.footer {
  margin-top: 10mm;
}

.ximingti {
  font-family: MingLiU
}

#projectName {
  text-decoration: underline;
  font-size: 6mm;
}

#total {
  margin-top: 20px;
  text-align: right;
}

.hide {
  display: none;
}

@media print {
  .printHide {
    display: none;
  }
  #modelContent {
    min-height: 0;
    border: none;
  }
  .printShow {
    display: block;
  }
}
</style>
