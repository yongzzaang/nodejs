var template = {
    HTML: function templateHTML(title, list, body) {
        return `
        <!doctype html>
        <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${body}
            </body>
        </html>
        `;
    },list: function templateList(results) {
    var list = `<ul>`;
    var i = 0
    while (i < results.length) {
        list = list + `<li><a href="/?id=${results[i].id}">${results[i].title}</a></li>`
        i = i + 1
    }
    var list = list + `</ul>`;
    return list;
    }
};
module.exports = template;