class Theme{
    dark_mode = 1;
    loop;

    constructor(){
        let mode = Number(localStorage.getItem('dark_mode'));
        if(mode !== 0){ // null converted to 0
            this.dark_mode = mode;
        }else{
            this.dark_mode = 1;
        }
    }

    changeTheme(n){
        localStorage.setItem('dark_mode', n);
        this.dark_mode = Number(n);
    }

    themeLoop(){
        if(theme.dark_mode === 1){
            // light
            $('#dark_theme').attr('rel', 'stylesheet alternate');
        }else if(theme.dark_mode === 2){
            // dark
            $('#dark_theme').attr('rel', 'stylesheet');
        }else{
            // auto
            let hour = new Date().getHours();
            if(hour > 7 && hour < 19){
                // light theme
                $('#dark_theme').attr('rel', 'stylesheet alternate');
            }else{
                //dark theme
                $('#dark_theme').attr('rel', 'stylesheet');
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