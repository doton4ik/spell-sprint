import { useRef, useState } from 'react'
import { analyseCsv, commitCsvImport, undoCsvImport, type CsvPreview, type ImportBatch, type PreviewRow, type RowStatus } from '../../services/csvImport'
import { csvTemplate } from '../../services/libraryStorage'
import { Icon } from '../icons/Icon'

type ImportLibraryPanelProps = { onImported: () => void }
type Step = { kind: 'idle' } | { kind: 'preview'; preview: CsvPreview } | { kind: 'done'; batch: ImportBatch; preview: CsvPreview } | { kind: 'undone'; count: number }

const statusLabels: Record<RowStatus, string> = { ready: 'Ready', duplicate: 'Already in your libraries', 'duplicate-in-file': 'Repeated in this file', conflict: 'word_id conflict', invalid: 'Cannot import' }
const PROBLEM_ROWS_SHOWN = 12

// Choose a file → see exactly what will happen → import only the valid rows (or cancel) → undo if needed.
export function ImportLibraryPanel({ onImported }: ImportLibraryPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>({ kind: 'idle' })

  async function handleFile(file?: File) {
    if (!file) return
    setStep({ kind: 'preview', preview: analyseCsv(await file.text(), file.name) })
    if (fileInput.current) fileInput.current.value = '' // choosing the same file again should re-run the check
  }

  function confirm(preview: CsvPreview) {
    const batch = commitCsvImport(preview)
    setStep({ kind: 'done', batch, preview })
    onImported()
  }

  function undo(batch: ImportBatch) {
    undoCsvImport(batch)
    setStep({ kind: 'undone', count: batch.imported })
    onImported()
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = 'spell-sprint-library-template.csv'; link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="import-panel">
      <div className="import-panel__copy"><span><Icon name="library" size={17} /> Add your own words</span><h2>Import a word library</h2><p>CSV with at least <code>word</code> and <code>translation</code> columns. You will see a check of every row before anything is saved.</p></div>
      <div className="import-panel__actions"><input ref={fileInput} type="file" accept=".csv,text/csv" onChange={(event) => void handleFile(event.target.files?.[0])} hidden /><button className="check-button" type="button" onClick={() => fileInput.current?.click()}>Choose CSV file <Icon name="arrow" size={17} /></button><button className="template-button" type="button" onClick={downloadTemplate}>CSV template</button></div>

      {step.kind === 'preview' ? <PreviewView preview={step.preview} onConfirm={() => confirm(step.preview)} onCancel={() => setStep({ kind: 'idle' })} /> : null}

      {step.kind === 'done' ? (
        <div className="import-report import-report--success" role="status">
          <div><strong>{step.batch.imported} word{step.batch.imported === 1 ? '' : 's'} imported</strong><span>into {step.batch.libraries.join(', ')}{step.preview.totalRows - step.batch.imported ? ` · ${step.preview.totalRows - step.batch.imported} row${step.preview.totalRows - step.batch.imported === 1 ? '' : 's'} skipped` : ''}</span></div>
          <button className="quiet-button" type="button" onClick={() => undo(step.batch)}><Icon name="refresh" size={15} /> Undo this import</button>
        </div>
      ) : null}
      {step.kind === 'undone' ? <div className="import-report" role="status"><div><strong>Import undone</strong><span>{step.count} word{step.count === 1 ? '' : 's'} removed. Nothing else was changed.</span></div></div> : null}
    </section>
  )
}

function PreviewView({ preview, onConfirm, onCancel }: { preview: CsvPreview; onConfirm: () => void; onCancel: () => void }) {
  if (preview.fatal) {
    return <div className="import-report import-report--error" role="alert"><div><strong>This file cannot be imported</strong><span>{preview.fatal}</span></div><button className="quiet-button" type="button" onClick={onCancel}>Close</button></div>
  }
  const { counts } = preview
  const skipped = preview.totalRows - counts.ready
  const problems = preview.rows.filter((row) => row.status !== 'ready' || row.warnings.length)
  const sample = preview.rows.filter((row) => row.status === 'ready').slice(0, 5)

  return (
    <div className="import-preview" role="region" aria-label="Import check">
      <div className="import-preview__head"><strong>Check before importing</strong><span>{preview.fileName} · {preview.totalRows} row{preview.totalRows === 1 ? '' : 's'}</span></div>

      <div className="import-preview__counts">
        <span className="import-count import-count--ready"><b>{counts.ready}</b> ready</span>
        {counts.duplicate ? <span className="import-count"><b>{counts.duplicate}</b> already in your libraries</span> : null}
        {counts['duplicate-in-file'] ? <span className="import-count"><b>{counts['duplicate-in-file']}</b> repeated in file</span> : null}
        {counts.conflict ? <span className="import-count import-count--bad"><b>{counts.conflict}</b> id conflicts</span> : null}
        {counts.invalid ? <span className="import-count import-count--bad"><b>{counts.invalid}</b> cannot import</span> : null}
        {counts.warnings ? <span className="import-count import-count--warn"><b>{counts.warnings}</b> with warnings</span> : null}
      </div>

      {preview.libraries.length ? <p className="import-preview__line"><b>Libraries:</b> {preview.libraries.map((library) => `${library.name} (${library.isNew ? 'new' : 'existing'}, +${library.words})`).join(' · ')}</p> : null}
      {preview.newTopics.length ? <p className="import-preview__line"><b>New topics:</b> {preview.newTopics.join(', ')}</p> : null}
      {preview.newSubtopics.length ? <p className="import-preview__line"><b>New subtopics:</b> {preview.newSubtopics.slice(0, 8).join(', ')}{preview.newSubtopics.length > 8 ? ` +${preview.newSubtopics.length - 8} more` : ''}</p> : null}
      {preview.ignoredColumns.length ? <p className="import-preview__line"><b>Ignored columns:</b> {preview.ignoredColumns.join(', ')}</p> : null}

      {sample.length ? <div className="import-preview__sample"><span>First words</span><p>{sample.map((row) => `${row.word} — ${row.translation}`).join(' · ')}</p></div> : null}

      {problems.length ? (
        <div className="import-preview__problems">
          <span>Rows that need attention</span>
          <ul>{problems.slice(0, PROBLEM_ROWS_SHOWN).map((row) => <ProblemRow row={row} key={row.line} />)}</ul>
          {problems.length > PROBLEM_ROWS_SHOWN ? <small>…and {problems.length - PROBLEM_ROWS_SHOWN} more.</small> : null}
        </div>
      ) : null}

      <div className="import-preview__actions">
        <button className="check-button" type="button" disabled={!counts.ready} onClick={onConfirm}>{counts.ready ? `Import ${counts.ready} word${counts.ready === 1 ? '' : 's'}` : 'Nothing to import'}</button>
        <button className="quiet-button" type="button" onClick={onCancel}>Cancel</button>
        {counts.ready && skipped ? <small>{skipped} row{skipped === 1 ? '' : 's'} will be skipped. Rows with warnings are imported with the defaults shown.</small> : null}
      </div>
    </div>
  )
}

function ProblemRow({ row }: { row: PreviewRow }) {
  const bad = row.status !== 'ready'
  return (
    <li className={bad ? 'import-problem import-problem--skip' : 'import-problem import-problem--warn'}>
      <span className="import-problem__line">Row {row.line}</span>
      <span className="import-problem__word">{row.word || '—'}</span>
      <span className="import-problem__text">{bad ? `${statusLabels[row.status]}: ${row.issues.join('; ')}` : row.warnings.join('; ')}</span>
    </li>
  )
}
