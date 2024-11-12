// Counterpart is in src/components/modals/ModalUpload.vue

let loading = false;

if ('serviceWorker' in navigator && !loading) {
  loading = true;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('/hat-sh-worker.js', import.meta.url), { type: 'module' }).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
      throw error;
    });
  });
}

export async function sendMessage(id: string, data: any[], target: string) {
  console.log('Sending message to service worker:', id, data, target);
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ id, data, target });
  } else {
    console.log('No active service worker to send the message to.');
  }
}

export function onMessage(id: string, callback: (message: any) => void) {
  console.log('Listening for message from service worker:', id);
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('Received event:', event.data, event);
    if (event.data.id == id)
      callback(event.data);
    else if (event.data.reply)
      callback({ id: id, data: [ event.data.reply ] });
  });
}
