import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleNewNote = () => {
    navigate("/editor");
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setLoaded(true), 100);

    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Animated circles */}
          <div className="absolute w-64 h-64 rounded-full bg-purple-600 opacity-20 -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 top-1/3 right-1/4 animate-ping" style={{ animationDuration: '8s' }}></div>
          <div className="absolute w-48 h-48 rounded-full bg-pink-500 opacity-20 bottom-1/4 left-1/3 animate-ping" style={{ animationDuration: '6s' }}></div>
          <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 bottom-0 right-0 animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className={`flex justify-between items-center mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-white">
              My Notes
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full mt-1"></div>
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-800"
              onClick={handleLogout}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
              onClick={handleNewNote}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Note
              </span>
            </button>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {notes.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl text-center text-white animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl">No notes yet. Click "New Note" to create one.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className={`p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl cursor-pointer transform transition duration-500 hover:shadow-xl hover:scale-105 hover:bg-white/20 border border-white/10 overflow-hidden relative group transition-all delay-${(index % 5) * 100}`}
                  onClick={() => navigate(`/view/${note.id}`)}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="text-xl font-semibold text-white mb-3 relative z-10">{note.title}</h2>
                  <p className="text-sm text-gray-300 relative z-10 overflow-hidden">
                    {note.content?.slice(0, 100)}...
                  </p>
                  <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;