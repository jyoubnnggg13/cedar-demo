import { Theme } from "@astryxdesign/core";
import { useTheme } from "@astryxdesign/core";
import cedarTheme from "./theme";
import { PolicyEditor } from "./components";
import { useState } from "react";

/**
 * Playground 페이지 컴포넌트
 * PolicyEditor와 useTheme hook 사용 예시
 */
function PlaygroundPage() {
  const theme = useTheme();
  const [activeView, setActiveView] = useState<"playground" | "editor">("playground");

  const containerStyle: React.CSSProperties = {
    padding: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: "2rem",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "var(--text-heading-1-size)",
    fontWeight: "var(--text-heading-1-weight)",
    color: theme.tokens.color.textPrimary,
    marginBottom: "0.5rem",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "var(--text-body-size)",
    color: theme.tokens.color.textSecondary,
  };

  const tabContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: `1px solid ${theme.tokens.color.borderDefault}`,
    paddingBottom: "0.5rem",
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--radius-element) varradius-element) 0 0",
    border: "none",
    borderBottom: isActive ? `2px solid ${theme.tokens.color.accent}` : "2px solid transparent",
    backgroundColor: "transparent",
    color: isActive ? theme.tokens.color.accent : theme.tokens.color.textSecondary,
    cursor: "pointer",
    fontWeight: isActive ? 600 : 400,
    fontSize: "0.875rem",
    transition: `all ${theme.tokens.duration.fast}ms`,
  });

  const cardStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderRadius: "var(--radius-element)",
    backgroundColor: theme.tokens.color.backgroundPrimary,
    border: "1px solid var(--color-border-default)",
    marginBottom: "1rem",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 500,
    backgroundColor: theme.tokens.color.accent,
    color: "white",
  };

  const contentContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: activeView === "editor" ? "1fr" : "1fr",
    gap: "2rem",
  };

  const handleSavePolicy = async (cedarJson: string, name: string) => {
    console.log("Saving policy:", { name, cedarJson });
    // API 호출 로직은 später 구현
    alert(`정책 "${name}"이(가) 저장되었습니다!`);
  };

  const handleCancelPolicy = () => {
    console.log("Policy editing cancelled");
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Cedar Example Playground</h1>
        <p style={subtitleStyle}>
          Current theme mode: {theme.mode} (resolved: {theme.resolvedMode})
        </p>
      </header>

      <div style={tabContainerStyle}>
        <button
          style={tabStyle(activeView === "playground")}
          onClick={() => setActiveView("playground")}
        >
          Theme Playground
        </button>
        <button
          style={tabStyle(activeView === "editor")}
          onClick={() => setActiveView("editor")}
        >
          Policy Editor
        </button>
      </div>

      {activeView === "playground" && (
        <>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <span style={badgeStyle}>Theme Active</span>
              <h2 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Custom Theme</h2>
              <p style={{ color: theme.tokens.color.textSecondary }}>
                이 페이지는 Astryx Design System의 커스텀 테마를 사용하여 스타일링되었습니다.
              </p>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginBottom: "0.5rem" }}>Design Tokens</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Accent:</strong>{" "}
                  <span style={{ color: theme.tokens.color.accent }}>
                    {theme.tokens.color.accent}
                  </span>
                </div>
                <div>
                  <strong>Background:</strong>{" "}
                  <span style={{ color: theme.tokens.color.backgroundPrimary }}>
                    {theme.tokens.color.backgroundPrimary}
                  </span>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginBottom: "0.5rem" }}>Motion</h2>
              <p style={{ color: theme.tokens.color.textSecondary }}>
                애니메이션 지속 시간:
                <br />
                Fast: {theme.tokens.duration.fast}ms
                <br />
                Medium: {theme.tokens.duration.medium}ms
              </p>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => theme.setMode("light")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-element)",
                border: "1px solid var(--color-border-default)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Light Mode
            </button>
            <button
              onClick={() => theme.setMode("dark")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-element)",
                border: "1px solid var(--color-border-default)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Dark Mode
            </button>
            <button
              onClick={() => theme.setMode("system")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-element)",
                border: "1px solid var(--color-border-default)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              System Mode
            </button>
          </div>
        </>
      )}

      {activeView === "editor" && (
        <PolicyEditor
          onSave={handleSavePolicy}
          onCancel={handleCancelPolicy}
        />
      )}
    </div>
  );
}

/**
 * App 컴포넌트
 * Theme Provider로 전체 앱을 감싸서 커스텀 테마를 적용합니다.
 */
function App() {
  return (
    <Theme theme={cedarTheme} mode="system">
      <PlaygroundPage />
    </Theme>
  );
}

export default App;
