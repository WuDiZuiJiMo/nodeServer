const express = require('express')
const bodyparser = require('body-parser')
const fs = require('fs')
const mysql = require('mysql')
const methods = require('./methods')

const app = express()

// npm install express body-parser fs mysql xlsx
// npm uninstall express body-parser fs mysql xlsx

// 文件数据去重
methods.rideExcelData()
// 文件数据过滤
// let param = {
//     correctWords: '',
//     errWords: ''
// }
// methods.filterExcelData(param)

// 挂载参数处理中间件
// extended:false表示使用系统模块querystring来处理 将淄川转成对象
app.use(bodyparser.urlencoded({ extended: false }))
// 挂载内置中间件处理静态文件
app.use(express.static('public'))

// 创建数据库链接对象
// const connect = mysql.createConnection({
//     host: 'xxx', // 数据库地址
//     user: 'xxx', // 账号
//     password: 'xxx', // 密码
//     database: 'xxx', // 库名
//     multipleStatements: true, // 允许执行多条语句
// })

// 处理请求头（跨域处理）
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    next();
});

// 登陆接口
app.post('/login', (req, res) => {
    let data = req.body
    console.log('data:', data);
    if (data.username == 'admin' && data.password == '123') {
        res.send({
            code: 0,
            codeDesc: 'succ'
        })
    } else {
        res.send({
            code: -1,
            codeDesc: 'fail'
        })
    }
})
// 读取json文件
app.get('/api/readJsonFile', (req, res) => {
    let data = req.body
    fs.readFile(__dirname + '/input/test.json', 'utf8', (err, data) => {
        if (err) { throw err }
        res.end(data)
    })
})
// 读取excel文件 xls\xlsx
app.get('/api/readExcelFile', (req, res) => {
    let data = methods.getExcelFirstData('./input/1.xlsx')
    res.send({
        data: data,
        code: 0,
        codeDesc: 'succ'
    })
})

// 数据去重
app.post('/api/rideData', (req, res) => {
    methods.rideExcelData()
    res.send({
        code: 0,
        codeDesc: 'succ'
    })
})
// 数据过滤
app.post('/api/filterData', (req, res) => {
    let data = req.body
    let param = {
        correctWords: data.correctWords || '',
        errWords: data.errWords || ''
    }
    methods.filterExcelData(param)
    res.send({
        code: 0,
        codeDesc: 'succ'
    })
})

// 创建服务
var server = app.listen(4000, () => {
    let host = server.address().address
    let port = server.address().port
    console.log('访问地址为：', host, port);
    console.log('');
})
