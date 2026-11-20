// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',

    init: function() {
        this.superInit({
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
        });

        // 背景色を設定
        this.backgroundColor = GameConfig.COLORS.BG;

        // ドラッグ状態管理
        this.draggingPiece = null;
        this.currentDropCells = null;

        // 1. ヘッダーUI（タイトル・スコア）を描画
        this.createHeader();

        // 2. 8x8 盤面（Board）を配置
        this.board = Board().addChildTo(this)
            .setPosition(GameConfig.SCREEN_WIDTH / 2, 215);

        // 3. 下部3スロット台座を描画
        this.createSlots();

        // 4. 猫ピースの手札管理 (PieceStock) を生成し、3枠に猫を補充
        this.pieceStock = PieceStock().addChildTo(this);

        // 5. ドラッグ中の最前面レイヤー
        this.dragLayer = DisplayElement().addChildTo(this);

        // シーン全体のポインタイベント設定（ドラッグ＆ドロップ）
        this.setupDragEvents();
    },

    // ヘッダーUIの作成
    createHeader: function() {
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
    createSlots: function() {
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

            // スロット枠内に薄いガイドマーク
            Label({
                text: '🐾',
                fontSize: 18,
                fill: 'rgba(92, 72, 56, 0.2)',
            }).addChildTo(base);

            this.slotBases.push(base);
        }
    },

    // ドラッグ＆ドロップイベントの制御
    setupDragEvents: function() {
        var self = this;

        // ドラッグ中の移動追従
        this.on('pointmove', function(e) {
            if (!self.draggingPiece) return;

            var piece = self.draggingPiece;
            // 指やカーソルでブロックが隠れないように、少し上（Y: -50px）にオフセット
            piece.setPosition(e.pointer.x, e.pointer.y - 50);

            // 盤面上での対応セルを計算
            var pitch = self.board.pitch;
            var targetCells = [];

            for (var i = 0; i < piece.coords.length; i++) {
                var c = piece.coords[i];
                var blockRelX = piece.offsetX + c.x * pitch;
                var blockRelY = piece.offsetY + c.y * pitch;

                // 盤面ローカル座標
                var localX = (piece.x - self.board.x) + blockRelX;
                var localY = (piece.y - self.board.y) + blockRelY;

                var gridIndex = self.board.calcGridIndex(localX, localY);
                targetCells.push(gridIndex);
            }

            var canPlace = self.board.canPlaceAt(targetCells);
            self.board.showGuide(targetCells, canPlace, piece.color);

            self.currentDropCells = canPlace ? targetCells : null;
        });

        // ドロップ（指・マウスを離した時）
        this.on('pointend', function(e) {
            if (!self.draggingPiece) return;

            var piece = self.draggingPiece;
            var slotIndex = piece.slotIndex;

            if (self.currentDropCells) {
                // 配置成功！
                self.board.placePiece(piece, self.currentDropCells);

                // スロットから該当ピースを除去し、即時1体補充！
                self.pieceStock.takePiece(slotIndex);
                self.pieceStock.replenish(slotIndex);

                self.draggingPiece = null;
                self.currentDropCells = null;
            } else {
                // 配置失敗（スロットの位置へ戻す）
                self.board.clearGuide();

                piece.tweener
                    .clear()
                    .to({
                        x: piece.homePos.x,
                        y: piece.homePos.y,
                        scaleX: 0.65,
                        scaleY: 0.65
                    }, 180, 'easeOutQuad')
                    .call(function() {
                        piece.addChildTo(self.pieceStock);
                    })
                    .play();

                self.draggingPiece = null;
                self.currentDropCells = null;
            }
        });
    },

    // ピースのドラッグ開始処理 (Piece の pointstart から呼び出される)
    startDragPiece: function(piece, event) {
        if (this.draggingPiece) return;

        this.draggingPiece = piece;
        this.currentDropCells = null;

        // 最前面レイヤーに移動
        piece.addChildTo(this.dragLayer);

        // 指の少し上（Y: -50px）に移動しつつ、等倍 (1.0) に拡大
        var startY = event.pointer.y - 50;
        piece.setPosition(event.pointer.x, startY);

        piece.tweener
            .clear()
            .to({ scaleX: 1.0, scaleY: 1.0 }, 100, 'easeOutQuad')
            .play();
    },

    update: function() {
    }
});
