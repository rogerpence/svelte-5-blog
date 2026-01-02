/**
 * A small stopwatch utility for measuring elapsed time using `Date.now()`.
 *
 * @remarks
 * - Call {@link StopWatch.start} to begin timing.
 * - Call {@link StopWatch.stop} to record the elapsed time into {@link StopWatch.elapsedMS}.
 * - Call {@link StopWatch.showElapsedMS} to get a formatted message including the description.
 *
 * This stopwatch stores the *last recorded* duration. It does not continuously update
 * while running; {@link StopWatch.stop} records the duration.
 *
 * @example
 * ```ts
 * const sw = new StopWatch('build search index');
 * sw.start();
 * ...do work...
 * sw.stop();
 * console.log(sw.showElapsedMS()); // "Time to build search index: 123ms"
 * ```
 *
 * @public
 */
export class StopWatch {
	/**
	 * Description of what this stopwatch is timing.
	 */
	public readonly description: string;

	/**
	 * The last recorded elapsed time (in milliseconds).
	 * Updated by start() and stop().
	 */
	public elapsedMS = 0;

	private _startTimeMs: number | null = null;
	private _running = false;

	constructor(description: string) {
		this.description = description;
	}

	/**
	 * Start (or restart) the stopwatch.
	 * Resets elapsedMS to 0 and begins timing from Date.now().
	 */
	start(): void {
		this._startTimeMs = Date.now();
		this.elapsedMS = 0;
		this._running = true;
	}

	/**
	 * Stop the stopwatch and record elapsedMS.
	 * If start() was never called, elapsedMS remains unchanged.
	 */
	stop(): void {
		if (!this._running || this._startTimeMs === null) return;

		this.elapsedMS = Date.now() - this._startTimeMs;
		this._running = false;
		this._startTimeMs = null;
	}

	stopWithMessage(): void {
		if (!this._running || this._startTimeMs === null) return;

		this.stop();
		console.log(this.showElapsedMS());
	}

	/**
	 * Report the last recorded elapsedMS (and include description).
	 * Note: This does not auto-update while running; call stop() to record.
	 */
	showElapsedMS(): string {
		return `Time to ${this.description}: ${this.elapsedMS}ms`;
	}
}
