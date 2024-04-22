import styles from './LoginModal.module.scss';
import classNames from 'classnames/bind';
import Modal from '../Layout/Modal';
import { ModalPropsType } from '@/@types/type';
import { GitHubIcon, GoogleIcon, LogoIcon } from '../IconCollection';
import LoginButton from '@/components/Common/Buttons/LoginButton';

const cn = classNames.bind(styles);

export default function LoginModal({
  modalVisible,
  toggleModal,
}: ModalPropsType) {
  return (
    <Modal
      title="타이틀 안나오기"
      modalVisible={modalVisible}
      toggleModal={toggleModal}
      cssComponentDisplay={cn('')}
      cssModalSize={cn('')}
    >
      <div className={cn('login-container')}>
        <LogoIcon width="105" height="30" />
        <h2>코스모스에 오신 것을 환영합니다!🙌</h2>
        <div className={cn('oauth-Wrapper')}>
          <LoginButton text="구글 로그인/회원가입" icon={<GoogleIcon />} />
          <LoginButton text="깃허브 로그인/회원가입" icon={<GitHubIcon />} />
        </div>
      </div>
    </Modal>
  );
}
