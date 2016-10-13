// main.js9
var fs = require('fs')
var React = require('react');
var ReactDOM = require('react-dom');
var M1 = require('../js_modules/m1_operations.js');


var EmailList = React.createClass({
  loadmail: function() {
    // Get from dir
    M1.Get_path_and_dir(ACTIVE_ACCOUNT, (result) => {
      this.setState({data: result, account: ACTIVE_ACCOUNT.user_account_name});
    })
  },

  getInitialState: function() {
    return ({data: [], account: ''});
  },

  fetch: function() {
    if (ACTIVE_ACCOUNT) {
      var query = this.state.data.length > 0 ? ('after:'+ this.state.data[0]['internalDate'].substring(0,10)) : '';
      console.log('Interval fetching with query: ' + query);
      M1.Fetching_new_message(ACTIVE_ACCOUNT, query)
    }
  },

  componentDidMount: function() {
    eventEmitter.on('React_listen_to_Acc_change', this.loadmail);
    eventEmitter.on('Incoming_Message', this.loadmail);
    setInterval(this.fetch, this.props.pollInterval);
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
