import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  // Get the currently logged-in Clerk user
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // Prepare user info for Liveblocks
  const userInfo = {
    id,
    name: `${firstName || ""} ${lastName || ""}`.trim(),
    email: emailAddresses?.[0]?.emailAddress ?? "",
    avatar: imageUrl ?? "",
    color: getUserColor(id),
  };

  try {
    // Identify user with Liveblocks server-side secret
    const authResponse = await liveblocks.identifyUser(
      { userId: id, groupIds: [] }, // unique user ID
      { userInfo }
    );

    return new Response(JSON.stringify(authResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Liveblocks auth error:", err);
    return new Response(
      JSON.stringify({ error: "Liveblocks auth failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
