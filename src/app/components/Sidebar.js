import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = (props) => {
  const noteElements = props.notes.map((note, index) => (
    <div key={note.id} className={`${styles.noteNav}`}>
      <div
        className={`w-full overflow-hidden cursor-pointer flex justify-between items-center p-4 font-medium ${
          note.id === props.currentNote.id ? `${styles.selected}` : ""
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
      >
        <h4
          className={`${styles.text_snippet} truncate text-sm font-medium leading-5 overflow-hidden text-ellipsis`}
        >
          {/* Note {index + 1} */}
          {note.body.split("\n")[0]}
        </h4>
        <button
          className="display-[none] bg-[none] border-none cursor-pointer"
          onClick={() => props.deleteNote(note.id)}
        >
          <i className={` ${styles.gg_trash} cursor-pointer`}></i>
        </button>
      </div>
    </div>
  ));

  return (
    <section className="overflow-y-auto w-1/5 h-screen">
      <div className="flex justify-around items-center p-2 mb-8">
        <h3 className="text-base md:text-3xl font-semibold tracking-wide">
          Notes
        </h3>
        <button
          className={`${styles.button} -translate-y-1 cursor-pointer bg-[#B69B84] text-slate-100 rounded-md p-3 md:p-4 w-[10px] h-[10px] md:w-[30px] md:h-[30px] flex items-center justify-center text-center`}
          onClick={props.newNote}
        >
          +
        </button>
      </div>
      {noteElements}
    </section>
  );
};

export default Sidebar;
