/**
 * @author yanglei
 * @date 20160411
 * @fileoverview 活跃用户分析
 */
var api = require("../../../base/main"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/activeAccountOne",
        modelName : ["NewAccount"],
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/userAnalysis/activeAccount/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params(query, params) {
            params.type = query.type || "ios";

            return params;
        },
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
        filter(data, query, dates) {
            return userAnalysis.One(data,
                [ "active_users", "active_account" ],
                [ "活跃用户", "活跃账号" ],
                dates
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/activeAccountTwe",
        modelName : ["NewAccount"],
        paging : [true],
        platform : false,
        params(query, params) {
            params.type = query.type || "ios";

            return params;
        },
        order : [ "-date" ],
        rows : [['date', 'active_users', 'active_account' ]],
        cols : [
            [
                {
                    caption: '时间',
                    type: 'string',
                    width: 20
                }, {
                caption: '活跃用户',
                type: 'number',
                help : "当日启动过应用的用户（去重）"
            }, {
                caption: '活跃账户',
                type: 'number'
            }
            ]
        ],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return userAnalysis.activeUsersTwe(data, dates);
        }
    });

    return Router;
};