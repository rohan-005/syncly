// app/(root)/document/[id]/page.tsx

import Collabrativeroom from "@/components/Collabrativeroom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { User, UserType } from "@/types"; // Ensure you import types
import { getUserColor } from "@/lib/utils";

interface SearchParamProps {
  params: { id: string };
}

const Document = async ({ params }: SearchParamProps) => {
  const id = params.id;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: email,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses || {});
  const users = (await getClerkUsers({ userIds })) || []; // now users is typed as User[]


  const usersData: User[] = users.map((user) => {
  const userEmail = user.email || "";
  const access = room.usersAccesses?.[userEmail];

  return {
    ...user,
    color: getUserColor(user.id),
    userType: access?.includes("room:write") ? "editor" : "viewer",
  };
});


  const currentUserType: UserType =
    room.usersAccesses?.[email]?.includes("room:write") ? "editor" : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <Collabrativeroom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
