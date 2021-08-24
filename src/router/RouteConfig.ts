import NotFound404 from 'src/containers/404NotFound';
import CouponDetail from 'src/containers/CouponDetail';
import CrowdsaleCS from 'src/containers/Crowdsale';
import DeleteWallet from 'src/containers/DeleteWallet';
import ImportWallet from 'src/containers/ImportWallet';
import Language from 'src/containers/Language';
import NewPayment from 'src/containers/NewPayment';
import NewWallet from 'src/containers/NewWallet';
import RecoveryPhrase from 'src/containers/RecoveryPhrase';
import Settings from 'src/containers/Settings';
import SingleTokenTxnHistory from 'src/containers/SingleTokenTxnHistory';
import VendingMachine from 'src/containers/VendingMachine';
import ConfirmPayment from '../components/ConfirmPayment';
import { SelectToken } from '../components/SelectToken';
import AppSettings from '../containers/AppSettings';
import CrowdsaleDetail from '../containers/CrowdsaleDetail';
import MainPage from '../containers/MainPage';
import MarketPlace from '../containers/MarketPlace';
import Minting from '../containers/Minting';
import NewCoupon from '../containers/NewCoupon';
import NewCrowdsale from '../containers/NewCrowdsale';
import NewPickUpBasket from '../containers/NewPickUpBasket';
import NewToken from '../containers/NewToken';
import Pay from '../containers/Pay';
import Payment from '../containers/payment';
import Receive from '../containers/Receive';
import ScanQR from '../containers/ScanQR';
import TokenDetail from '../containers/TokenDetail';
import TransactionDetails from '../containers/TransactionDetails';
import TransactionsHistory from '../containers/TransactionsHistory';
import SearchUser from '../containers/SearchUser';

export const routes = [
  {
    path: '/search-user',
    component: SearchUser,
  },
  {
    path: '/tx',
    component: NewPayment,
  },
  {
    path: '/singletxnhistory',
    component: SingleTokenTxnHistory,
  },
  {
    path: '/attach-sm',
    component: CrowdsaleCS,
  },
  {
    path: '/vm',
    component: VendingMachine,
  },
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
    path: '/coupon-detail',
    component: CouponDetail,
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
    path: '/crowdsale-detail',
    component: CrowdsaleDetail,
  },
  {
    path: '/marketplace',
    component: MarketPlace,
  },
  {
    path: '/new-crowdsale',
    component: NewCrowdsale,
  },
  {
    path: '/new-pickupbasket',
    component: NewPickUpBasket,
  },
  {
    path: '/',
    exact: true,
    component: MainPage,
  },
  {
    path: '/*',
    exact: false,
    component: NotFound404,
  },
];
