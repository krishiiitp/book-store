import express, { response } from "express";
import {PORT,MONGO_URL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
const app=express();
//Middleware for Parsing JSON request body
app.use(express.json());
app.get("/",(request,response)=>{
    console.log(request);
    return response.status(200).send("Welcome to the Book Store");
});
app.post("/books",async (request,response)=>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            return response.status(400).send({message : "Provide all the required fields!"});
        }
        const newBook={
            title : request.body.title,
            author : request.body.author,
            publishYear : request.body.publishYear,
        };
        const book=await Book.create(newBook);
        return response.status(400).send(book);
    }
    catch(error) {
        console.log(error);
        return response.status(500).send({message : error.message});
    }
});
app.get('/books',async (request,response)=>{
    try {
        const books=await Book.find({});
        return response.status(400).send(books);
    }
    catch(error) {
        console.log(error);
        return response.status(500).send({message : error.message});
    }
});
app.get("/book/:id",async (request,response)=>{
    try {
        const {id}=request.params;
        const book=await Book.findById(id);
        if(!book){
            return response.status(400).send({message : "Book not found!"})
        }
        return response.status(400).send(book);
    }
    catch(error){
        console.log(error);
        return response.status(500).send({message : error.message});
    }
});
app.put("/book/:id",async (request,response)=>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            return response.status(400).send({message : "Provide all the required fields!"});
        }
        const {id}=request.params;
        const book=await Book.findById(id);
        if(!book){
            return response.status(400).send({message : "Book Not Found"});
        }
        book.title=request.body.title;
        book.author=request.body.author;
        book.publishYear=request.body.publishYear;
        await book.save();
        return response.status(400).send({message : `Book ${id} Details Updated Successfully`});
    }
    catch(error) {
        console.log(error);
        return response.status(500).send({message : error.message});
    }
});
app.delete("/book/:id",async (request,response)=>{
    try{
        const {id}=request.params;
        const book=await Book.findByIdAndDelete(id);
        if(!book){
            return response.status(400).send({message : "Book not found!"});
        }
        return response.status(400).send({message : `Book with ID : ${id} Deleted Successfully`});
    }   
    catch(error){
        console.log(error);
        return response.status(500).send({message : error.message});
    }
});
mongoose
    .connect(MONGO_URL)
    .then(()=>{
        console.log("MongoDB Connected");
        app.listen(PORT,()=>{
            console.log(`Server started on PORT ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });