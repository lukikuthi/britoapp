const xlsx = require('xlsx');

function ler(file) {
  console.log(`\n--- LENDO ${file} ---`);
  try {
    const workbook = xlsx.readFile(file);
    workbook.SheetNames.forEach(sheetName => {
      console.log(`\nSHEET: ${sheetName}`);
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
      for (let i = 0; i < Math.min(10, json.length); i++) {
        console.log(`Row ${i}: `, JSON.stringify(json[i]));
      }
    });
  } catch (e) {
    console.error(`Erro ao ler ${file}:`, e.message);
  }
}

ler('planilhas/Pedido de compras.xlsx');
ler('planilhas/Controle de Compras.xlsx');

ler('planilhas/Pedido de compras.xlsx');
ler('planilhas/Controle de Compras.xlsx');
