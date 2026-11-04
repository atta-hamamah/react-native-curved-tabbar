// Runs against the compiled output: `npm test` builds first.
const { test } = require('node:test');
const assert = require('node:assert');
const { computeNotch, buildBarPath, splitRoutes } = require('../lib/layout.js');
const { resolveColors, THEMES } = require('../lib/themes.js');

const routes = (...names) => names.map((name) => ({ name, key: `${name}-key` }));
const names = (list) => list.map((r) => r.name);
const FIVE = routes('Offers', 'Cards', 'Home', 'Cart', 'Menu');
const FOUR = routes('A', 'B', 'C', 'D');

test('notch fits the default button', () => {
  assert.deepStrictEqual(computeNotch(66), {
    radius: 43,
    depth: 43,
    shoulder: 6,
    buttonSize: 66,
    buttonTop: -27,
    spacerWidth: 78,
  });
});

test('notch grows with the button', () => {
  const notch = computeNotch(76);
  assert.strictEqual(notch.radius, 48);
  assert.strictEqual(notch.buttonTop, -32);
  assert.strictEqual(notch.spacerWidth, 88);
});

test('a shallower notch raises the button by the same amount', () => {
  const normal = computeNotch(66);
  const shallow = computeNotch(66, { depth: 34 });
  assert.strictEqual(normal.buttonTop - shallow.buttonTop, normal.depth - 34);
});

test('bar path has no invalid numbers', () => {
  for (const path of [
    buildBarPath(343, 75, 16, computeNotch(66)),
    buildBarPath(343, 75, 16),
    buildBarPath(0, 75, 16, computeNotch(66)),
    buildBarPath(343, 20, 99),
  ]) {
    assert.doesNotMatch(path, /NaN|undefined|Infinity/);
  }
});

test('odd tab count: the middle tab becomes the center by default', () => {
  const split = splitRoutes(FIVE, undefined);
  assert.strictEqual(split.centerRoute.name, 'Home');
  assert.deepStrictEqual(names(split.left), ['Offers', 'Cards']);
  assert.deepStrictEqual(names(split.right), ['Cart', 'Menu']);
});

test('options without a route still use the middle tab', () => {
  assert.strictEqual(splitRoutes(FIVE, { size: 72 }).centerRoute.name, 'Home');
});

test('a named center route is pulled out and the rest split evenly', () => {
  const split = splitRoutes(FIVE, 'Offers');
  assert.strictEqual(split.centerRoute.name, 'Offers');
  assert.deepStrictEqual(names(split.left), ['Cards', 'Home']);
  assert.deepStrictEqual(names(split.right), ['Cart', 'Menu']);
});

test('onPress without a route makes an action button', () => {
  const split = splitRoutes(FOUR, { onPress() {} });
  assert.ok(split.isAction && split.hasCenter && !split.centerRoute);
  assert.deepStrictEqual([split.left.length, split.right.length], [2, 2]);
});

test('even tab count without options: no center button', () => {
  const split = splitRoutes(FOUR, undefined);
  assert.ok(!split.hasCenter && !split.missingRoute);
});

test('center={false} turns the center off', () => {
  const split = splitRoutes(FIVE, false);
  assert.ok(!split.hasCenter);
  assert.strictEqual(split.left.length + split.right.length, 5);
});

test('unknown center route is reported', () => {
  const split = splitRoutes(FIVE, 'Nope');
  assert.strictEqual(split.missingRoute, 'Nope');
  assert.ok(!split.hasCenter);
});

test('color overrides apply on top of the theme and skip undefined', () => {
  const colors = resolveColors('dark', { bar: '#000000', active: undefined });
  assert.strictEqual(colors.bar, '#000000');
  assert.strictEqual(colors.active, THEMES.dark.active);
  assert.deepStrictEqual(resolveColors(undefined, undefined), THEMES.ocean);
});
