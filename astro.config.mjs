// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  build: { format: 'directory' },
  // Lets a parent style the root of a child component through its `class` prop.
  scopedStyleStrategy: 'class',
  devToolbar: { enabled: false },
});
