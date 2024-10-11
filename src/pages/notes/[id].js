import { useRouter } from "next/router";
import { useState } from "react";
import { getSession, signOut } from "next-auth/react";

export default function NotePage({ note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Note</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Note"}
      </button>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Note"}
      </button>
    </div>
  );
}

// Server-side function to fetch the note data by ID
export async function getServerSideProps(context) {
  const { id } = context.params;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
    headers: {
      Cookie: context.req.headers.cookie, // Pass the session cookie
    },
  });
  
  const note = await res.json();
  return { props: { note } };
}
