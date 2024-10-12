import { useRouter } from "next/router";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { getSession } from "next-auth/react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function NotePage({ note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content); // Now using the rich text editor
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
    <div className="editor-container">
      <button className="back-btn" onClick={() => router.push("/")}>
        ← Back to Home
      </button>

      <h1>Edit Note</h1>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="title-input"
      />

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="content-editor"
      />

      <div className="actions">
        <button className="update-btn" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Note"}
        </button>
        <button className="delete-btn" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete Note"}
        </button>
      </div>
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
