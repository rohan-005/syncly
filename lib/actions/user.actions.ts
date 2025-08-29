'use server';

import { clerkClient, type User as ClerkUser } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import type { User } from "@/types";

// Fetch multiple Clerk users by IDs or emails
export const getClerkUsers = async ({ userIds }: { userIds: string[] }): Promise<User[]> => {
  try {
    const data = await clerkClient.users.getUserList({
      userId: userIds,
      limit: 100,
    });

    const users: User[] = data.map((u: ClerkUser) => ({
      id: u.id,
      name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      email: u.emailAddresses[0]?.emailAddress ?? "",
      avatar: u.imageUrl ?? "",
      color: "", // assign a default or generate one
    }));

    // Preserve input order
    const sortedUsers = userIds
      .map((idOrEmail) => users.find((user) => user.email === idOrEmail || user.id === idOrEmail))
      .filter((u): u is User => !!u);

    return parseStringify(sortedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Get users in a document excluding current user and optionally filter by text
export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}): Promise<string[]> => {
  try {
    const { liveblocks } = await import("../liveblocks");
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

    if (text.length) {
      const lowerCaseText = text.toLowerCase();
      return parseStringify(users.filter((email) => email.toLowerCase().includes(lowerCaseText)));
    }

    return parseStringify(users);
  } catch (error) {
    console.error("Error fetching document users:", error);
    return [];
  }
};
