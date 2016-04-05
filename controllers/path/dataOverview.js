/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

module.exports = () => {
    return {
        path : "/11",
        name : "测试",
        display : true,
        defaultData : [{
            type : "table",
            title : "test",
            query_api : "/test_json"
        }]
    }
};