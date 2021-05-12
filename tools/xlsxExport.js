const xlsx = require('xlsx')
const path = require('path')

exports.exportExcel = function (data, workSheetColumnNames, workSheetName, filePath ) {
    const workBook = xlsx.utils.book_new();

    const workSheetData = [
        workSheetColumnNames,
        ... data
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath))
}

exports.exportCitizensToExcel = function (dataArray, workSheetColumnNames, workSheetName, filePath) {
    const data = dataArray.map(item => {
        return [item.codeReferral, item.firstName, item.lastName, item.gender, item.email,  item.phone, item.date, ]
    })

    this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}


exports.exportTransactionsToExcel = function (dataArray, workSheetColumnNames, workSheetName, filePath) {
    const data = dataArray.map(item => {
        return [item.userId, item.type, item.firstName, item.lastName, item.email,  item.clv, item.usd,  item.price, item.date]
    })

    this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}