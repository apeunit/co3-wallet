import React, {
  useEffect,
  //useEffect,
  useState,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Flex, Link, Text } from 'rebass';
import { getMemberBySearchString, getProfileById } from 'src/api/co3uum';
import {
  //setPublicKey,
  setToAddress,
} from 'src/redux/actions/Wallet';
import Blockies from 'react-blockies';
import InputField from '../components/InputField';
import { useTranslation } from 'react-i18next';

import {
  IMember,
  IProfile,
} from '../interfaces';
import IconButton from '../components/IconButton';
import Loading from 'src/components/Loading';
import ToolBar from 'src/components/ToolBar';
import ToolBarTitle from 'src/components/ToolBarTitle';

const SearchUser = () => {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const { accessToken } = useSelector(({ co3uum, wallet }: any) => {
    return {
      accessToken: co3uum.accessToken
    };
  });

  const history = useHistory();
  const location = useLocation<{token?: any}>();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [result, setResult] = useState<Array<IMember>>([]);
   
  const _handleKeyDown = async (e: any) => {
    e.preventDefault();
    try {
      const res = await getMemberBySearchString(accessToken, search)
      setResult(res.result)
      setLoader(false);
      console.log(res)
    } catch (e) {
      console.log(e)
    }
    if (e.key === 'Enter') {
      //handleSteps();
    }
  };

  useEffect(() => {
    setLoader(false);
  }, [accessToken])

  const _handleClick = async (userId: string) => {
    const profile: IProfile = await getProfileById(accessToken, userId)
    dispatch(setToAddress(profile?.result?.blockchain_public_key));
    history.push({
      pathname: location?.state?.token ? '/payment' : '/select-token',
      search: location.search,
      state: location.state
    });
  }

  return (
    <Flex flexDirection="column" justifyContent="flex-start" backgroundColor="#eff3ff" height="100vh">
      <Loading loader={loader} />
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton
            icon="back"
            onClick={() => {
              history.push('/');
            }}
          />
          <ToolBarTitle fontWeight="500">{t('search-user.label')}</ToolBarTitle>
        </ToolBar>
      </Flex>
      <Flex padding={7}>
        <InputField
          type="text"
          className="token-mint-input"
          onChangeValue={setSearch}
          label={t('common.name')}
          placeholder={t('common.name')}
          value={search || ''}
          handleKeyChange={_handleKeyDown}
        />
      </Flex>
      <Flex paddingX={7} maxHeight="76vh" overflow="scroll" flexDirection="column" backgroundColor="#eff3ff" height="100vh">
        <ul>
          {result && result.length > 0 && result.map((user: IMember, index: number) => (
            <li
              key={index}
            >
              <Link
                onClick={() => _handleClick(user.id)}
              >
                <Flex flexDirection="row" marginBottom='8px' paddingBottom="4px" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Flex sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Blockies bgColor="#e2e8f0" spotColor="#e2e8f0" seed={user.name} size={10} scale={3} />
                  </Flex>
                  <Text className="name-list-item" marginLeft="8px" marginTop="2px" fontSize="1.1rem" color="#000" style={{ cursor: "pointer" }}>{user.name}</Text>
                </Flex>
              </Link>
            </li>
          ))}
        </ul>
      </Flex>
    </Flex>
  );
}

export default SearchUser
