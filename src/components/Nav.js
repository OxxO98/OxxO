import React, { useState, useEffect, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client/MainContext.js'

const Nav = ({route, changeRoute}) => {
  const [selected, setSelected] = useState({
    parent : "Book",
    children : "Hon"
  })

  const isMobile = useMediaQuery({
    query : useContext(MediaQueryContext).mobile
  });

  const defaultChildren = {
    Book : "Hon",
    Youtube : "Marking",
    Comic : null
  };

  const parentNavItems = [
    {
      eventKey : "Book",
      name : "책",
      disabled : false
    },
    {
      eventKey : "Youtube",
      name : "유튜브",
      disabled : isMobile ? true : false
    },
    {
      eventKey : "Comic",
      name : "만화",
      disabled : isMobile ? true : false
    }
  ]

  const bookNavItems = [
    {
      eventKey : "Hon",
      name : "책",
      disabled : false
    },
    {
      eventKey : "Tangochou",
      name : "단어장",
      disabled : false
    },
    {
      eventKey : "Honyaku",
      name : "번역",
      disabled : false
    }
  ]

  const youtubeNavItems = [
    {
      eventKey : "Marking",
      name : "마킹",
      disabled : false
    },
    {
      eventKey : "Timeline",
      name : "타임라인",
      disabled : false
    },
    {
      eventKey : "YTHonyaku",
      name : "번역",
      disabled : false
    }
  ]

  const selectItem = (eventKey) => {
    if(route.idRoute == null){
      setSelected({
        ...selected,
        parent : eventKey,
        children : defaultChildren[eventKey]
      });
    }
    else{
      setSelected({
        ...selected,
        children : eventKey
      });
    }
  }

  return(
    <div className="WrapNav">
      <div className="Nav">
      {
        route.idRoute == null ?
        <>
          <div className="logo">
            OxxO
          </div>
          <div className="itemContainer">
            {
              parentNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.parentRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
          </div>
        </>
        :
        <>
          <div className={`logo ${isMobile == false ? "expand" : "" }`} onClick={() => {changeRoute("parent")}}>
            OxxO
          </div>
          <div className="itemContainer">
            {
              isMobile == false &&
              <div className="item disabled"/>
            }
            {
              route.parentRoute == "Book" &&
              bookNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.idRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
            {
              route.parentRoute == "Youtube" &&
              youtubeNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.idRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
          </div>
        </>
      }
      </div>
    </div>
  )
}

const NavItem = ({ children, eventKey, active, disabled, onSelect, onActive}) => {
  const isActive = active === eventKey ? 'active' : '';

  return(
    <>
      {
        disabled == false ?
        <>
          <div
            className={`item ${isActive}`}
            onClick={()=>{onSelect(eventKey); onActive(eventKey)}}
          >
            <div eventKey={eventKey}>
               {children}
            </div>
          </div>
        </>
        :
        <>
          <div
            className={`item`}
          >
            <div eventKey={eventKey}>
               {children}
            </div>
          </div>
        </>
      }

    </>
  )
}

Nav.Item = NavItem;

export default Nav;
