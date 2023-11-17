"use client";
import Image from "next/image";
import { nanoid } from "nanoid";
import Split from "react-split";
import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function Home() {
  let note_items = null;

  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [tempNoteText]);

  const createNewNote = async () => {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  };

  const updateNote = async (text) => {
    // Try to rearrange the most recently-modified
    // not to be at the top
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  };

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  // const findCurrentNote = () => {
  //   return (
  //     notes.find((note) => {
  //       return note.id === currentNoteId;
  //     }) || notes[0]
  //   );
  // };

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <main
      className="flex min-h-screen min-w-screen flex-col items-center justify-between text-black"
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsla(28, 26%, 62%, .7) 0%, hsla(31, 26%, 80%, .5) 27%, hsla(35, 27%, 84%, .8) 100%)",
      }}
    >
      {notes.length > 0 ? (
        <Split
          sizes={[30, 70]}
          direction="horizontal"
          className="flex w-full py-8"
        >
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
            />
          )}
        </Split>
      ) : (
        <div className="flex flex-col text-black justify-center items-center no-notes w-screen h-screen text-center relative">
          <div
            className="absolute top-0 w-full h-full z-20"
            style={{
              backgroundImage:
                " linear-gradient(135deg, hsla(28, 26%, 62%, .2) 0%, hsla(31, 26%, 80%, .3) 27%, hsla(35, 27%, 84%, .2) 100%), url('/notes_bg.jpg') ",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              filter: "blur(1px)",
            }}
          ></div>
          <div className="z-50">
            <h1 className="text-3xl  font-bold tracking-widest">
              You have no notes
            </h1>
            <button
              className="transition ease-in-out delay-150 duration-300 rounded bg-[#5F4F44] active:bg-[#867263] p-3 text-sky-100 my-8 active:ring-2 active:ring-sky-500/50 hover:scale-110"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
