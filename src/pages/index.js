import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while session is loading
    console.log("Session:", session); 
    if (!session) {
      // Redirect to sign-in page if the user is not signed in
      router.push("/signin");
    } else {
      // Fetch user's notes when they are signed in
      const fetchNotes = async () => {
        try {
          const res = await fetch("/api/notes");
          const data = await res.json();
          setNotes(data); // Update the state with the fetched notes
        } catch (error) {
          console.error("Error fetching notes:", error);
        } finally {
          setLoadingNotes(false); // Set loading to false once notes are fetched
        }
      };
      fetchNotes();
    }
  }, [session, status, router]);

  const handleCreateNote = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes([...notes, newNote]); // Add the new note to the existing list
      } else {
        console.error("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="user-info">
          {session.user.image && (
            <Image width="50" height="50" src={session.user.image} alt="User's Google photo" className="profile-photo" />
          )}
          <div>
            <h1>Welcome, {session.user.name}!</h1>
            <p>Signed in as {session.user.email}</p>
          </div>
        </div>
        <button onClick={() => signOut()} className="signout-btn">
          Sign out
        </button>
      </header>

      <main>
        <div className="notes-header">
          <h2>Your Notes</h2>
          <button onClick={handleCreateNote} className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create New Note"}
          </button>
        </div>

        {loadingNotes ? (
          <p>Loading your notes...</p>
        ) : notes.length > 0 ? (
          <ul className="notes-list">
            {notes.map((note) => (
              <Link className="note-link" key={note.id} href={`/notes/${note.id}`} passHref>
                <li className="note-item">
                  {note.title}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>You have no notes yet.</p>
        )}
      </main>
    </div>
  );
}
