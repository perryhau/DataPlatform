<template>
	<div :id="'table_'+index" class="table_con table-responsive" v-show="currentData.type.indexOf('table') !== -1">
		<table v-for="(outerTableIndex, tableItem) in tableData" class="table table-bordered table-hover" :class="{'table-nobordered': tableData[outerTableIndex].nobordered}" role="grid" aria-describedby="dataTables_info">
			<thead>
				<tr v-if="outerTableIndex === 0">
					<th v-for="(captionIndex, captionItem) in tableItem.cols" v-show="tableColControl[captionIndex]">{{captionItem.caption}} <i v-show="captionItem.caption !== ' ' && captionItem.help" style="opacity: 0.8;cursor: pointer;" class="fa fa-question-circle-o" v-tips="{direction: 'top', msg: captionItem.help}"></i></th>
				</tr>
				<tr v-else>
					<th v-for="(captionIndex, captionItem) in tableItem.cols">{{captionItem.caption}} <i v-show="captionItem.caption !== ' ' && captionItem.help" style="opacity: 0.8;cursor: pointer;" class="fa fa-question-circle-o" v-tips="{direction: 'top', msg: captionItem.help}"></i></th>
				</tr>
			</thead>
			<tbody v-if="tableItem.data.length !== 0">
				<tr v-for="(tableIndex, tableBody) in tableItem.data">
					<td 
					v-for="(tableKey, tableCell) in tableItem.rows"
					v-show="tableColControl[tableKey] || outerTableIndex !== 0"
					v-if="isSpan(tableItem.config || [], tableIndex, getIndexByKey(tableItem.rows,tableKey))"
					:colspan="getColspan(tableItem.config || [], tableIndex, getIndexByKey(tableItem.rows,tableKey))"
					:rowspan="getRowspan(tableItem.config || [], tableIndex, getIndexByKey(tableItem.rows,tableKey))"
					>
					<span @click="tableOperation(tableBody[tableCell], tableBody, tableItem.rows[1])">{{{tableBody[tableCell] | toThousands}}}
					</span>
				</td>
			</tr>
		</tbody>
		<tbody v-else>
			<tr>
				<td :colspan="tableItem.cols.length">暂无数据</td>
			</tr>
		</tbody>
	</table>
	<m-pagination :pagination-conf="paginationConf"></m-pagination>
</div>
</template>
<style scoped>
	.table_con {}

	.table_con td,
	.table_con th {
		box-sizing: border-box;
		/*max-width: 200px;*/
		min-width: 120px;
		/*overflow: hidden;
		text-overflow: ellipsis;*/
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		white-space: nowrap;
	}

	.table_con td[rowspan] {
		vertical-align: middle;
	}

	.table-nobordered {
	    border: 0px solid #ddd;
	}
	.table-nobordered>tbody>tr>td, .table-nobordered>tbody>tr>th, .table-nobordered>tfoot>tr>td, .table-nobordered>tfoot>tr>th, .table-nobordered>thead>tr>td, .table-nobordered>thead>tr>th {
	    border: 0px solid #ddd;
	    background: #fff !important;
	}

</style>
<script>
/*
 * 组件说明
 * 名称：表组件
 * 数据来源：ajax
 * 详细：根据其他组件中交互导致的参数变化，然后请求数据进行渲染（.modal为表格中点击详情的弹出部分）
 */

 var Vue = require('Vue');
 var $ = require('jQuery');

 var store = require('../../store/store.js');
 var actions = require('../../store/actions.js');

 var utils = require('utils');

 var Pagination = require('../common/pagination.vue');

 var eventBus = require('../support/event-bus.vue');

 var Table = Vue.extend({
 	name: 'Table',
 	data: function() {
 		return {
 			initEd: false,
 			tableData: [],
 			tableExample: [],
 			scrollTop: null,
			// hasRequestUrl: null,
			paginationConf: {
				currentPage: 1, // 当前页
				totalItems: 0, // 总条数
				itemsPerPage: 20, // 每页条数
				pagesLength: 5, // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {

				}
			},
			tableColControl: {},
			config: [
				// {
				// 	row: 1,
				// 	col: 1,
				// 	end: {
				// 		row: 2,
				// 		col: 2
				// 	}
				// }
				]
			};
		},
		vuex: {
			getters: {
				modalTableData: function() {
					return store.state.modalTableData;
				}
			},
			actions: actions
		},
		created: function() {
			this.initEd = true;
		},
		ready: function() {
			this.paginationConf.onChange = this.generatorTable;
			var _this = this;
			eventBus.$on('controlTableCol' + this.index, function(option) {
				_this.tableColControl = option;
			});
		},
		components: {
			'm-pagination': Pagination
		},
		props: ['initData', 'currentData', 'loading', 'index', 'resultArgvs', 'pageComponentsData'],
		methods: {
			fetchData: function(cb, errcb) {
				var _this = this;
				if (_this.resultArgvs.forceChange) {
					delete _this.resultArgvs.forceChange;
				}

				var _current = this.resultArgvs;

				utils.mixin(_current, {
					limit: this.paginationConf.itemsPerPage,
					page: this.paginationConf.currentPage
				});

				$.ajax({
					url: this.currentData.query_api + '_json',
					type: 'get',
					data: _this.resultArgvs,
					timeout: 5000,
					success: function(data) {
						if (data.iserro) {
							actions.alert(store, {
								show: true,
								msg: '查询失败',
								type: 'danger'
							});
							return;
						}
						cb && cb(data);
					},
					error: function(jqXHR, status, errorThrown) {
						if (status === 'timeout') {
							errcb && errcb();
						}
					}
				});
			},
			tableOperation: function(item, tableBody, detailParam) {
			// item 字符串的html节点，从节点上获取 `url_detail` 或者 `url_link` 以及需要的参数

			// 如果是 `url_link` 检查给的参数，和自己要带的参数，然后形成一个对象，然后 $route.router.go 到 `url_link`，并且带上 query ，下一个页面接收到之后，先请求，请求完把参数拼接上

			var _this = this;

			// 弹层表格详情
			if (item.indexOf('url_detail') !== -1) {
				var urlDetail = $(utils.strToDom(item)).attr('url_detail');
				var url = tableBody[detailParam];
				var params = {};

				params[detailParam] = url;
				utils.mixin(params, this.resultArgvs);

				for (let item in params) {
					if (item === 'limit' || item === 'page') {
						delete params[item];
					}
				}

				$.ajax({
					url: urlDetail + '_json',
					type: 'get',
					data: params,
					success: function(data) {
						// _this.hasRequestUrl = url;
						var tableData = data.modelData;
						actions.modalTable(store, {
							show: true,
							title: '详情',
							data: tableData,
							query_api: urlDetail + '_json',
							query_parmas: params
						});
					}
				});
			}

			// 跳转到新页面（需要带上各种各样参数）
			if (item.indexOf('url_link') !== -1) {
				var dom = $(utils.strToDom(item));

				var urlLink = dom.attr('url_link');
				var fixedParams = dom.attr('url_fixed_params') ? JSON.parse(dom.attr('url_fixed_params')) : {};
				var customParams = dom.attr('custom_params') ? JSON.parse(dom.attr('custom_params')) : [];

				var resultStr = '';
				var resultArray = [];

				Object.keys(fixedParams).forEach(function(item) {
					resultArray.push(item + '=' + fixedParams[item]);
				});

				customParams.forEach(function(item) {
					if (this.resultArgvs[item]) {
						resultArray.push(item + '=' + this.resultArgvs[item]);
					}
				});

				this.$route.router.go(urlLink + '?' + resultArray.join('&'));
			}
		},
		generatorTable: function() {
			var _this = this;
			if (this.currentData.type.indexOf('table') !== -1) {
				this.loading.show = true;
				this.loading.noLoaded += 1;
				this.scrollTop = $(document).scrollTop();
				this.fetchData(function(data) {
					_this.tableData = data.modelData;

					// 控制第一个表格的列
					_this.tableData[0].cols.forEach(function(item, index) {
						Vue.set(_this.tableColControl, index, true);
					});

					eventBus.$emit('tableGenerate' + _this.index, _this.tableData);

					_this.paginationConf.totalItems = data.modelData[0].count || 0;

					_this.$dispatch('getTableDataLen', data.modelData[0].count || data.modelData[0].data.length);

					// 所有组件加载完毕之后loading消失
					_this.loading.noLoaded -= 1;
					if (_this.loading.noLoaded === 0) {
						_this.loading.show = false;
					}
					// 重新生成表格页面会回到顶部，重置下
					$(document).scrollTop(_this.scrollTop);
				}, function() {
					_this.loading.noLoaded -= 1;
					if (_this.loading.noLoaded === 0) {
						_this.loading.show = false;
					}
					// erro
					actions.alert(store, {
						show: true,
						msg: '查询超时',
						type: 'danger'
					});
				});
			}
		},
		showHelpBymouse(ev) {
			console.log(ev.target.getAttribute('data'));
		},
		getColspan (config, row, col) {
			let model= config.find(function(item) {
				return item.col== col && item.row== row;
			})
			console.log(model.end,col);
			return model ? model.end.col : 0;
		},
		getRowspan (config, row, col) {
			let model= config.find(function(item) {
				return item.col== col && item.row== row;
			})
			return model ? model.end.row : 0;
		},
		isSpan (config, row, col) {
			row = parseInt(row);
			col = parseInt(col);
			if (!config.length) {
				return true;
			}

			for (let i = config.length - 1; i >= 0; i--) {
				let item = config[i]
				if(col== item.col && row== item.row){
					return true;
				}
				let endcol= (item.col+item.end.col-1) < 0 ? 0 : (item.col+item.end.col-1);
				let endrow= (item.row+item.end.row-1) < 0 ? 0 : (item.row+item.end.row-1);
				let result = col>= item.col && row>= item.row && col<= endcol && row<= endrow;
				if (result) {
					return false;
				}
			}
			return true;
		},
		getIndexByKey(obj, key) {
			let index= Object.keys(obj)[key];
			return index;
		}
	},
	watch: {
		'resultArgvs': {
			handler: function(val) {
				// for debug
				this.$log('resultArgvs');

				// 参数改了 请求数据，进行渲染
				this.generatorTable();
			},
			deep: true
		}
	}
});
module.exports = Table;
</script>
