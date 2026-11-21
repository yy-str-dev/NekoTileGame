// ピースの形状定義（回転・縦横パターンをすべて独立した固有定義に分割）
const PIECE_DEFINITIONS = [
    // ==========================================
    // 1ブロック (1種類)
    // ==========================================
    {
        id: '1_single',
        type: '1_SINGLE',
        pose: '丸まり猫',
        imageKey: 'neko_1', // 画像アセットのキー名
        color: '#ff9233',
        stroke: '#d96b00',
        coords: [{ x: 0, y: 0 }]
    },

    // ==========================================
    // 2ブロック (2種類: 横・縦)
    // ==========================================
    {
        id: '2_i_h',
        type: '2_I',
        pose: '横向き猫 (横)',
        imageKey: 'neko_2_i_h',
        color: '#ff5964',
        stroke: '#d9303e',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    },
    {
        id: '2_i_v',
        type: '2_I',
        pose: '横向き猫 (縦)',
        imageKey: 'neko_2_i_v',
        color: '#ff5964',
        stroke: '#d9303e',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }]
    },

    // ==========================================
    // 3ブロック I字 (2種類: 横・縦)
    // ==========================================
    {
        id: '3_i_h',
        type: '3_I',
        pose: '伸び猫 (横)',
        imageKey: 'neko_3_i_h',
        color: '#51cf66',
        stroke: '#2b8a3e',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    },
    {
        id: '3_i_v',
        type: '3_I',
        pose: '伸び猫 (縦)',
        imageKey: 'neko_3_i_v',
        color: '#51cf66',
        stroke: '#2b8a3e',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
    },

    // ==========================================
    // 3ブロック L字 (4種類: 4方向回転)
    // ==========================================
    {
        id: '3_l_0',
        type: '3_L',
        pose: 'くの字猫 (右下)',
        imageKey: 'neko_3_l_0',
        color: '#339af0',
        stroke: '#1c7ed6',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    },
    {
        id: '3_l_1',
        type: '3_L',
        pose: 'くの字猫 (左下)',
        imageKey: 'neko_3_l_1',
        color: '#339af0',
        stroke: '#1c7ed6',
        coords: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
    },
    {
        id: '3_l_2',
        type: '3_L',
        pose: 'くの字猫 (左上)',
        imageKey: 'neko_3_l_2',
        color: '#339af0',
        stroke: '#1c7ed6',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
    },
    {
        id: '3_l_3',
        type: '3_L',
        pose: 'くの字猫 (右上)',
        imageKey: 'neko_3_l_3',
        color: '#339af0',
        stroke: '#1c7ed6',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
    },

    // ==========================================
    // 4ブロック I字 (2種類: 横・縦)
    // ==========================================
    {
        id: '4_i_h',
        type: '4_I',
        pose: '長〜い猫 (横)',
        imageKey: 'neko_4_i_h',
        color: '#cc5de8',
        stroke: '#ae3ec9',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }]
    },
    {
        id: '4_i_v',
        type: '4_I',
        pose: '長〜い猫 (縦)',
        imageKey: 'neko_4_i_v',
        color: '#cc5de8',
        stroke: '#ae3ec9',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }]
    },

    // ==========================================
    // 4ブロック L字 (8種類: 縦長4種・横長4種)
    // ==========================================
    // --- 縦長 3x2 ---
    {
        id: '4_l_v0',
        type: '4_L',
        pose: '直角猫 (縦0)',
        imageKey: 'neko_4_l_v0',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]
    },
    {
        id: '4_l_v1',
        type: '4_L',
        pose: '直角猫 (縦1)',
        imageKey: 'neko_4_l_v1',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 2 }]
    },
    {
        id: '4_l_v2',
        type: '4_L',
        pose: '直角猫 (縦2)',
        imageKey: 'neko_4_l_v2',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
    },
    {
        id: '4_l_v3',
        type: '4_L',
        pose: '直角猫 (縦3)',
        imageKey: 'neko_4_l_v3',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
    },
    // --- 横長 2x3 ---
    {
        id: '4_l_h0',
        type: '4_L',
        pose: '直角猫 (横0)',
        imageKey: 'neko_4_l_h0',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    },
    {
        id: '4_l_h1',
        type: '4_L',
        pose: '直角猫 (横1)',
        imageKey: 'neko_4_l_h1',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }]
    },
    {
        id: '4_l_h2',
        type: '4_L',
        pose: '直角猫 (横2)',
        imageKey: 'neko_4_l_h2',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }]
    },
    {
        id: '4_l_h3',
        type: '4_L',
        pose: '直角猫 (横3)',
        imageKey: 'neko_4_l_h3',
        color: '#20c997',
        stroke: '#0ca678',
        coords: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    },

    // ==========================================
    // 4ブロック Z字/S字 (4種類: 横Z・縦Z・横S・縦S)
    // ==========================================
    {
        id: '4_z_h',
        type: '4_Z',
        pose: 'くねくね猫 (横Z)',
        imageKey: 'neko_4_z_h',
        color: '#fcc419',
        stroke: '#e67700',
        coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    },
    {
        id: '4_z_v',
        type: '4_Z',
        pose: 'くねくね猫 (縦Z)',
        imageKey: 'neko_4_z_v',
        color: '#fcc419',
        stroke: '#e67700',
        coords: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }]
    },
    {
        id: '4_s_h',
        type: '4_Z',
        pose: 'くねくね猫 (横S)',
        imageKey: 'neko_4_s_h',
        color: '#fcc419',
        stroke: '#e67700',
        coords: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    },
    {
        id: '4_s_v',
        type: '4_Z',
        pose: 'くねくね猫 (縦S)',
        imageKey: 'neko_4_s_v',
        color: '#fcc419',
        stroke: '#e67700',
        coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
    }
];

// 猫ピースクラス
var pieceUniqueIdCounter = 1;

phina.define('Piece', {
    superClass: 'DisplayElement',

    init: function (shapeDef, specificCoords) {
        this.superInit();

        this.uid = pieceUniqueIdCounter++;
        this.shapeDef = shapeDef;
        this.pieceId = shapeDef.id;
        this.coords = specificCoords || shapeDef.coords;
        this.color = shapeDef.color;
        this.stroke = shapeDef.stroke;
        this.pose = shapeDef.pose;
        this.imageKey = shapeDef.imageKey;

        this.cellSize = GameConfig.CELL_SIZE;
        this.cellGap = GameConfig.CELL_GAP;

        // 占有しているセル数
        this.blockCount = this.coords.length;

        // 盤面に置かれた際のセルリスト [{x, y}, ...]
        this.placedCells = [];

        // ピース全体のバウンディングボックスを計算
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        this.coords.forEach(function (c) {
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

        // ピース全体のピクセル幅・高さ
        var totalW = this.gridWidth * this.cellSize + (this.gridWidth - 1) * this.cellGap;
        var totalH = this.gridHeight * this.cellSize + (this.gridHeight - 1) * this.cellGap;

        // 画像アセットがロードされているか確認
        var assetManager = phina.asset.AssetManager;
        var hasImage = this.imageKey && assetManager && assetManager.get('image', this.imageKey);

        if (hasImage) {
            // ★ 画像スプライトを生成して描画
            this.sprite = Sprite(this.imageKey).addChildTo(this);
            this.sprite.width = totalW;
            this.sprite.height = totalH;
            this.sprite.setPosition(0, 0);
        } else {
            // ★ 画像がまだ用意されていない場合はフォールバック（色付きブロックを描画）
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
                    TriangleShape({
                        radius: 7,
                        fill: this.stroke,
                        stroke: this.stroke,
                        strokeWidth: 1,
                    }).addChildTo(block)
                        .setPosition(-9, -14)
                        .setRotation(-15);

                    TriangleShape({
                        radius: 7,
                        fill: this.stroke,
                        stroke: this.stroke,
                        strokeWidth: 1,
                    }).addChildTo(block)
                        .setPosition(9, -14)
                        .setRotation(15);

                    Label({
                        text: '🐱',
                        fontSize: 16,
                    }).addChildTo(block)
                        .setPosition(0, 0);
                } else {
                    Label({
                        text: '🐾',
                        fontSize: 12,
                        fill: 'rgba(255,255,255,0.7)',
                    }).addChildTo(block)
                        .setPosition(0, 0);
                }

                this.blockSprites.push(block);
            }
        }

        // ドラッグ操作を有効化
        this.setInteractive(true);
        this.boundingType = 'rect';
        this.width = totalW;
        this.height = totalH;

        var self = this;
        this.on('pointstart', function (e) {
            var scene = self.getRoot();
            if (scene && scene.startDragPiece) {
                scene.startDragPiece(self, e);
            }
        });
    },

    // 子要素を完全に破棄して自身を削除
    destroyPiece: function () {
        if (this.children) {
            this.children.forEach(function (child) {
                if (child.children) child.children.clear();
            });
            this.children.clear();
        }
        this.remove();
    },

    // 配置可能状態（置けないときは半透明にして視覚的にフィードバック）
    setPlayableState: function (playable) {
        this.isPlayable = playable;
        this.alpha = playable ? 1.0 : 0.35;
    },

    // ランダムな猫ピースを生成するファクトリメソッド
    _static: {
        createRandom: function () {
            var shapeDef = PIECE_DEFINITIONS.random();
            return Piece(shapeDef, shapeDef.coords);
        }
    }
});

// 手札スロット管理クラス (3枠)
phina.define('PieceStock', {
    superClass: 'DisplayElement',

    init: function () {
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
    replenish: function (slotIndex) {
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

        // ふわっと出現するアニメーション（スケールのみ。alphaはcheckGameOverが決定するため触らない）
        piece.alpha = 1;
        piece.scaleX = 0.2;
        piece.scaleY = 0.2;
        piece.tweener
            .clear()
            .to({ scaleX: 0.65, scaleY: 0.65 }, 250, 'easeOutBack')
            .play();

        this.slots[slotIndex] = piece;
        return piece;
    },

    // スロットのピースを取得
    getPiece: function (slotIndex) {
        return this.slots[slotIndex];
    },

    // スロットからピースを取り出す（配置時用）
    takePiece: function (slotIndex) {
        var piece = this.slots[slotIndex];
        this.slots[slotIndex] = null;
        return piece;
    },

    // 全スロットをクリアして新規3体補充
    replenishAll: function () {
        for (var i = 0; i < 3; i++) {
            this.replenish(i);
        }
    }
});
