// Board (8x8 盤面) クラスの定義
phina.define('Board', {
    superClass: 'DisplayElement',

    init: function() {
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

        // ドラッグ時ガイド用レイヤー
        this.guideLayer = DisplayElement().addChildTo(this);
        this.guideRects = [];

        // 配置済みピース用レイヤー
        this.pieceLayer = DisplayElement().addChildTo(this);
    },

    // 8x8 のマス目枠を描画
    drawEmptyGrid: function() {
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
    getCellLocalPos: function(gridX, gridY) {
        return Vector2(
            this.startOffset + gridX * this.pitch,
            this.startOffset + gridY * this.pitch
        );
    },

    // 盤面セルが有効範囲内か判定
    isValidGrid: function(gridX, gridY) {
        return gridX >= 0 && gridX < this.gridCount && gridY >= 0 && gridY < this.gridCount;
    },

    // 指定セルが空いているか
    isEmptyCell: function(gridX, gridY) {
        if (!this.isValidGrid(gridX, gridY)) return false;
        return this.gridData[gridY][gridX] === null;
    },

    // 盤面ローカル座標 (localX, localY) から最寄りのグリッドインデックス (x, y) を逆算
    calcGridIndex: function(localX, localY) {
        var gx = Math.round((localX - this.startOffset) / this.pitch);
        var gy = Math.round((localY - this.startOffset) / this.pitch);
        return { x: gx, y: gy };
    },

    // ピースの全ブロックが配置可能か判定
    canPlaceAt: function(cells) {
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (!this.isValidGrid(c.x, c.y) || !this.isEmptyCell(c.x, c.y)) {
                return false;
            }
        }
        return true;
    },

    // ドラッグ時のガイド枠（ハイライト）を表示
    showGuide: function(cells, isValid, color) {
        this.clearGuide();

        var fillColor = isValid ? (color || 'rgba(80, 200, 120, 0.45)') : 'rgba(230, 70, 70, 0.4)';
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
    clearGuide: function() {
        this.guideRects.forEach(function(r) { r.remove(); });
        this.guideRects = [];
    },

    // ピースを盤面に固定配置
    placePiece: function(piece, cells) {
        this.clearGuide();

        // 盤面データに猫インスタンスを登録
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            this.gridData[c.y][c.x] = piece;
        }
        piece.placedCells = cells.slice();

        // ピースを盤面のピースレイヤーに移管
        piece.addChildTo(this.pieceLayer);

        // 基準マス (cells[0]) からスナップ位置を算出
        var baseGrid = cells[0];
        var baseLocalPos = this.getCellLocalPos(baseGrid.x, baseGrid.y);
        var baseBlockRelX = piece.offsetX + piece.coords[0].x * this.pitch;
        var baseBlockRelY = piece.offsetY + piece.coords[0].y * this.pitch;

        var snapX = baseLocalPos.x - baseBlockRelX;
        var snapY = baseLocalPos.y - baseBlockRelY;

        piece.setPosition(snapX, snapY);
        piece.setScale(1.0);

        // ちょこんと置かれた感のある小さなアニメーション
        piece.scaleX = 1.08;
        piece.scaleY = 0.92;
        piece.tweener
            .clear()
            .to({ scaleX: 1.0, scaleY: 1.0 }, 140, 'easeOutBack')
            .play();

        // ドラッグ無効化
        piece.setInteractive(false);
    }
});
