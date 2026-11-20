const PositionOrigin = {
    LEFT_TOP: 0,
    CENTER: 1,
    LEFT_CENTER: 2,
};

function calcPosition(origin, position){
    if(position.x instanceof Number){
        console.error("position の x がNumberではありません。");
        return;
    }
    if(position.y instanceof Number){
        console.error("position の x がNumberではありません。");
        return;
    }

    if(origin == PositionOrigin.LEFT_TOP){
        return Vector2(position.x, position.y)
    }

    if(origin == PositionOrigin.LEFT_CENTER){
        return Vector2(position.x, position.y + GameConfig.SCREEN_HEIGHT / 2); 
    }

    if(origin == PositionOrigin.CENTER){
        return Vector2(position.x + GameConfig.SCREEN_WIDTH / 2, position.y + GameConfig.SCREEN_HEIGHT / 2);
    }

    return Vector2(position.x, position.y)
}

function calcWidthScreenRate(rate){
    return GameConfig.SCREEN_WIDTH * rate;
}

function calcWidthScreenRate(rate){
    return GameConfig.SCREEN_HEIGHT * rate;
}
