const express = require('express');
const bodyParser = require("body-parser");
const studentModel = require('./models/Student');


const app = express();

// middleware 
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// Routes

// Get all the students
app.get('/students', async (req, res) => {
    // write your codes here
	const list=await studentModel.find({
		isDeleted: false
	});
	res.json(list);
	res.end();
})

// Add student to database
app.post('/students', async (req, res) =>{
    // write your codes here
	const stData=req.body;
	if(stData.name==null || stData.sex==null || stData.age==null || stData.class==null || stData.grade_point==null) {
		res.statusCode=404;
		res.end();
		return;
	}
	const newStudent={};
	newStudent.name=stData.name;
	newStudent.sex=stData.sex;
	newStudent.age=Number(stData.age);
	newStudent.class=stData.class;
	newStudent.grade_point=Number(stData.grade_point);
	newStudent.time=new Date();
	newStudent.isDeleted=false;
	const doc=new studentModel(newStudent);
	await doc.save();
	res.statusCode=200;
	res.end();
})

// Get specific student
app.get('/students/:id', async (req, res) =>{
    // write your codes here
	const id=req.params.id;
	let st=null;
	try {
	st=await studentModel.find({_id:id,isDeleted: false});
	}catch (err) {
	}
	if(st==null) {
		res.statusCode=404;
	}
	else {
		res.json(st[0]);
	}
	res.end();
	
})

// delete specific student
app.delete('/students/:id', async (req, res) =>{
    // write your codes here
	const id=req.params.id;
	let st=null;
	try {
		st=await studentModel.findById(id);
	}catch (err) {
	}
	if(st==null) {
		res.statusCode=404;
		res.end();
		return;
	}
	const type=req.query.type;
	if(type==="soft") {
		st.isDeleted=true;
		await studentModel.updateOne({_id:id},st);
	}
	else {
		await studentModel.deleteOne({_id:id});
	}
	res.statusCode=200;
	res.end();
}) 


module.exports = app;
