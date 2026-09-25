import { diffStrings, type EditOp } from '../../services/spellDiff'
import './answer-diff.css'

export type Segment = { char: string; kind: 'same' | 'bad' | 'fix' | 'swap' | 'gap' }

// Turns the edit operations into two coloured letter rows: what the learner wrote, and the correct word.
export function buildSegments(expected: string, submitted: string, ops: EditOp[]) {
  const expectedKinds = new Map<number, Segment['kind']>()
  const submittedKinds = new Map<number, Segment['kind']>()
  const gapsBefore = new Map<number, number>()
  for (const op of ops) {
    if (op.type === 'delete') { expectedKinds.set(op.expectedIndex, 'fix'); gapsBefore.set(op.submittedIndex, (gapsBefore.get(op.submittedIndex) ?? 0) + 1) }
    if (op.type === 'insert') submittedKinds.set(op.submittedIndex, 'bad')
    if (op.type === 'substitute') { expectedKinds.set(op.expectedIndex, 'fix'); submittedKinds.set(op.submittedIndex, 'bad') }
    if (op.type === 'transpose') {
      for (const offset of [0, 1]) { expectedKinds.set(op.expectedIndex + offset, 'swap'); submittedKinds.set(op.submittedIndex + offset, 'swap') }
    }
  }
  const expectedChars = Array.from(expected).map((char, index): Segment => ({ char, kind: expectedKinds.get(index) ?? 'same' }))
  const submittedChars: Segment[] = []
  Array.from(submitted).forEach((char, index) => {
    for (let gap = 0; gap < (gapsBefore.get(index) ?? 0); gap += 1) submittedChars.push({ char: '_', kind: 'gap' })
    submittedChars.push({ char, kind: submittedKinds.get(index) ?? 'same' })
  })
  for (let gap = 0; gap < (gapsBefore.get(Array.from(submitted).length) ?? 0); gap += 1) submittedChars.push({ char: '_', kind: 'gap' })
  return { expectedChars, submittedChars }
}

export function Letters({ segments, small }: { segments: Segment[]; small?: boolean }) {
  return <span className={`diff-word${small ? ' diff-word--small' : ''}`}>{segments.map((segment, index) => <span className={`diff-char diff-char--${segment.kind}`} key={index}>{segment.char}</span>)}</span>
}

// Compact "wrong → right" with the mistaken letters marked. Answers that share almost nothing with
// the correct one (a different word) are shown plainly, since letter colours would only be noise.
export function AnswerDiff({ expected, submitted, show = 'both' }: { expected: string; submitted: string; show?: 'both' | 'submitted' }) {
  const a = expected.trim().toLocaleLowerCase()
  const b = submitted.trim().toLocaleLowerCase()
  const { distance, ops } = diffStrings(a, b)
  if (!b || distance > Math.max(2, Math.ceil(a.length / 2))) {
    return show === 'both' ? <span className="answer-diff"><s>{submitted || 'Skipped'}</s> → <strong>{expected}</strong></span> : <s>{submitted || 'Skipped'}</s>
  }
  const { expectedChars, submittedChars } = buildSegments(a, b, ops)
  return (
    <span className="answer-diff">
      <Letters segments={submittedChars} small />
      {show === 'both' ? <><span className="answer-diff__arrow">→</span><Letters segments={expectedChars} small /></> : null}
    </span>
  )
}
