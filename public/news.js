class News{

    link = [
        {
            'link': 'https://www.lemonde.fr/rss/une.xml',
            'article': []
        },
        {
            'link': 'https://www.lemonde.fr/pixels/rss_full.xml',
            'article': []
        }
    ]

    downloaded = 0;

    constructor(){
        this.link.forEach((value, index) => {
            this.loadNews(index);
        });
    }

    async loadNews(index){
        let obj = this;
        return new Promise((resolve, reject) => {
            let link = this.link;
            $.ajax({
                url: '/news',
                type: 'POST',
                dataType: 'html',
                data: 'link=' + this.link[index].link,
                success  : function (data) {
                    let parser = new DOMParser();
                    data = parser.parseFromString(data, "text/xml");
                    let content = data.childNodes[0].childNodes[0];
                    content.childNodes.forEach((value, i) => {
                        if(value.nodeName === "title"){
                            link[index].title = value.childNodes[0].data;
                        }
                        if(value.nodeName === "item"){
                            let article = {};
                            value.childNodes.forEach((v, i) => {
                                switch(v.nodeName){
                                    case 'title':
                                        article.title = v.textContent;
                                        break;
                                    case 'pubDate':
                                        article.date = v.childNodes[0].data;
                                        break;
                                    case 'description':
                                        article.description = v.textContent;
                                        break;
                                    case 'link':
                                        article.link = v.childNodes[0].data;
                                        break;
                                    case "media:content":
                                        article.media = v.attributes.getNamedItem('url').nodeValue;
                                        break;
                                }
                            });
                            link[index].article.push(article);
                        }
                        resolve();
                    });
                },
                error: (result, status, error) => {
                    console.warn(result, status, error);
                    link['err'] = error;
                    reject();
                }
            });
        }).then(() => {
            obj.downloaded++;
            obj.displayNews();
        }).catch(() => {
            obj.downloaded++;
        });
    }

    displayNews(){
        if(this.downloaded === this.link.length){
            this.link.forEach((value, index) => {
                if(value.title !== undefined && value.err == undefined){
                    $('#news').append('<h3 style="grid-column:span 2;">' + this.link[index].title + '</h3>');
                    this.link[index].article.forEach((value, index) => {
                        let date = new Date(value.date);
                        $('#news').append('<div class="news_content"><a href="' + value.link + '" rel="noopener" target="_blank"><h3>' + value.title + '</h3></a>' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + '<br /><img src="' + value.media + '"><p>' + value.description + '</p></div>');
                    });
                }
            });
        }
    }

    listNewsSource(){
        $('#news-list').html('');
        this.link.forEach((value, index) => {
            $('#news-list').append('<li>' + value.link + '</li>');
        });
    }
}
let news;
window.addEventListener('DOMContentLoaded', () => {
    news = new News();
});

document.querySelector('#news-reorganize').addEventListener('click', (e) => {
    startpage.displayFullscreen();
    news.listNewsSource();
    $('#fs-news-reorganize').css('display','block');
});

document.querySelector('#form-add-news').addEventListener('submit', (e) => {
    e.preventDefault();
});