let params = {
    "method": null,//玩法rxfs_rxfs_1z1
    "code": null,//投注号码
    "nums": 0,//投注的注数
    "piece": 1,//投注的倍数
    "odds": null,//赔率3.96
    "point": null,//返点
    "amount": 1//筹码
};
$('.dxds_da').off('click').on('click',function(e){
    let objParam = Object.create(null);
    objParam.method = $(this).attr('method');
    objParam.code = $(this).attr('value');
    objParam.nums = 1;//注数为1
    objParam.piece += 1;//倍数每点击一次加1
    if(objParam.piece === 5) {
        params.amount = 5;
        objParam.piece = 1;
    }
});
//投注算投注内容的时候就看桌子上放的筹码