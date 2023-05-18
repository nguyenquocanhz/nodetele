const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

// Cung cấp bot token của bạn
const botToken = '5927698294:AAHFDqaqcdxZhArt4L2Zr5x1O9gaFM-5TAk';
const bot = new TelegramBot(botToken, { polling: true });

const url = 'https://shopkcff.com/js/1.php';

const params = {
  partner_id: '2761789661',
  partner_key: '7ff3c5fee070a37d12b26f838fb35261',
};

const params1 = {
  partner_id: '0355554761',
  partner_key: '002e95ad1988fa14506600acd85b4ea0',
};

let lastRequestTime = 0;
const requestInterval = 2 * 1000; // 2 giây

function sendResponseMessage(chatId, message) {
  bot.sendMessage(chatId, message);
  lastRequestTime = Date.now();
}

bot.onText(/\/shopkcff_([34])/, (msg, match) => {
  const command = match[1];

  const currentTime = Date.now();
  const elapsedTime = currentTime - lastRequestTime;

  if (elapsedTime < requestInterval) {
    const remainingTime = requestInterval - elapsedTime;
    const remainingSeconds = remainingTime / 1000;
    const errorMessage = `Xin lỗi, bạn chỉ có thể gửi yêu cầu mỗi 2 giây. Vui lòng thử lại sau ${remainingSeconds} giây.`;
    sendResponseMessage(msg.chat.id, errorMessage);
    console.log(`Gửi lỗi: ${errorMessage}`);
    return;
  }

  let responseMessage = '';

  if (command === '3') {
    request({ url, qs: params, json: true }, (error, response, body) => {
      if (error) {
        responseMessage = 'Đã xảy ra lỗi.';
      } else if (body.status === 'success') {
        responseMessage = `${body.message}\npartner_id: ${body.partner_id}\npartner_key: ${body.partner_key}`;
      } else {
        responseMessage = body.message;
      }
      sendResponseMessage(msg.chat.id, responseMessage);
      console.log(`Gửi thành công: ${responseMessage}`);
    });
  } else if (command === '4') {
    request({ url, qs: params1, json: true }, (error, response, body) => {
      if (error) {
        responseMessage = 'Đã xảy ra lỗi.';
      } else if (body.status === 'success') {
        responseMessage = `${body.message}\npartner_id: ${body.partner_id}\npartner_key: ${body.partner_key}`;
      } else {
        responseMessage = body.message;
      }
      sendResponseMessage(msg.chat.id, responseMessage);
      console.log(`Gửi thành công: ${responseMessage}`);
    });
  } else {
    responseMessage = 'Lệnh không hợp lệ.';
    sendResponseMessage(msg.chat.id, responseMessage);
    console.log(`Lệnh không hợp lệ: ${responseMessage}`);
  }
});

console.log('Bot đang chạy...');
