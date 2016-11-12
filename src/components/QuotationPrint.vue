<template>
	<div class="printContainer">
		<div class="printHide">
			<input type="button" onclick="window.print()" value="打印" />
			<select v-model="lang">
                <option value="zh">中文</option>
                <option value="en">English</option>
            </select>
		</div>
		<div id="seal">
			<img src="../assets/img/Chop.png" id="sealImg">
			<div id="draft">DRAFT</div>
		</div>
		<div class="header">
			<img class="headlogo" src="../assets/img/logo.png" />
		</div>
		<div id="mainContent" class="mainTable">
			<div class="QTitle">Quotation</div>
			<table style="width: 100%">
				<thead>
					<tr>
						<th style="width: 10%"></th>
						<th style="width: 22%"></th>
						<th style="width: 5%"></th>
						<th style="width: 22%"></th>
						<th style="width: 16%"></th>
						<th style="width: 16%"></th>
					</tr>
				</thead>
				<tr>
					<td class="bold">
						To:
					</td>
					<td v-if="lang=='en'" colspan="3" class="tableleft">
						{{project.quotation.property_management_co_name_en}}
					</td>
					<td v-else colspan="3" class="tableleft">
						{{project.quotation.property_management_co_name}}
					</td>
					<td class="tableRight bold">
						Quotation No:
					</td>
					<td class="tableRight">
						{{project.quotation_no}}
					</td>
				</tr>
				<tr>
					<td class="bold">Re:
					</td>
					<td v-if="lang=='en'" colspan="3" class="tableleft">
						{{project.quotation.building.name_en}}
					</td>
					<td v-else colspan="3" class="tableleft">
						{{project.quotation.building.name}}
					</td>
					<td class="tableRight bold">Date:
					</td>
					<td class="tableRight">
						{{formatDate(project.quotation.quotation_date)}}
					</td>
				</tr>
				<tr>
					<td class="bold">
						Add:
					</td>
					<td v-if="lang=='en'" colspan="3" class="tableleft">
						{{project.quotation.building.address_en}}
					</td>
					<td v-else colspan="3" class="tableleft">
						{{project.quotation.building.address}}
					</td>
					<td class="tableRight bold">In Charge:
					</td>
					<td class="tableRight">
						{{project.quotation.manager}}
					</td>
				</tr>
				<tr>
					<td class="bold">Attn:
					</td>
					<td v-if="lang=='en'" colspan="3" class="tableleft">
						{{project.quotation.building.attn_en}}
					</td>
					<td v-else colspan="3" class="tableleft">
						{{project.quotation.building.attn}}
					</td>
					<td class="tableRight bold">Prepared By:
					</td>
					<td class="tableRight">
						{{prepared_by}}
					</td>
				</tr>
				<tr>
					<td class="bold">Tel:
					</td>
					<td class="tableleft">
						{{project.quotation.building.tel}}
					</td>
					<td class="bold">Fax:
					</td>
					<td class="tableleft">
						{{project.quotation.building.fax}}
					</td>
				</tr>
				<tr>
					<td class="bold">Email:
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
								<th>Item No</th>
								<th>Descrption</th>
								<th>
									<div>Qty</div>
									<div>Pcs</div>
								</th>
								<th>
									<div>Unit</div>
									<div>Price</div>
								</th>
								<th>
									<div>Amount</div>
									<div>HK$</div>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td colspan="4" class="bold underline">{{project.quotation.project_name}}</td>
							</tr>
							<tr v-for="item in project.quotation.quotation_jobs">
								<td class="tableCenter">{{item.index}}</td>
								<td><label>{{item.content}}</label></td>
								<td class="tableCenter"><label>{{item.count?item.count:""}}</label></td>
								<td class="tableCenter"><label>{{item.count?item.retail:""}}</label></td>
								<td class="tableCenter"><label>{{item.count?item.count*item.retail:""}}</label></td>
							</tr>
							<tr>
								<td colspan="3"></td>
								<td class="tableCenter">
									<div style="margin-top:20px">
										TOTAL:
									</div>
								</td>
								<td class="tableCenter">
									<div class=" total" style="margin-top:20px">
										{{total}}
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
				<table style="width:100%">
					<tbody>
						<tr>
							<td style="width:50px;vertical-align:top;text-align:right">
								<div>註:</div>
							</td>
							<td>
								<div style='font-family: "Microsoft JhengHei UI";font-size: 10pt;' v-el:comments @input="commentsChange" contenteditable="true" id="modelContent"></div>
							</td>
						</tr>
					</tbody>
				</table>
                <div class="sign">
					<table id="signTable">
						<tbody>
							<tr>
								<td style="width: 50%">Confirmed By :
								</td>
								<td style="width: 50%">
									<div class="bold">順基工程有限公司</div>
									<div class="bold">Smooth Prospect Engineering Limited</div>
								</td>
							</tr>
							<tr>
								<td>
									<div style="border-bottom: 1px dotted black; width: 70%; margin: auto; height: 15mm;"></div>
								</td>
								<td>
									<div style="border-bottom: 1px dotted black; width: 70%; margin: auto; height: 15mm;"></div>
								</td>
							</tr>
							<tr>
								<td class="bold">Please sign with Co. chop & return copy
								</td class="bold">
								<td>Signature & Co. Chop
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
    import create_quotation from '../api/create_quotation'
    export default {
        data() {
            return {
                project: {
                    quotation: {
                        quotation_jobs: [],
                        building: {}
                    }
                },
                projectInfo: {},
                isEn: false,
                lang: "zh",
                prepared_by: "",
                total: 0,
                currentComments: "",
                commentsList: [],
                submitCommentsText: "",
                changed: false
            }
        },
        methods: {
            getProject(id) {
                var that = this
                return view_quotation.getProject({
                    id: id
                }).then((result) => {
                    that.project = result
                    that.alertText = ""
                    that.getPreparedBy(that.project.quotation_no)


                    that.total = that.project.quotation.quotation_jobs.reduce((sum, o) => {
                        return sum += o.retail * o.count
                    }, 0)
                }).catch((err) => {
                    window.alert(err)
                })
            },
            getProjectConfirmInfo(id) {
                var that = this
                return view_quotation.getProjectConfirmInfo(id).then(function(result) {
                    that.projectInfo = result
                }).catch((err) => {
                    window.alert(err)
                })
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
                var day = date.getDay().toString()
                if (day.length == 1) {
                    day = "0" + day
                }

                return day + "-" + months[date.getMonth()] + "-" + date.getFullYear()
            },
            getComments() {
                var that = this
                view_quotation.getComments().then((result) => {
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
                create_quotation.submitComments({
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
                    create_quotation.deleteComments({
                        code: that.currentComments
                    }).then(() => {
                        that.currentComments = ""
                        that.getComments()
                    }).catch((err) => {
                        window.alert(err)
                    })
                }
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
            this.getProject(this.$route.params.id)
            this.getProjectConfirmInfo(this.$route.params.id)
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
        min-height: 100mm;
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
