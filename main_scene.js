// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',

    init: function () {
        this.superInit({
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
        });

        // 背景色を設定
        this.backgroundColor = GameConfig.COLORS.BG;

        // 1. ヘッダーUI（タイトル・スコア）を描画
        this.createHeader();

        // 2. 8x8 盤面（Board）を配置
        this.board = Board().addChildTo(this)
            .setPosition(GameConfig.SCREEN_WIDTH / 2, 215);

        // 3. 下部3スロット台座を描画
        this.createSlots();
    },

    // ヘッダーUIの作成
    createHeader: function () {
        var headerGroup = DisplayElement().addChildTo(this);

        // ゲームタイトル
        this.titleLabel = Label({
            text: '🐾 猫タイル',
            fontSize: 22,
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(headerGroup)
            .setOrigin(0, 0.5)
            .setPosition(24, 28);

        // スコア表示
        this.scoreTitle = Label({
            text: 'SCORE',
            fontSize: 11,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(headerGroup)
            .setPosition(320, 20);

        this.scoreLabel = Label({
            text: '0',
            fontSize: 20,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SCORE,
        }).addChildTo(headerGroup)
            .setPosition(320, 36);

        // ハイスコア表示
        this.bestTitle = Label({
            text: 'BEST',
            fontSize: 11,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(headerGroup)
            .setPosition(430, 20);

        this.bestLabel = Label({
            text: '0',
            fontSize: 20,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(headerGroup)
            .setPosition(430, 36);
    },

    // 下部3スロット台座の作成
    createSlots: function () {
        this.slotsGroup = DisplayElement().addChildTo(this);
        this.slotBases = [];

        var slotWidth = GameConfig.SLOT_WIDTH;
        var slotHeight = GameConfig.SLOT_HEIGHT;
        var slotY = 440;
        var slotXPositions = [95, 250, 405];

        for (var i = 0; i < GameConfig.SLOT_COUNT; i++) {
            var posX = slotXPositions[i];

            // スロット台座
            var base = RectangleShape({
                width: slotWidth,
                height: slotHeight,
                fill: GameConfig.COLORS.SLOT_BG,
                stroke: GameConfig.COLORS.SLOT_STROKE,
                strokeWidth: 2,
                cornerRadius: 12,
                shadow: 'rgba(0,0,0,0.06)',
                shadowBlur: 4,
            }).addChildTo(this.slotsGroup)
                .setPosition(posX, slotY);

            // スロット枠内に薄いガイドマーク（足跡アイコン風など）
            Label({
                text: '🐾',
                fontSize: 18,
                fill: 'rgba(92, 72, 56, 0.2)',
            }).addChildTo(base);

            this.slotBases.push(base);
        }
    },

    update: function () {
    }
});
