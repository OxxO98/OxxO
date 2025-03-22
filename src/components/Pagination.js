import React, {useEffect, useState, useContext } from 'react';

const Pagination = ( { page, pageCount, nextPage, previousPage, clickPage } ) => {
  let items = [];

  items.push(
    <button className="button_pagination-prev" key={'prev'} onClick={previousPage}>이전</button>
  )
  if(pageCount > 7){
    let pageArray = new Array();
    if(page+1 < 5){
      pageArray.push(1);
      pageArray.push(2);
      pageArray.push(3);
      pageArray.push(4);
      pageArray.push(5);
      //pageArray.push(6);
      pageArray.push('r2');
      //pageArray.push(pageCount-1);
      pageArray.push(pageCount);
    }
    else if ( page+1 > pageCount-4){
      pageArray.push(1);
      //pageArray.push(2);
      pageArray.push('r1');
      //pageArray.push(pageCount-5);
      pageArray.push(pageCount-4);
      pageArray.push(pageCount-3);
      pageArray.push(pageCount-2);
      pageArray.push(pageCount-1);
      pageArray.push(pageCount);
    }
    else {
      pageArray.push(1);
      //pageArray.push(2);
      pageArray.push('r1');
      pageArray.push(page);
      pageArray.push(page+1);
      pageArray.push(page+2);
      pageArray.push('r2');
      //pageArray.push(pageCount-1);
      pageArray.push(pageCount);
    }

    for (let number in pageArray) {
      if(pageArray[number][0] == 'r'){
        items.push(
          <button className={`button_pagination-reduce`} key={pageArray[number]}>
            ...
          </button>,
        )
      }
      else{
        items.push(
          <button className={`button_pagination-item ${pageArray[number] === page+1 ? "active" : "" }`} key={'pagination'+pageArray[number]} onClick={()=>clickPage(pageArray[number]-1)}>
            {pageArray[number]}
          </button>,
        );
      }
    }
  }
  else{
    for (let number = 1; number <= pageCount; number++) {
      items.push(
        <button className={`button_pagination-item ${number === page+1 ? "active" : "" }`} key={'pagination'+number} onClick={()=>clickPage(number-1)}>
          {number}
        </button>,
      );
    }
  }
  items.push(
    <button className="button_pagination-next" key={'next'} onClick={nextPage}>다음</button>
  )

  return(
    <div className="pagination">
      {items}
    </div>
  )
}

export default Pagination;
