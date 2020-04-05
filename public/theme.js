class Theme{
    dark_mode = 1;
    loop;

    changeTheme(){
        if(this.dark_mode === 1 || this.dark_mode === 2){
            if(this.dark_mode === 1){
                // light
                $('#dark_theme').attr('rel', 'stylesheet alternate');
            }else{
                // dark
                $('#dark_theme').attr('rel', 'stylesheet');
            }
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

let theme = new Theme;
theme.startLoop(theme.loop, theme.changeTheme, 1000);