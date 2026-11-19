class Vector2{
    x;
    y;

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    copy(){
        return new Vector2(this.x, this.y);
    }
}

const PositionOrigin = {
    LEFT_TOP: 0,
    CENTER: 1,
    LEFT_CENTER: 2,
};

function calcPosition(origin, position){
    if(!position instanceof Vector2){
        console.error("calcPosition の引数 screenPosition に Vector2 以外の方が渡されました。");

        return;
    }

    if(origin == PositionOrigin.LEFT_TOP){
        return position.copy();
    }

    if(origin == PositionOrigin.LEFT_CENTER){
        return new Vector2(position.x, position.y + GameConfig.SCREEN_HEIGHT / 2); 
    }

    if(origin == PositionOrigin.CENTER){
        return new Vector2(position.x + GameConfig.SCREEN_WIDTH / 2, position.y + GameConfig.SCREEN_HEIGHT / 2);
    }

    return position.copy();
}

function calcWidthScreenRate(rate){
    return GameConfig.SCREEN_WIDTH * rate;
}

function calcWidthScreenRate(rate){
    return GameConfig.SCREEN_HEIGHT * rate;
}
