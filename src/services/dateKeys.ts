// Everything here works on the learner's local calendar day (not UTC), so a session at 1 a.m.
// counts for the day the learner is actually living in.
export function localDayKey(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
