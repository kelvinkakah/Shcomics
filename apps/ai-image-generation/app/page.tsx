import { WalletProvider } from "../components/WalletProvider";
import Header from "../components/Header";
import ImageGenerator from "../components/ImageGenerator";

export default function Home() {
  return (
    <WalletProvider>
      <main style={{ minHeight: "100vh", background: "#FFF9E6" }}>
        <Header />
        <ImageGenerator />
      </main>
    </WalletProvider>
  );
}