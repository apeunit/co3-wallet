import DeleteWallet from 'src/containers/DeleteWallet';
import ImportWallet from 'src/containers/ImportWallet';
import Language from 'src/containers/Language';
import NewWallet from 'src/containers/NewWallet';
import RecoveryPhrase from 'src/containers/RecoveryPhrase';
import Settings from 'src/containers/Settings';
import ConfirmPayment from '../components/ConfirmPayment';
import { SelectToken } from '../components/SelectToken';
import AppSettings from '../containers/AppSettings';
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
    path: '/settings',
    component: Settings,
  },
  {
    path: '/language',
    component: Language,
  },
  {
    path: '/app-settings',
    component: AppSettings,
  },
  {
    path: '/recovery-phrase',
    component: RecoveryPhrase,
  },
  {
    path: '/new-wallet',
    component: NewWallet,
  },
  {
    path: '/delete-wallet',
    component: DeleteWallet,
  },
  {
    path: '/import-wallet',
    component: ImportWallet,
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
