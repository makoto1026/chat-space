$(function() {
  var buildHTML = function(message){
    if(message.content && message.image) {
      var html =`
                  <div class="message__list__post" data-message-id=${message.id}>
                    <div class="message__list__post__name">
                      ${message.user_name} 
                    </div>
                    <div class="message__list__post__day">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="message__list__text">
                    <p class="lower-message__content">
                    ${message.content}
                    </p>
                  </div>
                  <img src=${message.image}
                `
    } else if (message.content) {
      var html =`
                  <div class="message__list__post" data-message-id=${message.id}>
                    <div class="message__list__post__name">
                      ${message.user_name}
                    </div>
                    <div class="message__list__post__day">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="message__list__text">
                    <p class="lower-message__content">
                    ${message.content}
                    </p>
                  </div>
                `
    } else if (message.image) { 
      var html =`
                  <div class = "message__list__post" data-message-id = ${message.id} > 
                    <div class = "message__list__post__name">
                      ${message.user_name}
                    </div>
                    <div class = "message__list__post__day">
                      ${message.created_at}
                    </div>
                  </div>
                  <img src = ${message.image} >
                `
    };
    return html;
  };

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action")
  
    $('.form__submit').removeAttr('data-disable-with');
  
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
     })
      .done(function(data) {
        var html = buildHTML(data);
        $('.message__list').append(html);
        $('form')[0].reset();
        $('.message__list').animate({ scrollTop: $('.message__list')[0].scrollHeight });
      })
      .fail(function() {
        alert('見ろ、メッセージが空のようだ');
      })
  })
  var reloadMessages = function() {
    var last_message_id = $('.message__list__post:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: "get",
      data: {id: last_message_id},
      dataType: 'json'
   })
    .done(function(messages) {
      if(messages.length !== 0) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      $('.message__list').append(insertHTML);
      $('.message__list').animate({ scrollTop: $('.message__list')[0].scrollHeight });
      }
    })
    .fail(function() {
      alert('更新できませんでした。ごめんなさい。');
    })
  };
  if (document.location.href.match(/\/groups\/\d+\/message/)) {
    setInterval(reloadMessages, 7000);
  }
}); 