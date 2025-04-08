import "./globals.css";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";
import { ReactQueryProvider } from "./react-query-provider";

export const metadata = {
  title: "Magic Hotel",
  description: "Plenty of rooms at the Magic Hotel",
};

const links: { label: string; path: string }[] = [
  { label: "Hotels", path: "/hotels" },
  { label: "Players", path: "/players" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <SolanaProvider>
            <UiLayout links={links}>{children}</UiLayout>
          </SolanaProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
