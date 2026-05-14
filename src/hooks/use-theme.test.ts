import { useTheme } from "@/hooks/use-theme";
import * as themeAction from "@/lib/actions/theme.action";
import { act, renderHook } from "@testing-library/react";

vi.mock("@/lib/actions/theme.action");

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    vi.spyOn(themeAction, "setThemeAction").mockResolvedValue();
  });

  it("applies light class on init when theme is light", () => {
    renderHook(() => useTheme("light"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("applies dark class on init when theme is dark", () => {
    renderHook(() => useTheme("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggleTheme switches from light to dark", async () => {
    const { result } = renderHook(() => useTheme("light"));
    await act(async () => {
      await result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("calls setThemeAction with new theme", async () => {
    const { result } = renderHook(() => useTheme("light"));
    await act(async () => {
      await result.current.setTheme("dark");
    });
    expect(themeAction.setThemeAction).toHaveBeenCalledWith("dark");
  });
});
