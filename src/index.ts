import { JsonRpc } from './JsonRpc'

document.getElementById('app').innerHTML = `
<div>
  Log
  <ul id="log" />
</div>
`
;(async function () {
  const rpc = new JsonRpc()
  const result = await rpc.execute('ping', { foo: 'bar' })

  var node = document.createElement('li')
  var textnode = document.createTextNode(JSON.stringify(result))
  node.appendChild(textnode)
  document.querySelector('#log').appendChild(node)
})()
