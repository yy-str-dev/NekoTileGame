const ASSETS = {
    image: {
    },
};

const SOUNDS = {
};

var click_handler = function() {
    var frontPage = document.getElementById("front_page");
    if (frontPage) {
        frontPage.remove();
    }

    document.getElementById("canvas").style = "display: block;";

    // メイン処理
    phina.main(function() {
        // アプリケーション生成
        var app = GameApp({
            query: '#canvas',
            startLabel: 'main', // メインシーンから開始
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
            fps: 60,
        });
        // アプリケーション実行
        app.run();
    });
};

window.onload = () => {
    MySoundManager.loadAssets(SOUNDS);
    var launchBtn = document.getElementById("game_launch");
    if (launchBtn) {
        launchBtn.addEventListener("click", click_handler);
    }
};
