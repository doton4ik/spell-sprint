import type { DiagnosticResult } from '../types/diagnostic'

const KEY = 'spell-sprint.diagnostic-result'

export function loadDiagnosticResult(): DiagnosticResult | null {
  try {
    const value = window.localStorage.getItem(KEY)
    return value ? JSON.parse(value) as DiagnosticResult : null
  } catch {
    return null
  }
}

export function saveDiagnosticResult(result: DiagnosticResult) {
  window.localStorage.setItem(KEY, JSON.stringify(result))
}
