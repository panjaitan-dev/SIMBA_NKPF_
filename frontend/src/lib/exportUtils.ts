/**
 * exportUtils.ts — Utilitas Client-Side Export File Nyata
 * Mendukung download berkas CSV berstandar UTF-8 BOM (kompatibel penuh dengan Microsoft Excel & Google Sheets)
 */

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  // \uFEFF adalah UTF-8 Byte Order Mark agar Microsoft Excel membaca encoding karakter dengan benar
  const csvRows = [
    headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ]

  const csvString = '\uFEFF' + csvRows.join('\r\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}
