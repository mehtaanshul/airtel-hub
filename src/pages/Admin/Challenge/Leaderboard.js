import React, { Component } from 'react';
import Header from '../Components/Header';
import { Redirect } from 'react-router';
import BASE_URL from '../../../config.js';

class AdminLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard:[],
    };
  }
  componentDidMount() {
    const url = new URL(document.URL);
    const params = new URLSearchParams(url.search.slice(1));
    const cid = params.get('cid');
    let furl = BASE_URL+'/scoreboard/'+cid;
    fetch(furl)
        .then(res => res.json())
        .then((result) => {
          console.log(result);
          this.setState({
            leaderboard:result,
          });
        }, (error) => {
            console.log(error);
    });
  }

  renderLeaderboard(){
    return(
      this.state.leaderboard.map((user,index)=>{
        return(
          <a href={"/admin/user/profile?uid="+user.uid} className="list-group-item list-group-item-action text-left">
            {index+1}.&nbsp; <strong>{user.uname}</strong>
            <div className="float-right">{user.score}</div>
          </a>
        );
      })
    );
  }
  render() {

    if(!sessionStorage['admin']){
      return <Redirect to='/admin/login/' />
    }
    
    return (
      <div className="complete-body">
        <Header />
        {/*<div className="text-left problems-heading bg-light p-4 mb-4">
          <h1>Airtel Crack the Code</h1>
          <small className="text-secondary">Apr 15, 2018, 09:00 AM IST - Jun 14, 2018, 11:55 PM IST</small>
        </div>*/}
        <div className="row p-4">
          <div className="col-lg-8">
            <h4 className="text-left problem-title">Leaderboard</h4>
            <div className="list-group w-100 mt-3">
              <div className="list-group-item list-group-item-action">
                <small className="float-left"><strong>PROGRAMMERS</strong></small>
                <small className="float-right"><strong>SCORE</strong></small>
              </div>
              {this.state.leaderboard.length === 0 ? (<h3 className="mt-4">No submissions yet.</h3>) : this.renderLeaderboard()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminLeaderboard;