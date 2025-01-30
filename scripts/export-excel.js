// Supondo que você já tenha os dados da planilha
const ws_data = [
    ['Data', 'Valor'],
    ['2023-01-01', 100],
    ['2023-01-02', 200]
  ];
  
  // Criando a planilha com SheetJS
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Notas Fiscais');
  
  // Gerando o arquivo no formato .xlsx
  const file = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
  // Convertendo para Blob
  const blob = new Blob([s2ab(file)], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Notas_Fiscais.xlsx';
  
  // Função para converter a string binária em ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  // link.click()
  