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

        // スコア管理
        this.scoreManager = ScoreManager().addChildTo(this);

        // ドラッグ状態管理
        this.draggingPiece = null;
        this.currentDropCells = null;
        this.isClearing = false;

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

        // 6. ポップアップテキスト等UIエフェクトレイヤー
        this.uiEffectLayer = DisplayElement().addChildTo(this);

        // 初期スコア表示を同期
        this.updateScoreDisplay();

        // シーン全体のポインタイベント設定（ドラッグ＆ドロップ）
        this.setupDragEvents();
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
            .setPosition(300, 20);

        this.scoreLabel = Label({
            text: '0',
            fontSize: 22,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SCORE,
        }).addChildTo(headerGroup)
            .setPosition(300, 38);

        // ハイスコア表示
        this.bestTitle = Label({
            text: 'BEST',
            fontSize: 11,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(headerGroup)
            .setPosition(400, 20);

        this.bestLabel = Label({
            text: '0',
            fontSize: 22,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(headerGroup)
            .setPosition(400, 38);
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

            // スロット枠内に薄いガイドマーク
            Label({
                text: '🐾',
                fontSize: 18,
                fill: 'rgba(92, 72, 56, 0.2)',
            }).addChildTo(base);

            this.slotBases.push(base);
        }
    },

    // スコア表示の更新とポンッと跳ねるアニメーション
    updateScoreDisplay: function (bounce) {
        this.scoreLabel.text = this.scoreManager.currentScore.toString();
        this.bestLabel.text = this.scoreManager.highScore.toString();

        if (bounce) {
            this.scoreLabel.tweener
                .clear()
                .to({ scaleX: 1.3, scaleY: 1.3 }, 80)
                .to({ scaleX: 1.0, scaleY: 1.0 }, 120, 'easeOutBack')
                .play();
        }
    },

    // 画面上にフワッと飛び出すスコア表示（ポップアップテキスト）
    showFloatingText: function (text, x, y, color) {
        var label = Label({
            text: text,
            fontSize: 22,
            fontWeight: 'bold',
            fill: color || GameConfig.COLORS.TEXT_SCORE,
            stroke: '#ffffff',
            strokeWidth: 4,
        }).addChildTo(this.uiEffectLayer)
            .setPosition(x, y);

        label.tweener
            .clear()
            .to({ y: y - 45, scaleX: 1.2, scaleY: 1.2, alpha: 0.9 }, 350, 'easeOutCubic')
            .to({ y: y - 60, alpha: 0 }, 200)
            .call(function () { label.remove(); })
            .play();
    },

    // ドラッグ＆ドロップイベントの制御
    setupDragEvents: function () {
        var self = this;

        // ドラッグ中の移動追従
        this.on('pointmove', function (e) {
            if (!self.draggingPiece) return;

            var piece = self.draggingPiece;
            // 指やカーソルでブロックが隠れないように、少し上（Y: -50px）にオフセット
            piece.setPosition(e.pointer.x, e.pointer.y - 50);

            // ★ 基準ブロック (coords[0]) から基準グリッドインデックスを算出
            var pitch = self.board.pitch;
            var c0 = piece.coords[0];
            var block0RelX = piece.offsetX + c0.x * pitch;
            var block0RelY = piece.offsetY + c0.y * pitch;

            var local0X = (piece.x - self.board.x) + block0RelX;
            var local0Y = (piece.y - self.board.y) + block0RelY;

            var baseGrid = self.board.calcGridIndex(local0X, local0Y);

            // ★ 基準グリッドから各ブロックの相対位置を厳密に生成（形状破壊・丸めズレを完全防止）
            var targetCells = [];
            for (var i = 0; i < piece.coords.length; i++) {
                var c = piece.coords[i];
                var gx = baseGrid.x + (c.x - c0.x);
                var gy = baseGrid.y + (c.y - c0.y);
                targetCells.push({ x: gx, y: gy });
            }

            var canPlace = self.board.canPlaceAt(targetCells);
            self.board.showGuide(targetCells, canPlace, piece.color);

            self.currentDropCells = canPlace ? targetCells : null;
        });

        // ドロップ（指・マウスを離した時）
        this.on('pointend', function (e) {
            if (!self.draggingPiece) return;

            var piece = self.draggingPiece;
            var slotIndex = piece.slotIndex;

            if (self.currentDropCells) {
                // 配置成功！
                var placedCells = self.currentDropCells;
                console.log("【配置確定】 ピース:", piece.pose, "セル:", placedCells);

                self.board.placePiece(piece, placedCells);

                // 1. 配置スコアを加算
                var placePoints = self.scoreManager.addPlaceScore(piece.blockCount);
                self.updateScoreDisplay(false);

                // 2. スロットから該当ピースを除去し、即時1体補充！
                self.pieceStock.takePiece(slotIndex);
                self.pieceStock.replenish(slotIndex);

                self.draggingPiece = null;
                self.currentDropCells = null;

                // 3. ★ ライン消去判定 ＆ かかっている猫全体消去！
                self.isClearing = true;
                self.board.checkAndClearLines(function (clearResult) {
                    self.isClearing = false;
                    if (clearResult) {
                        // 消去スコア加算
                        var clearPoints = self.scoreManager.addClearScore(
                            clearResult.lineCount,
                            clearResult.totalBlocks,
                            clearResult.catCount
                        );
                        self.updateScoreDisplay(true);

                        // 爽快ポップアップ表示
                        var msg = '✨成仏!! +' + clearPoints;
                        if (clearResult.lineCount >= 2) {
                            msg += ' (' + clearResult.lineCount + '列同時!)';
                        }
                        self.showFloatingText(msg, self.board.x, self.board.y - 110, '#ff4757');
                    }
                });
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
                    .call(function () {
                        piece.addChildTo(self.pieceStock);
                    })
                    .play();

                self.draggingPiece = null;
                self.currentDropCells = null;
            }
        });
    },

    // ピースのドラッグ開始処理 (Piece の pointstart から呼び出される)
    startDragPiece: function (piece, event) {
        if (this.draggingPiece || this.isClearing) return;

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

    update: function () {
    }
});
