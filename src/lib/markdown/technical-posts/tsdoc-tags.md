---
title: Using TsDoc
description: Using TSDoc
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - tsdoc
  - typescript
---
| TSDoc Tag         | Description                                                                                          |
| :---------------- | :--------------------------------------------------------------------------------------------------- |
| `@alpha`          | Indicates that an API item is still in an early, unstable stage and may change frequently.           |
| `@beta`           | Signifies that an API item is stable enough for broader testing but may still have breaking changes. |
| `@internal`       | Marks an API item as intended for internal use only within its package or project.                   |
| `@public`         | Explicitly declares an API item as part of the public API, meant for external consumers.             |
| `@deprecated`     | Indicates that an API item is no longer recommended for use and may be removed in a future version.  |
| `@example`        | Provides a code example demonstrating how to use the API item.                                       |
| `@param`          | Describes a parameter of a function or method.                                                       |
| `@returns`        | Describes the return value of a function or method.                                                  |
| `@remarks`        | Provides additional, more detailed information about the API item.                                   |
| `@see`            | Links to related documentation or other API items.                                                   |
| `@throws`         | Describes an error that the API item might throw.                                                    |
| `@privateRemarks` | Provides internal remarks that are not published in the public documentation.                        |
| `@virtual`        | Indicates that a member is expected to be overridden by subclasses.                                  |
| `@override`       | Indicates that a member overrides a member from a base class.                                        |
| `@sealed`         | Indicates that a class or member cannot be inherited from or overridden.                             |
| `@readonly`       | Indicates that a property is read-only.                                                              |
| `@eventProperty`  | Used to document properties that represent events.                                                   |
| `@enum`           | Used to document enumeration members.                                                                |

## Examples

```typescript
/**
 * Represents a basic point in 2D space.
 * @alpha This API is new and may change frequently.
 * @beta This class is stable enough for broader testing.
 * @public
 * @sealed
 * @example
 * ```typescript
 * const p = new Point(10, 20);
 * console.log(p.toString()); // Output: Point(10, 20)
 * ```
 */
export class Point {
  /**
   * The x-coordinate of the point.
   * @readonly
   */
  public readonly x: number;

  /**
   * The y-coordinate of the point.
   * @internal For internal use within the Point class.
   * @privateRemarks We considered making this a getter, but decided against it for performance.
   */
  private _y: number;

  /**
   * Creates a new Point instance.
   * @param x - The initial x-coordinate.
   * @param y - The initial y-coordinate.
   * @throws {Error} If x or y are not finite numbers.
   * @deprecated Use `Point.fromCoordinates` instead for better readability.
   */
  constructor(x: number, y: number) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("Coordinates must be finite numbers.");
    }
    this.x = x;
    this._y = y;
    this._initializeInternalState();
  }

  /**
   * Initializes some internal state for the point.
   * @internal
   */
  private _initializeInternalState(): void {
    // ...
  }

  /**
   * Gets the y-coordinate of the point.
   * @returns The y-coordinate.
   */
  public getY(): number {
    return this._y;
  }

  /**
   * Returns a string representation of the point.
   * @remarks This method is useful for debugging and logging.
   * @returns A string in the format "Point(x, y)".
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.toString()}
   */
  public toString(): string {
    return `Point(${this.x}, ${this._y})`;
  }

  /**
   * Creates a new Point instance from given coordinates.
   * @param x The x-coordinate.
   * @param y The y-coordinate.
   * @returns A new Point object.
   */
  public static fromCoordinates(x: number, y: number): Point {
    return new Point(x, y);
  }
}

/**
 * Represents a colored point, extending the base Point class.
 * @beta
 * @virtual
 */
export class ColoredPoint extends Point {
  /**
   * The color of the point.
   */
  public color: string;

  /**
   * Creates a new ColoredPoint instance.
   * @param x - The x-coordinate.
   * @param y - The y-coordinate.
   * @param color - The color of the point.
   */
  constructor(x: number, y: number, color: string) {
    super(x, y);
    this.color = color;
  }

  /**
   * Overrides the toString method to include color information.
   * @override
   * @returns A string in the format "ColoredPoint(x, y, color)".
   */
  public toString(): string {
    return `ColoredPoint(${this.x}, ${this._y}, ${this.color})`;
  }
}

/**
 * Represents a click event.
 * @eventProperty
 */
export interface ClickEvent {
  /**
   * The x-coordinate of the click.
   */
  x: number;
  /**
   * The y-coordinate of the click.
   */
  y: number;
}

/**
 * Represents the status of an operation.
 * @enum
 */
export enum OperationStatus {
  /**
   * The operation is pending.
   */
  Pending = "PENDING",
  /**
   * The operation was successful.
   */
  Success = "SUCCESS",
  /**
   * The operation failed.
   */
  Failure = "FAILURE",
}
```