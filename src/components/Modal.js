import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function useModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  }

  return { show, setShow, handleShow, handleClose };
}

const Modal = ({ children }) => {
  const { show, setShow, handleShow, handleClose } = useModal();

  return(
    <>
      {
        React.Children.map( children, (child) => {
          if( child?.type === Modal.Button ){
            return React.cloneElement( child, {
              show : show,
              handleShow : handleShow
            });
          }
          else{
            return React.cloneElement( child, {
              show : show,
              handleClose : handleClose
            });
          }
        })
      }
    </>
  )
}

const ModalButton = ({ show, handleShow, children, ...props }) => {

  return(
    <>
      {
        show == false &&
        children != null &&
        React.cloneElement( children, {
          onClick : () => {
            props.onClick && props.onClick();
            handleShow();
          }
        })
      }
    </>
  )
}

const ModalCloseButton = ({ show, handleClose, children, ...props }) => {

  return(
    <>
      {
        show &&
        children != null &&
        React.cloneElement( children, {
          onClick : () => {
            props.onClick && props.onClick();
            handleClose();
          }
        })
      }
    </>
  )
}


const ModalWrap = ({ show, handleClose, children }) => {

  return (
    <>
      {
        show &&
        createPortal(
          <div className="modal-wrap">
            <div className="modal-container">
              {
                React.Children.map( children, (child) => {
                  return React.cloneElement( child, {
                    show : show,
                    handleClose : handleClose
                  });
                })
              }
            </div>
          </div>,
          document.getElementById('root')
        )
      }
    </>
  )
}

const ModalHeader = ({ show, handleClose, children, ...props }) => {

  return(
    <div className="modal-header">
      {children}
    </div>
  )
}

const ModalBody = ({ show, handleClose, children, ...props }) => {

  return(
    <div className="modal-body">
      {
        React.Children.map( children, (child) => {
          if(child?.type != null){
            return React.cloneElement( child, {
              handleClose : handleClose
            });
          }
          else{
            return child;
          }
        })
      }
    </div>
  )
}

const ModalFooter = ({ show, handleClose, children, ...props }) => {

  return(
    <div className="modal-footer">
    {
      React.Children.map( children, (child) => {
        if( child?.type === Modal.CloseButton){
          return React.cloneElement( child, {
            show : show,
            handleClose : handleClose
          });
        }
        else{
          return child;
        }
      })
    }
    </div>
  )
}

Modal.Button = ModalButton;
Modal.CloseButton = ModalCloseButton;

Modal.Wrap = ModalWrap;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
