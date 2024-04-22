const MOCKDATA2 = [
  {
    userImage: '',
    userName: 'JohnDoe',
    term: 1,
    date: '2024-04-19',
    contents:
      '위워크에서 아이폰 충전기 정품 케이블 보신 분 있나요? 분실한 거 같아요..!!',
    emojiCount: 3,
    commentCount: 10,
    eyeCount: 50,
  },
];

const MOCKDATA = [
  {
    userImage: '',
    userName: 'JohnDoe',
    term: 1,
    date: '2024-04-19',
    content:
      '위워크에서 아이폰 충전기 정품 케이블 보신 분 있나요? 분실한 거 같아요..!!',
    emojiCount: 3,
    commentCount: 10,
    eyeCount: 50,
  },
  {
    userImage: '',
    userName: 'JaneSmith',
    term: 2,
    date: '2024-04-18',
    content: '201호 회의실 에서 발견된 마우스 동글입니다 두고 가신분 ?...',
    image: 'travel.jpg',
    emojiCount: 5,
    commentCount: 15,
    eyeCount: 75,
  },
  {
    userImage: '',
    userName: 'MikeJohnson',
    term: 3,
    date: '2024-04-17',
    content:
      '비오는 날 긴자에서만 살 수 있는 특별한 잉크입니다. 일요일에 비가 와서 운이 좋게 구매할 수 있었어요. 잉크 사러 가는 길에 지하철에서 가방 잃어버린 건 비밀',
    emojiCount: 2,
    commentCount: 8,
    eyeCount: 40,
  },
  {
    userImage: '',
    userName: 'EmilyBrown',
    term: 4,
    date: '2024-04-16',
    content: '어드미션팀은 그런데 혹시 어떤일을 하시는분들인지 여쭤봐도되나용?',
    image: 'friends.jpg',
    emojiCount: 4,
    commentCount: 12,
    eyeCount: 60,
  },
  {
    userImage: '',
    userName: 'ChrisTaylor',
    term: 5,
    date: '2024-04-15',
    content:
      '온라인 행사 선물 받자마자 바로 우유 한잔 마셨습니다 ^_^ 컵 깜찍하네요',
    emojiCount: 1,
    commentCount: 6,
    eyeCount: 30,
  },
  {
    userImage: '',
    userName: 'AmandaClark',
    term: 6,
    date: '2024-04-14',
    content:
      '어제 요가 자세 보고 손목 스트레칭 하나 가져왔습니다. (출처는 인스타그램  LINE DEV)',
    image: 'cooking.jpg',
    emojiCount: 3,
    commentCount: 9,
    eyeCount: 45,
  },
  {
    userImage: '',
    userName: 'MichaelSmith',
    term: 7,
    date: '2024-04-13',
    content:
      '워라밸이 굉장히 좋다고 소문난 가비아에서 신입 공채를 진행중이네요!',
    emojiCount: 2,
    commentCount: 7,
    eyeCount: 35,
  },
  {
    userImage: '',
    userName: 'SarahJohnson',
    term: 8,
    date: '2024-04-12',
    content: 'Enjoying a cup of coffee on a rainy day.',
    image: 'coffee.jpg',
    emojiCount: 4,
    commentCount: 11,
    eyeCount: 55,
  },
  // {
  //   userImage: '',
  //   userName: 'AlexBrown',
  //   term: 9,
  //   date: '2024-04-11',
  //   content: 'Hiking in the mountains. #NatureLover',
  //   image: 'hiking.jpg',
  //   emojiCount: 3,
  //   commentCount: 10,
  //   eyeCount: 50,
  // },
  // {
  //   userImage: '',
  //   userName: 'EmmaDavis',
  //   term: 10,
  //   date: '2024-04-10',
  //   content: 'Listening to my favorite music playlist.',
  //   emojiCount: 2,
  //   commentCount: 8,
  //   eyeCount: 40,
  // },
  // {
  //   userImage: '',
  //   userName: 'DanielWilson',
  //   term: 11,
  //   date: '2024-04-09',
  //   content: 'Feeling productive today! #WorkLife',
  //   emojiCount: 3,
  //   commentCount: 9,
  //   eyeCount: 45,
  // },
  // {
  //   userImage: '',
  //   userName: 'OliviaMartinez',
  //   term: 12,
  //   date: '2024-04-08',
  //   content: 'Binge-watching my favorite TV series.',
  //   image: 'tv_series.jpg',
  //   emojiCount: 5,
  //   commentCount: 15,
  //   eyeCount: 75,
  // },
  // {
  //   userImage: '',
  //   userName: 'WilliamBrown',
  //   term: 13,
  //   date: '2024-04-07',
  //   content: 'Gardening in my backyard. #GreenThumb',
  //   image: 'gardening.jpg',
  //   emojiCount: 2,
  //   commentCount: 7,
  //   eyeCount: 35,
  // },
  // {
  //   userImage: '',
  //   userName: 'SophiaWilson',
  //   term: 14,
  //   date: '2024-04-06',
  //   content: 'Trying out a new recipe. #Foodie',
  //   image: 'recipe.jpg',
  //   emojiCount: 4,
  //   commentCount: 12,
  //   eyeCount: 60,
  // },
  // {
  //   userImage: '',
  //   userName: 'EthanThomas',
  //   term: 15,
  //   date: '2024-04-05',
  //   content: 'Playing video games with friends.',
  //   image: 'gaming.jpg',
  //   emojiCount: 3,
  //   commentCount: 9,
  //   eyeCount: 45,
  // },
  // {
  //   userImage: '',
  //   userName: 'MiaGarcia',
  //   term: 16,
  //   date: '2024-04-04',
  //   content: 'Enjoying a sunset at the beach. #Relaxation',
  //   image: 'beach.jpg',
  //   emojiCount: 5,
  //   commentCount: 15,
  //   eyeCount: 75,
  // },
  // {
  //   userImage: '',
  //   userName: 'DavidLopez',
  //   term: 17,
  //   date: '2024-04-03',
  //   content: 'Attending a music concert. #MusicLover',
  //   image: 'concert.jpg',
  //   emojiCount: 2,
  //   commentCount: 8,
  //   eyeCount: 40,
  // },
];

export { MOCKDATA, MOCKDATA2 };
