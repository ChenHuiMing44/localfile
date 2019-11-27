const fs = require("fs");
const http = require("http");
const xmlParse = require("xml2json");

function fileReader() {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "/Users/huimingchen/Desktop/DeviceCheck2.xml",
      "utf-8",
      function(error, data) {
        if (error) {
          console.log("读取文件失败,内容是" + error.message);
          reject({ type: "error", content: error });
        } else {
          const jsonData = xml2json(data);
          if (jsonData) {
            resolve({ type: "success", content: jsonData });
          } else {
            reject({ type: "error" });
          }
        }
      }
    );
  });
}

function xml2json(xml) {
  try {
    return JSON.parse(xmlParse.toJson(xml));
  } catch (e) {}
  return "";
}

http
  .createServer(function(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    // 允许GET、POST、DELETE请求
    // response.setHeader('Access-Control-Allow-Methods:', 'GET, POST, DELETE');
    // 允许请求携带请求头X-TOKEN
    // response.setHeader('Access-Control-Allow-Headers:', 'X-TOKEN');

    console.log("request come", request.url);
    if (request.url === "/file") {
      fileReader()
        .then(res => {
          response.end(JSON.stringify(res));
        })
        .catch(err => {
          response.end(JSON.stringify(err));
        });
    } else if (request.url === "/" || request.url === "/index") {
      response.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("./index.html", function(err, data) {
        if (err) console.log("对不起，您所访问的路径出错");
        else {
          response.end(data);
        }
      });
    } else {
      const pathList = request.url.split(/[\.\/]/);
      if (pathList && pathList.length) {
        if (pathList[pathList.length - 1] === "css") {
          response.writeHead(200, { "Content-Type": "text/css" });
        }
      }
      fs.readFile("." + request.url, function(err, data) {
        if (err) {
          console.log("请求静态资源出错");
        } else {
          response.end(data);
        }
      });
    }
  })
  .listen(3004);

//
// const http = require('http')
// var querystring=require('querystring');
//
// http.createServer(function(req,res){
//   var postData='';
//   req.setEncoding('utf8');
//
//   req.on('data',function(chunk){
//     postData+=chunk;
//   });
//
//   req.on('end',function(){
//     res.end(postData+"hehe");
//   });
// }).listen(3002);
