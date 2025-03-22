import React, { Children, useEffect, useState } from 'react';

function useAccordian( defaultIndex, children ) {
  const [show, setShow] = useState( defaultIndex != null ? defaultIndex : -1);

  const handleShow = (value) => {
    setShow(value);
  }

  const handleClose = () => {
    setShow(-1);
  }

  useEffect( () => {
    if(children != null && children?.length != 0){
      for( let key in children ){
        if(children[key]?.type != null){
          setShow(key);
          break;
        }
      }
    }
  }, [children])

  return { show, setShow, handleShow, handleClose };
}

const Accordian = ({ defaultIndex, children }) => {
  //console.log(children);
  const { show, setShow, handleShow, handleClose } = useAccordian(defaultIndex, children);

  //console.log(children);

  return(
    <div className="accordian">
      {
        React.Children.map( children, (child, index) => {
          if( child?.type != null){
            return React.cloneElement( child, { show : show, handleShow : handleShow, handleClose : handleClose, index : index});
          }
        })
      }
    </div>
  )
}

const AccordianWrap = ({ show, handleShow, handleClose, children, index }) => {
  let headerWithProps = React.cloneElement( children[0], { show : show, handleShow : handleShow, handleClose : handleClose, index : index});

  return(
    <div className="accordian-wrap">
      {headerWithProps}
      {
        show == index && children[1]
      }
    </div>
  )
}

const AccordianHeader = ({ show, handleShow, handleClose, index, children }) => {
  return(
    <div className="accordian-header">
      {children}
      {
        show == index ?
        <button className="accordian-button" onClick={handleClose}>X</button>
        :
        <button className="accordian-button" onClick={() => handleShow(index)}>열기</button>
      }
    </div>
  )
}

const AccordianBody = ({ children }) => {
  return(
    <div className="accordian-body">
      {children}
    </div>
  )
}

Accordian.Wrap = AccordianWrap;
Accordian.Header = AccordianHeader;
Accordian.Body = AccordianBody;

//export {};

export default Accordian;
