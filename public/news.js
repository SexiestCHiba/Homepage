class News{

    link = [
        {
            'link': '/public/une.xml',
        }
    ]

    constructor(){
        this.loadNews(this.link[0]['link']);
    }

    loadNews(index){
        $.ajax({
            url: this.link[index],
            dataType: 'xml',
            success  : function (data) {
                console.log(data);
                let content = data.childNodes[0].childNodes[0];
                console.log(content);
                content.childNodes.forEach((value, index) => {
                    if(value.nodeName === "title"){
                        this.link.title = value.childNodes[0].data;
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
                                    v.attributes.forEach((attributes) => {
                                        if(attributes.nodeName === "url"){
                                            article.media = attributes.nodeValue;
                                        }
                                    })
                                    break;
                            }
                        });
                        this.link[index].article = article;
                    }
                    console.log(this.link);
                });
            },
            error: () => {
                console.log('error');
            }
        });
    }
}

let news = new News();