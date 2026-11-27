// お邪魔猫クラス（1x1固定・ライン消去対象外・一定ターン経過で消滅）
phina.define('ObstacleCat', {
    superClass: 'DisplayElement',

    init: function (turns) {
        this.superInit();

        this.isObstacle = true;
        this.remainingTurns = turns || 4;
        this.placedCell = null;

        var size = GameConfig.CELL_SIZE;

        // // お邪魔本体ブロック
        var sprite = Sprite("block").addChildTo(this);
        sprite.width = size;
        sprite.height = size;
        sprite.setPosition(0, 0);

        // 残りターン数バッジ
        this.turnLabel = Label({
            text: this.remainingTurns.toString(),
            fontSize: 11,
            fontWeight: 'bold',
            fill: '#fff3bf',
            stroke: '#212529',
            strokeWidth: 3,
        }).addChildTo(this)
            .setPosition(10, 10);
    },

    updateTurnLabel: function () {
        if (this.turnLabel) {
            this.turnLabel.text = this.remainingTurns.toString();
        }
    },

    destroyPiece: function () {
        if (this.children) {
            this.children.forEach(function (child) {
                if (child.children) child.children.clear();
            });
            this.children.clear();
        }
        this.remove();
    }
});

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

    // ★ フェーズ5: 指定したピースが盤面のどこかに1箇所でも配置可能か判定（詰みチェック用）
    canPlaceAnywhere: function (piece) {
        if (!piece || !piece.coords || piece.coords.length === 0) return false;

        var c0 = piece.coords[0];
        // 盤面の全マス (y, x) を基準マス (c0 の配置位置) として総当たり判定
        for (var gy = 0; gy < this.gridCount; gy++) {
            for (var gx = 0; gx < this.gridCount; gx++) {
                var canPlace = true;

                for (var i = 0; i < piece.coords.length; i++) {
                    var c = piece.coords[i];
                    var targetX = gx + (c.x - c0.x);
                    var targetY = gy + (c.y - c0.y);

                    if (!this.isValidGrid(targetX, targetY) || this.gridData[targetY][targetX] !== null) {
                        canPlace = false;
                        break;
                    }
                }

                if (canPlace) {
                    return true; // 1箇所でも置けるマスがあれば詰んでいない
                }
            }
        }
        return false; // 盤面のどこにも置けない（詰み）
    },

    // 盤面を初期状態に完全リセット
    resetAll: function () {
        // 配置済みピース全破棄
        var children = this.pieceLayer.children.slice();
        children.forEach(function (p) {
            if (p.destroyPiece) p.destroyPiece();
            else p.remove();
        });

        // 盤面グリッドデータを null にリセット
        for (var y = 0; y < this.gridCount; y++) {
            for (var x = 0; x < this.gridCount; x++) {
                this.gridData[y][x] = null;
            }
        }
        this.clearGuide();
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

        // 1. 縦横のライン走査（お邪魔猫がいるマスは揃ったとみなさない）
        // 行判定
        for (var y = 0; y < this.gridCount; y++) {
            var rowFull = true;
            for (var x = 0; x < this.gridCount; x++) {
                var cell = this.gridData[y][x];
                if (cell === null || cell.isObstacle) {
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
                var cell = this.gridData[y][x];
                if (cell === null || cell.isObstacle) {
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

        // 2. 揃ったラインにかかっている猫（ピース）を重複なく抽出（お邪魔猫は除外）
        var targetPiecesSet = new Set();

        fullRows.forEach(function (rowY) {
            for (var x = 0; x < this.gridCount; x++) {
                var piece = this.gridData[rowY][x];
                if (piece && !piece.isObstacle) targetPiecesSet.add(piece);
            }
        }, this);

        fullCols.forEach(function (colX) {
            for (var y = 0; y < this.gridCount; y++) {
                var piece = this.gridData[y][colX];
                if (piece && !piece.isObstacle) targetPiecesSet.add(piece);
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
                    totalBlocks: totalClearedBlocks,
                    clearedPieces: targetPieces
                });
            }
        });
    },

    // お邪魔猫を空きマスへランダムに追加
    spawnObstacleCats: function (count) {
        var emptyCells = [];
        for (var y = 0; y < this.gridCount; y++) {
            for (var x = 0; x < this.gridCount; x++) {
                if (this.gridData[y][x] === null) {
                    emptyCells.push({ x: x, y: y });
                }
            }
        }

        // シャッフル (Fisher-Yates)
        for (var i = emptyCells.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = emptyCells[i];
            emptyCells[i] = emptyCells[j];
            emptyCells[j] = tmp;
        }

        var spawnNum = Math.min(count, emptyCells.length);
        for (var k = 0; k < spawnNum; k++) {
            var cell = emptyCells[k];
            // 個別に 1〜3 ターンで消えるお邪魔猫を生成
            var turns = 1 + Math.floor(Math.random() * 3);
            var obstacle = ObstacleCat(turns).addChildTo(this.pieceLayer);
            var pos = this.getCellLocalPos(cell.x, cell.y);
            obstacle.setPosition(pos.x, pos.y);
            obstacle.placedCell = { x: cell.x, y: cell.y };

            this.gridData[cell.y][cell.x] = obstacle;

            obstacle.setScale(0.2);
            obstacle.tweener
                .clear()
                .to({ scaleX: 1.0, scaleY: 1.0 }, 220, 'easeOutBack')
                .play();
        }
        return spawnNum;
    },

    // 盤面上の既存お邪魔猫の残りターンを進め、0になったら消滅させる
    tickObstacleCats: function () {
        var expired = [];
        for (var y = 0; y < this.gridCount; y++) {
            for (var x = 0; x < this.gridCount; x++) {
                var cell = this.gridData[y][x];
                if (cell && cell.isObstacle) {
                    cell.remainingTurns--;
                    if (cell.remainingTurns <= 0) {
                        this.gridData[y][x] = null;
                        expired.push(cell);
                    } else {
                        cell.updateTurnLabel();
                    }
                }
            }
        }

        expired.forEach(function (obs) {
            obs.tweener
                .clear()
                .to({ scaleX: 0.2, scaleY: 0.2, alpha: 0 }, 200, 'easeInQuad')
                .call(function () {
                    obs.destroyPiece();
                })
                .play();
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
        var meowList = ["にゃー", "にゃーん", "ニャー", "ニャーン", "にゃあ", "にゃあにゃあ"];

        // 各猫についてエフェクトレイヤーで昇天演出し、元の猫は確実に削除
        pieces.forEach(function (piece) {
            var meow = meowList[Math.floor(Math.random() * meowList.length)];
            // 鳴き声ラベル
            var spark = Label({
                text: `✨${meow}✨`,
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

            var sounds = ["SE-line_clear_neko1", "SE-line_clear_neko2", "SE-line_clear_neko3", "SE-line_clear_neko4", "SE-line_clear_neko5"];

            setTimeout(() => {
                MySoundManager.playSE(sounds[Math.floor(Math.random() * sounds.length)]);
            }, Math.random() * 100);
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
