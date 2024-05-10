import Modal from '@/components/Common/Layout/Modal';
import DefaultButton from '@/components/Common/Buttons/DefaultButton';
import classNames from 'classnames/bind';
import styles from './ProfileEditModal.module.scss';
import { MemberDataType } from '@/pages/profile/types';
import GenerationBadge from '@/components/Common/GenerationBadge';
import ImageInput from '@/components/Common/ImageInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import fetchData from '@/api/fetchData';
import { AuthFormProps } from '@/@types/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProfileEditModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberData: MemberDataType;
}

interface FetchDataResponse {
  uploadURL: string;
}

interface RequestDataProps {
  profileImageUrl: string;
  nickname: string;
  introduce: string;
}
const cn = classNames.bind(styles);

export default function ProfileEditModal({
  isOpen,
  setIsOpen,
  memberData,
}: ProfileEditModalProps) {
  const [previewImage, setPreviewImage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [upLoadComplete, setUploadComplete] = useState(false);
  const [profileData, setProfileData] = useState<MemberDataType | null>(null);

  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue } = useForm<AuthFormProps>();

  // 이 과정을 통해서는 이미지 url을 받는게 아니다.
  // 그냥 S3버킷에 업로드 가능한 pre-signed URL만 받고
  // 이걸 이용해서 이미지를 S3에 업로드하는것
  async function getPresignedUrl() {
    try {
      const response = (await fetchData({
        param: '/profile/image/create',
      })) as FetchDataResponse;

      const { uploadURL } = response;
      return uploadURL;
    } catch (error) {
      console.error('GetUploadUrl 에러: ', error);
      throw error;
    }
  }

  async function uploadFileToS3(file: File) {
    const uploadUrl = await getPresignedUrl();
    if (!uploadUrl) {
      console.error('업로드 URL GET 실패');
      return null;
    }
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file, // 업로드할 파일
        headers: {
          'Content-Type': file.type, // 파일 타입 지정
        },
      });
      if (response.ok) {
        console.log('이미지 업로드 성공');
        return uploadUrl.split('?')[0]; // 업로드된 이미지의 S3 URL을 반환
      }
      console.error('Upload failed:', response);
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempPreviewUrl = URL.createObjectURL(file);
    setPreviewImage(tempPreviewUrl);

    try {
      const response = await uploadFileToS3(file); // S3에 파일 업로드
      // const cacheBustingUrl = `${uploadedImageUrl}?timestamp=${new Date().getTime()}`;
      console.log('Uploaded image URL(reponse of uploadFileToS3):', response);
      setUploadedImageUrl(response);
      console.log('업로드 성공:', uploadedImageUrl);
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  useEffect(() => {
    if (upLoadComplete) {
      if (uploadedImageUrl) {
        setValue('image', uploadedImageUrl);
        setPreviewImage(uploadedImageUrl); // 실제 업로드 URL로 미리보기 업데이트
      }
      console.log(uploadedImageUrl);
      setUploadComplete(false);
    }
  }, [upLoadComplete, uploadedImageUrl, setValue]);

  // ==================================================
  // 이미지 삭제 mutation으로 리팩토링
  const { mutate: deleteImage } = useMutation({
    mutationFn: async () =>
      fetchData({
        param: '/profile/image/delete',
        method: 'delete',
        requestData: {
          imageUrls: [memberData.profileImageUrl],
        },
      }),

    onSuccess: () => {
      console.log('프로필 이미지 삭제 성공');
      setPreviewImage('');
      setValue('image', '');
      queryClient.invalidateQueries({ queryKey: ['profileData', memberData] });
    },
    onError: (error) => {
      console.error('이미지 삭제 에러 : ', error);
    },
  });

  // 프로필 업데이트 : 리액트쿼리
  const { mutate: updateProfile } = useMutation<void, Error, RequestDataProps>({
    mutationFn: async (requestData: RequestDataProps) => {
      // patch할 때 보내는 정보는 nickname, image, introduce
      fetchData({
        param: '/profile/mine',
        method: 'patch',
        requestData,
      });
    },
    onSuccess: () => {
      console.log('프로필 업데이트 성공');
      queryClient.invalidateQueries({ queryKey: ['profileData', memberData] });
      // refetchProfile(); // 프로필 리패치
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('프로필 업데이트 에러:', error);
    },
  });

  const handleIntroduceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value || '';
    setValue('introduce', newValue);
  };

  const onSubmit: SubmitHandler<AuthFormProps> = (data: AuthFormProps) => {
    const introduce = data.introduce || '';
    const requestData = {
      nickname: memberData.nickname,
      introduce,
      profileImageUrl: uploadedImageUrl || memberData.profileImageUrl,
    };
    updateProfile(requestData);
  };

  console.log('preview: ', previewImage);

  // 기본값 설정하기
  useEffect(() => {
    if (memberData.profileImageUrl) {
      // const cacheBustingUrl = `${memberData.profileImageUrl}?timestamp=${new Date().getTime()}`;
      setPreviewImage(memberData.profileImageUrl);
    }
    // 'react-hook-form'에서도 기존 값을 설정
    setValue('introduce', memberData.introduce || '');
  }, [memberData, setValue]);

  return (
    <div>
      {isOpen && (
        <Modal
          modalVisible={isOpen}
          toggleModal={setIsOpen}
          title="프로필 수정"
          cssComponentDisplay={cn('profile-edit-modal')}
          cssModalSize={cn('380px')}
        >
          <form
            className={cn('profile-edit-Form')}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={cn('profile-image-edit')}>
              <ImageInput
                type="profile"
                watch={watch}
                register={{
                  ...register('image', {
                    onChange: handleImageChange,
                  }),
                }}
                initialImageUrl={previewImage || uploadedImageUrl}
              />
              <button
                className={cn('image-delete-button')}
                type="submit"
                onClick={() => deleteImage()}
              >
                이미지 삭제
              </button>
            </div>
            <div className={cn('name')}>{memberData?.nickname}</div>
            <GenerationBadge
              generationInfo={memberData?.generation}
              isAuthorized={memberData?.isAuthorized}
            />

            <div className={cn('introduce')}>
              한줄소개
              {memberData?.introduce ? (
                <textarea
                  {...register('introduce', {
                    onBlur: handleIntroduceChange,
                  })}
                  // value={introduce}
                  autoComplete="on"
                  className={cn('textarea', {
                    textareaActive: memberData?.introduce,
                  })}
                />
              ) : (
                <textarea placeholder="한줄소개를 입력하세요 (?자제한)" />
              )}
            </div>
            <div className={cn('flex-grow-div')}> </div>
            <div className={cn('edit-button')}>
              <DefaultButton
                // onClick={() => {
                //   handleProfileSubmit(uploadedImageUrl);
                // }}
                buttonType="submit"
                size="modal"
                color="$primary-01"
              >
                수정하기
              </DefaultButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
