# Extension documentation

When creating **any** extension (feature resolver/controller/API config, app-specific plugin, or consumer-specific plugin component), **create or update documentation** so the extension is visible in the generated docs. The project’s `yarn generate:docs` (or equivalent) copies app docs from `src/apps/$appId/` into the aggregated docs and links them from the app index.

## Extension component documentation content

For **each** extension component (e.g. one consumer-specific service, one extended resolver, one API config), the docs must explain:

1. **What was extended** — The base component: class name, file name, and contract or feature (e.g. base service, base resolver, base API configuration). Identify the extended type or base class clearly.
2. **How it was extended** — Concrete changes:
   - **Overridden methods:** For each overridden method, state the method name, what the base does, and what the extension does instead (e.g. "Logs then calls `super`", "Uses different response type", "Adds validation before delegating").
   - **New methods:** If the extension adds methods, list each new method name and its purpose (and signature or behavior if helpful).
3. **Purpose** — Why the extension exists: the business or technical reason (e.g. "Site-1 requires audit logging on list operations", "App needs custom fields on the user model", "Consumer-specific mapping for legacy IDs").

Apply this to both **feature extensions** (Ext types, API config, resolver, controller) and **consumer-specific plugin extensions** (service, datasource, mapper, registry). For feature extensions, the Extensions section can group multiple extended components (e.g. Ext types + resolver) and cover what/how/purpose per component or per logical group.

## Where to put extension docs

- **Feature extensions** (resolver, controller, API configuration, Ext types): Create or update **`src/apps/$appId/features/$featureId/docs/index.md`**. Include an **Extensions** section that describes, for each extended component, **what was extended**, **how it was extended** (overridden getters/methods, new methods, custom fields), and **purpose**:
  - Extended types (e.g. `ExtUser`, `ExtUserResultSet`): what base type they extend, any custom fields, and why.
  - Overridden API configuration getters: which getters, what response types or options changed, and purpose.
  - Resolver/controller extensions: what was extended (e.g. base resolver), overridden operations or new operations, return types or decorators, and purpose.
- **App-specific plugin:** Create or update **`src/apps/$appId/plugins/$pluginId/docs/index.md`** with an overview of the app-specific plugin and its behavior (what, how, purpose).
- **Consumer-specific plugin extensions** (service, datasource, mapper, registry): Create or update the **plugin feature** doc directory for the extended feature: **`src/apps/$appId/plugins/$pluginId/features/$featureId/docs/index.md`** (e.g. `src/apps/catalyst-cerebrum/plugins/commercetools/features/ec-user/docs/index.md`). Add a **Consumer extensions** (or **Extensions**) section. For **each** consumer extension component include:
  - **Consumer id** (e.g. `site-1`).
  - **What was extended:** Component type (e.g. ec-user service), base class/file name, and extension file name and class name (e.g. `Site1CommercetoolsEcUserServiceImpl` in `site-1.commercetools.ec-user.service.ts` extending `CommercetoolsEcUserServiceImpl`).
  - **How it was extended:** List overridden methods (method name + brief description of extension behavior, e.g. "`getEcUsers`: logs \"hello world\" then calls `super.getEcUsers`"). List any new methods (name + purpose).
  - **Purpose:** Why this consumer has this extension (e.g. audit, custom behavior for that tenant, integration with another system).

If the app already has plugin feature docs at that path, add the Extensions / Consumer extensions section to the existing `index.md` instead of overwriting it.

## Doc format

- **YAML frontmatter:** Start `index.md` with `title:` and `layout: default` (same pattern as feature or plugin docs in [feature-docs.md](feature-docs.md) and [plugin-docs.md](plugin-docs.md)).
- **Title:** Use a clear, location-specific title (e.g. `commercetools plugin (catalyst-cerebrum)`, `User feature (catalyst-cerebrum)`, or for plugin feature extension docs: `commercetools ec-user (catalyst-cerebrum)`).
- **Content:** Overview (and optionally "Backend integration" for plugins), then **Extensions** or **Consumer extensions**. For each extension component, include **what was extended**, **how it was extended** (overridden and new methods), and **purpose** as in the section "Extension component documentation content" above. No need for full Mermaid diagrams for extension-only docs unless the extension introduces new flows; structured bullets or short prose are enough.

## After writing docs

- Run **`yarn generate:docs`** (or the project’s doc-generation command) so the new or updated app docs are copied into the root `docs/` tree and linked from `docs/apps/$appId/index.md`.

## Checklist

- [ ] For feature extensions: `src/apps/$appId/features/$featureId/docs/index.md` exists or is updated with an **Extensions** section.
- [ ] For app plugin: `src/apps/$appId/plugins/$pluginId/docs/index.md` exists or is updated. For consumer extensions: `src/apps/$appId/plugins/$pluginId/features/$featureId/docs/index.md` exists or is updated with **Extensions** or **Consumer extensions** section.
- [ ] Each extension component is documented with **what was extended**, **how it was extended** (overridden methods, new methods), and **purpose**.
- [ ] Document has YAML frontmatter and location-specific title.
- [ ] `yarn generate:docs` has been run so docs are aggregated.
