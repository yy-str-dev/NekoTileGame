const PositionOrigin = {
    LEFT_TOP: 0,
    CENTER: 1,
    LEFT_CENTER: 2,
};

function calcPosition(origin, position) {
    if (typeof position.x !== 'number' || typeof position.y !== 'number') {
        console.error("position の x または y が number ではありません。", position);
        return Vector2(0, 0);
    }

    if (origin === PositionOrigin.LEFT_TOP) {
        return Vector2(position.x, position.y);
    }

    if (origin === PositionOrigin.LEFT_CENTER) {
        return Vector2(position.x, position.y + GameConfig.SCREEN_HEIGHT / 2);
    }

    if (origin === PositionOrigin.CENTER) {
        return Vector2(position.x + GameConfig.SCREEN_WIDTH / 2, position.y + GameConfig.SCREEN_HEIGHT / 2);
    }

    return Vector2(position.x, position.y);
}

function calcWidthScreenRate(rate) {
    return GameConfig.SCREEN_WIDTH * rate;
}

function calcHeightScreenRate(rate) {
    return GameConfig.SCREEN_HEIGHT * rate;
}
