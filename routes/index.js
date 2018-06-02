var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'qiuying1219',
    port: '3306',
    database: 'bilibili'
};

var connection = mysql.createConnection(config);

/* GET home page. */
router.get('/', function(req, res) {
  var sql1="select * from user";
  var sql2="select * from video";
  var user;
  var video;
  var string
  connection.query(sql1,function (err,rows) {
      if (err){
          console.log("error in db",err);
          res.render('error');
          return
      }
      string=JSON.stringify(rows);
      user = JSON.parse(string);
      connection.query(sql2,function (err,rows) {
          if (err){
              console.log("error in db",err);
              res.render('error');
              return
          }
          string=JSON.stringify(rows);
          video = JSON.parse(string);
          res.render('index', { title: 'Express',user:user,video:video});
      })
  })
});

router.post("/vediodetail",function (req,res) {
    var avnum=req.body.avnum;
    var sql1="select label from label where avnum="+avnum;
    var sql2="select comment from comment where avnum="+avnum;
    var label;
    var comment;
    var string;
    connection.query(sql1,function (err,rows) {
        if (err){
            console.log("error in db",err);
            res.render('error');
            return;
        }
        string=JSON.stringify(rows);
        label = JSON.parse(string);
        connection.query(sql2,function (err,rows) {
            if (err){
                console.log("error in db",err);
                res.render('error');
                return;
            }
            string=JSON.stringify(rows);
            comment = JSON.parse(string);
            res.render('video',{title:'Express',label:label,comment:comment});
        })
    })
});

router.post("/userdetail",function (req,res) {
    var uid=req.body.uid;
    var string;
    var follower;
    var collvedio;
    var contvedio;
    var lookvedio;
    var sql1="select destination,name from follower,user where source= "+uid+" and user.uid=follower.destination";
    var sql2="select video.avnum,title,discription from collection,video where collection.uid= "+uid+" and video.avnum=collection.avnum";
    var sql3="select video.avnum,title,discription from contribute,video where contribute.uid= "+uid+" and video.avnum=contribute.avnum";
    var sql4="select video.avnum,title,discription from looklater,video where looklater.uid= "+uid+" and video.avnum=looklater.avnum";
    connection.query(sql1,function (err,rows) {
        if (err){
            console.log("error in db",err);
            res.render('error');
            return
        }
        string=JSON.stringify(rows);
        follower = JSON.parse(string);
        connection.query(sql2,function (err,rows) {
            if (err){
                console.log("error in db",err);
                res.render('error');
                return
            }
            string=JSON.stringify(rows);
            collvedio = JSON.parse(string);
            connection.query(sql3,function (err,rows) {
                if (err){
                    console.log("error in db",err);
                    res.render('error');
                    return;
                }
                string=JSON.stringify(rows);
                contvedio = JSON.parse(string);
                connection.query(sql4,function (err,rows) {
                    if (err){
                        console.log("error in db",err);
                        res.render('error');
                        return
                    }
                    string=JSON.stringify(rows);
                    lookvedio = JSON.parse(string);
                    res.render('user',{title: 'Express',follower:follower, collvedio:collvedio,contvedio:contvedio,lookvedio:lookvedio});
                })
            })
        })
    })
});

router.post("/update",function (req,res) {
    var uid=req.body.uid;
    var column=req.body.column;
    var newstring=req.body.new;
    var columnstring;
    switch(column){
        case "1":
            columnstring="name";
            break;
        case "2":
            columnstring="age";
            break;
        case "3":
            columnstring="sex";
            break;
        case "4":
            columnstring="birthday";
            break;
        default:
            return;
    }
    var sql="update user set "+columnstring+"= '"+newstring+"' where uid="+uid;
    connection.query(sql, function (err,rows) {
        if (err){
            console.log("error in db",err);
            return;
        }
        res.send("ok");
    })
});
router.post("/addvideo",function (req,res) {
    var uid=req.body.uid;
    var title=req.body.title;
    var avnum=req.body.avnum;
    var des=req.body.des;
    var string;
    var user;
    var sql0="select name from user where uid="+uid;
    var sql1="insert into contribute values("+avnum+","+uid+")";
    var sql2="insert into video values("+avnum+",'"+title+"','"+des+"')";
    connection.query(sql0,function (err,rows) {
        if (err){
            console.log("error in db",err);
            return;
        }
        string=JSON.stringify(rows);
        user = JSON.parse(string);
        if (Object.keys(user).length===0){
            res.send("bad");
            return;
        }
        else{
            connection.query(sql2, function (err,rows) {
                if (err){
                    console.log("error in db",err);
                    res.send("bad");
                    return;
                }
                connection.query(sql1,function (err,rows) {
                    if (err){
                        console.log("error in db",err);
                        res.send("bad");
                        return;
                    }
                    res.send("ok");
                })
            })
        }
    })
});

router.post("/deleteuser",function (req,res) {
    var uid=req.body.uid;
    var string;
    var user;
    var sql="delete from user where uid="+uid;
    var sql2="select name from user where uid="+uid;
    connection.query(sql2,function (err,rows) {
        if (err){
            console.log("error in db",err);
            return;
        }
        string=JSON.stringify(rows);
        user = JSON.parse(string);
        if (Object.keys(user).length===0){
            res.send("bad");
            return;
        }
        else{
            connection.query(sql,function (err,rows) {
                if (err) {
                    console.log("error in db", err);
                    return;
                }
                res.send("ok");
            })
        }
    })
});

router.post("/findtitle",function (req,res) {
    var string;
    var title;
    var uid=req.body.uid;
    var sql="select title from video where avnum in(select avnum from contribute where uid="+uid+")";
    connection.query(sql, function (err,rows) {
        if (err){
            console.log("error in db", err);
            return;
        }
        string=JSON.stringify(rows);
        title = JSON.parse(string);
        res.json(title);
    })
});

router.post("/findname",function (req,res) {
    var num=req.body.num;
    var name;
    var string;
    var sql="select name from user where user.uid in(select uid from contribute group by uid having count(*)>="+num+")";
    console.log(sql);
    connection.query(sql, function (err,rows) {
        if (err){
            console.log("error in db", err);
            return;
        }
        string=JSON.stringify(rows);
        name = JSON.parse(string);
        console.log(name);
        res.json(name);
    })
});

module.exports = router;
