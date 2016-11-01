/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

var fetch = require('node-fetch');

module.exports = (Router) => {
    
    //圈子数据总揽
    Router.get("/databp/html", (req, res, next) => {
        let url = req.query.url;
        let mobile = (req.query.m === '1'? true:false);
        let options = {};
        if (mobile) {
            options.headers = {
                'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
            }
        }
        console.log(JSON.stringify(options,null,4));
        fetch(url, options)
        .then(function(result) {
            return result.text();
        }).then(function(body) {
            let html = body;
            // 移动端移除头部script，防止iframe无法正常渲染
            if (mobile) {
                html = html.replace(/^[\s\S]+?(<!DOCTYPE)/mi, function(m, p1) {
                    return p1;
                });
            }
            res.end(html);
        }).catch(function(e) {
            console.log(e);
            res.end(e);
        });

    });
    
    return Router;
};