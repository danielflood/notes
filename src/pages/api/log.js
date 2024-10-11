import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  // Get session details for the logged-in user
  const session = await getSession({ req });

  if (!session) {
    // If the user is not logged in, return an unauthorized error
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Log the action
  console.log({
    user: session.user.email,
    method: req.method,
    endpoint: req.url,
    action: req.body,  // What the user did (e.g., from the request body)
  });

  // Simulate some action or API logic
  const result = {
    message: "Action logged successfully",
    user: session.user.email,
    action: req.body,
  };

  // Respond with the result
  res.status(200).json(result);
}
