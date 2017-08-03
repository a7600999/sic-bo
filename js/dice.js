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
let dxds_da_common = {
    "method": "dxds_dxds_dxds",
    "code": "da",
    "odds": null, //后台传过来的
    "point": null //后台传过来的
};
let aMethods = ['.dxds_da','.dxds_dan','.dxds_xiao','.dxds_shuang',];
let dxds_da_param = { //不同筹码提交的时候算不同的obj
    1: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 1,
        "amount": null
    },dxds_da_common),
    5: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 5,
        "amount": null
    },dxds_da_common),
    10: Object.assign(dxds_da_common, {
        "nums": 0,
        "piece": 0,
        "price": 10,
        "amount": null
    }),
    50: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 50,
        "amount": null
    },dxds_da_common),
    100: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 100,
        "amount": null
    },dxds_da_common),
    1000: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 1000,
        "amount": null
    },dxds_da_common),
    5000: Object.assign({
        "nums": 0,
        "piece": 0,
        "price": 5000,
        "amount": null
    },dxds_da_common)
};
let priceNum = null; //筹码,未选择时为null
//确定所用筹码
$('.chips>.chip').off('click').on('click', function (e) {
    $(this).addClass('on').siblings('.chip').removeClass('on');
    priceNum = +$(this).attr('value');
});
//大小单双 投注大
$('.dxds_da').off('click').on('click', function (e) {
    if (!priceNum) { //如果没有选定筹码，不能下注
        return;
    }
    
    switch (priceNum) { //不同筹码判断逻辑
        case 1:
            dxds_da_param[1].piece += 1;
            dxds_da_param[1].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (dxds_da_param[1].piece === 5) { //5个筹码1换1个筹码5
                console.log(33)
                dxds_da_param[1].piece -= 5; //筹码1 的piece减去5 
                console.log(dxds_da_param[1].piece);                       
                dxds_da_param[1].nums = dxds_da_param[1].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[5].piece += 1; //筹码5投注倍数加1               
                dxds_da_param[5].nums = dxds_da_param[5].piece ? 1 : 0;
                if (dxds_da_param[5].piece === 2) { //两个5筹码转成1个10筹码
                    dxds_da_param[5].piece -= 2; //筹码5 的piece减去2        
                    dxds_da_param[5].nums = dxds_da_param[5].piece ? 1 : 0; //有piece才有注数
                    dxds_da_param[10].piece += 1; //筹码10投注倍数加1
                    dxds_da_param[10].nums = dxds_da_param[10].piece ? 1 : 0; //有piece才有注数
                    if (dxds_da_param[10].piece === 5) { //5个10筹码转成1个50筹码
                        dxds_da_param[10].piece -= 5; //筹码10 的piece减去5        
                        dxds_da_param[10].nums = dxds_da_param[10].piece ? 1 : 0; //有piece才有注数
                        dxds_da_param[50].piece += 1; //筹码50投注倍数加1
                        dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                        if (dxds_da_param[50].piece === 2) { //2个50筹码转成1个100筹码
                            dxds_da_param[50].piece -= 2; //筹码50 的piece减去2        
                            dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                            dxds_da_param[100].piece += 1; //筹码100投注倍数加1
                            dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                            if (dxds_da_param[100].piece === 10) { //10个100筹码转成1个1000筹码
                                dxds_da_param[100].piece -= 10; //筹码100 的piece减去10     
                                dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                                dxds_da_param[1000].piece += 1; //筹码1000投注倍数加1
                                dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                                if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                    dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                                    dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                                    dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                                    dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 5:
            dxds_da_param[5].piece += 1;
            dxds_da_param[5].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if (dxds_da_param[5].piece === 2) { //两个5筹码转成1个10筹码
                dxds_da_param[5].piece -= 2; //筹码5 的piece减去2        
                dxds_da_param[5].nums = dxds_da_param[5].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[10].piece += 1; //筹码10投注倍数加1
                dxds_da_param[10].nums = dxds_da_param[10].piece ? 1 : 0; //有piece才有注数
                if (dxds_da_param[10].piece === 5) { //5个10筹码转成1个50筹码
                    dxds_da_param[10].piece -= 5; //筹码10 的piece减去5        
                    dxds_da_param[10].nums = dxds_da_param[10].piece ? 1 : 0; //有piece才有注数
                    dxds_da_param[50].piece += 1; //筹码50投注倍数加1
                    dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                    if (dxds_da_param[50].piece === 2) { //2个50筹码转成1个100筹码
                        dxds_da_param[50].piece -= 2; //筹码50 的piece减去2        
                        dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                        dxds_da_param[100].piece += 1; //筹码100投注倍数加1
                        dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                        if (dxds_da_param[100].piece === 10) { //10个100筹码转成1个1000筹码
                            dxds_da_param[100].piece -= 10; //筹码100 的piece减去10     
                            dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                            dxds_da_param[1000].piece += 1; //筹码1000投注倍数加1
                            dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                            if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                                dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                                dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                                dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
                            }
                        }
                    }
                }
            }
            break;
        case 10:
            dxds_da_param[10].piece += 1;
            dxds_da_param[10].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (dxds_da_param[10].piece === 5) { //5个10筹码转成1个50筹码
                dxds_da_param[10].piece -= 5; //筹码10 的piece减去5        
                dxds_da_param[10].nums = dxds_da_param[10].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[50].piece += 1; //筹码50投注倍数加1
                dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                if (dxds_da_param[50].piece === 2) { //2个50筹码转成1个100筹码
                    dxds_da_param[50].piece -= 2; //筹码50 的piece减去2        
                    dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                    dxds_da_param[100].piece += 1; //筹码100投注倍数加1
                    dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                    if (dxds_da_param[100].piece === 10) { //10个100筹码转成1个1000筹码
                        dxds_da_param[100].piece -= 10; //筹码100 的piece减去10     
                        dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                        dxds_da_param[1000].piece += 1; //筹码1000投注倍数加1
                        dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                        if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                            dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                            dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                            dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                            dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
                        }
                    }
                }
            }
            break;
        case 50:
            dxds_da_param[50].piece += 1;
            dxds_da_param[50].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (dxds_da_param[50].piece === 2) { //2个50筹码转成1个100筹码
                dxds_da_param[50].piece -= 2; //筹码50 的piece减去2        
                dxds_da_param[50].nums = dxds_da_param[50].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[100].piece += 1; //筹码100投注倍数加1
                dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                if (dxds_da_param[100].piece === 10) { //10个100筹码转成1个1000筹码
                    dxds_da_param[100].piece -= 10; //筹码100 的piece减去10     
                    dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                    dxds_da_param[1000].piece += 1; //筹码1000投注倍数加1
                    dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                    if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                        dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                        dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                        dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                        dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
                    }
                }
            }
            break;
        case 100:
            dxds_da_param[100].piece += 1;
            dxds_da_param[100].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (dxds_da_param[100].piece === 10) { //10个100筹码转成1个1000筹码
                dxds_da_param[100].piece -= 10; //筹码100 的piece减去10     
                dxds_da_param[100].nums = dxds_da_param[100].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[1000].piece += 1; //筹码1000投注倍数加1
                dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                    dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                    dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                    dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                    dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
                }
            }
            break;
        case 1000:
            dxds_da_param[1000].piece += 1;
            dxds_da_param[1000].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if (dxds_da_param[1000].piece === 5) { //5个1000筹码转成1个5000筹码
                dxds_da_param[1000].piece -= 5; //筹码1000 的piece减去5    
                dxds_da_param[1000].nums = dxds_da_param[1000].piece ? 1 : 0; //有piece才有注数
                dxds_da_param[5000].piece += 1; //筹码5000投注倍数加1
                dxds_da_param[5000].nums = dxds_da_param[5000].piece ? 1 : 0; //有piece才有注数
            }
            break;
        case 5000:
            dxds_da_param[5000].piece += 1;
            dxds_da_param[5000].nums = dxds_da_param[priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            break;
        default:
            break;
    }

});