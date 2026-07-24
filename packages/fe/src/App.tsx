import { Theme } from "@astryxdesign/core";
import cedarTheme from "./theme";
import { Playground } from "./pages";

/**
 * App Component
 * Theme Provider로 전체 앱을 감싸서 커스텀 테마를 적용합니다.
 */
function App() {
  return (
    <Theme theme={cedarTheme} mode="system">
      <Playground />
    </Theme>
  );
}

export default App;
