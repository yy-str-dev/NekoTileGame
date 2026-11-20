// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',
    init: function(){
        this.superInit();
        // 背景色を指定
        this.backgroundColor = '#d2eaff';

        this.drawStage(this);
    },
    update: function(){

    },
    drawStage: function(group){
        var pos = calcPosition(PositionOrigin.LEFT_CENTER, Vector2(16, 0)),
            quad = RectangleShape({
                width: this.stageWidth(),
                height: this.stageHeight(),
                fill: "#fff8aa",
                stroke: "#cabe39",
                cornerRadius: 10
            }).addChildTo(group)
            .setOrigin(0, 0.5)
            .setPosition(pos.x, pos.y);
    },
    drawGrid: function(group){
    },
    stageWidth: function(){
        return calcWidthScreenRate(0.6);
    },
    stageHeight: function(){
        return this.stageWidth();
    }
});
