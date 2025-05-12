import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteParams, RouteRecordRaw } from 'vue-router'
import Home from './pages/Home.vue'
import Sync from './pages/Sync.vue'
import Blank from './pages/Blank.vue'
import { isAuthorized } from '~/store/user'

export const routes: RouteRecordRaw[] = [
    {
        name: 'sync',
        path: '/sync',
        component: Blank,
    },
    /*
    {
        name: 'files',
        path: '/files',
        component: Home,
    },
    */
    {
        name: 'wallet',
        path: '/wallet',
        component: () => import('./pages/Wallet.vue'),
    },
    {
        name: 'wallets',
        path: '/',
        component: () => import('./pages/Wallets.vue'),
    },
    /*
    {
        name: 'history',
        path: '/history',
        component: () => import('./pages/History.vue'),
    },
    */
    {
        name: 'login',
        path: '/login',
        component: () => import('./pages/Login.vue'),
        beforeEnter: () => !isAuthorized(),
    },
];
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export type AppRouteNames =
    | 'login'
    | 'home'
    | 'wallets'
    | 'wallet'
    | 'sync'


export function routerPush (name: AppRouteNames, params?: RouteParams): ReturnType<typeof router.push> {
    if (name === 'home')
        name = 'wallets';

    return params !== undefined
        ? router.push({
            name,
            params,
        })
        : router.push({ name })
}
