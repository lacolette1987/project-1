import express from "express";

export const router = express.Router();
import * as controller  from "../Controllers/NotesController.mjs" ;

router.get('/', controller.note_get);
router.get('/:sortBy/:sortOrder', controller.note_get_sort);
router.post('/create', controller.note_create);

router.post('/update/:id', controller.note_update);
router.delete('/delete/:id', controller.note_delete);

