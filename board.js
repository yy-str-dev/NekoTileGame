// Board (8x8 盤面) クラスの定義
phina.define('Board', {
    superClass: 'DisplayElement',

    init: function() {
        this.superInit();

        this.gridCount = GameConfig.GRID_COUNT;
        this.cellSize = GameConfig.CELL_SIZE;
        this.cellGap = GameConfig.CELL_GAP;
        this.padding = GameConfig.BOARD_PADDING;

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

        // 8x8 セルの描画
        this.cells = [];
        this.drawEmptyGrid();
    },

    // 8x8 のマス目枠を描画
    drawEmptyGrid: function() {
        var startOffset = -((this.gridCount - 1) * (this.cellSize + this.cellGap)) / 2;

        for (var y = 0; y < this.gridCount; y++) {
            this.cells[y] = [];
            for (var x = 0; x < this.gridCount; x++) {
                var posX = startOffset + x * (this.cellSize + this.cellGap);
                var posY = startOffset + y * (this.cellSize + this.cellGap);

                var cell = RectangleShape({
                    width: this.cellSize,
                    height: this.cellSize,
                    fill: GameConfig.COLORS.CELL_EMPTY,
                    stroke: GameConfig.COLORS.CELL_EMPTY_STROKE,
                    strokeWidth: 2,
                    cornerRadius: 6,
                }).addChildTo(this)
                  .setPosition(posX, posY);

                cell.gridX = x;
                cell.gridY = y;
                this.cells[y][x] = cell;
            }
        }
    },

    // グリッド座標 (gridX, gridY) のローカル中心座標を取得
    getCellLocalPos: function(gridX, gridY) {
        var startOffset = -((this.gridCount - 1) * (this.cellSize + this.cellGap)) / 2;
        return Vector2(
            startOffset + gridX * (this.cellSize + this.cellGap),
            startOffset + gridY * (this.cellSize + this.cellGap)
        );
    },

    // 盤面データ取得
    getCellData: function(gridX, gridY) {
        if (this.isValidGrid(gridX, gridY)) {
            return this.gridData[gridY][gridX];
        }
        return null;
    },

    // 盤面セルが有効範囲内か判定
    isValidGrid: function(gridX, gridY) {
        return gridX >= 0 && gridX < this.gridCount && gridY >= 0 && gridY < this.gridCount;
    }
});
