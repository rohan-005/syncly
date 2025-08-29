/* eslint-disable @typescript-eslint/no-explicit-any */
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

const Home = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    // Landing page for non-signed-in users
    return (
      <main className="landing-container flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Syncly</h1>
        <p className="text-lg text-gray-300 mb-6">
          Organize your documents, collaborate seamlessly, and stay productive.
        </p>
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

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

      {roomDocuments.data.length > 0 ? (
        <div className="flex flex-col items-center mb-10 w-full gap-10 px-5">
          <div className=" max-w-[730px] items-end flex w-full justify-between">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn 
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="flex w-full max-w-[730px] flex-col gap-5">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className=" gap-4 rounded-lg bg-doc bg-cover p-5 shadow-xl flex justify-between items-center">
                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image 
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex w-full max-w-[730px]  gap-5 rounded-lg bg-dark-200 px-10 py-8 flex-col items-center justify-center mt-16">
          <Image 
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto mb-4"
          />
          <AddDocumentBtn 
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
