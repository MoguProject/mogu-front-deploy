import {
  HeaderWrapper,
  HeaderStyled,
  HeaderLeft,
  Logo,
  HeaderNav,
  HeaderNavList,
  HeaderRight,
  AuthNavWrapper,
} from './styled';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { loadMyInfo } from 'utils/apis/user';
import { axiosInstance } from 'axiosInstance';
import { redirect } from 'next/dist/server/api-utils';
const ProfileCardImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  img {
    border-radius: 50%;
  }
`;

const logoutHandler = () => {
  axiosInstance.get('/users/logout', {
    withCredentials: true,
  });
  location.replace('/');
};

const Header = () => {
  const { data } = useQuery(['user'], loadMyInfo, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <HeaderWrapper>
      <HeaderStyled>
        <HeaderLeft>
          <Logo>
            <Link href="/">Mogu</Link>
          </Logo>
          <HeaderNav>
            <HeaderNavList>
              <li>
                <Link href="/projects">프로젝트 / 스터디</Link>
              </li>
              <li>
                <Link href="/community">커뮤니티</Link>
              </li>
            </HeaderNavList>
          </HeaderNav>
        </HeaderLeft>
        <HeaderRight>
          {data ? (
            <AuthNavWrapper>
              <li>
                <Link href={'/mypage'}>마이페이지</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>로그아웃</button>
              </li>
            </AuthNavWrapper>
          ) : (
            <AuthNavWrapper>
              <li>
                <Link href={'/auth/signup'}>회원가입</Link>
              </li>
              <li>
                <Link href={'/auth/login'}>로그인</Link>
              </li>
            </AuthNavWrapper>
          )}
        </HeaderRight>
      </HeaderStyled>
    </HeaderWrapper>
  );
};

export default Header;
