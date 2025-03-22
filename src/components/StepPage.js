import React, { Children, useEffect, useState } from 'react';

function usePage( pageLength ) {
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

const StepPage = ({ children }) => {
  const { page, setPage, nextPage, prevPage } = usePage( children.length );
  //console.log(children);

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

const StepPageComp = ({page, index, children, ...props }) => {
  //console.log('StepPageComp', children);

  return(
    <>
    {
      page == index &&
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

const StepPageNext = ({ children, ...props }) => {
  //console.log(props);
  let buttonWithProps = React.cloneElement( children, {
    onClick : () => {
      props.onClick && props.onClick();
      props.nextPage();
    }
  });

  //console.log(buttonWithProps.props.onClick);
  //console.log(props.onClick);

  return(
    <>
    {
      buttonWithProps
    }
    </>
  )
}

const StepPagePrev = ({ children, ...props }) => {
  let buttonWithProps = React.cloneElement( children, {
    onClick : () => {
      props.onClick && props.onClick();
      props.prevPage();
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
