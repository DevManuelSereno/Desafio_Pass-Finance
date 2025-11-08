import Link from "next/link";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex flex-col items-center gap-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
          <span className="text-3xl font-bold text-white">P</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-900">
            Bem-vindo ao Pass Finance
          </h1>
          <p className="text-lg text-zinc-600">
            Sistema de gestão financeira
          </p>
        </div>
        <Link href="/finance/bills-to-pay">
          <Button className="gap-2 rounded-xl" size="lg">
            <DollarSign size={20} />
            Acessar Contas a Pagar
          </Button>
        </Link>
      </main>
    </div>
  );
}
