import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [animClass, setAnimClass] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setTimeout(() => {
      setAnimClass("animate-in");
    }, 100);
    if (id) {
      fetchNote(id);
    }
  }, [id]);

  const fetchNote = async (id) => {
    try {
      const noteDoc = await getDoc(doc(db, "notes", id));
      if (noteDoc.exists()) {
        const noteData = noteDoc.data();
        setTitle(noteData.title);
        setContent(noteData.content);
      } else {
        alert("Note not found!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error fetching note:", err);
      alert("Failed to fetch note");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    try {
      setAnimClass("animate-save");

      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      if (id) {
        await updateDoc(doc(db, "notes", id), {
          title,
          content,
          updatedAt: serverTimestamp(),
        });
      } else {
        const docRef = await addDoc(collection(db, "notes"), {
          userId: user.uid,
          title,
          content,
          createdAt: serverTimestamp(),
        });

        // Save newly created note ID to local storage
        localStorage.setItem("lastNoteId", docRef.id);
      }

      setTimeout(() => {
        alert("Note saved successfully!");
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    }
  };

  const handleCancel = () => {
    setAnimClass("animate-out");
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900 flex items-center justify-center p-4 ${animClass}`}>
      <div className="relative w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white border-opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="floating-circle bg-purple-600 opacity-20 w-64 h-64 rounded-full absolute -top-20 -left-20"></div>
          <div className="floating-circle-reverse bg-blue-500 opacity-20 w-80 h-80 rounded-full absolute -bottom-32 -right-32"></div>
          <div className="floating-circle-slow bg-pink-500 opacity-10 w-40 h-40 rounded-full absolute top-1/2 left-1/4"></div>
        </div>

        <div className="relative z-10">
          <button
            onClick={handleCancel}
            className="flex items-center mb-6 text-white hover:text-blue-300 transition-all duration-300 transform hover:translate-x-1 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-glow">Back to Dashboard</span>
          </button>

          <h1 className="text-4xl font-bold mb-8 text-white text-glow animate-pulse-slow">
            {id ? "Edit Note" : "New Note"}
          </h1>

          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-6 p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:bg-opacity-25"
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:bg-opacity-25 resize-none"
          />

          <div className="mt-6 flex justify-between">
            <button
              className="px-6 py-3 rounded-lg bg-opacity-30 bg-gray-600 text-white hover:bg-opacity-40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={handleSave}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes pulse-slow {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }

        @keyframes saveFlash {
          0% { box-shadow: 0 0 0 rgba(129, 140, 248, 0); }
          50% { box-shadow: 0 0 30px rgba(129, 140, 248, 0.8); }
          100% { box-shadow: 0 0 0 rgba(129, 140, 248, 0); }
        }

        .text-glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }

        .floating-circle {
          animation: float 8s infinite ease-in-out;
        }

        .floating-circle-reverse {
          animation: float-reverse 9s infinite ease-in-out;
        }

        .floating-circle-slow {
          animation: float 12s infinite ease-in-out;
        }

        .animate-in {
          animation: fadeIn 0.8s forwards;
        }

        .animate-out {
          animation: fadeOut 0.8s forwards;
        }

        .animate-save {
          animation: saveFlash 0.8s;
        }
      `}</style>
    </div>
  );
}

export default Editor;
