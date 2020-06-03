import React from 'react';
import {
  AccountBalanceWallet,
  Add,
  ArrowBack,
  ArrowForward,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ArrowUpward,
  Autorenew,
  Backspace,
  Backup,
  Check,
  Close,
  CloudDone,
  Compare,
  CreditCard,
  Edit,
  EmojiEvents,
  Error,
  ExpandLess,
  FiberSmartRecord,
  FileCopy,
  FlashOn,
  GetApp,
  History,
  LocalOffer,
  Loop,
  Map,
  NotificationsNone,
  Send,
  Storefront,
  Style,
  SubdirectoryArrowRight,
  Subject,
  Toll,
  Dialpad,
  Remove,
} from '@material-ui/icons';
import { IIconName } from '../interfaces';

const Icons = {
  pay: CreditCard,
  receive: GetApp,
  history: History,
  notifications: NotificationsNone,
  ranking: EmojiEvents,
  menu: Subject,
  close: Close,
  flash: FlashOn,
  flip: Loop,
  back: ArrowBack,
  next: ArrowForward,
  check: Check,
  backspace: Backspace,
  add: Add,
  up: ArrowUpward,
  dialpad: Dialpad,
  token: Toll,
  coupen: Style,
  tag: LocalOffer,
  upload: ExpandLess,
  uploading: Autorenew,
  cloud: Backup,
  clouddone: CloudDone,
  fileCopy: FileCopy,
  editIcon: Edit,
  mapIcon: Map,
  walletIcon: AccountBalanceWallet,
  compareIcon: Compare,
  totalSupply: FiberSmartRecord,
  errorIcon: Error,
  dirBackArrow: SubdirectoryArrowRight,
  sellIcon: Storefront,
  sendIcon: Send,
  mintIcon: Toll,
  arrowDown: KeyboardArrowDown,
  arrowUp: KeyboardArrowUp,
  remove: Remove,
};

const Icon = (props: IIconName) => {
  const IconTag = Icons[props.name];
  const style = props.style;

  return <IconTag style={style} />;
};

export default Icon;
