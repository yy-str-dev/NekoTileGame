const ASSETS = {
    image: {
    },
};

const SOUNDS = {
};

var click_hander = function(){
    // メイン処理
    phina.main(function() {
        // アプリケーション生成
        var app = GameApp({
            startLabel: 'main', // メインシーンから開始する
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
            // assets: ASSETS
        });
        // アプリケーション実行
        app.run();
    });
    document.getElementById("front_page").remove();
    document.removeEventListener("click", click_hander);
};
window.onload = () => {

    MySoundManager.loadAssets(SOUNDS);
    document.getElementById("game_launch").addEventListener("click", click_hander);
};
