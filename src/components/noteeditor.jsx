
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadNote = async () => {
      if (id) {
        const noteRef = doc(db, "notes", id);
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
          const noteData = noteSnap.data();
          setTitle(noteData.title);
          setContent(noteData.content);
        }
      }
    };
    loadNote();
  }, [id]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (id) {
      // Update existing note
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, {
        title,
        content,
      });
    } else {
      // Create new note
      await addDoc(collection(db, "notes"), {
        title,
        content,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Note" : "Create Note"}
      </h1>
      <input
        className="w-full p-2 border mb-4 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded h-60"
        placeholder="Start writing here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

export default Editor;
