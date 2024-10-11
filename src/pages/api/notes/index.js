import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === 'GET') {
    try {
      // Fetch only the titles and IDs of the notes
      const notes = await prisma.note.findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        select: {
          id: true,
          title: true, // Fetch only the title and id
        },
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Error fetching notes", error });
    }
  } else if (req.method === 'POST') {
    try {
      // Get the user by email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the count of existing notes for the user
      const noteCount = await prisma.note.count({
        where: { userId: user.id },
      });

      // Create a new note with the title "New Note" followed by an integer
      const newNote = await prisma.note.create({
        data: {
          title: `New Note ${noteCount + 1}`, // New Note followed by the count
          content: "",
          userId: user.id,
        },
      });

      return res.status(201).json(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Error creating note", error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
