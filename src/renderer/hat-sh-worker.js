// See https://github.com/sh-dv/hat.sh/blob/master/service-worker/sw.js
// It has to be in root for scope issues

import { APP_URL, encoder, sigCodes, decoder } from "./hat-sh-config.js";
import {decodeUrlSafeBase64ToArrayBuffer} from "./src/utils/base64";
import _sodium, { ready } from "libsodium-wrappers-sumo";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
});

let sodium, streamController, fileName, theKey, state, header, salt, encRx, encTx, decRx, decTx;

(async () => {
  await ready;
  sodium = _sodium;
})();


self.addEventListener("fetch", (e) => {
  //console.log('fetch:', e.request.url, APP_URL); // log fetch event
  if (e.request.url.startsWith(APP_URL)) {
    const stream = new ReadableStream({
      start(controller) {
        streamController = controller;
      },
    });
    const response = new Response(stream);
    response.headers.append(
      "Content-Disposition",
      'attachment; filename="' + fileName + '"'
    );
    e.respondWith(response);
  }
});

addEventListener("message", (e) => {
  const { id, data } = e.data;
  const sender = e.source;
  console.log('!!! worker got msg id:', id, 'data:', data, 'sender:', sender)
  if (id !== "hat-sh") {
    console.log("Unknown message id", id); 
    return;
  }

  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.log("Invalid message", message);
      return;
    }

    const action = data[0];

    let params = [];

    if (data.length > 1)
      params = data.slice(1);


    switch (action) {
      case "prepareFileNameEnc":
        assignFileNameEnc(params[0], sender);
        break;

      case "prepareFileNameDec":
        //params.length === 1 ? assignFileNameDec(params[0]) : assignFileNameDec(params[0], params[1]);
        assignFileNameDec(params[0], sender);
        break;

      case "requestEncryption":
        encKeyGenerator(params[0], sender);
        break;

      case "requestEncKeyPair":
        encKeyPair(params[0]/*e.data.privateKey*/, params[1]/*e.data.publicKey*/, params[2]/*e.data.mode*/, sender);
        break;

      case "asymmetricEncryptFirstChunk":
        asymmetricEncryptFirstChunk(params[0]/*e.data.chunk*/, params[1]/*e.data.last*/, params[2]/*fileId*/, sender);
        break;

      case "encryptFirstChunk":
        encryptFirstChunk(params[0]/*e.data.chunk*/, params[1]/*e.data.last*/, params[2]/*fileId*/, sender);
        break;

      case "encryptRestOfChunks":
        encryptRestOfChunks(params[0]/*e.data.chunk*/, params[1]/*e.data.last*/, params[2]/*fileId*/, sender);
        break;

      case "checkFile":
        //params.length === 2 ? checkFile(params[0]/*e.data.signature*/, params[1]/*e.data.legacy*/)
        //    : checkFile(params[0]/*e.data.signature*/, params[1]/*e.data.legacy*/, params[2/*responseSuffix*/]);
        checkFile(params[0]/*e.data.signature*/, params[1]/*e.data.legacy*/, sender);
        break;

      case "requestTestDecryption":
        testDecryption(
          params[0]/*e.data.password*/,
          params[1]/*e.data.signature*/,
          params[2]/*e.data.salt*/,
          params[3]/*e.data.header*/,
          params[4]/*e.data.decFileBuff*/,
          sender
        );
        break;

      case "requestDecKeyPair":
        requestDecKeyPair(
          params[0]/*e.data.privateKey*/,
          params[1]/*e.data.publicKey*/,
          params[2]/*e.data.header*/,
          params[3]/*e.data.decFileBuff*/,
          params[4]/*e.data.mode*/,
          sender
        );
        break;

      case "requestDecryption":
        decKeyGenerator(
          params[0]/*e.data.password*/,
          params[1]/*e.data.signature*/,
          params[2]/*e.data.salt*/,
          params[3]/*e.data.header*/,
          sender
        );
        break;

      case "decryptFirstChunk":
        decryptChunks(params[0]/*e.data.chunk*/, params[1]/*e.data.last*/, sender);
        break;

      case "decryptRestOfChunks":
        decryptChunks(params[0]/*e.data.chunk*/, params[1]/*e.data.last*/, sender);
        break;

      case "pingSW":
        // console.log("SW running");
        break;

      case "doStreamFetch":
        doStreamFetch(params[0]/*url*/, params[1]/*token*/, params[2]/*fileId*/, sender);
        break;

      default:
        console.error("Unknown worker action", action);
    }
  } catch (ex) {
    console.error('Error:', ex)
  }  
});

const sendMessage = async (id, data, client) => {
  console.log('!!! send msg id:', id, 'data:', data, 'client:', client)
  client.postMessage({ id, data });
}

const doStreamFetch = async (url, token, fileId, client) => {
  const stream = new ReadableStream({
    start(controller) {
      console.log('Start stream controller fileId', fileId)
      streamController = controller;
    },
  });

  /*   
  const supportsRequestStreams = (() => {
    let duplexAccessed = false;
  
    const hasContentType = new Request('', {
      body: new ReadableStream(),
      method: 'POST',
      get duplex() {
        duplexAccessed = true;
        return 'half';
      },
    }).headers.has('Content-Type');
  
    return duplexAccessed && !hasContentType;
  })();

  console.log('supportsRequestStreams', supportsRequestStreams)
  */

  /*
  // Test
  console.log('!!! test reading')
  const reader = stream.getReader();
  while (true) {
      const {value, done} = await reader.read();
      console.log('Received:', done, value);
      if (done) break;
  }
  console.log('!!! test reading done')
  */

  // See https://developer.chrome.com/articles/fetch-streaming-requests/
  // Test on https://httpbin.org/put

  console.log('doStreamFetch', url)

  try {
    const r = await fetch(url, {
      method: 'PUT',
      duplex: 'half',
      body: stream,
      headers: {
        'Authorization': `Basic ${token}`
      },
    })
    console.log('doStreamFetch response', r)
    if (r.status === 403) {
      console.warn('Limit exceeded')
      streamController?.close();
      streamController = null;
      await sendMessage(
          'hat-sh-response',
          ['limitExceeded', fileId, 'Limit exceeded'],
          client
      );
      return;
    } else if (r.status === 500 || r.status === 503) {
      streamController?.close();
      streamController = null;
      await sendMessage(
          'hat-sh-response',
          ['uploadError', fileId, 'Upload error'],
          client
      );
      return;
    }
    console.log('Finished uploading fileId', fileId)
    await sendMessage(
        'hat-sh-response',
        ['uploadingFinished', fileId],
        client
    );
  } catch (e) {
    console.error(e)
    streamController?.close();
    streamController = null;
    await sendMessage(
        'hat-sh-response',
        ['uploadError', fileId, 'Upload error'],
        client
    );
    if (isFetchError(e)) {
      const status = e.status
      const statusText = e.statusText
      if (status === 500 || status === 503) {
        console.error('500 error. ' + statusText, e.data)
      }
    }
  }
}

const assignFileNameEnc = (name, client) => {
  fileName = name;
  client.postMessage({ reply: "filePreparedEnc" })
}

const assignFileNameDec = (name, client) => {
  fileName = name;
  client.postMessage({ reply: "filePreparedDec" })
}

const encKeyPair = (csk, spk, mode, client) => {
  try {
    if (csk === spk) {
      client.postMessage({ reply: "wrongKeyPair" });
      return;
    }

    let computed = sodium.crypto_scalarmult_base(sodium.from_base64(csk));
    computed = sodium.to_base64(computed);
    if (spk === computed) {
      client.postMessage({ reply: "wrongKeyPair" });
      return;
    }

    if (sodium.from_base64(csk).length !== sodium.crypto_kx_SECRETKEYBYTES) {
      client.postMessage({ reply: "wrongPrivateKey" });
      return;
    }

    if (sodium.from_base64(spk).length !== sodium.crypto_kx_PUBLICKEYBYTES) {
      client.postMessage({ reply: "wrongPublicKey" });
      return;
    }

    let key = sodium.crypto_kx_client_session_keys(
      sodium.crypto_scalarmult_base(sodium.from_base64(csk)),
      sodium.from_base64(csk),
      sodium.from_base64(spk)
    );

    if (key) {
      [encRx, encTx] = [key.sharedRx, key.sharedTx];

      if (mode === "test" && encRx && encTx) {
        client.postMessage({ reply: "goodKeyPair" });
      }

      if (mode === "derive" && encRx && encTx) {
        let res =
          sodium.crypto_secretstream_xchacha20poly1305_init_push(encTx);
        state = res.state;
        header = res.header;
        client.postMessage({ reply: "keyPairReady" });
      }
    } else {
      client.postMessage({ reply: "wrongKeyPair" });
    }
  } catch (error) {
    client.postMessage({ reply: "wrongKeyInput" });
  }
};

const asymmetricEncryptFirstChunk = (chunk, last, fileId, client) => {
  setTimeout(async function () {
    if (!streamController) {
      console.log("stream does not exist");
    }
    const SIGNATURE = new Uint8Array(
      encoder.encode(sigCodes["v2_asymmetric"])
    );

    streamController.enqueue(SIGNATURE);
    streamController.enqueue(header);

    let tag = last
      ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
      : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
      state,
      decodeUrlSafeBase64ToArrayBuffer(chunk),
      null,
      tag
    );

    streamController.enqueue(new Uint8Array(encryptedChunk));

    if (last) {
      streamController.close();
      await sendMessage(
        'hat-sh-response',
        ['encryptionFinished', fileId],
        client
      );
    } else {
      client.postMessage({ reply: "continueEncryption" });
    }
  }, 500);
};

const encKeyGenerator = (password, client) => {
  sodium.ready.then(async () => {
    salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

    theKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(theKey);
    state = res.state;
    header = res.header;

    client.postMessage({ reply: "keysGenerated" });
  });
};

const encryptFirstChunk = async (chunk, last, fileId, client) => {
  if (!streamController) {
    console.log("stream does not exist");
  }
  const SIGNATURE = new Uint8Array(
    encoder.encode(sigCodes["v2_symmetric"])
  );

  streamController.enqueue(SIGNATURE);
  streamController.enqueue(salt);
  streamController.enqueue(header);

  let tag = last
    ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

  let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
    state,
    decodeUrlSafeBase64ToArrayBuffer(chunk),
    null,
    tag
  );

  streamController.enqueue(new Uint8Array(encryptedChunk));

  if (last) {
    streamController.close();
    await sendMessage(
      'hat-sh-response',
      ['encryptionFinished', fileId],
      client
    );
  } else {
    client.postMessage({ reply: "continueEncryption" });
  }
};

const encryptRestOfChunks = async (chunk, last, fileId, client) => {
  let tag = last
    ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

  let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
    state,
    decodeUrlSafeBase64ToArrayBuffer(chunk),
    null,
    tag
  );

  streamController.enqueue(encryptedChunk);

  if (last) {
    streamController.close();
    await sendMessage(
      'hat-sh-response',
      ['encryptionFinished', fileId],
      client
    );
  } else {
    client.postMessage({ reply: "continueEncryption" });
  }
};

const checkFile = (signature, legacy, client) => {
  signature = decodeUrlSafeBase64ToArrayBuffer(signature);
  legacy = decodeUrlSafeBase64ToArrayBuffer(legacy);

  if (decoder.decode(signature) === sigCodes["v2_symmetric"]) {
    client.postMessage({ reply: "secretKeyEncryption" });
  } else if (decoder.decode(signature) === sigCodes["v2_asymmetric"]) {
    client.postMessage({ reply: "publicKeyEncryption" });
  } else if (decoder.decode(legacy) === sigCodes["v1"]) {
    client.postMessage({ reply: "oldVersion" });
  } else {
    client.postMessage({ reply: "badFile" });
  }
};

const requestDecKeyPair = (ssk, cpk, header, decFileBuff, mode, client) => {
  try {
    if (ssk === cpk) {
      client.postMessage({ reply: "wrongDecKeyPair" });
      return;
    }

    let computed = sodium.crypto_scalarmult_base(sodium.from_base64(ssk));
    computed = sodium.to_base64(computed);
    if (cpk === computed) {
      client.postMessage({ reply: "wrongDecKeyPair" });
      return;
    }

    if (sodium.from_base64(ssk).length !== sodium.crypto_kx_SECRETKEYBYTES) {
      client.postMessage({ reply: "wrongDecPrivateKey" });
      return;
    }

    if (sodium.from_base64(cpk).length !== sodium.crypto_kx_PUBLICKEYBYTES) {
      client.postMessage({ reply: "wrongDecPublicKey" });
      return;
    }

    let key = sodium.crypto_kx_server_session_keys(
      sodium.crypto_scalarmult_base(sodium.from_base64(ssk)),
      sodium.from_base64(ssk),
      sodium.from_base64(cpk)
    );

    if (key) {
      [decRx, decTx] = [key.sharedRx, key.sharedTx];

      if (mode === "test" && decRx && decTx) {
        let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
          decodeUrlSafeBase64ToArrayBuffer(header),
          decRx
        );

        if (state_in) {
          let decTestresults =
            sodium.crypto_secretstream_xchacha20poly1305_pull(
              state_in,
              decodeUrlSafeBase64ToArrayBuffer(decFileBuff)
            );

          if (decTestresults) {
            client.postMessage({ reply: "readyToDecrypt" });
          } else {
            client.postMessage({ reply: "wrongDecKeys" });
          }
        }
      }

      if (mode === "derive" && decRx && decTx) {
        state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
          decodeUrlSafeBase64ToArrayBuffer(header),
          decRx
        );

        if (state) {
          client.postMessage({ reply: "decKeyPairGenerated" });
        }
      }
    }
  } catch (error) {
    client.postMessage({ reply: "wrongDecKeyInput" });
  }
};

const testDecryption = (
  password,
  signature,
  salt,
  header,
  decFileBuff,
  client
) => {
  signature = decodeUrlSafeBase64ToArrayBuffer(signature);

  if (decoder.decode(signature) === sigCodes["v2_symmetric"]) {
    let decTestsalt = decodeUrlSafeBase64ToArrayBuffer(salt);
    let decTestheader = decodeUrlSafeBase64ToArrayBuffer(header);

    let decTestKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      decTestsalt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
      decTestheader,
      decTestKey
    );

    if (state_in) {
      let decTestresults = sodium.crypto_secretstream_xchacha20poly1305_pull(
        state_in,
        decodeUrlSafeBase64ToArrayBuffer(decFileBuff)
      );
      if (decTestresults) {
        client.postMessage({ reply: "readyToDecrypt" });
      } else {
        client.postMessage({ reply: "wrongPassword" });
      }
    }
  }
};

const decKeyGenerator = (password, signature, salt, header, client) => {
  signature = decodeUrlSafeBase64ToArrayBuffer(signature);

  if (decoder.decode(signature) === sigCodes["v2_symmetric"]) {
    salt = decodeUrlSafeBase64ToArrayBuffer(salt);
    header = decodeUrlSafeBase64ToArrayBuffer(header);

    theKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
      header,
      theKey
    );

    if (state) {
      client.postMessage({ reply: "decKeysGenerated" });
    }
  }
};

const decryptChunks = (chunk, last, client) => {
  setTimeout(function () {
    let result = sodium.crypto_secretstream_xchacha20poly1305_pull(
      state,
      decodeUrlSafeBase64ToArrayBuffer(chunk)
    );

    if (result) {
      let decryptedChunk = result.message;

      streamController.enqueue(new Uint8Array(decryptedChunk));

      if (last) {
        streamController.close();
        client.postMessage({ reply: "decryptionFinished" });
      }
      if (!last) {
        client.postMessage({ reply: "continueDecryption" });
      }
    } else {
      client.postMessage({ reply: "wrongPassword" });
    }
  }, 500);
};
