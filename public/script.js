let searchengines = {
    "Google": {
        "search": "https://www.google.com/search",
        "domain": "https://www.google.com/",
        "picture_url": "/public/google_logo.png"
    },
    "Ecosia": {
        "search": "https://www.ecosia.org/search",
        "domain": "https://www.ecosia.org/",
        "picture_url": "/public/ecosia_logo.png"
    },
    "Bing": {
        "search": "https://bing.com/search",
        "domain": "https://bing.com",
        "picture_url": '/public/bing_logo.png'
    },
    "Yahoo!": {
        "search": "https://yahoo.com/search",
        "domain": "https://yahoo.com/",
        "picture_url": "/public/ecosia.png"
    }
};

let currentSearchEngine = "Google";
let idEdit = undefined;
let dark_mode = 1;
let loop;
let obj;

let changeLoginInfos = function (object) {
    let loginELement = $('#login-link');
    let picture = $('#search-logo');
    let form = $('#search-form');
    let sedomain = $('#se-domain');
    let favorite = $('#favorites');
    obj = object;
    if (obj.connected) {
        loginELement.html(obj.mail);
        $('#settings').css('display', "inline");
        $('#disconnect').css('display', "inline");
        $('#signup-link').css('display', "none");
        if (searchengines[obj.searchengine]) {
            form.attr('action', searchengines[obj.searchengine].search);
            picture.attr('src', searchengines[obj.searchengine].picture_url);
            picture.attr('alt', obj.searchengine + '\'s icon');
            sedomain.attr('href', searchengines[obj.searchengine].domain);
            currentSearchEngine = obj.searchengine;
            favorite.html("");
            for (i in obj.favorite) {
                favorite.append('<a href="' + obj.favorite[i].domain + '"><div style="background-color:' + obj.favorite[i].color + ';">'+
                '<div>' + obj.favorite[i].name + '</div><button class="deleteIcon material-icons" onclick="editFav(' + obj.favorite[i].id + ',  \'' + obj.favorite[i].name + '\', \'' + obj.favorite[i].domain + '\', \'' + obj.favorite[i].color + '\'); return false;">edit</button>'+
                '<button class="deleteIcon material-icons" onclick="deleteFav(' + obj.favorite[i].id + '); return false;">close</button></div></a>');
            }
            favorite.append('<div class="addFavorite" onclick="addFavorite();"><div class="material-icons">add</div></div>');
        } else {
            form.attr('action', searchengines["Google"].search);
            picture.attr('src', searchengines["Google"].picture_url);
            picture.attr('alt', 'Google\'s icon');
            sedomain.attr('href', searchengines["Google"].domain);
            currentSearchEngine = "Google";
        }

        let selectSearchEngine = document.querySelector('#selectSearchEngine');
        selectSearchEngine.innerHTML = "";
        for (i in searchengines) {
            let element = document.createElement("option");
            element.setAttribute('value', i);
            let text = document.createTextNode(i);
            element.appendChild(text)
            if (i === currentSearchEngine) {
                element.setAttribute('selected', 'true');
            }
            selectSearchEngine.appendChild(element);
        }
        let option = document.querySelector('#dark_mode').children;
        for (let i = 0;i<option.length;i++) {
            if (i+1 === obj.dark_mode) {
                option[i].setAttribute('selected', 'true');
            } else {
                option[i].removeAttribute('selected');
            }
        }
        dark_mode = obj.dark_mode;
        changeTheme();

    } else {
        loginELement.html("<a href=\"javascript:loginScreen();\">Login</a>");
        $('#disconnect').css('display', "none");
        $('#settings').css('display', "none");
        $('#signup-link').css('display', "inline");
        form.attr('action', searchengines["Google"].search);
        picture.attr('src', searchengines["Google"].picture_url);
        currentSearchEngine = "Google";
        favorite.html("");
    }

    if(obj.news.length > 0){
        let newsElement = $('#news');
        newsElement.html("");
        for (i in obj.news) {
            newsElement.html(newsElement.html() + '<div class="news_content"><h2>' + obj.news[i].title + '</h2><hr /><div>' + obj.news[i].content + '</div></div>');
        }
    }
}

let disconnectPOST = function () {
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=disconnect',
        success: (html, status) => {
            let object = JSON.parse(html);
            changeLoginInfos(object);
            dark_mode = 1;
            changeTheme();
        },
        error: (result, status, error) => {

        }
    });
    closeFullscreen();
};

let openSettings = function () {
    displayFullscreen();
    $('#fs-settings-content').css('display', "block");
}

let openSignup = function () {
    displayFullscreen();
    $('#fs-signup-content').css('display', "block");
}

let addFavorite = function () {
    displayFullscreen();
    $('#addFavorite').css('display', "block");
}

let deleteFav = function (id) {
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=deleteFav&id=' + id,
        success: (html, status) => {
            let object = JSON.parse(html);
            changeLoginInfos(object);
        },
        error: (result, status, error) => {

        }
    });
};

let editFav = function (id, name, domain, color) {
    idEdit = id;
    displayFullscreen();
    $('#fs-editFavorite').css('display', "block");
    $('#editName').val(name);
    $('#domainForm').val(domain);
    $('#colorForm').val(color);

};

let loginScreen = function () {
    displayFullscreen();
    $('#fs-login-content').css('display', "block");
}

let displayFullscreen = function () {
    $('body').css('overflow', "hidden");
    const position = window.scrollY;
    $('#fullscreen').css('display', "block");
    $('#fullscreen').css('top', position + "px");
};

let closeFullscreen = function () {
    $('body').css('overflow', "auto");
    $('#fullscreen').css('display', "none");
    $('#fs-login-content').css('display', "none");
    $('#fs-signup-content').css('display', "none");
    $('#fs-settings-content').css('display', "none");
    $('#addFavorite').css('display', "none");
    $('#fs-editFavorite').css('display', "none");
};

window.addEventListener('DOMContentLoaded', () => {
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=credentials',
        success: (html, status) => {
            let object = JSON.parse(html);
            changeLoginInfos(object);
        },
        error: (result, status, error) => {

        }
    });
    hideLoadingScreen();
});

function hideLoadingScreen(){
    $("body").css('overflow', '');
    $("#loading").css('display', 'none');
}

document.querySelector('#loginForm').addEventListener("submit", (event) => {
    event.preventDefault();
    if ($('#mail').val().trim() !== "" && $('#password').val().trim() !== "") {
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=login&mail=' + $('#mail').val().trim() + "&password=" + $('#password').val().trim(),
            success: (html, status) => {
                let object = JSON.parse(html);
                changeLoginInfos(object);
                if (!object.connected) {
                    if ($('#fs-login-content').css('display') !== "none") {
                        $('#fs-login-warning').css('display', "block");
                        $('#fs-login-warning').html("Mail adress or password wrong");
                    }
                } else {
                    closeFullscreen();
                }
            },
            error: (result, status, error) => {

            }
        })
    } else {
        $('#fs-login-warning').css('display', "block");
        $('#fs-login-warning').html("Please insert your mail adress and your password to connect");
    }
});

document.querySelector('#settingsForm').addEventListener("submit", (event) => {
    event.preventDefault();
    let se = document.querySelector('#selectSearchEngine');
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=settings&searchengine=' + se.options[se.selectedIndex].value + '&dark_mode=' + (document.querySelector('#dark_mode').selectedIndex + 1),
        success: (html, status) => {
            let object = JSON.parse(html);
            changeLoginInfos(object);
            closeFullscreen();
        },
        error: (result, status, error) => {

        }
    })
});

document.querySelector('#signup-form').addEventListener("submit", (event) => {
    event.preventDefault();
    let email = $('#mailSignup').val().trim();
    let password = $('#passSignup').val().trim();
    if (email !== "" && password !== "") {
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=signup&mail=' + email + '&password=' + password,
            success: (html, status) => {
                let object = JSON.parse(html);
                if (object.connected) {
                    changeLoginInfos(object);
                    closeFullscreen();
                } else {
                    $('#fs-signup-warning').html(object.error);
                    $('#fs-signup-warning').css('display', "block");
                }
            },
            error: (result, status, error) => {

            }
        })
    } else {
        $('#fs-signup-warning').html("Please insert your mail adress and your password to sign up");
        $('#fs-signup-warning').css('display', "block");
    }
});

document.querySelector('#formFavorite').addEventListener("submit", (event) => {
    event.preventDefault();
    let name = $('#name').val().trim();
    let domain = $('#domain').val().trim();
    let color = $('#color').val().trim();
    if(name !== "" && domain !== "" && color !== ""){
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=addFavorite&name=' + name + '&domain=' + domain + '&color=' + color,
            success: (html, status) => {
                let object = JSON.parse(html);
                changeLoginInfos(object);
                closeFullscreen();
            },
            error: (result, status, error) => {

            }
        });
    }else{

    }
});

document.querySelector('#formEditFavorite').addEventListener("submit", (event) => {
    event.preventDefault();
    let name = $('#editName').val().trim();
    let domain = $('#domainForm').val().trim();
    let color = $('#colorForm').val().trim();
    if(name !== "" && domain !== "" && color !== ""){
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=editFavorite&id=' + idEdit + '&name=' + name + '&domain=' + domain + '&color=' + color,
            success: (html, status) => {
                let object = JSON.parse(html);
                changeLoginInfos(object);
                closeFullscreen();
            },
            error: (result, status, error) => {
    
            }
        });
    }else{

    }
});


function changeTheme(){
    if(dark_mode === 1 || dark_mode === 2){
        if(dark_mode === 1){
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

function startLoop(varLoop, callback, interval){
    varLoop = window.setInterval(callback, interval);
}

startLoop(loop, changeTheme, 1000);