import { getThemeAction } from "@/src/lib/actions/theme.action";
import Dashboard from "./components/dashboard";

export default async function DashboardPage() {
  const theme = await getThemeAction();

  return <Dashboard initialTheme={theme} />;
}
