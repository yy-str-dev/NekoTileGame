// お題定義リスト
const MISSION_DEFINITIONS = [
    {
        id: 'clear_1_line',
        type: 'lines',
        target: 1,
        turns: 5,
        title: '1ライン\n消去する',
        unit: 'ライン'
    },
    {
        id: 'clear_10_blocks',
        type: 'blocks',
        target: 10,
        turns: 3,
        title: '10ブロック\n消去する',
        unit: '個'
    },
    {
        id: 'clear_2_lines_once',
        type: 'multi_line',
        target: 2,
        turns: 4,
        title: '2ライン\n同時消去',
        unit: '同時'
    },
    {
        id: 'clear_i_cat',
        type: 'piece_id',
        pieceId: ['2_i_h', '2_i_v'],
        target: 1,
        turns: 5,
        title: 'I字猫を\n1匹消去する',
        unit: '匹'
    },
    {
        id: 'clear_3_cats',
        type: 'cats',
        target: 3,
        turns: 4,
        title: '猫を3匹\n成仏させる',
        unit: '匹'
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
        var candidates = MISSION_DEFINITIONS.filter(function (m) {
            return m.id !== prevId;
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
                    if (m.pieceId.includes(clearResult.clearedPieces[i].pieceId)) {
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
    }
});
