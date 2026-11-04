import type { CurvedTabBarProps, NotchOptions } from './types';

export const DEFAULT_CENTER_SIZE = 66;
const DEFAULT_NOTCH_GAP = 10;
const DEFAULT_SHOULDER = 6;

export interface NotchGeometry {
  /** Half-width of the notch. */
  radius: number;
  depth: number;
  shoulder: number;
  buttonSize: number;
  /** Top of the center button relative to the top edge of the bar (negative = above it). */
  buttonTop: number;
  /** Width kept free between the left and right tabs. */
  spacerWidth: number;
}

/** Derives the notch shape and button position from the button size, so the two always fit. */
export function computeNotch(buttonSize: number, notch: NotchOptions = {}): NotchGeometry {
  const gap = notch.gap ?? DEFAULT_NOTCH_GAP;
  const radius = notch.radius ?? buttonSize / 2 + gap;
  const depth = notch.depth ?? radius;
  const shoulder = notch.shoulder ?? DEFAULT_SHOULDER;

  // Keep the button `gap` above the bottom of the notch.
  const buttonCenterY = shoulder + depth - gap - buttonSize / 2;

  return {
    radius,
    depth,
    shoulder,
    buttonSize,
    buttonTop: buttonCenterY - buttonSize / 2,
    spacerWidth: Math.max(buttonSize, radius * 2 - 8),
  };
}

/** SVG path for the bar, in a `width` x `height` box, with an optional notch at the top center. */
export function buildBarPath(
  width: number,
  height: number,
  cornerRadius: number,
  notch?: NotchGeometry
): string {
  const r = Math.max(0, Math.min(cornerRadius, height / 2, width / 2));
  const top = notch
    ? (() => {
        const cx = width / 2;
        const { radius: rx, depth: ry, shoulder: p } = notch;
        return [
          `L ${cx - rx - p} 0`,
          `A ${p} ${p} 0 0 1 ${cx - rx} ${p}`,
          `A ${rx} ${ry} 0 0 0 ${cx + rx} ${p}`,
          `A ${p} ${p} 0 0 1 ${cx + rx + p} 0`,
        ].join(' ');
      })()
    : '';

  return [
    `M ${r} 0`,
    top,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 1 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 1 ${width - r} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 1 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ]
    .filter(Boolean)
    .join(' ');
}

export interface SplitRoutes<R> {
  left: R[];
  right: R[];
  centerRoute?: R;
  /** Center button runs `onPress` without a route. */
  isAction: boolean;
  hasCenter: boolean;
  /** A `center.route` was given but doesn't exist. */
  missingRoute?: string;
}

/** Decides which route (if any) goes in the center and splits the rest left/right. */
export function splitRoutes<R extends { name: string }>(
  routes: R[],
  center: CurvedTabBarProps['center']
): SplitRoutes<R> {
  const options = center === false ? undefined : typeof center === 'string' ? { route: center } : center ?? {};

  let centerRoute: R | undefined;
  let missingRoute: string | undefined;

  if (options) {
    let routeName = options.route;
    if (routeName === undefined && !options.onPress && routes.length % 2 === 1) {
      routeName = routes[(routes.length - 1) / 2].name;
    }
    if (routeName !== undefined) {
      centerRoute = routes.find((r) => r.name === routeName);
      if (!centerRoute) missingRoute = routeName;
    }
  }

  const isAction = !centerRoute && Boolean(options?.onPress);
  const sides = centerRoute ? routes.filter((r) => r !== centerRoute) : routes;
  const half = Math.ceil(sides.length / 2);

  return {
    left: sides.slice(0, half),
    right: sides.slice(half),
    centerRoute,
    isAction,
    hasCenter: Boolean(centerRoute) || isAction,
    missingRoute,
  };
}
