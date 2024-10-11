import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Corrected relative path
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  // Use getServerSession instead of getSession
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      // Fetch the note by ID and ensure it belongs to the logged-in user
      const note = await prisma.note.findUnique({
        where: { id: id },
        include: { user: true }, // Include user info to validate ownership
      });

      // Check if the note exists and belongs to the logged-in user
      if (!note || note.user.email !== session.user.email) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching note", error });
    }
  } else if (req.method === "PUT") {
    const { title, content } = req.body;

    try {
      const updatedNote = await prisma.note.update({
        where: { id: id },
        data: { title, content },
      });
      return res.status(200).json(updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
      return res.status(500).json({ message: "Error updating note", error });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.note.delete({
        where: { id: id },
      });
      return res.status(200).json({ message: "Note deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting note", error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
