import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma"; // Assuming you have Prisma set up in a `lib/prisma.js` file

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === 'GET') {
    // Fetch the user's notes from the database
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
    // Create a new note
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
          userId: user.id, // Associate the note with the logged-in user
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
