import { Bearer } from './Bearer'

export class IframeBearer implements Bearer {
  send(message: any | string) {
    // const payload = typeof message === "string" ? message : JSON.stringify(message)

    window.parent.postMessage(message, '*')

    // console.log(`sent: ${JSON.stringify(message)}`)
  }

  onReceived(callback: (args: any) => void) {
    window.addEventListener('message', event => {
      callback(event.data)
    })
  }
}
