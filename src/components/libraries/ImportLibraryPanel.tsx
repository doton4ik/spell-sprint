import { useRef, useState } from 'react'
import { csvTemplate, importCsvLibrary, importJsonLibrary } from '../../services/libraryStorage'
import type { ImportReport } from '../../types/library'
import { Icon } from '../icons/Icon'

type ImportLibraryPanelProps = { onImported: () => void }

export function ImportLibraryPanel({ onImported }: ImportLibraryPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [report, setReport] = useState<ImportReport | null>(null)

  async function handleFile(file?: File) {
    if (!file) return
    const content = await file.text()
    const nextReport = file.name.toLocaleLowerCase().endsWith('.json') ? importJsonLibrary(content) : importCsvLibrary(content, file.name)
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
      <div className="import-panel__copy"><span><Icon name="library" size={17} /> Add your own words</span><h2>Import a word library</h2><p>Use CSV or JSON. Existing words in the same topic are skipped automatically.</p></div>
      <div className="import-panel__actions"><input ref={fileInput} type="file" accept=".csv,.json,text/csv,application/json" onChange={(event) => void handleFile(event.target.files?.[0])} hidden /><button className="check-button" type="button" onClick={() => fileInput.current?.click()}>Choose file <Icon name="arrow" size={17} /></button><button className="template-button" type="button" onClick={downloadTemplate}>CSV template</button></div>
      {report ? <div className={`import-report${report.imported ? ' import-report--success' : ' import-report--error'}`} role="status"><div><strong>{report.imported} imported</strong><span>{report.skipped} skipped · {report.libraryName}</span></div>{report.errors.length ? <ul>{report.errors.map((error) => <li key={error}>{error}</li>)}</ul> : <p>Library added successfully.</p>}</div> : null}
    </section>
  )
}
