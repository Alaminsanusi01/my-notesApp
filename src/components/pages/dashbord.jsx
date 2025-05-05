
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        const q = query(
          collection(db, "notes"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(notesData);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/editor")}
          >
            + New Note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p>No notes yet. Click “+ New Note” to create one.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white shadow rounded cursor-pointer hover:shadow-md"
              onClick={() => navigate(`/view/${note.id}`)}
            >
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-600">
                {note.content.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
