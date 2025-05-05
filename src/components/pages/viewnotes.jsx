
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setNote(docSnap.data());
      } else {
        alert("Note not found");
        navigate("/");
      }
      setLoading(false);
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "notes", id));
        navigate("/");
      } catch (error) {
        alert("Failed to delete the note.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <p className="whitespace-pre-line text-gray-800">{note.content}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/editor/${id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Note
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Note
        </button>
      </div>
    </div>
  );
}

export default ViewNote;
