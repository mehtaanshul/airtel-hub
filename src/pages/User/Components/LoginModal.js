import React, { Component } from 'react';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:this.props.show,
      emailid:'',
      password:'',
      loginerror:'',
    };
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal:nextProps.show,
    });
  }

  closeModal(){
    this.setState({
      showModal:false,
    });
  }

  handleChange(e){
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }
  
  onRegister = () => {
    this.props.openRegisterModal();
  }

  onSubmit(){

    let url = 'http://192.168.1.26:8080/login' ;

    fetch(url,{
         method: 'post',
         headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
         },
         body: JSON.stringify({
          "emailid": this.state.emailid,
          "password": this.state.password,
         })
        })
        .then((res)=>res.json())
        .then((res)=>{
          if(res['status']==='success'){
            let user = {
              uid: res['id'],
            }
            sessionStorage.setItem("user",JSON.stringify(user));
            //this.props.changeUserStatus();
            window.location.reload();
            this.setState({
              showModal:false,
            });
          }
          else {
            this.setState({
              loginerror:'Invalid email or wrong password.'
            })
          }
        }, (error)=>{
            console.log(error);
        });

  }

  renderModal(){
    return (
      <div>
        <div className="login-modal">
        </div>
        <div className="login-form">
          <button type="button" className="close" onClick={this.closeModal} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <form className="mb-5 mt-5">
            <div className="form-group">
              <div className="offset-md-1 col-md-10">
                <label className="float-left label-text">Email Address</label>
                <input type="email" name="emailid" onChange={this.handleChange} value={this.state.email} className="form-control form-input" placeholder="Enter email"/>
              </div>
            </div>
            <div className="form-group">
              <div className="offset-md-1 col-md-10">
                <label className="float-left label-text">Password</label>
                <input type="text" name="password" onChange={this.handleChange} value={this.state.password} className="form-control form-input" placeholder="Password" />
              </div>
            </div>
            <div className="offset-md-1 col-md-10">
              <button type="button" onClick={this.onSubmit} className="btn btn-success btn-block">Login</button>
              <small>{this.state.loginerror}</small>
              <hr/>
              <label className="label-text"> Don't have an account</label>
              <button type="button"  onClick={this.onRegister} className="btn btn-primary btn-block">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
      {this.state.showModal && this.renderModal()}
      </div>
    );
  }
}

export default LoginModal;