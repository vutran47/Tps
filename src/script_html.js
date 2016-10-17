function append_new_account(sp, user_account_name, trigger) {
  let i = $('.accselect').length;
  let append = '<div id="accselect'+i+'" class="accselect" data-spname="' + sp + '" data-accountname="'+user_account_name+'" onclick="changeacc(this)"><span class="nav-group-item" ><span class="icon icon-mail"></span>'+user_account_name+'</span></div>';
  $('nav#left-nav').append(append);
  trigger && $('div#accselect'+i).trigger("click");
}

function changeacc(object){
  getObjectFromDatabase($(object).attr("data-spname"), $(object).attr("data-accountname"), (doc)=>{
    eventEmitter.emit('React_listen_to_Acc_change', doc);
  });
}
