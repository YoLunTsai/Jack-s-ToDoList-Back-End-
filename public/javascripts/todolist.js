//新增待辦項目
function addList() {
    var _title = $("#title").val();
    var _message = $("#message").val();

    if (_title == "" || _message == "") { //OR
        $("#title").attr("placeholder", "請輸入標題！");
        $("#message").attr("placeholder", "請輸入內容！");
    } else {
        $.post("http://localhost:3000/api/addList", {
            'title': _title,
            'content': _message
        }, function (res) {
            newList(res.data); //呼叫newList方法，並將回傳回來的物件中的data屬性作為參數代入
            $("#title").val("");
            $("#message").val("");
        });
    }
}

getList();

function getList() {
    $.get("http://localhost:3000/api/getList", function (data, status) {
        for (var i = 0; i < data.length; i++) {
            newList(data[i]);
        }
    });
}


//將待辦項目顯示到頁面上
function newList(data) { //data為後端回傳的物件中的data屬性，裡面就是json格式的待辦項目
    var status = (data.status) ? "checked" : "";
    var titleClass = (data.status) ? "title2" : "title";
    var messageClass = (data.status) ? "message2" : "message";
    var editClass = (data.status) ? "none" : "inline";

    var content = //使用ES6文字模板，${}可放置變數
        `<div class="content" id="${data._id}" style="order:${data._order};">
            <div class="${titleClass}" id="top${data._id}">
                <input type="checkbox" onclick="changeStatus( '${data._id}', this)" />
                <text id="title${data._id}">${data.title}</text>
                <button onclick="removeList('${data._id}')">刪除</button>
                <button id="edit${data._id}" style="display:${editClass}" onclick="editList('${data._id}')">修改</button>
                <button id="update${data._id}" style="display:none" onclick="updateList('${data._id}')">確認</button>
                <button id="goTop${data._id}" style="display:${editClass}" onclick="gotop('${data._id}')">置頂</button>
            </div>
            <div class="${messageClass}" id="down${data._id}">
            <text id="message${data._id}">${data.content}</text>
            </div>
        </div>`;
    $(".col-lg-8").append(content);
}

//修改待辦項目
function editList(id) {
    $('#edit' + id).css("display", "none"); //將修改按鈕隱藏
    $('#update' + id).css("display", "inline"); //將確認按鈕顯示

    var input = document.createElement("input");
    input.type = "text";
    input.id = "edit_title" + id;
    input.value = $('#title' + id).text();

    $('#title' + id).css("display", "none"); //將原本的標題隱藏
    $('#title' + id).parent().append(input); //將標題修改文字框加入到原本的位置

    var message_input = document.createElement("input");
    message_input.type = "text";
    message_input.id = "edit_message" + id;
    message_input.value = $('#message' + id).text();

    $('#message' + id).css("display", "none"); //將原本的內容隱藏
    $('#message' + id).parent().append(message_input); //將內容修改文字框加入到原本的位置
}

//修改完後保存待辦項目
function updateList(id) {
    var title = $("#edit_title" + id).val(); //標題修改文字框的值
    var message = $("#edit_message" + id).val(); //內容修改文字框的值

    $.post("http://localhost:3000/api/updateList", {
        'id': id,
        'title': title,
        'content': message
    }, function (res) {
        if (res.status == 0) {
            $('#title' + id).text(title);
            $('#message' + id).text(message);
            $('#edit' + id).css("display", "inline");
            $('#update' + id).css("display", "none");
            $('#title' + id).css("display", "inline");
            $('#message' + id).css("display", "inline");
            $('#edit_title' + id).remove();
            $('#edit_message' + id).remove();
        }
    });
}

//刪除待辦項目
function removeList(id) { //參數id代表newtodo的._id
    $.post("http://localhost:3000/api/removeList", {
        'id': id
    }, function (res) {
        if (res.status == 0) {
            $('#' + id).remove();
        }
    });
}

//改變待辦項目狀態
function changeStatus(id, btnstatus) { //id為勾選的待辦項目索引值 btnstatus為當下待辦項目本身(this)
    var title = btnstatus.parentNode;
    var message = title.nextElementSibling;

    $.post("http://localhost:3000/api/changeStatus", {
        'id': id,
        'status': btnstatus.checked
    }, function (res) {
        if (res.status == 0) {
            if (btnstatus.checked) {
                title.className = "title2";
                message.className = "message2";
                $('#edit' + id).css("display", "none");
                $('#update' + id).css("display", "none");

                if (document.getElementById("edit_title" + id)) {
                    $('#title' + id).css("display", "inline");
                    $('#message' + id).css("display", "inline");
                    $('#edit_title' + id).remove();
                    $('#edit_message' + id).remove();
                }
            } else {
                title.className = "title";
                message.className = "message";
                $('#edit' + id).css("display", "inline");
            }
        }
    });
}

//代辦項目置頂
function gotop(id) {
    document.getElementById(id).style.order = 1; //將元素的order屬性設為1，讓順序跑到第一個
    $("#goTop" + id).remove(); //將置頂按鈕刪除

    $('#top' + id).css({
        "background-color": "#F87575",
        "color": "white"
    });
    $('#down' + id).css({
        "background-color": "#FFA9A3",
        "color": "white"
    });
}