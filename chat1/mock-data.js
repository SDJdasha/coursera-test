const mockData = {
  users: [
    {
      id: 1,
      username: 'user1',
      password: 'password1',
      nickname: 'User One',
      avatar: 'https://via.placeholder.com/50',
      status: 'Hello, World!',
      isTopic: false,
      online: true
    },
    {
      id: 2,
      username: 'user2',
      password: 'password2',
      nickname: 'User Two',
      avatar: 'https://via.placeholder.com/50',
      status: '讨论一下午饭吃什么!',
      isTopic: true,
      online: true
    },
    {
      id: 3,
      username: 'user3',
      password: 'password3',
      nickname: 'User Three',
      avatar: 'https://via.placeholder.com/50',
      status: '有人想打牌吗?',
      isTopic: false,
      online: false
    },
    {
      id: 4,
      username: 'user4',
      password: 'password4',
      nickname: 'User f',
      avatar: 'https://via.placeholder.com/50',
      status: '',
      isTopic: false,
      online: false
    }
  ],
  loggedInUser: null,
  conversations: {
    1: [
      { senderId: 1, content: 'Hi there!' },
      { senderId: 2, content: 'Hello!' }
    ],
    2: [
      { senderId: 2, content: 'How are you?' },
      { senderId: 1, content: 'Good, thanks!' }
    ],
    123: [
      { senderId: 2, content: 'Go?' },
      { senderId: 1, content: 'Yes' },
      { senderId: 3, content: 'No' },
      { senderId: 2, content: 'Why' },
      { senderId: 4, content: 'Fine' }
    ],
  },
  friends: [
    { userId: 1, friends: [2, 3] },
    { userId: 2, friends: [1, 3] },
    { userId: 3, friends: [1, 2] },
    { userId: 4, friends: [1, 2] },
    // ...
  ],
  loggedInUser: null,
};