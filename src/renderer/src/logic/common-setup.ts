import type { App } from 'vue'
import { router } from '~/router'
import { createPinia } from 'pinia'
import registerGlobalComponents from '~/plugins/global-components'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faCreditCard, faSitemap, faFile, faFileExport, faUnlock, faLock, faEllipsisV,
  faChevronLeft, faChevronRight, faChevronDown, faEye, faPencilAlt, faTrash, faPaperPlane, faWallet,
  faAddressBook, faCogs, faPlus, faXmark, faTimes, faArrowRotateRight, faRedo, faEllipsisVertical, faCog, faArrowRightFromBracket, faSignOut }
  from '@fortawesome/free-solid-svg-icons';
import { faBluetoothB, faUsb, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTiriStore } from "~/store/tiri";

export async function setupApp(app: App) {
  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = {
    context: '',
  }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Here you can install additional plugins for all contexts: popup, options page and content-script.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)

  app.use(router)
  app.use(createPinia())

  registerGlobalComponents(app)

  library.add(faBluetoothB, faExclamationTriangle, faCreditCard, faSitemap, faFile, faFileExport, faUnlock,
      faLock, faEllipsisV, faChevronLeft, faChevronRight, faChevronDown, faEye, faUsb, faGithub, faPencilAlt,
      faTrash, faPaperPlane, faWallet, faAddressBook, faCogs, faPlus, faXmark, faTimes,
      faArrowRotateRight, faRedo, faEllipsisVertical, faCog, faArrowRightFromBracket, faSignOut);
  app.component('font-awesome-icon', FontAwesomeIcon);

  // Is there a wallet on this computer? Decides between onboarding and the unlock screen.
  await useTiriStore().init()
}
