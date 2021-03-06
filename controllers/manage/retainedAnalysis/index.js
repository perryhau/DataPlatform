/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/retainedAnalysis");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/retainedAnalysis/retainedOne",
        platform : false,
        modelName : ["UserKeepResult"],
        params(query, params) {
            params.type = query.type || "ios";

             return params;
        },
        paging : [true],
        order : ["-date"],
        global_platform : {
            show: true,
            key: 'type',
            list: [{
                key: 'ios',
                name: 'IOS'
            }, {
                key: 'android',
                name: 'Android'
            }, {
                key: 'app',
                name: 'APP'
            }, {
                key: 'pc',
                name: 'PC'
            }, {
                key: 'm',
                name: 'H5'
            }]
        },
        filter(data) {
            return filter.retainedOne(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ 'date', 'new_users', 'last_1_keep', 'last_7_keep', "last_14_keep", "last_30_keep"]
        ],
        cols: [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                }, {
                    caption: '新增用户',
                    type: 'number'
                }, {
                    caption: '次日留存率',
                    type: 'string'
                }, {
                    caption: '7日留存率',
                    type: 'string'
                }, {
                    caption: '14日留存率',
                    type: 'string'
                }, {
                    caption: '30日留存率',
                    type: 'string'
                }
            ]
        ]
    });

    return Router;
};