let diceCanvas = {
    chipsImgObj: null, //筹码图片对象
    flyState: 'flyTo', //默认飞出去
    ctxFly: null, //画筹码飞的画笔
    ctxStop: null, //画筹码停止的画笔
    eachBetCount: {}, //容器，每个面额筹码的个数，key为priceNum，value为这个面额的筹码个数
    priceNum: 10, //默认所用面额的筹码
    betRecords: {}, //记录投注过的method，price，code,amount汇总
    eachRecords: [], //记录每次点击投注的相关数据，初始坐标，priceNum等
    pricePos: { //chips图片上每个筹码图片对应的位置
        1: [0, 0],
        5: [166, 0],
        10: [166 * 2, 0],
        20: [166 * 3, 0],
        50: [166 * 4, 0],
        100: [166 * 5, 0],
        1000: [166 * 6, 0],
        5000: [166 * 7, 0],
    },
    stopOffset: {
        1: -8,
        5: -6,
        10: -4,
        20: -2,
        50: 0,
        100: 2,
        1000: 4,
        5000: 6,
    },
    init() {
        let _this = this;
        //拿到画布
        let canvas_fly = document.getElementById('canvas_fly');
        canvas_fly.width = document.body.clientWidth;
        canvas_fly.height = document.body.clientHeight || 800;
        _this.ctxFly = canvas_fly.getContext('2d');
        let canvas_stop = document.getElementById('canvas_stop');
        canvas_stop.width = document.body.clientWidth;
        canvas_stop.height = document.body.clientHeight || 800;
        _this.ctxStop = canvas_stop.getContext('2d');
        let canvas_betted = document.getElementById('canvas_betted');
        canvas_betted.width = document.body.clientWidth;
        canvas_betted.height = document.body.clientHeight || 800;
        _this.ctxBetted = canvas_betted.getContext('2d');
        //拿到chipsImgObj对象
        let img = new Image();
        img.onload = function () {
            _this.chipsImgObj = this; //拿到chipsImgObj对象
        }
        img.src = './images/chips.png';

        //确定所用筹码
        $('.chips>.chip').off('click').on('click', function (e) {
            $(this).addClass('on').siblings('.chip').removeClass('on');
            _this.priceNum = +$(this).attr('pricenum');
        });
        $('.chips>.chip10').trigger('click'); //默认筹码10

        //点击桌面选号
        $('[rel="selectCode"]').off('click').on('click', function (e) {
            _this.flyState = 'flyTo';
            let code = $(this).attr('value');
            let method = $(this).attr('method');
            let startPos = {
                x: $(`.chips .chip${_this.priceNum}`).offset().left,
                y: $(`.chips .chip${_this.priceNum}`).offset().top,
            };
            let endPos = {
                x: $(this).offset().left + $(this)[0].offsetWidth / 2 - $('.chips>.chip').width() / 2,
                y: $(this).offset().top + $(this)[0].offsetHeight / 2 - $('.chips>.chip').height() / 2,
            };
            _this.eachBetCount[code] = _this.eachBetCount[code] || 0;
            _this.eachBetCount[code] += _this.priceNum;
            _this.betRecords[code] = { //记录order
                method: method,
                code: code,
                price: _this.priceNum,
                amount: _this.eachBetCount[code],
                piece: _this.eachBetCount[code],
            };
            _this.eachRecords.push({ //记录投注
                elem: $(this),
                priceNum: _this.priceNum,
                startPos,
                endPos,
            });
            _this.chipFly(_this.ctxFly, _this.ctxStop, _this.chipsImgObj, _this.priceNum, startPos, endPos, $(this), 30);
        });
        //取消投注
        $('.cancelButton').off('click').on('click', function (e) {
            _this.flyState = 'flyBack';
            _this.ctxStop.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
            _this.eachRecords.forEach((record) => {
                _this.chipFly(_this.ctxFly, _this.ctxStop, _this.chipsImgObj, record.priceNum, record.endPos, record.startPos, record.elem, 30);
            });
            //eachRecords,betRecords回到初始值
            _this.eachRecords.length = 0;
            _this.betRecords = {};
        });
        //确认投注
    },
    /**
     * 创建飞盘飞出的函数
     * 
     * @param {object} ctx  canvas画笔
     * @param {object} img  画的图片对象
     * @param {object} startPos 开始坐标
     * @param {object} endPos 结束坐标
     * @param {number} duration 动画持续时间 ms单位
     */
    chipFly(ctxFly, ctxStop, img, priceNum, startPos, endPos, clickedElem, duration) {
        let _this = this;
        let startTime = new Date().getTime();
        let X = startPos['x'];
        let Y = startPos['y'];
        let speedX = (endPos['x'] - startPos['x']) / duration;
        let speedY = (endPos['y'] - startPos['y']) / duration;
        let animation = null;

        function _chipFly() {

            ctxFly.clearRect(X, Y, 42, 42);
            X += speedX;
            Y += speedY;
            if ((speedX < 0 && X < endPos['x']) || (speedX > 0 && X > endPos['x'])) { //判断停止的条件，坐标超过目标坐标就停
                ctxFly.clearRect(X, Y, 42, 42);
                cancelAnimationFrame(animation);
                //换另一只画笔来画落地筹码，防止别的筹码经过这里的时候把这个筹码清除
                if (_this.flyState === 'flyTo') { //如果是飞出去的会重新计算筹码渲染,飞回来的就直接消失不进入这个逻辑
                    let code = clickedElem.attr('value');
                    let priceCountObj = _this.calculateIcon(_this.eachBetCount[code]);
                    ctxStop.clearRect(clickedElem.offset().left, clickedElem.offset().top, clickedElem.outerWidth(), clickedElem.outerHeight()); //先清除之前画的
                    _this.chipStop(ctxStop, img, priceCountObj, endPos, clickedElem);
                }

                return;
            }

            ctxFly.drawImage(img, ..._this.pricePos[priceNum], 120, 120, X, Y, 42, 42);

            animation = requestAnimationFrame(_chipFly);
        }
        _chipFly();
    },

    /**
     * 
     * 
     * @param {object} ctxStop 画笔
     * @param {object} img 
     * @param {object} priceCountObj 每个筹码的个数{1:2,5:10,10:1,...,5000:1}
     * @param {object} endPos 坐标
     */
    chipStop(ctxStop, img, priceCountObj, endPos, clickedElem) {
        let _this = this;
        //不同面额筹码位置错开
        for (let priceNum in priceCountObj) {
            for (let i = 0; i < priceCountObj[priceNum]; i++) {
                let x = endPos['x'];
                let y = endPos['y'] + _this.stopOffset[priceNum] - i * 2;
                y = y > clickedElem.offset().top ? y : clickedElem.offset().top;
                ctxStop.drawImage(img, ..._this.pricePos[priceNum], 120, 120, x, y, 42, 42);
            }
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
};
diceCanvas.init();