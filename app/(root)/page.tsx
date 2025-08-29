import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import Notifications from "@/components/Notifications";

interface DocumentType {
  id: string;
  metadata: { title: string };
  createdAt: string;
}

export default async function Home() {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
  const roomDocuments = clerkUser ? await getDocuments(email) : null;

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center gap-5 sm:gap-10">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {clerkUser ? (
        roomDocuments?.data?.length ? (
          <div className="flex w-full max-w-[730px] flex-col items-center justify-center gap-5 rounded-lg bg-blue-950 px-10 py-8">
            <div className="max-w-[730px] flex w-full items-end justify-between">
              <h3 className="text-28-semibold">Your Syncly&apos;s</h3>
              <AddDocumentBtn userId={clerkUser.id} email={email} />
            </div>

            <ul className="flex w-full max-w-[730px] flex-col gap-5">
              {roomDocuments.data.map(
                ({ id, metadata, createdAt }: DocumentType) => (
                  <li
                    key={id}
                    className="flex items-center justify-between gap-4 rounded-lg bg-doc bg-cover p-5 shadow-xl bg-black"
                  >
                    <Link href={`/document/${id}`} className="flex flex-1 items-center gap-4">
                      <div className="hidden rounded-md bg-blue-300 p-2 sm:block">
                        <Image src="/assets/icons/doc.svg" alt="file" width={40} height={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="line-clamp-1 text-lg">{metadata.title}</p>
                        <p className="text-sm font-light text-blue-100">
                          Created about {dateConverter(createdAt)}
                        </p>
                      </div>
                    </Link>
                    <DeleteModal roomId={id} />
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <div className="flex w-full max-w-[730px] flex-col items-center justify-center gap-5 rounded-lg bg-blue-950 px-10 py-8">
            <Image
              src="/assets/icons/doc.svg"
              alt="document"
              width={40}
              height={40}
              className="mx-auto"
            />
            <AddDocumentBtn userId={clerkUser.id} email={email} />
          </div>
        )
      ) : (
        <div className="text-center text-white mt-20">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Syncly</h2>
          <p className="text-lg text-gray-300">
            Sign in or create an account to start collaborating on documents.
          </p>
        </div>
      )}
    </main>
  );
}
