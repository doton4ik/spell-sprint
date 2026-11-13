/// <reference types="vite/client" />

// The two parts of the word list, cut by the build (libraryCsvParts in vite.config.ts, data/libraryCsvParts.ts)
declare module '*.csv?core' {
  const text: string
  export default text
}
declare module '*.csv?texts' {
  const text: string
  export default text
}
