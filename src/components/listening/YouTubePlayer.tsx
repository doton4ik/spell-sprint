import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// The YouTube player, driven through its IFrame API: it plays one line of a clip (from second `start` to `end`)
// and stops there. The no-cookie host is used, so nothing is set until a video is played.
type Player = {
  loadVideoById: (options: { videoId: string; startSeconds: number }) => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  setPlaybackRate: (rate: number) => void
  getCurrentTime: () => number
  unloadModule: (name: string) => void
  destroy: () => void
}
type YT = { Player: new (element: HTMLElement, options: object) => Player }
declare global {
  interface Window {
    YT?: YT
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiReady: Promise<YT> | null = null
function loadApi() {
  apiReady ??= new Promise<YT>((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT)
    window.onYouTubeIframeAPIReady = () => (window.YT ? resolve(window.YT) : reject(new Error('YouTube API missing')))
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = () => {
      apiReady = null // a later try may work
      reject(new Error('YouTube API blocked'))
    }
    document.head.append(script)
  })
  return apiReady
}

export type LinePlayer = { playLine: (start: number, end: number, rate: number) => void; stop: () => void }

export const YouTubePlayer = forwardRef<LinePlayer, { videoId: string; onFailed: () => void }>(function YouTubePlayer(
  { videoId, onFailed },
  ref,
) {
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const isReady = useRef(false)
  const waiting = useRef<Array<() => void>>([])
  const timer = useRef<number | undefined>(undefined)

  const hideCaptions = () => {
    for (const module of ['captions', 'cc']) player.current?.unloadModule(module)
  }
  const stop = () => {
    window.clearInterval(timer.current)
    player.current?.pauseVideo()
  }
  useImperativeHandle(ref, () => ({
    stop,
    playLine(start, end, rate) {
      const run = () => {
        const current = player.current
        if (!current) return
        window.clearInterval(timer.current)
        current.setPlaybackRate(rate)
        current.seekTo(start, true)
        current.playVideo()
        timer.current = window.setInterval(() => {
          if (current.getCurrentTime() >= end) stop()
        }, 100)
      }
      if (isReady.current) run()
      else waiting.current.push(run)
    },
  }))

  useEffect(() => {
    let cancelled = false
    loadApi()
      .then((YT) => {
        if (cancelled || !host.current) return
        const element = document.createElement('div')
        host.current.append(element)
        player.current = new YT.Player(element, {
          host: 'https://www.youtube-nocookie.com',
          videoId,
          playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, cc_load_policy: 0 },
          events: {
            onReady: () => {
              isReady.current = true
              // the video's own captions would show the answer
              hideCaptions()
              const queued = waiting.current
              waiting.current = []
              queued.forEach((run) => run())
            },
            // the captions module loads when playback starts: turn it off again then
            onStateChange: () => hideCaptions(),
            onError: () => onFailed(),
          },
        })
      })
      .catch(() => onFailed())
    return () => {
      cancelled = true
      window.clearInterval(timer.current)
      player.current?.destroy()
      player.current = null
      isReady.current = false
    }
    // the player belongs to one video; a new video mounts a new component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  return <div className="listen-video" ref={host} />
})
