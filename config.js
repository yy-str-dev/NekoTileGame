GameConfig = {
    SCREEN_WIDTH: 500,
    SCREEN_HEIGHT: 500,
    
    // 盤面設定
    GRID_COUNT: 8,
    CELL_SIZE: 38,
    CELL_GAP: 3,
    BOARD_PADDING: 10,

    // スロット設定
    SLOT_COUNT: 3,
    SLOT_WIDTH: 110,
    SLOT_HEIGHT: 86,

    // カラーパレット
    COLORS: {
        BG: '#dff0ea',               // 全体背景（やさしいミントブルー）
        HEADER_BG: '#ffffff',
        BOARD_BG: '#faeed4',         // 盤面台座（やわらかなクリームイエロー）
        BOARD_STROKE: '#d8b982',     // 盤面枠線
        CELL_EMPTY: '#ebd5b3',       // 空きセル
        CELL_EMPTY_STROKE: '#debfa0',// 空きセル枠線
        SLOT_BG: '#eedbbd',          // スロット枠背景
        SLOT_STROKE: '#d4bc96',      // スロット枠線
        TEXT_MAIN: '#5c4838',        // テキスト色
        TEXT_SCORE: '#e67332',       // スコア強調色
        TEXT_SUB: '#8e796c',         // サブテキスト色
    }
};

// phina.js をグローバル領域に展開
phina.globalize();
