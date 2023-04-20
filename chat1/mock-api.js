function loginUser(username, password) {
  const user = mockData.users.find(user => user.username === username && user.password === password);
  if (user) {
    mockData.loggedInUser = user.id;
  }
  //console.log(user);
  return user;
}


function getUserContacts(userId) {
  const userFriends = mockData.friends.find(userFriend => userFriend.userId === userId);
  if (!userFriends) return [];

  return mockData.users.filter(contact => userFriends.friends.includes(contact.id));
}
function findUser(userId) {
  return mockData.users.find(user => user.id === userId);
}

function getConversation(contactId) {
  return mockData.conversations[contactId] || [];
}

// 更多获取虚拟数据的函数，例如修改昵称、发布状态、搜索和添加好友等
function searchUser(username) {
  return mockData.users.find(user => user.username === username);
}
