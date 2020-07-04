import { Bearer } from './Bearer'

export class WebBearer implements Bearer {
  send(message: any | string) {
    if (!window.ReactNativeWebView) {
      return
    }

    window.ReactNativeWebView.postMessage(JSON.stringify(message))

    // console.log(`WebBearer#send: ${JSON.stringify(message)}`)
  }

  onReceived(callback: (args: any) => void) {
    // console.log(`WebBearer#onReceived:`)

    window.addEventListener('message', event => {
      callback(event.data)
    })
  }
}
