import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while session is loading

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

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return; // Ensure title and content are filled out

    setLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes([...notes, newNote]); // Add the new note to the existing list
        setTitle(""); // Clear the form
        setContent("");
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
    <>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>

      <h2>Create a New Note</h2>
      <form onSubmit={handleCreateNote}>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Note"}
        </button>
      </form>

      {loadingNotes ? (
        <p>Loading your notes...</p>
      ) : notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <h2>{note.title || "Untitled"}</h2>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no notes yet.</p>
      )}
    </>
  );
}
