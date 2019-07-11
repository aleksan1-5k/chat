import 'babel-polyfill';
//import _ from 'lodash';

import './../sass/styles.scss';

// const getHeader = () => {
//   const helloWebpack = _.join(['Hello', 'webpack!'], ' ');
//   console.log(helloWebpack);
//   const element = document.createElement('h1');
//
//   element.innerHTML = helloWebpack;
//
//   return element;
// };

//document.body.appendChild(getHeader());

// const o = {
//   foo: {
//     bar: null
//   }
// };
//
// console.log(o?.foo?.bar?.baz ?? 'default');

function setUser(username) {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://studentschat.herokuapp.com/users', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Обработчик успещного ответа
      var response = request.responseText;
      //userList = Response;

      JSON.parse(response).forEach(
          function (obj) {
            console.log(obj);
            if (obj.username === username){
              console.log("entered");
            }
          }
      )
    } else {
      // Обработчик ответа в случае ошибки
    }
  };
  request.onerror = function() {
    // Обработчик ответа в случае неудачного соеденения
  };
  request.send();
  }

document.querySelector(".login_submit").addEventListener('click',function () {
  var username = document.querySelector(".user-name").value;
  setUser(username);
});

function addUser(username) {
  var request1 = new XMLHttpRequest();
  request1.open('POST', 'https://studentschat.herokuapp.com/users/register', true);

  request1.onload = function() {
    // Обработчик ответа в случае удачного соеденения
    console.log("ok");
  };

  request1.onerror = function() {
    // Обработчик ответа в случае неудачного соеденения
    console.log("not connected");
  };
  request1.setRequestHeader('Content-Type', 'application/json');

  request1.send(JSON.stringify(username));
}
document.querySelector(".registration_submit").addEventListener('click',function () {
  var username = document.querySelector(".user-name").value;
  addUser(username);
});