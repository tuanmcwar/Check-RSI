


// const TelegramBot = require("node-telegram-bot-api");
// const axios = require("axios");
// const fs = require("fs");

// // ===== CẤU HÌNH =====
// const COINALYZE_API_KEY = "8f72096a-b39b-4913-8812-39b89240d2fd";
// const TELEGRAM_TOKEN = "7640879888:AAGG-YwTdCiAjimmnMZnAXDqYeNYmn78OsI";
// const CHAT_ID = "5710130520"; // ID người dùng hoặc group cần gửi cảnh báo
// const INTERVAL = "15min";
// const WATCHLIST_PATH = "../watchlist.json";

// const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
// const WATCH_FILE = './watched.json';

// function loadWatchedSymbols() {
//   if (fs.existsSync(WATCH_FILE)) {
//     return JSON.parse(fs.readFileSync(WATCH_FILE));
//   }
//   return [];
// }

// function saveWatchedSymbols() {
//   fs.writeFileSync(WATCH_FILE, JSON.stringify(watchedSymbols, null, 2));
// }

// let watchedSymbols = loadWatchedSymbols();

// async function fetchOHLCV(symbol, interval = INTERVAL) {
//   const now = Math.floor(Date.now() / 1000);
//   const to = now;
//   const from = now - 100 * 60 * 15; // 100 nến 15 phút

//   const url = `https://api.coinalyze.net/v1/ohlcv-history?symbols=${symbol}USDT_PERP.A&interval=${interval}&from=${from}&to=${to}&api_key=${COINALYZE_API_KEY}`;
//   const res = await axios.get(url);
//   const history = res.data?.[0]?.history;

//   if (!history || history.length === 0) throw new Error('Không có dữ liệu nến.');
//   return history;
// }

// function calculateRSISeries(closes, period = 14) {
//   if (closes.length < period + 1) return [];

//   const changes = [];
//   for (let i = 1; i < closes.length; i++) {
//     changes.push(closes[i] - closes[i - 1]);
//   }

//   const gains = changes.map(c => (c > 0 ? c : 0));
//   const losses = changes.map(c => (c < 0 ? -c : 0));

//   const rsiSeries = Array(closes.length).fill(null);

//   let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
//   let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

//   rsiSeries[period] = avgLoss === 0 ? 100 : avgGain === 0 ? 0 : 100 - 100 / (1 + avgGain / avgLoss);

//   for (let i = period + 1; i < closes.length; i++) {
//     avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
//     avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;

//     const rs = avgGain / avgLoss;
//     const rsi = avgLoss === 0 ? 100 : avgGain === 0 ? 0 : 100 - 100 / (1 + rs);
//     rsiSeries[i] = rsi;
//   }

//   return rsiSeries;
// }

// async function checkRSIForSymbols() {
//   for (const { symbol, conditions } of watchedSymbols) {
//     try {
//       const history = await fetchOHLCV(symbol);
//       const closes = history.map(c => c.c);
//       const times = history.map(c => c.t);
//       const rsiSeries = calculateRSISeries(closes);
//       const lastRSI = rsiSeries[rsiSeries.length - 2]; // nến kế cuối
//       const lastTime = new Date(times[times.length - 2] * 1000).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

//       if (lastRSI < conditions.oversold) {
//         bot.sendMessage(MAIN_CHAT_ID, `📉${symbol} ==> RSI = ${lastRSI.toFixed(1)} dưới ${conditions.oversold} lúc ${lastTime}`);
//       } else if (lastRSI > conditions.overbought) {
//         bot.sendMessage(MAIN_CHAT_ID, `📈${symbol} ==> RSI = ${lastRSI.toFixed(1)} trên ${conditions.overbought} lúc ${lastTime}`);
//       }
//     } catch (err) {
//       console.error(`❌ Lỗi ${symbol}:`, err.message);
//     }
//   }
// }

// // Lệnh Telegram
// bot.onText(/\/add (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const symbol = match[1].trim().toUpperCase();
//   if (!symbol) return bot.sendMessage(chatId, '❌ Symbol không hợp lệ.');

//   if (watchedSymbols.find(s => s.symbol === symbol)) {
//     return bot.sendMessage(chatId, `⚠️ Symbol ${symbol} đã tồn tại.`);
//   }

//   watchedSymbols.push({
//     symbol,
//     conditions: { overbought: 69, oversold: 30 }
//   });

//   saveWatchedSymbols();
//   bot.sendMessage(chatId, `✅ Đã thêm ${symbol} (RSI > 69 hoặc < 30).`);
// });

// bot.onText(/\/rm (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const symbol = match[1].trim().toUpperCase();
//   watchedSymbols = watchedSymbols.filter(s => s.symbol !== symbol);
//   saveWatchedSymbols();
//   bot.sendMessage(chatId, `🗑 Đã xóa ${symbol}`);
// });

// bot.onText(/\/list/, (msg) => {
//   const chatId = msg.chat.id;
//   if (watchedSymbols.length === 0) {
//     return bot.sendMessage(chatId, '📭 Chưa theo dõi symbol nào.');
//   }
//   const text = watchedSymbols.map(s => `• ${s.symbol}`                                            ).join('\n');
//   bot.sendMessage(chatId, `📋 Danh sách theo dõi:\n${text}`);
// });
// // (RSI > ${s.conditions.overbought} hoặc < ${s.conditions.oversold})`).join('\n')


// // 🔁 Kiểm tra RSI mỗi 15 phút
// const MAIN_CHAT_ID = '5710130520';
// // setInterval(checkRSIForSymbols, 5 * 60 * 1000);
// // checkRSIForSymbols(); // chạy ngay khi khởi động

// const TARGET_MINUTES = [1, 16, 31, 46];

// function scheduleNextCheck() {
//   const now = new Date();
//   const currentMinutes = now.getMinutes();
//   const currentSeconds = now.getSeconds();

//   let nextTargetMinute = TARGET_MINUTES.find(min => min > currentMinutes);

//   if (nextTargetMinute === undefined) {
//     // Nếu qua 47 rồi thì chuyển sang giờ kế tiếp
//     nextTargetMinute = TARGET_MINUTES[0];
//     now.setHours(now.getHours() + 1);
//   }

//   now.setMinutes(nextTargetMinute);
//   now.setSeconds(0);
//   now.setMilliseconds(0);

//   const delay = now.getTime() - Date.now();

//   console.log(`🕒 Lên lịch kiểm tra RSI lúc ${new Date(Date.now() + delay).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`);

//   setTimeout(async () => {
//     await checkRSIForSymbols();
//     scheduleNextCheck(); // Lên lịch lần tiếp theo
//   }, delay);
// }

// // Gọi lần đầu khi khởi động bot
// scheduleNextCheck();





const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");

// ===== CẤU HÌNH =====
const COINALYZE_API_KEY = "8f72096a-b39b-4913-8812-39b89240d2fd";
const TELEGRAM_TOKEN = "8376076069:AAEC5aiiSXAPvooDQCqYk7-cMZDoEnvSEKE";
const CHAT_ID = "5710130520";
const INTERVAL = "15min";
const WATCH_FILE = './dataRSI.json';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const MAIN_CHAT_ID = CHAT_ID;
const TARGET_MINUTES = [1, 16, 31, 46];
// const TARGET_MINUTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

// ========== Load & Save ==========
function loadWatchedSymbols() {
  if (fs.existsSync(WATCH_FILE)) {
    return JSON.parse(fs.readFileSync(WATCH_FILE));
  }
  return [];
}

function saveWatchedSymbols() {
  fs.writeFileSync(WATCH_FILE, JSON.stringify(watchedSymbols, null, 2));
}

let watchedSymbols = loadWatchedSymbols();

// ========== Fetch Data ==========
async function fetchOHLCV(symbol, interval = INTERVAL) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 100 * 60 * 15;
  const url = `https://api.coinalyze.net/v1/ohlcv-history?symbols=${symbol}&interval=${interval}&from=${from}&to=${now}&api_key=${COINALYZE_API_KEY}`;
  const res = await axios.get(url);
  const history = res.data?.[0]?.history;
  if (!history || history.length === 0) throw new Error('Không có dữ liệu nến.');
  return history;
}

function calculateRSISeries(closes, period = 14) {
  if (closes.length < period + 1) return [];
  const changes = closes.slice(1).map((c, i) => c - closes[i]);
  const gains = changes.map(c => (c > 0 ? c : 0));
  const losses = changes.map(c => (c < 0 ? -c : 0));

  const rsiSeries = Array(closes.length).fill(null);
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  rsiSeries[period] = avgLoss === 0 ? 100 : avgGain === 0 ? 0 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < closes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
    const rs = avgGain / avgLoss;
    rsiSeries[i] = avgLoss === 0 ? 100 : avgGain === 0 ? 0 : 100 - 100 / (1 + rs);
  }

  return rsiSeries;
}

// ========== RSI Check ==========
async function checkRSIForSymbols() {
  for (const { symbol,symbolName, conditions } of watchedSymbols) {
    try {
      const history = await fetchOHLCV(symbol);
      const closes = history.map(c => c.c);
      const times = history.map(c => c.t);
      const rsiSeries = calculateRSISeries(closes);
      const lastRSI = rsiSeries[rsiSeries.length - 2];
      const lastTime = new Date(times[times.length - 2] * 1000).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

      if (lastRSI < conditions.oversold) {
        bot.sendMessage(MAIN_CHAT_ID, `💰${symbolName} ➤➤➤ RSI = ${lastRSI.toFixed(1)}  Candle 🕯️ ${lastTime}`);
      } else if (lastRSI > conditions.overbought) {
        bot.sendMessage(MAIN_CHAT_ID, `💰${symbolName} ➤➤➤ RSI = ${lastRSI.toFixed(1)}  Candle 🕯️ ${lastTime}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi ${symbol}:`, err.message);
    }
  }
}

// ========== Telegram Commands ==========
bot.onText(/\/add (\w+)(?:\s+(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  let input = match[1].trim().toUpperCase();
  const overboughtCustom = match[2] ? parseInt(match[2]) : 69;

  const symbol = input.endsWith("USDT_PERP.A") ? input : `${input}USDT_PERP.A`;
  const symbolName = symbol.split("USDT_PERP.A")[0];

  if (watchedSymbols.find(s => s.symbol === symbol)) {
    return bot.sendMessage(chatId, `⚠️ Symbol ${symbol} is already in the database.`);
  }

  watchedSymbols.push({
    symbol,
    symbolName,
    conditions: { overbought: overboughtCustom, oversold: 30 }
  });

  saveWatchedSymbols();
  bot.sendMessage(chatId, `✅ Added ${symbolName} (RSI > ${overboughtCustom} OR < 30).`);
});

bot.onText(/\/rm (\w+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1].trim().toUpperCase();
  const symbol = input.endsWith("USDT_PERP.A") ? input : `${input}USDT_PERP.A`;
  const symbolName = symbol.split("USDT_PERP.A")[0];
  watchedSymbols = watchedSymbols.filter(s => s.symbol !== symbol);
  saveWatchedSymbols();
  bot.sendMessage(chatId, `🗑 Deleted ${symbolName}`);
});
bot.onText(/\/rmall/, (msg) => {
  const chatId = msg.chat.id;

  if (watchedSymbols.length === 0) {
    return bot.sendMessage(chatId, `📭 The list is empty.`);
  }

  watchedSymbols = []; // Xóa toàn bộ
  saveWatchedSymbols();

  bot.sendMessage(chatId, `🗑 Removed all symbols from watchlist.`);
});

bot.onText(/\/list/, (msg) => {
  const chatId = msg.chat.id;
  if (watchedSymbols.length === 0) {
    return bot.sendMessage(chatId, '📭 No symbol followed yet.');
  }
  const text = watchedSymbols.map(s => `• ${s.symbolName} (RSI > ${s.conditions.overbought} OR < ${s.conditions.oversold})`).join('\n');
  bot.sendMessage(chatId, `📋 Watchlist:\n${text}`);
});

// ========== Schedule RSI Checks ==========
function scheduleNextCheck() {
  const now = new Date();
  const currentMinutes = now.getMinutes();

  let nextMinute = TARGET_MINUTES.find(min => min > currentMinutes);
  if (!nextMinute) {
    nextMinute = TARGET_MINUTES[0];
    now.setHours(now.getHours() + 1);
  }

  now.setMinutes(nextMinute, 0, 0);
  const delay = now.getTime() - Date.now();

  console.log(`🕒 Lên lịch kiểm tra RSI lúc ${new Date(Date.now() + delay).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`);

  setTimeout(async () => {
    await checkRSIForSymbols();
    scheduleNextCheck();
  }, delay);
}

scheduleNextCheck();
