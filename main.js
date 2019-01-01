//ssh -i "aws_password.pem" ubuntu@ec2-54-180-69-133.ap-northeast-2.compute.amazonaws.com
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var part = require('./part.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');


var app = http.createServer(function(request, response) {
    console.log(request);
    console.log(response);
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function(err, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = part.list(filelist);
                var html = part.HTML(title, list, `            
                    <p><a href="/create">CREATE</a></p>
                    <h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(html);
            });
        } else { //id 값이 있을 때
            fs.readdir('./data', function(err, filelist) {
            var filteredId = path.parse(queryData.id).base            	    
                fs.readFile(`./data/${filteredId}`, 'utf-8', function(err, data) {
                	var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDes = sanitizeHtml(data);
                	var list = part.list(filelist);
                    var html = part.HTML(title, list, `
                        <p><a href="/update?id=${queryData.id}">UPDATE</a>
                        <a href="/delete?id=${queryData.id}">DELETE</a></p>
                        <h2>${sanitizedTitle}</h2>${sanitizedDes}`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        } 
    } else if(pathname === '/create'){
        fs.readdir('./data', function(err, filelist) {
                var title = 'WEB';
                var list = part.ist(filelist);
                var html = part.HTML(title, list, `<h2>${title}</h2>
                    <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p><textarea name="description" placeholder="description"></textarea></p>
                        <p><input type="submit"></p>
                    </form>`);
                response.writeHead(200);
                response.end(html);
            });
    } else if(pathname === '/create_process'){
         var body = '';
         request.on('data', function(data){
            body = body + data
         });
         request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./data/${title}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end('');
            });
        });
    } else if(pathname === '/update'){
        fs.readdir('./data', function(err, filelist) {  
            var filteredId = path.parse(queryData.id).base                
            fs.readFile(`./data/${filteredId}`, 'utf-8', function(err, data) {
                var title = queryData.id;
                var list = part.list(filelist);
                var html = part.HTML(title, list, `<h2>${title}</h2>
                    <form action="/update_process" method="post">
                        <p><input type="hidden" name="id" value="${title}"></p>
                        <p><input type="text" name="title" value="${title}"></p>
                        <p><textarea name="description">${data}</textarea></p>
                        <p><input type="submit"></p>
                    </form>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        var body = '';
         request.on('data', function(data){
            body = body + data
         });
         request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`, function(err){
                fs.writeFile(`./data/${title}`, description, 'utf-8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end('');
                })
            });
        });
    } else if(pathname === '/delete'){
        var body = '';
         request.on('data', function(data){
            body = body + data
         });
         request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(queryData.id).base
            fs.unlink(`./data/${filteredId}`, function(err) {
                response.writeHead(302, {Location: `/`});
                response.end(html);
            });
        });         
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000, function(){
    console.log('Connected')
});