import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = async (data: any[], title: string, fileName: string, companyName?: string) => {
  // Dynamically import jsPDF and autoTable to avoid SSR and module resolution issues
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();
  
  let currentY = 22;
  
  if (companyName) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), 14, currentY);
    currentY += 8;
  }

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, currentY);
  currentY += 8;
  
  // Add timestamp
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
  currentY += 10;

  // Filter data for the table
  const tableData = data.map(item => [
    item.s_no || '',
    item.rule_ref || '',
    item.requirements || '',
    item.ans || '',
    item.comments || ''
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S/No', 'Ref', 'Requirements', 'Answer', 'Comments']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 15 },
      4: { cellWidth: 40 }
    }
  });

  doc.save(`${fileName}.pdf`);
};
export const exportOverallToPDF = async (data: any[], title: string, fileName: string, companyName?: string) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();
  
  let currentY = 22;
  
  if (companyName) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName.toUpperCase(), 14, currentY);
    currentY += 8;
  }

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
  currentY += 10;

  const categories = Array.from(new Set(data.map(item => item.categoryName || 'General')));

  categories.forEach(category => {
    // Add Category Header
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(category.toUpperCase(), 14, currentY);
    currentY += 6;

    const catData = data.filter(item => (item.categoryName || 'General') === category);
    const tableData = catData.map(item => [
      item.s_no || '',
      item.rule_ref || '',
      item.requirements || '',
      item.ans || '',
      item.comments || ''
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['S/No', 'Ref', 'Requirements', 'Answer', 'Comments']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 15 },
        4: { cellWidth: 40 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  });

  doc.save(`${fileName}.pdf`);
};

export const exportOverallToExcel = (data: any[], fileName: string) => {
  const categories = Array.from(new Set(data.map(item => item.categoryName || 'General')));
  const workbook = XLSX.utils.book_new();

  categories.forEach(category => {
    const catData = data.filter(item => (item.categoryName || 'General') === category);
    const formattedData = catData.map(item => ({
      'S/No': item.s_no || '',
      'Ref': item.rule_ref || '',
      'Requirements': item.requirements || '',
      'Answer': item.ans || '',
      'Comments': item.comments || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    // Excel sheet names cannot exceed 31 characters
    const sheetName = category.substring(0, 31).replace(/[\\/*?:\[\]]/g, '');
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet');
  });

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
