import { diffWords } from '../../services/sentenceDiff'

// What you wrote and what it should be, word by word: the words that differ are marked, the rest is left alone.
export function SentenceDiff({ expected, submitted }: { expected: string; submitted: string }) {
  const { expected: right, given } = diffWords(expected, submitted)
  return (
    <div className="sentence-diff">
      <p>
        <span>You wrote</span>
        {given.length ? (
          given.map((word, index) => (
            <span className={word.same ? undefined : 'sentence-diff__wrong'} key={index}>
              {word.text}{' '}
            </span>
          ))
        ) : (
          <em>nothing</em>
        )}
      </p>
      <p>
        <span>Correct</span>
        {right.map((word, index) => (
          <span className={word.same ? undefined : 'sentence-diff__missing'} key={index}>
            {word.text}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}
