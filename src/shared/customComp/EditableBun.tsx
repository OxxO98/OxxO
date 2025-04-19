import React, {useEffect, useState, useRef, useContext } from 'react';

import { useAxios } from 'shared/hook';

import { Bun } from 'shared/customComp';

interface EditableBunProps {
  key : string;
  bId : number;
  rowLength : number;
  styled : StyledObj;
  editBId : number | null;
  setEditBId : (bId : number | null) => void;
}

const EditableBun = ({ key, bId, rowLength, styled, editBId, setEditBId } : EditableBunProps ) => {
  const [jaText, setJaText] = useState('');
  const [value, setValue] = useState('');

  const { response, setParams, fetch } = useAxios('/bun', false, { bId : bId });

  const handleChange = (e : React.ChangeEvent<HTMLTextAreaElement> ) => {
    setValue(e.target.value);
  }

  useEffect( () => {
    let res = response;
    if( res !== null){
      setJaText(res.data[0]['JATEXT']);
      setValue(res.data[0]['JATEXT']);
    }
  }, [response])


  return(
    <>
    {
      bId === editBId ?
      <>
        <textarea className="editableBun-textarea" rows={ Math.ceil(jaText.length/rowLength) } value={value} onChange={handleChange}/>
        <div className="button-container_flexEnd">
          {
            jaText !== value &&
            <button className="button-neutral">수정</button>
          }
          <button className="button-positive" onClick={() => setEditBId(null)}>취소</button>
        </div>
      </>
      :
      <span onClick={() => setEditBId(bId)}>
        <Bun bId={bId} styled={styled}/>
      </span>
    }
    </>
  )
}

export { EditableBun };