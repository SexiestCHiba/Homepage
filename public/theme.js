class Theme{
    dark_mode = 0;
    loop;

    constructor(){
        this.dark_mode = Number(localStorage.getItem('dark_mode'));
    }

    changeTheme(n){
        localStorage.setItem('dark_mode', n);
        this.dark_mode = Number(n);
    }

    themeLoop(){
        if(theme.dark_mode === 0){
            // light
            if($('#dark_theme').attr('rel') !== 'stylesheet alternate'){
                $('#dark_theme').attr('rel', 'stylesheet alternate');
            }
        }else if(theme.dark_mode === 1){
            // dark
            if($('#dark_theme').attr('rel') !== 'stylesheet'){
                $('#dark_theme').attr('rel', 'stylesheet');
            }
        }else{
            // auto
            let hour = new Date().getHours();
            if(hour > 7 && hour < 19){
                // light theme
                if($('#dark_theme').attr('rel') !== 'stylesheet alternate'){
                    $('#dark_theme').attr('rel', 'stylesheet alternate');
                }
            }else{
                //dark theme
                if($('#dark_theme').attr('rel') !== 'stylesheet'){
                    $('#dark_theme').attr('rel', 'stylesheet');
                }
            }
        }
    }

    startLoop(varLoop, callback, interval){
        varLoop = window.setInterval(callback, interval);
    }

}

let theme = new Theme();
theme.themeLoop();
theme.startLoop(theme.loop, theme.themeLoop, 1000);