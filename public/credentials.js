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
    }
};

let currentSearchEngine = "Google";


let changeLoginInfos = function (obj) {
    let loginELement = document.getElementById('login-link');
    let picture = document.getElementById('search-logo');
    let form = document.getElementById('search-form');
    let sedomain = document.getElementById('se-domain');
    if (obj.connected) {
        loginELement.innerHTML = "Connected as " + obj.mail;
        document.getElementById('settings').innerHTML = "Settings";
        document.getElementById('disconnect').innerHTML = "Disconnect";
        document.getElementById('signup-link').innerHTML = "";
        if (searchengines[obj.searchengine]) {
            form.setAttribute('action', searchengines[obj.searchengine].search);
            picture.setAttribute('src', searchengines[obj.searchengine].picture_url);
            sedomain.setAttribute('href', searchengines[obj.searchengine].domain);
            currentSearchEngine = obj.searchengine;
        } else {
            form.setAttribute('action', searchengines["Google"].search);
            picture.setAttribute('src', searchengines["Google"].picture_url);
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
        document.getElementById('disconnect').innerHTML = "";
        document.getElementById('settings').innerHTML = "";
        document.getElementById('signup-link').innerHTML = "Signup";
        form.setAttribute('action', searchengines["Google"].search);
        picture.setAttribute('src', searchengines["Google"].picture_url);
        currentSearchEngine = "Google";
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
};

document.getElementById('loginForm').addEventListener("submit", (event) => {
    if(document.getElementById('mail').value !== "" && document.getElementById('password').value !== ""){
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: 'html',
            data: 'data=login&mail=' + document.getElementById('mail').value + "&password=" + document.getElementById('password').value,
            success: (html, status) => {
                obj = JSON.parse(html);
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
    }else{
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
            obj = JSON.parse(html);
            changeLoginInfos(obj);
            closeFullscreen();
        },
        error: (result, status, error) => {

        }
    })
    event.preventDefault();
});
