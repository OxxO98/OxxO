import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children : Array<React.ReactElement<ModalButtonProps|ModalWrapProps>>;
}

interface ModalButtonProps {
  show : boolean;
  handleShow : () => void;
  children : React.ReactElement<any>;
  onClick? : () => void;
}

interface ModalCloseButtonProps {
  show : boolean;
  handleClose : () => void;
  children : React.ReactElement<any>;
  onClick? : () => void;
}

interface ModalWrapProps {
  show : boolean;
  handleClose : () => void;
  children : Array<React.ReactElement<ModalHeaderProps|ModalBodyProps|ModalFooterProps>>;
}

interface ModalHeaderProps {
  children : React.ReactElement;
}

interface ModalBodyProps {
  show : boolean;
  handleClose : () => void;
  children : Array<React.ReactElement<any>>;
}

interface ModalFooterProps {
  show : boolean;
  handleClose : () => void;
  children : Array<React.ReactElement<any>>;
}

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

const Modal = ({ children } : ModalProps ) => {
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

const ModalButton = ({ show, handleShow, children, ...props } : ModalButtonProps ) => {

  return(
    <>
      {
        show === false &&
        children !== null &&
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

const ModalCloseButton = ({ show, handleClose, children, ...props } : ModalCloseButtonProps ) => {

  return(
    <>
      {
        show &&
        children !== null &&
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


const ModalWrap = ({ show, handleClose, children } : ModalWrapProps) => {

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
          document.getElementById('root') as HTMLElement
        )
      }
    </>
  )
}

const ModalHeader = ({ children } : ModalHeaderProps ) => {

  return(
    <div className="modal-header">
      {children}
    </div>
  )
}

const ModalBody = ({ show, handleClose, children } : ModalBodyProps ) => {

  return(
    <div className="modal-body">
      {
        React.Children.map( children, (child) => {
          if(child?.type !== null){
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

const ModalFooter = ({ show, handleClose, children } : ModalFooterProps ) => {

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
