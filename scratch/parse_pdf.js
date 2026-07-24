const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const parser = new PDFParse({ verbosity: 0 });

parser.load('public/osmanCV.pdf').then(async () => {
    const text = await parser.getText();
    console.log("=== CV TEXT START ===");
    console.log(text);
    console.log("=== CV TEXT END ===");
    fs.writeFileSync('scratch/cv_extracted.txt', JSON.stringify(text, null, 2));
}).catch(err => {
    console.error(err);
});
