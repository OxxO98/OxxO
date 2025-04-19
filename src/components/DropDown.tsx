import React, {useEffect, useState } from 'react';

interface DropDownProps {
  children : Array<React.ReactElement<DropDownRepresentiveProps|DropDownContentProps>>;
}

interface DropDownRepresentiveProps {
  show : boolean;
  setShow : (show : boolean) => void;
  children : React.ReactElement;
}

interface DropDownContentProps {
  children : {
    props : {
      children : React.ReactElement<any>;
    }
  };
  setShow : (show : boolean) => void;
  className? : string;
}

const DropDown = ({ children } : DropDownProps) => {
  const [show, setShow] = useState(false);

  useEffect( () => {
    if(show === true){
      setShow(false);
    }
  }, []);

  return (
    <div className="dropDown">
      {
        show ?
          <>
            {
              React.Children.map( children, (child) => {
                if( child?.type === DropDown.Representive ){
                  return React.cloneElement( child, {
                    show : show,
                    setShow : setShow
                  });
                }
                else{
                  return React.cloneElement( child, {
                    setShow : setShow
                  });
                }
              })
            }
          </>
          :
          <>
            {
              React.Children.map( children, (child) => {
                if( child?.type === DropDown.Representive ){
                  return React.cloneElement( child, {
                    show : show,
                    setShow : setShow
                  });
                }
              })
            }
          </>
      }
    </div>
  )
}

const DropDownRepresentive = ({ show, setShow, children } : DropDownRepresentiveProps) => {

  return(
    <>
      {
        <>
          {
            show ?
              <div className="dropDownRepresentive" onClick={() => setShow(false)}>
                {children}
              </div>
            :
              <div className="dropDownRepresentive" onClick={() => setShow(true)}>
                {children}
              </div>
          }
        </>
      }
    </>

  )
}

const DropDownContent = ({ setShow, children, ...props } : DropDownContentProps ) => {

  return(
    <>
      <div className={`dropDownContent ${props?.className}`}>
        {
          React.Children.map( children.props.children, (child) => {
            if( child?.type === 'div' ){
              return React.cloneElement( child, {
                onClick : () => {
                  child.props.onClick && child.props.onClick();
                  setShow(false);
                },
                className: 'content'
              })
            }
          })
        }
      </div>
    </>
  )
}

DropDown.Representive = DropDownRepresentive;
DropDown.Content = DropDownContent;

export default DropDown;
