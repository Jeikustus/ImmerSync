import Image from "next/image";
import AuthenticationPage from "./authentication/page";

export default function Home() {
  return (
    <main className="w-full h-screen flex justify-center ">
      <div className="flex flex-col justify-center items-center space-y-[10%] bg-gradient-to-r from-emerald-900 to-emerald-800 w-full">
        <h1 className="font-luckiestFont font-bold text-8xl text-white">
          ImmerSync
        </h1>
        <Image
          src={"/immersync.png"}
          alt="log"
          priority
          width={500}
          height={500}
          className="hover:animate-spin"
        />
      </div>
      <div className="flex justify-center items-center bg-gradient-to-r from-emerald-800 to-emerald-500 w-full">
        <AuthenticationPage />
      </div>
    </main>
  );
}
