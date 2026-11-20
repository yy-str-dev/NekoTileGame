// Board (8x8 盤面) クラスの定義
phina.define('Board', {
    superClass: 'DisplayElement',

    init: function () {
        this.superInit();

        this.gridCount = GameConfig.GRID_COUNT;
        this.cellSize = GameConfig.CELL_SIZE;
        this.cellGap = GameConfig.CELL_GAP;
        this.padding = GameConfig.BOARD_PADDING;
        this.pitch = this.cellSize + this.cellGap;
        this.startOffset = -((this.gridCount - 1) * this.pitch) / 2;

        // 盤面データ (8x8) : null で初期化
        this.gridData = [];
        for (var y = 0; y < this.gridCount; y++) {
            this.gridData[y] = [];
            for (var x = 0; x < this.gridCount; x++) {
                this.gridData[y][x] = null;
            }
        }

        // 盤面全体のサイズ計算
        var innerWidth = this.gridCount * this.cellSize + (this.gridCount - 1) * this.cellGap;
        this.boardWidth = innerWidth + this.padding * 2;
        this.boardHeight = this.boardWidth;

        // 盤面の外枠・台座を描画
        this.boardBase = RectangleShape({
            width: this.boardWidth,
            height: this.boardHeight,
            fill: GameConfig.COLORS.BOARD_BG,
            stroke: GameConfig.COLORS.BOARD_STROKE,
            strokeWidth: 4,
            cornerRadius: 14,
            shadow: 'rgba(0,0,0,0.1)',
            shadowBlur: 8,
        }).addChildTo(this);

        // 8x8 空セルの描画
        this.cells = [];
        this.drawEmptyGrid();

        // ガイド表示レイヤー
        this.guideLayer = DisplayElement().addChildTo(this);
        this.guideRects = [];

        // 配置済みピース用レイヤー
        this.pieceLayer = DisplayElement().addChildTo(this);

        // 消去エフェクト用最前面レイヤー
        this.effectLayer = DisplayElement().addChildTo(this);
    },

    // 8x8 のマス目枠を描画
    drawEmptyGrid: function () {
        for (var y = 0; y < this.gridCount; y++) {
            this.cells[y] = [];
            for (var x = 0; x < this.gridCount; x++) {
                var pos = this.getCellLocalPos(x, y);

                var cell = RectangleShape({
                    width: this.cellSize,
                    height: this.cellSize,
                    fill: GameConfig.COLORS.CELL_EMPTY,
                    stroke: GameConfig.COLORS.CELL_EMPTY_STROKE,
                    strokeWidth: 2,
                    cornerRadius: 6,
                }).addChildTo(this)
                    .setPosition(pos.x, pos.y);

                cell.gridX = x;
                cell.gridY = y;
                this.cells[y][x] = cell;
            }
        }
    },

    // グリッド座標 (gridX, gridY) のローカル中心座標を取得
    getCellLocalPos: function (gridX, gridY) {
        return Vector2(
            this.startOffset + gridX * this.pitch,
            this.startOffset + gridY * this.pitch
        );
    },

    // 盤面セルが有効範囲内か判定
    isValidGrid: function (gridX, gridY) {
        return gridX >= 0 && gridX < this.gridCount && gridY >= 0 && gridY < this.gridCount;
    },

    // 指定セルが空いているか
    isEmptyCell: function (gridX, gridY) {
        if (!this.isValidGrid(gridX, gridY)) return false;
        return this.gridData[gridY][gridX] === null;
    },

    // 盤面ローカル座標 (localX, localY) から最寄りのグリッドインデックス (x, y) を逆算
    calcGridIndex: function (localX, localY) {
        var gx = Math.round((localX - this.startOffset) / this.pitch);
        var gy = Math.round((localY - this.startOffset) / this.pitch);
        return { x: gx, y: gy };
    },

    // ピースの全ブロックが配置可能か厳密に判定
    canPlaceAt: function (cells) {
        if (!cells || cells.length === 0) return false;
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (!this.isValidGrid(c.x, c.y) || !this.isEmptyCell(c.x, c.y)) {
                return false;
            }
        }
        return true;
    },

    // ドラッグ時のガイド枠（ハイライト）を表示
    showGuide: function (cells, isValid, color) {
        this.clearGuide();
        if (!cells) return;

        var fillColor = isValid ? (color || 'rgba(80, 200, 120, 0.45)') : 'rgba(230, 70, 70, 0.45)';
        var strokeColor = isValid ? '#2ecc71' : '#e74c3c';

        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (this.isValidGrid(c.x, c.y)) {
                var pos = this.getCellLocalPos(c.x, c.y);
                var rect = RectangleShape({
                    width: this.cellSize + 2,
                    height: this.cellSize + 2,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: 2,
                    cornerRadius: 6,
                }).addChildTo(this.guideLayer)
                    .setPosition(pos.x, pos.y);

                this.guideRects.push(rect);
            }
        }
    },

    // ガイド枠をクリア
    clearGuide: function () {
        this.guideRects.forEach(function (r) { r.remove(); });
        this.guideRects = [];
    },

    // ピースを盤面に固定配置
    placePiece: function (piece, cells) {
        this.clearGuide();

        // 盤面データに猫インスタンスを登録
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (this.isValidGrid(c.x, c.y)) {
                this.gridData[c.y][c.x] = piece;
            }
        }
        piece.placedCells = cells.slice();

        // ピースを盤面のピースレイヤーに移管
        piece.addChildTo(this.pieceLayer);

        // 基準マス (cells[0]) からスナップ位置を正確に算出
        var baseGrid = cells[0];
        var baseLocalPos = this.getCellLocalPos(baseGrid.x, baseGrid.y);
        var baseBlockRelX = piece.offsetX + piece.coords[0].x * this.pitch;
        var baseBlockRelY = piece.offsetY + piece.coords[0].y * this.pitch;

        var snapX = baseLocalPos.x - baseBlockRelX;
        var snapY = baseLocalPos.y - baseBlockRelY;

        piece.setPosition(snapX, snapY);
        piece.setScale(1.0);

        // ドラッグ無効化
        piece.setInteractive(false);
    },

    // ★ フェーズ4: ライン消去判定と「かかっている猫全体消去」
    checkAndClearLines: function (onClearComplete) {
        var fullRows = [];
        var fullCols = [];

        // 1. 縦横のライン走査
        // 行判定
        for (var y = 0; y < this.gridCount; y++) {
            var rowFull = true;
            for (var x = 0; x < this.gridCount; x++) {
                if (this.gridData[y][x] === null) {
                    rowFull = false;
                    break;
                }
            }
            if (rowFull) fullRows.push(y);
        }

        // 列判定
        for (var x = 0; x < this.gridCount; x++) {
            var colFull = true;
            for (var y = 0; y < this.gridCount; y++) {
                if (this.gridData[y][x] === null) {
                    colFull = false;
                    break;
                }
            }
            if (colFull) fullCols.push(x);
        }

        var totalLines = fullRows.length + fullCols.length;
        if (totalLines === 0) {
            // 揃ったラインなし
            if (onClearComplete) onClearComplete(null);
            return;
        }

        console.log("【ライン消去発動!】 揃った行:", fullRows, "揃った列:", fullCols);

        // 2. 揃ったラインにかかっている猫（ピース）を重複なく抽出
        var targetPiecesSet = new Set();

        fullRows.forEach(function (rowY) {
            for (var x = 0; x < this.gridCount; x++) {
                var piece = this.gridData[rowY][x];
                if (piece) targetPiecesSet.add(piece);
            }
        }, this);

        fullCols.forEach(function (colX) {
            for (var y = 0; y < this.gridCount; y++) {
                var piece = this.gridData[y][colX];
                if (piece) targetPiecesSet.add(piece);
            }
        }, this);

        var targetPieces = [...targetPiecesSet];
        console.log("【消去対象の猫】 合計", targetPieces.length, "体");

        var totalClearedBlocks = 0;

        // 3. 盤面グリッドから対象猫の全マスを即座に解放 (null に戻す)
        targetPieces.forEach(function (piece) {
            if (piece.placedCells) {
                totalClearedBlocks += piece.placedCells.length;
                piece.placedCells.forEach(function (c) {
                    if (this.isValidGrid(c.x, c.y)) {
                        this.gridData[c.y][c.x] = null;
                    }
                }, this);
            }
        }, this);

        // 4. 消去アニメーションの実行＆猫ピースの完全削除
        this.playLineClearEffects(fullRows, fullCols);
        var self = this;
        this.playCatsAscendAnimation(targetPieces, function () {
            // 盤面の描画ゴミ（データ上消えているのに残っているスプライト）を完全一掃
            self.cleanupOrphanPieces();

            if (onClearComplete) {
                onClearComplete({
                    lineCount: totalLines,
                    catCount: targetPieces.length,
                    totalBlocks: totalClearedBlocks
                });
            }
        });
    },

    // 盤面上の孤立ピース（データ上存在しないスプライト）を確実に一掃
    cleanupOrphanPieces: function () {
        var activePieces = new Set();
        for (var y = 0; y < this.gridCount; y++) {
            for (var x = 0; x < this.gridCount; x++) {
                if (this.gridData[y][x]) {
                    activePieces.add(this.gridData[y][x]);
                }
            }
        }
        var children = this.pieceLayer.children.slice();
        children.forEach(function (p) {
            if (!activePieces.has(p)) {
                if (p.destroyPiece) p.destroyPiece();
                else p.remove();
            }
        });
    },

    // 揃ったラインのフラッシュ光演出
    playLineClearEffects: function (fullRows, fullCols) {
        var innerWidth = this.gridCount * this.cellSize + (this.gridCount - 1) * this.cellGap;

        // 行フラッシュ
        fullRows.forEach(function (rowY) {
            var pos = this.getCellLocalPos(0, rowY);
            var lineBar = RectangleShape({
                width: innerWidth + 12,
                height: this.cellSize + 6,
                fill: 'rgba(255, 255, 255, 0.9)',
                stroke: '#ffd166',
                strokeWidth: 3,
                cornerRadius: 8,
            }).addChildTo(this.effectLayer)
                .setPosition(0, pos.y);

            lineBar.tweener
                .clear()
                .to({ alpha: 0, scaleY: 1.5 }, 300, 'easeOutQuad')
                .call(function () { lineBar.remove(); })
                .play();
        }, this);

        // 列フラッシュ
        fullCols.forEach(function (colX) {
            var pos = this.getCellLocalPos(colX, 0);
            var lineBar = RectangleShape({
                width: this.cellSize + 6,
                height: innerWidth + 12,
                fill: 'rgba(255, 255, 255, 0.9)',
                stroke: '#ffd166',
                strokeWidth: 3,
                cornerRadius: 8,
            }).addChildTo(this.effectLayer)
                .setPosition(pos.x, 0);

            lineBar.tweener
                .clear()
                .to({ alpha: 0, scaleX: 1.5 }, 300, 'easeOutQuad')
                .call(function () { lineBar.remove(); })
                .play();
        }, this);
    },

    // 猫たちの昇天・成仏アニメーション（確実に盤面から消滅させる）
    playCatsAscendAnimation: function (pieces, callback) {
        var self = this;

        // 各猫についてエフェクトレイヤーで昇天演出し、元の猫は確実に削除
        pieces.forEach(function (piece) {
            // 成仏ラベル
            var spark = Label({
                text: '✨成仏✨',
                fontSize: 18,
                fontWeight: 'bold',
                fill: '#ff4757',
                stroke: '#ffffff',
                strokeWidth: 4,
            }).addChildTo(self.effectLayer)
                .setPosition(piece.x, piece.y);

            spark.tweener
                .clear()
                .to({ y: piece.y - 50, alpha: 0, scaleX: 1.4, scaleY: 1.4 }, 500, 'easeOutCubic')
                .call(function () { spark.remove(); })
                .play();

            // ピースをエフェクトレイヤーに移して、上に昇りながらフェードアウト
            piece.addChildTo(self.effectLayer);

            // トゥイーンで浮かび上がりフェードアウト後、確実に destroyPiece()
            piece.tweener
                .clear()
                .to({
                    y: piece.y - 35,
                    scaleX: 1.25,
                    scaleY: 1.25,
                    alpha: 0
                }, 320, 'easeOutQuad')
                .call(function () {
                    if (piece.destroyPiece) piece.destroyPiece();
                    else piece.remove();
                })
                .play();
        });

        // アニメーション完了後に確実にクリーンアップ
        setTimeout(function () {
            pieces.forEach(function (p) {
                if (p.destroyPiece) p.destroyPiece();
                else if (p.parent) p.remove();
            });
            self.cleanupOrphanPieces();
            if (callback) callback();
        }, 340);
    }
});
