const telegramLink = require('telegram.link')();

telegramLink.on('connect', (data) => {
  console.log("Connected!");
  console.log(data);
})