// お題定義リスト
const MISSION_DEFINITIONS = [
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_line_tutorial",
        "target": 5,
        "turns": 999,
        "level": 0,
        "title": "5ライン\n消去する"
    },
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_1_line",
        "target": 1,
        "turns": 5,
        "level": 1,
        "title": "1ライン\n消去する"
    },
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_2_lines",
        "target": 2,
        "turns": 8,
        "level": 2,
        "title": "2ライン\n消去する"
    },
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_1_lines_lv3",
        "target": 1,
        "turns": 3,
        "level": 3,
        "title": "1ライン\n消去する"
    },
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_2_lines_lv4",
        "target": 2,
        "turns": 5,
        "level": 4,
        "title": "2ライン\n消去する"
    },
    {
        "type": "lines",
        "unit": "ライン",
        "id": "clear_3_lines",
        "target": 3,
        "turns": 9,
        "level": 5,
        "title": "3ライン\n消去する"
    },
    {
        "type": "blocks",
        "unit": "ブロック",
        "id": "clear_10_blocks",
        "target": 10,
        "turns": 6,
        "level": 1,
        "title": "10ブロック\n消去する"
    },
    {
        "type": "blocks",
        "unit": "ブロック",
        "id": "clear_14_blocks",
        "target": 14,
        "turns": 6,
        "level": 2,
        "title": "14ブロック\n消去する"
    },
    {
        "type": "blocks",
        "unit": "ブロック",
        "id": "clear_10_blocks_lv3",
        "target": 10,
        "turns": 4,
        "level": 3,
        "title": "10ブロック\n消去する"
    },
    {
        "type": "blocks",
        "unit": "ブロック",
        "id": "clear_15_blocks",
        "target": 15,
        "turns": 4,
        "level": 4,
        "title": "15ブロック\n消去する"
    },
    {
        "type": "blocks",
        "unit": "ブロック",
        "id": "clear_20_blocks",
        "target": 20,
        "turns": 6,
        "level": 5,
        "title": "20ブロック\n消去する"
    },
    {
        "type": "multi_line",
        "unit": "ライン同時",
        "id": "clear_2_lines_once",
        "target": 2,
        "turns": 6,
        "level": 3,
        "title": "2ライン\n同時消去する"
    },
    {
        "type": "multi_line",
        "unit": "ライン同時",
        "id": "clear_3_lines_once_lv4",
        "target": 3,
        "turns": 12,
        "level": 4,
        "title": "3ライン\n同時消去する"
    },
    {
        "type": "multi_line",
        "unit": "ライン同時",
        "id": "clear_3_lines_once_lv5",
        "target": 3,
        "turns": 9,
        "level": 5,
        "title": "3ライン\n同時消去する"
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_2_i_cat_lv1",
        "target": 1,
        "turns": 6,
        "level": 1,
        "title": "お座り猫を\n1匹消去する",
        "pieceIds": ["2_i_v", "2_i_h"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_2_i_cat_lv2",
        "target": 2,
        "turns": 6,
        "level": 2,
        "title": "お座り猫を\n2匹消去する",
        "pieceIds": ["2_i_v", "2_i_h"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_3_l_cat_lv2",
        "target": 1,
        "turns": 6,
        "level": 2,
        "title": "くの字猫を\n1匹消去する",
        "pieceIds": ["3_l_3", "3_l_1", "3_l_2", "3_l_0"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_3_l_cat_lv3",
        "target": 2,
        "turns": 6,
        "level": 3,
        "title": "くの字猫を\n2匹消去する",
        "pieceIds": ["3_l_3", "3_l_1", "3_l_2", "3_l_0"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_3_i_cat_lv3",
        "target": 1,
        "turns": 6,
        "level": 3,
        "title": "伸び猫を\n1匹消去する",
        "pieceIds": ["3_i_h", "3_i_v"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_l_cat_lv4",
        "target": 1,
        "turns": 6,
        "level": 4,
        "title": "尻上がり猫を\n1匹消去する",
        "pieceIds": ["4_l_h0", "4_l_v1", "4_l_v2", "4_l_h2"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_j_cat_lv4",
        "turns": 6,
        "target": 1,
        "level": 4,
        "title": "シャム猫を\n1匹消去する",
        "pieceIds": ["4_l_h3", "4_l_v0", "4_l_v3", "4_l_h1"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_s_cat_lv4",
        "target": 1,
        "turns": 6,
        "level": 4,
        "title": "垂れ猫を\n1匹消去する",
        "pieceIds": ["4_s_h", "4_s_v"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_z_cat_lv4",
        "target": 1,
        "turns": 6,
        "level": 4,
        "title": "くねく猫を\n1匹消去する",
        "pieceIds": ["4_z_h", "4_z_v"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_totsu_cat_lv4",
        "target": 1,
        "turns": 6,
        "level": 4,
        "title": "おっさん猫を\n1匹消去する",
        "pieceIds": ["4_totsu_1", "4_totsu_2", "4_totsu_3", "4_totsu_4"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_i_cat_lv4",
        "target": 1,
        "turns": 6,
        "level": 4,
        "title": "長～い猫を\n1匹消去する",
        "pieceIds": ["4_i_v", "4_i_h"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_l_cat_lv5",
        "target": 2,
        "turns": 6,
        "level": 5,
        "title": "尻上がり猫を\n2匹消去する",
        "pieceIds": ["4_l_h0", "4_l_v1", "4_l_v2", "4_l_h2"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_j_cat_lv5",
        "turns": 6,
        "target": 2,
        "level": 5,
        "title": "シャム猫を\n1匹消去する",
        "pieceIds": ["4_l_h3", "4_l_v0", "4_l_v3", "4_l_h1"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_s_cat_lv5",
        "target": 2,
        "turns": 6,
        "level": 5,
        "title": "垂れ猫を\n2匹消去する",
        "pieceIds": ["4_s_h", "4_s_v"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_z_cat_lv5",
        "target": 2,
        "turns": 6,
        "level": 5,
        "title": "くねく猫を\n2匹消去する",
        "pieceIds": ["4_z_h", "4_z_v"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_totsu_cat_lv5",
        "target": 2,
        "turns": 6,
        "level": 5,
        "title": "おっさん猫を\n2匹消去する",
        "pieceIds": ["4_totsu_1", "4_totsu_2", "4_totsu_3", "4_totsu_4"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_4_i_cat_lv5",
        "target": 2,
        "turns": 6,
        "level": 5,
        "title": "長～い猫を\n2匹消去する",
        "pieceIds": ["4_i_v", "4_i_h"]
    },
    {
        "type": "piece_id",
        "unit": "匹",
        "id": "clear_single_cat",
        "target": 1,
        "turns": 6,
        "level": 5,
        "title": "丸まり猫を\n1匹消去する",
        "pieceIds": ["1_single"]
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_3_cats_lv1",
        "target": 3,
        "turns": 6,
        "level": 1,
        "title": "猫を3匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_3_cats_lv2",
        "target": 3,
        "turns": 4,
        "level": 2,
        "title": "猫を3匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_5_cats_lv2",
        "target": 5,
        "turns": 6,
        "level": 2,
        "title": "猫を5匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_5_cats_lv3",
        "target": 5,
        "turns": 4,
        "level": 3,
        "title": "猫を5匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_8_cats_lv3",
        "target": 8,
        "turns": 8,
        "level": 3,
        "title": "猫を8匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_8_cats_lv4",
        "target": 8,
        "turns": 6,
        "level": 4,
        "title": "猫を8匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_10_cats_lv4",
        "target": 10,
        "turns": 8,
        "level": 4,
        "title": "猫を10匹\n消去する"
    },
    {
        "type": "cats",
        "unit": "匹",
        "id": "clear_10_cats_lv5",
        "target": 10,
        "turns": 6,
        "level": 5,
        "title": "猫を10匹\n消去する"
    }
];

// お題管理クラス
phina.define('MissionManager', {
    superClass: 'DisplayElement',

    init: function () {
        this.superInit();

        this.clearedCount = 0;
        this.currentMission = null;
        this.progress = 0;
        this.remainingTurns = 0;

        this.nextMission();
    },

    // 状態を初期化して最初のお題をセット
    reset: function () {
        this.clearedCount = 0;
        this.currentMission = null;
        this.nextMission();
    },

    // 次のお題をランダムに選出（直前と同じお題は極力避ける）
    nextMission: function () {
        var prevId = this.currentMission ? this.currentMission.id : null;
        var level = this.getLevel();
        var candidates = MISSION_DEFINITIONS.filter(function (m) {
            return m.id !== prevId && m.level == level;
        });
        if (candidates.length === 0) {
            candidates = MISSION_DEFINITIONS;
        }

        var selected = candidates[Math.floor(Math.random() * candidates.length)];
        this.currentMission = selected;
        this.progress = 0;
        this.remainingTurns = selected.turns;
    },

    // 1ターン終了時（ピース配置＆ライン消去後）の進行・達成・失敗判定
    onTurnEnd: function (clearResult) {
        var m = this.currentMission;
        if (!m) return { status: 'ongoing' };

        // 消去結果があれば進捗を加算
        if (clearResult) {
            if (m.type === 'lines') {
                this.progress += clearResult.lineCount;
            } else if (m.type === 'blocks') {
                this.progress += clearResult.totalBlocks;
            } else if (m.type === 'multi_line') {
                if (clearResult.lineCount >= m.target) {
                    this.progress = m.target;
                }
            } else if (m.type === 'cats') {
                this.progress += clearResult.catCount;
            } else if (m.type === 'piece_id' && clearResult.clearedPieces) {
                var matched = 0;
                for (var i = 0; i < clearResult.clearedPieces.length; i++) {
                    if (m.pieceIds.includes(clearResult.clearedPieces[i].pieceId)) {
                        matched++;
                    }
                }
                this.progress += matched;
            }
        }

        // 達成チェック
        if (this.progress >= m.target) {
            this.clearedCount++;
            this.nextMission();
            return {
                status: 'cleared',
                clearedCount: this.clearedCount
            };
        }

        // 未達成なら残りターンを消費
        this.remainingTurns--;
        if (this.remainingTurns <= 0) {
            // 失敗：これまでクリアしたお題数に応じてお邪魔猫の数を決定
            var obstacleCount = 1;

            if (this.clearedCount < 10) {
                obstacleCount = 1;
            }
            else if (this.clearedCount < 20) {
                obstacleCount = 2;
            }
            else if (this.clearedCount < 30) {
                obstacleCount = 3;
            }
            else if (this.clearedCount < 40) {
                obstacleCount = 4;
            }
            else {
                obstacleCount = 5;
            }

            this.nextMission();
            return {
                status: 'failed',
                obstacleCount: obstacleCount
            };
        }

        return { status: 'ongoing' };
    },

    getLevel: function () {
        if (this.clearedCount == 0) {
            return 0;
        }
        else if (this.clearedCount < 10) {
            return 1;
        }
        else if (this.clearedCount < 20) {
            return 2;
        }
        else if (this.clearedCount < 30) {
            return 3;
        }
        else if (this.clearedCount < 40) {
            return 4;
        }

        return 5;
    }
});
