import axios from 'axios';
import Layout from 'components/Layout';
import MyPageComment from 'components/mypage/MyPageComment';
import MyPageEditProfile from 'components/mypage/MyPageEditProfile';
import MyPageLiked from 'components/mypage/MyPageLiked';
import MyPageProjectStudy from 'components/mypage/MyPageProjectStudy';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Image from 'next/image';
import { axiosInstance } from 'axiosInstance';
import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { getMyPageUserDataApi } from 'utils/apis/user';
import { dehydrate, QueryClient } from 'react-query';
import { useQuery } from 'react-query';

export interface MyPageData {
  profileImageUrl: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  preferredMethod: string;
  region: string;
  information: string;
  skills: string[];
  activated: boolean;
}

const MyPageWrapper = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 10px;
`;

const MyPageTopSection = styled.section`
  padding: 2rem 0 4rem 0;
  border-bottom: 3px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const MyPageNav = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const MyPageNavItem = styled.li<{ active?: boolean }>`
  padding: 8px 12px;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.secondary};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${props.theme.colors.green}` : 'none'};
`;

const ProfileImageWrapper = styled.div`
  img {
    border-radius: 50%;
  }
`;

const ProfileNickname = styled.h2`
  font-size: 18px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  margin: 1rem 0;
`;

const ProfileImageEditButton = styled.button`
  font-size: 16px;
  font-weight: 700;
  background-color: ${(props) => props.theme.colors.green};
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  :hover {
    opacity: 70%;
  }
`;

const MyPage = () => {
  const { data } = useQuery(['mypageData'], getMyPageUserDataApi);
  const [activeEditProfile, setActiveEditProfile] = useState(true);
  const [activeProjectStudy, setActiveProjectStudy] = useState(false);
  const [activeLiked, setActiveLiked] = useState(false);
  const [activeComment, setActiveComment] = useState(false);

  const onClickEditProfile = useCallback(() => {
    setActiveEditProfile(true);
    setActiveProjectStudy(false);
    setActiveLiked(false);
    setActiveComment(false);
  }, []);

  const onClickProjectStudy = useCallback(() => {
    setActiveEditProfile(false);
    setActiveProjectStudy(true);
    setActiveLiked(false);
    setActiveComment(false);
  }, []);

  const onClickLiked = useCallback(() => {
    setActiveEditProfile(false);
    setActiveProjectStudy(false);
    setActiveLiked(true);
    setActiveComment(false);
  }, []);

  const onClickComment = useCallback(() => {
    setActiveEditProfile(false);
    setActiveProjectStudy(false);
    setActiveLiked(false);
    setActiveComment(true);
  }, []);
  return (
    <Layout>
      <MyPageWrapper>
        <MyPageTopSection>
          <ProfileImageWrapper>
            <Image
              src={data.profileImageUrl}
              alt={'???????????????'}
              width={100}
              height={100}
            />
          </ProfileImageWrapper>
          <ProfileNickname>{data.nickname}</ProfileNickname>
          <ProfileImageEditButton>????????? ????????? ??????</ProfileImageEditButton>
          <MyPageNav>
            <MyPageNavItem
              active={activeEditProfile}
              onClick={onClickEditProfile}
            >
              ??? ??????
            </MyPageNavItem>
            <MyPageNavItem
              active={activeProjectStudy}
              onClick={onClickProjectStudy}
            >
              ????????????/?????????
            </MyPageNavItem>
            <MyPageNavItem active={activeLiked} onClick={onClickLiked}>
              ?????????
            </MyPageNavItem>
            <MyPageNavItem active={activeComment} onClick={onClickComment}>
              ??????
            </MyPageNavItem>
          </MyPageNav>
        </MyPageTopSection>
        {activeEditProfile && <MyPageEditProfile data={data} />}
        {activeProjectStudy && <MyPageProjectStudy />}
        {activeLiked && <MyPageLiked />}
        {activeComment && <MyPageComment />}
      </MyPageWrapper>
    </Layout>
  );
};

export default MyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
    await queryClient.prefetchQuery(['mypageData'], () => {
      return axios
        .get('http://13.124.27.209:8080/users/mypage')
        .then((response) => response.data);
    });
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};
