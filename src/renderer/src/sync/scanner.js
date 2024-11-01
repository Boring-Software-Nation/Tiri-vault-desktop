
import defaultScanner from './default';
import {useWalletsStore} from "~/store/wallet";
import {useUserStore} from "~/store/user";



const rescanTimeouts = [];

let scanning = false;

export async function scanner() {
	const { wallets, saveWallet, queueWallet, setOffline, shiftWallet } = useWalletsStore()
	const { user, wasLogout } = useUserStore()

	if (scanning)
		return;

	scanning = true;

	try {
		const scan = await shiftWallet();

		if (!scan)
			return;

		if (!user?.unlockPassword || wasLogout) {
			console.error('Unable to scan, user is not logged in')
			return;
		}

		saveWallet( {
			id: scan.walletID,
			scanning: scan.full ? 'full' : 'quick'
		}, user?.unlockPassword);

		await scanWallet(scan.walletID, scan.full);

		saveWallet( {
			id: scan.walletID,
			scanning: null
		}, user?.unlockPassword);
	} finally {
		scanning = false;
	}

	scanner();
}

export async function scanWallet(walletID, full) {
	const { wallets, saveWallet, queueWallet, setOffline, shiftWallet } = useWalletsStore()

	clearTimeout(rescanTimeouts[walletID]);

	const wallet = wallets.find(w => w.id === walletID);
	let scanner;

	if (!wallet)
		return;

	scanner = defaultScanner;

	try {

		if (full)
			await scanner.fullScan(wallet);
		else
			await scanner.quickScan(wallet);

		setOffline(false);
	} catch (ex) {
		console.error('scanWallet', wallet.id, ex);
		setOffline(true);
	}

	try {
		await scanTransactions(wallet);
		setOffline(false);
	} catch (ex) {
		console.error('scanTransactions', wallet.id, ex);
		setOffline(true);
	}

	rescanTimeouts[wallet.id] = setTimeout(() => {
		queueWallet ( wallet.id, false );
	}, 120000);
}

export async function scanTransactions(wallet) {
	return defaultScanner.scanTransactions(wallet);
}

export function stopScanner() {
	rescanTimeouts.forEach(t => clearTimeout(t));
}
