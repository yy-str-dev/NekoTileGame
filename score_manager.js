// スコア管理クラス
phina.define('ScoreManager', {
    superClass: 'DisplayElement',

    init: function() {
        this.superInit();

        this.currentScore = 0;
        this.highScore = this.loadHighScore();
    },

    // ピース配置時の加点
    addPlaceScore: function(blockCount) {
        var points = blockCount * 10;
        this.currentScore += points;
        this.checkHighScore();
        return points;
    },

    // ライン消去＆猫消去時の加点
    addClearScore: function(lineCount, totalClearedBlocks, catCount) {
        // ライン数基本点 (1列: 100, 2列: 300, 3列: 600, 4列以上: 1000)
        var lineBonus = 0;
        if (lineCount === 1) lineBonus = 100;
        else if (lineCount === 2) lineBonus = 300;
        else if (lineCount === 3) lineBonus = 600;
        else if (lineCount >= 4) lineBonus = 1000;

        // 巻き込み猫ブロックボーナス (消去された総ブロック数 × 20)
        var catBonus = totalClearedBlocks * 20;

        // マルチ猫ボーナス (同時に2匹以上成仏でボーナス)
        var multiBonus = (catCount > 1) ? (catCount - 1) * 50 : 0;

        var total = lineBonus + catBonus + multiBonus;
        this.currentScore += total;
        this.checkHighScore();

        return total;
    },

    // ハイスコア判定と更新
    checkHighScore: function() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore(this.highScore);
            return true;
        }
        return false;
    },

    // ハイスコアの読み込み (localStorage)
    loadHighScore: function() {
        try {
            var val = localStorage.getItem('NekoTile_HighScore');
            return val ? parseInt(val, 10) : 0;
        } catch (e) {
            return 0;
        }
    },

    // ハイスコアの保存 (localStorage)
    saveHighScore: function(score) {
        try {
            localStorage.setItem('NekoTile_HighScore', score.toString());
        } catch (e) {
        }
    },

    resetScore: function() {
        this.currentScore = 0;
    }
});
