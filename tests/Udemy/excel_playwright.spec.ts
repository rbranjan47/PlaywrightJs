import ExcelJS from 'exceljs'


async function readExcel() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("download.xlsx");
    const worksheet = workbook.getWorksheet("Sheet1");

    if (!worksheet) {
        throw new Error('Worksheet "Sheet1" not found in download.xlsx');
    }

    worksheet.eachRow(function (row: ExcelJS.Row, rowNumber: number) {
        row.eachCell(function (cell: ExcelJS.Cell, cellNumber: number) {
            console.log(
                'Row ' + rowNumber + ' cell ' + cellNumber + ' = ' + cell.value
            );
        });
    })
}

readExcel();