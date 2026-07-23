import { describe, it, expect } from 'vitest';

describe('Playground Module', () => {
  it('Playground module can be imported', async () => {
    // Verify the module exists and can be imported
    const module = await import('./Playground');
    expect(module.Playground).toBeDefined();
  });

  it('hooks can be imported', async () => {
    const policiesModule = await import('../hooks/usePolicies');
    expect(policiesModule.usePolicies).toBeDefined();

    const resourcesModule = await import('../hooks/useResources');
    expect(resourcesModule.useResources).toBeDefined();

    const rolesModule = await import('../hooks/useRoles');
    expect(rolesModule.useRoles).toBeDefined();
  });

  it('components can be imported', async () => {
    const sidebarModule = await import('../components/ui/Sidebar');
    expect(sidebarModule.PolicyList).toBeDefined();

    const tabsModule = await import('../components/ui/Tabs');
    expect(tabsModule.Tabs).toBeDefined();

    const editorModule = await import('../components/PolicyEditor');
    expect(editorModule.PolicyEditor).toBeDefined();

    const testModule = await import('../components/TestPanel');
    expect(testModule.TestPanel).toBeDefined();

    const resultModule = await import('../components/ResultDisplay');
    expect(resultModule.ResultDisplay).toBeDefined();
  });
});
