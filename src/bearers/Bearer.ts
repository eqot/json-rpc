import { IframeBearer } from './IframeBearer'
import { WebBearer } from './WebBearer'
import { ReactNativeBearer } from './ReactNativeBearer'

export interface Bearer {
  send(message: any | string): void
  onReceived(callback: (args: any) => void): void
}

export function generateBearer(webview: any): Bearer {
  if (webview) {
    return new ReactNativeBearer(webview)
  } else if (window === window.parent) {
    return new WebBearer()
  } else {
    return new IframeBearer()
  }
}
