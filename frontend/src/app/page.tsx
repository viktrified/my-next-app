import Header from "./components/header";
import HomeM from "./pages/home";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <Header />
      <HomeM />
    </main>
  );
}
