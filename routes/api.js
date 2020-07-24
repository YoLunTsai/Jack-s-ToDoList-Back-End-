var express = require('express');
var router = express.Router();
var listModel = [];
var id = 1;
var order = 2;

router.post('/addList', function (req, res) {
    var newlist = {
        _id: id,
        _order: order,
        title: req.body.title,
        content: req.body.content,
        status: false
    };

    listModel.push(newlist);
    id++;
    order++;
    res.json({
        "status": 0,
        "msg": "success",
        "data": newlist
    });
});

//取得所有待辦項目API
router.get('/getList', function (req, res) {
    res.json(listModel);
});

//修改後保存待辦項目API
router.post('/updateList', function (req, res) {
    var id = req.body.id;
    var index = listModel.findIndex(item => item._id == id);
    listModel[index].title = req.body.title;
    listModel[index].content = req.body.content;
    res.json({
        "status": 0,
        "msg": "success"
    });
});

//刪除待辦項目API
router.post('/removeList', function (req, res) {
    var id = req.body.id;
    var index = listModel.findIndex(item => item._id == id);
    listModel.splice(index, 1);
    res.json({
        "status": 0,
        "msg": "success"
    });
});

//改變待辦項目狀態API
router.post('/changeStatus', function (req, res) {
    var id = req.body.id;
    var index = listModel.findIndex(item => item._id == id);

    if (listModel[index].status) {
        listModel[index].status = false;
    } else {
        listModel[index].status = true;
    }
    res.json({
        "status": 0,
        "msg": "success"
    });
});
module.exports = router;