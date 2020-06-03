import {
  CREATE_WALLET,
  GENERATE_MNEMONIC_PHRASE,
  GET_MNEMONIC,
  SAVE_MNEMONIC,
  VALIDATE_MNEMONIC_DATA,
} from '../../../redux/actions/Wallet/ActionTypes';
import {
  createWallet,
  generateMnemonicPhrase,
  getMnemonic,
  saveMnemonic,
  validateMnemonicData,
} from '../../../redux/actions/Wallet';
import configureMockStore from 'redux-mock-store';

const mockStore: any = configureMockStore([]);
const store = mockStore({});
describe('Test Wallet Actions', () => {
  it('Should generate mnemonic and correctly trigger action', () => {
    const data = store.dispatch(generateMnemonicPhrase());
    expect(data).toEqual(
      expect.objectContaining({
        type: GENERATE_MNEMONIC_PHRASE,
        payload: expect.objectContaining({
          mnemonic: expect.any(String),
        }),
      }),
    );
  });

  it('Should generate mnemonic and validate it', () => {
    const data = generateMnemonicPhrase();

    const validMnemonic = data.payload.mnemonic;
    const invalidMnemonic = 'ABCDEF GHIJKL';

    const validateData = store.dispatch(validateMnemonicData(validMnemonic));
    const inValidateData = store.dispatch(validateMnemonicData(invalidMnemonic));

    expect(validateData).toEqual({ type: VALIDATE_MNEMONIC_DATA, payload: { isValid: true } });
    expect(inValidateData).toEqual({ type: VALIDATE_MNEMONIC_DATA, payload: { isValid: false } });
  });

  it('Should generate wallet using mnemonic', () => {
    const data = generateMnemonicPhrase();
    const walletData = store.dispatch(createWallet(data.payload.mnemonic));

    return Promise.resolve(walletData.payload).then((data) => {
      expect(walletData.type).toEqual(CREATE_WALLET);
      expect(data).toEqual(
        expect.objectContaining({
          wallet: expect.any(Object),
        }),
      );
    });
  });

  it('Should save mnemonic to the localStorage', () => {
    const data = generateMnemonicPhrase().payload.mnemonic;
    const key = 'co3-app-mnemonic';
    const saveData = store.dispatch(saveMnemonic(data));
    expect(saveData.type).toEqual(SAVE_MNEMONIC);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(key, data);
    expect(localStorage.__STORE__[key]).toBe(data);
  });

  it('Should get mnemonic from the localStorage', () => {
    const data = generateMnemonicPhrase().payload.mnemonic;
    saveMnemonic(data);
    const fetchedData = store.dispatch(getMnemonic());
    expect(fetchedData).toEqual({ type: GET_MNEMONIC, payload: { mnemonic: data } });
  });
});
