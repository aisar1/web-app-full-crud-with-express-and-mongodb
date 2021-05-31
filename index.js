const express = require('express');
const app = express();
const path = require('path');
const mongoose =require('mongoose');
const override =require('method-override');
const bcrypt =require('bcrypt');
const session = require('express-session');



app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); //for normal req.body
app.use(express.json()); //for json req.body
app.use(override('_method'));
app.use(session({secret:"little secret"}));



mongoose.connect('mongodb://localhost:27017/databank', {useNewUrlParser: true, useUnifiedTopology: true})



.then(function(){
	console.log('mongo connected')
})
.catch(function(err){
	console.log('eror connection')
})

const staffSchema = new mongoose.Schema({
	name: String,
	identification: Number
});

const Product = mongoose.model('Product', staffSchema);



app.get('/',function(req,res){
	
	res.render('home');
	
	
})


app.get('/toaddworkerform',function(req,res){
	
	res.render('addnewworkerform');
	
	
})


app.post('/addworker',function(req,res){
	var namestaff = req.body.namecust;
	var staffid = req.body.idnumber;
	const p = new Product({name:namestaff,identification: staffid});
	p.save();
	res.redirect('/listworker');
	
})



app.get('/listworker',async function(req,res){
	
	
	const find = await Product.find();
	console.log(find);
	res.render('listworker',{tonewpage:find});
	
	
})




app.get('/productdetail/:id',async function(req,res){
	
	
	
	const {id} = req.params;
	const findId = await Product.findById(id);
	console.log(findId);
	res.render('todetailpage',{todetailpage:findId});
	
		
})


app.get('/updtfrm/:id', async function(req,res){
	
	
	
	const {id} = req.params;
	const findId = await Product.findById(id);
	console.log(findId);
	
	
	res.render('updateform', {toupdatefrm:findId});
	
		
})


app.put('/updatedata/:id', async function(req,res){
	const {id} = req.params;
	const formvalue = req.body;
	const findId = await Product.findByIdAndUpdate(id, formvalue, {runValidators:true});
	console.log(formvalue);
	res.redirect('/listworker');
		
})





app.delete('/deletedata/:id',async function(req,res){

	const {id} = req.params;
	const deltorder = await Product.findByIdAndDelete(id);
	res.redirect('/listworker');
	
})





app.listen(3000,function(res,req){
		   console.log('app is listening to port 3000');
		   });