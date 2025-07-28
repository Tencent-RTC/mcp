"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeakReference = void 0;
/**
 * `WeakReference` 提供 Weak 类型容器，用于兼容不支持 `WeakRef` 环境
 */
exports.WeakReference = (typeof WeakRef === "function")
    ? class {
        constructor(target) {
            this.ref = new WeakRef(target);
        }
        reset(target) {
            this.ref = new WeakRef(target);
            return this;
        }
        equal(value) {
            return this.ref.deref() === value;
        }
        find(values) {
            const target = this.ref.deref();
            if (target === undefined) {
                return undefined;
            }
            return values.includes(target) ? target : undefined;
        }
    }
    : class {
        constructor(target) {
            this.ref = new WeakSet();
            this.ref.add(target);
        }
        reset(target) {
            this.ref.add(target);
            return this;
        }
        equal(value) {
            return this.ref.has(value);
        }
        find(values) {
            return values.find(value => this.ref.has(value));
        }
    };
// #endregion
//# sourceMappingURL=weak.js.map