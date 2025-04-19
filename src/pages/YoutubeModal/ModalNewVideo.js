import React, { useEffect, useState, useContext } from 'react';

import ReactPlayer from 'react-player/lazy';

import { UserContext, YoutubeContext } from 'client/UserContext.js';

import { Modal, StepPage } from 'components';

import { useAxios, useAxiosPost } from 'shared/hook';

const ModalNewVideo = ({ fetch }) => {

  return (
    <>
      <Modal>
        <Modal.Button>
          <button>Video 추가</button>
        </Modal.Button>

        <Modal.Wrap>
          <Modal.Header>
            <div>영상을 추가하시겠습니까?</div>
          </Modal.Header>
          <Modal.Body>
            <ModalVideoContainer/>
          </Modal.Body>
          <Modal.Footer>
            <Modal.CloseButton>
              <button>닫기</button>
            </Modal.CloseButton>
          </Modal.Footer>
        </Modal.Wrap>
      </Modal>
    </>
  )
}

const ModalVideoContainer = ({ handleClose, fetch }) => {

  const { userId } = useContext(UserContext);

  const [isDuplicated, setIsDuplicated] = useState(true);

  const { response : resInsertVideo, setParams : setParamsInsertVideo } = useAxiosPost('/youtube/video', true, null );
  const { response : resExistVideo, setParams : setParamsExistVideo } = useAxios('/youtube/video/check', true, null );

  const [input, setInput] = useState({
    videoId : null,
    title : null
  })

  const submitVideo = () => {
    setParamsInsertVideo({ userId : userId, videoId : input.videoId, title : input.title });
  }

  useEffect( () => {
    let res = resInsertVideo;

    if(res != null){
      fetch();
      handleClose();
    }
  }, [resInsertVideo]);

  const checkDuplicatedVideo = () => {
    setParamsExistVideo({ userId : userId, videoId : input.videoId });
  }

  useEffect( () => {
    let res = resExistVideo;

    if(res != null){
      if(res.data.length == 0){
        setIsDuplicated(false);
      }
      else{
        setIsDuplicated(true);
      }
    }
  }, [resExistVideo])

  const handleChange = (e) => {
    const {value, name} = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }

  return(
    <>
      <StepPage>
        <StepPage.Comp>
          <form>
            <label>videoId</label>
            <input type="text" name="videoId" id="videoId" onChange={handleChange}/>
          </form>
          <StepPage.Next>
            <button>check</button>
          </StepPage.Next>
        </StepPage.Comp>
        <StepPage.Comp>
          <form>
            <label>videoId : {input.videoId}</label>
            <input type="text" name="title" id="title" onChange={handleChange}/>
          </form>
          <div>
            <ReactPlayer
              url={'https://www.youtube.com/watch?v='+input.videoId}
            />
            {input.videoId}
          </div>
          <StepPage.Prev>
            <button>이전</button>
          </StepPage.Prev>
          {
            input.title != '' && input.title != null &&
            <StepPage.Next onClick={checkDuplicatedVideo}>
              <button>중복 체크</button>
            </StepPage.Next>
          }
        </StepPage.Comp>
        <StepPage.Comp>
          <div>{input.videoId}</div>
          <div>{input.title}</div>
          <button onClick={submitVideo}>Submit</button>
        </StepPage.Comp>
      </StepPage>
    </>
  );
}

export { ModalNewVideo };
