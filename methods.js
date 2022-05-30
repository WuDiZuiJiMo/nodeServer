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

// 财务统计
function exportMoneyExcel() {
    const data2021 = [
        {
            '月份':'2021.01',
            '房贷':'0',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.02',
            '房贷':'0',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'2300',
            '总计2':'',
            '备注2':'1.2300 芸转账',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.03',
            '房贷':'0',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1495',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'32',
            '总计2':'',
            '备注2':'1.32 招银开鑫宝A',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.04',
            '房贷':'0',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1257',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.05',
            '房贷':'1100',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1626',
            '芸衣食住行':'4000',
            '崽崽':'934',
            '其他':'2000',
            '总计':'',
            '备注':'1.2000 买空调\n2.4000 芸零花钱\n3.571936 买房\n4.934 金坛第二人民医院',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'26',
            '总计2':'',
            '备注2':'1.26 招银开鑫宝B',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.06',
            '房贷':'1100',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'2000',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'1.2000 芸零花钱',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.07',
            '房贷':'3789',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'3000',
            '崽崽':'1000',
            '其他':'0',
            '总计':'',
            '备注':'1.3000 芸零花钱\n2.1000 B超',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.08',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'4000',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'1.4000 芸零花钱',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.09',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'5000',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'1.5000 芸零花钱',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.10',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'10000',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'1.10000 给芸报销',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.11',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2021.12',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'0',
            '我衣食住行':'1500',
            '芸衣食住行':'1500',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'1.1500 芸零花钱',
            '明细出处':'1.招商\n2.江南',
            '我的工资':'',
            '其他收入':'0',
            '总计2':'',
            '备注2':'',
            '明细出处2':'1.招商\n2.工商',
        },
    ]
    const data2022 = [
        {
            '月份':'2022.01',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'1000',
            '我衣食住行':'1001',
            '芸衣食住行':'5000',
            '崽崽':'1702',
            '其他':'400',
            '总计':'',
            '备注':'1.5000 支付宝转给芸报销各项支出\n2.1702 京东奶粉\n3.400 元旦红包爸妈各200',
            '明细出处':'1.招商\n2.江南&信用',
            '我的工资':'',
            '其他收入':'15000',
            '总计2':'',
            '备注2':'1.15000 芸上交',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2022.02',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'1000',
            '我衣食住行':'1987',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'1600',
            '总计':'',
            '备注':'1.498 刘中连超市2022.1.31\n2.1600 陈爸爸手机',
            '明细出处':'1.招商\n2.江南&信用',
            '我的工资':'',
            '其他收入':'15000',
            '总计2':'',
            '备注2':'1.15000 芸上交',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2022.03',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'1000',
            '我衣食住行':'1452',
            '芸衣食住行':'800',
            '崽崽':'1697',
            '其他':'0',
            '总计':'',
            '备注':'1.1697 京东奶粉\n2.800 给芸报销',
            '明细出处':'1.招商\n2.江南&信用',
            '我的工资':'',
            '其他收入':'15000',
            '总计2':'',
            '备注2':'1.15000 芸上交',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2022.04',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'1000',
            '我衣食住行':'1599',
            '芸衣食住行':'3000',
            '崽崽':'0',
            '其他':'1358',
            '总计':'',
            '备注':'1.500 妈妈生日红包\n2.858 奶奶疗养费\n3.3000 芸零花钱',
            '明细出处':'1.招商\n2.江南&信用',
            '我的工资':'',
            '其他收入':'15000',
            '总计2':'',
            '备注2':'1.15000 芸上交',
            '明细出处2':'1.招商\n2.工商',
        },
        {
            '月份':'2022.05',
            '房贷':'5134',
            '我的房租':'1150',
            '家用补贴':'1000',
            '我衣食住行':'961',
            '芸衣食住行':'0',
            '崽崽':'0',
            '其他':'0',
            '总计':'',
            '备注':'',
            '明细出处':'1.招商\n2.江南&信用',
            '我的工资':'',
            '其他收入':'15000',
            '总计2':'',
            '备注2':'1.15000 芸上交',
            '明细出处2':'1.招商\n2.工商',
        }
    ]

    // 输出
    writeExcel('./output/财务表.xlsx', data2022)
}

module.exports = {
    getExcelFirstData,
    writeExcel,
    rideExcelData,
    filterExcelData
}
