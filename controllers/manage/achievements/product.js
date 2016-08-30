/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 * @二次开发 ，20160830 ， Mr.He
 */
var api = require(RootPath+"/base/main"),
    filter = require(RootPath+"/filters/achievements/product"),
    utils  = require(RootPath+"/utils");

module.exports = (Router) => {

    // Router = Router.get("/achievements/productZero_json" , function(req , res , next){
    //     res.json({
    //         code: 200,
    //         modelData: [ ],
    //         components: {
    //         flexible_btn: [ ],
    //         date_picker: {
    //         show: false,
    //         defaultData: 7
    //         },
    //         drop_down: {
    //         platform: false,
    //         channel: false,
    //         version: false,
    //         coupon: false
    //         },
    //         level_select: {
    //         show: true,
    //         url: "/api/socialAnalysisCategories",
    //         name: "category_id"
    //         },
    //         filter_select: [ ],
    //         search: {
    //         show: false
    //         },
    //         control_table_col: {
    //         show: false
    //         },
    //         global_plataform: {
    //         show: false
    //         }
    //         }
    //         });

    //    /* type: 'filter_tab_checkbox',
    //     show: false,
    //     key: 'test',
    //     url: '',
    //     data: []*/
    // });


    Router = new api(Router,{
        router : "/achievements/productOne",
        modelName : ["ItemOverview"],
        platform : false,
        date_picker : false, 
        params : function(query , params , sendData){
            var dates = utils.beforeDate(new Date() , 2);
            //取昨天的数据
            params.date = dates[1];
            params.category_id = -6;

            return params;
        },
        filter(data, filter_key, dates) {
            return filter.productOne(data, filter_key);
        },
        cols : [
            [
                {
                    caption: '商品总数',
                    type: 'number'
                }, {
                    caption: '冻结总数',
                    type: 'number'
                }, {
                    caption: '上架总数',
                    type: 'number'
                },{
                    caption: '下架总数',
                    type: 'number'
                },{
                    caption: '当前SPU使用总数',
                    type: 'number'
                }
            ]
        ],
        rows : [
            [ 'items_count_sum', 'items_frost_sum', 'items_put_sum', "items_down_sum", "items_spu_sum" ]
        ]
    });


    //商品管理总览
    Router = new api(Router,{
        router : "/achievements/productTwo",
        modelName : ["ItemManager"],
        platform : false,
        date_picker : false,
        rows : [
            [
                "names" , "items_add" , "items_put" , "items_down" , "items_frost" , "items_delete"
            ]
        ],
        params : function(query , params , sendData){
            var dates = utils.beforeDate(new Date() , 2);
            
            params.date = dates[1];
            params.category_id = -6;
            return params;
        },
        cols : [
            [{
                caption: '',
                type: 'string'
            },{
                caption: '新增商品数',
                type: 'number'
            },{
                caption: '上架商品数',
                type: 'number'
            },{
                caption: '下架商品数',
                type: 'number'
            },{
                caption: '冻结商品数',
                type: 'number'
            },{
                caption: '删除商品数',
                type: 'number'
            },]
        ],

        filter(data, filter_key, dates) {
            return filter.productTwo(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/achievements/productThree",
        modelName : ["SalesPerfProductKv"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        filter_select: [{
            title: '',
            filter_key : 'sku_type',
            groups: [{
                key: 2,
                value: 'SKU'
            }, {
                key: 1,
                value: 'item'
            }]
        }],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.productThree(data, filter_key);
        },
        rows : [
            [ 'date', 'product_scan', 'products_order', "products_pay", "products_return",
                "pay_fee", "refund_fee" ]
        ],
        cols : [
            [{
                caption: '日期',
                type: 'string'
            }, {
                caption: '被访问商品数',
                type: 'number'
            }, {
                caption: '下单商品数/件数',
                type: 'number'
            }, {
                caption: '支付商品数/件数',
                type: 'number'
            }, {
                caption: '退货商品数/件数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '退货金额',
                type: 'number'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/productFour",
        modelName : ["SalesProductFlowtTop"],
        paging : true,
        order : ["-access_num"],
        sum : ["access_num", "access_users"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.productFour(data, page);
        },
        rows : [
            [ 'top', 'commodity_name', 'access_num', 'access_num_rate', 'access_users',
                'access_users_rate', 'share_num']
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '商品名称',
                type: 'string'
            }, {
                caption: '商品访问量',
                type: 'number'
            }, {
                caption: '商品访问量占比',
                type: 'string'
            }, {
                caption: '商品访客数',
                type: 'number'
            }, {
                caption: '商品访客数占比',
                type: 'string'
            }, {
                caption: '商品被分享次数',
                type: 'number'
            }]
        ]
    });

    Router = new api(Router,{
        router : "/achievements/productFive",
        modelName : ["SalesProductMarketTop"],
        platform : false,
        paging : true,
        order : ["-order_price"],
        sum : ["pay_price"],
        date_picker_data : 1,
        showDayUnit : true,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.productFive(data, page);
        },
        rows : [
            [ 'top', 'commodity_name', 'order_users', 'oder_products',
                'order_price', 'pay_users', 'pay_products',
                'pay_price', 'pay_price_rate', "refund_num" ]
        ],
        cols : [
            [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '商品名称',
                type: 'string'
            }, {
                caption: '下单人数',
                type: 'number'
            }, {
                caption: '下单件数',
                type: 'number'
            },{
                caption: '下单金额',
                type: 'number'
            },{
                caption: '支付人数',
                type: 'number'
            },{
                caption: '支付件数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '支付金额占比',
                type: 'string'
            }, {
                caption: '退货件数',
                type: 'number'
            }]
        ]
    });

    return Router;
};