const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
const port = 3000;

let listName;

mongoose.connect("mongodb+srv://admin-ishaan:test123@cluster0.e6rwu.mongodb.net/todolistDB");
const itemsSchema = {
    name : {
        type : String,
        required : true
    },
    listName: {
        type: String,
        required: true
    }
};
const Item = mongoose.model("Item",itemsSchema);

app.listen(port, ()=>{
    console.log("server started on " + port);
});


app.get("/", (req,res)=>{
    res.redirect("/list/today")
});

// app.get("/work",(req,res)=>{
//     res.render("list",{
//         listHeading: "Work List",
//         items:workItems,
//         typeOfList: "work"
//     });
// });

// app.post("/work",(req,res)=>{
//     var item = req.body.newItem;
//     if(item){
//         workItems.push(item);
//     }
//     console.log("Add Work Item request received");
//     res.redirect("/work");
// });

app.post("/list/:listName", (req,res)=>{
        listName = _.capitalize(req.params.listName);
        const item = req.body.newItem;
        if(item){
            Item.create({name:item,listName:listName},err=>{
                if(err){console.log("error in Insert new item "+ err)}
                else {res.redirect("/list/"+listName);}
            });
        }

        
});

app.post("/delete",(req,res)=>{
    
    Item.deleteOne({_id:req.body.checkbox},err=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("_ID :" + req.body.checkbox + " deleted.");
            setTimeout(()=>{res.redirect("/list/"+listName);},500);
        }
    });
});

app.get("/list/:listName",(req,res)=>{
    
    listName = _.capitalize(req.params.listName);
    Item.find({listName:listName},(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data.length == 0){
                const item1 = new Item({name:"Welcome to your todolist!",listName:listName});
                const item2 = new Item({name:"Hit the + button to add new item.",listName:listName});
                const item3 = new Item({name:"<---Hit this to delete an item",listName:listName});
                Item.insertMany([item1,item2,item3],err=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Items inserted.")
                        }
                    });
                    setTimeout(()=>{res.redirect("/list/"+listName);},200);
                    
            }
            else{
                res.render("list", {
                    listHeading: listName,
                    items:data
                });
            }

            
        }
    });
    
    
    
    // console.log(req.params.listName);

});


app.get("/about",(req,res)=>{
    res.render("about",{});
});


