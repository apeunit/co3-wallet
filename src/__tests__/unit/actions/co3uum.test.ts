import { SAVE_ACCESS_TOKEN } from '../../../redux/actions/CO3UUM/ActionTypes'
import { saveAccessToken } from '../../../redux/actions/CO3UUM'
import configureMockStore from 'redux-mock-store'

const mockStore: any = configureMockStore([])
const store = mockStore({})

describe('Test CO3UUM Actions', ()=> {
    it('Should save access token', () => {
        const accessToken = 'sample_access_token_data'
        const key = 'co3uum-access-token'
        const saveData = store.dispatch(saveAccessToken(accessToken))
        expect(saveData).toEqual({type: SAVE_ACCESS_TOKEN, payload: { accessToken }})
        expect(localStorage.setItem).toHaveBeenLastCalledWith(key, accessToken);
        expect(localStorage.__STORE__[key]).toBe(accessToken)
    })
})