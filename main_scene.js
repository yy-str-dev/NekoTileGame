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

        // お題管理
        this.missionManager = MissionManager().addChildTo(this);

        // ゲーム状態管理
        this.draggingPiece = null;
        this.currentDropCells = null;
        this.isClearing = false;
        this.isGameOver = false;

        // 1. ヘッダーUI（タイトル・スコア）を描画
        this.createHeader();

        // 2. 8x8 盤面（Board）を配置（左寄せにして右側にお題パネルを配置）
        this.board = Board().addChildTo(this)
            .setPosition(170, 215);

        // 2.5 右側のお題パネルを描画
        this.createMissionPanel();

        // 3. 下部3スロット台座を描画
        this.createSlots();

        // 4. 猫ピースの手札管理 (PieceStock) を生成し、3枠に猫を補充
        this.pieceStock = PieceStock().addChildTo(this);
        MySoundManager.playSE("SE-neko_spawn");

        // 5. ドラッグ中の最前面レイヤー
        this.dragLayer = DisplayElement().addChildTo(this);

        // 6. ポップアップテキスト等UIエフェクトレイヤー
        this.uiEffectLayer = DisplayElement().addChildTo(this);

        // 7. ゲームオーバーモーダル用最前面レイヤー
        this.modalLayer = DisplayElement().addChildTo(this);

        // 初期スコア表示・お題表示を同期
        this.updateScoreDisplay();
        this.updateMissionDisplay();

        // シーン全体のポインタイベント設定（ドラッグ＆ドロップ）
        this.setupDragEvents();

        // 初期の詰みチェック＆配置可能状態を反映
        var self = this;
        this.board.one('enterframe', function () {
            self.checkGameOver();
        });

        MySoundManager.playBGM("BGM-game");
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
            .setPosition(280, 20);

        this.scoreLabel = Label({
            text: '0',
            fontSize: 22,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SCORE,
        }).addChildTo(headerGroup)
            .setPosition(280, 38);

        // ハイスコア表示
        this.bestTitle = Label({
            text: 'BEST',
            fontSize: 11,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(headerGroup)
            .setPosition(370, 20);

        this.bestLabel = Label({
            text: '0',
            fontSize: 22,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(headerGroup)
            .setPosition(370, 38);
    },

    // デバッグ用: 最下行を1列埋めて即座に成仏をテスト
    debugFillAndClearRow: function () {
        console.log("【デバッグ】最下行を埋めて成仏テストを実行します");
        var y = 7;
        for (var x = 0; x < 8; x++) {
            if (this.board.gridData[y][x] === null) {
                var dummyPiece = Piece(PIECE_DEFINITIONS[0], [{ x: 0, y: 0 }]);
                this.board.placePiece(dummyPiece, [{ x: x, y: y }]);
            }
        }
        var self = this;
        this.board.checkAndClearLines(function (res) {
            if (res) {
                var points = self.scoreManager.addClearScore(res.lineCount, res.totalBlocks, res.catCount);
                self.updateScoreDisplay(true);
                self.showFloatingText('✨成仏!! +' + points, self.board.x, self.board.y - 100, '#ff4757');
            }
            self.checkGameOver();
        });
    },

    // デバッグ用: 盤面をほぼ埋め尽くして即座に「詰み（ゲームオーバー）」をテスト
    debugTriggerDeadlock: function () {
        console.log("【デバッグ】盤面を埋めて詰み（ゲームオーバー）をテストします");
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                // 1マスだけ空けて、それ以外をすべて埋める（ほとんどのピースが置けなくなる）
                if (!(x === 0 && y === 0) && this.board.gridData[y][x] === null) {
                    var dummy = Piece(PIECE_DEFINITIONS[0], [{ x: 0, y: 0 }]);
                    this.board.placePiece(dummy, [{ x: x, y: y }]);
                }
            }
        }
        this.checkGameOver();
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

            // ★ スロット台座をクリック/タップしたとき、そのスロットのピースをドラッグ開始
            base.setInteractive(true);
            base.boundingType = 'rect';
            (function (slotIdx) {
                base.on('pointstart', function (e) {
                    var scene = base.getRoot();
                    if (!scene || !scene.pieceStock) return;
                    var piece = scene.pieceStock.getPiece(slotIdx);
                    if (piece && scene.startDragPiece) {
                        scene.startDragPiece(piece, e);
                    }
                });
            })(i);

            this.slotBases.push(base);
        }
    },

    // 盤面右側のお題パネルを作成
    createMissionPanel: function () {
        var panelX = 415;
        var panelY = 215;
        var panelW = 148;
        var panelH = 321;

        this.missionPanel = RectangleShape({
            width: panelW,
            height: panelH,
            fill: '#fff9eb',
            stroke: GameConfig.COLORS.BOARD_STROKE,
            strokeWidth: 3,
            cornerRadius: 14,
            shadow: 'rgba(0,0,0,0.08)',
            shadowBlur: 6,
        }).addChildTo(this)
            .setPosition(panelX, panelY);

        // お題ヘッダーバッジ
        RectangleShape({
            width: panelW - 20,
            height: 32,
            fill: '#ffd166',
            stroke: '#e67700',
            strokeWidth: 2,
            cornerRadius: 8,
        }).addChildTo(this.missionPanel)
            .setPosition(0, -128);

        Label({
            text: '🎯 お題',
            fontSize: 16,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(this.missionPanel)
            .setPosition(0, -128);

        // 達成数表示
        this.missionClearedLabel = Label({
            text: '達成数: 0',
            fontSize: 12,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(this.missionPanel)
            .setPosition(0, -94);

        // 区切り線
        RectangleShape({
            width: panelW - 24,
            height: 2,
            fill: '#ead4af',
            stroke: null,
        }).addChildTo(this.missionPanel)
            .setPosition(0, -76);

        // お題内容
        this.missionTitleLabel = Label({
            text: '',
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1.4,
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(this.missionPanel)
            .setPosition(0, -24);

        // 猫お題アイコン用コンテナ
        this.missionIconContainer = DisplayElement().addChildTo(this.missionPanel)
            .setPosition(0, -2);

        // 進捗表示
        this.missionProgressLabel = Label({
            text: '残り: 1',
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#2b8a3e',
        }).addChildTo(this.missionPanel)
            .setPosition(0, 34);

        // 残りターン枠
        RectangleShape({
            width: panelW - 24,
            height: 44,
            fill: '#faeed4',
            stroke: '#d8b982',
            strokeWidth: 2,
            cornerRadius: 10,
        }).addChildTo(this.missionPanel)
            .setPosition(0, 82);

        this.missionTurnLabel = Label({
            text: '⏳ 残り 5 ターン',
            fontSize: 14,
            fontWeight: 'bold',
            fill: GameConfig.COLORS.TEXT_MAIN,
        }).addChildTo(this.missionPanel)
            .setPosition(0, 82);

        // 失敗ペナルティ注記
        Label({
            text: '失敗でお邪魔ブロック出現',
            fontSize: 10,
            fill: GameConfig.COLORS.TEXT_SUB,
        }).addChildTo(this.missionPanel)
            .setPosition(0, 128);
    },

    // お題パネルの表示内容を最新化
    updateMissionDisplay: function () {
        var m = this.missionManager.currentMission;
        if (!m) return;

        this.missionClearedLabel.text = '達成数: ' + this.missionManager.clearedCount;
        this.missionTitleLabel.text = m.title;

        // アイコンコンテナをクリア
        if (this.missionIconContainer) {
            this.missionIconContainer.children.slice().forEach(function (child) {
                if (child.destroyPiece) child.destroyPiece();
                else child.remove();
            });
        }

        var hasIcon = false;
        if (m.pieceIds && m.pieceIds.length > 0) {
            var targetId = m.pieceIds[0];
            var shapeDef = null;
            for (var i = 0; i < PIECE_DEFINITIONS.length; i++) {
                if (PIECE_DEFINITIONS[i].id === targetId) {
                    shapeDef = PIECE_DEFINITIONS[i];
                    break;
                }
            }
            if (shapeDef) {
                var preview = Piece(shapeDef, shapeDef.coords).addChildTo(this.missionIconContainer);
                preview.setInteractive(false);
                var scale = Math.min(84 / preview.width, 44 / preview.height, 0.75);
                preview.setScale(scale);
                hasIcon = true;
            }
        } else if (m.type === 'cats') {
            Label({
                text: '🐱',
                fontSize: 28,
            }).addChildTo(this.missionIconContainer);
            hasIcon = true;
        }

        // アイコン有無に応じてタイトル・進捗の位置を調整
        if (hasIcon) {
            this.missionTitleLabel.fontSize = 14;
            this.missionTitleLabel.setPosition(0, -50);
            this.missionProgressLabel.setPosition(0, 38);
        } else {
            this.missionTitleLabel.fontSize = 16;
            this.missionTitleLabel.setPosition(0, -24);
            this.missionProgressLabel.setPosition(0, 34);
        }

        var remainingTarget = Math.max(0, m.target - this.missionManager.progress);
        this.missionProgressLabel.text = 'あと ' + remainingTarget + ' ' + m.unit;

        var turns = this.missionManager.remainingTurns;
        this.missionTurnLabel.text = '⏳ 残り ' + turns + ' ターン';
        this.missionTurnLabel.fill = (turns <= 1) ? '#e03131' : GameConfig.COLORS.TEXT_MAIN;
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

    // ★ フェーズ5: 手持ちピースの配置可能性チェック ＆ 詰み（ゲームオーバー）判定
    checkGameOver: function () {
        if (this.isGameOver) return;

        var slots = this.pieceStock.slots;
        var hasPlayable = false;

        for (var i = 0; i < slots.length; i++) {
            var piece = slots[i];
            if (piece) {
                var canPlace = this.board.canPlaceAnywhere(piece);
                piece.setPlayableState(canPlace);
                if (canPlace) {
                    hasPlayable = true;
                }
            }
        }

        // 手持ちの全ピースがどこにも置けない場合 -> 詰み（ゲームオーバー）！
        if (!hasPlayable) {
            console.log("【詰み判定発動】置ける猫がいません。GAME OVER！");
            this.triggerGameOver();
        }
    },

    // ゲームオーバー演出とリザルト画面の表示
    triggerGameOver: function () {
        this.isGameOver = true;
        var self = this;

        // すこし余韻を持たせてからモーダルをポップアップ表示
        setTimeout(function () {
            self.showGameOverModal();

            MySoundManager.playSE("SE-gameover");
            MySoundManager.stopBGM();
        }, 500);
    },

    // ゲームオーバーモーダル（ダイアログ）の描画
    showGameOverModal: function () {
        var modal = DisplayElement().addChildTo(this.modalLayer);

        // 画面全体の暗転オーバーレイ
        var overlay = RectangleShape({
            width: GameConfig.SCREEN_WIDTH,
            height: GameConfig.SCREEN_HEIGHT,
            fill: 'rgba(0, 0, 0, 0.6)',
        }).addChildTo(modal)
            .setPosition(GameConfig.SCREEN_WIDTH / 2, GameConfig.SCREEN_HEIGHT / 2);

        overlay.setInteractive(true); // 下の盤面へのクリックをブロック

        // ダイアログベース枠
        var dialog = RectangleShape({
            width: 350,
            height: 300,
            fill: '#ffffff',
            stroke: '#d8b982',
            strokeWidth: 4,
            cornerRadius: 18,
            shadow: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 16,
        }).addChildTo(modal)
            .setPosition(GameConfig.SCREEN_WIDTH / 2, GameConfig.SCREEN_HEIGHT / 2);

        // ポップアップ登場アニメーション
        dialog.scaleX = 0.5;
        dialog.scaleY = 0.5;
        dialog.alpha = 0;
        dialog.tweener
            .clear()
            .to({ scaleX: 1.0, scaleY: 1.0, alpha: 1.0 }, 280, 'easeOutBack')
            .play();

        // タイトル
        Label({
            text: '🐾 GAME OVER 🐾',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#5c4838',
        }).addChildTo(dialog)
            .setPosition(0, -95);

        // 新記録判定
        var isNewBest = (this.scoreManager.currentScore >= this.scoreManager.highScore && this.scoreManager.currentScore > 0);
        if (isNewBest) {
            Label({
                text: '🎉 NEW BEST RECORD! 🎉',
                fontSize: 13,
                fontWeight: 'bold',
                fill: '#e67332',
            }).addChildTo(dialog)
                .setPosition(0, -60);
        }

        // 今回のスコアラベル
        Label({
            text: 'SCORE',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#8e796c',
        }).addChildTo(dialog)
            .setPosition(0, -25);

        Label({
            text: this.scoreManager.currentScore.toString(),
            fontSize: 32,
            fontWeight: 'bold',
            fill: '#e67332',
        }).addChildTo(dialog)
            .setPosition(0, 5);

        // ハイスコアラベル
        Label({
            text: 'BEST SCORE: ' + this.scoreManager.highScore,
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#5c4838',
        }).addChildTo(dialog)
            .setPosition(0, 45);

        // 「もう一度あそぶ」リトライボタン
        var retryBtn = RectangleShape({
            width: 190,
            height: 44,
            fill: '#e67332',
            stroke: '#c85a1c',
            strokeWidth: 2,
            cornerRadius: 22,
            shadow: 'rgba(230, 115, 50, 0.4)',
            shadowBlur: 8,
        }).addChildTo(dialog)
            .setPosition(0, 95);

        Label({
            text: 'もう一度あそぶ 🐾',
            fontSize: 16,
            fontWeight: 'bold',
            fill: '#ffffff',
        }).addChildTo(retryBtn);

        retryBtn.setInteractive(true);
        var self = this;
        retryBtn.on('pointstart', function () {
            modal.remove();
            self.restartGame();
            MySoundManager.playSE("SE-ok_button");
            MySoundManager.playBGMFromHead("BGM-game");
        });
    },

    // ゲームのリスタート（リトライ）
    restartGame: function () {
        console.log("【リスタート】ゲームを初期状態に戻します");
        // 1. 盤面をクリア
        this.board.resetAll();

        // 2. スコアを0にリセット
        this.scoreManager.resetScore();
        this.updateScoreDisplay(false);

        // 3. スロットの3体を新規補充
        this.pieceStock.replenishAll();
        MySoundManager.playSE("SE-neko_spawn");

        // 3.5 お題状態をリセット
        this.missionManager.reset();
        this.updateMissionDisplay();

        // 4. ゲームオーバーフラグ解除
        this.isGameOver = false;

        // 5. 詰みチェック＆スロットの透明度を更新
        var self = this;
        setTimeout(function () {
            self.checkGameOver();
        }, 100);
    },

    // ドラッグ＆ドロップイベントの制御
    setupDragEvents: function () {
        var self = this;

        // ドラッグ中の移動追従
        this.on('pointmove', function (e) {
            if (!self.draggingPiece || self.isGameOver) return;

            var piece = self.draggingPiece;
            // 指やカーソルでブロックが隠れないように、少し上にオフセット
            var offset = GameConfig.IS_MOBILE ? 100 : 50;
            piece.setPosition(e.pointer.x, e.pointer.y - offset);

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
            if (!self.draggingPiece || self.isGameOver) return;

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

                // 2. スロットから該当ピースを除去する！
                self.pieceStock.takePiece(slotIndex);

                if (self.pieceStock.isEmpty()) {
                    self.pieceStock.replenishAll(slotIndex);
                    MySoundManager.playSE("SE-neko_spawn");
                }

                self.draggingPiece = null;
                self.currentDropCells = null;

                // 2.5 既存のお邪魔猫の残りターンを進める
                self.board.tickObstacleCats();

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
                        var msg = '✨クリア!! +' + clearPoints;
                        if (clearResult.lineCount >= 2) {
                            msg += ' (' + clearResult.lineCount + '列同時!)';
                        }
                        self.showFloatingText(msg, self.board.x, self.board.y - 110, '#ff4757');

                        if (clearResult.lineCount >= 2) {
                            MySoundManager.playSE("SE-line_clear_multiple");
                        }
                        else {
                            MySoundManager.playSE("SE-line_clear");
                        }
                    }

                    // 3.5 ★ お題の進行・達成・失敗判定
                    var missionResult = self.missionManager.onTurnEnd(clearResult);
                    if (missionResult.status === 'cleared') {
                        self.showFloatingText('🎯 お題達成!!', 415, 130, '#2b8a3e');
                        MySoundManager.playSE("SE-mission_clear");
                    } else if (missionResult.status === 'failed') {
                        var spawned = self.board.spawnObstacleCats(missionResult.obstacleCount);
                        if (spawned > 0) {
                            self.showFloatingText('🚫お邪魔ブロック ×' + spawned, self.board.x, self.board.y - 70, '#e03131');
                            for (var i = 0; i < spawned; i++) {
                                setTimeout(() => {
                                    MySoundManager.playSE("SE-block_put");
                                }, i * 100);
                            }
                        }
                        MySoundManager.playSE("SE-mission_fail");
                    }
                    self.updateMissionDisplay();

                    // 4. ★ 配置・消去後に詰み判定（ゲームオーバーチェック）
                    self.checkGameOver();
                });

                MySoundManager.playSE("SE-neko_put_success");
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

                MySoundManager.playSE("SE-neko_put_fail");
            }
        });
    },

    // ピースのドラッグ開始処理 (Piece の pointstart から呼び出される)
    startDragPiece: function (piece, event) {
        if (this.draggingPiece || this.isClearing || this.isGameOver) return;

        this.draggingPiece = piece;
        this.currentDropCells = null;

        // 最前面レイヤーに移動
        piece.addChildTo(this.dragLayer);

        // 指の少し上に移動しつつ、等倍 (1.0) に拡大
        var offset = GameConfig.IS_MOBILE ? 100 : 50;
        var startY = event.pointer.y - offset;
        piece.setPosition(event.pointer.x, startY);

        piece.tweener
            .clear()
            .to({ scaleX: 1.0, scaleY: 1.0 }, 100, 'easeOutQuad')
            .play();

        MySoundManager.playSE("SE-neko_pick");
    },

    update: function () {
    }
});
