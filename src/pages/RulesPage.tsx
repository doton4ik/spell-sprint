import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { RuleCard } from '../components/rules/RuleCard'
import { RulePracticePanel } from '../components/rules/RulePracticePanel'
import { ruleCategories, ruleTypeLabels } from '../data/ruleCategories'
import { getAllUserRuleProgress } from '../services/rulePracticeService'
import { consumePendingRuleFocus, createPersonalRule, getUnclassifiedMistakes, getVisibleRules, reclassifyMistakeWithRule, type PersonalRuleDraft } from '../services/rulesService'
import type { MistakeEvent, Rule, RuleType, UserRuleProgress } from '../types/rules'
import './learning.css'
import './rules.css'

// One unclassified mistake with its two ways out: attach it to a rule that already exists, or
// start a new private rule from it.
function UnclassifiedItem({ mistake, rules, onCreate, onLinked }: { mistake: MistakeEvent; rules: Rule[]; onCreate: (mistake: MistakeEvent) => void; onLinked: () => Promise<void> }) {
  const [ruleId, setRuleId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function link() {
    const rule = rules.find((item) => item.id === ruleId)
    if (!rule) return
    setBusy(true); setError('')
    try {
      await reclassifyMistakeWithRule(mistake, rule.id, { linkWord: rule.source === 'personal' })
      await onLinked()
    } catch (linkError) {
      setError(linkError instanceof Error ? linkError.message : 'Could not link this mistake.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rule-unclassified__item">
      <div className="rule-unclassified__main">
        <p><s>{mistake.userAnswer || 'Skipped'}</s> <Icon name="arrow" size={13} /> <strong>{mistake.correctAnswer}</strong></p>
        {error ? <small className="rule-unclassified__error">{error}</small> : null}
      </div>
      <div className="rule-unclassified__actions">
        <select value={ruleId} onChange={(event) => setRuleId(event.target.value)} aria-label="Link to an existing rule">
          <option value="">Link to a rule…</option>
          {rules.map((rule) => <option value={rule.id} key={rule.id}>{rule.title}</option>)}
        </select>
        <button className="quiet-action" type="button" disabled={!ruleId || busy} onClick={link}>{busy ? 'Linking…' : 'Link'}</button>
        <button className="quiet-action" type="button" onClick={() => onCreate(mistake)}><Icon name="plus" size={13} /> New rule</button>
      </div>
    </div>
  )
}

const emptyDraft: PersonalRuleDraft = { title: '', category: ruleCategories[0].slug, ruleType: 'language_rule', shortExplanation: '', wrongExample: '', correctExample: '' }

export function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [unclassified, setUnclassified] = useState<MistakeEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<'All' | string>('All')
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState<PersonalRuleDraft>(emptyDraft)
  const [linkingMistake, setLinkingMistake] = useState<MistakeEvent | null>(null)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [focusedRuleId, setFocusedRuleId] = useState<string | null>(null)
  const [openRuleId, setOpenRuleId] = useState<string | null>(null)
  const [showUnclassified, setShowUnclassified] = useState(false)
  const [progressByRule, setProgressByRule] = useState<Map<string, UserRuleProgress>>(new Map())

  async function refresh() {
    setLoading(true)
    const [ruleRows, unclassifiedRows, progressRows] = await Promise.all([getVisibleRules(), getUnclassifiedMistakes(), getAllUserRuleProgress().catch(() => [] as UserRuleProgress[])])
    setRules(ruleRows); setUnclassified(unclassifiedRows); setProgressByRule(new Map(progressRows.map((row) => [row.ruleId, row]))); setLoading(false)
    return ruleRows
  }

  function updateProgress(progress: UserRuleProgress) {
    setProgressByRule((current) => new Map(current).set(progress.ruleId, progress))
  }

  useEffect(() => {
    void refresh().then((ruleRows) => {
      // Item: a word in Libraries can send the learner straight to its rule. Jump to the right
      // category and let RuleCard scroll itself into view once it has rendered.
      const focusId = consumePendingRuleFocus()
      if (!focusId) return
      const target = ruleRows.find((rule) => rule.id === focusId)
      if (target) { setCategory(target.category); setFocusedRuleId(target.id); setOpenRuleId(target.id) }
    })
  }, [])

  const rulesById = useMemo(() => new Map(rules.map((rule) => [rule.id, rule])), [rules])
  const categoryCount = (slug: string) => rules.filter((rule) => rule.category === slug).length
  // Only categories that have rules get a tab, so the row stays short; the create form still offers all of them.
  const usedCategories = ruleCategories.filter((item) => categoryCount(item.slug) > 0)
  // Rules that still need work come first (critical, then practice, then stable), the rest A-Z.
  const attention = (rule: Rule) => {
    const progress = progressByRule.get(rule.id)
    if (!progress || progress.status === 'mastered' || progress.status === 'archived') return 3
    return { critical: 0, practice: 1, stable: 2 }[progress.priority]
  }
  const visibleRules = (category === 'All' ? rules : rules.filter((rule) => rule.category === category)).slice().sort((a, b) => attention(a) - attention(b) || a.title.localeCompare(b.title))
  const needRepeating = rules.filter((rule) => attention(rule) < 3).length

  function openCreateForm(fromMistake?: MistakeEvent) {
    setLinkingMistake(fromMistake ?? null)
    setDraft({ ...emptyDraft, wrongExample: fromMistake?.userAnswer ?? '', correctExample: fromMistake?.correctAnswer ?? '', title: fromMistake?.correctAnswer ? `Remember: ${fromMistake.correctAnswer}` : '' })
    setFormError(''); setShowForm(true)
  }

  async function submitDraft(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim() || !draft.shortExplanation.trim()) { setFormError('Title and a short explanation are required.'); return }
    setCreating(true); setFormError('')
    try {
      const rule = await createPersonalRule(draft)
      if (linkingMistake) await reclassifyMistakeWithRule(linkingMistake, rule.id)
      setShowForm(false); setLinkingMistake(null)
      await refresh()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not create this rule.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="learning-page" id="rules">
      <header className="learning-header">
        <div><p className="eyebrow">Reference library</p><h1>Rules that stick</h1><p>{needRepeating ? `${needRepeating} rule${needRepeating === 1 ? '' : 's'} to repeat. ` : ''}Practice below, or open a rule to study it.</p></div>
        <button className="outline-action" type="button" onClick={() => openCreateForm()}><Icon name="plus" size={17} /> New personal rule</button>
      </header>

      <RulePracticePanel onProgress={updateProgress} />

      <div className="rule-filter filter-tabs">
        <button type="button" className={category === 'All' ? 'filter-tabs__active' : ''} onClick={() => setCategory('All')}>All ({rules.length})</button>
        {usedCategories.map((item) => (
          <button type="button" key={item.slug} className={category === item.slug ? 'filter-tabs__active' : ''} onClick={() => setCategory(item.slug)}>{item.label} ({categoryCount(item.slug)})</button>
        ))}
      </div>

      {showForm ? (
        <section className="rule-create-form">
          <div className="rule-create-form__top">
            <h2>{linkingMistake ? 'Create a rule for this mistake' : 'New personal rule'}</h2>
            <button className="quiet-action" type="button" onClick={() => { setShowForm(false); setLinkingMistake(null) }}>Cancel</button>
          </div>
          {linkingMistake ? <p className="rule-create-form__hint"><s>{linkingMistake.userAnswer || 'Skipped'}</s> <Icon name="arrow" size={13} /> <strong>{linkingMistake.correctAnswer}</strong> — this mistake will be linked to the new rule.</p> : null}
          <form onSubmit={submitDraft}>
            <label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Lose vs loose" /></label>
            <div className="rule-create-form__row">
              <label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{ruleCategories.map((item) => <option value={item.slug} key={item.slug}>{item.label}</option>)}</select></label>
              <label>Type<select value={draft.ruleType} onChange={(event) => setDraft({ ...draft, ruleType: event.target.value as RuleType })}>{Object.entries(ruleTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            </div>
            <label>Short explanation (English)<textarea value={draft.shortExplanation} onChange={(event) => setDraft({ ...draft, shortExplanation: event.target.value })} rows={2} placeholder="One or two sentences — this should be readable in under a minute." /></label>
            <div className="rule-create-form__row">
              <label>Wrong example<input value={draft.wrongExample} onChange={(event) => setDraft({ ...draft, wrongExample: event.target.value })} /></label>
              <label>Correct example<input value={draft.correctExample} onChange={(event) => setDraft({ ...draft, correctExample: event.target.value })} /></label>
            </div>
            {formError ? <p className="auth-message auth-message--error">{formError}</p> : null}
            <button className="check-button" type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create rule'} <Icon name="arrow" size={16} /></button>
          </form>
        </section>
      ) : null}

      {unclassified.length ? (
        <section className="rule-unclassified">
          <button className="rule-unclassified__toggle" type="button" onClick={() => setShowUnclassified(!showUnclassified)} aria-expanded={showUnclassified}>
            <span><strong>{unclassified.length} unclassified mistake{unclassified.length === 1 ? '' : 's'}</strong> — saved, but no rule matches yet</span>
            <span className={showUnclassified ? 'rule-unclassified__chevron rule-unclassified__chevron--open' : 'rule-unclassified__chevron'}><Icon name="chevron" size={16} /></span>
          </button>
          {showUnclassified ? (
            <div className="rule-unclassified__list">
              {unclassified.slice(0, 6).map((mistake) => <UnclassifiedItem mistake={mistake} rules={rules} onCreate={openCreateForm} onLinked={async () => { await refresh() }} key={mistake.id} />)}
            </div>
          ) : null}
        </section>
      ) : null}

      {loading ? null : visibleRules.length === 0 ? (
        <section className="empty-learning-state">
          <span><Icon name="rules" size={25} /></span><h2>No rules here yet.</h2>
          <p>Either pick another category, or add your own private rule for this one.</p>
          <button className="check-button" type="button" onClick={() => openCreateForm()}><Icon name="plus" size={17} /> New personal rule</button>
        </section>
      ) : (
        <section className="rules-grid rules-grid--compact">
          {visibleRules.map((rule) => (
            <RuleCard rule={rule} rulesById={rulesById} progress={progressByRule.get(rule.id) ?? null} expanded={openRuleId === rule.id} focused={rule.id === focusedRuleId}
              onToggle={() => setOpenRuleId(openRuleId === rule.id ? null : rule.id)} onProgressChange={updateProgress} key={rule.id} />
          ))}
        </section>
      )}
    </div>
  )
}
