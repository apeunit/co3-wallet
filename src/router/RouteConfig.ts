import Home from '../containers/Home'
import Receive from '../containers/Receive'
import ScanQR from '../containers/ScanQR'
import Pay from '../containers/Pay'

export const routes = [
    {
        path: '/pay',
        component: Pay
    },
    {
        path: '/scan',
        component: ScanQR
    },
    {
        path: '/receive',
        component: Receive
    },
    {
        path: '/',
        component: Home
    }
]