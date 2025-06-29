import { Toaster as SonnerToaster, toast } from "sonner";
import { useTheme } from "../../ThemeContext";

export function CustomToaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: theme === "dark" ? "#0A0E14" : "#FFFFFF",
          border: `1px solid ${
            theme === "dark"
              ? "rgba(0, 255, 255, 0.2)"
              : "rgba(0, 255, 255, 0.1)"
          }`,
          color: theme === "dark" ? "#FFFFFF" : "#0D1117",
          boxShadow:
            theme === "dark"
              ? "0 8px 32px 0 rgba(0, 255, 255, 0.1)"
              : "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
        },
      }}
    />
  );
}

// Export toast functions for easy use
export { toast };
