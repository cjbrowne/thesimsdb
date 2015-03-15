'use strict';
$(function () {
  $('#file-upload').on('change', function () {
    var files = this.files;
    var formData = new FormData();
    formData.append('file', files[0]);
    $.ajax({
      url: '/upload',
      headers: {
        Accept: 'application/json'
      },
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: function (result, status, xhr) {
        console.log('success', xhr.status, result);
      },
      error: function (xhr, status, err) {
        console.log('error: ', xhr.status, xhr.responseText);
      }
    })
  });
  $('.extract').on('click', function () {
    console.log('extract clicked');
    $('#file-upload').click();
  });
});