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
    "Bing!": {
        "search": "https://bing.com/search",
        "domain": "https://bing.com",
        "picture_url": '/public/bing_logo.png'
    }
};

let currentSearchEngine = "Google";
let idEdit = undefined;

let changeLoginInfos = function (obj) {
    let loginELement = document.getElementById('login-link');
    let picture = document.getElementById('search-logo');
    let form = document.getElementById('search-form');
    let sedomain = document.getElementById('se-domain');
    let favorite = document.getElementById('favorites');
    if (obj.connected) {
        loginELement.innerHTML = obj.mail;
        document.getElementById('settings').style.display = "inline";
        document.getElementById('disconnect').style.display = "inline";
        document.getElementById('signup-link').style.display = "none";
        if (searchengines[obj.searchengine]) {
            form.setAttribute('action', searchengines[obj.searchengine].search);
            picture.setAttribute('src', searchengines[obj.searchengine].picture_url);
            picture.setAttribute('alt', obj.searchengine + '\'s icon');
            sedomain.setAttribute('href', searchengines[obj.searchengine].domain);
            currentSearchEngine = obj.searchengine;
            favorite.innerHTML = "";
            for (i in obj.favorite) {
                favorite.innerHTML += '<a href="' + obj.favorite[i].domain + '"><div style="background-color:' + obj.favorite[i].color + ';"><div>' + obj.favorite[i].name + '</div><button class="deleteIcon material-icons" onclick="editFav(' + obj.favorite[i].id + ',  \'' + obj.favorite[i].name + '\', \'' + obj.favorite[i].domain + '\', \'' + obj.favorite[i].color + '\'); return false;">edit</button><button class="deleteIcon material-icons" onclick="deleteFav(' + obj.favorite[i].id + '); return false;">close</button></div></a>';
            }
            favorite.innerHTML += '<div class="addFavorite" onclick="addFavorite();"><div class="material-icons">add</div></div>';
        } else {
            form.setAttribute('action', searchengines["Google"].search);
            picture.setAttribute('src', searchengines["Google"].picture_url);
            picture.setAttribute('alt', 'Google\'s icon');
            sedomain.setAttribute('href', searchengines["Google"].domain);
            currentSearchEngine = "Google";
        }

        let selectSearchEngine = document.getElementById('selectSearchEngine');
        selectSearchEngine.innerHTML = "";
        for (i in searchengines) {
            let string = '<option value="' + i + '"';
            if (i === currentSearchEngine) {
                string += ' selected>';
            } else {
                string += '>';
            }
            string += i + '</option>';
            selectSearchEngine.innerHTML += string;
        }

    } else {
        loginELement.innerHTML = "<a href=\"javascript:loginScreen();\">Login</a>";
        document.getElementById('disconnect').style.display = "none";
        document.getElementById('settings').style.display = "none";
        document.getElementById('signup-link').style.display = "inline";
        form.setAttribute('action', searchengines["Google"].search);
        picture.setAttribute('src', searchengines["Google"].picture_url);
        currentSearchEngine = "Google";
        favorite.innerHTML = "";
    }

    if(obj.news.length > 0){
        let newsElement = document.querySelector('#news');
        newsElement.innerHTML = "";
        for (i in obj.news) {
            newsElement.innerHTML += '<div class="news_content"><h2>' + obj.news[i].title + '</h2><hr /><div>' + obj.news[i].content + '</div></div>';
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
            let obj = JSON.parse(html);
            changeLoginInfos(obj);
        },
        error: (result, status, error) => {

        }
    });
    closeFullscreen();
};

let openSettings = function () {
    displayFullscreen();
    document.getElementById('fs-settings-content').style.display = "block";
}

let openSignup = function () {
    displayFullscreen();
    document.getElementById('fs-signup-content').style.display = "block";
}

let addFavorite = function () {
    displayFullscreen();
    document.getElementById('addFavorite').style.display = "block";
}

let deleteFav = function (id) {
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=deleteFav&id=' + id,
        success: (html, status) => {
            let obj = JSON.parse(html);
            changeLoginInfos(obj);
        },
        error: (result, status, error) => {

        }
    });
};

let editFav = function (id, name, domain, color) {
    idEdit = id;
    displayFullscreen();
    document.getElementById('fs-editFavorite').style.display = "block";
    document.getElementById('editName').value = name;
    document.getElementById('domainForm').value = domain;
    document.getElementById('colorForm').value = color;

};

let loginScreen = function () {
    displayFullscreen();
    document.getElementById('fs-login-content').style.display = "block";
}

let displayFullscreen = function () {
    document.body.style.overflow = "hidden";
    const position = window.scrollY;
    document.getElementById('fullscreen').style.display = "block";
    document.getElementById('fullscreen').style.top = position + "px";
};

let closeFullscreen = function () {
    document.body.style.overflow = "auto";
    document.getElementById('fullscreen').style.display = "none";
    document.getElementById('fs-login-content').style.display = "none";
    document.getElementById('fs-signup-content').style.display = "none";
    document.getElementById('fs-settings-content').style.display = "none";
    document.getElementById('addFavorite').style.display = "none";
    document.getElementById('fs-editFavorite').style.display = "none";
};

window.addEventListener('DOMContentLoaded', () => {
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=credentials',
        success: (html, status) => {
            let obj = JSON.parse(html);
            changeLoginInfos(obj)
        },
        error: (result, status, error) => {

        }
    });
});

document.getElementById('loginForm').addEventListener("submit", (event) => {
    if (document.getElementById('mail').value !== "" && document.getElementById('password').value !== "") {
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=login&mail=' + document.getElementById('mail').value + "&password=" + document.getElementById('password').value,
            success: (html, status) => {
                let obj = JSON.parse(html);
                changeLoginInfos(obj);
                if (!obj.connected) {
                    if (document.getElementById('fs-login-content').style.display !== "none") {
                        document.getElementById('fs-login-warning').style.display = "block";
                        document.getElementById('fs-login-warning').innerHTML = "Mail adress or password wrong";
                    }
                } else {
                    closeFullscreen();
                }
            },
            error: (result, status, error) => {

            }
        })
    } else {
        document.getElementById('fs-login-warning').style.display = "block";
        document.getElementById('fs-login-warning').innerHTML = "Please insert your mail adress and your password to connect";
    }

    event.preventDefault();
});

document.getElementById('settingsForm').addEventListener("submit", (event) => {
    let se = document.getElementById('selectSearchEngine');
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=settings&searchengine=' + se.options[se.selectedIndex].value,
        success: (html, status) => {
            let obj = JSON.parse(html);
            changeLoginInfos(obj);
            closeFullscreen();
        },
        error: (result, status, error) => {

        }
    })
    event.preventDefault();
});

document.getElementById('signup-form').addEventListener("submit", (event) => {
    let email = document.getElementById('mailSignup').value;
    let password = document.getElementById('passSignup').value;
    if (email.value !== "" && password.value !== "") {
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=signup&mail=' + email + '&password=' + password,
            success: (html, status) => {
                let obj = JSON.parse(html);
                if (obj.connected) {
                    changeLoginInfos(obj);
                    closeFullscreen();
                } else {
                    document.getElementById('fs-signup-warning').innerHTML = obj.error;
                    document.getElementById('fs-signup-warning').style.display = "block";
                }
            },
            error: (result, status, error) => {

            }
        })
    } else {
        document.getElementById('fs-signup-warning').innerHTML = "Please insert your mail adress and your password to sign up";
        document.getElementById('fs-signup-warning').style.display = "block";
    }
    event.preventDefault();
});

document.getElementById('formFavorite').addEventListener("submit", (event) => {
    let name = document.getElementById('name').value;
    let domain = document.getElementById('domain').value;
    let color = document.getElementById('color').value;
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=addFavorite&name=' + name + '&domain=' + domain + '&color=' + color,
        success: (html, status) => {
            let obj = JSON.parse(html);
            changeLoginInfos(obj);
            closeFullscreen();
        },
        error: (result, status, error) => {

        }
    });
    event.preventDefault();
});

document.getElementById('formEditFavorite').addEventListener("submit", (event) => {
    let name = document.getElementById('editName').value;
    let domain = document.getElementById('domainForm').value;
    let color = document.getElementById('colorForm').value;
    $.ajax({
        url: "/request",
        type: "POST",
        dataType: 'html',
        data: 'data=editFavorite&id=' + idEdit + '&name=' + name + '&domain=' + domain + '&color=' + color,
        success: (html, status) => {
            let obj = JSON.parse(html);
            changeLoginInfos(obj);
            closeFullscreen();
        },
        error: (result, status, error) => {

        }
    });
    event.preventDefault();
});