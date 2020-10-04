var express=require("express");
var app=express();


var middleware=require("./middleware");
var server=require("./server");
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='HospitalsVentilators';
let db;
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName)
    console.log(`Connected to the database:${url}`);
    console.log(`Database : ${dbName}`);
});
app.get('/hospitalDetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form the hospitalDetails collection");
    db.collection('HospitalDetails').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

app.get('/ventilatorDetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form the ventilatorDetails collection");
    db.collection('VentilatorDetails').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

/*app.post('/searchventilators',middleware.checkToken,function(req,res){
    console.log("searching ventilator by status")
    var hId=req.query.hId;
    var status=req.query.status;
    var query={"hId":hId,"Status":status};
    console.log(hId +" " + status);
    db.collection('VentilatorDetails').find(query).toArray().then(result=> res.json(result));
});*/
app.post('/searcheventbystatus',middleware.checkToken,(res,req)=>{
    var status=req.body.status;
    console.log(status);
    db.collection('VentilatorDetails').find({"status": status}).toArray().then(result=>res.json(result));
});

app.post('/searchospitals',middleware.checkToken,function(req,res){
    console.log("searching hospital by name");
    var Name=req.query.Name;
    var query={"Name":Name};
    console.log(Name);
    db.collection('HospitalDetails').find(query).toArray().then(result => res.json(result));
});

app.put('/updateventilatorsdetails',middleware.checkToken,function(req,res){
    console.log("Update ventilator details");
    var vId=req.query.vId;
    var Status=req.query.Status;
    console.log(vId+" "+Status);
    var query1={"vId":vId};
    var query2={$set:{"Status":Status}};
    db.collection('VentilatorDetails').updateOne(query1,query2,function(err,result){
        if(err) console.log("update Unsuccessful");
        res.json("1 document updated");
        //res.json(result);
    });
});

app.post('/addventilators',middleware.checkToken,function(req,res){
    console.log("Adding a ventilator to the ventilatorInfo");
    var hId=req.query.hId;
    var vId=req.query.vId;
    var Status=req.query.Status;
    var Name=req.query.Name;
    console.log(hId+" "+vId+" "+Status+" "+Name);
    var query={"hId":hId,"vId":vId,"Status":Status,"Name":Name};
    db.collection('VentilatorDetails').insertOne(query,function(err,result){
        if(err) console.log("record not inserted");
        res.json("ventilator added");
        //res.json(result);
    });
});

app.delete('/deleteventilators',middleware.checkToken,function(req,res){
    console.log("deleting a ventilator by Vid");
    var vId=req.query.vId;
    console.log(vId);
    var q1={"vId":vId};
    db.collection('VentilatorDetails').deleteOne(q1,function(err,result){
        if(err) console.log("error in deleting the document");
        res.json("ventilator deleted");
    });
});
app.listen(1000); 