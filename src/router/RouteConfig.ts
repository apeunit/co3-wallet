import ConfirmPayment from '../components/ConfirmPayment';
import { SelectToken } from '../components/SelectToken';
import ImportPrivatekey from '../containers/ImportPrivatekey';
import MainPage from '../containers/MainPage';
import Minting from '../containers/Minting';
import NewCoupon from '../containers/NewCoupon';
import NewToken from '../containers/NewToken';
import Pay from '../containers/Pay';
import Payment from '../containers/payment';
import Receive from '../containers/Receive';
import ScanQR from '../containers/ScanQR';
import TokenDetail from '../containers/TokenDetail';
import TransactionDetails from '../containers/TransactionDetails';
import TransactionsHistory from '../containers/TransactionsHistory';

export const routes = [
  {
    path: '/token-mint',
    component: Minting,
  },
  {
    path: '/import-privatekey',
    component: ImportPrivatekey,
  },
  {
    path: '/token-detail',
    component: TokenDetail,
  },
  {
    path: '/new-token',
    component: NewToken,
  },
  {
    path: '/new-coupon',
    component: NewCoupon,
  },
  {
    path: '/pay',
    component: Pay,
  },
  {
    path: '/scan',
    component: ScanQR,
  },
  {
    path: '/receive',
    component: Receive,
  },
  {
    path: '/payment',
    component: Payment,
  },
  {
    path: '/select-token',
    component: SelectToken,
  },
  {
    path: '/confirmpayment',
    component: ConfirmPayment,
  },
  {
    path: '/transaction-history',
    component: TransactionsHistory,
  },
  {
    path: '/transaction-details',
    component: TransactionDetails,
  },
  {
    path: '/',
    component: MainPage,
  },
];
