import { useEffect, useState } from 'react'
import { getAllRuleWordLinks, getVisibleRules } from '../../services/rulesService'
import type { Rule } from '../../types/rules'

// Every word's linked rules, keyed by wordId — loaded once so neither the search box nor the
// details view has to make one network call per word.
export function useWordRuleMap() {
  const [map, setMap] = useState<Map<string, Rule[]>>(new Map())
  useEffect(() => {
    let cancelled = false
    Promise.all([getVisibleRules(), getAllRuleWordLinks()]).then(([rules, links]) => {
      if (cancelled) return
      const rulesById = new Map(rules.map((rule) => [rule.id, rule]))
      const next = new Map<string, Rule[]>()
      for (const link of links) {
        const rule = rulesById.get(link.ruleId)
        if (!rule) continue
        next.set(link.wordId, [...(next.get(link.wordId) ?? []), rule])
      }
      setMap(next)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return map
}
