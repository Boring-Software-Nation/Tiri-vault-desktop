![image](https://github.com/user-attachments/assets/023f10dc-3d8e-4f63-b492-873fd884b3af)

# About Tiri Vault

Tiri Vault is a next-generation Web3 storage platform designed to merge decentralization, privacy, and usability into a seamless and intuitive experience. Built for modern workflows, Tiri Vault enables real-time syncing, private collaboration, and smart contract integration, all while ensuring user sovereignty over their data.

Decentralized file storage solutions have emerged as a promising alternative to traditional cloud platforms, offering stronger privacy, security, and cost-efficiency. Unlike centralized storage, Web3 solutions distribute data across a global network, preventing single points of failure and enhancing data resilience. However, despite these advantages, most decentralized storage networks are designed primarily for infrastructure providers (IaaS) and corporate users, rather than private individuals. As a result, retail adoption remains low due to several usability challenges.

Tiri Vault was conceived as a solution that preserves decentralization and privacy while introducing familiar workflows and use cases that users expect. Our goal is to transform decentralized storage into a true workspace, simplifying onboarding and UX, unifying storage management across multiple Web3 platforms, and enabling privacy-first collaboration services. By bridging the gap between decentralized security and traditional usability, Tiri Vault redefines how Web3 storage can be used seamlessly and efficiently.

Tiri Vault offers a solution to integrate a hybrid architecture that combines decentralized blockchain-based storage with off-chain real-time synchronization mechanisms.

## How Tiri Vault implements real-time file access in decentralized networks

<b>Zero-Knowledge Change Tracking:</b> Tiri Relay maintains a user’s hierarchical file/folder tree structure, ensuring efficient navigation and organization of stored data. This tree structure is fully encrypted on the front-end side with a user’s public key, meaning that even Tiri Relay can not see filenames, paths, file structures, or contents. Changes to files or folders modify the Merkle tree hash, which serves as a cryptographic fingerprint of the entire file system. Zero-knowledge proofs allow user devices to verify that a change has occurred (e.g., a file was updated, renamed, or moved) without revealing the actual modifications and enable synchronization while maintaining full privacy.

<b>WebSockets for Instant Synchronization:</b> Tiri Vault employs an off-chain caching layer on a local user device that allows instant updates to files and uses Tiri Relay to commit the latest file versions to the decentralized storage network. Tiri Relay utilizes WebSockets to ensure real-time synchronization across multiple devices. Users see changes reflected instantly.

<b>Hash Commitments for Integrity Checks:</b> To maintain trust and verify file authenticity without storing every update on-chain, Tiri Vault uses hash commitments. This means that while the files remain mutable in the short term, their integrity is cryptographically verified before finalizing on decentralized storage.

Below is an overview of how a file is processed when added to a Tiri-synced local folder:

![image](https://github.com/user-attachments/assets/4fecc124-a521-44fd-b7e9-d3821891dfde)

1. Detecting File Changes & Updating the FileTreeModel: when a user adds a new file to their Tiri-synced local folder, the Tiri Vault LocalFilesWatcher detects the change and updates the FileTreeModel, a structured representation of the user's files and folders.
2. Requesting the Last Saved FileTreeModel Hash from Tiri Relay: the Tiri App queries the Tiri Relay for the latest saved FileTreeModel hash to check for any changes. If this is the first synchronization, there is no stored FileTreeModel, so the newly generated model is set as the actual one. If a hash exists, the Tiri App compares the retrieved hash with the hash of the new FileTreeModel.
3. Resolving Differences Between Local and Stored File Trees: if the hashes don’t match, this means changes have occurred. The Tiri App then downloads the last stored FileTreeModel from Tiri Relay, decrypts it using the user’s private key, compares it to the new FileTreeModel and identifies four key differences (diffs):
- Upload → Files that need to be uploaded to storage.
- Remove → Files that need to be deleted from storage.
- Download → Files that need to be downloaded to the local device.
- LocalRemove → Files that need to be deleted from the local device.  
Then it merges the changes and writes a new, updated FileTreeModel.
4. Processing File Synchronization: to ensure consistency and avoid conflicts, the Tiri App applies changes in a strict sequence: Remove → Upload → LocalRemove → Download.
5. Updating FileTreeModel on Tiri Relay: once all file operations are successfully completed, the merged FileTreeModel is encrypted with the user’s public keyand uploaded to the Tiri Relay, replacing the previous version.
6. Notifying All Devices for Synchronization: Tiri Relay operates a WebSocket server that actively notifies all connected user devices whenever a new FileTreeModel hash is saved. When a device receives this notification, it requests the updated FileTreeModel, decrypts it, and applies the necessary changes.
 
This ensures that all user devices remain in sync, providing a seamless and decentralized file collaboration experience.

# Tiri Vault Desktop

This is repository contains a desktop Electron application with Vue and TypeScript.  
Related repos:  
[Tiri Relay](https://github.com/Boring-Software-Nation/Tiri-relay)  
[Tiri Vault browser extension](https://github.com/Boring-Software-Nation/Tiri-vault-extension) *currently not supported

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
