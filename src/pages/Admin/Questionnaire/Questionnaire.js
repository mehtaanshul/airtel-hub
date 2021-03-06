import React, { Component } from 'react';
import Header from '../Components/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Redirect } from 'react-router';
import BASE_URL from '../../../config.js';

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount:'',
      questionnairename:'',
      questions:[
        {
          type:'',
          qstatement:'',
          marks:'',
          answer:'',
          options:[],
        }
      ],
      showAlert:false,
      submitting:false,
      formErrors:"",
    };
    this.addQuestion = this.addQuestion.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  hideAlert(){
    this.setState({showAlert:false});
  }

  onSubmit(e){

    console.log(this.state.questions);
    this.validateForm();

    if(this.state.formErrors.trim().length !== 0){
      console.log("form validation error");
      e.preventDefault();
      return;
    }

    this.setState({
      submitting:true
    });

    let url = BASE_URL+'/questionnaires?qname='+this.state.questionnairename;
    console.log(this.state.questions);
    fetch(url,{
         method: 'post',
         headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
         },
         body: JSON.stringify(this.state.questions)
        })
        .then((res)=>res.json())
        .then((res)=>{
          if(res["status"] === "success"){
            window.scroll(0,0);
            this.setState({
              submitting:false,
              showAlert:true,
              questionnairename:'',
              questions:[
                {
                  type:'',
                  marks:'',
                  answer:'',
                  qstatement:'',
                  options:[],
                }
              ]
            })
          }
        }, (error)=>{
            console.log(error);
        });
  }

  validateForm(){

    if(this.state.questionnairename.trim().length === 0){
      this.state.formErrors = "Please enter questionnaire name";
      this.setState(this.state);
      return;
    }
    let requiredCheckFields = ["type", "marks","qstatement"];

    let field,i;

    for(let j=0; j<this.state.questions.length; j++){
      
      for(i=0;i<requiredCheckFields.length; i++){

        field = requiredCheckFields[i];

        if(this.state["questions"][j][field].trim().length === 0){
          this.state.formErrors = "Please fill all the fields";
          this.setState(this.state);
          return;
        }
      }

      if(this.state["questions"][j]["marks"] > 100){
        this.state.formErrors = "Max marks for a question is 100";
        this.setState(this.state);
        return;
      }

      else if(this.state["questions"][j]["type"] === "type"){
        this.state.formErrors = "Select question type for all the questions";
        this.setState(this.state);
        return; 
      }

      else if((this.state.questions[j]["type"] === "mcq" || this.state.questions[j]["type"] === "truefalse") && this.state.questions[j]["answer"].trim().length === 0){
        this.state.formErrors = "Enter answer for every question";
        this.setState(this.state);
        return;
      }

      else if(this.state.questions[j]["type"] === "mcq"){
        if(this.state.questions[j]["options"].length < 2){
          this.state.formErrors = "Add atleast 2 options for every MCQ.";
          this.setState(this.state);  
          return;
        }

        else {
          for(let k=0;k<this.state.questions[j]["answer"].length;k++){
            if(this.state.questions[j]["options"][k].trim().length === 0){
              this.state.formErrors = "Please fill all the fields.";
              this.setState(this.state);  
              return;
            }
          }
        }
      }

    }
    
    this.state.formErrors = "";
    this.setState(this.state);

  }


  handleChange(e, index){
    this.state["questions"][index][e.target.name] = e.target.value;
    this.setState(this.state);
  }
  handleNameChange(e){
    this.state["questionnairename"] = e.target.value;
    this.setState(this.state);
  }

  handleOptionsChange(e,index,i){
    this.state.questions[index]["options"][i] = e.target.value;
    this.setState(this.state);
  }

  handleQuestionStatementChange(e,i){
    this.state.questions[i]["qstatement"] = e.target.value;
    this.setState(this.state);
  }

  addQuestion(){
    let questions = this.state.questions; 
    
    questions.push(
      {
        type:'Type',
        qstatement:'',
        marks:'',
        answer:'',
        options:[],
      }
    );

    this.setState({questions:questions});
  }

  addOption(index){
    let questions = this.state.questions;
    questions[index]["options"].push('');
    this.setState({questions});
  }

  renderOptions(index){
    let items = [];
    for(let i=0;i<this.state.questions[index]["options"].length;i++){
      items.push(
        <div key={i} className="mt-2">
          <label className="float-left">{"Option "+(i+1)}</label>
          <textarea rows="2" value={this.state.questions[index]["options"][i]} name="options" className="form-control mt-2" onChange={(e) => this.handleOptionsChange(e,index,i)} value={this.state.questions[index]["options"][i]}/>
        </div>
      );
    }
    return items;
  }

  renderQuestions(){
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ];

    var modules = {
      toolbar: toolbarOptions
    };

    let items = [];

    for (let i = 0; i < this.state.questions.length; i++) {
      items.push(
        <div key={i} className="mt-4">
          <h5 className="text-left">{"Question " + (i+1)}</h5>
          <hr/>
          <div className="row mt-4">
            <div className="col-md-3">
              <label className="float-left" >Question Type</label>
              <select value={this.state.questions[i]["type"]} name="type" onChange={(e) => this.handleChange(e,i)} className="custom-select">
                  <option value="type" defaultValue>Type</option>
                  <option value="subjective">Subjective</option>
                  <option value="mcq">MCQ</option>
                  <option value="truefalse">True/False</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="float-left" >Question Marks</label>
              <input type="number" name="marks" className="form-control" onChange={(e) => this.handleChange(e,i)} value={this.state.questions[i]["marks"]} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <label className="float-left">Question Statement</label>
              <textarea name="qstatement" onChange={(e) => this.handleQuestionStatementChange(e,i)} value={this.state.questions[i]["qstatement"]} className="form-control" rows="3"></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {this.state.questions[i]["type"] === 'mcq' && this.renderOptions(i)}
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-3">
              {this.state.questions[i]["type"] === 'mcq' &&  <button type="button" onClick={() => this.addOption(i)} className=" float-left btn btn-info">Add a option</button>}
            </div>
          </div>
          {
            this.state.questions[i]["type"] === 'truefalse' || this.state.questions[i]["type"] === 'mcq' ? (
              <div className="row mt-4">
                <div className="col-md-3">
                  <label className="float-left">Answer</label>
                  <input type="text" name="answer" className="form-control" onChange={(e) => this.handleChange(e,i)} value={this.state.questions[i]["answer"]} placeholder={this.state.questions[i]["type"] === 'truefalse' ? "1 for true , 2 for false" : "Enter 1 for option 1 and so on"} />
                </div>
              </div>
            ) : null
          }
        </div>
      );
    }
    return items;
  }

  renderAlert(){
    return(
      <div className="alert alert-primary mt-4" role="alert">
        <button onClick={this.hideAlert} type="button" className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        Questionnaire added successfully!
      </div>
    );
  }

  render() {

    if(!sessionStorage['admin']){
      return <Redirect to='/admin/login/' />
    }

    return (
      <div className="complete-body">
        <Header />
        <div className="container mt-4">
          {this.state.showAlert && this.renderAlert()}
          <h3 className="text-left">Create Questionnaire</h3>
          <div className="row mt-4">
            <div className="col-md-4">
              <label className="float-left">Questionnaire Name</label>
              <input type="text" name="questionnairename" className="form-control" onChange={this.handleNameChange} value={this.state.questionnairename}/>
            </div>
          </div>
          {this.renderQuestions()}
          <div className="row mt-4">
            <div className="col-md-2">
              <button type="button" onClick={this.addQuestion} className="btn btn-info">Add another question</button>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-3">
              <small className="float-left" >{this.state.formErrors}</small>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-2">
              <button 
                type="button" 
                onClick={this.onSubmit} 
                className="btn btn-success float-left"
                disabled={this.state.submitting ? "disabled" : ""}
              >
                {this.state.submitting ? "Submitting .." : "Submit Questionnaire"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Questionnaire;
