const PdfPrinter = require('pdfmake');
const ExcelJS = require('exceljs');
const path = require('path');

const fs = require('fs');

const fontsPath = path.join(__dirname, '..', 'public', 'fonts');
const fonts = {
  Roboto: {
    normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
    bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
    italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf')
  }
};

// Check if fonts exist, if not, use a fallback or warn
const fontsExist = fs.existsSync(fontsPath);
let printer;
if (fontsExist) {
  printer = new PdfPrinter(fonts);
} else {
  console.warn('Warning: Fonts not found at', fontsPath, '. PDF export might fail.');
}

exports.generateReportPDF = (report) => {
  const docDefinition = {
    content: [
      { text: 'Inspection Report', style: 'header' },
      { text: `Title: ${report.title}`, style: 'subheader' },
      { text: `Vessel: ${report.vessel.vesselName}`, margin: [0, 5] },
      { text: `Date: ${report.inspectionDate}`, margin: [0, 5] },
      { text: `Status: ${report.status}`, margin: [0, 5] },
      { text: 'Description:', margin: [0, 10, 0, 5], bold: true },
      { text: report.description },
      { text: `Inspector: ${report.creator.name}`, margin: [0, 20] }
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
    }
  };

  return printer.createPdfKitDocument(docDefinition);
};

exports.generateReportsExcel = async (reports) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inspection Reports');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Vessel', key: 'vessel', width: 20 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Inspector', key: 'inspector', width: 20 }
  ];

  reports.forEach(report => {
    worksheet.addRow({
      id: report.id,
      vessel: report.vessel.vesselName,
      title: report.title,
      date: report.inspectionDate,
      status: report.status,
      inspector: report.creator.name
    });
  });

  return workbook;
};
