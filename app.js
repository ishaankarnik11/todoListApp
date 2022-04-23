const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
const port = 3000;

var items = [];
var workItems = [];

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
    name : {
        type : String,
        required : true
    }
};
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({name:"Welcome to your todolist!"});
const item2 = new Item({name:"Hit the + button to add new item."});
const item3 = new Item({name:"<---Hit this to delete an item"});

// Item.insertMany([item1,item2,item3],err=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Items inserted.")
//     }
// });




app.listen(port, ()=>{
    console.log("server started on " + port);
});


app.get("/x",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/", (req,res)=>{
    
    Item.find({},(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data.length == 0){
                Item.insertMany([item1,item2,item3],err=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Items inserted.")
                        }
                    });
                    res.redirect("/");
            }
            else{
                res.render("list", {
                    listHeading: "Today",
                    items:data,
                    typeOfList: "personal"
                });
            }

            
        }
    });

    // res.render("list", {
    //     listHeading: "Today",
    //     items:items,
    //     typeOfList: "personal"
    // });
});

app.get("/work",(req,res)=>{
    res.render("list",{
        listHeading: "Work List",
        items:workItems,
        typeOfList: "work"
    });
});

app.post("/work",(req,res)=>{
    var item = req.body.newItem;
    if(item){
        workItems.push(item);
    }
    console.log("Add Work Item request received");
    res.redirect("/work");
});

app.post("/personal", (req,res)=>{
    var item = req.body.newItem;
    if(item){
        const tempItem = new Item({name:item});
        Item.create(tempItem,err=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("new item added to DB");
                res.redirect("/");
            }
        });
    }
    else{
        res.redirect("/");
    }
    
    
});

app.get("/about",(req,res)=>{
    res.render("about",{});
});

app.post("/delete",(req,res)=>{
    
    Item.deleteOne({_id:req.body.checkbox},err=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("_ID :" + req.body.checkbox + " deleted.");
            setTimeout(()=>{res.redirect("/");},500);
        }
    });
    

    
    
});


