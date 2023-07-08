import asyncHandler from "express-async-handler";
import {Notes} from "../Models/notes.mjs";


export const note_get = asyncHandler(async (req, res) => {

    const note = await Notes.find();

    res.status(200);
    res.json(note);
})

export const note_create = asyncHandler(async (req, res) => {
    const  noteObject = req.body;

    if(noteObject.title == null  || noteObject.description == null || noteObject.duedate == null || noteObject.prio == null || noteObject.state == null){
        res.status(400);
        res.send("Malformed note entry. Please provide a correct note.")
    }else{

        let currentDate = new Date(),
            month = currentDate.getMonth(),
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        noteObject.createdAt = `${year}-${month}-${day}`;

        await Notes.create(noteObject).then((note) => {
                res.status(201);
                res.json(note);
        }).catch((err) => {
            console.log(err.message);
        });
    }

})

export const note_update = asyncHandler(async (req, res) => {

    const note = await Notes.findById(req.params.id);

    let toUpdate;
    let indexToUpdate;
    const  noteObject = req.body;

    let currentDate = new Date(),
        month = currentDate.getMonth(),
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
   noteObject.createdAt = `${year}-${month}-${day}`;

    if(!note){
        res.status(404);
        res.send("Note does not exist.");
    }

    await Notes.findByIdAndUpdate(req.params.id, noteObject)
        .then(async () => {
            res.status(200);
            res.json(await Notes.find());
        })
        .catch(err => {
            console.log(err.message);
        });




})

export const note_delete = asyncHandler(async (req, res) => {

    await Notes.findByIdAndRemove(req.params.id).then(async () => {
        res.status(200);
        res.send(await Notes.find());
    }).catch((err) => {
        console.log(err.message);
    })
})

export const note_get_sort = asyncHandler(async (req, res) => {

    const note = await Notes.find();

    const sortBy = req.params.sortBy;
    const sortOrder = req.params.sortOrder;

    res.send(sortBy);

})

