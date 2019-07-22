// $('#myImage').on('change', function (e) {
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         var fileObj = $('#myImage')[0].files[0];
//         var fd = new FormData();
//         fd.append('uploadfile', fileObj);
//         $.ajax({
//             url: '/save_image',
//             type: 'POST',
//             processData : false,
//             contentType : false,
//             dataType : "text",
//             data: fd
//         })
//         .done(function (data) {
//             $("#preview").attr('src', data);
//             $("#img_file").attr('value', data);
//             console.log(data);
//         })
//         .fail(function () {
//             console.log("ajax failed");
//         });
//     }
//     reader.readAsDataURL(e.target.files[0]);
// });

$('#myImage').on('change', function (e) {
    document.uploadform.submit();
});

$(function () {
    $('#download').on('click', function (e) {
        var hrefPath = $(this).attr('href');
        console.log(this);
        console.log(hrefPath);
        var fileName = hrefPath.substr(-9);
        $target = $(e.target);
        $target.attr({
            download: fileName,
            href: hrefPath
        });
    });
});

// $('#preview').on("click", function (event) {
//     var clickX = event.pageX;
//     var clickY = event.pageY;
//
//     // 要素の位置を取得
//     var clientRect = this.getBoundingClientRect();
//     var positionX = clientRect.left + window.pageXOffset;
//     var positionY = clientRect.top + window.pageYOffset;
//
//     // 要素内におけるクリック位置を計算
//     var x = clickX - positionX;
//     var y = clickY - positionY;
//
//     console.log(x, y);
//
//     document.getElementById('x').value = x;
//     document.getElementById('y').value = y;
//
//     document.imgform.submit();
// });

$('#preview').on("mouseover", function (event1) {
    $('.loupe img').on("mouseup", function (event) {
        var clickX = event.pageX;
        var clickY = event.pageY;

        // 要素の位置を取得
        var positionX = $('#preview').offset().left + window.pageXOffset;
        var positionY = $('#preview').offset().top + window.pageYOffset;

        // 要素内におけるクリック位置を計算
        var x = clickX - positionX;
        var y = clickY - positionY;

        console.log(x, y);

        document.getElementById('x').value = x;
        document.getElementById('y').value = y;

        document.imgform.submit();
    });
});