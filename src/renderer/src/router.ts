import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteParams, RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        name: 'wallets',
        path: '/',
        component: () => import('./pages/Account.vue'),
    },
    {
        name: 'wallet',
        path: '/wallet',
        redirect: '/',
    },
    {
        name: 'sync',
        path: '/sync',
        component: () => import('./pages/SyncSoon.vue'),
    },
];
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export type AppRouteNames =
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
