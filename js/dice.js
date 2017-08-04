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
let chipRefectObj = { //飞出去的和底盘的筹码className关联关系
    'flyChip1': 'chip1',
    'flyChip5': 'chip5',
    'flyChip10': 'chip10',
    'flyChip50': 'chip50',
    'flyChip100': 'chip100',
    'flyChip1000': 'chip1000',
    'flyChip5000': 'chip5000'
};
let Elements_forBet = []; //建立一个投注的筹码数组存放这些将要投注的筹码,可以取消投注
let Elements_betted = []; //建立一个投注了的筹码数组存放这些已经投注的筹码,不能取消投注
let Elements_change = []; //建议一个数组存放累加事改变的元素，比如5个1筹码变成的1个数字是5的筹码
//投注算投注内容的时候就看桌子上放的筹码
let balanceAmount = $('.balanceAmount');
let betMoneyAmount = $('.betMoneyAmount');
let cancelButton = $('.cancelButton');
let betButton = $('.betButton');
let pieceButtoon = $('.pieceButtoon');
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
    }, common_param),
    5: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 5,
        "amount": null
    }, common_param),
    10: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 10,
        "amount": null
    }, common_param),
    50: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 50,
        "amount": null
    }, common_param),
    100: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 100,
        "amount": null
    }, common_param),
    1000: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 1000,
        "amount": null
    }, common_param),
    5000: jQuery.extend({
        "nums": 0,
        "piece": 0,
        "price": 5000,
        "amount": null
    }, common_param)
};
let allValues = [];
$('.wrap div').each(function (index, item) { //获取所有的value值存到数组
    if ($(item).attr('value')) {
        allValues.push($(item).attr('value'));
    }
});
allValues.forEach((item, index) => { //每个value值对应提交对象
    params[item] = JSON.parse(JSON.stringify(param)); //浅复制，消除引用影响
});
let priceNum = null; //筹码,未选择时为null
//确定所用筹码
$('.chips>.chip').off('click').on('click', function (e) {
    $(this).addClass('on').siblings('.chip').removeClass('on');
    priceNum = +$(this).attr('value');
});
//投注
let flyChip = null; //点击筹码飞过去的元素
function createFlyChip(num) { //创建飞出去的筹码
    let ele = document.createElement('div');
    $(ele).addClass(`flyChip${num}`);
    $(ele).text(num);
    return $(ele);
}

function letChipFly(priceNum, element, Elements_forBet) { //筹码飞出去方法
    flyChip = createFlyChip(priceNum);
    Elements_forBet.push({
        "chip": flyChip,
        "value": element.attr('value')
    });
    flyChip.css({
        "position": 'absolute',
        "left": $(`.chips>.chip${priceNum}`).offset().left,
        "top": $(`.chips>.chip${priceNum}`).offset().top,
        "transition": 'all 0.2s ease'
    });
    $('body').append(flyChip);
    flyChip.css({
        "left": element.offset().left,
        "top": element.offset().top,
    });
}

function letChipFlyBack(Elements_forBet,Elements_change) { //取消投注让筹码飞回来
    if (Elements_forBet.length === 0) {
        return;
    }
    function addChip(ele,count) {
        for (let i = 0; i<count;i++) {
        console.log(ele)
            $('body').append(ele);
        }
    }
    let backElement = Elements_forBet.splice(Elements_forBet.length - 1, 1)[0]['chip'];
    let value = Elements_forBet.splice(Elements_forBet.length - 1, 1)[0]['value'];
    $('body').append(backElement);
    let className = backElement.attr('class');
    let price = +className.match(/\d+$/)[0];
    switch (price) {
        case 1:
            if (params[value][1].piece >= 1 && params[value][1].piece <= 4) {
                params[value][1].piece -= 1;
                params[value][1].nums = params[value][1].piece ? 1 : 0;
            } else if (params[value][1].piece === 0) {
                addChip(backElement,5-1);//数字为5的筹码拆成5个数字为1的筹码
                params[value][1].piece += 4;
                params[value][1].nums = params[value][1].piece ? 1 : 0;
                Elements_change.splice(Elements_change.length - 1,1)[0].remove();
                params[value][5].piece -= 1;
                params[value][5].nums = params[value][5].piece ? 1 : 0;
            }
            break;

        default:
            break;
    }

    backElement.css({
        "left": $(`.chips>.${chipRefectObj[className]}`).offset().left,
        "top": $(`.chips>.${chipRefectObj[className]}`).offset().top,
    });
    setTimeout(function () {
        backElement.remove();
    }, 500);
}

function chipChange(num, element) { //5个筹码1换1个筹码5此种类似场合筹码切换方法
    let changeElement = createFlyChip(num).css({
        "position": "absolute",
        "left": element.offset().left,
        "top": element.offset().top,
    });
    $('body').append(changeElement);
    Elements_change.push(changeElement);
}

function removeChip(numDelete, numCount) { //5个筹码1换1个筹码5此种类似场合筹码切换方法，删除5个1筹码类似
    $(`.flyChip${numDelete}:lt(${numCount})`).remove();
}

let allMethods = ['[method="dxds_dxds_dxds"]', '[method="th2_th2fx_fx"]', '[method="th3_th3_th3dx"]', '[method="th3_th3_th3tx"]', '[method="hz_hz_hz"]', '[method="bth2_bth2_ds"]', '[method="cygh_cygh_cygh"]', '[method="bth3_lh3_dx"]'];
$(String(allMethods)).off('click').on('click', function (e) {
    if (!priceNum) { //如果没有选定筹码，不能下注
        return;
    }
    letChipFly(priceNum, $(this), Elements_forBet);
    let method = $(this).attr('method');
    let value = $(this).attr('value'); //code
    params[value][priceNum].method = method;
    params[value][priceNum].code = value;
    switch (priceNum) { //不同筹码判断逻辑
        case 1:
            params[value][1].piece += 1;
            params[value][1].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (params[value][1].piece === 5) { //5个筹码1换1个筹码5
                setTimeout(() => {
                    chipChange(5, $(this));
                    removeChip(1, 5);
                }, 500);
                params[value][1].piece -= 5; //筹码1 的piece减去5 
                params[value][1].nums = params[value][1].piece ? 1 : 0; //有piece才有注数
                params[value][5].piece += 1; //筹码5投注倍数加1               
                params[value][5].nums = params[value][5].piece ? 1 : 0;
                if (params[value][5].piece === 2) { //两个5筹码转成1个10筹码
                    setTimeout(() => {
                        chipChange(10, $(this));
                        removeChip(5, 2);
                    }, 500);

                    params[value][5].piece -= 2; //筹码5 的piece减去2        
                    params[value][5].nums = params[value][5].piece ? 1 : 0; //有piece才有注数
                    params[value][10].piece += 1; //筹码10投注倍数加1
                    params[value][10].nums = params[value][10].piece ? 1 : 0; //有piece才有注数
                    if (params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                        setTimeout(() => {
                            chipChange(50, $(this));
                            removeChip(10, 5);
                        }, 500);

                        params[value][10].piece -= 5; //筹码10 的piece减去5        
                        params[value][10].nums = params[value][10].piece ? 1 : 0; //有piece才有注数
                        params[value][50].piece += 1; //筹码50投注倍数加1
                        params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                        if (params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                            setTimeout(() => {
                                chipChange(100, $(this));
                                removeChip(50, 5);
                            }, 500);


                            params[value][50].piece -= 2; //筹码50 的piece减去2        
                            params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                            params[value][100].piece += 1; //筹码100投注倍数加1
                            params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                            if (params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                                setTimeout(() => {
                                    chipChange(1000, $(this));
                                    removeChip(100, 10);
                                }, 500);

                                params[value][100].piece -= 10; //筹码100 的piece减去10     
                                params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                                params[value][1000].piece += 1; //筹码1000投注倍数加1
                                params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                                if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                    setTimeout(() => {
                                        chipChange(5000, $(this));
                                        removeChip(1000, 5);
                                    }, 500);

                                    params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                                    params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                                    params[value][5000].piece += 1; //筹码5000投注倍数加1
                                    params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 5:
            params[value][5].piece += 1;
            params[value][5].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if (params[value][5].piece === 2) { //两个5筹码转成1个10筹码
                setTimeout(() => {
                    chipChange(10, $(this));
                    removeChip(5, 2);
                }, 500);

                params[value][5].piece -= 2; //筹码5 的piece减去2        
                params[value][5].nums = params[value][5].piece ? 1 : 0; //有piece才有注数
                params[value][10].piece += 1; //筹码10投注倍数加1
                params[value][10].nums = params[value][10].piece ? 1 : 0; //有piece才有注数
                if (params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                    setTimeout(() => {

                        chipChange(50, $(this));
                        removeChip(10, 5);
                    }, 500);

                    params[value][10].piece -= 5; //筹码10 的piece减去5        
                    params[value][10].nums = params[value][10].piece ? 1 : 0; //有piece才有注数
                    params[value][50].piece += 1; //筹码50投注倍数加1
                    params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                    if (params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                        setTimeout(() => {

                            chipChange(100, $(this));
                            removeChip(50, 5);
                        }, 500);

                        params[value][50].piece -= 2; //筹码50 的piece减去2        
                        params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                        params[value][100].piece += 1; //筹码100投注倍数加1
                        params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                        if (params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                            setTimeout(() => {
                                chipChange(1000, $(this));
                                removeChip(100, 10);
                            }, 500);

                            params[value][100].piece -= 10; //筹码100 的piece减去10     
                            params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                            params[value][1000].piece += 1; //筹码1000投注倍数加1
                            params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                            if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                                setTimeout(() => {
                                    chipChange(5000, $(this));
                                    removeChip(1000, 5);
                                }, 500);

                                params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                                params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                                params[value][5000].piece += 1; //筹码5000投注倍数加1
                                params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
                            }
                        }
                    }
                }
            }
            break;
        case 10:
            params[value][10].piece += 1;
            params[value][10].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (params[value][10].piece === 5) { //5个10筹码转成1个50筹码
                setTimeout(() => {
                    chipChange(50, $(this));
                    removeChip(10, 5);
                }, 500);


                params[value][10].piece -= 5; //筹码10 的piece减去5        
                params[value][10].nums = params[value][10].piece ? 1 : 0; //有piece才有注数
                params[value][50].piece += 1; //筹码50投注倍数加1
                params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                if (params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                    setTimeout(() => {
                        chipChange(100, $(this));
                        removeChip(50, 5);
                    }, 500);

                    params[value][50].piece -= 2; //筹码50 的piece减去2        
                    params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                    params[value][100].piece += 1; //筹码100投注倍数加1
                    params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                    if (params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                        setTimeout(() => {
                            chipChange(1000, $(this));
                            removeChip(100, 10);
                        }, 500);

                        params[value][100].piece -= 10; //筹码100 的piece减去10     
                        params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                        params[value][1000].piece += 1; //筹码1000投注倍数加1
                        params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                        if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                            setTimeout(() => {
                                chipChange(5000, $(this));
                                removeChip(1000, 5);
                            }, 500);

                            params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                            params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                            params[value][5000].piece += 1; //筹码5000投注倍数加1
                            params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
                        }
                    }
                }
            }
            break;
        case 50:
            params[value][50].piece += 1;
            params[value][50].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (params[value][50].piece === 2) { //2个50筹码转成1个100筹码
                setTimeout(() => {
                    chipChange(100, $(this));
                    removeChip(50, 5);
                }, 500);

                params[value][50].piece -= 2; //筹码50 的piece减去2        
                params[value][50].nums = params[value][50].piece ? 1 : 0; //有piece才有注数
                params[value][100].piece += 1; //筹码100投注倍数加1
                params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                if (params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                    setTimeout(() => {
                        chipChange(1000, $(this));
                        removeChip(100, 10);
                    }, 500);

                    params[value][100].piece -= 10; //筹码100 的piece减去10     
                    params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                    params[value][1000].piece += 1; //筹码1000投注倍数加1
                    params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                    if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                        setTimeout(() => {
                            chipChange(5000, $(this));
                            removeChip(1000, 5);
                        }, 500);

                        params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                        params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                        params[value][5000].piece += 1; //筹码5000投注倍数加1
                        params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
                    }
                }
            }
            break;
        case 100:
            params[value][100].piece += 1;
            params[value][100].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            if (params[value][100].piece === 10) { //10个100筹码转成1个1000筹码
                setTimeout(() => {
                    chipChange(1000, $(this));
                    removeChip(100, 10);
                }, 500);

                params[value][100].piece -= 10; //筹码100 的piece减去10     
                params[value][100].nums = params[value][100].piece ? 1 : 0; //有piece才有注数
                params[value][1000].piece += 1; //筹码1000投注倍数加1
                params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                    setTimeout(() => {
                        chipChange(5000, $(this));
                        removeChip(1000, 5);
                    }, 500);

                    params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                    params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                    params[value][5000].piece += 1; //筹码5000投注倍数加1
                    params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
                }
            }
            break;
        case 1000:
            params[value][1000].piece += 1;
            params[value][1000].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数

            if (params[value][1000].piece === 5) { //5个1000筹码转成1个5000筹码
                setTimeout(() => {
                    chipChange(5000, $(this));
                    removeChip(1000, 5);
                }, 500);

                params[value][1000].piece -= 5; //筹码1000 的piece减去5    
                params[value][1000].nums = params[value][1000].piece ? 1 : 0; //有piece才有注数
                params[value][5000].piece += 1; //筹码5000投注倍数加1
                params[value][5000].nums = params[value][5000].piece ? 1 : 0; //有piece才有注数
            }
            break;
        case 5000:
            params[value][5000].piece += 1;
            params[value][5000].nums = params[value][priceNum].piece ? 1 : 0; //始终都是1注，有piece才有注数
            break;
        default:
            break;
    }

});

//取消投注
cancelButton.off('click').on('click', function (e) {
    letChipFlyBack(Elements_forBet,Elements_change);
});
/* 计算筹码图标，各种面额硬币并非实体，只有1分这个计量单位。
然后每次投钱或者去掉钱，自动把分换算成相应图标。 */
function calculateIcon(count) {//count 1分钱的个数
    
}