const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

describe('Docs files', () => {
  test('openapi.yaml exists and has an info.title', () => {
    const p = path.join(__dirname, '..', 'docs', 'openapi.yaml');
    expect(fs.existsSync(p)).toBe(true);
    const doc = YAML.load(p);
    expect(doc).toHaveProperty('info');
    expect(doc.info).toHaveProperty('title', 'DomHouse API');
  });
});
