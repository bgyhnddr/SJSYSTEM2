<template>
<div class="vue-strap-table">
	<div class="table-responsive">
		<div v-show="hasFilter">
			<div class="col-sm-6">
				<bs-input @keyup.enter="getData" :value.sync="filterKey" @keyup.enter="getData" placeholder="輸入任意關鍵字進行搜索" type="text">
					<span slot="after" class="input-group-btn">
						<button type="button" @click="getData" class="btn btn-primary">搜索</button>
						<button type="button" @click="clearFilter" class="btn btn-default">清除</button>
					</span>
				</bs-input>
			</div>
		</div>
		<table class="table table-hover table-condensed">
			<thead>
				<tr>
					<th :class="{'hover':hasSort&&column.sortable}" @click="sorting(column)" v-for="column of columns | filterBy undefiend in 'hide'">
						{{ column.header }}
						<span class="glyphicon" :class="{'glyphicon-arrow-up':asc,'glyphicon-arrow-down':!asc}" v-if="hasSort&&sortCol==column.bind"></span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row of data.list">
					<td v-for="column of columns | filterBy undefiend in 'hide'">
						<template v-if="column.type == undefined || column.type == 'string'">
							<template v-if="column.format">{{{ column.format(row[column.bind],row) }}}
</template>
							<template v-else>
 {{ row[column.bind] }}
</template>
						</template>
						<template v-if="column.type == 'action'">
<template v-for="item in column.items">
	<template v-if="item.tag=='button'">
		<button v-if="item.filter?item.filter(row):true" @click="action(item.eventName,row)" class="{{item.class}} btn btn-default">{{item.text}}</button>
</template>
							</template>
						</template>
						<template v-if="column.type == 'index'">
 {{$parent.$index+1}}
</template>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- <button type="button" v-if="data.end===false" class="btn btn-default" @click="addData">更多...</button> -->
		<div v-if="!(data.end&&pageNum==0)">
		<button type="button" v-if="pageNum!==0" class="btn btn-default" @click="prev">上一页</button>
		<span>第{{pageNum+1}}页</span>
		<span>{{pageNum*countPerPage+1}}~{{pageNum*countPerPage+(data.list?data.list.length:0)}}</span>
		<button type="button" v-if="data.end===false" class="btn btn-default" @click="next">下一页</button>
		</div>
		<div v-if="errMsg">
			{{errMsg}}
		</div>
	</div>
</div>
</template>
<script>
import {
	input as bsInput
} from 'vue-strap'

export default {
	data() {
		return {
			sortCol: "",
			asc: false
		}
	},
	components: {
		bsInput
	},
	props: {
		pageNum: {
			type: Number,
			default: 0
		},
		countPerPage: {
			type: Number,
			default: 20
		},
		hasFilter: {
			type: Boolean,
			default: true
		},
		hasSort: {
			type: Boolean,
			default: true
		},
		filterKey: {
			type: String,
			default: ""
		},
		columns: {
			type: Array
		},
		getDataEvent: {
			type: String,
			default: 'getData'
		},
		data: {
			type: Object,
			default: {
				end: true,
				list: []
			}
		},
		errMsg: {
			type: String,
			default: ""
		}
	},
	methods: {
		hideHeader(obj) {
			return !obj.hide
		},
		prev() {
			if (this.pageNum > 0) {
				this.pageNum -= 1
			} else {
				this.pageNum = 0
			}

			this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
			this.$emit("getdata", this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
		},
		next() {
			if (!this.data.end) {
				this.pageNum += 1
			}

			this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
			this.$emit("getdata", this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
		},
		getData() {
			this.pageNum = 0
			this.errMsg = ""
			this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
			this.$emit("getdata", this.pageNum, this.countPerPage, this.filterKey, false, {
				sortCol: this.sortCol,
				asc: this.asc
			})
		},
		addData() {
			let that = this
			this.errMsg = ""
			this.pageNum += 1
			this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey, true, {
				sortCol: this.sortCol,
				asc: this.asc
			})
			this.$emit("getdata", this.pageNum, this.countPerPage, this.filterKey, true, {
				sortCol: this.sortCol,
				asc: this.asc
			})
		},
		action(event, row) {
			this.$dispatch(event, row)
			this.$emit("rowaction", event, row)
		},
		clearFilter() {
			this.filterKey = ""
			this.getData()
		},
		sorting(column) {
			if (this.hasSort && column.sortable) {
				if (this.sortCol == column.bind) {
					this.asc = !this.asc
				} else {
					this.sortCol = column.bind
					this.asc = true
				}
				this.getData()
			}
		}
	},
	events: {
		'refreshData': function() {
			this.getData()
		}
	}
}
</script>
<style>
.vue-strap-table {
	position: relative;
}

.hover:hover {
	background-color: #f5f5f5;
	cursor: pointer;
}
</style>
