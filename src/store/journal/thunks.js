import { createAsyncThunk } from "@reduxjs/toolkit"

import { doc, collection, setDoc, deleteDoc } from "firebase/firestore/lite"
import { FirebaseDB } from "../../firebase/config"
import { addNewEmptyNote, deleteNoteById, savingNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from "./journalSlice"
import { fileUpload, loadNotes } from "../../helpers"

export const startNewNote = createAsyncThunk(
    'notes/startNewNote',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(savingNote())
        const { uid } = thunkAPI.getState().auth
        const newNote = {
            title: '',
            body: '',
            imageUrls: [],
            date: new Date().getTime(),
        }

        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`))
        await setDoc(newDoc, newNote)

        newNote.id = newDoc.id
        // You can dispatch other actions here if needed, for example to update the UI
        thunkAPI.dispatch(addNewEmptyNote(newNote))
        thunkAPI.dispatch(setActiveNote(newNote))
    }
)

export const startLoadingNotes = createAsyncThunk(
    'notes/startLoadingNotes',
    async (_, thunkAPI) => {
        const { uid } = thunkAPI.getState().auth
        if (!uid) throw new Error('El UID del usuario no existe')
        const notes = await loadNotes(uid)
        thunkAPI.dispatch(setNotes(notes))
    }
)

export const startSaveNote = createAsyncThunk(
    'notes/startSaveNote',
    async (_, thunkAPI) => {

        thunkAPI.dispatch(setSaving())

        const { uid } = thunkAPI.getState().auth
        const { active: note } = thunkAPI.getState().journal

        const noteToFireStore = { ...note };
        delete noteToFireStore.id;

        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`)
        await setDoc(docRef, noteToFireStore, { merge: true })

        thunkAPI.dispatch(updateNote(note))
    }
)

export const startUploadingFiles = createAsyncThunk(
    'notes/startUploadingFiles',
    async (files, thunkAPI) => {
        thunkAPI.dispatch(setSaving())
        // await fileUpload(files[0])
        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push(fileUpload(file))
        }
        const photosUrls = await Promise.all(fileUploadPromises);
        thunkAPI.dispatch(setPhotosToActiveNote(photosUrls))

    }
)

export const startDeletingNote = createAsyncThunk(
    'notes/startDeletingNote',
    async (_, thunkAPI) => {
        const { uid } = thunkAPI.getState().auth
        const { active: note } = thunkAPI.getState().journal
        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`)
        await deleteDoc(docRef)
        thunkAPI.dispatch(deleteNoteById(note.id))
    })