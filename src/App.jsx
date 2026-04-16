import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ─── Firebase 設定（填入你的 config）────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDZXuV_gLP0av9y9xBw0k1og1o6gD1LmGs",
  authDomain: "ig100days-planner-b8ef6.firebaseapp.com",
  projectId: "ig100days-planner-b8ef6",
  storageBucket: "ig100days-planner-b8ef6.firebasestorage.app",
  messagingSenderId: "714230472028",
  appId: "1:714230472028:web:ade07a4f9fb48832197599",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

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
  '攻略':   '#8B9E8A',
  '雞湯':   '#C4A882',
  '搞笑/簡易': '#E0956A',
  '心得分享': '#9AAAB8',
};

const INITIAL_TOPICS = [
  { id: 'indo-1',  title: '論爬印尼火山要多早起',         country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-2',  title: '布羅莫日出交通',               country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-3',  title: '布羅莫一生一定要去看一次日出', country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-4',  title: '布羅莫女生不怕冷',             country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-5',  title: '布羅莫騎馬+費用',              country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-6',  title: '布羅莫爬階梯很累嗎',           country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-7',  title: '謝謝布羅莫專業攝影師麥麥',     country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-8',  title: 'sewu瀑布下去很危險嗎',         country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-9',  title: 'sewu瀑布要相信嚮導',           country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-10', title: 'sewu瀑布要記得跟嚮導拿原檔',   country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-11', title: 'sewu瀑布很冷',                 country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-12', title: '泗水塞車地獄 當地節慶',         country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-13', title: '很開心知道宜真可以爬ㄌ+介紹',  country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-14', title: '宜真拍照出大片要走下去',       country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-15', title: '宜真硫磺不能帶回台灣',         country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-16', title: '宜真藍寶堅尼是什麼？多少錢？', country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-17', title: '宜真下雨ㄏㄏ 買雨衣多少錢',    country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-18', title: '宜真沒有樹了 也沒有藍火',      country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-19', title: '宜真沒有藍火建議晚一點出發',   country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-20', title: '魔戒森林找攝影師拍照',         country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-21', title: '魔戒森林形象影片',             country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-22', title: '去峇里島搭船',                 country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-23', title: '終於吃好吃的晚餐了',           country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-24', title: '追海豚要很早起',               country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-25', title: '海豚們好好看',                 country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-26', title: '水神廟啥都沒有',               country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-27', title: '水神廟可愛的我們',             country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-28', title: '烏布市集',                     country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-29', title: '沙灘酒吧合集',                 country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-30', title: '佩尼達島很糟糕',               country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-31', title: '精靈墜崖嚮導拍照很賣力',       country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-32', title: '精靈墜崖拍照很水',             country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-33', title: '精靈墜崖什麼收費都超貴',       country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-34', title: '賽梅魯火山拍照機位',           country: '印尼', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'indo-35', title: '賽梅魯火山拍照超多人',         country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-36', title: '克萊兒小公主合集',             country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-37', title: '李寧很瘋很可憐合集',           country: '印尼', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'indo-38', title: '出發前一天超崩潰，但去了就好了', country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-39', title: '在異國感到孤獨的那個瞬間',      country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'indo-40', title: '我在峇里島想通了一件事',        country: '印尼', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-1',  title: '上海外灘拍照打卡點、時間',       country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-2',  title: '上海蟹皇麵',                     country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-3',  title: '烏魯木齊紅山公園',               country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-4',  title: '國際大巴紮逛街、打車下車點',     country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-5',  title: '國際大巴紮拍照攻略',             country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-6',  title: '天山天池拍照打卡點',             country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-7',  title: '天山天池游船攻略',               country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-8',  title: '新疆維吾爾博物館展區',           country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-9',  title: '達版城',                         country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-10', title: '葡萄溝',                         country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-11', title: '火焰山',                         country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-12', title: '沙漠',                           country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-13', title: '沙漠拍照',                       country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-14', title: '蘇公塔',                         country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-15', title: '買葡萄',                         country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-16', title: '葡萄表演',                       country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-17', title: '葡萄夜市',                       country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-18', title: '按摩',                           country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-19', title: '葡萄夜市心上人',                 country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-20', title: '天山明月城',                     country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-21', title: '天山明月城吊鋼絲',               country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-22', title: '拍照花絮',                       country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-23', title: '騎馬小哥哥',                     country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-24', title: '金凌台日落',                     country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-25', title: '南山牧場包車費用',               country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-26', title: '南山牧場拍照點',                 country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-27', title: '北京天安門打卡',                 country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-28', title: '北京老火鍋超貴開箱',             country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-29', title: '中國飲料店評比',                 country: '新疆', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'xj-30', title: '晨風旅行社推薦',                 country: '新疆', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'xj-31', title: '第一次去中國自由行在想什麼',      country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-32', title: '新疆讓我重新定義「美」',          country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'xj-33', title: '旅行的途中想家了怎麼辦',          country: '新疆', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'th-1',  title: '機票姓名錯誤災難',                       country: '泰國', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'th-2',  title: '鄭王廟拍攝店家 攝影師 費用',             country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-3',  title: '泰國吃到飽 799 一定要吃這家',            country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-4',  title: '曼谷就是買買買',                         country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-5',  title: '雨季的曼谷',                             country: '泰國', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'th-6',  title: 'P人情侶合輯',                            country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-7',  title: '自駕行程',                               country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-8',  title: '自駕費用',                               country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-9',  title: '自駕全部住宿開箱',                       country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-10', title: '斯米蘭介紹',                             country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-11', title: '斯米蘭費用',                             country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-12', title: '普吉島最喜歡的夜市',                     country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-13', title: '普吉島一日遊：黑岩石、大佛、查龍寺',     country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-14', title: '攀牙國家公園',                           country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-15', title: '三百峰國家公園',                         country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-16', title: '神奇的攀牙居民',                         country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-17', title: '泰國跟緬甸最近的燈塔',                   country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-18', title: '春蓬溫泉',                               country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-19', title: '美功水上市場',                           country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-20', title: '北壁是個什麼樣的地方',                   country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-21', title: '愛侶彎國家公園',                         country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-22', title: '死亡鐵路',                               country: '泰國', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'th-23', title: '北壁的🍃很便宜',                         country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-24', title: '曼谷上CF團課體驗',                       country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-25', title: '很讚的villa開箱',                        country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-26', title: '古城高爾夫球車體驗',                     country: '泰國', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'th-27', title: '一個人自駕泰國南部是什麼感覺',           country: '泰國', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'th-28', title: '泰國讓我放下了什麼',                     country: '泰國', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-1', title: '人生迷茫買紐西蘭機票',   country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-2', title: '很多人一直出國的原因',   country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-3', title: '行程介紹',              country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-4', title: '住宿費用開箱',          country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-5', title: '紐西蘭露營車注意事項',  country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-6', title: '露營區怎麼找',          country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-7', title: '20晚住宿不到一萬元',    country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-8',  title: '露營車裡的一個人時光',           country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-9',  title: '紐西蘭的星空讓我哭了',           country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-10', title: '紐西蘭自駕不能不知道的事',       country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-11', title: '紐西蘭超市購物攻略',             country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-12', title: '南島到北島怎麼移動',             country: '紐西蘭', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'nz-13', title: '旅伴吵架了之後',                 country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'nz-14', title: '在紐西蘭過生日是什麼感受',       country: '紐西蘭', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'jp-1',  title: '札幌掛急診教學',                 country: '北海道', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'jp-2',  title: '頭大佛一日遊',                   country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'jp-3',  title: '定山溪漂流體驗',                 country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'jp-4',  title: '北海道拉麵真的比較好吃嗎',       country: '北海道', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'jp-5',  title: '狸小路怎麼逛才不踩雷',           country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'jp-6',  title: '在北海道的便利商店過了一整天',   country: '北海道', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'jp-7',  title: '我在北海道一個人泡湯的夜晚',     country: '北海道', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'jp-8',  title: '北海道冬天穿搭實測',             country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'jp-9',  title: '小樽運河拍照攻略',               country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'jp-10', title: '旭川動物園企鵝遊行',             country: '北海道', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'jp-11', title: '得病在異國是什麼感覺',           country: '北海道', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'jp-12', title: '北海道JR Pass值得買嗎',          country: '北海道', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'tw-1',  title: '搭船拉～',                       country: '南方四島', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'tw-2',  title: '潛水好看東東',                   country: '南方四島', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'tw-3',  title: '南方四島怎麼報名才搶得到',       country: '南方四島', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'tw-4',  title: '南方四島帶什麼裝備',             country: '南方四島', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'tw-5',  title: '浮潛不會游泳可以去嗎',           country: '南方四島', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'tw-6',  title: '台灣其實有世界級的海',           country: '南方四島', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'tw-7',  title: '第一次看到熱帶魚在台灣海域',     country: '南方四島', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'tw-8',  title: '東吉嶼上面住了什麼人',           country: '南方四島', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'tw-9',  title: '暈船了怎麼辦',                   country: '南方四島', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'sb-1',  title: '熱身',                           country: '沙板', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'sb-2',  title: '大家在玩',                       country: '沙板', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
  { id: 'sb-3',  title: '沙板新手入門完全攻略',           country: '沙板', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'sb-4',  title: '沙板一定會摔跤，然後呢',         country: '沙板', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'sb-5',  title: '沙板需要買什麼裝備',             country: '沙板', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'sb-6',  title: '第一次站上沙板的感覺',           country: '沙板', type: '雞湯', status: '待剪輯', estimatedTime: 60, script: '', materials: [] },
  { id: 'sb-7',  title: '沙板跟滑板有什麼不一樣',         country: '沙板', type: '攻略', status: '待剪輯', estimatedTime: 90, script: '', materials: [] },
  { id: 'sb-8',  title: '我學沙板學了多久才敢出去玩',     country: '沙板', type: '搞笑/簡易', status: '待剪輯', estimatedTime: 30, script: '', materials: [] },
];

const generateScriptPrompt = (topic) => {
  const typeGuide = {
    '攻略': `請以實用旅遊攻略的角度，寫一段30秒短影音的腳本大綱。\n結構：Hook（前3秒吸引人的問題或數字）→ 重點資訊（20秒）→ CTA（7秒）\n風格：口語、直接、乾貨滿滿`,
    '雞湯': `請以個人成長、情感共鳴的角度，寫一段30秒短影音的腳本大綱。\n結構：情緒Hook（前3秒）→ 故事/感受描述（20秒）→ 金句收尾（7秒）\n風格：真實、有溫度、引發共鳴`,
    '搞笑/簡易': `請以輕鬆搞笑的角度，寫一段15秒短影音的腳本大綱。\n結構：有趣畫面或情境（10秒）→ 笑點/吐槽/反應（5秒）\n風格：隨興、好笑、反差感強、有個性`,
    '心得分享': `請以個人心得、觀點分享的角度，寫一段30秒短影音的腳本大綱。\n結構：拋出觀點Hook（前3秒）→ 理由/經歷說明（20秒）→ 結論金句（7秒）\n風格：真誠、有見解、讓人有共鳴或有所思考`,
  };
  return `主題：${topic.title}\n國家/地點：${topic.country}\n影片類型：${topic.type}\n\n${typeGuide[topic.type] || typeGuide['攻略']}\n\n請直接給我腳本大綱，不需要解釋。`;
};

// ─── CSS 注入 ────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById('mobile-planner-styles')) return;
  const style = document.createElement('style');
  style.id = 'mobile-planner-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&display=swap');
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    body { margin: 0; padding: 0; }
    .planner-root { font-family: 'Noto Serif TC', Georgia, serif; background: #F7F4F0; min-height: 100vh; }
    .scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .scroll-y { overflow-y: auto; -webkit-overflow-scrolling: touch; }
    .tap-row { transition: background .12s; cursor: pointer; -webkit-tap-highlight-color: rgba(139,115,85,.08); }
    .tap-row:active { background: rgba(139,115,85,.06) !important; }
    .tap-btn { transition: opacity .12s, transform .08s; cursor: pointer; }
    .tap-btn:active { opacity: .7; transform: scale(.96); }
    .day-chip { transition: background .12s; }
    .day-chip:active { filter: brightness(.93); }
    textarea:focus, input:focus, select:focus { outline: 2px solid #C4A882; outline-offset: 1px; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D4C8BC; border-radius: 2px; }
  `;
  document.head.appendChild(style);
};

// ─── Main App ────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [view, setView] = useState('library');
  const [filterCountry, setFilterCountry] = useState('全部');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [detailTopic, setDetailTopic] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [assignDay, setAssignDay] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  // 監聽登入狀態
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        // 登入後從 Firestore 載入資料
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            const data = snap.data();
            setTopics(data.topics || INITIAL_TOPICS);
            setSchedule(data.schedule || {});
          } else {
            // 第一次登入，用預設資料
            setTopics(INITIAL_TOPICS);
            setSchedule({});
          }
        } catch (e) {
          console.error(e);
          setTopics(INITIAL_TOPICS);
        }
      }
    });
    return () => unsub();
  }, []);

  // 儲存到 Firestore（防抖 2 秒）
  useEffect(() => {
    if (!user || !topics.length) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await setDoc(doc(db, 'users', user.uid), { topics, schedule }, { merge: true });
      } catch (e) { console.error(e); }
      setSaving(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [topics, schedule, user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    if (window.confirm('確定登出？')) await signOut(auth);
  };

  const countries = ['全部', ...new Set(topics.map(t => t.country))];
  const published = topics.filter(t => t.status === '已發布').length;
  const scheduled = Object.keys(schedule).length;

  const updateTopic = (updated) => setTopics(prev => prev.map(t => t.id === updated.id ? updated : t));
  const addTopic = (topic) => setTopics(prev => [...prev, { ...topic, id: 'custom-' + Date.now(), script: '', materials: [] }]);
  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    setSchedule(prev => { const n = { ...prev }; Object.keys(n).forEach(k => { if (n[k] === id) delete n[k]; }); return n; });
  };

  const assignToDay = (day, topicId) => {
    setSchedule(prev => ({ ...prev, [day]: topicId }));
  };

  const removeFromDay = (day) => {
    setSchedule(prev => { const n = { ...prev }; delete n[day]; return n; });
  };

  const copyPrompt = (topic) => {
    navigator.clipboard.writeText(generateScriptPrompt(topic)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportJSON = () => {
    const data = JSON.stringify({ topics, schedule }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `100days-${Date.now()}.json`; a.click();
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

  const activeFilters = [filterCountry !== '全部', filterType !== '全部', filterStatus !== '全部'].filter(Boolean).length;

  // 載入中
  if (authLoading) {
    return (
      <div className="planner-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 32 }}>✈️</div>
        <div style={{ fontSize: 14, color: '#A09488' }}>載入中...</div>
      </div>
    );
  }

  // 未登入
  if (!user) {
    return (
      <div className="planner-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 320, width: '100%' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✈️</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#2C2820', marginBottom: 8 }}>100天日更計畫</div>
          <div style={{ fontSize: 14, color: '#A09488', marginBottom: 40, lineHeight: 1.6 }}>登入後資料會自動同步到雲端，任何裝置都能使用</div>
          <button className="tap-btn" onClick={handleLogin}
            style={{
              width: '100%', padding: '16px', border: 'none', borderRadius: 14,
              background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,.12)',
              fontSize: 15, fontWeight: 700, color: '#2C2820', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.5 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            用 Google 帳號登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-root" style={{ paddingBottom: 80 }}>
      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(247,244,240,.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8E2DC',
        padding: '14px 16px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2C2820', lineHeight: 1.2 }}>✈️ 100天日更</div>
            <div style={{ fontSize: 11, color: '#A09488', marginTop: 2 }}>
              發布 <b style={{ color: '#6B8F71' }}>{published}</b> · 排程 <b style={{ color: '#8B7355' }}>{scheduled}</b> · 待剪 <b style={{ color: '#C4946A' }}>{topics.filter(t => t.status === '待剪輯').length}</b>
              {saving && <span style={{ marginLeft: 6, color: '#C4A882' }}>· 同步中...</span>}
              {!saving && user && <span style={{ marginLeft: 6, color: '#6B8F71' }}>· ☁️ 已同步</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="tap-btn" onClick={handleLogout} title="登出"
              style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
              {user.photoURL
                ? <img src={user.photoURL} style={{ width: 32, height: 32, borderRadius: 16, border: '2px solid #D4C8BC' }} />
                : <div style={{ width: 32, height: 32, borderRadius: 16, background: '#8B7355', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{user.displayName?.[0] || '?'}</div>
              }
            </button>
            <button className="tap-btn" onClick={exportJSON}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D4C8BC', background: '#fff', fontSize: 13, color: '#6B6055', cursor: 'pointer' }}>⬇</button>
            <label className="tap-btn"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #D4C8BC', background: '#fff', fontSize: 13, color: '#6B6055', cursor: 'pointer' }}>
              ⬆<input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 10, height: 5, background: '#E8E2DC', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${published}%`,
            background: 'linear-gradient(90deg, #6B8F71, #A8C8A0)', borderRadius: 3,
            transition: 'width .5s',
          }} />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '0 0 8px' }}>
        {view === 'library' && (
          <LibraryView
            topics={filteredTopics} allTopics={topics}
            filterCountry={filterCountry} filterType={filterType} filterStatus={filterStatus}
            countries={countries}
            onFilterCountry={setFilterCountry} onFilterType={setFilterType} onFilterStatus={setFilterStatus}
            showFilter={showFilter} setShowFilter={setShowFilter} activeFilters={activeFilters}
            onOpenDetail={setDetailTopic}
            onAddNew={() => setEditingTopic('new')}
            schedule={schedule}
          />
        )}
        {view === 'calendar' && (
          <CalendarView
            schedule={schedule} topics={topics}
            onOpenDetail={setDetailTopic}
            onRemove={removeFromDay}
            onAssignDay={(day) => setAssignDay(day)}
          />
        )}
        {view === 'dashboard' && (
          <DashboardView topics={topics} schedule={schedule} published={published} />
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E8E2DC',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}>
        {[['library','📚','主題庫'], ['calendar','📅','排程'], ['dashboard','📊','數據']].map(([v, icon, label]) => (
          <button key={v} className="tap-btn" onClick={() => setView(v)}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              padding: '12px 0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: view === v ? '#8B7355' : '#B0A898',
            }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: view === v ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Modals ── */}
      {detailTopic && (
        <DetailModal
          topic={detailTopic}
          schedule={schedule}
          onClose={() => setDetailTopic(null)}
          onSave={(updated) => { updateTopic(updated); setDetailTopic(null); }}
          onDelete={(id) => { deleteTopic(id); setDetailTopic(null); }}
          onCopyPrompt={copyPrompt}
          onAssignDay={(day) => { assignToDay(day, detailTopic.id); setDetailTopic(null); }}
          onRemoveDay={(day) => { removeFromDay(day); }}
          copied={copied}
          allTopics={topics}
        />
      )}
      {editingTopic && (
        <EditModal
          topic={editingTopic === 'new' ? null : editingTopic}
          onSave={(t) => { editingTopic === 'new' ? addTopic(t) : updateTopic(t); setEditingTopic(null); }}
          onClose={() => setEditingTopic(null)}
        />
      )}
      {assignDay !== null && (
        <AssignModal
          day={assignDay}
          topics={topics}
          schedule={schedule}
          onAssign={(topicId) => { assignToDay(assignDay, topicId); setAssignDay(null); }}
          onClose={() => setAssignDay(null)}
        />
      )}

      {copied && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: '#2C2820', color: '#fff', padding: '12px 20px',
          borderRadius: 12, fontSize: 13, zIndex: 9999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}>✅ 提示詞已複製！</div>
      )}
    </div>
  );
}

// ─── Library View ────────────────────────────────────────────────
function LibraryView({ topics, filterCountry, filterType, filterStatus, countries, onFilterCountry, onFilterType, onFilterStatus, showFilter, setShowFilter, activeFilters, onOpenDetail, onAddNew, schedule }) {
  const scheduledIds = new Set(Object.values(schedule));

  return (
    <div>
      {/* Toolbar */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'center', position: 'sticky', top: 72, zIndex: 50, background: '#F7F4F0' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2C2820', flex: 1 }}>
          主題庫 <span style={{ fontSize: 12, color: '#A09488', fontWeight: 400 }}>({topics.length})</span>
        </div>
        <button className="tap-btn" onClick={() => setShowFilter(!showFilter)}
          style={{
            padding: '8px 14px', borderRadius: 20, border: '1px solid',
            borderColor: activeFilters > 0 ? '#8B7355' : '#D4C8BC',
            background: activeFilters > 0 ? '#8B7355' : '#fff',
            color: activeFilters > 0 ? '#fff' : '#6B6055',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>
          🔍 篩選{activeFilters > 0 ? ` (${activeFilters})` : ''}
        </button>
        <button className="tap-btn" onClick={onAddNew}
          style={{ padding: '8px 14px', borderRadius: 20, border: 'none', background: '#2C2820', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ＋
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 8, background: '#F7F4F0' }}>
          <select value={filterCountry} onChange={e => onFilterCountry(e.target.value)} style={selStyle}>
            {countries.map(c => <option key={c} value={c}>{c === '全部' ? '📍 全部地點' : c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={filterType} onChange={e => onFilterType(e.target.value)} style={{ ...selStyle, flex: 1 }}>
              <option value="全部">全部類型</option>
              {['攻略','雞湯','搞笑/簡易','心得分享'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterStatus} onChange={e => onFilterStatus(e.target.value)} style={{ ...selStyle, flex: 1 }}>
              <option value="全部">全部狀態</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(filterCountry !== '全部' || filterType !== '全部' || filterStatus !== '全部') && (
            <button className="tap-btn" onClick={() => { onFilterCountry('全部'); onFilterType('全部'); onFilterStatus('全部'); }}
              style={{ padding: '8px', borderRadius: 8, border: '1px solid #E8E2DC', background: '#fff', fontSize: 12, color: '#C0503A', cursor: 'pointer' }}>
              清除篩選
            </button>
          )}
        </div>
      )}

      {/* Topic List */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} onOpen={onOpenDetail} isScheduled={scheduledIds.has(topic.id)} />
        ))}
        {topics.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#B0A898', fontSize: 14 }}>沒有符合的主題</div>
        )}
      </div>
    </div>
  );
}

function TopicCard({ topic, onOpen, isScheduled }) {
  return (
    <div className="tap-row" onClick={() => onOpen(topic)}
      style={{
        background: '#fff', borderRadius: 14, padding: '14px 16px',
        border: '1px solid #E8E2DC',
        boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <TypeBadge type={topic.type} />
          <StatusBadge status={topic.status} />
          {isScheduled && <span style={{ fontSize: 10, color: '#8B7355', background: '#F5EFE8', padding: '2px 6px', borderRadius: 5, fontWeight: 600 }}>已排程</span>}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#2C2820', lineHeight: 1.4, marginBottom: 4 }}>{topic.title}</div>
        <div style={{ fontSize: 12, color: '#A09488' }}>📍 {topic.country} · ⏱ {topic.estimatedTime}分鐘</div>
      </div>
      <div style={{ fontSize: 18, color: '#C4B8AC', flexShrink: 0, paddingTop: 2 }}>›</div>
    </div>
  );
}

// ─── Calendar View ───────────────────────────────────────────────
function CalendarView({ schedule, topics, onOpenDetail, onRemove, onAssignDay }) {
  const [expandWeek, setExpandWeek] = useState(null);

  const weeks = [];
  for (let i = 0; i < 100; i += 7) {
    weeks.push(Array.from({ length: Math.min(7, 100 - i) }, (_, j) => i + j + 1));
  }

  const getWeekStatus = (week) => {
    const filled = week.filter(d => schedule[d]).length;
    if (filled === 0) return 'empty';
    if (filled === week.length) return 'full';
    return 'partial';
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#2C2820', marginBottom: 12 }}>100天排程</div>

      {/* Week accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {weeks.map((week, wi) => {
          const weekNum = wi + 1;
          const status = getWeekStatus(week);
          const isOpen = expandWeek === wi;
          const filledCount = week.filter(d => schedule[d]).length;

          return (
            <div key={wi} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E2DC', overflow: 'hidden' }}>
              {/* Week header */}
              <button className="tap-btn" onClick={() => setExpandWeek(isOpen ? null : wi)}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: status === 'full' ? '#6B8F71' : status === 'partial' ? '#C4A882' : '#F0EBE4',
                  color: status === 'empty' ? '#B0A898' : '#fff',
                  flexShrink: 0,
                }}>W{weekNum}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2C2820' }}>
                    Day {week[0]}–{week[week.length - 1]}
                  </div>
                  <div style={{ fontSize: 11, color: '#A09488', marginTop: 1 }}>
                    {filledCount}/{week.length} 已排 {filledCount > 0 && `· ${week.filter(d => schedule[d]).map(d => topics.find(t => t.id === schedule[d])?.type).filter(Boolean).slice(0,3).join(' ')}`}
                  </div>
                </div>
                {/* Mini dots */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {week.map(d => (
                    <div key={d} style={{
                      width: 6, height: 6, borderRadius: 3,
                      background: schedule[d] ? (TYPE_COLORS[topics.find(t => t.id === schedule[d])?.type] || '#C4A882') : '#E8E2DC',
                    }} />
                  ))}
                </div>
                <span style={{ color: '#B0A898', fontSize: 14, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded days */}
              {isOpen && (
                <div style={{ borderTop: '1px solid #F0EBE4', padding: '8px 12px 12px' }}>
                  {week.map(day => {
                    const topic = schedule[day] ? topics.find(t => t.id === schedule[day]) : null;
                    return (
                      <div key={day} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 4px', borderBottom: '1px solid #F7F4F0',
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, background: '#F7F4F0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: '#8B7355', flexShrink: 0,
                        }}>{day}</div>
                        {topic ? (
                          <div className="tap-row" onClick={() => onOpenDetail(topic)} style={{ flex: 1, minWidth: 0, borderRadius: 8, padding: '4px 0' }}>
                            <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
                              <TypeBadge type={topic.type} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#2C2820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic.title}</div>
                          </div>
                        ) : (
                          <div style={{ flex: 1, fontSize: 12, color: '#C0B8B0' }}>尚未排程</div>
                        )}
                        {topic ? (
                          <button className="tap-btn" onClick={() => onRemove(day)}
                            style={{ padding: '8px', border: 'none', background: '#FEF0EC', borderRadius: 8, color: '#C0503A', fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                        ) : (
                          <button className="tap-btn" onClick={() => onAssignDay(day)}
                            style={{ padding: '8px 12px', border: 'none', background: '#F5EFE8', borderRadius: 8, color: '#8B7355', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>排入</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dashboard View ──────────────────────────────────────────────
function DashboardView({ topics, schedule, published }) {
  const scheduled = Object.keys(schedule).length;
  const total = topics.length;
  const countryDist = topics.reduce((a, t) => { a[t.country] = (a[t.country] || 0) + 1; return a; }, {});
  const typeDist = topics.reduce((a, t) => { a[t.type] = (a[t.type] || 0) + 1; return a; }, {});
  const statusDist = STATUSES.reduce((a, s) => { a[s] = topics.filter(t => t.status === s).length; return a; }, {});

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Big progress */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 16px', border: '1px solid #E8E2DC' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2C2820', marginBottom: 12 }}>整體進度</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#6B8F71', lineHeight: 1 }}>{published}</div>
          <div style={{ fontSize: 18, color: '#B0A898', paddingBottom: 4 }}>/ 100</div>
          <div style={{ fontSize: 14, color: '#A09488', paddingBottom: 4, marginLeft: 4 }}>已發布</div>
        </div>
        <div style={{ height: 10, background: '#F0EBE4', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: '100%', width: `${published}%`, background: 'linear-gradient(90deg, #6B8F71, #A8C8A0)', borderRadius: 5, transition: 'width .5s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {STATUSES.map(s => (
            <div key={s} style={{ textAlign: 'center', background: STATUS_COLORS[s].bg, borderRadius: 10, padding: '8px 4px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: STATUS_COLORS[s].text }}>{statusDist[s]}</div>
              <div style={{ fontSize: 9, color: STATUS_COLORS[s].text, opacity: .8, marginTop: 2, lineHeight: 1.2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Type distribution */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #E8E2DC' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2C2820', marginBottom: 14 }}>🎬 影片類型</div>
        {Object.entries(typeDist).map(([type, n]) => (
          <div key={type} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: TYPE_COLORS[type] }} />
                <span style={{ fontSize: 13, color: '#3C3028' }}>{type}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: TYPE_COLORS[type] }}>{n}支 · {Math.round(n/total*100)}%</span>
            </div>
            <div style={{ height: 8, background: '#F0EBE4', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${n/total*100}%`, background: TYPE_COLORS[type], borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Country distribution */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #E8E2DC' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2C2820', marginBottom: 14 }}>🌏 地點分布</div>
        {Object.entries(countryDist).sort((a,b) => b[1]-a[1]).map(([c, n]) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: '#3C3028', width: 60, flexShrink: 0 }}>{c}</div>
            <div style={{ flex: 1, height: 8, background: '#F0EBE4', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${n/total*100}%`, background: '#C4A882', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, color: '#8B7355', fontWeight: 600, width: 28, textAlign: 'right', flexShrink: 0 }}>{n}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F5EFE8', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#8B7355' }}>主題庫共 <b>{total}</b> 支 · 已排程 <b>{scheduled}</b> 天 · 剩餘 <b>{100 - published}</b> 天</div>
      </div>
    </div>
  );
}

// ─── 分鏡表格 parse 工具 ─────────────────────────────────────────
// 把 tab 分隔的文字轉成 [{voiceover, sfx, subtitle, card}, ...]
function parseStoryboard(raw) {
  if (!raw || !raw.trim()) return [];
  return raw.trim().split('\n').map(line => {
    const cols = line.split('\t');
    return {
      voiceover: (cols[0] || '').trim(),
      sfx:       (cols[1] || '').trim(),
      subtitle:  (cols[2] || '').trim(),
      card:      (cols[3] || '').trim(),
    };
  }).filter(r => r.voiceover || r.sfx || r.subtitle || r.card);
}

function stringifyStoryboard(rows) {
  return rows.map(r => [r.voiceover, r.sfx, r.subtitle, r.card].join('\t')).join('\n');
}

// ─── Storyboard Table Component ──────────────────────────────────
function StoryboardTable({ value, onChange }) {
  const [pasteMode, setPasteMode] = useState(!value || !value.trim());
  const [pasteText, setPasteText] = useState(value || '');
  const rows = parseStoryboard(value);

  const handlePaste = () => {
    onChange(pasteText);
    setPasteMode(false);
  };

  const updateCell = (rowIdx, field, val) => {
    const updated = [...rows];
    updated[rowIdx] = { ...updated[rowIdx], [field]: val };
    onChange(stringifyStoryboard(updated));
  };

  const addRow = () => {
    const updated = [...rows, { voiceover: '', sfx: '', subtitle: '', card: '' }];
    onChange(stringifyStoryboard(updated));
  };

  const removeRow = (idx) => {
    const updated = rows.filter((_, i) => i !== idx);
    onChange(stringifyStoryboard(updated));
  };

  const COLS = [
    { key: 'voiceover', label: '口白', flex: 3, placeholder: '口白內容' },
    { key: 'sfx',       label: '音效', flex: 2, placeholder: '音效' },
    { key: 'subtitle',  label: '字幕特效', flex: 2, placeholder: '字幕特效' },
    { key: 'card',      label: '字卡', flex: 2, placeholder: '字卡文字' },
  ];

  if (pasteMode) {
    return (
      <div>
        <div style={{ fontSize: 12, color: '#A09488', marginBottom: 8, lineHeight: 1.6 }}>
          從 Claude 複製分鏡腳本貼上，系統自動轉成表格
        </div>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder={'口白\t音效\t字幕特效\t字卡\n（直接貼上 Claude 產生的分鏡腳本）'}
          style={{
            width: '100%', minHeight: 140, padding: '12px', borderRadius: 10,
            border: '1px solid #D4C8BC', fontSize: 13, lineHeight: 1.6, resize: 'vertical',
            fontFamily: 'inherit', background: '#FDFBF9', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="tap-btn" onClick={handlePaste}
            style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: '#8B7355', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            ✨ 轉成表格
          </button>
          {rows.length > 0 && (
            <button className="tap-btn" onClick={() => setPasteMode(false)}
              style={{ flex: 1, padding: '13px', border: '1px solid #D4C8BC', borderRadius: 10, background: '#fff', color: '#6B6055', fontSize: 13, cursor: 'pointer' }}>
              取消
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Note */}
      <div style={{ fontSize: 11, color: '#A09488', marginBottom: 10, lineHeight: 1.5 }}>
        ＊ 音效跟字幕特效要能搭配　＊ 不是每行都需要填滿
      </div>

      {/* Table header */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {COLS.map(c => (
          <div key={c.key} style={{ flex: c.flex, fontSize: 11, fontWeight: 700, color: '#8B7355', padding: '0 6px' }}>{c.label}</div>
        ))}
        <div style={{ width: 28 }} />
      </div>

      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={{
          display: 'flex', gap: 4, marginBottom: 4, alignItems: 'flex-start',
          background: ri % 2 === 0 ? '#FDFBF9' : '#fff',
          borderRadius: 8, padding: '4px 0',
        }}>
          {COLS.map(c => (
            <textarea
              key={c.key}
              value={row[c.key]}
              onChange={e => updateCell(ri, c.key, e.target.value)}
              placeholder={c.placeholder}
              rows={2}
              style={{
                flex: c.flex, padding: '7px 8px', borderRadius: 8,
                border: '1px solid #E8E2DC', fontSize: 12, lineHeight: 1.5, resize: 'none',
                fontFamily: 'inherit', background: 'transparent', boxSizing: 'border-box',
                color: '#2C2820',
              }}
            />
          ))}
          <button className="tap-btn" onClick={() => removeRow(ri)}
            style={{ width: 28, height: 28, border: 'none', background: '#FEF0EC', borderRadius: 6, color: '#C0503A', fontSize: 13, cursor: 'pointer', flexShrink: 0, marginTop: 6 }}>✕</button>
        </div>
      ))}

      {rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#B0A898', fontSize: 13 }}>還沒有分鏡內容</div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="tap-btn" onClick={addRow}
          style={{ flex: 1, padding: '11px', border: '1px dashed #C4A882', borderRadius: 10, background: '#FDFBF9', color: '#8B7355', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ＋ 新增一行
        </button>
        <button className="tap-btn" onClick={() => { setPasteText(value || ''); setPasteMode(true); }}
          style={{ flex: 1, padding: '11px', border: '1px solid #D4C8BC', borderRadius: 10, background: '#fff', color: '#6B6055', fontSize: 13, cursor: 'pointer' }}>
          重新貼上
        </button>
      </div>
    </div>
  );
}

// ─── Detail Modal (Full Screen) ──────────────────────────────────
function DetailModal({ topic, onClose, onSave, onDelete, onCopyPrompt, onAssignDay, onRemoveDay, copied, schedule, allTopics }) {
  const [form, setForm] = useState({ ...topic });
  const [newMat, setNewMat] = useState('');
  const [tab, setTab] = useState('info'); // info | script | materials
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const scheduledDay = Object.entries(schedule).find(([, id]) => id === topic.id)?.[0];

  const addMaterial = () => {
    if (!newMat.trim()) return;
    set('materials', [...(form.materials || []), { id: Date.now(), text: newMat.trim(), done: false }]);
    setNewMat('');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#F7F4F0', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E8E2DC',
        padding: '14px 16px', flexShrink: 0,
        paddingTop: 'calc(14px + env(safe-area-inset-top))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button className="tap-btn" onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#F0EBE4', color: '#8B7355', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>‹</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <TypeBadge type={topic.type} />
              <span style={{ fontSize: 11, color: '#A09488' }}>📍 {topic.country}</span>
              {scheduledDay && <span style={{ fontSize: 11, color: '#8B7355', background: '#F5EFE8', padding: '1px 6px', borderRadius: 5, fontWeight: 600 }}>Day {scheduledDay}</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2C2820', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{topic.title}</div>
          </div>
          <button className="tap-btn" onClick={() => { if (window.confirm('確定刪除？')) onDelete(topic.id); }}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: '#FEF0EC', color: '#C0503A', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🗑</button>
        </div>

        {/* Status pills */}
        <div className="scroll-x" style={{ display: 'flex', gap: 6 }}>
          {STATUSES.map(s => (
            <button key={s} className="tap-btn" onClick={() => set('status', s)}
              style={{
                padding: '6px 12px', borderRadius: 20, border: '1.5px solid', whiteSpace: 'nowrap',
                fontSize: 12, fontWeight: form.status === s ? 700 : 400, cursor: 'pointer',
                borderColor: form.status === s ? STATUS_COLORS[s].text : '#E8E2DC',
                background: form.status === s ? STATUS_COLORS[s].bg : '#fff',
                color: form.status === s ? STATUS_COLORS[s].text : '#8B8078',
              }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8E2DC', display: 'flex', flexShrink: 0 }}>
        {[['info','ℹ️ 資訊'], ['script','📝 腳本'], ['materials','🎬 素材']].map(([t, label]) => (
          <button key={t} className="tap-btn" onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t ? 700 : 400,
              color: tab === t ? '#8B7355' : '#A09488',
              borderBottom: tab === t ? '2px solid #8B7355' : '2px solid transparent',
            }}>{label}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="scroll-y" style={{ flex: 1, padding: '16px' }}>
        {tab === 'info' && (
          <div>
            {/* Schedule section */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 10 }}>📅 排程</div>
              {scheduledDay ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, fontSize: 14, color: '#2C2820' }}>已排入 <b>Day {scheduledDay}</b></div>
                  <button className="tap-btn" onClick={() => onRemoveDay(Number(scheduledDay))}
                    style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#FEF0EC', color: '#C0503A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>移除</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 13, color: '#A09488', marginBottom: 10 }}>輸入要排入的天數</div>
                  <DayAssignInline onAssign={onAssignDay} schedule={schedule} />
                </div>
              )}
            </div>

            {/* Editable Info */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 12 }}>📋 基本資訊</div>

              <EditableInfoRow label="地點"
                value={form.country}
                onChange={v => set('country', v)}
                inputType="text"
              />
              <EditableInfoRow label="類型"
                value={form.type}
                onChange={v => set('type', v)}
                inputType="select"
                options={['攻略','雞湯','搞笑/簡易','心得分享']}
              />
              <EditableInfoRow label="預估時間"
                value={form.estimatedTime}
                onChange={v => set('estimatedTime', parseInt(v) || 0)}
                inputType="number"
                suffix="分鐘"
              />
              <EditableInfoRow label="狀態"
                value={form.status}
                onChange={v => set('status', v)}
                inputType="select"
                options={STATUSES}
                isLast
              />
            </div>
          </div>
        )}

        {tab === 'script' && (
          <div>
            {/* AI Prompt */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 10 }}>🤖 AI 腳本提示詞</div>
              <div style={{ background: '#F7F4F0', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
                <pre style={{ margin: 0, fontSize: 11, color: '#5C5048', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit' }}>
                  {generateScriptPrompt(topic)}
                </pre>
              </div>
              <button className="tap-btn" onClick={() => onCopyPrompt(topic)}
                style={{
                  width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer',
                  background: copied ? '#6B8F71' : '#8B7355', color: '#fff', fontSize: 14, fontWeight: 700,
                }}>
                {copied ? '✅ 已複製！' : '📋 複製提示詞'}
              </button>
            </div>

            {/* Script draft */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 10 }}>📝 腳本草稿</div>
              <textarea
                value={form.script || ''}
                onChange={e => set('script', e.target.value)}
                placeholder="在這裡寫腳本、口白、金句⋯"
                style={{
                  width: '100%', minHeight: 140, padding: '12px', borderRadius: 10,
                  border: '1px solid #D4C8BC', fontSize: 14, lineHeight: 1.7, resize: 'vertical',
                  fontFamily: 'inherit', background: '#FDFBF9', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Storyboard table */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 12 }}>🎞 分鏡腳本表</div>
              <StoryboardTable
                value={form.storyboard || ''}
                onChange={v => set('storyboard', v)}
              />
            </div>
          </div>
        )}

        {tab === 'materials' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #E8E2DC' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#8B7355', marginBottom: 12 }}>🎬 素材需求清單</div>
            {(form.materials || []).map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0EBE4' }}>
                <input type="checkbox" checked={m.done}
                  onChange={() => set('materials', form.materials.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
                  style={{ width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, color: m.done ? '#B0A898' : '#2C2820', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
                <button className="tap-btn" onClick={() => set('materials', form.materials.filter(x => x.id !== m.id))}
                  style={{ padding: '6px 10px', border: 'none', background: '#FEF0EC', borderRadius: 8, color: '#C0503A', fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>✕</button>
              </div>
            ))}
            {(form.materials || []).length === 0 && (
              <div style={{ color: '#B0A898', fontSize: 13, padding: '16px 0', textAlign: 'center' }}>還沒有素材項目</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input value={newMat} onChange={e => setNewMat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMaterial()}
                placeholder="新增素材（Enter 確認）"
                style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #D4C8BC', fontSize: 14, background: '#FDFBF9', fontFamily: 'inherit' }} />
              <button className="tap-btn" onClick={addMaterial}
                style={{ padding: '12px 16px', border: 'none', background: '#6B8F71', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>＋</button>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div style={{
        padding: '12px 16px', background: '#fff', borderTop: '1px solid #E8E2DC', flexShrink: 0,
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
      }}>
        <button className="tap-btn" onClick={() => onSave(form)}
          style={{ width: '100%', padding: '16px', border: 'none', borderRadius: 14, background: '#8B7355', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          💾 儲存
        </button>
      </div>
    </div>
  );
}

// Inline day assign component
function DayAssignInline({ onAssign, schedule }) {
  const [val, setVal] = useState('');
  const day = parseInt(val);
  const valid = day >= 1 && day <= 100;
  const occupied = valid && schedule[day];

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="number" value={val} onChange={e => setVal(e.target.value)}
        placeholder="輸入 Day（1-100）"
        min={1} max={100}
        style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: `1px solid ${occupied ? '#C0503A' : '#D4C8BC'}`, fontSize: 14, fontFamily: 'inherit', background: '#FDFBF9' }}
      />
      <button className="tap-btn" onClick={() => { if (valid) onAssign(day); }}
        disabled={!valid}
        style={{
          padding: '12px 16px', border: 'none', borderRadius: 10, cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? '#8B7355' : '#E8E2DC', color: valid ? '#fff' : '#B0A898', fontSize: 14, fontWeight: 700,
        }}>排入</button>
    </div>
  );
}

// ─── Assign Modal ────────────────────────────────────────────────
function AssignModal({ day, topics, schedule, onAssign, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = topics.filter(t =>
    (t.title.includes(search) || t.country.includes(search)) && !Object.values(schedule).includes(t.id)
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#F7F4F0', borderRadius: '20px 20px 0 0', width: '100%', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ padding: '16px', background: '#fff', borderRadius: '20px 20px 0 0', borderBottom: '1px solid #E8E2DC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#2C2820' }}>Day {day} 排入主題</div>
            <button className="tap-btn" onClick={onClose}
              style={{ padding: '6px 12px', border: 'none', background: '#F0EBE4', borderRadius: 8, color: '#8B7355', cursor: 'pointer' }}>取消</button>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="搜尋主題標題或地點"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #D4C8BC', fontSize: 14, fontFamily: 'inherit', background: '#FDFBF9', boxSizing: 'border-box' }} />
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 16px' }}>
          {filtered.map(t => (
            <div key={t.id} className="tap-row" onClick={() => onAssign(t.id)}
              style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 8, border: '1px solid #E8E2DC', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 4 }}><TypeBadge type={t.type} /></div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2820' }}>{t.title}</div>
                <div style={{ fontSize: 11, color: '#A09488', marginTop: 2 }}>📍 {t.country}</div>
              </div>
              <div style={{ fontSize: 18, color: '#C4B8AC' }}>›</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#B0A898', fontSize: 14 }}>沒有找到主題</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ──────────────────────────────────────────────────
function EditModal({ topic, onSave, onClose }) {
  const isNew = !topic;
  const [form, setForm] = useState(topic || { title: '', country: '', type: '攻略', status: '待剪輯', estimatedTime: 60 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#F7F4F0', borderRadius: '20px 20px 0 0', width: '100%',
        padding: '20px 16px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2C2820', marginBottom: 16 }}>
          {isNew ? '➕ 新增主題' : '✏️ 編輯主題'}
        </div>
        {[
          ['標題', 'text', 'title', '影片標題'],
          ['國家 / 地點', 'text', 'country', '例如：印尼、北海道'],
        ].map(([label, type, key, ph]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8B7355', marginBottom: 5 }}>{label}</div>
            <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
              style={{ width: '100%', padding: '13px 14px', borderRadius: 10, border: '1px solid #D4C8BC', fontSize: 14, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8B7355', marginBottom: 5 }}>類型</div>
            <select value={form.type} onChange={e => set('type', e.target.value)} style={{ ...selStyle, width: '100%' }}>
              {['攻略','雞湯','搞笑/簡易','心得分享'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8B7355', marginBottom: 5 }}>狀態</div>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...selStyle, width: '100%' }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8B7355', marginBottom: 5 }}>預估時間（分鐘）</div>
          <input type="number" value={form.estimatedTime} onChange={e => set('estimatedTime', parseInt(e.target.value))}
            style={{ width: '100%', padding: '13px 14px', borderRadius: 10, border: '1px solid #D4C8BC', fontSize: 14, background: '#fff', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tap-btn" onClick={onClose}
            style={{ flex: 1, padding: '15px', border: '1px solid #D4C8BC', borderRadius: 12, background: '#fff', color: '#6B6055', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>取消</button>
          <button className="tap-btn" onClick={() => { if (!form.title || !form.country) return alert('標題和地點必填'); onSave(form); }}
            style={{ flex: 2, padding: '15px', border: 'none', borderRadius: 12, background: '#8B7355', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {isNew ? '新增' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Small Components ────────────────────────────────────────────
function TypeBadge({ type }) {
  return (
    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: TYPE_COLORS[type], color: '#fff' }}>
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#E8E2DC', text: '#6B6055' };
  return (
    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function EditableInfoRow({ label, value, onChange, inputType, options, suffix, isLast }) {
  const [editing, setEditing] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0', borderBottom: isLast ? 'none' : '1px solid #F0EBE4', fontSize: 14,
      minHeight: 48,
    }}>
      <span style={{ color: '#A09488', flexShrink: 0, width: 72 }}>{label}</span>
      {editing ? (
        <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
          {inputType === 'select' ? (
            <select
              value={value}
              onChange={e => { onChange(e.target.value); setEditing(false); }}
              autoFocus
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #C4A882', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#2C2820' }}
            >
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              type={inputType || 'text'}
              value={value}
              onChange={e => onChange(e.target.value)}
              autoFocus
              onBlur={() => setEditing(false)}
              onKeyDown={e => e.key === 'Enter' && setEditing(false)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #C4A882', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#2C2820' }}
            />
          )}
          {inputType !== 'select' && (
            <button className="tap-btn" onClick={() => setEditing(false)}
              style={{ padding: '7px 12px', border: 'none', background: '#6B8F71', color: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>✓</button>
          )}
        </div>
      ) : (
        <div className="tap-row" onClick={() => setEditing(true)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', border: '1px solid transparent' }}>
          <span style={{ color: '#2C2820', fontWeight: 600 }}>{value}{suffix ? ` ${suffix}` : ''}</span>
          <span style={{ fontSize: 12, color: '#C4B8AC' }}>✎</span>
        </div>
      )}
    </div>
  );
}

const selStyle = {
  padding: '11px 14px', borderRadius: 10, border: '1px solid #D4C8BC',
  background: '#fff', color: '#3C3028', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
};
