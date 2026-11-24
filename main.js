const ASSETS = {
    image: {
        // 1ブロック
        "neko_1": "image/neko_1.png",
        // 今後画像を追加する際のキー名一覧（画像ファイルを用意してコメントアウトを解除できます）:
        // 2ブロック
        "neko_2_i_h": "image/neko_2_i_h.png",
        "neko_2_i_v": "image/neko_2_i_v.png",
        // 3ブロック
        "neko_3_i_h": "image/neko_3_i_h.png",
        "neko_3_i_v": "image/neko_3_i_v.png",
        "neko_3_l_0": "image/neko_3_l_0.png",
        "neko_3_l_1": "image/neko_3_l_1.png",
        "neko_3_l_2": "image/neko_3_l_2.png",
        "neko_3_l_3": "image/neko_3_l_3.png",
        // 4ブロック
        // "neko_4_i_h": "image/neko_4_i_h.png",
        // "neko_4_i_v": "image/neko_4_i_v.png",
        "neko_4_l_v0": "image/neko_4_l_v0.png",
        "neko_4_l_v1": "image/neko_4_l_v1.png",
        "neko_4_l_v2": "image/neko_4_l_v2.png",
        "neko_4_l_v3": "image/neko_4_l_v3.png",
        "neko_4_l_h0": "image/neko_4_l_h0.png",
        "neko_4_l_h1": "image/neko_4_l_h1.png",
        "neko_4_l_h2": "image/neko_4_l_h2.png",
        "neko_4_l_h3": "image/neko_4_l_h3.png",
        "neko_4_z_v": "image/neko_4_z_v.png",
        "neko_4_z_h": "image/neko_4_z_h.png",
        "neko_4_totsu_1": "image/neko_4_totsu_1.png",
        "neko_4_totsu_2": "image/neko_4_totsu_2.png",
        "neko_4_totsu_3": "image/neko_4_totsu_3.png",
        "neko_4_totsu_4": "image/neko_4_totsu_4.png",
        // ...
    },
};

const SOUNDS = {
};

var click_handler = function () {
    var frontPage = document.getElementById("front_page");
    if (frontPage) {
        frontPage.remove();
    }

    document.getElementById("canvas").style = "display: block;";

    // メイン処理
    phina.main(function () {
        // アプリケーション生成
        var app = GameApp({
            query: '#canvas',
            startLabel: 'main', // メインシーンから開始
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
            fps: 60,
            assets: ASSETS,
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
