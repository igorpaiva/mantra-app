
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/mantra-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/mantra-app"
  },
  {
    "renderMode": 1,
    "route": "/mantra-app/home"
  },
  {
    "renderMode": 1,
    "route": "/mantra-app/new-deck"
  },
  {
    "renderMode": 1,
    "route": "/mantra-app/edit-deck/*"
  },
  {
    "renderMode": 1,
    "route": "/mantra-app/study/*"
  },
  {
    "renderMode": 1,
    "redirectTo": "/mantra-app",
    "route": "/mantra-app/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 55263, hash: '65b9441f74788e5d3fad85ff902864c4152646e2e10c05e10ac67a809db74c7a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17204, hash: '1094fe6a8e5a2ae3f868cec00146cab0cf7bf03ca9bba1a0d8602385a09126e5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-FQNW3KH6.css': {size: 39714, hash: '5vFV8Flpzw0', text: () => import('./assets-chunks/styles-FQNW3KH6_css.mjs').then(m => m.default)}
  },
};
