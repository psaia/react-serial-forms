/**
 * A decent observer class.
 */
import { PayloadFn, Subscription } from "./types";

export default class Observer {
  /**
   * A hash for storing convenient subscriptions.
   */
  subscriptions: Subscription[] = [];

  /**
   * A hash for storing efficient subscriptions.
   */
  fastEvents: { [name: string]: PayloadFn } = {};

  /**
   * Publish a new event for all subscribers to consume.
   */
  async publish(name: string, payload?: any): Promise<void> {
    const fns = [];
    const evts = this.subscriptions;
    for (let i = 0, l = evts.length; i < l; i++) {
      if (evts[i] && name === evts[i].name) {
        fns.push(this.subscriptions[i].fn(payload));
      }
    }

    await Promise.all(fns);
  }

  /**
   * O(1) publishing. The limitations here is there can only be one subscriber.
   */
  async publishFast(name: string, payload?: any): Promise<void> {
    const fn = this.fastEvents[name];
    if (fn) {
      await fn(payload);
    }
  }

  /**
   * Subscribe to a published event.
   */
  subscribe(name: string, fn: PayloadFn) {
    this.subscriptions.push({ name, fn });
  }

  /**
   * O(1) subscribing. Same limitations as publishFast.
   */
  subscribeFast(name: string, fn: PayloadFn): void {
    this.fastEvents[name] = fn;
  }

  /**
   * Remove any subscriptions that were subscribed.
   */
  unsubscribe(name: string, fn: PayloadFn): void {
    let j = this.subscriptions.length;
    while (j--) {
      if (
        this.subscriptions[j].name === name &&
        fn === this.subscriptions[j].fn
      ) {
        this.subscriptions.splice(j, 1);
      }
    }
  }

  /**
   * Remove a fast subscription.
   */
  unsubscribeFast(name: string): void {
    if (this.fastEvents[name]) {
      delete this.fastEvents[name];
    }
  }
}
