import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../services/errorLog'
import { Icon } from './icons/Icon'

// If a page breaks, the learner sees a calm message and a way out instead of a blank screen,
// and the error is logged (services/errorLog.ts). Their saved progress is not affected.
type Props = { children: ReactNode; resetKey: string }
type State = { failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State { return { failed: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(Object.assign(error, { stack: `${error.stack ?? ''}\n--- component stack ---${info.componentStack ?? ''}` }), 'page')
  }

  // Opening another page tries again.
  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="error-screen" role="alert">
        <span className="error-screen__icon"><Icon name="refresh" size={26} /></span>
        <h1>Something went wrong on this page.</h1>
        <p>Your progress is saved. Reload the page, or go back to the dashboard. We have noted the problem.</p>
        <div className="error-screen__actions">
          <button className="check-button" type="button" onClick={() => window.location.reload()}><Icon name="refresh" size={17} /> Reload</button>
          <a className="outline-action" href="#dashboard" onClick={() => this.setState({ failed: false })}>Go to the dashboard</a>
        </div>
      </div>
    )
  }
}
