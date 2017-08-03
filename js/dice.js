/* 
let params = {
    "method": null, //玩法rxfs_rxfs_1z1
    "code": null, //投注号码
    "odds": null, //赔率3.96
    "point": null, //返点    
    "nums": 0, //投注的注数
    "piece": 0, //投注的倍数
    "price": 1, //筹码金额
    "amount": 1, //总金额price*nums    
};
 */
//投注算投注内容的时候就看桌子上放的筹码
let common_param = {
    "method": null,
    "code": null,
    "odds": null, //后台传过来的
    "point": null //后台传过来的
};
let params = {};
let param = { //不同筹码提交的时候算不同的obj
    1: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 1,
        "amount": null
    },common_param),
    5: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 5,
        "amount": null
    },common_param),
    10: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 10,
        "amount": null
    },common_param),
    50: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 50,
        "amount": null
    },common_param),
    100: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 100,
        "amount": null
    },common_param),
    1000: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 1000,
        "amount": null
    },common_param),
    5000: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 5000,
        "amount": null
    },common_param)
};
let allValues = [];
$('.wrap div').each(function(index,item){//获取所有的value值存到数组
  if($(item).attr('value')){
    allValues.push($(item).attr('value'));
  }
});
allValues.forEach((item,index)=>{
    params[item] = JSON.parse(JSON.stringify(param));//浅复制，消除引用影响
});
let priceNum = null; //筹码,未选择时为null
//确定所用筹码
$('.chips>.chip').off('click').on('click', function (e) {
    $(this).addClass('on').siblings('.chip').removeClass('on');
    priceNum = +$(this).attr('value');
});
//投注
let allMethods = ['[method="dxds_dxds_dxds"]','[method="th2_th2fx_fx"]','[method="th3_th3_th3dx"]','[method="th3_th3_th3tx"]','[method="hz_hz_hz"]'
,'[method="bth2_bth2_ds"]','[method="cygh_cygh_cygh"]','[method="bth3_lh3_dx"]'];
$(String(allMethods)).off('click').on('click', function (e) {
    if (!priceNum) { //如果没有选定筹码，不能下注
        return;
    }
    let method = $(this).attr('method');
    let value = $(this).attr('value');//code
    console.log(value)
    params[value][priceNum].method = method;
    params[value][priceNum].code = value;
    switch (priceNum) { //不同筹码判断逻辑
        case 1:
            params[value][1].piece += 1;
             params[value][1].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if ( params[value][1].piece === 5) { //5个筹码1换1个筹码5
                 params[value][1].piece -= 5; //筹码1 的piece减去5 
                 params[value][1].nums =  params[value][1].piece ? 1 : 0; //有piece才有注数
                 params[value][5].piece += 1; //筹码5投注倍数加1               
                 params[value][5].nums =  params[value][5].piece ? 1 : 0;
                if ( params[value][5].piece === 2) { //两个5筹码转成1个10筹码
                     params[value][5].piece -= 2; //筹码5 的piece减去2        
                     params[value][5].nums =  params[value][5].piece ? 1 : 0; //有piece才有注数
                     params[value][10].piece += 1; //筹码10投注倍数加1
                     params[value][10].nums =  params[value][10].piece ? 1 : 0; //有piece才有注数
                    if ( params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                         params[value][10].piece -= 5; //筹码10 的piece减去5        
                         params[value][10].nums =  params[value][10].piece ? 1 : 0; //有piece才有注数
                         params[value][50].piece += 1; //筹码50投注倍数加1
                         params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                        if ( params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                             params[value][50].piece -= 2; //筹码50 的piece减去2        
                             params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                             params[value][100].piece += 1; //筹码100投注倍数加1
                             params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                            if ( params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                                 params[value][100].piece -= 10; //筹码100 的piece减去10     
                                 params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                                 params[value][1000].piece += 1; //筹码1000投注倍数加1
                                 params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                                if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                     params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                                     params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                                     params[value][5000].piece += 1; //筹码5000投注倍数加1
                                     params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 5:
             params[value][5].piece += 1;
             params[value][5].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if ( params[value][5].piece === 2) { //两个5筹码转成1个10筹码
                 params[value][5].piece -= 2; //筹码5 的piece减去2        
                 params[value][5].nums =  params[value][5].piece ? 1 : 0; //有piece才有注数
                 params[value][10].piece += 1; //筹码10投注倍数加1
                 params[value][10].nums =  params[value][10].piece ? 1 : 0; //有piece才有注数
                if ( params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                     params[value][10].piece -= 5; //筹码10 的piece减去5        
                     params[value][10].nums =  params[value][10].piece ? 1 : 0; //有piece才有注数
                     params[value][50].piece += 1; //筹码50投注倍数加1
                     params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                    if ( params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                         params[value][50].piece -= 2; //筹码50 的piece减去2        
                         params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                         params[value][100].piece += 1; //筹码100投注倍数加1
                         params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                        if ( params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                             params[value][100].piece -= 10; //筹码100 的piece减去10     
                             params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                             params[value][1000].piece += 1; //筹码1000投注倍数加1
                             params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                            if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                 params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                                 params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                                 params[value][5000].piece += 1; //筹码5000投注倍数加1
                                 params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
                            }
                        }
                    }
                }
            }
            break;
        case 10:
             params[value][10].piece += 1;
             params[value][10].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if ( params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                 params[value][10].piece -= 5; //筹码10 的piece减去5        
                 params[value][10].nums =  params[value][10].piece ? 1 : 0; //有piece才有注数
                 params[value][50].piece += 1; //筹码50投注倍数加1
                 params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                if ( params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                     params[value][50].piece -= 2; //筹码50 的piece减去2        
                     params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                     params[value][100].piece += 1; //筹码100投注倍数加1
                     params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                    if ( params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                         params[value][100].piece -= 10; //筹码100 的piece减去10     
                         params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                         params[value][1000].piece += 1; //筹码1000投注倍数加1
                         params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                        if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                             params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                             params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                             params[value][5000].piece += 1; //筹码5000投注倍数加1
                             params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
                        }
                    }
                }
            }
            break;
        case 50:
             params[value][50].piece += 1;
             params[value][50].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if ( params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                 params[value][50].piece -= 2; //筹码50 的piece减去2        
                 params[value][50].nums =  params[value][50].piece ? 1 : 0; //有piece才有注数
                 params[value][100].piece += 1; //筹码100投注倍数加1
                 params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                if ( params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                     params[value][100].piece -= 10; //筹码100 的piece减去10     
                     params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                     params[value][1000].piece += 1; //筹码1000投注倍数加1
                     params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                    if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                         params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                         params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                         params[value][5000].piece += 1; //筹码5000投注倍数加1
                         params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
                    }
                }
            }
            break;
        case 100:
             params[value][100].piece += 1;
             params[value][100].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if ( params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                 params[value][100].piece -= 10; //筹码100 的piece减去10     
                 params[value][100].nums =  params[value][100].piece ? 1 : 0; //有piece才有注数
                 params[value][1000].piece += 1; //筹码1000投注倍数加1
                 params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                     params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                     params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                     params[value][5000].piece += 1; //筹码5000投注倍数加1
                     params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
                }
            }
            break;
        case 1000:
             params[value][1000].piece += 1;
             params[value][1000].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if ( params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                 params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                 params[value][1000].nums =  params[value][1000].piece ? 1 : 0; //有piece才有注数
                 params[value][5000].piece += 1; //筹码5000投注倍数加1
                 params[value][5000].nums =  params[value][5000].piece ? 1 : 0; //有piece才有注数
            }
            break;
        case 5000:
             params[value][5000].piece += 1;
             params[value][5000].nums =  params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            break;
        default:
            break;
    }

});