import React, { useState, useEffect, useContext } from 'react';

import { useAxios, useJaText, useDebounce, useBun } from 'shared/hook';

import { useTimeStamp } from 'shared/hook';

//test
import { Accordian, StepPage } from 'components';

import { ComplexText, CompareBun } from 'shared/customComp'

const TestComp = () => {

  return(
    <div className="testComp">
      <StepPage>
        <StepPage.Comp>
          <TestInvite/>
          <TestUseBunComp/>
        </StepPage.Comp>
        <StepPage.Comp>
          <ComplexText data={'言い続け'} ruby={'いいつづけ'} offset={0}/>
          <ComplexText data={'お金'} ruby={'おかね'} offset={0}/>
          <ComplexText data={'お金の遊び'} ruby={'おかねのあそび'} offset={0}/>
          <ComplexText data={'お金遊び'} ruby={'おかねあそび'} offset={0}/>
          <ComplexText data={'蘇る'} ruby={'よみがえる'} offset={0}/>
          <ComplexText data={'身体の丈'} ruby={'みのたけ'} offset={0}/>
          <StepPage.Next>
            <button>다음</button>
          </StepPage.Next>
          <TestFrameComp/>
        </StepPage.Comp>
        <StepPage.Comp>
          <StepPage.Next>
            <button>다음</button>
          </StepPage.Next>
          <TestCompareComp/>
        </StepPage.Comp>
        <StepPage.Comp>
          <StepPage.Next>
            <button>다음</button>
          </StepPage.Next>
          <TestSelectionComp/>
          <TestMatchAllOkuriComp/>
        </StepPage.Comp>
        <StepPage.Comp>
          <StepPage.Prev>
            <button>이전</button>
          </StepPage.Prev>
          <StepPage.Next>
            <button>next</button>
          </StepPage.Next>
          <TestOnajiOkuri/>
        </StepPage.Comp>
        <StepPage.Comp>
          <StepPage.Prev>
            <button>prev</button>
          </StepPage.Prev>
          <ValidateHonComp/>
        </StepPage.Comp>
      </StepPage>
    </div>
  )
}

const TestInvite = () => {

  const [code, setCode] = useState(null);

  const { response, setParams, fetch } = useAxios('/user/invite', true, null );

  useEffect( () => {
    let res = response;
    if(res != null){
      setCode(res.data[0]['INVITE_CODE']);
    }
  }, [response])

  return(
    <>
      <button onClick={() => fetch()}>초대하기</button>
      <div>
      {
        code != null &&
        <span>{code}</span>
      }
      </div>
    </>
  )
}

const TestUseBunComp = () => {
  const { danToBun, honToDan } = useBun();

  let danText = '夏の終わりに始まったその話は、五日のことだった。最近集まった仲間たちも皆そういうくらいだった。「大合唱で入ったクレーム。なんてね。」といった。「最悪だ」。まじで聞きたくない話ばっかで、彼女がこう言った。'

  let honText = `夏の終わりに始まったその話は、五日のことだった。最近集まった仲間たちも皆そういうくらいだった。
  「大合唱で入ったクレーム。なんてね。」といった。「最悪だ」
  まじで聞きたくない話ばっかで、彼女がこう言った。`

  return(
    <>
      <div>
        <div>honToDan</div>
        {
          honToDan(honText).map( (arr) =>
            <div>{
              danToBun(arr).map( (bun) => <><span>{bun}</span><button className="edit_bun"></button></>)
            }</div>
          )
        }
      </div>
      <div>
        <div>danToBun</div>
        {danToBun(danText).map( (bun) => <><span>{bun}</span><button className="edit_bun"></button></>)}
      </div>
    </>
  )
}

const TestFrameComp = () => {

  const { timeObj } = useTimeStamp();

  const timeArr = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29
  ]
  const frameTimeArr1 = timeArr.map((arr) => timeObj(0));
  frameTimeArr1.forEach( (arr, index) => { arr.setFrameTime(0, index, 30) } );
  const frameTimeArr2 = timeArr.map((arr) => timeObj(0));
  frameTimeArr2.forEach( (arr, index) => { arr.setFrameTime(1, index, 30) } );

  return(
    <div>
      <div>
        {
          frameTimeArr1.map( (arr, index) => <>
            <div>time{index} : {arr.getFrameStamp(30)} : floorFrame {arr.getFloorFrame(30)} : {timeObj(arr.getFloorFrame(30)).getFrameStamp(30)}</div>
          </>)
        }
        {
          frameTimeArr2.map( (arr, index) => <>
            <div>time{index} : {arr.getFrameStamp(30)} : floorFrame {arr.getFloorFrame(30)} : {timeObj(arr.getFloorFrame(30)).getFrameStamp(30)}</div>
          </>)
        }
      </div>
    </div>
  )
}

const ValidateHonComp = () => {
  const [input, setInput] = useState([]);
  const [validateData, setValidateData] = useState();

  const [success, setSuccess] = useState(false);

  const { response : resTest, setParams : setParamsTest } = useAxios('/user/validate/hon', true, null);
  const { response : resGetTest, setParams : setParamsGetTest } = useAxios('/user/validate/hon/range', false, {hId : 1});

  const submit = () => {
    console.log(input);
    let obj = new Object();

    for(let key in validateData){
      obj[key] = {
        bId : validateData[key].bId,
        index : validateData[key].random,
        text : input[key]
      }
    }
    console.log(obj);
    setParamsTest({
      hId : 1,
      dataObj : obj
    });
  }

  const handleChange = (e, index) => {
    let tmp = [...input];
    tmp[index] = e.target.value;
    setInput(tmp);
  }

  useEffect( () => {
    let res = resGetTest;
    if( res != null){
      setValidateData( res.data );
    }
  }, [resGetTest])

  useEffect( () => {
    let res = resTest;
    if( res != null){
      if(res.data.validate == true){
        setSuccess(true);
      }
    }
  }, [resTest])

  /*
  <div>시작 페이지 {arr.start.page} {arr.start.row}줄 {arr.start.col}번째</div>
  <div>끝 페이지 {arr.end.page} {arr.end.row}줄 {arr.end.col}번째</div>
  일단 위와 같이 해본 결과 test는 가능, myUser.js의 break;는 테스트 해제 예정
  단, rowLength와 pageLength가 원래 책과 같은 세로 쓰기가 아니라 정확히 나오지 않은 상태.
  */

  return (
    <>
      {
        validateData != null &&
        validateData.map( (arr) => <p>
          <div>{arr.page}페이지, {arr.row}줄, {arr.col}번쨰 단어</div>
          <div>단락 힌트 : {arr.firstText}{'　　　　　　'}{arr.prev}{'？'}{'　　　　　　'}{arr.lastText}</div>
          <div>{arr.bNum}번째 문장 {arr.random}</div>
        </p>)
      }
      <input value={input[0]} onChange={ (e) => {handleChange(e, 0)} }/>
      <input value={input[1]} onChange={ (e) => {handleChange(e, 1)} }/>
      <input value={input[2]} onChange={ (e) => {handleChange(e, 2)} }/>
      <input value={input[3]} onChange={ (e) => {handleChange(e, 3)} }/>
      <input value={input[4]} onChange={ (e) => {handleChange(e, 4)} }/>
      <button onClick={submit}>확인</button>
      {
        success ?
        <div>인증 성공</div>
        :
        <div>인증 실패.</div>
      }
    </>
  )
}

const TestOnajiOkuri = () => {

  const { koNFCToHira, isAllHangul, isAllNihongo, isAllHira, matchOkuri, checkKatachi, isOnajiOkuri } = useJaText();

  return(
    <>
      <div>테스트</div>
      <div>{koNFCToHira('후리가나')}</div>
      <div>受け付け {checkKatachi('受け付け')}</div>
      <div>受付 {checkKatachi('受付')}</div>
      <div>うけつけ {checkKatachi('うけつけ')}</div>
      <div>isOnajiOkuri 테스트</div>
      <div>'受付', '受け付け'{isOnajiOkuri('受付', 'うけつけ', '受け付け')+''}</div>
      <div>'受け付け', '受付'{isOnajiOkuri('受け付け', 'うけつけ', '受付')+''}</div>
      <div>'受け付け', '受付け'{isOnajiOkuri('受け付け', 'うけつけ', '受付け')+''}</div>
      <div>'金', 'お金'{isOnajiOkuri('金', 'かね', 'お金')+''} = false</div>
      <div>'お金', '金'{isOnajiOkuri('お金', 'おかね', '金')+''} = false</div>
      <div>'お金', 'お金ね'{isOnajiOkuri('お金', 'おかね', 'お金ね')+''} = true</div>
      <div>'お申し込み', '申込み'{isOnajiOkuri('お申し込み', 'おもうしこみ', '申込み')+''} = false</div>
      <div>'お申し込み', '申込'{isOnajiOkuri('お申し込み', 'おもうしこみ', '申込')+''} = false</div>
      <div>'申し込み', '申込み'{isOnajiOkuri('申し込み', 'もうしこみ', '申込み')+''}</div>
      <div>'申込', '申込み'{isOnajiOkuri('申込', 'もうしこみ', '申込み')+''}</div>
      <div>'申し込み', '申込'{isOnajiOkuri('申し込み', 'もうしこみ', '申込')+''}</div>
      <div>'申込み', '申込'{isOnajiOkuri('申込み', 'もうしこみ', '申込')+''}</div>
      <div>'申込み', '申し込み'{isOnajiOkuri('申込み', 'もうしこみ', '申し込み')+''}</div>
      <div>'申込', '申し込み'{isOnajiOkuri('申込', 'もうしこみ', '申し込み')+''}</div>
      <div>'産み', '生み'{isOnajiOkuri('産み', 'うみ', '生み')+''}</div>
      <div>'思う', '思い'{isOnajiOkuri('思う', 'おもう', '思い')+''}</div>
      <div>'近づく', '近付く'{isOnajiOkuri('近づく', 'ちかづく', '近付く')+''}</div>
      <div>'望む', '望ぞむ'{isOnajiOkuri('望む', 'のぞむ', '望ぞむ')+''}</div>
      <div>'現れる', '現われる'{isOnajiOkuri('現れる', 'あらわれる', '現われる')+''}</div>
    </>
  )
}

const TestSelectionComp = () => {
  const [value, setValue] = useState();

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const debounce = useDebounce();

  const handleSelection = () => {
    let tmpSelection = document.getSelection();
    console.log( 'Selection', tmpSelection );
    console.log( 'string', tmpSelection.toString() );
    let startNode = tmpSelection.anchorNode;
    let endNode = tmpSelection.focusNode;
    console.log('node', startNode, endNode);
  }

  const debouncedHandleSelection = debounce( (value) => handleSelection(value), 300);

  useEffect(() => {
    document.addEventListener('selectionchange', debouncedHandleSelection);
    return () => {
      document.removeEventListener('selectionchange', debouncedHandleSelection);
    };
  }, []);

  return(
    <div id='activeRange'>
      <p>
        <span >お<ruby>前<rt>まえ</rt></ruby><ruby>自分<rt>じぶん</rt></ruby><ruby>地元<rt>じもと</rt></ruby>で人気者でも、俺らお前名前聴いたことがない。</span><span>怒らせてごめん。</span><span>それで何？</span>
      </p>
      <p>
        <span bId='1'>帆酒ボケが<ruby>話<rt>はなし</rt></ruby>ならね。</span><span bId='2'>まじでだから何？</span>
      </p>
    </div>
  )
}

const TestMatchAllOkuriComp = () => {

  return(
    <Accordian defaultIndex={0}>
      <Accordian.Wrap>
        <Accordian.Header>
          事前登録受け付け中
        </Accordian.Header>
        <Accordian.Body>
          <TestSubstring a='お金' b='おかね' c='お金があるから好きなの食うけど'/>
          <TestSubstring a='お申し' b='おもうし' c='巻き込みでお申し込みをお申しします'/>
          <TestSubstring a='込み' b='こみ' c='巻き込みでお申し込みをお申しします'/>
          <TestSubstring a='お申し込み' b='おもうしこみ' c='今週中にお申し込みいたします'/>
          <div>문장 : 事前登録受付中</div>
          <TestSubstring a='受付' b='うけつけ' c='事前登録受け付け中'/>
          <TestSubstring a='受け付け' b='うけつけ' c='事前登録受け付け中'/>
          <TestSubstring a='受付中' b='うけつけちゅう' c='事前登録受付中'/>
          <TestSubstring a='受け付け中' b='うけつけちゅう' c='事前登録受付中'/>
          <TestSubstring a='事前' b='じぜん' c='事前登録受け付け中'/>
          <TestSubstring a='登録' b='とうろく' c='事前登録受付中'/>
        </Accordian.Body>
      </Accordian.Wrap>
      <Accordian.Wrap>
        <Accordian.Header>
          matchAllOkuri 테스트
        </Accordian.Header>
        <Accordian.Body>
          <TestSubstring a='近づいて' b='ちかづいて' c='近づいてる僕望んでる未来'/>
          <TestSubstring a='僕' b='ぼく' c='近づいてる僕望んでる未来'/>
          <TestSubstring a='申し込み' b='もうしこみ' c='今週中にお申し込みいたします'/>
          <TestSubstring a='お申込' b='おもうしこみ' c='今週中にお申し込みいたします'/>
          <TestSubstring a='申込' b='もうしこみ' c='今週中にお申し込みいたします'/>
        </Accordian.Body>
      </Accordian.Wrap>
    </Accordian>
  )
}

const TestSubstring = ({a, b, c}) => {
  const { koNFCToHira, isAllHangul, isAllNihongo, isAllHira, matchOkuri, checkKatachi, isOnajiOkuri, matchAllOkuri } = useJaText();

  let arr = matchOkuri(a, b, c);

  let testMatch = matchAllOkuri(a, b, c);

  return(
    <div>
      {c.substring(0, arr[1])}<span className="highlight">{c.substring(arr[1], arr[2])}</span>{c.substring(arr[2])} : <span>{a} : {arr[1]} : {arr[2]}</span>
    </div>
  )
}

const TestCompareComp = () => {

  const testCompareArr = [
    {
      bun : 'あの事に関しては事情があった',
      newBun : 'あのことに関しては事情があった事だ',
      hukumu : [
        { hyouki : '事', yomi : 'こと', startOffset : 2, endOffset : 3 },
        { hyouki : '関して', yomi : 'かんして', startOffset : 4, endOffset : 7 },
        { hyouki : '事情', yomi : 'じじょう', startOffset : 8, endOffset : 10 }
      ]
    },
    {
      bun : '私はあの会社に申し込みを出した',
      newBun : '俺はその会社に申込を出した',
      hukumu : [
        { hyouki : '私', yomi : 'わたし', startOffset : 0, endOffset : 1 },
        { hyouki : '会社', yomi : 'かいしゃ', startOffset : 4, endOffset : 6 },
        { hyouki : '申し込み', yomi : 'もうしこみ', startOffset : 7, endOffset : 11 },
        { hyouki : '出し', yomi : 'だし', startOffset : 12, endOffset : 14 }
      ]
    },
    {
      bun : 'そっちの方にしかたなく渡した',
      newBun : '向こうのほうに仕方なく渡せてもらった',
      hukumu : [
        { hyouki : '方', yomi : 'ほう', startOffset : 4, endOffset : 5 },
        { hyouki : '渡し', yomi : 'わたし', startOffset : 11, endOffset : 13 }
      ]
    },
    {
      bun : 'そっちの方に仕方なく渡した',
      newBun : '向こうのほうに仕方なく渡せてもらった',
      hukumu : [
        { hyouki : '方', yomi : 'ほう', startOffset : 4, endOffset : 5 },
        { hyouki : '仕方', yomi : 'しかた', startOffset : 6, endOffset : 8 },
        { hyouki : '渡し', yomi : 'わたし', startOffset : 10, endOffset : 12 }
      ]
    },
    {
      bun : '申込みした',
      newBun : '申し込した',
      hukumu : [
        { hyouki : '申込み', yomi : 'もうしこみ', startOffset : 0, endOffset : 3 }
      ]
    },
    {
      bun : '申し込した',
      newBun : '申込みした',
      hukumu : [
        { hyouki : '申し込', yomi : 'もうしこみ', startOffset : 0, endOffset : 3 }
      ]
    },
    {
      bun : '申込した',
      newBun : '申し込した',
      hukumu : [
        { hyouki : '申込', yomi : 'もうしこみ', startOffset : 0, endOffset : 2 }
      ]
    },
    {
      bun : '申し込みした',
      newBun : '申込した',
      hukumu : [
        { hyouki : '申し込み', yomi : 'もうしこみ', startOffset : 0, endOffset : 4 }
      ]
    }
  ];

  return(
    <div>
      <Accordian defaultIndex={0}>
        <Accordian.Wrap>
          <Accordian.Header>
            <CompareBun key="1" strA={'あの事に関しては事情があった'} strB={'あのことに関しては事情があった事だ'} showType='all'/>
          </Accordian.Header>
          <Accordian.Body>
            {
              testCompareArr.map( (arr) => <TestCompare bun={arr.bun} newBun={arr.newBun} hukumu={arr.hukumu}/>)
            }
          </Accordian.Body>
        </Accordian.Wrap>
      </Accordian>
    </div>
  )
}

const TestCompare = ({ bun, newBun, hukumu }) => {
  const { traceHukumu } = useJaText();

  const { trace, add, del } = traceHukumu(hukumu, bun, newBun);

  return(
    <div>
      <div>{bun}</div>
      {
        trace != null &&
        trace.map( (arr) => {
          if(arr.find != null ){
            return(
              <div>
                <span>{newBun.substring(0, arr.find.startOffset)}</span>
                <span className="highlight">{newBun.substring(arr.find.startOffset, arr.find.endOffset)}</span>
                <span>{newBun.substring(arr.find.endOffset)}</span>
              </div>)
          }
          else{
            return(
              <div>
                <span>not find : {arr.hyouki}</span>
              </div>)
          }
        })
      }
    </div>
  )
}

const ColorComp = () => {
  const color = <>
    <div className="color-03"></div>
    <div className="color-04"></div>
    <div className="color-05"></div>
    <div className="color-06"></div>
    <div className="color-07"></div>
    <div className="color-08"></div>
    <div className="color-09"></div>
  </>;
  /*
    <div className="sat-01"></div>
    <div className="sat-02"></div>
    <div className="sat-10"></div>
    <div className="sat-11"></div>
    <div className="bri-01"></div>
    <div className="bri-02"></div>
    <div className="bri-10"></div>
    <div className="bri-11"></div>
  */
  const sat = <>
    <div className="sat-03"></div>
    <div className="sat-04"></div>
    <div className="sat-05"></div>
    <div className="sat-06"></div>
    <div className="sat-07"></div>
    <div className="sat-08"></div>
    <div className="sat-09"></div>
  </>;
  const bri = <>
    <div className="bri-03"></div>
    <div className="bri-04"></div>
    <div className="bri-05"></div>
    <div className="bri-06"></div>
    <div className="bri-07"></div>
    <div className="bri-08"></div>
    <div className="bri-09"></div>
  </>;
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
  const filteredArr = [0, 4, 9];

  return(
    <>
      {
        filteredArr.map((arr) =>
          <div className={`colorGrid_${arr}`}>
            sat{sat}
            bri{bri}
            color{color}
          </div>
        )
      }
      <div className={`colorGrid_gray`}>
        <div className="bri-01"></div>
        <div className="bri-02"></div>
        <div className="bri-03"></div>
        <div className="bri-04"></div>
        <div className="bri-05"></div>
        <div className="bri-06"></div>
        <div className="bri-07"></div>
        <div className="bri-08"></div>
        <div className="bri-09"></div>
        <div className="bri-10"></div>
        <div className="bri-11"></div>
      </div>
    </>
  );
}

export { ColorComp, TestComp };
