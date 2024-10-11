import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Corrected relative path
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Error fetching notes", error });
    }
  } else if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const newNote = await prisma.note.create({
        data: {
          title,
          content,
          userId: user.id,
        },
      });

      return res.status(201).json(newNote); // Return the newly created note
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Error creating note", error });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: "Method not allowed" });
  }
}
