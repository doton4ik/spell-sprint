import { useRef, useState } from 'react'
import { csvTemplate, importCsvLibrary } from '../../services/libraryStorage'
import type { ImportReport } from '../../types/library'
import { Icon } from '../icons/Icon'

type ImportLibraryPanelProps = { onImported: () => void }

export function ImportLibraryPanel({ onImported }: ImportLibraryPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [report, setReport] = useState<ImportReport | null>(null)

  async function handleFile(file?: File) {
    if (!file) return
    const content = await file.text()
    if (!file.name.toLocaleLowerCase().endsWith('.csv')) { setReport({ libraryName: file.name, topic: 'Imported', imported: 0, skipped: 0, duplicateCount: 0, errorCount: 1, errors: ['Only CSV files can be imported.'] }); return }
    const nextReport = importCsvLibrary(content, file.name)
    setReport(nextReport)
    if (nextReport.imported) onImported()
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = 'spell-sprint-library-template.csv'; link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="import-panel">
      <div className="import-panel__copy"><span><Icon name="library" size={17} /> Add your own words</span><h2>Import a word library</h2><p>CSV only. Rows are checked by word_id, or by word, translation, and part of speech when no ID is supplied.</p></div>
      <div className="import-panel__actions"><input ref={fileInput} type="file" accept=".csv,text/csv" onChange={(event) => void handleFile(event.target.files?.[0])} hidden /><button className="check-button" type="button" onClick={() => fileInput.current?.click()}>Import CSV <Icon name="arrow" size={17} /></button><button className="template-button" type="button" onClick={downloadTemplate}>CSV template</button></div>
      {report ? <div className={`import-report${report.errorCount && !report.imported ? ' import-report--error' : ' import-report--success'}`} role="status"><div><strong>{report.imported} imported</strong><span>{report.duplicateCount} duplicates skipped · {report.errorCount} invalid rows · {report.libraryName}</span></div>{report.errors.length ? <ul>{report.errors.map((error) => <li key={error}>{error}</li>)}</ul> : <p>Import complete.</p>}</div> : null}
    </section>
  )
}
