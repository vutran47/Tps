// main.js9
var fs = require('fs')
var React = require('react');
var ReactDOM = require('react-dom');
var M1 = require('../js_modules/m1_operations.js');


var EmailList = React.createClass({
  getInitialState: function() {
    return ({data: [], account: ''});
  },

  load_folder: function(doc) {
    M1.Get_path_and_dir(doc, (result)=>{
      this.setState({data: result});
    })
  },

  appendNewMail: function(message) {
    let data = this.state.data;
    console.log(message);
    if (!data.includes(message)) {
      data.push(message);
      data.sort((a,b)=>{return b['internalDate']-a['internalDate']});
      this.setState({data: data});
    }
  },

  componentDidMount: function() {
    eventEmitter.on('React_listen_to_Acc_change', (doc)=>{
      this.load_folder(doc);
    });

    eventEmitter.on('Append_this_mail', (message)=>{
      this.appendNewMail(message);
    });
  },

  render: function() {
    var emailhead = this.state.data.map(function(message, i) {
      var t = '';
      var head = message.payload.headers;
      for (var i = 0; i < head.length; i++) {
        if (head[i].name == 'Subject') {
          t = head[i]['value'];
          break;
        }
      }
      return (<div><EmailHead emailtitle = {t} key={i} /></div>)
    });

    return (<div className = "emaillist" >{emailhead}</div>);
  }
});

ReactDOM.render(
  <EmailList pollInterval = {1000} />,
  document.getElementById('conversationdiv')
);

var EmailHead = React.createClass({
    render: function() {
        return (
          <div className = 'emailhead' >
            {this.props.emailtitle}
          </div>
        );
    }
});
