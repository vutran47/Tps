// A supporting module consists of combined Functions to get specific tasks done
// Call when needed only

exports.Get_path_and_dir = function (account) {
  // Get all message in a directory and pass their content into JSON array
  var sp = account.user_account_type;
  var user_account_name = account.user_account_name;
  var path = './base/content/' + sp + '__' + user_account_name;
  var result = [];
  fs.readdir(path, (err, files)=>{
    if (!err && files.length > 0) {
      for (let file of files) {
        fs.readFile(path + '/' + file, (err2, data)=>{
          (!err2) && eventEmitter.emit('Append_this_mail', JSON.parse(data));
        });
      }
    }
  });
},

exports.First_fetch = function (account) {
  var path = './base/content/' + account.user_account_type + '__' + account.user_account_name;
  load_gmail_stuff(account, (name, token)=>{
    gmail_messages_list(name, token, 20, '', (response)=>{
      for (let message of response.messages) {
        gmail_messages_get(name, token, message.id, (a_message)=>{
          fs.writeFile(path + '/' + a_message.id, JSON.stringify(a_message), (err)=>{
            (!err) && eventEmitter.emit('Append_this_mail', a_message);
          })
        })
      }
    })
  })
}

module.id = 'M1';
