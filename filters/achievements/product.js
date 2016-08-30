/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 */
var util = require(RootPath+"/utils"),
    moment = require("moment");

module.exports = {
    productOne(data, filter_key) {

        var source = data.first.data[0];
        return util.toTable([source], data.rows, data.cols);
    },
    productTwo(data, filter_key, dates) {
        var source = data.first.data[0],
            rows   = ["昨日" , "前日" , "环比" , "7日平均环比"],
            result = [],
            configRow = data.rows[0];

        for(let key of rows){
            var obj = {};
            for(let item of configRow){
                obj[item] = 0;
            }
            obj.names = key;
            result.push(obj);
        }

        console.log(data);

       return util.toTable([result], data.rows, data.cols);
    },
    productThree(data, filter_key) {
        var source = data.data,
            count = data.dataCount;

        for(var key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.pay_fee = key.pay_fee.toFixed(2);
            key.refund_fee = key.refund_fee.toFixed(2);
        }

        if(filter_key === "2") {
            data.cols[0][1].caption = "商品访问量";
            data.cols[0][2].caption = "下单商品件数";
            data.cols[0][3].caption = "支付商品件数";
            data.cols[0][4].caption = "退货商品件数";
        }

        if(filter_key === "1") {
            data.cols[0][1].caption = "被访问商品数";
            data.cols[0][2].caption = "下单商品数";
            data.cols[0][3].caption = "支付商品数";
            data.cols[0][4].caption = "退货商品数";
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    productFour(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.access_num_rate = util.toFixed(key.access_num, sum[1]);
            key.access_users_rate = util.toFixed(key.access_users, sum[2]);
            source[i] = key;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    productFive(data, page) {
        var source = data.data,
            page = page || 1,
            count = data.dataCount > 100 ? 100 : data.dataCount,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            var key = source[i];
            key.top = (page - 1) * 20 + i + 1;
            key.order_price = key.order_price.toFixed(2);
            key.pay_price = key.pay_price.toFixed(2);
            key.pay_price_rate = util.toFixed(key.pay_price, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};