import React, { useState, useEffect } from 'react';

import { ServerContext } from 'client/MainContext';

import { useAxios } from 'shared/hook';

import { MainComp } from 'pages';

import { Accordian } from 'components';

const App = () => {
  //서버 켜져있는지 체크용도.
  const [ serverChecked, setServerChecked] = useState(false);
  const { response, loading, error } = useAxios('/api/test', false, null);

  useEffect( () => {
    let res = response;
    if(res != null){
      setServerChecked(true);
    }
  }, [response])

  return(
    <>
      {
        loading == true ?
        <>loading...</>
        :
        serverChecked == false ?
        <DeadServerComp/>
        :
        <MainComp/>
      }
    </>
  )
}

const DeadServerComp = () => {

  return(
    <Accordian defaultIndex={0}>
      <Accordian.Wrap>
        <Accordian.Header>
          서버가 켜져 있지 않습니다.
        </Accordian.Header>
        <Accordian.Body>
          관리자에게 요청 바랍니다.
        </Accordian.Body>
      </Accordian.Wrap>
    </Accordian>
  )
}

/*
class App extends React.Component{
  constructor(props){
    const location = window.location;
    super(props);
    if(location.pathname == "/"){
      this.state = {
        page : "/Home"
      };
    }
    else{
      this.state = {
        page : location.pathname
      };
    }
  }

  handlePageChange = (e) =>{
    this.setState({
      page : e.target.getAttribute("michi")
    });
    console.log("target:" + e.target.getAttribute("michi"));
    console.log("page:"+this.state.page);
  }

  render(){
    //console.log("App:"+this.state.page);
    return (
      <Container fluid className="px-0 ms-0 me-0">

        <Container fluid="xl" className="px-0 ms-0 me-0">
          <Route exact path="/">
            <Home onChange={this.handlePageChange}/>
          </Route>
        </Container>
      </Container>
    );
  }
}
/*
<Navbar page={this.state.page} onChange={this.handlePageChange}/>
<Route path="/Home">
  <Home onChange={this.handlePageChange}/>
</Route>
*/


export default App;
