import { GridPattern } from "@/src/components/grid-pattern";
import { ThemeProvider } from "@/src/context/theme-context";
import { getThemeAction } from "@/src/lib/actions/theme.action";
import Dashboard from "./components/dashboard";

export default async function DashboardPage() {
  const theme = await getThemeAction();

  return (
    <ThemeProvider initialTheme={theme}>
      <GridPattern />
      <Dashboard />
    </ThemeProvider>
  );
}
