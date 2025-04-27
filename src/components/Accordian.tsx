import React, { Children, useEffect, useState } from 'react';

interface AccordianProps {
  defaultIndex : number;
  children : Array<React.ReactElement<AccordianWrapProps>>;
}

interface AccordianWrapProps {
  show : number;
  handleShow : (value : number) => void;
  handleClose : () => void;
  children : Array<React.ReactElement<AccordianHeaderProps|AccordianBodyProps>>;
  index : number;
}

interface AccordianHeaderProps{
  show : number;
  handleShow : (value : number) => void;
  handleClose : () => void;
  children : React.ReactElement;
  index : number;
}

interface AccordianBodyProps {
  children : Array<React.ReactElement>;
}

function useAccordian( defaultIndex : number, children : Array<React.ReactElement> ) {
  const [show, setShow] = useState( defaultIndex !== null ? defaultIndex : -1);

  const handleShow = (value : number) => {
    setShow(value);
  }

  const handleClose = () => {
    setShow(-1);
  }

  useEffect( () => {
    if(children !== null && children?.length !== 0){
      for( let key in children ){
        if(children[key]?.type !== null){
          setShow( parseInt(key) );
          break;
        }
      }
    }
  }, [children])

  return { show, setShow, handleShow, handleClose };
}

const Accordian = ({ defaultIndex, children } : AccordianProps ) => {
  const { show, setShow, handleShow, handleClose } = useAccordian(defaultIndex, children);

  return(
    <div className="accordian">
      {
        React.Children.map( children, (child, index) => {
          if( child !== null && child?.type !== null){
            return React.cloneElement( child, { show : show, handleShow : handleShow, handleClose : handleClose, index : index});
          }
        })
      }
    </div>
  )
}

const AccordianWrap = ({ show, handleShow, handleClose, children, index } : AccordianWrapProps ) => {
  let headerWithProps = React.cloneElement( children[0], { show : show, handleShow : handleShow, handleClose : handleClose, index : index});

  return(
    <div className="accordian-wrap">
      {headerWithProps}
      {
        show === index && children[1]
      }
    </div>
  )
}

const AccordianHeader = ({ show, handleShow, handleClose, index, children } : AccordianHeaderProps ) => {
  return(
    <div className="accordian-header" onClick={ () => show === index ? handleClose() : handleShow(index) }>
      {children}
      {
        show === index ?
        <button className="accordian-button" onClick={handleClose}>X</button>
        :
        <button className="accordian-button" onClick={() => handleShow(index)}>열기</button>
      }
    </div>
  )
}

const AccordianBody = ({ children } : AccordianBodyProps ) => {
  return(
    <div className="accordian-body">
      {children}
    </div>
  )
}

Accordian.Wrap = AccordianWrap;
Accordian.Header = AccordianHeader;
Accordian.Body = AccordianBody;

export default Accordian;
