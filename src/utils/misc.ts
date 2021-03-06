import { COUPON_PURPOSE, TOKEN_PURPOSE } from 'src/config';
import { ITokenData } from '../interfaces';

export const filterTokenBySymbol = (tokenList: ITokenData[], symbol: string) => {
  return tokenList.find((token: any) => token.token_symbol === symbol);
};

export const isAddress = (address: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }

  return false;
};

// format an amount based on the purpose of the contract
export const formatAmount = (token: any, amount: number): number => {
  return  (token?.decimals > 0 || (token?.purpose >= TOKEN_PURPOSE && token?.purpose < COUPON_PURPOSE)) ? amount * 100 : amount;
};
