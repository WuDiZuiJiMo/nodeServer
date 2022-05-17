const fs = require('fs')
const xlsx = require('xlsx')

// 获取excel第一个表格的数据
function getExcelFirstData(filePath) {
    let wookBook = xlsx.readFile(filePath)
    let name = wookBook.SheetNames[0]
    let sheet = wookBook.Sheets[name]
    let data = xlsx.utils.sheet_to_json(sheet)
    return data
}
// 输出excel文件
function writeExcel(filePath, list, sheetName = 'sheet1') {
    const workBook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workBook, xlsx.utils.json_to_sheet(list), sheetName)
    xlsx.writeFile(workBook, filePath)
}


// 文件去重
function rideExcelData(filePath1 = './input/1.xlsx', filePath2 = './input/2.xlsx', key = '关键词') {
    console.log('开始进行数据去重...');
    // 获取第一个表格
    let data1 = getExcelFirstData(filePath1)
    // 获取第二个表格
    let data2 = getExcelFirstData(filePath2)
    //
    let templist = [] // 重复数据
    data1.forEach((item, iloop) => {
        for (let i = 0; i < data2.length; i++) {
            let temp1 = String(item[key]).toLowerCase()
            let temp2 = String(data2[i][key]).toLowerCase()
            if (temp1 == temp2) {
                templist.push(item[key])
                break
            }
        }
    })
    // data1去除重复
    let dataFilter1 = []
    data1.forEach((item, iloop) => {
        let temp = String(item[key]).toLowerCase()
        if (templist.indexOf(temp) == -1) {
            dataFilter1.push(item)
        }
    })
    // data2去除重复
    let dataFilter2 = []
    data2.forEach((item, iloop) => {
        let temp = String(item[key]).toLowerCase()
        if (templist.indexOf(temp) == -1) {
            dataFilter2.push(item)
        }
    })

    // 输出
    writeExcel('./output/表2去重.xlsx', dataFilter2)
    writeExcel('./output/交集取反.xlsx', dataFilter1.concat(dataFilter2))

    console.log('数据去重成功！');
    console.log('');
}
// 文件过滤
function filterExcelData(params, filePath = './input/待过滤.xlsx', key = '关键词') {
    let data = getExcelFirstData(filePath) // 待过滤的表数据

    console.log('开始进行数据过滤...');
    console.log('correctWords:', params.correctWords);
    console.log('errWords:', params.errWords);

    let correctWords = params.correctWords != '' ?
        params.correctWords.split(',').map(item => String(item).toLowerCase())
        : []
    let errWords = params.errWords != '' ?
        params.errWords.split(',').map(item => String(item).toLowerCase())
        : []
    let resdata = data.filter((item, iloop) => {
        let tempdata = String(item[key]).toLowerCase()
        let right = correctWords.find(item2 => tempdata.indexOf(item2) != -1)
        let err = errWords.find(item2 => tempdata.indexOf(item2) != -1)
        if ((correctWords.length == 0 || right != undefined) && err == undefined) {
            return true
        } else {
            return false
        }
    })
    // 输出
    writeExcel('./output/过滤表.xlsx', resdata)

    console.log('数据过滤成功！');
    console.log('');
}

module.exports = {
    getExcelFirstData,
    writeExcel,
    rideExcelData,
    filterExcelData
}