import 'babel-polyfill';
import './../sass/styles.scss';
let users = []; // объект с пользователями
let usernames = [];// объект с именами пользователями
var userNow = ''; // пользователь, который вошел
let userNowId = ''; // его Id
let messages = [];
let words = 0; // для отправки сообщения
let isAllSpaces = false;


//получение обьекта пользователей
var request = new XMLHttpRequest();
request.open('GET', 'https://studentschat.herokuapp.com/users', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Обработчик успещного ответа
    var response = request.responseText;

    let usersGet = JSON.parse(response).map(
        function (obj) {
          return obj;
        }
    );

    for (let i = 0; i < usersGet.length; i++) {
      users.push({});
      for (let key in usersGet[i]) {
        users[i][key] = usersGet[i][key];
      }
    }
  } else {
    // Обработчик ответа в случае ошибки
  }
};
request.onerror = function() {
  // Обработчик ответа в случае неудачного соеденения
};
request.send();

var request3 = new XMLHttpRequest();
request3.open('GET', 'https://studentschat.herokuapp.com/users', true);

request3.onload = function() {
  if (request3.status >= 200 && request3.status < 400) {
    // Обработчик успещного ответа
    var response = request3.responseText;

    let users = JSON.parse(response).map(
        function (obj) {
          return obj.username;
        }
    );

    for (let i = 0; i < users.length; i++) {
      usernames.push(users[i]);
    }

  } else {
    // Обработчик ответа в случае ошибки
  }
};
request3.onerror = function() {
  // Обработчик ответа в случае неудачного соеденения
};
request3.send();
console.log(usernames);

//вход в чат по имени
function checkUser() {
  var inputuser = document.getElementsByTagName("input")[0];
  inputuser = inputuser.value;

  let allow = false;
  usernames.forEach(
      function (usr) {
        if (usr == inputuser) allow = true;
      }
  );
  if (allow) {

    for (let i = 0; i < users.length; i++) {
      if (users[i].username == inputuser) {
        userNowId = users[i].user_id;
        break;
      }
    }
    userNow = inputuser;
    alert('Привет, ' + userNow + '!');
    var show = document.getElementById("modal_login");
    show.style.display = show.style.display = 'none';
    document.getElementById('profile').innerHTML += '<span class="name">'+ userNow +'</span>\n';
    displayMessages();
    //setInterval(displayMessages, 2000);
  }
  else {
    alert('Пользователь не найден! \n' +
        'Пожалуйста, зарегистрируйтесь!');
    //window.location.replace("http://localhost:9000/registration.html");
  }

}
document.querySelector("#text").addEventListener(onkeyup,count);
document.querySelector(".login_submit").addEventListener('click', checkUser);

//добавление нового пользователя
function registerUser() {
  var inputuser = document.getElementsByTagName("input")[0];
  inputuser = inputuser.value;

  let allow = true;
  usernames.forEach(
      function (usr) {
        if (usr == inputuser) allow = false;
      }
  );

  if (!allow) return alert('Пользователь с таким именем уже сущуствует!'+' '+'Введите другое имя');

  var request1 = new XMLHttpRequest();
  request1.open('POST', 'https://studentschat.herokuapp.com/users/register', true);

  request1.onload = function() {
    // Обработчик ответа в случае удачного соеденения
  };

  request1.onerror = function() {
    alert('error')// Обработчик ответа в случае неудачного соеденения
  };
  request1.setRequestHeader('Content-Type', 'application/json');

  request1.send(JSON.stringify({username: inputuser}));
  alert('Вы зарегистрированы под именем:'+ inputuser);
  window.location.reload();
}
document.querySelector(".registration_submit").addEventListener('click', registerUser);


function setNowTime() {
  let date = new Date();
  let time = date.getHours() + ':' + date.getMinutes() + ':' + ('0' + date.getSeconds()).slice(-2);
  document.getElementById('now_time').innerHTML = time;
  window.setTimeout(setNowTime, 1000);
}
let min = -1;
function setInOnlineTime(){
  min++;
  let timeInOnline = min + ' min';
  document.getElementById('time_in_online').innerHTML = timeInOnline;
  window.setTimeout(setInOnlineTime, 60000);
}
window.onload = setNowTime();
window.onload = setInOnlineTime();

setTimeout(displayUsers, 1000);

function displayUsers() {
  users = [];
  request.open('GET', 'https://studentschat.herokuapp.com/users', false);
  request.send();

  // подсчет активных пользователей
  var active = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].status === "active") active++;
  }

  document.getElementById('now-active').innerHTML = active;

  let friends = document.getElementsByClassName('dialogs__item');
  while (friends.length) {
    friends[0].parentNode.removeChild(friends[0]);
  }


  let status = '';
  let img = "https://visualpharm.com/assets/482/Circled%20User%20Male%20Skin%20Type%204-595b40b65ba036ed117d3de9.svg";
  for (let i = 0; i < users.length; i++) {
    if (users[i].status === "active") status = "status_online";
    if (users[i].status === "leave") status = "status_leave";
    if (users[i].status === "inactive") status = "status_offline";

    document.getElementById('dialogs').innerHTML += '<div class="dialogs__item">\n' +
        '             <img class="avatar" src=' + img + ' alt=' + img + '>\n' +
        '             <div class=' + status + '>\n' + '</div>'+
        '             <span class="username">'+users[i].username+'</span>\n'+
        '        </div>';
  }
}




// подсчет введенных символов
function count() {
  if (event.keyCode == 8) words -= 1;
    if (event.keyCode == 13) {
        document.getElementById('text').value = document.getElementById('text').value.slice(0, -1);
        sendMessage();
    }
  else words++;

  let string = document.getElementById('text').value;
  console.log(string);
  let spaces = 0;
  let allChars = string.length;
  console.log(allChars);
  let punctChars = 0;
  let letters = 0;
  let compareLetters = /[A-Z]|[a-z]|[а-я]|[А-Я]/;

  for (let i = 0; i < string.length; i++){
    if (string[i] === ' ') spaces++;
    if (string[i] === '.' || string[i] === ',' || string[i] === '!' || string[i] === '?' || string[i] === ':' || string[i] === ';'
        || string[i] === '-') punctChars++;
    if (compareLetters.test(string[i])) letters++;
  }

  console.log(allChars);
  console.log(punctChars);
  console.log(letters);

  document.getElementById('spaces').innerHTML = spaces;
  document.getElementById('allChars').innerHTML = allChars;
  document.getElementById('punctChars').innerHTML = punctChars;
  document.getElementById('letters').innerHTML = letters;

  if (allChars == spaces) isAllSpaces = true;
  else isAllSpaces = false;
}

document.querySelector("#text").addEventListener("onkeypress",count);

document.querySelector(".send").addEventListener('click', sendMessage);

function sendMessage() {
  var message = document.getElementById('text').value;

  if (message.length > 500) return alert('Максимальная длина сообщения не должна превышать 500 символов!');

  document.getElementById('massage-box').innerHTML += '<div class="massage out">' + message +
      '</div>';
  words = 0;

  let date = new Date().toISOString();

  messages.push({"user_id":userNowId,"message":document.getElementById('text').value,"chatroom_id":"MAIN","datetime":date});

  //отправка на сервер
  var request1 = new XMLHttpRequest();
  request1.open('POST', 'https://studentschat.herokuapp.com/messages', false);

  request1.onload = function() {
    // Обработчик ответа в случае удачного соеденения
  };

  request1.onerror = function() {
    alert('error')// Обработчик ответа в случае неудачного соеденения
  };
  request1.setRequestHeader('Content-Type', 'application/json');

  request1.send(JSON.stringify({
    datetime: date,
    message: document.getElementById('text').value,
    user_id: userNowId
  }));
  document.getElementById('text').value = '';

  count();
}

function bold() {
    document.getElementById('text').value += '<b></b>';
    document.getElementById('text').focus();
    document.getElementById('text').setSelectionRange(document.getElementById('text').value.length - 4,
        document.getElementById('text').value.length - 4);
    words -= 1;
    count();
}

function italic() {
    document.getElementById('text').value += '<i></i>';
    document.getElementById('text').focus();
    document.getElementById('text').setSelectionRange(document.getElementById('text').value.length - 4,
        document.getElementById('text').value.length - 4);
    words -= 1;
    count();
}

function underline() {
    document.getElementById('text').value += '<u></u>';
    document.getElementById('text').focus();
    document.getElementById('text').setSelectionRange(document.getElementById('text').value.length - 4,
        document.getElementById('text').value.length - 4);
    words -= 1;
    count();
}

function lineBreak() {
    document.getElementById('text').value += '<br>';
    document.getElementById('text').focus();
    words -= 1;
    count();
}
document.querySelector(".cursive").addEventListener('click', italic);
document.querySelector(".underlined").addEventListener('click',underline );
document.querySelector(".bold").addEventListener('click', bold);


function displayMessages() {
    let continueDo = true;
    let daysAgo = 0;

    var request = new XMLHttpRequest();
    request.open('GET', 'https://studentschat.herokuapp.com/messages', false);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Обработчик успещного ответа
            var response = request.responseText;

            let usersGet = JSON.parse(response).map(
                function (obj) {
                    return obj;
                }
            );

            if (usersGet.length == messages.length && messages[messages.length - 1] != '') return continueDo = false;
            messages = [];
            for (let i = 0; i < usersGet.length; i++) {
                messages.push({});
                for ( let key in usersGet[i]) {
                    messages[i][key] = usersGet[i][key];
                }
            }

        } else {
            // Обработчик ответа в случае ошибки
        }
    };

    request.onerror = function() {
        // Обработчик ответа в случае неудачного соеденения
    };
    request.send();

    if (continueDo == false) return;

    document.getElementById('massage-box').innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        let date = Date.parse(messages[i].datetime);
        date = new Date(date);
        date = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        let message = messages[i].message;
        console.log(message);

        //-----кусок который ДОЛЖЕН считать все мои отправленые сообщения
        var mymsg = 0;
        if (messages[i].user_id == userNowId) {
            mymsg++;
        }
        document.getElementById('no-reads-msg').innerHTML = mymsg;
        ////----------

        daysAgo = (Date.now() - Date.parse(messages[i].datetime)) / 8.64e7 ^ 0;
        if (daysAgo == 0) daysAgo = 'Сегодня';
        else if (daysAgo == 1) daysAgo = 'Вчера';
        else daysAgo = daysAgo + ' дня назад';

        // если дата повторяется
        let dateLast = [];
        if (document.getElementsByClassName('days-ago').length != 0) dateLast = document.getElementsByClassName('days-ago')[document.getElementsByClassName('days-ago').length - 1].textContent.trim();
        if (dateLast == daysAgo) {
            // если сообщение от userNow
            if (messages[i].user_id == userNowId) {
                document.getElementById('massage-box').innerHTML +='</div>' +
                    '<div class="massage out">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }
            // если сообщение от того же юзера
            else if (i != 0 && messages[i].user_id == messages[i - 1].user_id) {
                document.getElementById('massage-box').innerHTML +='</div>' +
                    '<div class="massage in">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }

            else {
                document.getElementById('massage-box').innerHTML +='</div>' +
                    '<div class="name_in_msg">' + getName(messages[i].user_id) + '</div>' + '<div class="massage in">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }
        }
        else {
            // дата не повторяется
            // если сообщение от userNow
            if (messages[i].user_id == userNowId) {
                document.getElementById('massage-box').innerHTML += '<div class="days-ago"><hr>' + daysAgo + '</div>' +
                    '<div class="massage out">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }
            // если сообщение от того же юзера
            else if (i != 0 && messages[i].user_id == messages[i - 1].user_id) {
                document.getElementById('massage-box').innerHTML += '<div class="days-ago"><hr>' + daysAgo + '</div>' +
                    '<div class="massage in">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }

            else {
                document.getElementById('massage-box').innerHTML += '<div class="days-ago"><hr>' + daysAgo + '</div>' +
                    '<div class="name_in_msg">' + getName(messages[i].user_id) + '</div>' + '<div class="massage in">' + message +
                    '<br><span class="date">' + date + '</span></div>';
            }
        }
    }
    setTimeout(scrollBottom, 10); // БАГ
}

function getName(userId) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].user_id == userId) return users[i].username;
    }
}
function scrollBottom() {
    document.getElementById('massage-box').scrollTop = document.getElementById('massage-box').scrollHeight;
}



