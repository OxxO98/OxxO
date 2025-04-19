import React, { useState, useEffect, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';

import { MediaQueryContext } from 'client'

type NavItem = {
  eventKey : string;
  name : string;
  disabled : boolean;
}

interface NavProps {
  route : {
    parentRoute : string | null;
    idRoute : string | null;
    id : string | null;
  }
  changeRoute : (key : string | null) => void;
  userName : string;
}

interface NavItemProps {
  children : string;
  eventKey : string;
  active : string | null;
  disabled : boolean;
  onSelect : (eventKey : string) => void;
  onActive : (eventKey : string) => void;
}

const Nav = ({ route, changeRoute, userName } : NavProps) => {
  const [selected, setSelected] = useState({
    parent : "Book",
    children : "Hon"
  })

  const isMobile = useMediaQuery({
    query : useContext<MediaQueryContextInterface>(MediaQueryContext).mobile
  });

  const defaultChildren : ObjKey = {
    Book : "Hon",
    Youtube : "Marking",
    Comic : ""
  };

  const parentNavItems : Array<NavItem> = [
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

  const bookNavItems : Array<NavItem> = [
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

  const youtubeNavItems : Array<NavItem> = [
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

  const selectItem = (eventKey : string ) => {
    if(route.idRoute === null){
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
        route.idRoute === null ?
        <>
          <div className="logo">
            {userName}
          </div>
          <div className="itemContainer">
            {
              parentNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.parentRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
          </div>
        </>
        :
        <>
          <div className={`logo ${isMobile === false ? "expand" : "" }`} onClick={() => {changeRoute("parent")}}>
            {userName}
          </div>
          <div className="itemContainer">
            {
              isMobile === false &&
              <div className="item disabled"/>
            }
            {
              route.parentRoute === "Book" &&
              bookNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.idRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
            {
              route.parentRoute === "Youtube" &&
              youtubeNavItems.map( (item) => <NavItem eventKey={item.eventKey} active={route.idRoute} disabled={item.disabled} onActive={selectItem} onSelect={changeRoute}>{item.name}</NavItem> )
            }
          </div>
        </>
      }
      </div>
    </div>
  )
}

const NavItem = ({ children, eventKey, active, disabled, onSelect, onActive} : NavItemProps) => {
  const isActive = active === eventKey ? 'active' : '';

  return(
    <>
      {
        disabled === false ?
        <>
          <div
            className={`item ${isActive}`}
            onClick={()=>{onSelect(eventKey); onActive(eventKey)}}
          >
            <div>
               {children}
            </div>
          </div>
        </>
        :
        <>
          <div
            className={`item`}
          >
            <div>
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
