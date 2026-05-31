import ExcelJS from 'exceljs';
import * as fs from 'fs';

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

            if (cell.value === 'Apple') {
                console.log('Apple Present');
                console.log('Row Number is :' + rowNumber);
                console.log('Column Number is :' + cellNumber);
            }
        });
    });
}

async function writeExcel() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("download.xlsx");          

    const worksheet = workbook.getWorksheet("Sheet1");
    if (!worksheet) {
        throw new Error('Worksheet "Sheet1" not found in download.xlsx');
    }

    const cell = worksheet.getCell(3, 2);
    cell.value = "Strawberry";

    await workbook.xlsx.writeFile("download_temp.xlsx");   
    fs.renameSync("download_temp.xlsx", "download.xlsx");   
    console.log("Write successful");
}

async function main() {
    await writeExcel();
    await readExcel();
}

main();