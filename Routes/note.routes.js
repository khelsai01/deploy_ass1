const express = require("express");
const { NoteModel } = require("../model/note.model");
const { auth } = require("../middleware/auth.middleware");
const limiter = require("../middleware/rateLimiter.middleware");

const noteRoter = express.Router();

noteRoter.use(auth);
noteRoter.use(limiter)

noteRoter.get("/", async (req, res) => {

    try {
        const note = await NoteModel.find({ username: req.body.username })
        return res.status(200).send(note)

    } catch (error) {
        return res.status(400).send(error)
    }
});

noteRoter.post("/create", async (req, res) => {

    try {
        const note = new NoteModel(req.body);
        await note.save();
        return res.status(200).send({ msg: "new note is created" })
    } catch (error) {
        return res.status(400).send(error)
    }
});
noteRoter.patch("/update/:noteId", async (req, res) => {
    const { noteId } = req.params;
    const note = await NoteModel.findOne({ _id: noteId });
    try {
        if (req.body.userId == note.userId) {
            await NoteModel.findByIdAndUpdate({ _id: noteId }, req.body);
            return res.status(200).send({ msg: `note of id ${noteId} has been updated.` })
        }

    } catch (error) {
        return res.status(400).send(error)
    }
});
noteRoter.delete("/delete/:noteId", async (req, res) => {

    const { noteId } = req.params;
    const note = await NoteModel.findOne({ _id: noteId });
    try {
        if (req.body.userId == note.userId) {
            await NoteModel.findByIdAndDelete({ _id: noteId });
            return res.status(200).send({ msg: `note of id ${noteId} has been deleted.` })
        }
    } catch (error) {
        return res.status(400).send(error)
    }
});

module.exports = { noteRoter }