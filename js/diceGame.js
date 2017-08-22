/* 面向对象重构 */
let DiceGame = {
    priceNum: 10, //默认筹码10投注
    pieceCount: {},//这个主要是投注过的筹码翻倍的时候只能翻倍一次，用这个做判定
    allValues: [], //所有选号值集合
    init() {
        let _this = this;
        let diceGameContent = $('.diceGameContent');
        //屏幕自适应
       /*  diceGameContent.css({
            'width': document.body.clientWidth,
        }); */
        //获取桌面选号所有的value值存到数组
        $('[rel="selectCode"]').each(function (index, item) { //获取所有的value值存到数组
            if ($(item).attr('value')) {
                _this.allValues.push($(item).attr('value'));
            }
        });
        //确定所用筹码
        $('.chips>.chip').off('click').on('click', function (e) {
            $(this).addClass('on').siblings('.chip').removeClass('on');
            _this.priceNum = +$(this).attr('value');
        });
        $('.chips>.chip10').trigger('click'); //默认筹码10

        //点击选号
        $('[rel="selectCode"]').off('click').on('click', function (e) {
            let method = $(this).attr('method');
            let odds = $(this).attr('odds');
            let point = $(this).attr('point');
            let value = $(this).attr('value');

            _this.letChipFly(_this.priceNum, $(this));

            setTimeout(() => {
                _this.renderIcon(_this.calculateIcon(_this.getEachCodeMoneyObj()[value]), $(this));
                $('.betMoneyAmount').text(_this.calculateBetMoney(_this.getEachCodeMoneyObj()));
            }, 250);
        });
        //取消投注
        $('.cancelButton').off('click').on('click', function (e) {
            $('[rel="betChip"]').each(function (index, chip) {
                if (!$(chip).hasClass('bettedChip')) {
                    let priceNum = $(chip).attr('price');
                    let to_Chip = $(`.chips .chip${priceNum}`);
                    let styleObj_to = {
                        'position': 'absolute',
                        'left': to_Chip.offset().left,
                        'top': to_Chip.offset().top,
                        'transform': to_Chip.css('transform'),
                        'transition': 'all 0.2s ease',
                    };
                    $(chip).css(styleObj_to);
                    setTimeout(() => {
                        $(chip).remove();
                        $('.betMoneyAmount').text(_this.calculateBetMoney(_this.getEachCodeMoneyObj()));
                    }, 250);
                }
            });
            _this.pieceCount = {};
        });
        //翻倍投注 
        $('.pieceButtoon').off('click').on('click', function (e) {
            $('[rel="betChip"]').each(function (index, chip) {
                let chipClone = $(chip).clone();
                let value = $(chip).attr('code');
                let priceNum = +$(chip).attr('price');
                let fromChip = $(`.chips .chip${priceNum}`);
                let styleObj_from = {
                    'position': 'absolute',
                    'left': fromChip.offset().left,
                    'top': fromChip.offset().top,
                    'transform': fromChip.css('transform'),
                    'transition': 'all 0.2s ease',
                };
                let styleObj_to = {
                    'position': 'absolute',
                    'left': chipClone.css('left'),
                    'top': chipClone.css('top'),
                    'transform': chipClone.css('transform'),
                };
                chipClone.css(styleObj_from);
                new Promise(function (resolve, reject) {
                    if ($(chip).hasClass('bettedChip')) {
                        _this.pieceCount[value] = _this.pieceCount[value] || 0;
                        if (_this.pieceCount[value] < 1) {
                            _this.pieceCount[value]++;
                            let elemA = $(chipClone[0].outerHTML).appendTo($('body'));
                            let elemB = $(chipClone[0].outerHTML).appendTo($('body'));
                            elemA.hasClass('bettedChip') && elemA.removeClass('bettedChip');
                            elemB.hasClass('bettedChip') && elemB.removeClass('bettedChip');
                            setTimeout(function () {
                                elemA.css(styleObj_to);
                                elemB.css(styleObj_to);
                                resolve();
                            }, 200);
                        }
                    } else if (!$(chip).hasClass('bettedChip')) {
                        let elem = chipClone.appendTo($('body'));
                        setTimeout(function () {
                            elem.css(styleObj_to);
                            resolve();
                        }, 200);
                    }
                }).then(function () {
                    setTimeout(() => {
                        _this.renderIcon(_this.calculateIcon(_this.getEachCodeMoneyObj()[value]), $(`[value=${value}][rel="selectCode"]`));
                        $('.betMoneyAmount').text(_this.calculateBetMoney(_this.getEachCodeMoneyObj()));
                    }, 250);
                });

            });

        });
        //确认投注
        $('.betButton').off('click').on('click', function (e) {
            console.log(_this.createOrder());    
            $('[rel="betChip"]').each(function (index, chip) {
                !$(chip).hasClass('bettedChip') && $(chip).addClass('bettedChip');
            });
            _this.pieceCount = {};
        });
    },
    createFlyChip(priceNum, value, method, odds, point) { //创建飞出去的筹码
        let ele = document.createElement('div');
        $(ele).addClass(`flyChip${+priceNum}`).attr({
            'rel': 'betChip',
            'price': +priceNum,
            'code': value,
            'nums': 1,
            'method': method,
            'odds': odds,
            'point': point,
        });
        return $(ele);
    },
    letChipFly(priceNum, element) { //筹码飞出去方法
        let _this = this;
        let method = element.attr('method');
        let odds = element.attr('odds');
        let point = element.attr('point');
        let value = element.attr('value');
        flyingChip = _this.createFlyChip(priceNum, value, method, odds, point);

        flyingChip.css({
            "position": 'absolute',
            "left": $(`.chips>.chip${priceNum}`).offset().left,
            "top": $(`.chips>.chip${priceNum}`).offset().top,
            "transition": 'all 0.2s ease'
        });
        $('body').append(flyingChip);
        flyingChip.css({
            "left": element.offset().left + element[0].offsetWidth / 2 - $('.chips>.chip').width() / 2,
            "top": element.offset().top + element[0].offsetHeight / 2 - $('.chips>.chip').height() / 2,
        });
    },
    addChip(ele, count) { // 加入筹码到桌面
        for (let i = 0; i < count; i++) {
            $(ele).appendTo($('body')).css({
                "transform": `translateY(-${i === 0?(5 * Math.random()):i * 5}px)`,
            });
        }
    },
    /* 计算筹码图标，各种面额硬币并非实体，只有1元这个计量单位。然后每次投钱或者去掉钱，自动把分换算成相应图标。 */
    calculateIcon(count) { //count 1元钱的个数,chipTypes = [1,5,10,20,50,100,1000,5000]
        //5k筹码的个数
        let result = {};
        result[5000] = Math.floor(count / 5000);
        result[1000] = Math.floor((count - result[5000] * 5000) / 1000);
        result[100] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000) / 100);
        result[50] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100) / 50);
        result[20] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50) / 20);
        result[10] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20) / 10);
        result[5] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20 - result[10] * 10) / 5);
        result[1] = Math.floor(count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20 - result[10] * 10 - result[5] * 5);
        return result;
    },
    renderIcon(iconObj, clickedElem) { //根据calculateIcon出的钱种个数生成对应图标
        let _this = this;
        let method = clickedElem.attr('method');
        let odds = clickedElem.attr('odds');
        let point = clickedElem.attr('point');
        let value = clickedElem.attr('value');
        $(`[code="${value}"]`).each(function (index, chip) {
            if ($(chip).hasClass('bettedChip')) {

            } else {
                $(chip).remove();
            }
        });
        for (let key in iconObj) {
            if (iconObj[key]) {
                let elem = _this.createFlyChip(key, value, method, odds, point).css({
                    "position": 'absolute',
                    "left": function () {
                        return clickedElem.offset().left + clickedElem[0].offsetWidth / 2 - $('.chips>.chip').width() / 2; //23是飞盘一半的宽度
                    },
                    "top": function () {
                        return clickedElem.offset().top + clickedElem[0].offsetHeight / 2 - $('.chips>.chip').height() / 2; //21是飞盘一半的高度
                    }
                });
                _this.addChip(elem[0].outerHTML, iconObj[key]);
            }
        }
    },
    getEachCodeMoneyObj() { //计算每个选号上面投注总金额
        let _this = this;
        let countObj = {};
        _this.allValues.forEach((value) => {
            countObj[value] = 0;
            if ($(`[code="${value}"]`).length > 0) {
                $(`[code="${value}"]`).each(function (index, elem) {
                    if (!$(elem).hasClass('bettedChip')) {
                        countObj[value] += Number($(elem).attr('price'));
                    }
                });
            }
        });

        return countObj;
    },
    calculateBetMoney(countObj) { //计算总投注金额
        let result = 0;
        for (let code in countObj) {
            result += Number(countObj[code]);
        }
        return result;
    },
    createOrder() { //生成订单，根据桌面上未投注筹码生成订单数据
        let _this = this;
        let order = [];
        $('[rel="betChip"]').each(function (index, chip) {
            let method = $(chip).attr('method');
            let code = $(chip).attr('code');
            let odds = $(chip).attr('odds');
            let point = $(chip).attr('point');
            let nums = $(chip).attr('nums');
            let price = +$(chip).attr('price');
            if ($(chip).hasClass('bettedChip')) {
                /* 投注过的就不加入订单了 */
            } else {
                order.push({
                    "method": method, //玩法rxfs_rxfs_1z1
                    "code": method.indexOf('hz_hz_hz') !== -1 ? code.slice(-2) : code, //投注号码,和值前面有'hz01'把字符'hz'去掉
                    "odds": odds, //赔率3.96
                    "point": point, //返点    
                    "nums": nums, //投注的注数
                    "piece": 1 * price, //投注的倍数
                    "price": price / price, //筹码金额,全部转换成1元模式
                    "amount": price * 1, //总金额price*piece    
                });
            }
        });
        return _this.mergeOrder(order);
    },
    mergeOrder(order) { //合并method和code相同的对象 订单
        return order.reduce((a, b) => {
            let flagIndex = a.findIndex((item, index) => {
                return item.method === b.method && item.code === b.code;
            });
            if (flagIndex !== -1) {
                a[flagIndex].piece += b.piece;
                a[flagIndex].amount += b.amount;
            } else {
                a.push(b);
            }
            return a;
        }, [{
            method: '',
            code: '',
        }]).slice(1);
    },
    createDiceRollStyle() {//计算随机骰子随机旋转位置
        let style = document.createElement('style');
        let styleStr_left = ``;
        let styleStr_center = ``;
        let styleStr_right = ``;
        for (let i = 0; i < 99; i += 2) {
            styleStr_left += `${i}%{transform: translate3d(${Math.random()*35}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
            styleStr_center += `${i}%{transform: translate3d(${Math.random()*36-18}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
            styleStr_right += `${i}%{transform: translate3d(${Math.random()*35-35}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
        }
        let results = [
            ['transform: translate3d(4px,0px,0px)', 'transform: translate3d(4px,-8px,0px)', 'transform: translate3d(0px,0px,0px)'],
            ['transform: translate3d(4px,0px,0px)', 'transform: translate3d(10px,4px,0px)', 'transform: translate3d(-15px,-8px,0px)'],
            ['transform: translate3d(30px,0px,0px)', 'transform: translate3d(-16px,0px,0px)', 'transform: translate3d(-18px,6px,-6px)'],
            ['transform: translate3d(30px,0px,0px)', 'transform: translate3d(-16px,0px,0px)', 'transform: translate3d(-18px,-6px,-6px)'],
            ['transform: translate3d(0px,0px,0px)', 'transform: translate3d(0px,0px,0px)', 'transform: translate3d(0px,0px,0px)'],
        ];
    
        let result = results[Math.floor(Math.random() * 4)];
    
        styleStr_left += `100% {${result[0]}  rotate(0deg);}`; //最后的位置可以写个数组指定几个位置随机translate3d(-4px,0px,-4px)，translate3d(4px,0px,-4px)，translate3d(-4px,0px,4px)，translate3d(4px,0px,4px)
        styleStr_center += `100% {${result[1]}  rotate(0deg);}`;
        styleStr_right += `100% {${result[2]}  rotate(0deg);}`;
        style.innerHTML = `
            @keyframes diceShake_left {
                ${styleStr_left}
            }
            @keyframes diceShake_center {
                ${styleStr_center}
            }
            @keyframes diceShake_right {
                ${styleStr_right}
            }
        `;
        document.head.appendChild(style);
    },
    blinkArea(openCode) {//计算开奖后闪烁选好区域
        let openCode_arr = openCode.split(','); //"1,2,3" => [1,2,3];
        let openCodeValue_3w = openCode_arr.join(''); //[1,2,3] => 123
        let openCodeValue_2w = choose(openCode_arr, 2).map(itemArr => String(itemArr).split(',').join('')); //[1,2,3] =>[12,13,23]
        let openCodeValue_1w = openCode_arr;
        return [...openCodeValue_1w, ...openCodeValue_2w, openCodeValue_3w];
    },
};

DiceGame.init();

//求数组组合的所有组合方式[1,2,3]->[1,2],[1,3],[2,3]
function choose(arr, size) {
    var allResult = [];

    function _choose(arr, size, result) {
        var arrLen = arr.length;
        if (size > arrLen) {
            return;
        }
        if (size == arrLen) {
            allResult.push([].concat(result, arr))
        } else {
            for (var i = 0; i < arrLen; i++) {
                var newResult = [].concat(result);
                newResult.push(arr[i]);

                if (size == 1) {
                    allResult.push(newResult);
                } else {
                    var newArr = [].concat(arr);
                    newArr.splice(0, i + 　1);
                    _choose(newArr, size - 1, newResult);
                }
            }
        }
    }
    _choose(arr, size, []);

    return allResult;
}