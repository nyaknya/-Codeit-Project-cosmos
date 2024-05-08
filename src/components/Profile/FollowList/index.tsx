import styles from './FollowList.module.scss';
import classNames from 'classnames/bind';
import Modal from '@/components/Common/Layout/Modal';
import Follow from './Follow';
import { ModalPropsType } from '@/@types/type';
import {
  getMyFollowingData,
  getMyFollowerData,
  FollowDataProps,
  getUserFollowingData,
  getUserFollowerData,
} from '@/api/Follow';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useRouter } from 'next/router';

const cn = classNames.bind(styles);

type FollowListType = {
  followListProps: ModalPropsType & {
    title: string;
    isFollowButton: boolean;
    followData: 'following' | 'follower' | 'userFollowing' | 'userFollower';
  };
};

type userFollowProps = {
  id?: number;
  page: number;
};

/**
 * @param {Object} followListProps - 컴포넌트에 전달되는 props
 * @param {string} title - 모달 제목
 * @param {React.Dispatch<React.SetStateAction<boolean>>} handleClick - X 아이콘 클릭시 모달을 닫아주기 위한 setState 함수
 * @param {FollowType[]} followData - 팔로워 또는 팔로잉 데이터 / followData->이porp에 팔로잉또는 팔로워 데이터 넣어서 사용
 * @param {boolean} modalOpen - 모달 on/off 여부 변수
 * @param {boolean} isFollowButton - 팔로우 버튼이 필요한지 여부/ true: 팔로우 버튼 , false: 삭제 버튼
 * @returns {JSX.Element} 팔로워 또는 팔로잉 리스트 JSX
 */

export default function FollowList({ followListProps }: FollowListType) {
  const { title, toggleModal, isFollowButton, followData, modalVisible } =
    followListProps;

  const router = useRouter();
  const { memberId } = router.query;

  const fetchPageData = (page: number) => {
    if (followData === 'userFollowing' && memberId) {
      return getUserFollowingData(Number(memberId), page);
    }
    if (followData === 'userFollower' && memberId) {
      return getUserFollowerData(Number(memberId), page);
    }
    if (followData === 'following' && !memberId) {
      return getMyFollowingData(page);
    }
    if (followData === 'follower' && !memberId) {
      return getMyFollowerData(page);
    }
    throw new Error('Invalid followData or memberId');
  };

  const {
    data: followDataResult,
    hasNextPage,
    ref,
  } = useInfiniteScroll({
    queryKey: ['followData'],
    fetchFunction: fetchPageData,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
  });

  return (
    <Modal
      title={title}
      toggleModal={toggleModal}
      modalVisible={modalVisible}
      cssModalSize={cn('followList-container')}
      cssComponentDisplay={cn('followList-wrapper')}
    >
      <div>
        {followDataResult?.pages.map((page) =>
          page.data.map((follow: FollowDataProps) => {
            const followDetailInfo =
              followData === 'userFollowing' || followData === 'following'
                ? follow.followingInfo
                : follow.followerInfo;
            return (
              <Follow
                key={followDetailInfo?.memberId}
                {...followDetailInfo}
                isFollowButton={isFollowButton}
              />
            );
          }),
        )}
        <div ref={ref} />
      </div>
    </Modal>
  );
}
