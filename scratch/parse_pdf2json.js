const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const text = pdfParser.getRawTextContent();
    console.log("=== RAW TEXT ===");
    console.log(text);
    fs.writeFileSync('scratch/cv_extracted.txt', text);
});

pdfParser.loadPDF("public/osmanCV.pdf");
