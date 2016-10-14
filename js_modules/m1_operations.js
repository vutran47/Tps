// A supporting module consists of combined Functions to get specific tasks done
// Call when needed only

exports.Get_path_and_dir = function (doc, callback) {
  // Get all message in a directory and pass their content into JSON array
  console.log('Find message in dir');
  if (!doc) return;
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
      return callback(result.reverse());
    }
  });
}


exports.Fetching_new_message = function (account, query) {
  // Fetching new message from server
  if (!account) return;
  console.log('Keep Fetching for New Message');
  var path = './base/content/' + account.user_account_type + '__' + account.user_account_name;
  load_gmail_stuff(account, (userId, access_token) => {
    gmail_messages_list(userId, access_token, 1000, query, (response) =>{
      for (let message of response.messages) {
          gmail_messages_get(userId, access_token, message.id, (single_message) => {
              fs.writeFile(path + '/' + single_message.id, JSON.stringify(single_message), (err) => {
                  if (err) throw err;
                  console.log('New Message Saved!');
                  eventEmitter.emit('Incoming_Message')
              });
          });
      };
    })
  })
}


module.id = 'M1';
