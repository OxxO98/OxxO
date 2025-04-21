"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJaText = useJaText;
exports.useHuri = useHuri;
exports.useBun = useBun;
exports.useKirikae = useKirikae;
exports.useMultiKirikae = useMultiKirikae;
exports.useMultiInput = useMultiInput;
const react_1 = require("react");
const client_1 = require("client");
const hook_1 = require("shared/hook");
function useHuri() {
    const kanjiRegex = (0, react_1.useContext)(client_1.UnicodeContext).kanji;
    const hiraganaRegex = (0, react_1.useContext)(client_1.UnicodeContext).hiragana;
    const kanjiStartRegex = (0, react_1.useContext)(client_1.UnicodeContext).kanjiStart;
    const yomiToHuri = (hyouki, yomi) => {
        let startBool = hyouki.match(kanjiStartRegex) !== null ? true : false; //true면 한자 시작
        let arrKanji = hyouki.match(kanjiRegex);
        let arrOkuri = hyouki.match(hiraganaRegex);
        let arrHuri = new Array();
        let endIndex = 0;
        if (startBool === false) {
            if (arrOkuri !== null && arrOkuri !== undefined) {
                let shiftOkuri = arrOkuri.shift();
                if (shiftOkuri !== undefined) {
                    endIndex = shiftOkuri.length;
                }
                if (arrOkuri.length === 0) {
                    arrHuri.push(yomi.substring(endIndex));
                    return arrHuri;
                }
            }
        }
        if (arrOkuri !== null) {
            for (let idx = 0; idx < arrOkuri.length; idx++) {
                let revise = endIndex + 1;
                // let revise = endIndex + arrKanji[key].length;
                let matchedYomi = yomi.indexOf(arrOkuri[idx], revise);
                arrHuri.push(yomi.substring(endIndex, matchedYomi));
                endIndex = matchedYomi + arrOkuri[idx].length;
                //console.log('ythuri', endIndex, revise, matchedYomi);
            }
        }
        //후작업.
        if (yomi.substring(endIndex) !== '') {
            // console.warn(`${endIndex} ${yomi.substring(endIndex)}`);
            //한자로 끝나서 okuri가 없는 경우에는 추가가 맞음
            //히라가나로 끝나는 경우는 잘못 된 검색이 이루어진 것인데..
            if (arrOkuri !== null) {
                let lastOkuri = arrOkuri[arrOkuri.length - 1];
                if (yomi.lastIndexOf(lastOkuri) == yomi.length - lastOkuri.length) {
                    arrHuri[arrHuri.length - 1] = yomi.substring(endIndex - lastOkuri.length, yomi.length - lastOkuri.length);
                }
                else {
                    //okrui가 있지만 한자로 끝난 경우
                    arrHuri.push(yomi.substring(endIndex));
                }
            }
            else {
                //okuri가 아예 없던 경우 (한자만 존재)
                arrHuri.push(yomi.substring(endIndex));
            }
        }
        //arr의 형태로 반환
        return arrHuri;
    };
    const hysToHuri = (bunText, hys, huri) => {
        //HYS는 표기를 전각 공백으로 연결 한 것
        let hurigana = "";
        // console.log(`${bunText} ${hys} ${huri}`);
        if (huri != null && hys != null) {
            let kanjiBunArr = bunText.match(kanjiRegex);
            let hyoukiArr = hys.split('　');
            let huriArr = huri.split('　');
            let hyoukiKanjiArr = new Array();
            for (let i in hyoukiArr) {
                let sel = hyoukiArr[i];
                let a = sel.match(kanjiRegex);
                if (a !== null) {
                    for (let key in a) {
                        hyoukiKanjiArr.push(a[key]);
                    }
                }
            }
            let tmp = new Array();
            for (let i in huriArr) {
                let sel = yomiToHuri(hyoukiArr[i], huriArr[i]);
                for (let key in sel) {
                    tmp.push(sel[key]);
                }
            }
            //console.log(tmp);
            //console.log(hyoukiKanjiArr);
            //console.log(kanjiBunArr);
            hurigana = kanjiBunArr != null ? kanjiBunArr.join('　') : "";
            hyoukiKanjiArr.map((arr, index) => {
                hurigana = hurigana.replace(arr, tmp[index]);
            });
            //console.log(hurigana);
        }
        return hurigana;
    };
    //ComplexText에서 표기, 읽기를 Text 형식으로 분해.
    const complexArr = (hyouki, yomi, offset) => {
        if (yomi == null) {
            return [{
                    data: hyouki,
                    ruby: null,
                    offset: offset
                }];
        }
        let arrKanji = hyouki.match(kanjiRegex);
        let arrOkuri = hyouki.match(hiraganaRegex);
        let arrHuri = yomiToHuri(hyouki, yomi);
        if (arrOkuri == null || arrKanji == null) {
            return [{
                    data: hyouki,
                    ruby: yomi,
                    offset: offset
                }];
        }
        let startBool = hyouki.match(kanjiStartRegex) != null ? true : false; //true면 한자 시작
        let kanjiIndex = 0;
        let okuriIndex = 0;
        let tmpOffset = offset;
        let tmp = new Array();
        for (let i = 0; i < arrKanji.length + arrOkuri.length; i++) {
            if (startBool == false) {
                tmp.push({ data: arrOkuri[okuriIndex], ruby: null, offset: tmpOffset });
                tmpOffset += arrOkuri[okuriIndex].length;
                okuriIndex++;
                startBool = true;
            }
            else {
                tmp.push({ data: arrKanji[kanjiIndex], ruby: arrHuri[kanjiIndex], offset: tmpOffset });
                tmpOffset += arrKanji[kanjiIndex].length;
                kanjiIndex++;
                startBool = false;
            }
        }
        return tmp;
    };
    return { yomiToHuri, hysToHuri, complexArr };
}
function useJaText() {
    const unicodeRange = (0, react_1.useContext)(client_1.UnicodeRangeContext);
    const unicodeContext = (0, react_1.useContext)(client_1.UnicodeContext);
    const nfd = [...'각힣'.normalize('NFD')].map(el => el.charCodeAt(0));
    const chosungsRegex = new RegExp(`[\\u${nfd[0].toString(16)}-\\u${nfd[3].toString(16)}]`, 'g');
    const jungsungsRegex = new RegExp(`[\\u${nfd[1].toString(16)}-\\u${nfd[4].toString(16)}]`, 'g');
    const jongsungsRegex = new RegExp(`[\\u${nfd[2].toString(16)}-\\u${nfd[5].toString(16)}]`, 'g');
    const isHangulRegex = new RegExp(`^[가-힣\-]+$`, 'g');
    const isAllNihongoRegex = new RegExp(`^[${unicodeRange.kanji}${unicodeRange.hiragana}${unicodeRange.katakana}]+$`, 'g');
    const isAllHiraRegex = new RegExp(`^[${unicodeRange.hiragana}]+$`);
    const isAllKanjiRegex = new RegExp(`^[${unicodeRange.kanji}]+$`);
    const isHiraRegex = new RegExp(`[${unicodeRange.hiragana}]+`, 'g');
    const isKanjiRegex = new RegExp(`[${unicodeRange.kanji}]+`, 'g');
    const hiraganaKumi = [
        ['あ', 'い', 'う', 'え', 'お', 'や', 'ゆ', 'よ'],
        ['か', 'き', 'く', 'け', 'こ', 'きゃ', 'きゅ', 'きょ'],
        ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ぎゃ', 'ぎゅ', 'ぎょ'],
        ['さ', 'し', 'す', 'せ', 'そ', 'しゃ', 'しゅ', 'しょ'],
        ['ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'じゃ', 'じゅ', 'じょ'],
        ['た', 'ち', 'つ', 'て', 'と', 'ちゃ', 'ちゅ', 'ちょ'],
        ['だ', 'ぢ', 'づ', 'で', 'ど', 'ちゃ', 'ちゅ', 'ちょ'],
        ['な', 'に', 'ぬ', 'ね', 'の', 'にゃ', 'にゅ', 'にょ'],
        ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ひゃ', 'ひゅ', 'ひょ'],
        ['ば', 'び', 'ぶ', 'べ', 'ぼ', 'びゃ', 'びゅ', 'びょ'],
        ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ぴゃ', 'ぴゅ', 'ぴょ'],
        ['ま', 'み', 'む', 'め', 'も', 'みゃ', 'みゅ', 'みょ'],
        ['ら', 'り', 'る', 'れ', 'ろ', 'りゃ', 'りゅ', 'りょ']
    ];
    //'ぅ'로 되는 경우의 모음은 아직 정해지지 않은 상태
    const hiraganaTokubetsuKumi = [
        ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
        ['わ', 'うぃ', 'ぅ', 'うぇ', 'うぉ'],
        ['くぁ', 'くぃ', 'ぅ', 'くぇ', 'くぉ'],
        ['ぐぁ', 'ぐぃ', 'ぅ', 'ぐぇ', 'ぐぉ'],
        ['すぁ', 'すぃ', 'ぅ', 'しぇ', 'すぉ'],
        ['ずぁ', 'ずぃ', 'ぅ', 'じぇ', 'ずぉ'],
        ['つぁ', 'てぃ', 'とぅ', 'ちぇ', 'つぉ'],
        ['づぁ', 'でぃ', 'どぅ', 'ぢぇ', 'づぉ'],
        ['ぬぁ', 'ぬぃ', 'ぅ', 'ぬぇ', 'ぬぉ'],
        ['ふぁ', 'ふぃ', 'ほぅ', 'ふぇ', 'ふぉ'],
        ['ぶぁ', 'ぶぃ', 'ぅ', 'ぶぇ', 'ぶぉ'],
        ['ぷぁ', 'ぷぃ', 'ぅ', 'ぷぇ', 'ぷぉ'],
        ['むぁ', 'むぃ', 'ぅ', 'むぇ', 'むぉ'],
        ['るぁ', 'るぃ', 'ぅ', 'るぇ', 'るぉ']
    ];
    const hiraganaTokubetsuDan = hiraganaTokubetsuKumi[0].reduce((acc, value, index) => { return { ...acc, [value]: index }; }, {});
    const hiraganaKou = hiraganaKumi.reduce((acc, value, index) => { return { ...acc, [value[0]]: index }; }, {});
    const hiraganaDan = hiraganaKumi[0].reduce((acc, value, index) => { return { ...acc, [value]: index }; }, {});
    const chosungs = [
        'ㄱ',
        'ㄲ',
        'ㄴ',
        'ㄷ',
        'ㄸ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅃ',
        'ㅅ',
        'ㅆ',
        'ㅇ',
        'ㅈ',
        'ㅉ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ'
    ];
    const junsungs = [
        'ㅏ',
        'ㅐ',
        'ㅑ',
        'ㅒ',
        'ㅓ',
        'ㅔ',
        'ㅕ',
        'ㅖ',
        'ㅗ',
        'ㅘ',
        'ㅙ',
        'ㅚ',
        'ㅛ',
        'ㅜ',
        'ㅝ',
        'ㅞ',
        'ㅟ',
        'ㅠ',
        'ㅡ',
        'ㅢ',
        'ㅣ'
    ];
    const jongsungs = [
        'ㄱ',
        'ㄲ',
        'ㄳ',
        'ㄴ',
        'ㄵ',
        'ㄶ',
        'ㄷ',
        'ㄹ',
        'ㄺ',
        'ㄻ',
        'ㄼ',
        'ㄽ',
        'ㄾ',
        'ㄿ',
        'ㅀ',
        'ㅁ',
        'ㅂ',
        'ㅄ',
        'ㅅ',
        'ㅆ',
        'ㅇ',
        'ㅈ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ'
    ];
    const hangulChosungHiraMatch = {
        ㄱ: 'が',
        ㄲ: 'か',
        ㄴ: 'な',
        ㄷ: 'だ',
        ㄸ: 'た',
        ㄹ: 'ら',
        ㅁ: 'ま',
        ㅂ: 'ば',
        ㅃ: 'ぱ',
        ㅅ: 'さ',
        ㅆ: 'さ',
        ㅇ: 'あ',
        ㅈ: 'ざ',
        ㅉ: 'ざ',
        ㅊ: 'た',
        ㅋ: 'か',
        ㅌ: 'た',
        ㅍ: 'ぱ',
        ㅎ: 'は'
    };
    const hangulJunsungHiraMatch = {
        ㅏ: 'あ',
        ㅐ: 'え',
        ㅑ: 'や',
        ㅒ: 'え',
        ㅓ: 'お',
        ㅔ: 'え',
        ㅕ: 'よ',
        ㅖ: 'え',
        ㅗ: 'お',
        ㅘ: 'ぁ',
        ㅙ: 'ぇ',
        ㅚ: 'ぇ',
        ㅛ: 'よ',
        ㅜ: 'う',
        ㅝ: 'ぉ',
        ㅞ: 'ぇ',
        ㅟ: 'ぃ',
        ㅠ: 'ゆ',
        ㅡ: 'う',
        ㅢ: 'い',
        ㅣ: 'い'
    };
    const hangulJonsungHiraMatch = {
        ㄱ: 'っ',
        ㄲ: 'っ',
        ㄴ: 'ん',
        ㄷ: 'っ',
        ㄹ: 'っ',
        ㅁ: 'ん',
        ㅂ: 'っ',
        ㅅ: 'っ',
        ㅆ: 'っ',
        ㅇ: 'ん',
        ㅈ: 'っ',
        ㅊ: 'っ',
        ㅋ: 'っ',
        ㅌ: 'っ',
        ㅍ: 'っ',
        ㅎ: 'っ'
    };
    const koNFCToHira = (hangul) => {
        let hangulArr = hangul.split('');
        let hira = hangulArr.map((word, index, arr) => hangulToHira(word, index, arr));
        return hira.join('');
    };
    const checkChouon = (char) => {
        let normalized = char.normalize('NFD').replace(chosungsRegex, $0 => chosungs[$0.charCodeAt(0) - 0x1100]).replace(jungsungsRegex, $0 => junsungs[$0.charCodeAt(0) - 0x1161]).replace(jongsungsRegex, $0 => jongsungs[$0.charCodeAt(0) - 0x11A8]);
        let second = hangulJunsungHiraMatch[normalized[1]];
        switch (second) {
            case 'あ':
                return 'あ';
            case 'い':
                return 'い';
            case 'う':
                return 'う';
            case 'え':
                return 'い'; //e단
            case 'お':
                return 'う'; //o단
            default:
                return 'う';
        }
    };
    const hangulToHira = (char, index, arr) => {
        let normalized = char.normalize('NFD').replace(chosungsRegex, $0 => chosungs[$0.charCodeAt(0) - 0x1100]).replace(jungsungsRegex, $0 => junsungs[$0.charCodeAt(0) - 0x1161]).replace(jongsungsRegex, $0 => jongsungs[$0.charCodeAt(0) - 0x11A8]);
        if (normalized.length >= 2 && normalized.length <= 3) {
            //NFD NFC에 대해 좀더 생각, 'ㅋ'이랑 ㅋ과는 다른 듯. 뭔가 변환 생각해서 es-hangul 참조.
            let first = hangulChosungHiraMatch[normalized[0]];
            let second = hangulJunsungHiraMatch[normalized[1]];
            let third = '';
            if (normalized.length == 3) {
                third = hangulJonsungHiraMatch[normalized[2]];
            }
            /*
            if( de[0] == 'ㅇ' && de[1] == 'ㅘ' ){
              return 'わ' + third;
            }
            */
            if (second == 'ぁ' || second == 'ぃ' || second == 'ぅ' || second == 'ぇ' || second == 'ぉ') {
                let b = hiraganaKou[first];
                let a = hiraganaTokubetsuDan[second];
                return hiraganaTokubetsuKumi[b + 1][a] + third;
            }
            let kou = hiraganaKou[first];
            let dan = hiraganaDan[second];
            if (kou == undefined || dan == undefined) {
                return char;
            }
            return hiraganaKumi[kou][dan] + third;
        }
        else {
            if (char == '-' && index != 0) {
                return checkChouon(arr[index - 1]);
            }
            return char;
        }
    };
    const isAllHangul = (text) => {
        isHangulRegex.lastIndex = 0;
        return isHangulRegex.test(text);
    };
    const isAllNihongo = (text) => {
        isAllNihongoRegex.lastIndex = 0;
        return isAllNihongoRegex.test(text);
    };
    const isAllHira = (text) => {
        isAllHiraRegex.lastIndex = 0;
        return isAllHiraRegex.test(text);
    };
    //오쿠리가나 관련 나중에 나눌지는 고민중.
    //오쿠리 : 한자 일본어 섞인 상태, kanji는 한자 only, hira는 히라가나 only
    const getRegexRevise = (text) => {
        let extractKanjiArr = extractKanji(text);
        let kanjiArr = extractKanjiArr != null ? extractKanjiArr.join('').split('') : [""];
        let kanji_pattern = kanjiArr.map((arr) => `${arr}`).join(`[${unicodeRange.hiragana}]*`);
        let testRegex = new RegExp(`(?<pre>[${unicodeRange.hiragana}]*)(?<pattern>${kanji_pattern})(?<suf>[${unicodeRange.hiragana}]*)`);
        return testRegex;
    };
    const extractKanji = (okuri) => {
        //return 형식은 한자가 붙어있는 경우는 한번에 나감.
        let hyouki_kanji = okuri.match(isKanjiRegex);
        return hyouki_kanji;
    };
    const extractHira = (okuri) => {
        let hyouki_hira = okuri.match(isHiraRegex);
        return hyouki_hira;
    };
    const checkKatachi = (nihongo) => {
        let isHiraKanjiRegex = new RegExp(`^[${unicodeRange.kanji}${unicodeRange.hiragana}]+$`, 'g');
        isHiraKanjiRegex.lastIndex = 0;
        if (isHiraKanjiRegex.test(nihongo)) {
            isAllHiraRegex.lastIndex = 0;
            isAllKanjiRegex.lastIndex = 0;
            if (isAllHiraRegex.test(nihongo)) {
                return 'hira';
            }
            else if (isAllKanjiRegex.test(nihongo)) {
                return 'kanji';
            }
            else {
                return 'okuri';
            }
        }
        else {
            return null;
        }
    };
    const isOnajiOkuri = (hyouki, yomi, newText) => {
        let hyouki_type = checkKatachi(hyouki);
        let newText_type = checkKatachi(newText);
        //console.log(`type : ${hyouki_type} ${newText_type}`);
        if (hyouki_type == 'kanji') {
            if (newText_type == 'okuri') {
                //표기는 한자, 새로운 text는 오쿠리 형식
                let exKanji = extractKanji(newText);
                let exHira = extractHira(newText);
                let exKanjiPattern = exKanji != null ? exKanji.map((arr) => `(${arr}.*)`).join('') : "";
                let exKanjiRegex = new RegExp(`^(.*)${exKanjiPattern}$`);
                let exHiraPattern = exHira != null ? exHira.map((arr) => `(.*${arr})`).join('') : "";
                let exHiraRegex = new RegExp(`^${exHiraPattern}(.*)$`);
                exKanjiRegex.lastIndex = 0;
                if (exKanjiRegex.test(hyouki)) {
                    exHiraRegex.lastIndex = 0;
                    if (exHiraRegex.test(yomi)) {
                        return true;
                    }
                }
            }
        }
        else if (hyouki_type == 'okuri') {
            let exKanji = extractKanji(hyouki);
            let exHira = extractHira(hyouki);
            let exKanjiPattern = exKanji != null ? exKanji.map((arr) => `(${arr}.*)`).join('') : null;
            let exKanjiRegex = new RegExp(`^(.*)${exKanjiPattern}$`);
            let exHiraPattern = exHira != null ? exHira.map((arr) => `(.*${arr})`).join('') : null;
            let exHiraRegex = new RegExp(`^${exHiraPattern}(.*)$`);
            if (newText_type == 'kanji') {
                // 'お金', 'おかね', '金' 의 경우에는 true가 나옴, newText의 읽기를 비교할수 없는 문제.
                exKanjiRegex.lastIndex = 0;
                if (exKanjiRegex.test(newText) == true) {
                    let maeOkuriPattern = exKanji != null ? exKanji.map((arr) => `${arr}(?:.*)`).join('') : "";
                    let maeOkuriRegex = new RegExp(`^(?<mae>.*)${maeOkuriPattern}$`);
                    //console.log( hyouki.match(maeOkuriRegex) );
                    if (hyouki.match(maeOkuriRegex)?.groups?.mae == '') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else if (newText_type == 'okuri') {
                let extractKanjiArr = extractKanji(newText);
                let exKanjiNew = extractKanjiArr !== null ? extractKanjiArr.join('').split('') : [""];
                //console.log(exKanjiNew);
                let exHiraNew = extractHira(newText);
                let exKanjiNewPattern = exKanjiNew !== null ? exKanjiNew.map((arr) => `(${arr}.*)`).join('') : "";
                let exKanjiNewRegex = new RegExp(`^(.*)${exKanjiNewPattern}$`);
                let exHiraNewPattern = exHiraNew !== null ? exHiraNew.map((arr) => `(.*${arr})`).join('') : "";
                let exHiraNewRegex = new RegExp(`^${exHiraNewPattern}(.*)$`);
                //console.log(exKanjiNewRegex);
                //console.log(exHiraNewRegex);
                exKanjiNewRegex.lastIndex = 0;
                if (exKanjiNewRegex.test(hyouki)) {
                    let maeOkuriPattern = exKanjiNew.map((arr) => `${arr}(?:.*)`).join('');
                    let maeOkuriRegex = new RegExp(`^(?<mae>.*)${maeOkuriPattern}$`);
                    //console.log( newText.match(maeOkuriRegex) );
                    //console.log( hyouki.match(maeOkuriRegex) );
                    exHiraNewRegex.lastIndex = 0;
                    if (exHiraNewRegex.test(yomi)) {
                        if (hyouki.match(maeOkuriRegex)?.groups?.mae == newText.match(maeOkuriRegex)?.groups?.mae) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
        }
        return false;
    };
    const matchOkuri = (hyouki, yomi, bunText) => {
        let hyouki_type = checkKatachi(hyouki);
        if (hyouki_type == 'kanji' || hyouki_type == 'okuri') {
            let kanji_regex = getRegexRevise(hyouki);
            let match_bun = bunText.match(kanji_regex);
            let match_hyouki = hyouki.match(kanji_regex);
            if (match_bun == null) {
                //return [bunText, -1, -1];
                return [null, -1, -1];
            }
            //console.log(match_hyouki);
            //console.log(match_bun)
            let preStr = '';
            let sufStr = '';
            if (match_hyouki?.groups?.pre != '') {
                let preRegex = new RegExp(`${match_hyouki?.groups?.pre}$`, 'g');
                if (match_bun?.groups?.pre != '') {
                    let preMatch = match_bun?.groups?.pre.match(preRegex);
                    if (preMatch != null) {
                        preStr = preMatch[0];
                    }
                }
            }
            else {
            }
            if (match_hyouki?.groups?.suf != '' && match_hyouki?.groups?.suf != undefined) {
                let lastIndex = match_hyouki.groups.suf.length - 1;
                let lastHira = match_hyouki.groups.suf[lastIndex];
                let sufRegex = new RegExp(`^[${unicodeRange.hiragana}]*${lastHira}`);
                if (match_bun?.groups?.suf != '') {
                    let sufMatch = match_bun?.groups?.suf.match(sufRegex);
                    if (sufMatch != null) {
                        //console.log(sufMatch);
                        for (let key in sufMatch) {
                            let tmp_regex = new RegExp(`${sufMatch[key]}$`);
                            if (yomi.match(tmp_regex) != null) {
                                sufStr = sufMatch[key];
                            }
                        }
                    }
                }
            }
            else {
                let lastIndex = yomi.length - 1;
                let lastHira = yomi[lastIndex];
                let sufRegex = new RegExp(`^[${unicodeRange.hiragana}]*${lastHira}`);
                if (match_bun?.groups?.suf != '') {
                    let sufMatch = match_bun?.groups?.suf.match(sufRegex);
                    if (sufMatch != null) {
                        //console.log(sufMatch);
                        for (let key in sufMatch) {
                            let tmp_regex = new RegExp(`${sufMatch[key]}$`);
                            if (yomi.match(tmp_regex) != null) {
                                sufStr = sufMatch[key];
                            }
                        }
                    }
                }
            }
            //console.log(`${preStr}${match_bun.groups.pattern}${sufStr}`);
            let reviseRegex = new RegExp(`${preStr}${match_bun?.groups?.pattern}${sufStr}`, 'g');
            let match = bunText.match(reviseRegex);
            // console.log(match);　
            //두개 이상일경우 다 나옴. 근데 이단계에서 값이 나오는건 그다지 쓸모 없을 듯함.
            if (match == null) {
                return [null, -1, -1];
                //return [bunText, -1, -1];
            }
            let matchingIndex = bunText.indexOf(match[0]);
            let endIndex = matchingIndex + match[0].length;
            let replaceStr = bunText.split('').fill("　", matchingIndex, endIndex).join('');
            if (isOnajiOkuri(hyouki, yomi, match[0]) == true) {
                return [replaceStr, matchingIndex, endIndex];
            }
            if (hyouki == match[0]) {
                return [replaceStr, matchingIndex, endIndex];
            }
        }
        //return [bunText, -1, -1];
        return [null, -1, -1];
    };
    const matchOkuriExec = function (hyouki, yomi, bunText) {
        let text = bunText;
        function matchExec() {
            let ret = matchOkuri(hyouki, yomi, text);
            if (ret[0] != null) {
                text = ret[0];
                return ret;
            }
            else {
                return null;
            }
        }
        return {
            exec() {
                return matchExec();
            }
        };
    };
    const matchAllOkuri = (hyouki, yomi, bunText) => {
        let match = matchOkuriExec(hyouki, yomi, bunText);
        let arr;
        while ((arr = match.exec()) != null) {
            // console.log(arr);
        }
    };
    const getMED = (bunText, newText) => {
        let medArr = Array.from(Array(bunText.length + 1), () => new Array(newText.length + 1));
        // console.log(bunText.length, newText.length);
        for (let i = 0; i < medArr.length; i++) {
            for (let j = 0; j < medArr[i].length; j++) {
                if (i == 0) {
                    medArr[i][j] = j;
                }
                else {
                    if (j == 0) {
                        medArr[i][j] = i;
                    }
                    else {
                        if (bunText[i - 1] == newText[j - 1]) {
                            medArr[i][j] = medArr[i - 1][j - 1];
                        }
                        else {
                            medArr[i][j] = Math.min(medArr[i][j - 1], medArr[i - 1][j], medArr[i - 1][j - 1]) + 1;
                        }
                    }
                }
            }
        }
        let ret = {
            del: new Array(),
            add: new Array()
        };
        let retRevise = {
            del: new Array(bunText.length).fill(0),
            add: new Array(newText.length).fill(0)
        };
        let i = medArr.length - 1;
        let j = medArr[0].length - 1;
        while (!(i == 0 && j == 0)) {
            let min = Math.min(medArr[i][j - 1], medArr[i - 1][j], medArr[i - 1][j - 1]);
            if (medArr[i][j] == min) {
                i -= 1;
                j -= 1;
            }
            else {
                if (min == medArr[i][j - 1]) {
                    ret.add.push({
                        text: newText[j - 1], offset: j - 1
                    });
                    retRevise.add[j - 1] = 1;
                    j -= 1;
                }
                else if (min == medArr[i - 1][j]) {
                    ret.del.push({
                        text: bunText[i - 1], offset: i - 1
                    });
                    retRevise.del[i - 1] = 1;
                    i -= 1;
                }
                else {
                    ret.del.push({
                        text: bunText[i - 1], offset: i - 1
                    });
                    ret.add.push({
                        text: newText[j - 1], offset: j - 1
                    });
                    retRevise.del[i - 1] = 1;
                    retRevise.add[j - 1] = 1;
                    i -= 1;
                    j -= 1;
                }
            }
        }
        let delExec = function (delMed) {
            let medValue = delMed;
            function getValue() {
                return medValue;
            }
            function getIsDel(start, end) {
                return medValue.reduce((acc, v, i) => {
                    if (start <= i && i < end) {
                        // console.log('v, i', v, i);
                        return acc + v;
                    }
                    return acc;
                }, 0);
            }
            function setDel(start, end) {
                medValue = medValue.map((arr, i) => {
                    if (start <= i && i < end) {
                        return 1;
                    }
                    else {
                        return arr;
                    }
                });
            }
            return {
                getIsDel(start, end) {
                    return getIsDel(start, end);
                },
                setDel(start, end) {
                    return setDel(start, end);
                },
                getValue() {
                    return getValue();
                }
            };
        };
        let addExec = function (addMed) {
            let medValue = addMed;
            function getValue() {
                return medValue;
            }
            function getIsAdd(start, end) {
                return medValue.reduce((acc, v, i) => {
                    if (start <= i && i < end) {
                        // console.log('v, i', v, i);
                        return acc + v;
                    }
                    return acc;
                }, 0);
            }
            function setAdd(start, end) {
                medValue = medValue.map((arr, i) => {
                    if (start <= i && i < end) {
                        return 1;
                    }
                    else {
                        return arr;
                    }
                });
            }
            return {
                getIsAdd(start, end) {
                    return getIsAdd(start, end);
                },
                setAdd(start, end) {
                    return setAdd(start, end);
                },
                getValue() {
                    return getValue();
                }
            };
        };
        return { del: delExec(retRevise.del), add: addExec(retRevise.add) };
    };
    const traceHukumu = (hukumu, bunText, newText) => {
        const med = getMED(bunText, newText);
        //일단 현재 getHukumuData의 양식에 따라서.
        const matchArr = hukumu.map((arr) => { return matchOkuriExec(arr.DATA, arr.RUBY, newText); });
        let ret = [...hukumu]; // 일단 얕은 복사로 되어서 hukumu의 내용을 수정하게 됨. 근데 딱히 문제는 없는 듯.
        let { del, add } = med;
        for (let i in hukumu) {
            let { STARTOFFSET: start, ENDOFFSET: end } = hukumu[i];
            let isDel = del.getIsDel(start, end);
            if (isDel == 0) {
                //아무것도 삭제되지 않은 경우.
                let tmpArr;
                while ((tmpArr = matchArr[i].exec()) != null) {
                    let [str, newStart, newEnd] = tmpArr;
                    let isAdd = add.getIsAdd(newStart, newEnd);
                    if (isAdd < newEnd - newStart) {
                        del.setDel(start, end);
                        add.setAdd(newStart, newEnd);
                        ret[i].find = { str: newText.substring(newStart, newEnd), startOffset: newStart, endOffset: newEnd };
                        break;
                    }
                }
                if (tmpArr == null) {
                    ret[i].find = null;
                }
            }
            else if (isDel < end - start) {
                //일부 삭제된 경우.
                let tmpArr;
                while ((tmpArr = matchArr[i].exec()) != null) {
                    let [str, newStart, newEnd] = tmpArr;
                    let isAdd = add.getIsAdd(newStart, newEnd);
                    if (isAdd < newEnd - newStart) {
                        del.setDel(start, end);
                        add.setAdd(newStart, newEnd);
                        ret[i].find = { str: newText.substring(newStart, newEnd), startOffset: newStart, endOffset: newEnd };
                        break;
                    }
                }
                if (tmpArr == null) {
                    ret[i].find = null;
                }
            }
            else {
                let tmpArr;
                while ((tmpArr = matchArr[i].exec()) != null) {
                    let [str, newStart, newEnd] = tmpArr;
                    let isAdd = add.getIsAdd(newStart, newEnd);
                    if (isAdd == newEnd - newStart) {
                        add.setAdd(newStart, newEnd);
                        ret[i].find = { str: newText.substring(newStart, newEnd), startOffset: newStart, endOffset: newEnd };
                        break;
                    }
                }
                if (tmpArr == null) {
                    ret[i].find = null;
                }
            }
        }
        // console.log('jaTextHook DEL', del.getValue());
        // console.log('ret', ret);
        return { trace: ret, del: del, add: add };
    };
    const isBun = (bunText) => {
        let ret = false;
        let indexKagiDepth = 0;
        let length = bunText.length;
        let index = 0;
        while (index < length) {
            if (bunText.charAt(index) == '\n') {
                break;
            }
            else if (bunText.charAt(index) == '。') {
                break;
            }
            else if (bunText.charAt(index) == '「') {
                indexKagiDepth++;
            }
            else if (bunText.charAt(index) == '」') {
                indexKagiDepth--;
            }
        }
        if (index != length - 1) {
            ret = false;
        }
        else {
            if (indexKagiDepth == 0) {
                ret = true;
            }
            else {
                ret = false;
            }
        }
        return ret;
    };
    const replaceSpecial = (bunText) => {
        let repBun = bunText.replaceAll('\'', '\'\'');
        //console.log(repBun);
        return repBun;
    };
    const autoPeriod = (bunText) => {
        let isPeriodRegex = new RegExp(`^.+。$`);
        let isKagiRegex = new RegExp(`^.+[」|』]$`);
        //일단 예상치 못한 곳에도 들어가는 문제가 있음.
        if (isPeriodRegex.test(bunText) == false) {
            if (isKagiRegex.test(bunText) == false) {
                bunText = bunText.concat('。');
            }
        }
        return bunText;
    };
    return { koNFCToHira, isAllHangul, isAllNihongo, isAllHira, checkKatachi, isOnajiOkuri, matchOkuri, matchOkuriExec, matchAllOkuri, traceHukumu, isBun, replaceSpecial, autoPeriod };
}
function useKirikae(value, handleChange) {
    const [kirikae, setKirikae] = (0, react_1.useState)(null);
    const [isKirikae, setIsKirikae] = (0, react_1.useState)(false);
    const debounce = (0, hook_1.useDebounce)();
    const debouncedKirikae = debounce((value) => setIsKirikae(value), 1000);
    const { isAllHangul, isAllHira, koNFCToHira } = useJaText();
    const handleKrikae = (e) => {
        if (isKirikae == true) {
            setIsKirikae(false);
        }
        else {
            handleChange(e);
        }
    };
    const changeHira = (value) => {
        if (isAllHangul(value) == true && isAllHira(value) == false) {
            return koNFCToHira(value);
        }
        else {
            return value;
        }
    };
    (0, react_1.useEffect)(() => {
        if (isKirikae == false) {
            debouncedKirikae(true);
        }
    }, [kirikae]);
    (0, react_1.useEffect)(() => {
        if (value != null) {
            if (isKirikae == true) {
                setIsKirikae(false);
            }
            else {
                let kirikaeTmp = changeHira(value);
                setKirikae(kirikaeTmp);
            }
        }
    }, [value]);
    const kirikaeValue = isKirikae ? kirikae : value;
    return { kirikaeValue, handleChange: handleKrikae, kirikae };
}
function useMultiKirikae(multiValue, handleMultiChange) {
    const [value, setValue] = (0, react_1.useState)([]);
    const [isKirikae, setIsKirikae] = (0, react_1.useState)(false);
    const debounce = (0, hook_1.useDebounce)();
    const debouncedKirikae = debounce((value) => setIsKirikae(value), 1000);
    const { isAllHangul, isAllHira, koNFCToHira } = useJaText();
    const handleChange = (e, index) => {
        if (isKirikae == true) {
            setIsKirikae(false);
        }
        else {
            handleMultiChange(e, index);
        }
    };
    const changeMultiHira = () => {
        let kirikaeTmp = [...value];
        for (let key in multiValue) {
            kirikaeTmp[key] = changeHira(multiValue[key]);
        }
        setValue(kirikaeTmp);
        debouncedKirikae(true);
    };
    const concatMultiInput = () => {
        let retStr = '';
        for (let key in multiValue) {
            retStr += changeHira(multiValue[key]);
        }
        return retStr;
    };
    const changeHira = (value) => {
        if (isAllHangul(value) == true && isAllHira(value) == false) {
            return koNFCToHira(value);
        }
        else {
            return value;
        }
    };
    (0, react_1.useEffect)(() => {
        if (isKirikae == false) {
            debouncedKirikae(true);
        }
    }, [value]);
    (0, react_1.useEffect)(() => {
        if (multiValue != null) {
            // console.log('reset', multiValue);
            if (isKirikae == true) {
                setIsKirikae(false);
            }
            else {
                changeMultiHira();
            }
        }
    }, [multiValue]);
    const kirikaeValue = isKirikae ? value : multiValue;
    return { kirikaeValue, concatMultiInput, handleChange };
}
function useMultiInput(dependancy, defaultInput) {
    const [multiValue, setMultiValue] = (0, react_1.useState)([]);
    const [multiInputData, setMultiInputData] = (0, react_1.useState)([{ data: '', inputBool: false }]);
    const { yomiToHuri } = useHuri();
    //useHuri로 대체 할 수 있는 지 확인 바람.
    const kanjiRegex = (0, react_1.useContext)(client_1.UnicodeContext).kanji;
    const hiraganaRegex = (0, react_1.useContext)(client_1.UnicodeContext).hiragana;
    const handleChange = (e, index) => {
        let tmp = [...multiValue];
        tmp[index] = e.target.value;
        setMultiValue(tmp);
    };
    const multiInput = (tango) => {
        let arrKanji = tango.match(kanjiRegex);
        let arrOkuri = tango.match(hiraganaRegex);
        let arrHuri = new Array(); //tango의 히라가나 부분만 들어가는 배열
        let startBool = true; //true면 한자 시작
        let tmp = new Array();
        let endIndex = 0;
        if (arrOkuri != null) {
            for (let idx = 0; idx < arrOkuri.length; idx++) {
                //console.log(props.ruby);
                //console.log(arrOkuri[key]);
                //console.log(props.ruby.indexOf(arrOkuri[key]));
                if (tango.substring(endIndex, tango.indexOf(arrOkuri[idx], endIndex)) == '') {
                    startBool = false;
                }
                else {
                    arrHuri.push(tango.substring(endIndex, tango.indexOf(arrOkuri[idx], endIndex)));
                }
                endIndex = tango.indexOf(arrOkuri[idx], endIndex) + arrOkuri[idx].length;
                //console.log(endIndex);
                //첫문자가 히라가나로 시작할 경우 빈문자열 push됨.
            }
            if (tango.substring(endIndex) != '') {
                //console.log(props.ruby);
                //console.log(endIndex);
                arrHuri.push(tango.substring(endIndex));
            }
        }
        let kanjiIndex = 0;
        let okuriIndex = 0;
        if (arrOkuri != null && arrKanji != null) {
            for (let i = 0; i < arrKanji.length + arrOkuri.length; i++) {
                if (startBool == false) {
                    tmp.push({ data: arrOkuri[okuriIndex], inputBool: false });
                    okuriIndex++;
                    startBool = true;
                }
                else {
                    tmp.push({ inputBool: true });
                    kanjiIndex++;
                    startBool = false;
                }
            }
        }
        else {
            if (arrOkuri != null && arrKanji == null) {
                tmp = [{ data: arrOkuri[0], inputBool: false }];
            }
            else if (arrOkuri == null && arrKanji != null) {
                tmp = [{ inputBool: true }];
            }
            else {
                tmp = [{ data: '', inputBool: false }];
            }
        }
        return tmp;
    };
    //불안정.
    const getDefaultInput = () => {
        if (defaultInput != null && defaultInput != undefined) {
            let huriArr = yomiToHuri(dependancy, defaultInput);
            return huriArr;
        }
        else {
            return null;
        }
    };
    (0, react_1.useEffect)(() => {
        if (dependancy != null) {
            // console.log('dependancy');
            if (dependancy.length > 10) {
                return;
            }
            let tmp = multiInput(dependancy);
            // console.log(tmp);
            setMultiInputData(tmp);
            let def = getDefaultInput();
            // console.log(def);
            let huriIndex = 0;
            let ret = new Array();
            for (let key in tmp) {
                if (tmp[key]['inputBool'] == false) {
                    ret[key] = tmp[key]['data'];
                }
                else {
                    if (def != null) {
                        ret[key] = def[huriIndex];
                        huriIndex++;
                    }
                    else {
                        ret[key] = '';
                    }
                }
            }
            // console.log(ret);
            setMultiValue(ret);
        }
    }, [dependancy]);
    return { multiValue, multiInputData, handleChange };
}
function useBun() {
    const isBun = (bunText) => {
        let bunArr = danToBun(bunText);
        if (bunArr != null) {
            if (bunArr.length > 1) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    const isDan = (danText) => {
        let danArr = danText.split('\n');
        if (danArr.length == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    const honToDan = (honText) => {
        let danArr = honText.split('\n');
        return danArr;
    };
    const danToBun = (danText) => {
        let isDanText = isDan(danText);
        if (isDanText == false) {
            return null;
        }
        let numBun = 0;
        let retArr = new Array();
        let index = 0;
        let indexEnd = -1;
        let indexKagiDepth = 0;
        let length = danText.length;
        let tmpStr = '';
        while (index < length) {
            let currChar = danText.charAt(index);
            if (currChar == '。') {
                if (indexKagiDepth == 0) {
                    tmpStr = danText.substring(indexEnd + 1, index + 1);
                    indexEnd = index;
                    retArr.push(tmpStr);
                    numBun++;
                }
            }
            else if (currChar == '「' || currChar == '『') {
                indexKagiDepth++;
            }
            else if (currChar == '」' || currChar == '』') {
                indexKagiDepth--;
            }
            index++;
        }
        if (index - indexEnd > 0 && indexEnd != length - 1) {
            tmpStr = danText.substring(indexEnd + 1, index);
            if (tmpStr != '\n' && tmpStr != '。' && tmpStr != '「' && tmpStr != '」') {
                retArr.push(tmpStr);
            }
        }
        return retArr;
    };
    return { isDan, isBun, danToBun, honToDan };
}
