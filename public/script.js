class StartPage{

    searchengines = {
        "Google": {
            "search": "https://www.google.com/search",
            "domain": "https://www.google.com/",
            "picture_url": "/public/media/google_logo.png"
        },
        "Ecosia": {
            "search": "https://www.ecosia.org/search",
            "domain": "https://www.ecosia.org/",
            "picture_url": "/public/media/ecosia_logo.png"
        },
        "Bing": {
            "search": "https://bing.com/search",
            "domain": "https://bing.com",
            "picture_url": '/public/media/bing_logo.png'
        },
        "Yahoo!": {
            "search": "https://yahoo.com/search",
            "domain": "https://yahoo.com/",
            "picture_url": ""
        }
    };
    
    currentSearchEngine = "Google";
    favorite = [];
    idEdit = undefined; // also used for deletion

    loadDefautSearchEngine(){
        let picture = $('#search-logo');
        let form = $('#search-form');
        let sedomain = $('#se-domain');
        form.attr('action', this.searchengines["Google"].search);
        picture.attr('src', this.searchengines["Google"].picture_url);
        picture.attr('alt', 'Google\'s icon');
        sedomain.attr('href', this.searchengines["Google"].domain);
        this.currentSearchEngine = "Google";
        this.saveData();
    }
    saveData(){
        localStorage.setItem('search-engine', this.currentSearchEngine);
        localStorage.setItem('favorite', JSON.stringify(this.favorite));
    }
    
    loadData(){
        let favoriteElement = $('#favorites');
        let favoritePage2 = $('#favorites-page-2');
        let picture = $('#search-logo');
        let form = $('#search-form');
        let sedomain = $('#se-domain');
        let se = localStorage.getItem('search-engine');
        if(se !== null){
            if (this.searchengines[se]) {
                form.attr('action', this.searchengines[se].search);
                picture.attr('src', this.searchengines[se].picture_url);
                picture.attr('alt', se + '\'s icon');
                sedomain.attr('href', this.searchengines[se].domain);
                this.currentSearchEngine = se;
            }else{
                this.loadDefautSearchEngine();
            }
        }else{
            this.loadDefautSearchEngine();
        }
        this.favorite = localStorage.getItem('favorite');
        let element = favoriteElement;
        if(!(this.favorite === null || this.favorite === "undefined")){
            this.favorite = JSON.parse(this.favorite);
            favoriteElement.html('');
            favoritePage2.html('');
            for(let i in this.favorite){
                if(i < 8){
                    element = favoriteElement;
                }else{
                    element = favoritePage2;
                }
                element.append('<a href="' + this.favorite[i].domain + '"><div style="background-color:' + this.favorite[i].color + ';">'+
                    '<div>' + this.favorite[i].name + '</div>'+
                    '<button class="deleteIcon material-icons" onclick="event.stopPropagation();startpage.requestEditFav(' + i + '); return false;">edit</button>'+
                    '<button class="deleteIcon material-icons" onclick="event.stopPropagation();startpage.deleteFav(' + i + '); return false;">close</button></div></a>');
            }
        }
        if(this.favorite.length > 7)
            element = favoritePage2;
        element.append('<div class="addFavorite" onclick="startpage.requestAddFavorite();"><div class="material-icons">add</div></div>');
        this.load_se_in_settings();
    }

    load_se_in_settings(){
        let selectSearchEngine = $('#selectSearchEngine');
        let content = "";
        for(let i in startpage.searchengines){
            content += '<option value="' + i + '">' + i + '</option>\n';
        }
        selectSearchEngine.html(content);
    }
    
    requestAddFavorite() {
        this.displayFullscreen();
        $('#addFavorite').css('display', "block");
    }

    addFavorite(){
        event.preventDefault();
        let name = $('#name').val().trim();
        let domain = $('#domain').val().trim();
        let color = $('#color').val().trim();
        if(name !== "" && domain !== "" && color !== ""){
            this.favorite.push({
                'name': name,
                'domain': domain,
                'color': color
            });
            this.saveData();
            this.loadData();
            this.closeFullscreen();
        }else{
            // Display a warning
        }
    }

    requestEditFav(id) {
        this.idEdit = id;
        this.displayFullscreen();
        $('#fs-editFavorite').css('display', "block");
        $('#editName').val(this.favorite[id].name);
        $('#domainForm').val(this.favorite[id].domain);
        $('#colorForm').val(this.favorite[id].color);
    
    }

    editFavorite(){
        let name = $('#editName').val().trim();
        let domain = $('#domainForm').val().trim();
        let color = $('#colorForm').val().trim();
        if(name !== "" && domain !== "" && color !== ""){
            this.favorite[this.idEdit] = {
                'name': name,
                'domain': domain,
                'color': color
            };
            this.saveData();
            this.loadData();
            this.closeFullscreen();
        }else{
            // Display a warning
        }
    }

    /**
     * @todo
     * 
     */
    requestDeleteFav(id){
        this.displayFullscreen();
        this.idEdit = id;
    }

    deleteFav(id){
        this.favorite.splice(id, 1);
        this.saveData();
        this.loadData();
    }

    /**
     * @todo
     */
    updateSettings(){
        let val = $('#selectSearchEngine').val();
        if(val in Object.keys(this.searchengines));
        this.currentSearchEngine = val;
        this.saveData();
        this.loadData();
    }

    displayFullscreen() {
        $('body').css('overflow', "hidden");
        const position = window.scrollY;
        $('#fullscreen').css('display', "block");
        $('#fullscreen').css('top', position + "px");
    }
    
    closeFullscreen() {
        $('body').css('overflow', "auto");
        $('#fullscreen').css('display', "none");
        $('#fs-settings-content').css('display', "none");
        $('#addFavorite').css('display', "none");
        $('#fs-editFavorite').css('display', "none");
    }

    /**
     * @deprecated need to be modified before be used
     * @param {*} error 
     * @param {*} statusCode 
     * @param {*} message 
     * @param {*} responseText 
     */
    displayWarning(error, statusCode, message=undefined, responseText=undefined){
        console.error(error, statusCode, message, responseText);
        if(responseText !== undefined){
            $("#warningTitle").html("The server return an error");
            $("#warningMessage").html(responseText);
        }else{
            $("#warningMessage").html(error + ' ' + statusCode);
            if(message !== undefined)
                $("#warningMessage").append(' ' + message);
            if(statusCode === 0){
                $("#warningMessage").append(" Timeout");
                $("#warningTitle").html("Unable to contact remote server");
            }else{
                $("#warningTitle").html("The server return an error");
            }
        }
        $('#warning').css('top', '0px');
        window.setTimeout(() => {
            $('#warning').css('top', '');
            $("#warningMessage").html("");
        }, 10000);
    }
}

let startpage = new StartPage;

window.addEventListener('DOMContentLoaded', () => {
    startpage.loadData();

});

document.querySelector('#formFavorite').addEventListener("submit", (e) => {
    e.preventDefault();
    startpage.addFavorite();
});
document.querySelector('#formEditFavorite').addEventListener("submit", (event) =>{
    event.preventDefault();
    startpage.editFavorite();
});
document.querySelector('#settings').addEventListener('click', (e) => {
    e.preventDefault();
    startpage.displayFullscreen();
    $('#fs-settings-content').css('display', 'block');
    let selectSearchEngine = document.querySelector('#selectSearchEngine');
    let y = 0;
    for(let i in startpage.searchengines){
        if(i === startpage.currentSearchEngine){
            selectSearchEngine.children[y].setAttribute('selected', '');
        }else{
            selectSearchEngine.children[y].removeAttribute('selected');
        }
        y++;
    }
    let dark_mode = document.querySelector('#dark_mode');
    for(let i in dark_mode){
        if(i === theme.dark_mode){
            dark_mode.setAttribute('selected', '');
        }else{
            dark_mode.removeAttribute('selected');
        }
    }
});


document.querySelector('#settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    startpage.updateSettings();
    theme.changeTheme($('#dark_mode').val());
    startpage.closeFullscreen();
});

function isScrolled(){
    if(window.pageYOffset > window.innerHeight + 100){
        document.body.classList.add('scrolled');
    }else{
        document.body.classList.remove('scrolled');
    }
}
document.addEventListener("scroll", isScrolled);
window.addEventListener("resize", isScrolled);
window.addEventListener("orientationChange", isScrolled);