// For every field where the learner types an answer: the phone keyboard must not fix the spelling,
// suggest words or capitalise, or the exercise tests the keyboard instead of the learner.
// Chrome on Android also asks the keyboard to hide its suggestion strip when these are off.
export const noAutocorrect = { autoComplete: 'off', autoCorrect: 'off', autoCapitalize: 'off', spellCheck: false } as const
