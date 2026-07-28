/**
 * SelectionCard - Astryx SelectableCard 래퍼
 * 기존 API와의 호환성을 위해 SelectableCard를 재익스포트합니다.
 */
export {
  SelectableCard,
  type SelectableCardProps,
} from "@astryxdesign/core";

// 기존 API와의 호환성을 위한 타입别名
export type SelectionCardProps = import("@astryxdesign/core").SelectableCardProps;

// SelectionCard를 SelectableCard로 재익스포트 (하위 호환성)
export { SelectableCard as SelectionCard } from "@astryxdesign/core";
