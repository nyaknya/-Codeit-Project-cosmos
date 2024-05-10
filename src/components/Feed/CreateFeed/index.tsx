import Image from 'next/image';
import { File } from 'buffer';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import DefaultButton from '@/components/Common/Buttons/DefaultButton';
import { CloseIcon, ProfileIcon } from '@/components/Common/IconCollection';
import { useQuery, useMutation } from '@tanstack/react-query';
import fetchData from '@/api/fetchData';
import styels from './CreateFeed.module.scss';
import { postFeed } from './api';
import { FeedType } from './type';

interface UrlType {
  uploadURL: string;
}
interface CreatedFeedTypes {
  profileImage: string | null;
}

interface Inputs {
  content: string;
  feedImage: string[];
}

/**
 * CreatedFeed component
 * @param {string} profileImage - 로그인한 유저의 프로필 url을 받아 화면에 출력합니다.
 * @return {JSX.Element} 글작성 인풋과 이미지 추가하는 인풋을 포함하는 CreatedFeed 컴포넌트 입니다.
 */

export default function CreateFeed({ profileImage }: CreatedFeedTypes) {
  const cn = classNames.bind(styels);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
    watch,
  } = useForm<Inputs>();
  const [images, setImages] = useState<File[]>([]);
  const [urlBucket, setUrlBucket] = useState<string[]>([]);

  const { refetch: getUrl } = useQuery<UrlType>({
    queryKey: ['signedUrl'],
    queryFn: () =>
      fetchData({
        param: 'feed/image/create',
      }),
    enabled: false,
  });

  const putUrlMutate = useMutation({
    mutationFn: ({ url, file }: { url: string; file: File }) =>
      axios({
        method: 'put',
        url: `${url}`,
        data: file,
        headers: {
          'Access-Control-Allow-Origin': 'https://alpha.cosmo-sns.com/',
        },
      }),
    onSuccess: (data) => {
      const prev = getValues('feedImage');
      if (data.config.url) {
        const imageUrl = data.config.url.split('?')[0];
        console.log(imageUrl, '-----성공 응답 url --------');
        if (prev) {
          setValue('feedImage', [...prev, imageUrl]);
        } else {
          setValue('feedImage', [imageUrl]);
        }
      }
    },
    onError: () => {
      console.log('에러');
    },
  });

  const putUrl = (url: string, file: File) => {
    putUrlMutate.mutate({ url, file });
  };

  const deleteUrlMutate = useMutation({
    mutationFn: (url: string) =>
      axios({
        method: 'delete',
        url: `${url}`,
        headers: {
          'Access-Control-Allow-Origin': 'https://alpha.cosmo-sns.com/',
        },
      }),
    onError: () => console.log('이미지 삭제 요청 에러 '),
    onSuccess: () => console.log('이미지 삭체 요청 성공'),
    // s3서버에서 이미지 삭제 + 폼 벨류에서 삭제 + 미리보기 삭제;
    // 1. 폼 벨류에서 삭제 -> 성공응답이 오면 setValue 해주기
    // 2. 미리보기 삭제 -> setImages 해주기
  });

  const deleteImage = (url: string) => {
    deleteUrlMutate.mutate(url);
  };

  /**
   * 제어컴포넌트인 이미지 업로드 input이 onChange 이벤가 일어나면 setImages 세터함수가 실행되어
   * 컴포넌트가 재랜더링 됩니다. 아래 반환문의 조건부 렌더링이 실행되면서 업로드한 이미지들의 url을 생성해 이미지 프리뷰를
   * 보여주게 됩니다
   */
  const updateImageUrls = () => {
    if (images && images.length > 0) {
      let urlList = [];
      for (let i = 0; i < images.length; i += 1) {
        const file: Blob | MediaSource = new Blob([images[i]]);
        const createdUrl = URL.createObjectURL(file);
        urlList.push(createdUrl);
      }
      return [...urlList];
    }
    return [];
  };

  const updateUrlBucket = async (currentImageValue: File[]) => {
    if (currentImageValue && currentImageValue.length > 0) {
      let urlList: string[] = [];

      await Promise.all(
        currentImageValue.map(async () => {
          const { data } = await getUrl();
          if (data) urlList.push(data.uploadURL);
        }),
      );
      setUrlBucket([...urlBucket, ...urlList]);
    }
    return [];
  };

  const onSubmit = async (data: FeedType) => {
    try {
      await postFeed(data);
    } catch (error) {
      console.log(error, '------error------');
    }
    console.log(data, '------제출 데이터-----');
  };

  const imagePreview = updateImageUrls();

  const putFileIntoURL = () => {
    urlBucket.map((url, i) => putUrl(url, images[i]));
  };

  /**
   * CloseIcon을 클릭하면 filterImage 함수가 실행됩니다.
   * @param {number} index - useState images 배열의 index는 이미지를 업로드할때 등록되는 index와 같습니다. useState images 배열을 순회하면서 클릭한 이미지의 index를 제외한 나머지 요소를 반환합니다.
   */
  const filterImage = (index: number) => {
    console.log(index, '-----삭제되는 이미지 index------');
    const filteredImages = images.filter((el, i) => i !== index);
    const filteredUrlBucket = urlBucket.filter((el, i) => i !== index);

    filteredImages.map((item) =>
      console.log(item, '------필터된 이미지------'),
    );
    filteredUrlBucket.map((item) =>
      console.log(item, '------필터된 url------'),
    );

    setImages(filteredImages);
    setValue('feedImage', filteredUrlBucket);
  };

  useEffect(() => {
    console.log(urlBucket, '-------발급받은 urlBucket -------');
    putFileIntoURL();
  }, [urlBucket]);

  return (
    <form className={cn('container')} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('wrapper')}>
        <Image
          className={cn('profile-image')}
          src={profileImage || '/images/profile.svg'}
          alt="profile_image"
          width={40}
          height={40}
          onClick={() => console.log('프로필모달 열기')}
        />
        <div className={cn('content')}>
          <textarea
            className={cn('text')}
            rows={5}
            maxLength={300}
            placeholder="글을 작성해보세요"
            {...register('content', {
              required: '게시글을 작성해주세요',
            })}
          />
          {errors.content && (
            <span className={cn('error')}>{errors.content.message}</span>
          )}
          <span className={cn('limit')}>
            {watch('content') && watch('content').length}/300
          </span>
          <div className={cn('addImage')}>
            <div className={cn('image-wrapper')}>
              <Controller
                control={control}
                name="feedImage"
                render={({ field: { onChange } }) => (
                  <input
                    className={cn('file-input')}
                    id="feedImage"
                    type="file"
                    multiple
                    onChange={(event) => {
                      const fileList = event.target.files
                        ? Array.from(event.target.files)
                        : [];
                      const currentImageValue = [...images, ...fileList];
                      console.log([...fileList], '-----파일리스트----');
                      setImages(currentImageValue);
                      // updateUrlBucket(fileList);
                    }}
                  />
                )}
              />
              <label htmlFor="feedImage" className={cn('file-label')}>
                <span className={cn('label-text')}>이미지 업로드</span>
              </label>
              {imagePreview &&
                imagePreview.map((item, index) => (
                  <div key={index} className={cn('preview-container')}>
                    <CloseIcon
                      className={cn('close')}
                      onClick={() => {
                        filterImage(index);
                      }}
                    />
                    <div className={cn('preview-wrapper')}>
                      <img
                        className={cn('file-preview')}
                        src={item}
                        alt="image_item"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className={cn('button')}>
        <DefaultButton
          buttonType="submit"
          color="primary-01"
          onClick={() => console.log('')}
          size="medium"
        >
          등록
        </DefaultButton>
      </div>
    </form>
  );
}
