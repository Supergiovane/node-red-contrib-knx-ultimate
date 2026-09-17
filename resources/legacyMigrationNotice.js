// Compatibility with the version 7 plugin cached by a running Node-RED process.
// Version 8 does not register that plugin. Keep this URL until the process restarts.
(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateLegacyMigrationNotice = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const installations = new WeakMap()
  const messages = {
    en: 'KNX Ultimate 8 has been installed. Restart the Node-RED service, then reload this page to finish the upgrade. Do this before editing or deploying flows; reloading the browser alone is not enough.',
    it: 'KNX Ultimate 8 è stato installato. Riavvia il servizio Node-RED, poi ricarica questa pagina per completare l’aggiornamento. Fallo prima di modificare i flow o fare Deploy: ricaricare soltanto il browser non basta.',
    de: 'KNX Ultimate 8 wurde installiert. Starten Sie den Node-RED-Dienst neu und laden Sie danach diese Seite neu, um das Update abzuschließen. Tun Sie dies vor dem Bearbeiten oder Deployen von Flows; das Neuladen des Browsers allein reicht nicht aus.',
    fr: 'KNX Ultimate 8 a été installé. Redémarrez le service Node-RED, puis rechargez cette page pour terminer la mise à jour. Faites-le avant de modifier ou de déployer des flows ; recharger uniquement le navigateur ne suffit pas.',
    es: 'KNX Ultimate 8 se ha instalado. Reinicia el servicio Node-RED y después recarga esta página para completar la actualización. Hazlo antes de editar o desplegar flows; recargar solo el navegador no es suficiente.',
    zh: 'KNX Ultimate 8 已安装。请重启 Node-RED 服务，然后重新加载此页面以完成升级。请先完成这些操作，再编辑或部署流程；仅刷新浏览器是不够的。'
  }

  function install (RED, options = {}) {
    if (installations.has(RED)) return installations.get(RED)
    const environment = options.environment || globalThis
    let notification
    let timer
    let disposed = false

    function dispose () {
      if (disposed) return
      disposed = true
      if (timer !== undefined) environment.clearTimeout(timer)
      if (notification && typeof notification.close === 'function') notification.close()
      installations.delete(RED)
    }

    const installation = { dispose }
    installations.set(RED, installation)
    // Let plugin registration finish before showing the non-modal notification.
    timer = environment.setTimeout(function () {
      timer = undefined
      if (disposed || typeof RED.notify !== 'function') return
      const language = typeof RED.i18n?.lang === 'function'
        ? RED.i18n.lang()
        : environment.navigator?.language
      const message = messages[String(language || 'en').toLowerCase().split(/[-_]/)[0]] || messages.en
      notification = RED.notify(message, { type: 'warning', fixed: true, modal: false })
    }, 0)
    return installation
  }

  return { install }
}))
