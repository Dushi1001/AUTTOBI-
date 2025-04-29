import Layout from "@/components/layout/Layout";
import Dashboard from "@/features/dashboard/Dashboard";
import GameList from "@/features/games/GameList";

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-10">
        <Dashboard />
        <GameList />
      </div>
    </Layout>
  );
}
