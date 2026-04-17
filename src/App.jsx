import React, { useState, useEffect, useRef } from 'react';

// ─── 常數 ────────────────────────────────────────────────────────
const STATUSES = ['待剪輯', '腳本完成', '素材齊全', '剪輯中', '已發布'];

const STATUS_COLORS = {
  '待剪輯':  { bg: '#F0EBE4', text: '#9E9488' },
  '腳本完成': { bg: '#D4E8D4', text: '#4A7A4A' },
  '素材齊全': { bg: '#D4DCF0', text: '#3A4A8A' },
  '剪輯中':  { bg: '#F0E0C0', text: '#8A5A10' },
  '已發布':  { bg: '#B8A99A', text: '#fff'    },
};

const TYPE_COLORS = {
  '攻略型': '#8B9E8A',
  '雞湯型': '#C4A882',
  '輕量型': '#9AAAB8',
};

// 常用音效和特效選項
const COMMON_SOUND_EFFECTS = [
  '-',
  '心跳加速音效',
  '反轉音效 (Ding)',
  '彈跳音效',
  '歡呼音效',
  '鼓掌音效',
  '戲劇化音效',
  '加粗強調詞',
];

const COMMON_TEXT_EFFECTS = [
  '-',
  '數字彈跳效果',
  '文字放大',
  '逐字浮現',
  'Icon 彈出',
  '文字閃爍',
  '下劃線強調',
  '顏色變化',
];

const INITIAL_TOPICS = [
  // 印尼
  { id: 'indo-1',  title: '論爬印尼火山要多早起',         country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-2',  title: '布羅莫日出交通',               country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-3',  title: '布羅莫一生一定要去看一次日出', country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-4',  title: '布羅莫女生不怕冷',             country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-5',  title: '布羅莫騎馬+費用',              country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-6',  title: '布羅莫爬階梯很累嗎',           country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-7',  title: '謝謝布羅莫專業攝影師麥麥',     country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-8',  title: 'sewu瀑布下去很危險嗎',         country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-9',  title: 'sewu瀑布要相信嚮導',           country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-10', title: 'sewu瀑布要記得跟嚮導拿原檔',   country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-11', title: 'sewu瀑布很冷',                 country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-12', title: '泗水塞車地獄 當地節慶',         country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-13', title: '很開心知道宜真可以爬ㄌ+介紹',  country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-14', title: '宜真拍照出大片要走下去',       country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-15', title: '宜真硫磺不能帶回台灣',         country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-16', title: '宜真藍寶堅尼是什麼?多少錢?', country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-17', title: '宜真下雨ㄏㄏ 買雨衣多少錢',    country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-18', title: '宜真沒有樹了 也沒有藍火',      country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-19', title: '宜真沒有藍火建議晚一點出發',   country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-20', title: '魔戒森林找攝影師拍照',         country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-21', title: '魔戒森林形象影片',             country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-22', title: '去峇里島搭船',                 country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-23', title: '終於吃好吃的晚餐了',           country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-24', title: '追海豚要很早起',               country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-25', title: '海豚們好好看',                 country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-26', title: '水神廟啥都沒有',               country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-27', title: '水神廟可愛的我們',             country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-28', title: '烏布市集',                     country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-29', title: '沙灘酒吧合集',                 country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-30', title: '佩尼達島很糟糕',               country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-31', title: '精靈墜崖嚮導拍照很賣力',       country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-32', title: '精靈墜崖拍照很水',             country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-33', title: '精靈墜崖什麼收費都超貴',       country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-34', title: '賽梅魯火山拍照機位',           country: '印尼', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'indo-35', title: '賽梅魯火山拍照超多人',         country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-36', title: '克萊兒小公主合集',             country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'indo-37', title: '李寧很瘋很可憐合集',           country: '印尼', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  // 印尼加碼雞湯型
  { id: 'indo-38', title: '出發前一天超崩潰,但去了就好了', country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-39', title: '在異國感到孤獨的那個瞬間',      country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'indo-40', title: '我在峇里島想通了一件事',        country: '印尼', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },

  // 新疆
  { id: 'xj-1',  title: '上海外灘拍照打卡點、時間',       country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-2',  title: '上海蟹皇麵',                     country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-3',  title: '烏魯木齊紅山公園',               country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-4',  title: '國際大巴紮逛街、打車下車點',     country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-5',  title: '國際大巴紮拍照攻略',             country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-6',  title: '天山天池拍照打卡點',             country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-7',  title: '天山天池游船攻略',               country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-8',  title: '新疆維吾爾博物館展區',           country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-9',  title: '達版城',                         country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-10', title: '葡萄溝',                         country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-11', title: '火焰山',                         country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-12', title: '沙漠',                           country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-13', title: '沙漠拍照',                       country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-14', title: '蘇公塔',                         country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-15', title: '買葡萄',                         country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-16', title: '葡萄表演',                       country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-17', title: '葡萄夜市',                       country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-18', title: '按摩',                           country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-19', title: '葡萄夜市心上人',                 country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-20', title: '天山明月城',                     country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-21', title: '天山明月城吊鋼絲',               country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-22', title: '拍照花絮',                       country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-23', title: '騎馬小哥哥',                     country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-24', title: '金凌台日落',                     country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-25', title: '南山牧場包車費用',               country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-26', title: '南山牧場拍照點',                 country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-27', title: '北京天安門打卡',                 country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'xj-28', title: '北京老火鍋超貴開箱',             country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-29', title: '中國飲料店評比',                 country: '新疆', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'xj-30', title: '晨風旅行社推薦',                 country: '新疆', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  // 新疆加碼雞湯型
  { id: 'xj-31', title: '第一次去中國自由行在想什麼',      country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-32', title: '新疆讓我重新定義「美」',          country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'xj-33', title: '旅行的途中想家了怎麼辦',          country: '新疆', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },

  // 泰國
  { id: 'th-1',  title: '機票姓名錯誤災難',                       country: '泰國', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'th-2',  title: '鄭王廟拍攝店家 攝影師 費用',             country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-3',  title: '泰國吃到飽 799 一定要吃這家',            country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-4',  title: '曼谷就是買買買',                         country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-5',  title: '雨季的曼谷',                             country: '泰國', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'th-6',  title: 'P人情侶合輯',                            country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-7',  title: '自駕行程',                               country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-8',  title: '自駕費用',                               country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-9',  title: '自駕全部住宿開箱',                       country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-10', title: '斯米蘭介紹',                             country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-11', title: '斯米蘭費用',                             country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-12', title: '普吉島最喜歡的夜市',                     country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-13', title: '普吉島一日遊:黑岩石、大佛、查龍寺',     country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-14', title: '攀牙國家公園',                           country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-15', title: '三百峰國家公園',                         country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-16', title: '神奇的攀牙居民',                         country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-17', title: '泰國跟緬甸最近的燈塔',                   country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-18', title: '春蓬溫泉',                               country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-19', title: '美功水上市場',                           country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-20', title: '北壁是個什麼樣的地方',                   country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-21', title: '愛侶彎國家公園',                         country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-22', title: '死亡鐵路',                               country: '泰國', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'th-23', title: '北壁的🍃很便宜',                         country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-24', title: '曼谷上CF團課體驗',                       country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-25', title: '很讚的villa開箱',                        country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'th-26', title: '古城高爾夫球車體驗',                     country: '泰國', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  // 泰國加碼雞湯型
  { id: 'th-27', title: '一個人自駕泰國南部是什麼感覺',           country: '泰國', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'th-28', title: '泰國讓我放下了什麼',                     country: '泰國', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },

  // 紐西蘭
  { id: 'nz-1', title: '人生迷茫買紐西蘭機票',   country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'nz-2', title: '很多人一直出國的原因',   country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'nz-3', title: '行程介紹',              country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-4', title: '住宿費用開箱',          country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-5', title: '紐西蘭露營車注意事項',  country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-6', title: '露營區怎麼找',          country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-7', title: '20晚住宿不到一萬元',    country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  // 紐西蘭加碼
  { id: 'nz-8',  title: '露營車裡的一個人時光',           country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'nz-9',  title: '紐西蘭的星空讓我哭了',           country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'nz-10', title: '紐西蘭自駕不能不知道的事',       country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-11', title: '紐西蘭超市購物攻略',             country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-12', title: '南島到北島怎麼移動',             country: '紐西蘭', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'nz-13', title: '旅伴吵架了之後',                 country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'nz-14', title: '在紐西蘭過生日是什麼感受',       country: '紐西蘭', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },

  // 北海道
  { id: 'jp-1',  title: '札幌掛急診教學',                 country: '北海道', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'jp-2',  title: '頭大佛一日遊',                   country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'jp-3',  title: '定山溪漂流體驗',                 country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  // 北海道加碼
  { id: 'jp-4',  title: '北海道拉麵真的比較好吃嗎',       country: '北海道', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'jp-5',  title: '狸小路怎麼逛才不踩雷',           country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'jp-6',  title: '在北海道的便利商店過了一整天',   country: '北海道', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'jp-7',  title: '我在北海道一個人泡湯的夜晚',     country: '北海道', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'jp-8',  title: '北海道冬天穿搭實測',             country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'jp-9',  title: '小樽運河拍照攻略',               country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'jp-10', title: '旭川動物園企鵝遊行',             country: '北海道', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'jp-11', title: '得病在異國是什麼感覺',           country: '北海道', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'jp-12', title: '北海道JR Pass值得買嗎',          country: '北海道', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },

  // 南方四島
  { id: 'tw-1',  title: '搭船拉～',                       country: '南方四島', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'tw-2',  title: '潛水好看東東',                   country: '南方四島', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  // 南方四島加碼
  { id: 'tw-3',  title: '南方四島怎麼報名才搶得到',       country: '南方四島', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'tw-4',  title: '南方四島帶什麼裝備',             country: '南方四島', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'tw-5',  title: '浮潛不會游泳可以去嗎',           country: '南方四島', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'tw-6',  title: '台灣其實有世界級的海',           country: '南方四島', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'tw-7',  title: '第一次看到熱帶魚在台灣海域',     country: '南方四島', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'tw-8',  title: '東吉嶼上面住了什麼人',           country: '南方四島', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  { id: 'tw-9',  title: '暈船了怎麼辦',                   country: '南方四島', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },

  // 沙板
  { id: 'sb-1',  title: '熱身',                           country: '沙板', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'sb-2',  title: '大家在玩',                       country: '沙板', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
  // 沙板加碼
  { id: 'sb-3',  title: '沙板新手入門完全攻略',           country: '沙板', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'sb-4',  title: '沙板一定會摔跤,然後呢',         country: '沙板', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'sb-5',  title: '沙板需要買什麼裝備',             country: '沙板', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'sb-6',  title: '第一次站上沙板的感覺',           country: '沙板', type: '雞湯型', status: '待剪輯', estimatedTime: 60, script: '', materials: [], scriptTable: [] },
  { id: 'sb-7',  title: '沙板跟滑板有什麼不一樣',         country: '沙板', type: '攻略型', status: '待剪輯', estimatedTime: 90, script: '', materials: [], scriptTable: [] },
  { id: 'sb-8',  title: '我學沙板學了多久才敢出去玩',     country: '沙板', type: '輕量型', status: '待剪輯', estimatedTime: 30, script: '', materials: [], scriptTable: [] },
];

// 腳本提示詞產生器
const generateScriptPrompt = (topic) => {
  const typeGuide = {
    '攻略型': `請以實用旅遊攻略的角度,寫一段30秒短影音的腳本大綱。
結構:Hook(前3秒吸引人的問題或數字)→ 重點資訊(20秒)→ CTA(7秒)
風格:口語、直接、乾貨滿滿`,
    '雞湯型': `請以個人成長、情感共鳴的角度,寫一段30秒短影音的腳本大綱。
結構:情緒Hook(前3秒)→ 故事/感受描述(20秒)→ 金句收尾(7秒)
風格:真實、有溫度、引發共鳴`,
    '輕量型': `請以輕鬆日常vlog的角度,寫一段15秒短影音的腳本大綱。
結構:畫面描述(10秒)→ 一句話金句/吐槽(5秒)
風格:隨興、好笑、有個性`,
  };

  return `主題:${topic.title}
國家/地點:${topic.country}
影片類型:${topic.type}

${typeGuide[topic.type] || typeGuide['攻略型']}

請直接給我腳本大綱,不需要解釋。`;
};

// 導出函數
const exportScriptTableAsText = (scriptTable, topic) => {
  if (!scriptTable || scriptTable.length === 0) {
    return `【${topic.title} - 分鏡腳本】\n尚無內容`;
  }
  
  let text = `【${topic.title} - 分鏡腳本】\n`;
  text += `國家/地點: ${topic.country} | 類型: ${topic.type} | 預估時長: ${topic.estimatedTime}秒\n`;
  text += '═'.repeat(50) + '\n\n';
  
  scriptTable.forEach((row, i) => {
    text += `第 ${i + 1} 句\n`;
    text += `口白: ${row.口白 || '-'}\n`;
    text += `音效: ${row.音效 || '-'}\n`;
    text += `字幕特效: ${row.字幕特效 || '-'}\n`;
    text += `字卡: ${row.字卡 || '-'}\n`;
    text += '─'.repeat(50) + '\n\n';
  });
  
  text += `總共 ${scriptTable.length} 句 | 預估時長: ${topic.estimatedTime}秒\n`;
  return text;
};

const exportScriptTableAsCSV = (scriptTable) => {
  if (!scriptTable || scriptTable.length === 0) {
    return '口白,音效,字幕特效,字卡\n';
  }
  
  let csv = '口白,音效,字幕特效,字卡\n';
  scriptTable.forEach(row => {
    const escape = (str) => {
      if (!str) return '';
      return `"${String(str).replace(/"/g, '""')}"`;
    };
    csv += `${escape(row.口白)},${escape(row.音效)},${escape(row.字幕特效)},${escape(row.字卡)}\n`;
  });
  return csv;
};

const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── 主 App ─────────────────────────────────────────────────────
const App = () => {
  const [topics, setTopics] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [view, setView] = useState('calendar');
  const [filterCountry, setFilterCountry] = useState('全部');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [libraryView, setLibraryView] = useState('card');
  const [editingTopic, setEditingTopic] = useState(null);
  const [detailTopic, setDetailTopic] = useState(null);
  const [dragTopicId, setDragTopicId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem('topics_v2');
      const s = localStorage.getItem('schedule_v2');
      setTopics(t ? JSON.parse(t) : INITIAL_TOPICS);
      setSchedule(s ? JSON.parse(s) : {});
    } catch { setTopics(INITIAL_TOPICS); }
  }, []);

  useEffect(() => {
    if (topics.length) localStorage.setItem('topics_v2', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  const countries = ['全部', ...new Set(topics.map(t => t.country))];

  const stats = {
    total: topics.length,
    published: topics.filter(t => t.status === '已發布').length,
    scheduled: Object.keys(schedule).length,
    draft: topics.filter(t => t.status === '待剪輯').length,
  };

  const handleDrop = (day, topicId) => {
    setSchedule(prev => ({ ...prev, [day]: topicId }));
    setTopics(prev => prev.map(t =>
      t.id === topicId && t.status === '待剪輯' ? { ...t, status: '腳本完成' } : t
    ));
  };

  const removeSchedule = (day) => {
    setSchedule(prev => { const n = { ...prev }; delete n[day]; return n; });
  };

  const updateTopic = (updated) => {
    setTopics(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const addTopic = (topic) => {
    const id = 'custom-' + Date.now();
    setTopics(prev => [...prev, { ...topic, id, script: '', materials: [], scriptTable: [] }]);
  };

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    setSchedule(prev => {
      const n = { ...prev };
      Object.keys(n).forEach(k => { if (n[k] === id) delete n[k]; });
      return n;
    });
  };

  const exportJSON = () => {
    const data = JSON.stringify({ topics, schedule }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `100days-backup-${Date.now()}.json`; a.click();
  };

  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.topics) setTopics(data.topics);
        if (data.schedule) setSchedule(data.schedule);
      } catch { alert('JSON 格式錯誤'); }
    };
    reader.readAsText(file);
  };

  const filteredTopics = topics.filter(t => {
    if (filterCountry !== '全部' && t.country !== filterCountry) return false;
    if (filterType !== '全部' && t.type !== filterType) return false;
    if (filterStatus !== '全部' && t.status !== filterStatus) return false;
    return true;
  });

  const copyPrompt = (topic) => {
    navigator.clipboard.writeText(generateScriptPrompt(topic)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4F0', fontFamily: "'Noto Serif TC', 'Georgia', serif" }}>

      {/* ── Header ── */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #E8E2DC',
        padding: '20px 40px', position: 'sticky', top: 0, zIndex: 200,
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#2C2820', letterSpacing: 1 }}>
              ✈️ 100天日更計畫
            </h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={exportJSON} style={btnStyle('#6B8F71', '#fff')}>⬇ 匯出備份</button>
              <label style={{ ...btnStyle('#8B7355', '#fff'), cursor: 'pointer' }}>
                ⬆ 匯入
                <input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {[['calendar','📅 日曆排程'], ['library','📚 主題庫'], ['dashboard','📊 儀表板']].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  border: '2px solid', transition: 'all .2s',
                  borderColor: view === v ? '#8B7355' : '#D4C8BC',
                  background: view === v ? '#8B7355' : 'transparent',
                  color: view === v ? '#fff' : '#6B6055',
                }}
              >{label}</button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 28 }}>
              {[['✅ 已發布', stats.published, '#6B8F71'], ['📅 已排程', stats.scheduled, '#8B7355'], ['✏️ 待剪輯', stats.draft, '#C4946A']].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#A09488' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px' }}>
        {view === 'calendar' && (
          <CalendarView
            schedule={schedule} topics={topics}
            onDrop={handleDrop} onRemove={removeSchedule}
            dragTopicId={dragTopicId} setDragTopicId={setDragTopicId}
            onOpenDetail={setDetailTopic}
          />
        )}
        {view === 'library' && (
          <LibraryView
            topics={filteredTopics} allTopics={topics}
            filterCountry={filterCountry} filterType={filterType} filterStatus={filterStatus}
            countries={countries}
            onFilterCountry={setFilterCountry} onFilterType={setFilterType} onFilterStatus={setFilterStatus}
            libraryView={libraryView} setLibraryView={setLibraryView}
            onEdit={setEditingTopic} onDelete={deleteTopic} onAddNew={() => setEditingTopic('new')}
            onOpenDetail={setDetailTopic}
            dragTopicId={dragTopicId} setDragTopicId={setDragTopicId}
          />
        )}
        {view === 'dashboard' && (
          <DashboardView stats={stats} topics={topics} schedule={schedule} />
        )}
      </main>

      {/* ── Edit Modal ── */}
      {editingTopic && (
        <EditModal
          topic={editingTopic === 'new' ? null : editingTopic}
          onSave={(t) => { editingTopic === 'new' ? addTopic(t) : updateTopic(t); setEditingTopic(null); }}
          onClose={() => setEditingTopic(null)}
        />
      )}

      {/* ── Detail Modal ── */}
      {detailTopic && (
        <DetailModal
          topic={detailTopic}
          onClose={() => setDetailTopic(null)}
          onSave={(updated) => { updateTopic(updated); setDetailTopic(updated); }}
          onCopyPrompt={copyPrompt}
          copied={copied}
        />
      )}

      {copied && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: '#2C2820', color: '#fff', padding: '12px 24px',
          borderRadius: 12, fontSize: 14, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}>
          ✅ 已複製!
        </div>
      )}
    </div>
  );
};

// ─── 日曆視圖 ────────────────────────────────────────────────────
const CalendarView = ({ schedule, topics, onDrop, onRemove, dragTopicId, setDragTopicId, onOpenDetail }) => {
  const weeks = [];
  for (let i = 0; i < 100; i += 7) {
    weeks.push(Array.from({ length: Math.min(7, 100 - i) }, (_, j) => i + j + 1));
  }

  return (
    <div>
      <h2 style={sectionTitle}>100天排程日曆</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: `repeat(${week.length}, 1fr)`, gap: 8 }}>
            {week.map(day => (
              <DayCell
                key={day} day={day}
                topic={schedule[day] ? topics.find(t => t.id === schedule[day]) : null}
                onDrop={onDrop} onRemove={onRemove}
                dragTopicId={dragTopicId}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 20, fontSize: 13, color: '#A09488', textAlign: 'center' }}>
        💡 在主題庫拖拉卡片到日期格子上排程
      </p>
    </div>
  );
};

const DayCell = ({ day, topic, onDrop, onRemove, dragTopicId, onOpenDetail }) => {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onDrop(day, id);
      }}
      style={{
        border: `2px ${over ? 'solid' : 'dashed'}`,
        borderColor: over ? '#8B7355' : topic ? '#D4C8BC' : '#E8E2DC',
        borderRadius: 10, padding: '10px 8px', minHeight: 88,
        background: over ? '#FAF5F0' : topic ? '#fff' : '#FAFAF8',
        transition: 'all .15s', cursor: topic ? 'default' : 'default',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#B0A898', marginBottom: 4 }}>Day {day}</div>
      {topic ? (
        <div>
          <div style={{
            display: 'inline-block', padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 600,
            background: TYPE_COLORS[topic.type], color: '#fff', marginBottom: 4,
          }}>{topic.type}</div>
          <div
            onClick={() => onOpenDetail(topic)}
            style={{ fontSize: 11, color: '#3C3028', lineHeight: 1.4, marginBottom: 4, cursor: 'pointer',
              textDecoration: 'underline', textDecorationColor: '#C4B8AC' }}
          >{topic.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <StatusBadge status={topic.status} small />
            <button onClick={() => onRemove(day)} style={{ ...tinyBtn('#E8E2DC', '#9E9488'), marginLeft: 'auto' }}>✕</button>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 10, color: '#C8C0B8', textAlign: 'center', marginTop: 18 }}>拖拉主題</div>
      )}
    </div>
  );
};

// ─── 主題庫 ───────────────────────────────────────────────────────
const LibraryView = ({
  topics, allTopics, filterCountry, filterType, filterStatus, countries,
  onFilterCountry, onFilterType, onFilterStatus,
  libraryView, setLibraryView, onEdit, onDelete, onAddNew, onOpenDetail,
  dragTopicId, setDragTopicId,
}) => {
  return (
    <div>
      {/* 工具列 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ ...sectionTitle, margin: 0 }}>主題庫 <span style={{ fontSize: 14, fontWeight: 400, color: '#A09488' }}>({topics.length} 個主題)</span></h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filterCountry} onChange={e => onFilterCountry(e.target.value)} style={selectStyle}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={e => onFilterType(e.target.value)} style={selectStyle}>
            <option value="全部">全部類型</option>
            <option value="攻略型">攻略型</option>
            <option value="雞湯型">雞湯型</option>
            <option value="輕量型">輕量型</option>
          </select>
          <select value={filterStatus} onChange={e => onFilterStatus(e.target.value)} style={selectStyle}>
            <option value="全部">全部狀態</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: 'flex', border: '1px solid #D4C8BC', borderRadius: 8, overflow: 'hidden' }}>
            {[['card','⊞'], ['table','☰']].map(([v, icon]) => (
              <button key={v} onClick={() => setLibraryView(v)}
                style={{
                  padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: 16,
                  background: libraryView === v ? '#8B7355' : '#fff',
                  color: libraryView === v ? '#fff' : '#8B7355',
                }}
              >{icon}</button>
            ))}
          </div>
          <button onClick={onAddNew} style={btnStyle('#2C2820', '#fff')}>＋ 新增主題</button>
        </div>
      </div>

      {/* 卡片 / 表格 */}
      {libraryView === 'card' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} onEdit={onEdit} onDelete={onDelete} onOpenDetail={onOpenDetail} setDragTopicId={setDragTopicId} />
          ))}
        </div>
      ) : (
        <TopicTable topics={topics} onEdit={onEdit} onDelete={onDelete} onOpenDetail={onOpenDetail} setDragTopicId={setDragTopicId} />
      )}
    </div>
  );
};

const TopicCard = ({ topic, onEdit, onDelete, onOpenDetail, setDragTopicId }) => {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', topic.id);
        setDragging(true); setDragTopicId(topic.id);
      }}
      onDragEnd={() => { setDragging(false); setDragTopicId(null); }}
      style={{
        background: '#fff', borderRadius: 12, padding: 18,
        border: '1px solid #E8E2DC', opacity: dragging ? .5 : 1,
        transition: 'all .2s', cursor: 'grab',
        boxShadow: dragging ? '0 8px 24px rgba(0,0,0,.12)' : '0 1px 4px rgba(0,0,0,.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <TypeBadge type={topic.type} />
        <StatusBadge status={topic.status} />
      </div>
      <h3
        onClick={() => onOpenDetail(topic)}
        style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#2C2820', cursor: 'pointer',
          lineHeight: 1.5, textDecoration: 'underline', textDecorationColor: '#D4C8BC' }}
      >{topic.title}</h3>
      <div style={{ fontSize: 12, color: '#A09488', marginBottom: 10 }}>📍 {topic.country}　⏱ {topic.estimatedTime}min</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onOpenDetail(topic)} style={tinyBtn('#E8F4EC', '#4A7A4A')}>📝 腳本</button>
        <button onClick={() => onEdit(topic)} style={tinyBtn('#F0EBE4', '#8B7355')}>✏️ 編輯</button>
        <button onClick={() => { if (confirm('確定刪除?')) onDelete(topic.id); }} style={tinyBtn('#FEF0EC', '#C0503A')}>🗑</button>
      </div>
    </div>
  );
};

const TopicTable = ({ topics, onEdit, onDelete, onOpenDetail, setDragTopicId }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E2DC', overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#F7F4F0', borderBottom: '2px solid #E8E2DC' }}>
          {['', '標題', '國家', '類型', '狀態', '時間', '操作'].map(h => (
            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#8B7355' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {topics.map((topic, i) => (
          <tr key={topic.id}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('text/plain', topic.id); setDragTopicId(topic.id); }}
            onDragEnd={() => setDragTopicId(null)}
            style={{ borderBottom: '1px solid #F0EBE4', cursor: 'grab',
              background: i % 2 === 0 ? '#fff' : '#FDFBF9',
              transition: 'background .15s',
            }}
          >
            <td style={{ padding: '10px 14px', color: '#C0B8B0', fontSize: 12 }}>⠿</td>
            <td style={{ padding: '10px 14px' }}>
              <span onClick={() => onOpenDetail(topic)}
                style={{ fontSize: 13, color: '#2C2820', cursor: 'pointer', fontWeight: 600,
                  textDecoration: 'underline', textDecorationColor: '#D4C8BC' }}
              >{topic.title}</span>
            </td>
            <td style={{ padding: '10px 14px', fontSize: 12, color: '#6B6055' }}>{topic.country}</td>
            <td style={{ padding: '10px 14px' }}><TypeBadge type={topic.type} /></td>
            <td style={{ padding: '10px 14px' }}><StatusBadge status={topic.status} /></td>
            <td style={{ padding: '10px 14px', fontSize: 12, color: '#A09488' }}>{topic.estimatedTime}min</td>
            <td style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => onOpenDetail(topic)} style={tinyBtn('#E8F4EC', '#4A7A4A')}>📝</button>
                <button onClick={() => onEdit(topic)} style={tinyBtn('#F0EBE4', '#8B7355')}>✏️</button>
                <button onClick={() => { if (confirm('確定刪除?')) onDelete(topic.id); }} style={tinyBtn('#FEF0EC', '#C0503A')}>🗑</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── 編輯 Modal ───────────────────────────────────────────────────
const EditModal = ({ topic, onSave, onClose }) => {
  const isNew = !topic;
  const [form, setForm] = useState(topic || {
    title: '', country: '', type: '攻略型', status: '待剪輯', estimatedTime: 60,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 480, maxWidth: '95vw' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 18, color: '#2C2820' }}>
          {isNew ? '➕ 新增主題' : '✏️ 編輯主題'}
        </h2>
        <FieldRow label="標題">
          <input value={form.title} onChange={e => set('title', e.target.value)}
            style={inputStyle} placeholder="影片標題" />
        </FieldRow>
        <FieldRow label="國家 / 地點">
          <input value={form.country} onChange={e => set('country', e.target.value)}
            style={inputStyle} placeholder="例如:印尼、北海道" />
        </FieldRow>
        <FieldRow label="類型">
          <select value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
            <option>攻略型</option><option>雞湯型</option><option>輕量型</option>
          </select>
        </FieldRow>
        <FieldRow label="狀態">
          <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FieldRow>
        <FieldRow label="預估時間(分鐘)">
          <input type="number" value={form.estimatedTime} onChange={e => set('estimatedTime', parseInt(e.target.value))}
            style={inputStyle} />
        </FieldRow>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={onClose} style={btnStyle('#E8E2DC', '#6B6055')}>取消</button>
          <button onClick={() => { if (!form.title || !form.country) return alert('標題和地點必填'); onSave(form); }}
            style={btnStyle('#8B7355', '#fff')}>{isNew ? '新增' : '儲存'}</button>
        </div>
      </div>
    </Overlay>
  );
};

// ─── 詳細/腳本 Modal ─────────────────────────────────────────────
const DetailModal = ({ topic, onClose, onSave, onCopyPrompt, copied }) => {
  const [form, setForm] = useState({ ...topic, scriptTable: topic.scriptTable || [] });
  const [newMat, setNewMat] = useState('');
  const [dragRowId, setDragRowId] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addMaterial = () => {
    if (!newMat.trim()) return;
    set('materials', [...(form.materials || []), { id: Date.now(), text: newMat.trim(), done: false }]);
    setNewMat('');
  };

  const toggleMat = (id) => {
    set('materials', form.materials.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  const removeMat = (id) => {
    set('materials', form.materials.filter(m => m.id !== id));
  };

  // 分鏡表操作
  const addScriptRow = () => {
    const newRow = {
      id: Date.now(),
      口白: '',
      音效: '-',
      字幕特效: '-',
      字卡: '-',
    };
    set('scriptTable', [...(form.scriptTable || []), newRow]);
  };

  const updateScriptRow = (id, field, value) => {
    set('scriptTable', form.scriptTable.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const removeScriptRow = (id) => {
    set('scriptTable', form.scriptTable.filter(row => row.id !== id));
  };

  const handleDragStart = (e, id) => {
    setDragRowId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragRowId || dragRowId === targetId) return;

    const rows = [...form.scriptTable];
    const dragIndex = rows.findIndex(r => r.id === dragRowId);
    const targetIndex = rows.findIndex(r => r.id === targetId);

    if (dragIndex === -1 || targetIndex === -1) return;

    const [removed] = rows.splice(dragIndex, 1);
    rows.splice(targetIndex, 0, removed);

    set('scriptTable', rows);
    setDragRowId(null);
  };

  // 導出功能
  const handleExportText = () => {
    const text = exportScriptTableAsText(form.scriptTable, topic);
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ 已複製純文字格式到剪貼簿!');
    });
  };

  const handleExportCSV = () => {
    const csv = exportScriptTableAsCSV(form.scriptTable);
    downloadFile(csv, `${topic.title}-分鏡腳本.csv`, 'text/csv');
  };

  const handleExportTXT = () => {
    const text = exportScriptTableAsText(form.scriptTable, topic);
    downloadFile(text, `${topic.title}-分鏡腳本.txt`, 'text/plain');
  };

  const prompt = generateScriptPrompt(topic);

  return (
    <Overlay onClose={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 900, maxWidth: '95vw', maxHeight: '90vh',
        overflowY: 'auto', padding: 36,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <TypeBadge type={topic.type} />
              <span style={{ fontSize: 12, color: '#A09488' }}>📍 {topic.country}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#2C2820', lineHeight: 1.4 }}>{topic.title}</h2>
          </div>
          <button onClick={onClose} style={{ ...tinyBtn('#F0EBE4', '#8B7355'), fontSize: 18 }}>×</button>
        </div>

        {/* 狀態追蹤 */}
        <Section title="📊 製作狀態">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => set('status', s)}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: '2px solid',
                  fontWeight: form.status === s ? 700 : 400,
                  borderColor: form.status === s ? STATUS_COLORS[s].text : '#E8E2DC',
                  background: form.status === s ? STATUS_COLORS[s].bg : '#fff',
                  color: form.status === s ? STATUS_COLORS[s].text : '#8B8078',
                }}
              >{s}</button>
            ))}
          </div>
        </Section>

        {/* 腳本 AI 提示詞 */}
        <Section title="🤖 一鍵複製 AI 腳本提示詞">
          <div style={{ background: '#F7F4F0', borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <pre style={{ margin: 0, fontSize: 12, color: '#5C5048', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{prompt}</pre>
          </div>
          <button onClick={() => onCopyPrompt(topic)} style={btnStyle(copied ? '#6B8F71' : '#8B7355', '#fff')}>
            {copied ? '✅ 已複製!' : '📋 複製提示詞 → 貼到 ChatGPT / Gemini'}
          </button>
        </Section>

        {/* 腳本筆記 */}
        <Section title="📝 腳本草稿(自己寫)">
          <textarea
            value={form.script || ''}
            onChange={e => set('script', e.target.value)}
            placeholder="在這裡寫你的腳本草稿、口白重點、金句⋯⋯"
            style={{
              width: '100%', minHeight: 140, padding: 14, borderRadius: 10,
              border: '1px solid #D4C8BC', fontSize: 13, lineHeight: 1.7, resize: 'vertical',
              fontFamily: 'inherit', background: '#FDFBF9', boxSizing: 'border-box',
            }}
          />
        </Section>

        {/* 🎬 分鏡腳本表 - 新增! */}
        <Section title="🎬 分鏡腳本表">
          <div style={{ marginBottom: 12, padding: 12, background: '#F7F4F0', borderRadius: 8, fontSize: 12, color: '#6B6055' }}>
            💡 提示: 每行 = 一句口
