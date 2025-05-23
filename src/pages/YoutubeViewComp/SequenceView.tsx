import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import { UserContext, YoutubeContext } from 'client';

import { useAxios, useAxiosPost } from 'shared/hook';
import { useHuri } from 'shared/hook';
import { useTimeStamp } from 'shared/hook';

import { Modal, DropDown, StepPage } from 'components';

import { YoutubeGrantWrapper, ImportHonModal } from 'shared/customComp';

interface RES_REVISE_YOUTUBE_CC {
  koText : string;
  timeCode : string;
  jaText : string;
  koQuote : string;
}

interface TimelineObj {
  'bId' : number;
  'startTime' : number;
  'endTime' : number;
  'hurigana' : string;
  'jaText' : string;
  'koText' : string;
}

interface sequenceListObj {
  YTSID : number;
}

interface SequenceCompProps {
  ytsId : number | null;
  setYTSId : (ytsId : number | null) => void;
  setImportData : (importData : ObjKey) => void;
}

interface InsertSequenceModalProps {
  newSequence : () => void;
}

interface YoutubeCCModalProps {
  ytsId : number | null;
}

const SequenceComp = ({ ytsId, setYTSId, setImportData } : SequenceCompProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sequenceList, setSequenceList] = useState<Array<sequenceListObj> | null>(null);

  const { response : resGetSeq, fetch : fetchGetSeq } = useAxios('/youtube/sequence', false, { ytId : ytId });

  const { response : resInsertSeq, setParams : setParamsInsertSeq } = useAxiosPost('/youtube/sequence', true, null);

  const newSequence = () => {
    setParamsInsertSeq({ userId : userId, ytId : ytId });
  }

  useEffect( () => {
    if(resInsertSeq !== null){
      fetchGetSeq();
    }
  }, [resInsertSeq])

  useEffect( () => {
    let res = resGetSeq;
    if(res !== null){
      if(res.data.length === 0){
        setYTSId(null);
      }
      else{
        if(ytsId === null){
          setYTSId(res.data[0]['YTSID']);
        }
      }
      setSequenceList(res.data);
    }
  }, [resGetSeq]);

  return (
    <div className="sequence-container">
      {
        ytsId === null ?
        <div>시퀀스 없음</div>
        :
        <>
          <span>선택된 시퀀스 : </span>
          <DropDown>
            <DropDown.Representive>
              {ytsId}
            </DropDown.Representive>
            <DropDown.Content>
            {
              sequenceList !== null && sequenceList.length !== 0 &&
              <>
                {
                  sequenceList.filter( (arr) => arr['YTSID'] !== ytsId ).map( (arr) => (
                    <div className="content" onClick={() => { setYTSId(arr['YTSID']) }}>
                      {arr['YTSID']}
                    </div>
                  ))
                }
              </>
            }
            </DropDown.Content>
          </DropDown>
        </>
      }
      <div className="button-container_flexEnd">
        <YoutubeGrantWrapper restrict="ADMIN">
          <ImportHonModal setImportData={setImportData}/>
          <InsertSequenceModal newSequence={newSequence}/>
        </YoutubeGrantWrapper>
        <YoutubeCCModal ytsId={ytsId}/>
      </div>
    </div>
  )
}

const InsertSequenceModal = ({ newSequence } : InsertSequenceModalProps ) => {

  return(
    <Modal>
      <Modal.Button>
        <button className="button-positive">시퀀스 추가</button>
      </Modal.Button>
      <Modal.Wrap>
        <Modal.Header>
          <div>정말 시퀀스를 추가하시겠습니까? </div>
        </Modal.Header>
        <Modal.Body>
          <div>이 행동은 되돌릴 수 없습니다.</div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CloseButton>
            <button className="button-neutral">취소</button>
          </Modal.CloseButton>
          <Modal.CloseButton onClick={newSequence}>
            <button className="button-positive">확인</button>
          </Modal.CloseButton>
        </Modal.Footer>
      </Modal.Wrap>
    </Modal>
  )
}

const YoutubeCCModal = ({ ytsId } : YoutubeCCModalProps ) => {

  const { userId } = useContext<UserContextInterface>(UserContext);

  const ytId = useContext(YoutubeContext);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState({
    str: "",
    ret : ""
  });

  const [reviseObj, setReviseObj] = useState<ObjStringKey<RES_REVISE_YOUTUBE_CC> | null>(null);
  const [isRevise, setIsRevise] = useState(false);
  //const [update, setUpdate] = useState(false);
  const [timelineData, setTimelineData] = useState<Array<TimelineObj>>();

  //const { show, handleShow, handleClose } = useModal();

  const { tsToTime } = useTimeStamp();

  const { yomiToHuri, hysToHuri } = useHuri();

  const { response : resGetTimeLine, setParams, fetch } = useAxios('/youtube/timeline/allProps', true, null );
  const { response : resGetTimeLineNonProp, setParams : setParamsNonProp } = useAxios('/youtube/timeline', true, { ytId : ytId, ytsId : ytsId } );

  const { response : resHukumu, setParams: setParamsHukumu, loading : resHukumuLoad, fetch : fetchHukumu} = useAxios('/hukumu', true, null );

  const { response : resReviseText, setParams : setParamsReviseText } = useAxiosPost('/youtube/reviseYoutubeCC', true, null);

  const reviseText = () => {
    setParamsReviseText({ text : input.str });
  }

  const getOnlyJaText = () => {
    let str = "";
    for(let index in reviseObj){
      str += frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[0], 24);
      str += " - "
      str += frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[1], 24);
      str += '\n'
      if(reviseObj[index]?.jaText){
        str += reviseObj[index]['jaText'];
        str += '\n'
      }
      /*
      //영어 텍스트가 한글에만 있을 경우
      //근데 특수로 한글 발음 적어놓은게 있어서 그거는 감수 바람
      else{
        str += reviseObj[index]['koText'];
        str += '\n'
      }
      */
      str += '\n'
    }
    //console.log(str);
    setInput({
      ...input,
      ret : str
    })

  }

  const getOnlyKoText = () => {
    let str = "";
    //console.log(reviseObj);
    for(let index in reviseObj){
      //console.log(reviseObj[index]['timeCode']);
      str += frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[0], 24);
      str += " - "
      str += frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[1], 24);
      //str += reviseObj[index]['timeCode'];
      str += '\n'
      if(reviseObj[index]?.koQuote){
        str += reviseObj[index]['koQuote'];
        str += '\n'
      }
      if(reviseObj[index]?.koText){
        str += reviseObj[index]['koText'];
        str += '\n'
      }
      str += '\n'
    }
    //console.log(str);
    setInput({
      ...input,
      ret : str
    })
  }

  const divideStartEnd = (timeStr : string) => {
    let start = timeStr.substring(0, 11);
    let end = timeStr.substring(14, 26);

    //console.log(end);

    return [start, end];
  }

  const frameToSecond = (timeStr : string, frame : number) => {
    let frameTime = Number(timeStr.substring(10));
    let timeCodeSecond = timeStr.substring(0, 8).concat(".");

    //00:00:00: 00

    const secondStr = String(Math.floor(1000/frame*frameTime)).padEnd(3, "0");

    return timeCodeSecond.concat(secondStr);
  }

  //유튜브 자막파일을 타임라인으로 임포트
  /*
  const importCCtoDB = () => {
    let queryArr = new Array();

    for(let index in reviseObj){
      queryArr.push({
        start : frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[0], 24),
        end :  frameToSecond( divideStartEnd(reviseObj[index]['timeCode'])[1], 24),
        jaText : reviseObj[index]['jaText']
      })
    }

    axios.post(
      'http://localhost:5000/youtube/bun/multi', { userId : userId, ytId : ytId, array : queryArr, ytsId : ytsId }
    ).then(
      res => {
        // console.log(res.data);
      }
    )
  }
    */

  const exportDBtoJson = () => {
    let jsString = JSON.stringify(timelineData);
    setInput({
      ...input,
      ret : jsString
    })
    // console.log(timelineData);
    //setIsRevise(true);
  }

  const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  const handleCCModal = () => {
    if(ytsId !== null && ytId !== null){
      setParams( { ytId : ytId, ytsId : ytsId } );
    }
  }

  useEffect( () => {
    if(timelineData !== null && timelineData !== undefined){
      // console.log(timelineData);
      let jsString = JSON.stringify(timelineData);
      setInput({
        ...input,
        ret : jsString
      })
      for(let key in timelineData){
        if(timelineData[key].hurigana !== ""){
          setParamsHukumu({ bId : timelineData[key].bId, userId : userId });
        }
      }
    }
  }, [timelineData]);

  useEffect( () => {
    let res = resHukumu;

    if(res !== null){
      for(let key in res.data){
        let huri = yomiToHuri( res.data[key]['DATA'], res.data[key]['RUBY'] );

        // console.log(huri);
      }
    }
  }, [resHukumu])

  useEffect( () => {
    let res = resGetTimeLine;

    if(res !== null && res.data.length > 0){
      // console.log(res.data);
      let a = new Array();

      for(let key in res.data){
        let hurigana;
        if(res.data[key]['HURIGANA'] !== null){
          hurigana = hysToHuri(
            res.data[key]['JATEXT'],
            res.data[key]['HYS'],
            res.data[key]['HURIGANA']
          )
        }
        else{
          hurigana = "";
        }
        let koText = res.data[key]['KOTEXT'] === null ? "" : res.data[key]['KOTEXT'];

        a.push({
          'bId' : res.data[key]['BID'],
          'startTime' : tsToTime(res.data[key]['STARTTIME']),
          'endTime' : tsToTime(res.data[key]['ENDTIME']),
          'hurigana' : hurigana,
          'jaText' : res.data[key]['JATEXT'],
          'koText' : koText
        });
      }
      setTimelineData(a);
    }
    else{
      if(res !== null){
        // console.log('res length', res.data.length);
      }
      //setTimelineData(null);
      if( ytId !== null && ytsId !== null){
        setParamsNonProp({ ytId : ytId, ytsId : ytsId });
        // console.log('setParamsNonProp');
      }
    }
  }, [resGetTimeLine])

  useEffect( () => {
    let res = resGetTimeLineNonProp;
    if( res !== null ){
      // console.log(res.data);
      let a = new Array();
      for(let key in res.data){
        a.push({
          'bId' : res.data[key]['BID'],
          'startTime' : tsToTime(res.data[key]['STARTTIME']),
          'endTime' : tsToTime(res.data[key]['ENDTIME']),
          'hurigana' : "",
          'jaText' : res.data[key]['JATEXT'],
          'koText' : ""
        });
      }
      setTimelineData(a);
      // setInput(a); // str, ret기능 확인 바람.
      // console.log('resGetTimeLineNonProp');
    }
  }, [resGetTimeLineNonProp])

  useEffect( () => {
    let res = resReviseText;
    if(res !== null){
      let a : ObjStringKey<any> = [];
      let prev = "";
      let mergeStartTime = "";
      let mergeEndTime = "";

      let prevObj = null;

      for(let key in res.data){
        if(res.data[key]['koText'] === prev){
          mergeEndTime = res.data[key]['timeCode'].substring(14, 26);
        }
        else{
          if(prevObj !== null){
            a.push({
              ...prevObj,
              timeCode : mergeStartTime+" - "+mergeEndTime
            });
          }
          //다음
          prev = res.data[key]['koText'];
          mergeStartTime = res.data[key]['timeCode'].substring(0, 11);
          mergeEndTime = res.data[key]['timeCode'].substring(14, 26);
        }
        prevObj = res.data[key];
      }
      a.push({
        ...prevObj,
        timeCode : mergeStartTime+" - "+mergeEndTime
      });
      // console.log(res.data);
      setReviseObj(a);
      setIsRevise(true);
    }
  }, [resReviseText])

  return(
    <>
      <Modal>
        <Modal.Button onClick={handleCCModal}>
          <button className="button-neutral">export to Json</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>export to Json</div>
          </Modal.Header>
          <Modal.Body>
            {
              isRevise ?
              <>
                {/*<button onClick={getOnlyKoText}>한글만</button>
                <button onClick={getOnlyJaText}>일본어만</button>*/}
                <textarea className="TextareaYoutube" name="str" id="str" value={input.ret} onChange={handleChange}/>
              </>
              :
              <>
                <textarea className="TextareaYoutube" name="str" id="str" value={input.ret} onChange={handleChange}/>
              </>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              isRevise ?
              <>
                {/*<button onClick={importCCtoDB}>임포트</button>*/}
                <button>다운로드</button>
              </>
              :
              <>
                <button onClick={reviseText}>확인</button>
                <button className="button-neutral" onClick={exportDBtoJson}>export to Json</button>
              </>
            }
            <Modal.CloseButton>
              <button className="button-neutral" onClick={() => setIsRevise(false)}>취소</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}



export { SequenceComp };
