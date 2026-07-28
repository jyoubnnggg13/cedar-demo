# Task #20: Selector/Dropdown 컴포넌트로 변환

## Task Summary
**Subject**: refactor(fe): Selector/Dropdown 컴포넌트로 변환  
**Purpose**: 커스텀 select 드롭다운을 Astryx Selector 컴포넌트로 대체  
**Worktree**: `C:/dev/cedar-example/.worktree/feat-fe-playground`  
**Commit**: `4aa4caf`

## Implementation Details

### Changes Made
Replaced 4 native `<select>` elements with Astryx `Selector` components in `packages/fe/src/components/TestPanel.tsx`:

1. **Principal Role dropdown** - Admin/Editor/Viewer selection
2. **User ID dropdown** - Dynamic options based on selected role
3. **Resource Type dropdown** - Document/Issue selection
4. **Resource ID dropdown** - Dynamic options based on selected resource type

### Key Changes
- Added `Selector` to imports from `@astryxdesign/core`
- Replaced inline `<select>` elements with Astryx `Selector` components
- Used `size="sm"` for compact form layout
- Used `isLabelHidden` since labels are handled by parent container
- Options now use `{ value, label }` object format

## Validation
- Build: `pnpm --filter @cedar-example/fe build` - **PASSED**
- Commit: `4aa4caf refactor(fe): Replace select dropdowns with Astryx Selector (Task #20)`

## Next Steps
- Task #20 blocks Task #15 (Button 컴포넌트 변환)
- Task #15 is blocked by: 16, 17, 18, 19, 20
- Task #16 is currently in_progress
- When Task #16 completes, Task #15 can proceed
