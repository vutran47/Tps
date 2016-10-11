// main.js9
var fs = require('fs')
var React = require('react');
var ReactDOM = require('react-dom');
var M1 = require('../js_modules/m1_operations.js');
var ACTIVE_ACCOUNT;


// Event firing
var events = require('events');
var eventEmitter = new events.EventEmitter();



var EmailList = React.createClass({
  loadmail: function() {
    let sp = $('div#left-container').attr("data-spname");
    let name = $('div#left-container').attr("data-accountname");
    getObjectFromDatabase(sp, name, (doc)=>{
      ACTIVE_ACCOUNT = doc;
    });

    if (ACTIVE_ACCOUNT && ACTIVE_ACCOUNT.user_account_name != this.state.account) {
      M1.Get_path_and_dir(ACTIVE_ACCOUNT, (result) => this.setState({data: result}));
      this.setState({account: ACTIVE_ACCOUNT.user_account_name});
    }

      // let query = 'after:'+ this.state.data[0]['internalDate'].substring(0,10);

  },

  getInitialState: function() {
    return ({data: [], account: ''});
  },

  componentDidMount: function() {
    this.loadmail();
    let query = this.state.data.length == 0 ? '' : ('after:'+ this.state.data[0]['internalDate'].substring(0,10));
    setInterval(M1.Fetching_new_message(ACTIVE_ACCOUNT, query, this), this.props.pollInterval);
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
      return (<div><EmailHead emailtitle = {t} key={i}/></div>)
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
