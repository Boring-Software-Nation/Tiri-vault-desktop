import {defineStore} from "pinia";
import Wallet from '~/types/wallet';
import WalletSettings from '~/types/walletSettings';
import UploadingFile from '~/types/uploadingFile';
import { hash } from 'tweetnacl';
import { encode as encodeB64 } from '@stablelib/base64';
import { encode as encodeUTF8 } from '@stablelib/utf8';
import { saveWallet as dbSaveWallet, loadWallets as dbLoadWallets, deleteWallet as dbDeleteWallet, reset as dbDeleleAllWallets } from './db';
import Storage from "~/utils/storage";
import {computed, ref, toRaw, unref} from "vue";
import { scanner, stopScanner } from '~/sync/scanner';
import { siaAPI } from '~/services/wallet/siacentral';
import {useUserStore} from "~/store/user";
import { createUint8ArrayFromKeys } from '~/utils/index.js';


export const walletSettingsStorage = new Storage<WalletSettings>('walletSettings')
walletSettingsStorage.set({
    autoLock: 15,
    currency: 'usd',
    useCostBasis: false,
    changeSeedType: false,
    changeServerType: false,
    addressLookahead: 25000,
    displayLanguage: 'detect'
});

export const uploadingFileStorage = new Storage<UploadingFile[]>('uploadingFiles')

function getLocalStorageNumeric(key, def) {
    const v = localStorage.getItem(key);
    const n = v ? parseInt(v, 10) : NaN;

    if (!v || isNaN(n) || !isFinite(n))
        return def;

    return n; //parseInt(v, 10);
}

export const useWalletsStore = defineStore('walletsStore', () => {
    const wallets = ref<Wallet[]>([]);
    const scanQueue = ref<{ walletID: string, full: boolean }[]>([]);
    const settings = ref(walletSettingsStorage.get())
    const offline = ref(false);
    const setup = ref(false);
    const setupMode = ref('default');
    const siaNetworkFees = ref({} as any);
    const exchangeRateSC = ref({} as any);
    const exchangeRateSF = ref({} as any);
    const siaBlockHeight = ref(0);
    const feeAddresses = ref([] as any[]);
    const unavailable = ref(null);
    const dbType = ref('memory');
    const notifications = ref([] as any[]);
    const step = ref('password');
    const uploadingFiles = ref(uploadingFileStorage.get())

    updateMetadata();
    setInterval(updateMetadata, 300000);

    const allWallets = computed(() => unref(wallets));
    const getSelectedWallet = computed(() =>  {
        return localStorage.getItem('lastSelectedWallet') || wallets.value[0].id;
    })
    const currentWallet = computed(() => {
        if (!Array.isArray(wallets.value))
            return null;

        const selected = wallets.value.filter(w => w.id === getSelectedWallet.value)[0];

        if (!selected)
            return wallets.value[0];

        return selected;
    })

    const getCurrentWalletId = computed(() => {
        if (!currentWallet.value)
            return null;

        return currentWallet.value.id.replace(/\//g, '$');
    })

    const pushNotification = (notification) => {
        notifications.value.push(notification as never);
    }

    const clearNotification = () => {
        if (notifications.value.length === 0)
            return;

        notifications.value.shift();
    }

    return {
        settings,
        wallets,
        allWallets,
        currentWallet,
        getCurrentWalletId,
        getSelectedWallet,
        saveWallet,
        createWallet,
        deleteWallet,
        deleteAllWallets,
        queueWallet,
        offline,
        setOffline,
        shiftWallet,
        unavailable,
        setUnavailable,
        setDBType,
        setup,
        setSetup,
        setupMode,
        setSetupMode,
        exchangeRateSC,
        exchangeRateSF,
        scanQueue,
        unlockWallets,
        lockWallets,
        siaNetworkFees,
        feeAddresses,
        notifications,
        clearNotification,
        pushNotification,
        dbType,
        uploadingFiles,
        getUploadingFiles,
        setUploadingFiles,
        getSetupStep,
        setSetupStep,
    };

    async function unlockWallets(password?: string) {
        const { updateUser, user } = useUserStore()

        let passwordHash;
        if (password) {
            passwordHash = hash(encodeUTF8(password));
        } else if (user?.unlockPassword) {
            passwordHash = createUint8ArrayFromKeys(toRaw(user?.unlockPassword));
        }

        if (!passwordHash) {
            console.error('Unable to unlock wallets, password is not set')
            return false;
        }

        const wallets = await dbLoadWallets(passwordHash);

        updateUser({unlockPassword: passwordHash})

        await setWalletsMutation(wallets);

        wallets.forEach(w => queueWallet(w.id, false));

        return true;
    }

    async function lockWallets() {
        const { updateUser } = useUserStore()

        wallets.value = [];
        scanQueue.value = [];
        stopScanner();
        updateUser(null)
    }


    async function saveWallet(wallet: Wallet, password: string) {
        const { user, wasLogout } = useUserStore()
        if (!password || wasLogout) {
            console.error('Unable to save wallet, user is not logged in')
            return;
        }

        const existing = wallets.value.find(w => w.id === wallet.id);

        if (!existing)
            throw new Error(`unknown wallet ${wallet.id}`);

        const id = await dbSaveWallet({
            ...existing,
            ...wallet
        }, password);


        await saveWalletMutation({
            ...existing,
            ...wallet,
            id
        });

        return id;
    }

    async function createWallet(wallet: Wallet, password: Uint8Array) {
        const existing = wallets.value.find(w => w.id === wallet.id),
            id = await dbSaveWallet({
                ...existing,
                ...wallet
            }, password);

        await saveWalletMutation({...wallet, id});

        return id;
    }

    async function deleteWallet(walletId: string) {
        await dbDeleteWallet(walletId);
    }

    async function deleteAllWallets() {
        await dbDeleleAllWallets();
    }

    async function queueWallet(walletId, full) {
        await queueWalletMutation(walletId, full);
        setTimeout(scanner, 0);
    }

    async function shiftWallet() {
        const item = scanQueue.value[0];
        await shiftWalletMutation();
        return item;
    }

    async function setOffline(value) {
        offline.value = value;
    }

    async function setSetup(value) {
        setup.value = value;
    }

    async function setSetupMode(value) {
        setupMode.value = value;
    }

    async function setDBType(value) {
        dbType.value = value;
    }

    async function setUnavailable(value) {
        unavailable.value = value;
    }

    async function setNetworkFees(value) {
        siaNetworkFees.value = value;
    }

    async function setConsensusHeight(value) {
        siaBlockHeight.value = value;
    }

    async function setFeeAddresses(value) {
        feeAddresses.value = value;
    }


    async function setExchangeRate({ siacoin, siafund }) {
        exchangeRateSC.value = siacoin;
        exchangeRateSF.value = siafund;
    }

    async function updateMetadata() {
        try {
            const price = await siaAPI.getCoinPrice(),
                siaFees = await siaAPI.getNetworkFees(),
                addresses = await siaAPI.getFeeAddresses(),
                siaBlock = await siaAPI.getBlockHeight();

            setNetworkFees(siaFees);
            setConsensusHeight(siaBlock.height)
            setExchangeRate(price);
            setFeeAddresses(addresses);
        } catch (ex) {
            console.error('updatingMeta', ex);
        }
    }

    function getUploadingFiles() {
        return uploadingFileStorage.get();
    }

    function setUploadingFiles(files: UploadingFile[]) {
        uploadingFileStorage.set(files);
        uploadingFiles.value = getUploadingFiles()
    }

    function setSetupStep(value: string) {
        step.value = value;
    }

    function getSetupStep() {
        return step.value;
    }

    async function saveWalletMutation(wallet: Wallet) {
        if (!wallet || !wallet.seed)
            return;

        let id = wallet.seed;

        if (wallet.currency && wallet.currency !== 'sc')
            id += '-' + wallet.currency;

        id = encodeB64(hash(encodeUTF8(id)));

        const idx = wallets.value.findIndex(w => w.id === id);

        if (idx === -1) {
            wallets.value.push(new Wallet(wallet));
            return;
        }

        wallets.value.splice(idx, 1, new Wallet(wallet));

        console.log('*** wallets after save', wallets.value)
    }

    async function queueWalletMutation( walletID, full ) {
        full = typeof full === 'boolean' ? full : false;

        if (scanQueue.value.findIndex(w => w.walletID === walletID && w.full === full) !== -1)
            return;

        scanQueue.value.push({
            walletID,
            full
        });
    }

    async function shiftWalletMutation() {
        return scanQueue.value.shift();
    }

    async function setWalletsMutation(wlts: Wallet[]) {
        wallets.value = wlts.map(w => new Wallet(w));
    }

});
