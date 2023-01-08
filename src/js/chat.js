"use strict"; // strict모드 선언
//코드에 더 나은 오류 검사를 적용하는 방법
// ngrok http 3000
const socket = io();
const nickname = document.querySelector("#nickname");
const chatlist = document.querySelector(".chatting-list");
const chatinput = document.querySelector(".chatting-input");
const sendbutton = document.querySelector(".send-button");
const displaycontainer = document.querySelector(".display-container");

chatinput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    send();
    document.querySelector(".chatting-input").value = "";
  }
});

sendbutton.addEventListener("click", () => {
  if (true) {
    send();
    document.querySelector(".chatting-input").value = "";
  }
});
let member = {};
member["김지성"] = "123";
member["JiSung"] = "456";
member["자바스크립트"] = "789";
member["파이썬"] = "234";

let my_key = member;

socket.emit("Dictionary", my_key);

socket.on("connect", () => {
  while (true) {
    var newuser = prompt("반갑습니다! 이름을 적어주세요!", "");
    if (!newuser) continue;

    if (newuser in member) {
      alert("비밀번호를 입력해주세요");
    } else {
      alert("등록된 사람이 아니거나 이름을 잘못입력하였습니다.");
      continue;
    }
    const password = prompt("비밀번호를 입력해주세요", "");

    if (!password) continue;

    if (password === member[newuser]) {
      alert("환영합니다!");
      break;
    } else {
      alert("비밀번호가 맞지않습니다. 처음부터 다시 입력해주세요.");
    }
  }

  socket.emit("newuser", newuser);
});

socket.on("chatting", (data) => {
  const { name, msg, time } = data;

  const item = new Li(name, msg, time);
  item.makeLi();
  displaycontainer.scrollTo(0, displaycontainer.scrollHeight);
});

socket.on("update", (data) => {
  let outuser = "익명";
  const { name, message } = data;
  const li = document.createElement("li");
  const dom = `<span id="newdiv" class="message">(${name}:(${outuser})${message})</span>`;
  li.innerHTML = dom;
  chatlist.appendChild(li);
});

function Li(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    if (!this.msg) {
      return;
    }
    const li = document.createElement("li");
    li.classList.add(nickname.value === this.name ? "sent" : "receive");
    const dom = ` <span class="profile">
    <span class="user"><p class="my">${this.name}</p></span>
    <img
      class="image"
      src="https://placeimg.com/50/50/any"
      alt="any"
    />
  </span>
  <span class="message">${this.msg}</span>
  <span class="time"><p class="mytime">${this.time}</p></span>`;
    li.innerHTML = dom;
    chatlist.appendChild(li);
  };
}
function send() {
  const param = {
    name: nickname.value,
    msg: chatinput.value,
  };

  socket.emit("chatting", param);
}
