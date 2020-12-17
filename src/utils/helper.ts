import axios from 'axios';

export const getRandomId = () => {
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

export const getRandomCustomNumber = (count: number) => {
  let randomNo = '';
  for (let i = 0; i < count; i = i + 1) {
    randomNo = `${Math.floor(Math.random() * 9)}${randomNo}`;
  }

  return randomNo;
};

export const getTokenName = (tokenList: any, address: string) => {
  const token = tokenList.find((tkn: any) => tkn.contractAddress === address);

  return token && token.name;
};

export const getTokenSymbol = (tokenList: any, address: string) => {
  const token = tokenList.find((tkn: any) => tkn.contractAddress === address);

  return token && (token.token_symbol || token.symbol);
};

export const saveWebhookAPI = async (webhookUrl: any, data: any, res: any): Promise<Object> => {
  return (
    await axios.post(
      `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}_id=${data}`,
      { ...res },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    )
  ).data;
};
