import { Bearer } from './Bearer'

export class ReactNativeBearer implements Bearer {
  private webview: any

  constructor(webview: any) {
    this.webview = webview

    this.webview.injectJavaScript(`
      (function() {
        window.addEventListener("message", (event) => {
          if (event.data.jsonrpc !== "2.0") {
            return;
          }

          if (!event.data.method) {
            return
          }

          window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
        })
      })();

      true
    `)

    console.info('JsonRpc has been injected')
  }

  send(message: any) {
    const payload = JSON.stringify(message)

    this.webview.injectJavaScript(`
      (window.frames["sandbox-preview"] ? window.frames["sandbox-preview"].contentWindow : window).postMessage(${payload}, "*");

      true;
    `)

    // console.log("Sent result:", message)
  }

  onReceived(callback: (args: any) => void) {}
}
