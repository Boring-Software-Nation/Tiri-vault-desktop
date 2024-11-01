import {api, isFetchError} from "~/services";
import {createUint8ArrayFromKeys} from "~/utils";
import {useUserStore} from "~/store/user";

export async function canCreateUser(walletId, password) {
    try {
        walletId = walletId.replace(/\//g, '$');
        const result = await api.service.canCreateUser({user: {wallet: walletId, password: JSON.stringify(password)}})
        return true;
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            console.error(e)

        }
        return false
    }
}

let loginInProgress = false;

export async function loginOrRegisterUser(walletId, password) {
    if (loginInProgress) {
        return;
    }
    loginInProgress = true;
    const { updateUser, getWasLogout } = useUserStore()
    let errors = {}
    try {
        const result = await api.service.login({user: {wallet: walletId, password: JSON.stringify(password)}})
        console.log('getWasLogout', getWasLogout())
        if (getWasLogout()) {
            return;
        }
        const {token} = (result.data as any).user
        updateUser({unlockPassword: createUint8ArrayFromKeys(password), token: token as string})
        console.log('%cLogin to backend successful', 'background: #222; color: #bada55')
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            if (status === 401) {
                errors = await registerUser(walletId, password)
            } else {
                errors = {
                    error: ['Error, something went wrong'],
                }
                console.error(e)
            }
        }
    } finally {
        loginInProgress = false;
    }
    return errors;
}

async function registerUser(walletId, password) {
    const { updateUser } = useUserStore()
    let errors = {}
    try {
        const result = await api.service.register({user: {wallet: walletId, password: JSON.stringify(password)}})
        const {token} = (result.data as any).user
        updateUser({unlockPassword: createUint8ArrayFromKeys(password), token: token as string})
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status
            if (status === 400) {
                errors = {
                    error: ['Error create user'],
                }
            } else {
                errors = {
                    error: ['Error, something went wrong'],
                }
                console.error(e)
            }
        }
    }
    return errors;
}

export async function subscribeUser(walletId, subscriptionCode, subscriptionAddress, subscriptionPrice) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        const result = await api.service.subscribe(
            {
                subscription: {
                    wallet: walletId,
                        subscriptionCode: subscriptionCode,
                        subscriptionAddress: subscriptionAddress,
                        subscriptionPrice: subscriptionPrice,
                    }
                }
        )
        console.log(result)
        console.log('%cSubscribe successful', 'background: #222; color: #bada55')
        return result;
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function finalizeSubscribeUser(walletId, subscriptionCode, transaction) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        const result = await api.service.finalizeSubscribe(
            {
                subscription: {
                    wallet: walletId,
                    subscriptionCode: subscriptionCode,
                    subscriptionAddress: transaction.subscription_address,
                    subscriptionPrice: transaction.subscription_price,
                }
            }
        )
        console.log(result)
        console.log('%cFinalize subscribe successful', 'background: #222; color: #bada55')
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function cancelSubscribeUser(walletId, subscriptionCode, subscriptionAddress, subscriptionPrice) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        const result = await api.service.cancelSubscribe(
            {
                subscription: {
                    wallet: walletId,
                    subscriptionCode: subscriptionCode,
                    subscriptionAddress: subscriptionAddress,
                    subscriptionPrice: subscriptionPrice,
                }
            }
        )
        console.log(result)
        console.log('%Cancel subscribe successful', 'background: #222; color: #bada55')
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function subscriptions(walletId) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        return api.service.subscriptionList({subscription: {external_customer_id: walletId}})

    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function lastVersion() {
    let errors = {}
    try {
        return api.service.last_version()

    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function usage(walletId) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        return api.service.usage({subscription: {external_customer_id: walletId}})

    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function subscriptionUsageEvent(walletId, filesize) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        return api.service.subscriptionUsageEvent(
            {
                event: {
                    transaction_id: new Date().getTime().toString() + '_' + filesize,
                    external_customer_id: walletId,
                    filesize: filesize
                }
            })

    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}

export async function sendFeedback(walletId, email, subject, message) {
    walletId = walletId.replace(/\//g, '$');
    let errors = {}
    try {
        const result = await api.service.sendFeedback(
            {
                feedback: {
                    wallet: walletId,
                    sender: email,
                    subject: subject,
                    message: message,
                }
            }
        )
        console.log(result)
        console.log('Feedback sent')
        return result;
    } catch (e) {
        if (isFetchError(e)) {
            const status = (e as Response).status

            errors = {
                error: ['Error, something went wrong'],
            }
            console.error(e)
        }
    }
    return errors;
}
