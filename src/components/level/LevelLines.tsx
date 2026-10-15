// A text of the level check, line by line. A line that starts with a speaker's name and a colon ("A: ...", "Maya: ...") is a
// line of a conversation: the name is bold and every speaker starts on a new line.
const SPEAKER = /^([A-Z][A-Za-z.]*(?: [A-Z][a-z]+)?): (.*)$/

export function LevelLines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, index) => {
        const speaker = SPEAKER.exec(line)
        return speaker ? (
          <span className="level-line level-line--speaker" key={index}>
            <strong>{speaker[1]}:</strong> {speaker[2]}
          </span>
        ) : (
          <span className="level-line" key={index}>
            {line}
          </span>
        )
      })}
    </>
  )
}
