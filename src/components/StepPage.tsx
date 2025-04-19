import React, { Children, useEffect, useState } from 'react';

interface StepPageProps {
  children : Array<React.ReactElement<StepPageCompProps>>;
}

interface StepPageCompProps {
  page : number;
  index : number;
  children : Array<React.ReactElement<StepPageNextProps|StepPagePrevProps>>;
  nextPage? : () => void;
  prevPage? : () => void;
}

interface StepPageNextProps {
  children : React.ReactElement<any>;
  onClick? : () => void;
  nextPage? : () => void;
}

interface StepPagePrevProps {
  children : React.ReactElement<any>;
  onClick? : () => void;
  prevPage? : () => void;
}

function usePage( pageLength : number ) {
  const [page, setPage] = useState(0);

  const nextPage = () => {
    if( page < pageLength ){
      setPage( page+1 );
    }
  }

  const prevPage = () => {
    if( page > 0 ){
      setPage( page-1 );
    }
  }

  return { page, setPage, nextPage, prevPage };
}

const StepPage = ({ children } : StepPageProps ) => {
  const { page, setPage, nextPage, prevPage } = usePage( children.length );

  return(
    <>
    {
      React.Children.map( children, (child, index) => {
        return React.cloneElement( child, {
          page : page, index : index, nextPage : nextPage, prevPage : prevPage
        });
      })
    }
    </>
  )
}

const StepPageComp = ({page, index, children, ...props } : StepPageCompProps ) => {

  return(
    <>
    {
      page === index &&
      <>
      {
        React.Children.map( children, (child) => {
          if( child?.type === StepPage.Next ){
            return React.cloneElement( child, {
              nextPage : props.nextPage
            });
          }
          else if( child?.type === StepPage.Prev ){
            return React.cloneElement( child, {
              prevPage : props.prevPage
            });
          }
          else{
            return child;
          }
        })
      }
      </>
    }
    </>
  )
}

const StepPageNext = ({ children, ...props } : StepPageNextProps ) => {
  
  let buttonWithProps = React.cloneElement( children, {
    onClick : () => {
      props.onClick && props.onClick();
      props.nextPage && props.nextPage();
    }
  });

  return(
    <>
    {
      buttonWithProps
    }
    </>
  )
}

const StepPagePrev = ({ children, ...props } : StepPagePrevProps ) => {
  let buttonWithProps = React.cloneElement( children, {
    onClick : () => {
      props.onClick && props.onClick();
      props.prevPage && props.prevPage();
    }
  });

  return(
    <>
    {
      buttonWithProps
    }
    </>
  )
}

StepPage.Comp = StepPageComp;
StepPage.Next = StepPageNext;
StepPage.Prev = StepPagePrev;

export default StepPage;
