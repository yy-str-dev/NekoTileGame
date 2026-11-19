// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',
    init: function(){
        this.superInit();
        // 背景色を指定
        this.backgroundColor = '#d2eaff';

        drawStage(this);
    },
    update: function(){

    }
});

function drawStage(group){
    var pos = calcPosition(PositionOrigin.LEFT_CENTER, new Vector2(16, 0)),
        quad = RectangleShape({
            width: stageWidth(),
            height: stageHeight(),
            fill: "#fff8aa",
            stroke: "#cabe39",
            cornerRadius: 30
        }).addChildTo(group)
        .setOrigin(0, 0.5)
        .setPosition(pos.x, pos.y);
}

function stageWidth(){
    return calcWidthScreenRate(0.6);
}

function stageHeight(){
    return stageWidth();
}
