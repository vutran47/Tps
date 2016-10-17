// A supporting module consists of combined Functions to get specific tasks done
// Call when needed only

exports.Get_path_and_dir = function (doc, callback) {
  // Get all message in a directory and pass their content into JSON array
  var sp = doc.user_account_type;
  var user_account_name = doc.user_account_name;
  var path = './base/content/' + sp + '__' + user_account_name;
  var result = [];
  fs.readdir(path, (err, files)=>{
    if (!err) {
      for (let file of files) {
        var x = JSON.parse(fs.readFileSync(path + '/' + file));
        result.push(x);
      }
      result.sort((a,b)=>{
        return b['internalDate']-a['internalDate'];
      });
      return callback(result);
    }
  });
},

exports.First_fetch = function (account) {
  var path = './base/content/' + account.user_account_type + '__' + account.user_account_name;
  load_gmail_stuff(account, (name, token)=>{
    gmail_messages_list(name, token, 20, '', (response)=>{
      for (let message of response.messages) {
        gmail_messages_get(name, token, message.id, (a_message)=>{
          fs.writeFile(path + '/' + message.id, JSON.stringify(a_message), (err)=>{
            if (!err) {
              eventEmitter.emit('New_message_from_new_account', message);
            }
          })
        })
      }
    })
  })
}

module.id = 'M1';
