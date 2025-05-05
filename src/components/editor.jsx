import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Importing the arrow icon from react-icons

function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      await addDoc(collection(db, "notes"), {
        userId: user.uid,
        title,
        content,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        {/* Back Button with Arrow */}
        <button
          className="flex items-center text-blue-500 mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold mb-4">New Note</h2>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className="w-full p-2 border border-gray-300 rounded resize-none"
        />
        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
