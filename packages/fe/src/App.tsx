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

  // 토큰 접근 헬퍼
  const t = (name: string) => theme.token(name);

  const containerStyle: React.CSSProperties = {
    padding: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: "2rem",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: t("--text-heading-1-size"),
    fontWeight: Number(t("--text-heading-1-weight")),
    color: t("--color-text-primary"),
    marginBottom: "0.5rem",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: t("--text-body-size"),
    color: t("--color-text-secondary"),
  };

  const tabContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: `1px solid ${t("--color-border")}`,
    paddingBottom: "0.5rem",
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.75rem 1.5rem",
    borderRadius: `${t("--radius-element")} ${t("--radius-element")} 0 0`,
    border: "none",
    borderBottom: isActive ? `2px solid ${t("--color-accent")}` : "2px solid transparent",
    backgroundColor: "transparent",
    color: isActive ? t("--color-accent") : t("--color-text-secondary"),
    cursor: "pointer",
    fontWeight: isActive ? 600 : 400,
    fontSize: "0.875rem",
    transition: `all ${theme.tokens["--duration-fast"] || "150ms"}`,
  });

  const cardStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderRadius: t("--radius-element"),
    backgroundColor: t("--color-background-surface"),
    border: `1px solid ${t("--color-border")}`,
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
    backgroundColor: t("--color-accent"),
    color: "white",
  };

  const handleSavePolicy = async (cedarJson: string, name: string) => {
    console.log("Saving policy:", { name, cedarJson });
    // API 호출 로직은 later 구현
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
          Current theme mode: {theme.mode} (system)
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
              <h2 style={{ marginTop: "1rem", marginBottom: "0.5rem", color: t("--color-text-primary") }}>Custom Theme</h2>
              <p style={{ color: t("--color-text-secondary") }}>
                이 페이지는 Astryx Design System의 커스텀 테마를 사용하여 스타일링되었습니다.
              </p>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginBottom: "0.5rem", color: t("--color-text-primary") }}>Design Tokens</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Accent:</strong>{" "}
                  <span style={{ color: t("--color-accent") }}>
                    {t("--color-accent")}
                  </span>
                </div>
                <div>
                  <strong>Background:</strong>{" "}
                  <span style={{ color: t("--color-background-surface") }}>
                    {t("--color-background-surface")}
                  </span>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginBottom: "0.5rem", color: t("--color-text-primary") }}>Motion</h2>
              <p style={{ color: t("--color-text-secondary") }}>
                애니메이션 지속 시간:
                <br />
                Fast: {theme.tokens["--duration-fast"] || "150ms"}
                <br />
                Medium: {theme.tokens["--duration-medium"] || "300ms"}
              </p>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => {}}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: t("--radius-element"),
                border: `1px solid ${t("--color-border")}`,
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Light Mode
            </button>
            <button
              onClick={() => {}}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: t("--radius-element"),
                border: `1px solid ${t("--color-border")}`,
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              Dark Mode
            </button>
            <button
              onClick={() => {}}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: t("--radius-element"),
                border: `1px solid ${t("--color-border")}`,
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
