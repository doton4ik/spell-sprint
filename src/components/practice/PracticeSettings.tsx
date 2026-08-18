import type { PracticeSettings as PracticeSettingsType } from '../../types/practice'
import { Icon } from '../icons/Icon'

type PracticeSettingsProps = {
  settings: PracticeSettingsType
  onChange: (settings: PracticeSettingsType) => void
}

const settingLabels: Array<{ key: 'showHints' | 'writeUntilCorrect' | 'allowSkip' | 'showRuleAfterMistake' | 'repeatDifficultItemLater'; label: string; detail: string }> = [
  { key: 'showHints', label: 'Show hints', detail: 'Reveal a short cue below each task.' },
  { key: 'writeUntilCorrect', label: 'Write until correct', detail: 'Stay on a task until your answer is correct.' },
  { key: 'allowSkip', label: 'Allow skip', detail: 'Let yourself move on without an answer.' },
  { key: 'showRuleAfterMistake', label: 'Show rule after mistake', detail: 'Display the related rule after an incorrect attempt.' },
  { key: 'repeatDifficultItemLater', label: 'Repeat difficult item later', detail: 'Add mistakes and skipped tasks to your review queue.' },
]

export function PracticeSettings({ settings, onChange }: PracticeSettingsProps) {
  return (
    <details className="practice-settings">
      <summary><Icon name="sliders" size={17} /> Session settings <span>⌄</span></summary>
      <div className="practice-settings__content">
        {settingLabels.map(({ key, label, detail }) => (
          <label className="settings-option" key={key}>
            <span><strong>{label}</strong><small>{detail}</small></span>
            <input type="checkbox" checked={settings[key]} onChange={(event) => onChange({ ...settings, [key]: event.target.checked })} />
          </label>
        ))}
      </div>
    </details>
  )
}
