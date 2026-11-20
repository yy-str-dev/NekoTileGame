// ピースの形状定義とポーズ定義（全ポーズをはっきりと識別できる7色に分離）
const PIECE_DEFINITIONS = [
    // --- 1ブロック (丸まり猫) ---
    {
        type: '1_SINGLE',
        pose: '丸まり猫',
        color: '#ff9233', // 鮮やかな茶トラオレンジ
        stroke: '#d96b00',
        variations: [
            [{ x: 0, y: 0 }]
        ]
    },

    // --- 2ブロック (横向き猫) ---
    {
        type: '2_I',
        pose: '横向き猫',
        color: '#ff5964', // コーラルピンク/レッド
        stroke: '#d9303e',
        variations: [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }], // 横
            [{ x: 0, y: 0 }, { x: 0, y: 1 }]  // 縦
        ]
    },

    // --- 3ブロック (伸び猫: I字) ---
    {
        type: '3_I',
        pose: '伸び猫',
        color: '#51cf66', // 若草ライムグリーン
        stroke: '#2b8a3e',
        variations: [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // 横
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]  // 縦
        ]
    },

    // --- 3ブロック (くの字猫: L字) ---
    {
        type: '3_L',
        pose: 'くの字猫',
        color: '#339af0', // 鮮やかなスカイブルー
        stroke: '#1c7ed6',
        variations: [
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
        ]
    },

    // --- 4ブロック (長〜い猫: I字) ---
    {
        type: '4_I',
        pose: '長〜い猫',
        color: '#cc5de8', // アメジストパープル
        stroke: '#ae3ec9',
        variations: [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], // 横
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }]  // 縦
        ]
    },

    // --- 4ブロック (直角猫: L字) ---
    {
        type: '4_L',
        pose: '直角猫',
        color: '#20c997', // エメラルドターコイズ
        stroke: '#0ca678',
        variations: [
            // 縦長 3x2
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
            [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
            // 横長 2x3
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }],
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
            [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
        ]
    },

    // --- 4ブロック (くねくね猫: Z字/S字) ---
    {
        type: '4_Z',
        pose: 'くねくね猫',
        color: '#fcc419', // ハニーマスタードイエロー
        stroke: '#e67700',
        variations: [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }], // 横Z
            [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }], // 縦Z
            [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], // 横S
            [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }]  // 縦S
        ]
    }
];

// 猫ピースクラス
var pieceUniqueIdCounter = 1;

phina.define('Piece', {
    superClass: 'DisplayElement',

    init: function(shapeDef, variationCoords) {
        this.superInit();

        this.uid = pieceUniqueIdCounter++;
        this.shapeDef = shapeDef;
        this.coords = variationCoords; // [{x, y}, ...]
        this.color = shapeDef.color;
        this.stroke = shapeDef.stroke;
        this.pose = shapeDef.pose;

        this.cellSize = GameConfig.CELL_SIZE;
        this.cellGap = GameConfig.CELL_GAP;

        // 占有しているセル数
        this.blockCount = this.coords.length;

        // 盤面に置かれた際のセルリスト [{x, y}, ...]
        this.placedCells = [];

        // ピース全体のバウンディングボックスを計算
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        this.coords.forEach(function(c) {
            if (c.x < minX) minX = c.x;
            if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y;
            if (c.y > maxY) maxY = c.y;
        });
        this.gridWidth = maxX - minX + 1;
        this.gridHeight = maxY - minY + 1;

        // 中心オフセット（ピースの中心が原点 (0, 0) になるよう調整）
        this.pitch = this.cellSize + this.cellGap;
        this.offsetX = -((this.gridWidth - 1) * this.pitch) / 2;
        this.offsetY = -((this.gridHeight - 1) * this.pitch) / 2;

        // ブロックごとの矩形を描画
        this.blockSprites = [];
        for (var i = 0; i < this.coords.length; i++) {
            var c = this.coords[i];
            var bx = this.offsetX + c.x * this.pitch;
            var by = this.offsetY + c.y * this.pitch;

            var block = RectangleShape({
                width: this.cellSize,
                height: this.cellSize,
                fill: this.color,
                stroke: this.stroke,
                strokeWidth: 2,
                cornerRadius: 8,
                shadow: 'rgba(0,0,0,0.12)',
                shadowBlur: 4,
            }).addChildTo(this)
              .setPosition(bx, by);

            // 先頭ブロックに猫耳と顔マークを付ける（仮スプライト）
            if (i === 0) {
                // 左耳
                TriangleShape({
                    radius: 7,
                    fill: this.stroke,
                    stroke: this.stroke,
                    strokeWidth: 1,
                }).addChildTo(block)
                  .setPosition(-9, -14)
                  .setRotation(-15);

                // 右耳
                TriangleShape({
                    radius: 7,
                    fill: this.stroke,
                    stroke: this.stroke,
                    strokeWidth: 1,
                }).addChildTo(block)
                  .setPosition(9, -14)
                  .setRotation(15);

                // 顔アイコン
                Label({
                    text: '🐱',
                    fontSize: 16,
                }).addChildTo(block)
                  .setPosition(0, 0);
            } else {
                // 胴体には肉球マーク
                Label({
                    text: '🐾',
                    fontSize: 12,
                    fill: 'rgba(255,255,255,0.7)',
                }).addChildTo(block)
                  .setPosition(0, 0);
            }

            this.blockSprites.push(block);
        }

        // ドラッグ操作を有効化
        this.setInteractive(true);
        this.boundingType = 'rect';
        this.width = this.gridWidth * this.pitch;
        this.height = this.gridHeight * this.pitch;

        var self = this;
        this.on('pointstart', function(e) {
            var scene = self.getRoot();
            if (scene && scene.startDragPiece) {
                scene.startDragPiece(self, e);
            }
        });
    },

    // 子要素を完全に破棄して自身を削除
    destroyPiece: function() {
        if (this.children) {
            this.children.forEach(function(child) {
                if (child.children) child.children.clear();
            });
            this.children.clear();
        }
        this.remove();
    },

    // ランダムな猫ピースを生成するファクトリメソッド
    _static: {
        createRandom: function() {
            var shapeDef = PIECE_DEFINITIONS.random();
            var coords = shapeDef.variations.random();
            return Piece(shapeDef, coords);
        }
    }
});

// 手札スロット管理クラス (3枠)
phina.define('PieceStock', {
    superClass: 'DisplayElement',

    init: function() {
        this.superInit();

        this.slots = [null, null, null];
        this.slotPositions = [
            Vector2(95, 440),
            Vector2(250, 440),
            Vector2(405, 440)
        ];

        // 初期状態で3枠すべてにランダムな猫ピースを補充
        for (var i = 0; i < 3; i++) {
            this.replenish(i);
        }
    },

    // 指定スロットに新しい猫ピースを生成・配置
    replenish: function(slotIndex) {
        if (slotIndex < 0 || slotIndex >= 3) return;

        // 既存ピースがあれば破棄
        if (this.slots[slotIndex]) {
            this.slots[slotIndex].remove();
            this.slots[slotIndex] = null;
        }

        var piece = Piece.createRandom().addChildTo(this);
        piece.slotIndex = slotIndex;
        piece.homePos = this.slotPositions[slotIndex];

        // スロット枠内に収まるようスケール調整 (0.65倍)
        piece.setScale(0.65);
        piece.setPosition(piece.homePos.x, piece.homePos.y);

        // ふわっと出現するアニメーション
        piece.alpha = 0;
        piece.scaleX = 0.2;
        piece.scaleY = 0.2;
        piece.tweener
            .clear()
            .to({ alpha: 1, scaleX: 0.65, scaleY: 0.65 }, 250, 'easeOutBack')
            .play();

        this.slots[slotIndex] = piece;
        return piece;
    },

    // スロットのピースを取得
    getPiece: function(slotIndex) {
        return this.slots[slotIndex];
    },

    // スロットからピースを取り出す（配置時用）
    takePiece: function(slotIndex) {
        var piece = this.slots[slotIndex];
        this.slots[slotIndex] = null;
        return piece;
    }
});
