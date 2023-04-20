let selectedContactId = null;
let activeWindowType = 'contact';

$(document).ready(function() {
  
  // 登录表单提交事件处理
  $('#login-form').submit(function(e) {
   e.preventDefault(); // 阻止浏览器跳转到链接的URL
  // 在这里处理链接的URL

  // 在这里添加登录验证逻辑
  const username = $('#username').val();
  const password = $('#password').val();
  const loggedInUser = loginUser(username, password);
  //console.log("loggedInUser:",loggedInUser);

  if (loggedInUser) {
    // 将 loggedInUser 赋值给 mockData.loggedInUser
    mockData.loggedInUser = loggedInUser;

    // 保存用户名和密码到localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // 如果登录成功，则隐藏登录界面，显示联系人页面
    $('#login-container').hide();
    $('#contacts-container').show();

    // 在登录成功后渲染联系人列表
    renderContacts();
  } else {
    // 显示错误消息
    $('#login-error').text('用户名或密码错误');
  }
});


// 在页面加载时填充用户名和密码
$(document).ready(function() {
  const savedUsername = localStorage.getItem('username');
  const savedPassword = localStorage.getItem('password');

  if (savedUsername && savedPassword) {
    $('#username').val(savedUsername);
    $('#password').val(savedPassword);
  }

  // ... 其他代码 ...
});

  // 游客模式登录
  $('#guest-login').click(function() {
    const randomUsername = (Math.random() * 0xFFFFFF << 0).toString(16);
    const randomPassword = (Math.random() * 0xFFFFFF << 0).toString(16);

    // 使用 randomUsername 和 randomPassword 自动填充并提交登录表单
    $('#username').val(randomUsername);
    $('#password').val(randomPassword);
    $('#login-form').submit();
  });

  // 功能区按钮事件处理
  $('#function-area button').click(function() {
    const buttonText = $(this).text();

    if (buttonText === '用户头像') {
      // 打开个人资料页面
      $('#contacts-container').hide();
      $('#profile-container').show();
    } else if (buttonText === '发布状态') {
      // 打开发布状态页面
      $('#contacts-container').hide();
      $('#post-status-container').show();
    } else if (buttonText === '添加好友') {
      // 打开添加好友页面
      $('#contacts-container').hide();
      $('#add-friend-container').show();
    }
  });

  // 个人资料表单提交事件处理
  $('#profile-form').submit(function(e) {
    e.preventDefault();

    // 在这里添加修改昵称的逻辑

    // 返回联系人页面
    $('#profile-container').hide();
    $('#contacts-container').show();
  });

  // 发布状态表单提交事件处理
  $('#post-status-form').submit(function(e) {
    e.preventDefault();

    // 在这里添加发布状态的逻辑

    // 返回联系人页面
    $('#post-status-container').hide();
    $('#contacts-container').show();
  });

  // 添加好友表单提交事件处理
$('#add-friend-form').submit(function(e) {
  e.preventDefault();

  const searchUsername = $('#search-username').val();
  const foundUser = searchUser(searchUsername);

  if (foundUser) {
    // 显示搜索到的联系人（这里只是一个简单示例，您可能需要使用更复杂的逻辑来显示搜索结果）
    $('#search-result').html(`
    <div>
      ${foundUser.username}（ID: ${foundUser.id}）
      <button class="add-friend" data-user-id="${foundUser.id}">添加好友</button>
    </div>
  `);
  } else {
    $('#search-result').html('<div>该用户不存在</div>');
  }
});
//添加好友
function addFriend(userId, friendId) {
  // 获取当前用户的好友列表
  const userFriends = mockData.friends.find(friends => friends.userId === userId);
  // 获取要添加的好友的好友列表
  const friendFriends = mockData.friends.find(friends => friends.userId === friendId);

  // 如果 userFriends 或 friendFriends 为 undefined，终止函数执行并输出调试信息
  if (!userFriends || !friendFriends) {
    console.error('Unable to add friend. Check if the user and friend are in the friends list.');
    console.error('userId:', userId, 'userFriends:', userFriends);
    console.error('friendId:', friendId, 'friendFriends:', friendFriends);
    return;
  }

  // 如果要添加的好友不在当前用户的好友列表中，将其添加到列表中
  if (!userFriends.friends.includes(friendId)) {
    userFriends.friends.push(friendId);
  }
  // 如果当前用户不在要添加的好友的好友列表中，将当前用户添加到要添加好友的好友列表中
  if (!friendFriends.friends.includes(userId)) {
    friendFriends.friends.push(userId);
  }
}




function getUserFriends(userId) {
  const userFriends = mockData.friends.find(friends => friends.userId === userId);

  // 检查 userFriends 是否为 undefined
  if (userFriends === undefined) {
    return [];
  }

  return mockData.users.filter(user => userFriends.friends.includes(user.id));
}


// 在 $(document).ready(...) 函数内添加事件处理程序
$('#search-result').on('click', '.add-friend', function() {
  const friendId = parseInt($(this).attr('data-user-id'), 10);
  const currentUserId = mockData.loggedInUser.id; // 使用 loggedInUser.id

  addFriend(currentUserId, friendId);

  // 更新 loggedInUser 为添加好友后的用户对象
  mockData.loggedInUser = mockData.users.find(user => user.id === currentUserId);


  // 在这里更新联系人列表以显示新添加的好友
  renderContacts();

  // 隐藏添加好友页面，显示联系人页面
  $('#add-friend-container').hide();
  $('#contacts-container').show();
});


//渲染联系人列表
function renderContacts() {
  const userId = mockData.loggedInUser.id;
  const friends = getUserFriends(userId);
  const $contactsList = $('#contacts-list');
  $contactsList.empty();

  friends.forEach(friend => {
    const $contact = $(`
      <div class="contact" data-user-id="${friend.id}">
        <img src="${friend.avatar}" alt="${friend.nickname}">
        <span class="contact-name">${friend.nickname}</span>
        ${friend.status ? `<div class="status${friend.isTopic ? ' topic' : ''}" data-topic-id="${friend.topicId || ''}">${friend.status}</div>` : ''}
      </div>
    `);

    $contactsList.append($contact);
  });
}



function getTopicMessages(friend){

}


//为具有相同类名的返回按钮添加一个通用的点击事件处理程序
$('.back-to-contacts').click(function() {
  console.log("click back");
  // 隐藏所有功能页面
  $('#profile-container').hide();
  $('#status-container').hide();
  $('#chat-container').hide();
  $('#add-friend-container').hide();
  $('#post-status-container').hide();

  // 显示联系人页面
  $('#contacts-container').show();
});

$('#search-form').submit(function(e) {
  e.preventDefault();

  const searchUsername = $('#search-username').val();
  const foundUser = searchUser(searchUsername);

  if (foundUser) {
    // 显示搜索到的联系人（这里只是一个简单示例，您可能需要使用更复杂的逻辑来显示搜索结果）
    $('#search-result').html(`<div>${foundUser.username}（ID: ${foundUser.id}）</div>`);
  } else {
    $('#search-result').html('<div>该用户不存在</div>');
  }
});

///---------为联系人添加点击事件处理程序，用于打开聊天窗口并加载与选定联系人的聊天记录
$('#contacts-list').on('click', '.contact', function() {
  //console.log("点击联系人列表");

  //判断点击话题还是联系人
  const target = $(event.target);
  const contact = target.closest('.contact');
  const isTopic = target.hasClass('topic');
  if (contact.length && !isTopic) {
    console.log("点击:联系人");
    activeWindowType = 'contact';
      $('#topic-chat-container').hide();
      $('#normal-chat-container').show();
  }
  else if (isTopic) {
    console.log("点击:话题气泡");
    activeWindowType = 'topic';    
      $('#topic-chat-container').show();
      $('#normal-chat-container').hide();
  }

  const contactId = parseInt($(this).attr('data-user-id'), 10);

  //在这里设置获取topic的信息
  const tempTopicId = GetTempTopicId(contactId);

  selectedContactId = contactId;
  const contactName = $(this).find('span').text();

  // 在这里添加获取聊天记录的逻辑
  const conversation = getConversation(activeWindowType === 'topic'? tempTopicId : contactId);

  //清空内容
  $('#messages').html('');
  $('#topic-messages').html('');
 

// 在这里添加将聊天记录显示在聊天窗口中的逻辑
  for (const message of conversation) {
    //console.log(message);
    const isSender = message.senderId === mockData.loggedInUser.id;
    //console.log(message.senderId);
    const speaker = findUser(message.senderId);
    //console.log(speaker);
      if (activeWindowType === 'topic') {
      appendMessage(message, speaker, isSender,$('#topic-messages'));
    }
    else{
      appendMessage(message, speaker, isSender,$('#messages'));
    }    
  }

  // 设置聊天窗口标题为联系人名称
  $('#normal-chat-container h2').text(contactName);

  // 隐藏联系人列表，显示聊天窗口
  $('#contacts-container').hide(); 

  $('#chat-container').show();  
});
///-----------------

//获取该联系人的话题id
function GetTempTopicId(contactId){
  //临时
  return 123;
}

/// -----------为聊天窗口中的表单添加提交事件处理程序，用于发送消息
$('#send-message-form').submit(function(e) {
  console.log("fasongxiaoxi");
  e.preventDefault();

  const messageContent = $('#message').val();
  if (!messageContent) return;

  // 在这里添加发送消息的逻辑
  const contactId = selectedContactId;
  if (!contactId) {
    console.error('Invalid contact ID:', contactId);
    return;
  }
  let dialogId = 0;
  if (activeWindowType === 'topic'){
    dialogId = GetTempTopicId(contactId);
  }
  else{
    dialogId = contactId;

  } 
  

  mockData.conversations[dialogId] = mockData.conversations[dialogId] || [];
  const newMessage = {
    senderId: mockData.loggedInUser.id,
    content: messageContent
  };
  mockData.conversations[dialogId].push(newMessage);

  // 将消息添加到聊天窗口
  const contact = mockData.loggedInUser; // 更改为 loggedInUser
  const isCurrentUser = true;
  // 如果话题聊天窗口是当前活动窗口，则将消息添加到话题聊天窗口的消息列表
  if (activeWindowType === 'topic') {
    console.log('topic messages!!');
  console.log($('#topic-messages'));
    appendMessage(newMessage, contact, isCurrentUser, $('#topic-messages'));
  }
  // 否则，将消息添加到普通聊天窗口的消息列表
  else {
    console.log('normal messages');
    //console.log($('#messages'));
    appendMessage(newMessage, contact, isCurrentUser, $('#messages'));
  }

  // 清空输入框
  $('#message').val('');
 });
///-------

// 显示对话气泡
function appendMessage(message, contact, isCurrentUser, messageContainer) {
  //console.log("construct pop");
  const side = isCurrentUser ? 'right' : 'left';
  const who =  isCurrentUser ? 'sent' : 'received';
  const messageHtml = `
    <div class="${who}-message ${side}">
      <img src="${contact.avatar}" class="avatar">
      <div>
        <div class="nickname">${contact.nickname}</div>
        <div class="bubble">${message.content}</div>
      </div>
    </div>
  `;
  //console.log(messageHtml);
  messageContainer.append(messageHtml);
}


});

