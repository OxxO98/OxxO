import React, {useEffect, useState } from 'react';

//일단 보류
const DropDown = ({ children, ...props }) => {
  const [show, setShow] = useState(false);

  useEffect( () => {
    if(show == true){
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

const DropDownRepresentive = ({ show, setShow, children }) => {

  return(
    <>
      {
        children != false &&
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

const DropDownContent = ({ children, ...props }) => {

  return(
    <>
      {
        children != false &&
        <div className={`dropDownContent ${props?.className}`}>
          {
            React.Children.map( children.props.children, (child) => {
              return React.cloneElement( child, {
                onClick : () => {
                  child.props.onClick && child.props.onClick();
                  props.setShow(false);
                },
                className: 'content'
              })
            })
          }
        </div>
      }
    </>
  )
}

DropDown.Representive = DropDownRepresentive;
DropDown.Content = DropDownContent;

export default DropDown;
