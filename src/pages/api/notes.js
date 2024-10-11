import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma"; // Assuming you have Prisma set up in a `lib/prisma.js` file

export default async function handler(req, res) {
  const session = await getSession({ req });

  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Fetch the user's notes from the database
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
}
