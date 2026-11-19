class _SoundManager{
    static _instance = null;
    audio_list = {};

    current_bgm = null;
    bgm_volume = 1.0;

    constructor(){
        if(!_SoundManager._instance){
            _SoundManager._instance = this;
        }

        return _SoundManager._instance;
    }

    loadAssets(assets){
        for (const key in assets) {
            if (!Object.hasOwn(assets, key)) continue;
            
            const file_path = assets[key];

            this.audio_list[key] = new Audio(file_path);
        }
    }

    playBGM(asset_name){
        if(this.current_bgm == this.audio_list[asset_name]){
            return;
        }

        var loopEvent = () => {
            this.audio_list[asset_name].currentTime = 0;
            this.audio_list[asset_name].play();
        };

        if(this.current_bgm){
            this.current_bgm.currentTime = 0;
            this.current_bgm.pause();
            this.current_bgm.removeEventListener("ended", loopEvent);
        }

        this.audio_list[asset_name].addEventListener("ended", loopEvent);
        this.audio_list[asset_name].volume = 0.75;
        this.audio_list[asset_name].play();
        this.current_bgm = this.audio_list[asset_name];
    }

    playSE(asset_name){
        this.audio_list[asset_name].currentTime = 0;
        this.audio_list[asset_name].play();
    }
}

MySoundManager = new _SoundManager();
