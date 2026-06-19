export const KANA_RULE = /[\u3040-\u30ff]/

export const HANGUL_RULE = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/

export const HAN_RULE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/

export const CYRILLIC_RULE = /[\u0400-\u04ff]/

export const LATIN_RULE = /[A-Za-z\u00c0-\u024f]/

/**
 * Characters that only appear in simplified Chinese.
 * Ambiguous characters shared with traditional usage are intentionally excluded.
 */
export const SIMPLIFIED_CHARS =
  '个们这来时国爱学龙价关当会实应体与东车马鸟鱼见贝页风飞长门问间阳阴队际难鸡欢观觉写让说话语读谁请谢边过还进远连万业习乡书买卖红级约经给续网罗义乐药园圆图团医动单样节总开闭闻员质贵费资购数转轻软输较尽层属张报担据击坚紧亲穷权伤胜师虽听乌污响乡绣盐养样钟众庄'
export const SIMPLIFIED_SET = new Set(SIMPLIFIED_CHARS)

/**
 * Characters that only appear in traditional Chinese.
 * Each entry corresponds to a simplified form listed above.
 */
export const TRADITIONAL_CHARS =
  '個們這來時國愛學龍價關當會實應體與東車馬鳥魚見貝頁風飛長門問間陽陰隊際難雞歡觀覺寫讓說話語讀誰請謝邊過還進遠連萬業習鄉書買賣紅級約經給續網羅義樂藥園圓圖團醫動單樣節總開閉聞員質貴費資購數轉輕軟輸較盡層屬張報擔據擊堅緊親窮權傷勝師雖聽烏污響鄉繡鹽養樣鐘眾莊'
export const TRADITIONAL_SET = new Set(TRADITIONAL_CHARS)
