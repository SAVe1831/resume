(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
* @vue/shared v3.4.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item2 = value[i];
      const normalized = isString(item2) ? parseStringStyle(item2) : normalizeStyle(item2);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item2) => {
    if (item2) {
      const tmp = item2.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
/**
* @vue/reactivity v3.4.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 2;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 1) {
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 2) {
            break;
          }
        }
      }
      if (this._dirtyLevel < 2) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 2;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 2 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps && effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    if (effect2._dirtyLevel < dirtyLevel && dep.get(effect2) === effect2._trackId) {
      const lastDirtyLevel = effect2._dirtyLevel;
      effect2._dirtyLevel = dirtyLevel;
      if (lastDirtyLevel === 0) {
        effect2._shouldSchedule = true;
        effect2.trigger();
      }
    }
  }
  scheduleEffects(dep);
  resetScheduling();
}
function scheduleEffects(dep) {
  for (const effect2 of dep.keys()) {
    if (effect2.scheduler && effect2._shouldSchedule && (!effect2._runnings || effect2.allowRecurse) && dep.get(effect2) === effect2._trackId) {
      effect2._shouldSchedule = false;
      queueEffectSchedulers.push(effect2.scheduler);
    }
  }
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        2
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _shallow = false) {
    this._isReadonly = _isReadonly;
    this._shallow = _shallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, shallow = this._shallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(shallow = false) {
    super(false, shallow);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._shallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(shallow = false) {
    super(true, shallow);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(this, 1),
      () => this.dep && scheduleEffects(this.dep)
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if (!self2._cacheable || self2.effect.dirty) {
      if (hasChanged(self2._value, self2._value = self2.effect.run())) {
        triggerRefValue(self2, 2);
      }
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 1) {
      triggerRefValue(self2, 1);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      ref2.dep || (ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ))
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 2);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
/**
* @vue/runtime-core v3.4.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event2, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event2.startsWith("update:");
  const modelArg = isModelListener2 && event2.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler7 = props[handlerName = toHandlerKey(event2)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event2))];
  if (!handler7 && isModelListener2) {
    handler7 = props[handlerName = toHandlerKey(hyphenate(event2))];
  }
  if (handler7) {
    callWithAsyncErrorHandling(
      handler7,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options2, key) {
  if (!options2 || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options2, key[0].toLowerCase() + key.slice(1)) || hasOwn(options2, hyphenate(key)) || hasOwn(options2, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render3,
    renderCache,
    data: data17,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render3.call(
          thisProxy,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data17,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root10 = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root10;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root10 = cloneVNode(root10, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root10 = cloneVNode(root10);
    root10.dirs = root10.dirs ? root10.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root10.transition = vnode.transition;
  }
  {
    result = root10;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root10 = parent.subTree;
    if (root10.suspense && root10.suspense.activeBranch === vnode) {
      root10.el = vnode.el;
    }
    if (root10 === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options2) {
  return doWatch(source, cb, options2);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options2) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options2 = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options2);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const leaveCbKey = Symbol("_leaveCb");
const enterCbKey = Symbol("_enterCb");
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode: mode2 } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode2 === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.effect.dirty = true;
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode2 === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el[leaveCbKey] = () => {
              earlyRemove();
              el[leaveCbKey] = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode: mode2,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode: mode2,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el[leaveCbKey]) {
        el[leaveCbKey](
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
        leavingVNode.el[leaveCbKey]();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el[enterCbKey] = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el[enterCbKey] = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove22) {
      const key2 = String(vnode.key);
      if (el[enterCbKey]) {
        el[enterCbKey](
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove22();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el[leaveCbKey] = (cancelled) => {
        if (called)
          return;
        called = true;
        remove22();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el[leaveCbKey] = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    vnode.children ? vnode.children[0] : void 0
  ) : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options2, extraOptions) {
  return isFunction(options2) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options2.name }, extraOptions, { setup: options2 }))()
  ) : options2;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function renderList(source, renderItem, cache, index2) {
  let ret;
  const cached = cache && cache[index2];
  if (isArray$1(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item2, i) => renderItem(item2, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index2] = ret;
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray$1(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.key ? (...args) => {
        const res = slot.fn(...args);
        if (res)
          res.key = slot.key;
        return res;
      } : slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj, preserveCaseIfNecessary) {
  const ret = {};
  for (const key in obj) {
    ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data: data17, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data17[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data17 !== EMPTY_OBJ && hasOwn(data17, key)) {
        accessCache[key] = 2;
        return data17[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data: data17, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data17 !== EMPTY_OBJ && hasOwn(data17, key)) {
      data17[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data: data17, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data17 !== EMPTY_OBJ && hasOwn(data17, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options2 = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options2.beforeCreate) {
    callHook$1(options2.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created: created3,
    beforeMount: beforeMount3,
    mounted: mounted16,
    beforeUpdate: beforeUpdate2,
    updated: updated10,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount: beforeUnmount9,
    destroyed,
    unmounted: unmounted6,
    render: render3,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options2;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data17 = dataOptions.call(publicThis, publicThis);
    if (!isObject(data17))
      ;
    else {
      instance.data = reactive(data17);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created3) {
    callHook$1(created3, instance, "c");
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook3) => register2(_hook3.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount3);
  registerLifecycleHook(onMounted, mounted16);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate2);
  registerLifecycleHook(onUpdated, updated10);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount9);
  registerLifecycleHook(onUnmounted, unmounted6);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render3 && instance.render === NOOP) {
    instance.render = render3;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler7 = ctx[raw];
    if (isFunction(handler7)) {
      watch(getter, handler7);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler7 = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler7)) {
        watch(getter, handler7, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render3, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options2) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options2);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options2);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render3(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render3(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function initProps(instance, rawProps, isStateful2, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful2) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options2] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options2) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options2,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options2) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options2,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options2, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options2 && hasOwn(options2, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options2,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options2, props, key, value, instance, isAbsent) {
  const opt = options2[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    const isVFor = rawRef.f;
    if (_isString || _isRef) {
      const doSet = () => {
        if (isVFor) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (isUnmount || isVFor) {
        doSet();
      } else {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options2) {
  return baseCreateRenderer(options2);
}
function baseCreateRenderer(options2, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options2;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          namespace
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                namespace,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        namespace
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove222 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove222();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove222, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove22(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove22 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  let isFlushing2 = false;
  const render3 = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove22,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options2
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render: render3,
    hydrate,
    createApp: createAppAPI(render3, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  name: "Teleport",
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert: insert2, querySelector, createText, createComment }
    } = internals;
    const disabled2 = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert2(placeholder, container, anchor);
      insert2(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert2(targetAnchor, target);
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled2) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      if (namespace === "svg" || isTargetSVG(target)) {
        namespace = "svg";
      } else if (namespace === "mathml" || isTargetMathML(target)) {
        namespace = "mathml";
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          false
        );
      }
      if (disabled2) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        } else {
          if (n2.props && n1.props && n2.props.to !== n1.props.to) {
            n2.props.to = n1.props.to;
          }
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    doRemove && hostRemove(anchor);
    if (shapeFlag & 16) {
      const shouldRemove = doRemove || !isTeleportDisabled(props);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        unmount(
          child,
          parentComponent,
          parentSuspense,
          shouldRemove,
          !!child.dynamicChildren
        );
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert: insert2 }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert2(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert2(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert2(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(
          targetNode,
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node && node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref3, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key]))
      setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1)
        setters.forEach((set2) => set2(v));
      else
        setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful2 = isStatefulComponent(instance);
  initProps(instance, props, isStateful2, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful2 ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.4.15";
/**
* @vue/runtime-dom v3.4.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const TRANSITION = "transition";
const ANIMATION = "animation";
const vtcKey = Symbol("_vtc");
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el[vtcKey] = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  if (s === "auto")
    return 0;
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOldKey = Symbol("_vod");
const CSS_VAR_TEXT = Symbol("");
function patchStyle(el, prev, next) {
  const style = el.style;
  const currentDisplay = style.display;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOldKey in el) {
    style.display = currentDisplay;
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event2, handler7, options2) {
  el.addEventListener(event2, handler7, options2);
}
function removeEventListener(el, event2, handler7, options2) {
  el.removeEventListener(event2, handler7, options2);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options2] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options2);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options2);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options2;
  if (optionsModifierRE.test(name)) {
    options2 = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options2[m[0].toLowerCase()] = true;
    }
  }
  const event2 = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event2, options2];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event2, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event2, modifiers))
        return;
    }
    return fn(event2, ...args);
  });
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event2) => {
    if (!("key" in event2)) {
      return;
    }
    const eventKey = hyphenate(event2.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event2);
    }
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
function _createForOfIteratorHelper$1$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$3$1(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _toConsumableArray$3$1(arr) {
  return _arrayWithoutHoles$3$1(arr) || _iterableToArray$3$1(arr) || _unsupportedIterableToArray$3$1(arr) || _nonIterableSpread$3$1();
}
function _nonIterableSpread$3$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$3$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$3$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$3$1(arr);
}
function _typeof$3$1(o) {
  "@babel/helpers - typeof";
  return _typeof$3$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$3$1(o);
}
function _slicedToArray$1$1(arr, i) {
  return _arrayWithHoles$1$1(arr) || _iterableToArrayLimit$1$1(arr, i) || _unsupportedIterableToArray$3$1(arr, i) || _nonIterableRest$1$1();
}
function _nonIterableRest$1$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$3$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$3$1(o, minLen);
}
function _arrayLikeToArray$3$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$1$1(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$1$1(arr) {
  if (Array.isArray(arr))
    return arr;
}
var DomHandler = {
  innerWidth: function innerWidth(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style = getComputedStyle(el);
      width2 += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width2;
    }
    return 0;
  },
  width: function width(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style = getComputedStyle(el);
      width2 -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width2;
    }
    return 0;
  },
  getWindowScrollTop: function getWindowScrollTop() {
    var doc2 = document.documentElement;
    return (window.pageYOffset || doc2.scrollTop) - (doc2.clientTop || 0);
  },
  getWindowScrollLeft: function getWindowScrollLeft() {
    var doc2 = document.documentElement;
    return (window.pageXOffset || doc2.scrollLeft) - (doc2.clientLeft || 0);
  },
  getOuterWidth: function getOuterWidth(el, margin) {
    if (el) {
      var width2 = el.offsetWidth;
      if (margin) {
        var style = getComputedStyle(el);
        width2 += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }
      return width2;
    }
    return 0;
  },
  getOuterHeight: function getOuterHeight(el, margin) {
    if (el) {
      var height = el.offsetHeight;
      if (margin) {
        var style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getClientHeight: function getClientHeight(el, margin) {
    if (el) {
      var height = el.clientHeight;
      if (margin) {
        var style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getViewport: function getViewport() {
    var win = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h2 = win.innerHeight || e.clientHeight || g.clientHeight;
    return {
      width: w,
      height: h2
    };
  },
  getOffset: function getOffset(el) {
    if (el) {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
      };
    }
    return {
      top: "auto",
      left: "auto"
    };
  },
  index: function index(element) {
    if (element) {
      var _this$getParentNode;
      var children = (_this$getParentNode = this.getParentNode(element)) === null || _this$getParentNode === void 0 ? void 0 : _this$getParentNode.childNodes;
      var num = 0;
      for (var i = 0; i < children.length; i++) {
        if (children[i] === element)
          return num;
        if (children[i].nodeType === 1)
          num++;
      }
    }
    return -1;
  },
  addMultipleClasses: function addMultipleClasses(element, classNames) {
    var _this = this;
    if (element && classNames) {
      [classNames].flat().filter(Boolean).forEach(function(cNames) {
        return cNames.split(" ").forEach(function(className) {
          return _this.addClass(element, className);
        });
      });
    }
  },
  removeMultipleClasses: function removeMultipleClasses(element, classNames) {
    var _this2 = this;
    if (element && classNames) {
      [classNames].flat().filter(Boolean).forEach(function(cNames) {
        return cNames.split(" ").forEach(function(className) {
          return _this2.removeClass(element, className);
        });
      });
    }
  },
  addClass: function addClass(element, className) {
    if (element && className && !this.hasClass(element, className)) {
      if (element.classList)
        element.classList.add(className);
      else
        element.className += " " + className;
    }
  },
  removeClass: function removeClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.remove(className);
      else
        element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  },
  hasClass: function hasClass(element, className) {
    if (element) {
      if (element.classList)
        return element.classList.contains(className);
      else
        return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
    }
    return false;
  },
  addStyles: function addStyles(element) {
    var styles = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (element) {
      Object.entries(styles).forEach(function(_ref) {
        var _ref2 = _slicedToArray$1$1(_ref, 2), key = _ref2[0], value = _ref2[1];
        return element.style[key] = value;
      });
    }
  },
  find: function find(element, selector) {
    return this.isElement(element) ? element.querySelectorAll(selector) : [];
  },
  findSingle: function findSingle(element, selector) {
    return this.isElement(element) ? element.querySelector(selector) : null;
  },
  createElement: function createElement(type) {
    var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (type) {
      var element = document.createElement(type);
      this.setAttributes(element, attributes);
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      element.append.apply(element, children);
      return element;
    }
    return void 0;
  },
  setAttribute: function setAttribute(element) {
    var attribute = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var value = arguments.length > 2 ? arguments[2] : void 0;
    if (this.isElement(element) && value !== null && value !== void 0) {
      element.setAttribute(attribute, value);
    }
  },
  setAttributes: function setAttributes(element) {
    var _this3 = this;
    var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.isElement(element)) {
      var computedStyles = function computedStyles2(rule, value) {
        var _element$$attrs, _element$$attrs2;
        var styles = element !== null && element !== void 0 && (_element$$attrs = element.$attrs) !== null && _element$$attrs !== void 0 && _element$$attrs[rule] ? [element === null || element === void 0 || (_element$$attrs2 = element.$attrs) === null || _element$$attrs2 === void 0 ? void 0 : _element$$attrs2[rule]] : [];
        return [value].flat().reduce(function(cv, v) {
          if (v !== null && v !== void 0) {
            var type = _typeof$3$1(v);
            if (type === "string" || type === "number") {
              cv.push(v);
            } else if (type === "object") {
              var _cv = Array.isArray(v) ? computedStyles2(rule, v) : Object.entries(v).map(function(_ref3) {
                var _ref4 = _slicedToArray$1$1(_ref3, 2), _k = _ref4[0], _v = _ref4[1];
                return rule === "style" && (!!_v || _v === 0) ? "".concat(_k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), ":").concat(_v) : !!_v ? _k : void 0;
              });
              cv = _cv.length ? cv.concat(_cv.filter(function(c) {
                return !!c;
              })) : cv;
            }
          }
          return cv;
        }, styles);
      };
      Object.entries(attributes).forEach(function(_ref5) {
        var _ref6 = _slicedToArray$1$1(_ref5, 2), key = _ref6[0], value = _ref6[1];
        if (value !== void 0 && value !== null) {
          var matchedEvent = key.match(/^on(.+)/);
          if (matchedEvent) {
            element.addEventListener(matchedEvent[1].toLowerCase(), value);
          } else if (key === "p-bind") {
            _this3.setAttributes(element, value);
          } else {
            value = key === "class" ? _toConsumableArray$3$1(new Set(computedStyles("class", value))).join(" ").trim() : key === "style" ? computedStyles("style", value).join(";").trim() : value;
            (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
            element.setAttribute(key, value);
          }
        }
      });
    }
  },
  getAttribute: function getAttribute(element, name) {
    if (this.isElement(element)) {
      var value = element.getAttribute(name);
      if (!isNaN(value)) {
        return +value;
      }
      if (value === "true" || value === "false") {
        return value === "true";
      }
      return value;
    }
    return void 0;
  },
  isAttributeEquals: function isAttributeEquals(element, name, value) {
    return this.isElement(element) ? this.getAttribute(element, name) === value : false;
  },
  isAttributeNotEquals: function isAttributeNotEquals(element, name, value) {
    return !this.isAttributeEquals(element, name, value);
  },
  getHeight: function getHeight(el) {
    if (el) {
      var height = el.offsetHeight;
      var style = getComputedStyle(el);
      height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      return height;
    }
    return 0;
  },
  getWidth: function getWidth(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style = getComputedStyle(el);
      width2 -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      return width2;
    }
    return 0;
  },
  absolutePosition: function absolutePosition(element, target) {
    var gutter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    if (element) {
      var elementDimensions = element.offsetParent ? {
        width: element.offsetWidth,
        height: element.offsetHeight
      } : this.getHiddenElementDimensions(element);
      var elementOuterHeight = elementDimensions.height;
      var elementOuterWidth = elementDimensions.width;
      var targetOuterHeight = target.offsetHeight;
      var targetOuterWidth = target.offsetWidth;
      var targetOffset = target.getBoundingClientRect();
      var windowScrollTop = this.getWindowScrollTop();
      var windowScrollLeft = this.getWindowScrollLeft();
      var viewport = this.getViewport();
      var top, left, origin = "top";
      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        top = targetOffset.top + windowScrollTop - elementOuterHeight;
        origin = "bottom";
        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
      }
      if (targetOffset.left + elementOuterWidth > viewport.width)
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      else
        left = targetOffset.left + windowScrollLeft;
      element.style.top = top + "px";
      element.style.left = left + "px";
      element.style.transformOrigin = origin;
      gutter && (element.style.marginTop = origin === "bottom" ? "calc(var(--p-anchor-gutter) * -1)" : "calc(var(--p-anchor-gutter))");
    }
  },
  relativePosition: function relativePosition(element, target) {
    var gutter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    if (element) {
      var elementDimensions = element.offsetParent ? {
        width: element.offsetWidth,
        height: element.offsetHeight
      } : this.getHiddenElementDimensions(element);
      var targetHeight = target.offsetHeight;
      var targetOffset = target.getBoundingClientRect();
      var viewport = this.getViewport();
      var top, left, origin = "top";
      if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
        top = -1 * elementDimensions.height;
        origin = "bottom";
        if (targetOffset.top + top < 0) {
          top = -1 * targetOffset.top;
        }
      } else {
        top = targetHeight;
      }
      if (elementDimensions.width > viewport.width) {
        left = targetOffset.left * -1;
      } else if (targetOffset.left + elementDimensions.width > viewport.width) {
        left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
      } else {
        left = 0;
      }
      element.style.top = top + "px";
      element.style.left = left + "px";
      element.style.transformOrigin = origin;
      gutter && (element.style.marginTop = origin === "bottom" ? "calc(var(--p-anchor-gutter) * -1)" : "calc(var(--p-anchor-gutter))");
    }
  },
  nestedPosition: function nestedPosition(element, level) {
    if (element) {
      var parentItem = element.parentElement;
      var elementOffset = this.getOffset(parentItem);
      var viewport = this.getViewport();
      var sublistWidth = element.offsetParent ? element.offsetWidth : this.getHiddenElementOuterWidth(element);
      var itemOuterWidth = this.getOuterWidth(parentItem.children[0]);
      var left;
      if (parseInt(elementOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - this.calculateScrollbarWidth()) {
        if (parseInt(elementOffset.left, 10) < sublistWidth) {
          if (level % 2 === 1) {
            left = parseInt(elementOffset.left, 10) ? "-" + parseInt(elementOffset.left, 10) + "px" : "100%";
          } else if (level % 2 === 0) {
            left = viewport.width - sublistWidth - this.calculateScrollbarWidth() + "px";
          }
        } else {
          left = "-100%";
        }
      } else {
        left = "100%";
      }
      element.style.top = "0px";
      element.style.left = left;
    }
  },
  getParentNode: function getParentNode(element) {
    var parent = element === null || element === void 0 ? void 0 : element.parentNode;
    if (parent && parent instanceof ShadowRoot && parent.host) {
      parent = parent.host;
    }
    return parent;
  },
  getParents: function getParents(element) {
    var parents = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    var parent = this.getParentNode(element);
    return parent === null ? parents : this.getParents(parent, parents.concat([parent]));
  },
  getScrollableParents: function getScrollableParents(element) {
    var scrollableParents = [];
    if (element) {
      var parents = this.getParents(element);
      var overflowRegex = /(auto|scroll)/;
      var overflowCheck = function overflowCheck2(node) {
        try {
          var styleDeclaration = window["getComputedStyle"](node, null);
          return overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
        } catch (err) {
          return false;
        }
      };
      var _iterator = _createForOfIteratorHelper$1$1(parents), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var parent = _step.value;
          var scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
          if (scrollSelectors) {
            var selectors = scrollSelectors.split(",");
            var _iterator2 = _createForOfIteratorHelper$1$1(selectors), _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                var selector = _step2.value;
                var el = this.findSingle(parent, selector);
                if (el && overflowCheck(el)) {
                  scrollableParents.push(el);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
          if (parent.nodeType !== 9 && overflowCheck(parent)) {
            scrollableParents.push(parent);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return scrollableParents;
  },
  getHiddenElementOuterHeight: function getHiddenElementOuterHeight(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      var elementHeight = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementHeight;
    }
    return 0;
  },
  getHiddenElementOuterWidth: function getHiddenElementOuterWidth(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      var elementWidth = element.offsetWidth;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementWidth;
    }
    return 0;
  },
  getHiddenElementDimensions: function getHiddenElementDimensions(element) {
    if (element) {
      var dimensions = {};
      element.style.visibility = "hidden";
      element.style.display = "block";
      dimensions.width = element.offsetWidth;
      dimensions.height = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return dimensions;
    }
    return 0;
  },
  fadeIn: function fadeIn(element, duration) {
    if (element) {
      element.style.opacity = 0;
      var last = +/* @__PURE__ */ new Date();
      var opacity = 0;
      var tick = function tick2() {
        opacity = +element.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - last) / duration;
        element.style.opacity = opacity;
        last = +/* @__PURE__ */ new Date();
        if (+opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick2) || setTimeout(tick2, 16);
        }
      };
      tick();
    }
  },
  fadeOut: function fadeOut(element, ms) {
    if (element) {
      var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
      var fading = setInterval(function() {
        opacity -= gap;
        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fading);
        }
        element.style.opacity = opacity;
      }, interval);
    }
  },
  getUserAgent: function getUserAgent() {
    return navigator.userAgent;
  },
  appendChild: function appendChild(element, target) {
    if (this.isElement(target))
      target.appendChild(element);
    else if (target.el && target.elElement)
      target.elElement.appendChild(element);
    else
      throw new Error("Cannot append " + target + " to " + element);
  },
  isElement: function isElement(obj) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof$3$1(HTMLElement)) === "object" ? obj instanceof HTMLElement : obj && _typeof$3$1(obj) === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
  },
  scrollInView: function scrollInView(container, item2) {
    var borderTopValue = getComputedStyle(container).getPropertyValue("borderTopWidth");
    var borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    var paddingTopValue = getComputedStyle(container).getPropertyValue("paddingTop");
    var paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    var containerRect = container.getBoundingClientRect();
    var itemRect = item2.getBoundingClientRect();
    var offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    var scroll = container.scrollTop;
    var elementHeight = container.clientHeight;
    var itemHeight = this.getOuterHeight(item2);
    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  },
  clearSelection: function clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
        window.getSelection().removeAllRanges();
      }
    } else if (document["selection"] && document["selection"].empty) {
      try {
        document["selection"].empty();
      } catch (error) {
      }
    }
  },
  getSelection: function getSelection() {
    if (window.getSelection)
      return window.getSelection().toString();
    else if (document.getSelection)
      return document.getSelection().toString();
    else if (document["selection"])
      return document["selection"].createRange().text;
    return null;
  },
  calculateScrollbarWidth: function calculateScrollbarWidth() {
    if (this.calculatedScrollbarWidth != null)
      return this.calculatedScrollbarWidth;
    var scrollDiv = document.createElement("div");
    this.addStyles(scrollDiv, {
      width: "100px",
      height: "100px",
      overflow: "scroll",
      position: "absolute",
      top: "-9999px"
    });
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    this.calculatedScrollbarWidth = scrollbarWidth;
    return scrollbarWidth;
  },
  calculateBodyScrollbarWidth: function calculateBodyScrollbarWidth() {
    return window.innerWidth - document.documentElement.offsetWidth;
  },
  getBrowser: function getBrowser() {
    if (!this.browser) {
      var matched = this.resolveUserAgent();
      this.browser = {};
      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser["version"] = matched.version;
      }
      if (this.browser["chrome"]) {
        this.browser["webkit"] = true;
      } else if (this.browser["webkit"]) {
        this.browser["safari"] = true;
      }
    }
    return this.browser;
  },
  resolveUserAgent: function resolveUserAgent() {
    var ua = navigator.userAgent.toLowerCase();
    var match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  },
  isVisible: function isVisible(element) {
    return element && element.offsetParent != null;
  },
  invokeElementMethod: function invokeElementMethod(element, methodName, args) {
    element[methodName].apply(element, args);
  },
  isExist: function isExist(element) {
    return !!(element !== null && typeof element !== "undefined" && element.nodeName && this.getParentNode(element));
  },
  isClient: function isClient() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  },
  focus: function focus(el, options2) {
    el && document.activeElement !== el && el.focus(options2);
  },
  isFocusableElement: function isFocusableElement(element) {
    var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.isElement(element) ? element.matches('button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector)) : false;
  },
  getFocusableElements: function getFocusableElements(element) {
    var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var focusableElements = this.find(element, 'button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector));
    var visibleFocusableElements = [];
    var _iterator3 = _createForOfIteratorHelper$1$1(focusableElements), _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
        var focusableElement = _step3.value;
        if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
          visibleFocusableElements.push(focusableElement);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return visibleFocusableElements;
  },
  getFirstFocusableElement: function getFirstFocusableElement(element, selector) {
    var focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[0] : null;
  },
  getLastFocusableElement: function getLastFocusableElement(element, selector) {
    var focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
  },
  getNextFocusableElement: function getNextFocusableElement(container, element, selector) {
    var focusableElements = this.getFocusableElements(container, selector);
    var index2 = focusableElements.length > 0 ? focusableElements.findIndex(function(el) {
      return el === element;
    }) : -1;
    var nextIndex = index2 > -1 && focusableElements.length >= index2 + 1 ? index2 + 1 : -1;
    return nextIndex > -1 ? focusableElements[nextIndex] : null;
  },
  getPreviousElementSibling: function getPreviousElementSibling(element, selector) {
    var previousElement = element.previousElementSibling;
    while (previousElement) {
      if (previousElement.matches(selector)) {
        return previousElement;
      } else {
        previousElement = previousElement.previousElementSibling;
      }
    }
    return null;
  },
  getNextElementSibling: function getNextElementSibling(element, selector) {
    var nextElement = element.nextElementSibling;
    while (nextElement) {
      if (nextElement.matches(selector)) {
        return nextElement;
      } else {
        nextElement = nextElement.nextElementSibling;
      }
    }
    return null;
  },
  isClickable: function isClickable(element) {
    if (element) {
      var targetNode = element.nodeName;
      var parentNode = element.parentElement && element.parentElement.nodeName;
      return targetNode === "INPUT" || targetNode === "TEXTAREA" || targetNode === "BUTTON" || targetNode === "A" || parentNode === "INPUT" || parentNode === "TEXTAREA" || parentNode === "BUTTON" || parentNode === "A" || !!element.closest(".p-button, .p-checkbox, .p-radiobutton");
    }
    return false;
  },
  applyStyle: function applyStyle(element, style) {
    if (typeof style === "string") {
      element.style.cssText = style;
    } else {
      for (var prop in style) {
        element.style[prop] = style[prop];
      }
    }
  },
  isIOS: function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
  },
  isAndroid: function isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  },
  isTouchDevice: function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  },
  hasCSSAnimation: function hasCSSAnimation(element) {
    if (element) {
      var style = getComputedStyle(element);
      var animationDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
      return animationDuration > 0;
    }
    return false;
  },
  hasCSSTransition: function hasCSSTransition(element) {
    if (element) {
      var style = getComputedStyle(element);
      var transitionDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
      return transitionDuration > 0;
    }
    return false;
  },
  exportCSV: function exportCSV(csv, filename) {
    var blob = new Blob([csv], {
      type: "application/csv;charset=utf-8;"
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename + ".csv");
    } else {
      var link = document.createElement("a");
      if (link.download !== void 0) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ".csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        csv = "data:text/csv;charset=utf-8," + csv;
        window.open(encodeURI(csv));
      }
    }
  },
  blockBodyScroll: function blockBodyScroll() {
    var className = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "p-overflow-hidden";
    document.body.style.setProperty("--scrollbar-width", this.calculateBodyScrollbarWidth() + "px");
    this.addClass(document.body, className);
  },
  unblockBodyScroll: function unblockBodyScroll() {
    var className = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "p-overflow-hidden";
    document.body.style.removeProperty("--scrollbar-width");
    this.removeClass(document.body, className);
  }
};
function _typeof$2$1(o) {
  "@babel/helpers - typeof";
  return _typeof$2$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$2$1(o);
}
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey$1$3(descriptor.key), descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties$1(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _toPropertyKey$1$3(t) {
  var i = _toPrimitive$1$3(t, "string");
  return "symbol" == _typeof$2$1(i) ? i : String(i);
}
function _toPrimitive$1$3(t, r) {
  if ("object" != _typeof$2$1(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$2$1(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var ConnectedOverlayScrollHandler = /* @__PURE__ */ function() {
  function ConnectedOverlayScrollHandler2(element) {
    var listener = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    _classCallCheck$1(this, ConnectedOverlayScrollHandler2);
    this.element = element;
    this.listener = listener;
  }
  _createClass$1(ConnectedOverlayScrollHandler2, [{
    key: "bindScrollListener",
    value: function bindScrollListener3() {
      this.scrollableParents = DomHandler.getScrollableParents(this.element);
      for (var i = 0; i < this.scrollableParents.length; i++) {
        this.scrollableParents[i].addEventListener("scroll", this.listener);
      }
    }
  }, {
    key: "unbindScrollListener",
    value: function unbindScrollListener3() {
      if (this.scrollableParents) {
        for (var i = 0; i < this.scrollableParents.length; i++) {
          this.scrollableParents[i].removeEventListener("scroll", this.listener);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.unbindScrollListener();
      this.element = null;
      this.listener = null;
      this.scrollableParents = null;
    }
  }]);
  return ConnectedOverlayScrollHandler2;
}();
function primebus() {
  var allHandlers = /* @__PURE__ */ new Map();
  return {
    on: function on(type, handler7) {
      var handlers = allHandlers.get(type);
      if (!handlers)
        handlers = [handler7];
      else
        handlers.push(handler7);
      allHandlers.set(type, handlers);
    },
    off: function off(type, handler7) {
      var handlers = allHandlers.get(type);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler7) >>> 0, 1);
      }
    },
    emit: function emit2(type, evt) {
      var handlers = allHandlers.get(type);
      if (handlers) {
        handlers.slice().map(function(handler7) {
          handler7(evt);
        });
      }
    }
  };
}
function _slicedToArray$4(arr, i) {
  return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$2$1(arr, i) || _nonIterableRest$4();
}
function _nonIterableRest$4() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit$4(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$4(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _toConsumableArray$2$1(arr) {
  return _arrayWithoutHoles$2$1(arr) || _iterableToArray$2$1(arr) || _unsupportedIterableToArray$2$1(arr) || _nonIterableSpread$2$1();
}
function _nonIterableSpread$2$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$2$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$2$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$2$1(arr);
}
function _createForOfIteratorHelper$3(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$2$1(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$2$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$2$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2$1(o, minLen);
}
function _arrayLikeToArray$2$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _typeof$1$3(o) {
  "@babel/helpers - typeof";
  return _typeof$1$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1$3(o);
}
var ObjectUtils = {
  equals: function equals(obj1, obj2, field2) {
    if (field2)
      return this.resolveFieldData(obj1, field2) === this.resolveFieldData(obj2, field2);
    else
      return this.deepEquals(obj1, obj2);
  },
  deepEquals: function deepEquals(a, b) {
    if (a === b)
      return true;
    if (a && b && _typeof$1$3(a) == "object" && _typeof$1$3(b) == "object") {
      var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
      if (arrA && arrB) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!this.deepEquals(a[i], b[i]))
            return false;
        return true;
      }
      if (arrA != arrB)
        return false;
      var dateA = a instanceof Date, dateB = b instanceof Date;
      if (dateA != dateB)
        return false;
      if (dateA && dateB)
        return a.getTime() == b.getTime();
      var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
      if (regexpA != regexpB)
        return false;
      if (regexpA && regexpB)
        return a.toString() == b.toString();
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!this.deepEquals(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  },
  resolveFieldData: function resolveFieldData(data17, field2) {
    if (!data17 || !field2) {
      return null;
    }
    try {
      var value = data17[field2];
      if (this.isNotEmpty(value))
        return value;
    } catch (_unused) {
    }
    if (Object.keys(data17).length) {
      if (this.isFunction(field2)) {
        return field2(data17);
      } else if (field2.indexOf(".") === -1) {
        return data17[field2];
      } else {
        var fields = field2.split(".");
        var _value = data17;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (_value == null) {
            return null;
          }
          _value = _value[fields[i]];
        }
        return _value;
      }
    }
    return null;
  },
  getItemValue: function getItemValue(obj) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
  },
  filter: function filter(value, fields, filterValue) {
    var filteredItems = [];
    if (value) {
      var _iterator = _createForOfIteratorHelper$3(value), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var item2 = _step.value;
          var _iterator2 = _createForOfIteratorHelper$3(fields), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var field2 = _step2.value;
              if (String(this.resolveFieldData(item2, field2)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                filteredItems.push(item2);
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return filteredItems;
  },
  reorderArray: function reorderArray(value, from, to) {
    if (value && from !== to) {
      if (to >= value.length) {
        to %= value.length;
        from %= value.length;
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  },
  findIndexInList: function findIndexInList(value, list) {
    var index2 = -1;
    if (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === value) {
          index2 = i;
          break;
        }
      }
    }
    return index2;
  },
  contains: function contains(value, list) {
    if (value != null && list && list.length) {
      var _iterator3 = _createForOfIteratorHelper$3(list), _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
          var val = _step3.value;
          if (this.equals(value, val))
            return true;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return false;
  },
  insertIntoOrderedArray: function insertIntoOrderedArray(item2, index2, arr, sourceArr) {
    if (arr.length > 0) {
      var injected = false;
      for (var i = 0; i < arr.length; i++) {
        var currentItemIndex = this.findIndexInList(arr[i], sourceArr);
        if (currentItemIndex > index2) {
          arr.splice(i, 0, item2);
          injected = true;
          break;
        }
      }
      if (!injected) {
        arr.push(item2);
      }
    } else {
      arr.push(item2);
    }
  },
  removeAccents: function removeAccents(str) {
    if (str && str.search(/[\xC0-\xFF]/g) > -1) {
      str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
    }
    return str;
  },
  getVNodeProp: function getVNodeProp(vnode, prop) {
    if (vnode) {
      var props = vnode.props;
      if (props) {
        var kebabProp = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        var propName = Object.prototype.hasOwnProperty.call(props, kebabProp) ? kebabProp : prop;
        return vnode.type["extends"].props[prop].type === Boolean && props[propName] === "" ? true : props[propName];
      }
    }
    return null;
  },
  toFlatCase: function toFlatCase(str) {
    return this.isString(str) ? str.replace(/(-|_)/g, "").toLowerCase() : str;
  },
  toKebabCase: function toKebabCase(str) {
    return this.isString(str) ? str.replace(/(_)/g, "-").replace(/[A-Z]/g, function(c, i) {
      return i === 0 ? c : "-" + c.toLowerCase();
    }).toLowerCase() : str;
  },
  toCapitalCase: function toCapitalCase(str) {
    return this.isString(str, {
      empty: false
    }) ? str[0].toUpperCase() + str.slice(1) : str;
  },
  isEmpty: function isEmpty(value) {
    return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && _typeof$1$3(value) === "object" && Object.keys(value).length === 0;
  },
  isNotEmpty: function isNotEmpty(value) {
    return !this.isEmpty(value);
  },
  isFunction: function isFunction2(value) {
    return !!(value && value.constructor && value.call && value.apply);
  },
  isObject: function isObject2(value) {
    var empty3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return value instanceof Object && value.constructor === Object && (empty3 || Object.keys(value).length !== 0);
  },
  isDate: function isDate(value) {
    return value instanceof Date && value.constructor === Date;
  },
  isArray: function isArray(value) {
    var empty3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return Array.isArray(value) && (empty3 || value.length !== 0);
  },
  isString: function isString2(value) {
    var empty3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return typeof value === "string" && (empty3 || value !== "");
  },
  isPrintableCharacter: function isPrintableCharacter() {
    var _char = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return this.isNotEmpty(_char) && _char.length === 1 && _char.match(/\S| /);
  },
  /**
   * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlast
   */
  findLast: function findLast(arr, callback) {
    var item2;
    if (this.isNotEmpty(arr)) {
      try {
        item2 = arr.findLast(callback);
      } catch (_unused2) {
        item2 = _toConsumableArray$2$1(arr).reverse().find(callback);
      }
    }
    return item2;
  },
  /**
   * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
   */
  findLastIndex: function findLastIndex(arr, callback) {
    var index2 = -1;
    if (this.isNotEmpty(arr)) {
      try {
        index2 = arr.findLastIndex(callback);
      } catch (_unused3) {
        index2 = arr.lastIndexOf(_toConsumableArray$2$1(arr).reverse().find(callback));
      }
    }
    return index2;
  },
  sort: function sort(value1, value2) {
    var order = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    var comparator2 = arguments.length > 3 ? arguments[3] : void 0;
    var nullSortOrder2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 1;
    var result = this.compare(value1, value2, comparator2, order);
    var finalSortOrder = order;
    if (this.isEmpty(value1) || this.isEmpty(value2)) {
      finalSortOrder = nullSortOrder2 === 1 ? order : nullSortOrder2;
    }
    return finalSortOrder * result;
  },
  compare: function compare(value1, value2, comparator2) {
    var order = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
    var result = -1;
    var emptyValue1 = this.isEmpty(value1);
    var emptyValue2 = this.isEmpty(value2);
    if (emptyValue1 && emptyValue2)
      result = 0;
    else if (emptyValue1)
      result = order;
    else if (emptyValue2)
      result = -order;
    else if (typeof value1 === "string" && typeof value2 === "string")
      result = comparator2(value1, value2);
    else
      result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
    return result;
  },
  localeComparator: function localeComparator() {
    return new Intl.Collator(void 0, {
      numeric: true
    }).compare;
  },
  nestedKeys: function nestedKeys() {
    var _this = this;
    var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var parentKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return Object.entries(obj).reduce(function(o, _ref) {
      var _ref2 = _slicedToArray$4(_ref, 2), key = _ref2[0], value = _ref2[1];
      var currentKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;
      _this.isObject(value) ? o = o.concat(_this.nestedKeys(value, currentKey)) : o.push(currentKey);
      return o;
    }, []);
  },
  stringify: function stringify(value) {
    var _this2 = this;
    var indent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    var currentIndent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    var currentIndentStr = " ".repeat(currentIndent);
    var nextIndentStr = " ".repeat(currentIndent + indent);
    if (this.isArray(value)) {
      return "[" + value.map(function(v) {
        return _this2.stringify(v, indent, currentIndent + indent);
      }).join(", ") + "]";
    } else if (this.isDate(value)) {
      return value.toISOString();
    } else if (this.isFunction(value)) {
      return value.toString();
    } else if (this.isObject(value)) {
      return "{\n" + Object.entries(value).map(function(_ref3) {
        var _ref4 = _slicedToArray$4(_ref3, 2), k = _ref4[0], v = _ref4[1];
        return "".concat(nextIndentStr).concat(k, ": ").concat(_this2.stringify(v, indent, currentIndent + indent));
      }).join(",\n") + "\n".concat(currentIndentStr) + "}";
    } else {
      return JSON.stringify(value);
    }
  }
};
function _typeof$p(o) {
  "@babel/helpers - typeof";
  return _typeof$p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$p(o);
}
function _toConsumableArray$1$1(arr) {
  return _arrayWithoutHoles$1$1(arr) || _iterableToArray$1$1(arr) || _unsupportedIterableToArray$1$1(arr) || _nonIterableSpread$1$1();
}
function _nonIterableSpread$1$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1$1(o, minLen);
}
function _iterableToArray$1$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$1$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$1$1(arr);
}
function _arrayLikeToArray$1$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey$o(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _defineProperty$o(obj, key, value) {
  key = _toPropertyKey$o(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$o(t) {
  var i = _toPrimitive$o(t, "string");
  return "symbol" == _typeof$p(i) ? i : String(i);
}
function _toPrimitive$o(t, r) {
  if ("object" != _typeof$p(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$p(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _default = /* @__PURE__ */ function() {
  function _default2(_ref) {
    var init2 = _ref.init, type = _ref.type;
    _classCallCheck(this, _default2);
    _defineProperty$o(this, "helpers", void 0);
    _defineProperty$o(this, "type", void 0);
    this.helpers = new Set(init2);
    this.type = type;
  }
  _createClass(_default2, [{
    key: "add",
    value: function add2(instance) {
      this.helpers.add(instance);
    }
  }, {
    key: "update",
    value: function update() {
    }
  }, {
    key: "delete",
    value: function _delete(instance) {
      this.helpers["delete"](instance);
    }
  }, {
    key: "clear",
    value: function clear2() {
      this.helpers.clear();
    }
  }, {
    key: "get",
    value: function get2(parentInstance, slots) {
      var children = this._get(parentInstance, slots);
      var computed2 = children ? this._recursive(_toConsumableArray$1$1(this.helpers), children) : null;
      return ObjectUtils.isNotEmpty(computed2) ? computed2 : null;
    }
  }, {
    key: "_isMatched",
    value: function _isMatched(instance, key) {
      var _parent$vnode;
      var parent = instance === null || instance === void 0 ? void 0 : instance.parent;
      return (parent === null || parent === void 0 || (_parent$vnode = parent.vnode) === null || _parent$vnode === void 0 ? void 0 : _parent$vnode.key) === key || parent && this._isMatched(parent, key) || false;
    }
  }, {
    key: "_get",
    value: function _get(parentInstance, slots) {
      var _ref2, _ref2$default;
      return ((_ref2 = slots || (parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$slots)) === null || _ref2 === void 0 || (_ref2$default = _ref2["default"]) === null || _ref2$default === void 0 ? void 0 : _ref2$default.call(_ref2)) || null;
    }
  }, {
    key: "_recursive",
    value: function _recursive() {
      var _this = this;
      var helpers = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      var children = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      var components = [];
      children.forEach(function(child) {
        if (child.children instanceof Array) {
          components = components.concat(_this._recursive(components, child.children));
        } else if (child.type.name === _this.type) {
          components.push(child);
        } else if (ObjectUtils.isNotEmpty(child.key)) {
          components = components.concat(helpers.filter(function(c) {
            return _this._isMatched(c, child.key);
          }).map(function(c) {
            return c.vnode;
          }));
        }
      });
      return components;
    }
  }]);
  return _default2;
}();
var lastId = 0;
function UniqueComponentId() {
  var prefix2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pv_id_";
  lastId++;
  return "".concat(prefix2).concat(lastId);
}
function _toConsumableArray$6(arr) {
  return _arrayWithoutHoles$6(arr) || _iterableToArray$6(arr) || _unsupportedIterableToArray$a(arr) || _nonIterableSpread$6();
}
function _nonIterableSpread$6() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$a(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$a(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$a(o, minLen);
}
function _iterableToArray$6(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$6(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$a(arr);
}
function _arrayLikeToArray$a(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function handler() {
  var zIndexes = [];
  var generateZIndex = function generateZIndex2(key, autoZIndex) {
    var baseZIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 999;
    var lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
    var newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
    zIndexes.push({
      key,
      value: newZIndex
    });
    return newZIndex;
  };
  var revertZIndex = function revertZIndex2(zIndex) {
    zIndexes = zIndexes.filter(function(obj) {
      return obj.value !== zIndex;
    });
  };
  var getCurrentZIndex = function getCurrentZIndex2(key, autoZIndex) {
    return getLastZIndex(key, autoZIndex).value;
  };
  var getLastZIndex = function getLastZIndex2(key, autoZIndex) {
    var baseZIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    return _toConsumableArray$6(zIndexes).reverse().find(function(obj) {
      return autoZIndex ? true : obj.key === key;
    }) || {
      key,
      value: baseZIndex
    };
  };
  var getZIndex = function getZIndex2(el) {
    return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
  };
  return {
    get: getZIndex,
    set: function set2(key, el, baseZIndex) {
      if (el) {
        el.style.zIndex = String(generateZIndex(key, true, baseZIndex));
      }
    },
    clear: function clear2(el) {
      if (el) {
        revertZIndex(getZIndex(el));
        el.style.zIndex = "";
      }
    },
    getCurrent: function getCurrent(key) {
      return getCurrentZIndex(key, true);
    }
  };
}
var ZIndexUtils = handler();
function _typeof$o(o) {
  "@babel/helpers - typeof";
  return _typeof$o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$o(o);
}
function ownKeys$l(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$l(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$l(Object(t), true).forEach(function(r2) {
      _defineProperty$n(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$l(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$n(obj, key, value) {
  key = _toPropertyKey$n(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$n(t) {
  var i = _toPrimitive$n(t, "string");
  return "symbol" == _typeof$o(i) ? i : String(i);
}
function _toPrimitive$n(t, r) {
  if ("object" != _typeof$o(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$o(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function tryOnMounted(fn) {
  var sync = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (getCurrentInstance())
    onMounted(fn);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
var _id = 0;
function useStyle(css2) {
  var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var isLoaded = ref(false);
  var cssRef = ref(css2);
  var styleRef = ref(null);
  var defaultDocument = DomHandler.isClient() ? window.document : void 0;
  var _options$document = options2.document, document2 = _options$document === void 0 ? defaultDocument : _options$document, _options$immediate = options2.immediate, immediate = _options$immediate === void 0 ? true : _options$immediate, _options$manual = options2.manual, manual = _options$manual === void 0 ? false : _options$manual, _options$name = options2.name, name = _options$name === void 0 ? "style_".concat(++_id) : _options$name, _options$id = options2.id, id = _options$id === void 0 ? void 0 : _options$id, _options$media = options2.media, media = _options$media === void 0 ? void 0 : _options$media, _options$nonce = options2.nonce, nonce = _options$nonce === void 0 ? void 0 : _options$nonce, _options$props = options2.props, props = _options$props === void 0 ? {} : _options$props;
  var stop = function stop2() {
  };
  var load = function load2(_css) {
    var _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!document2)
      return;
    var _styleProps = _objectSpread$l(_objectSpread$l({}, props), _props);
    var _name = _styleProps.name || name, _id2 = _styleProps.id || id, _nonce = _styleProps.nonce || nonce;
    styleRef.value = document2.querySelector('style[data-primevue-style-id="'.concat(_name, '"]')) || document2.getElementById(_id2) || document2.createElement("style");
    if (!styleRef.value.isConnected) {
      cssRef.value = _css || css2;
      DomHandler.setAttributes(styleRef.value, {
        type: "text/css",
        id: _id2,
        media,
        nonce: _nonce
      });
      document2.head.appendChild(styleRef.value);
      DomHandler.setAttribute(styleRef.value, "data-primevue-style-id", name);
      DomHandler.setAttributes(styleRef.value, _styleProps);
    }
    if (isLoaded.value)
      return;
    stop = watch(cssRef, function(value) {
      styleRef.value.textContent = value;
    }, {
      immediate: true
    });
    isLoaded.value = true;
  };
  var unload = function unload2() {
    if (!document2 || !isLoaded.value)
      return;
    stop();
    DomHandler.isExist(styleRef.value) && document2.head.removeChild(styleRef.value);
    isLoaded.value = false;
  };
  if (immediate && !manual)
    tryOnMounted(load);
  return {
    id,
    name,
    css: cssRef,
    unload,
    load,
    isLoaded: readonly(isLoaded)
  };
}
function _typeof$n(o) {
  "@babel/helpers - typeof";
  return _typeof$n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$n(o);
}
function _slicedToArray$3(arr, i) {
  return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$9(arr, i) || _nonIterableRest$3();
}
function _nonIterableRest$3() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$9(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$9(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$9(o, minLen);
}
function _arrayLikeToArray$9(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$3(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$3(arr) {
  if (Array.isArray(arr))
    return arr;
}
function ownKeys$k(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$k(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$k(Object(t), true).forEach(function(r2) {
      _defineProperty$m(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$k(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$m(obj, key, value) {
  key = _toPropertyKey$m(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$m(t) {
  var i = _toPrimitive$m(t, "string");
  return "symbol" == _typeof$n(i) ? i : String(i);
}
function _toPrimitive$m(t, r) {
  if ("object" != _typeof$n(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$n(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var css$c = "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n}\n\n.p-hidden-accessible input,\n.p-hidden-accessible select {\n    transform: scale(0);\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n    padding-right: var(--scrollbar-width);\n}\n";
var classes$b = {};
var inlineStyles$2 = {};
var BaseStyle = {
  name: "base",
  css: css$c,
  classes: classes$b,
  inlineStyles: inlineStyles$2,
  loadStyle: function loadStyle() {
    var options2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.css ? useStyle(this.css, _objectSpread$k({
      name: this.name
    }, options2)) : {};
  },
  getStyleSheet: function getStyleSheet() {
    var extendedCSS = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var _props = Object.entries(props).reduce(function(acc, _ref) {
        var _ref2 = _slicedToArray$3(_ref, 2), k = _ref2[0], v = _ref2[1];
        return acc.push("".concat(k, '="').concat(v, '"')) && acc;
      }, []).join(" ");
      return '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(_props, ">").concat(this.css).concat(extendedCSS, "</style>");
    }
    return "";
  },
  extend: function extend2(style) {
    return _objectSpread$k(_objectSpread$k({}, this), {}, {
      css: void 0
    }, style);
  }
};
function _typeof$1$2(o) {
  "@babel/helpers - typeof";
  return _typeof$1$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1$2(o);
}
function ownKeys$1$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1$2(Object(t), true).forEach(function(r2) {
      _defineProperty$1$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1$2(obj, key, value) {
  key = _toPropertyKey$1$2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$1$2(t) {
  var i = _toPrimitive$1$2(t, "string");
  return "symbol" == _typeof$1$2(i) ? i : String(i);
}
function _toPrimitive$1$2(t, r) {
  if ("object" != _typeof$1$2(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$1$2(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var buttonCSS = "\n.p-button {\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    align-items: center;\n    vertical-align: bottom;\n    text-align: center;\n    overflow: hidden;\n    position: relative;\n}\n\n.p-button-label {\n    flex: 1 1 auto;\n}\n\n.p-button-icon-right {\n    order: 1;\n}\n\n.p-button:disabled {\n    cursor: default;\n}\n\n.p-button-icon-only {\n    justify-content: center;\n}\n\n.p-button-icon-only .p-button-label {\n    visibility: hidden;\n    width: 0;\n    flex: 0 0 auto;\n}\n\n.p-button-vertical {\n    flex-direction: column;\n}\n\n.p-button-icon-bottom {\n    order: 2;\n}\n\n.p-buttonset .p-button {\n    margin: 0;\n}\n\n.p-buttonset .p-button:not(:last-child), .p-buttonset .p-button:not(:last-child):hover {\n    border-right: 0 none;\n}\n\n.p-buttonset .p-button:not(:first-of-type):not(:last-of-type) {\n    border-radius: 0;\n}\n\n.p-buttonset .p-button:first-of-type:not(:only-of-type) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.p-buttonset .p-button:last-of-type:not(:only-of-type) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n.p-buttonset .p-button:focus {\n    position: relative;\n    z-index: 1;\n}\n";
var inputTextCSS = "\n.p-fluid .p-inputtext {\n    width: 100%;\n}\n\n/* InputGroup */\n.p-inputgroup {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup-addon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-inputgroup .p-float-label {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup .p-inputtext,\n.p-fluid .p-inputgroup .p-inputtext,\n.p-inputgroup .p-inputwrapper,\n.p-fluid .p-inputgroup .p-input {\n    flex: 1 1 auto;\n    width: 1%;\n}\n\n/* Floating Label */\n.p-float-label {\n    display: block;\n    position: relative;\n}\n\n.p-float-label label {\n    position: absolute;\n    pointer-events: none;\n    top: 50%;\n    margin-top: -.5rem;\n    transition-property: all;\n    transition-timing-function: ease;\n    line-height: 1;\n}\n\n.p-float-label textarea ~ label {\n    top: 1rem;\n}\n\n.p-float-label input:focus ~ label,\n.p-float-label input.p-filled ~ label,\n.p-float-label input:-webkit-autofill ~ label,\n.p-float-label textarea:focus ~ label,\n.p-float-label textarea.p-filled ~ label,\n.p-float-label .p-inputwrapper-focus ~ label,\n.p-float-label .p-inputwrapper-filled ~ label {\n    top: -.75rem;\n    font-size: 12px;\n}\n\n\n.p-float-label .p-placeholder,\n.p-float-label input::placeholder,\n.p-float-label .p-inputtext::placeholder {\n    opacity: 0;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-float-label .p-focus .p-placeholder,\n.p-float-label input:focus::placeholder,\n.p-float-label .p-inputtext:focus::placeholder {\n    opacity: 1;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-input-icon-left,\n.p-input-icon-right {\n    position: relative;\n    display: inline-block;\n}\n\n.p-input-icon-left > i,\n.p-input-icon-left > svg,\n.p-input-icon-right > i,\n.p-input-icon-right > svg {\n    position: absolute;\n    top: 50%;\n    margin-top: -.5rem;\n}\n\n.p-fluid .p-input-icon-left,\n.p-fluid .p-input-icon-right {\n    display: block;\n    width: 100%;\n}\n";
var css$b = "\n@layer primevue {\n.p-component, .p-component * {\n    box-sizing: border-box;\n}\n\n.p-hidden-space {\n    visibility: hidden;\n}\n\n.p-reset {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    outline: 0;\n    text-decoration: none;\n    font-size: 100%;\n    list-style: none;\n}\n\n.p-disabled, .p-disabled * {\n    cursor: default;\n    pointer-events: none;\n    user-select: none;\n}\n\n.p-component-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-unselectable-text {\n    user-select: none;\n}\n\n.p-sr-only {\n    border: 0;\n    clip: rect(1px, 1px, 1px, 1px);\n    clip-path: inset(50%);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n    word-wrap: normal;\n}\n\n.p-link {\n	text-align: left;\n	background-color: transparent;\n	margin: 0;\n	padding: 0;\n	border: none;\n    cursor: pointer;\n    user-select: none;\n}\n\n.p-link:disabled {\n	cursor: default;\n}\n\n/* Non vue overlay animations */\n.p-connected-overlay {\n    opacity: 0;\n    transform: scaleY(0.8);\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-visible {\n    opacity: 1;\n    transform: scaleY(1);\n}\n\n.p-connected-overlay-hidden {\n    opacity: 0;\n    transform: scaleY(1);\n    transition: opacity .1s linear;\n}\n\n/* Vue based overlay animations */\n.p-connected-overlay-enter-from {\n    opacity: 0;\n    transform: scaleY(0.8);\n}\n\n.p-connected-overlay-leave-to {\n    opacity: 0;\n}\n\n.p-connected-overlay-enter-active {\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-leave-active {\n    transition: opacity .1s linear;\n}\n\n/* Toggleable Content */\n.p-toggleable-content-enter-from,\n.p-toggleable-content-leave-to {\n    max-height: 0;\n}\n\n.p-toggleable-content-enter-to,\n.p-toggleable-content-leave-from {\n    max-height: 1000px;\n}\n\n.p-toggleable-content-leave-active {\n    overflow: hidden;\n    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);\n}\n\n.p-toggleable-content-enter-active {\n    overflow: hidden;\n    transition: max-height 1s ease-in-out;\n}\n".concat(buttonCSS, "\n").concat(inputTextCSS, "\n}\n");
var BaseComponentStyle = BaseStyle.extend({
  name: "common",
  css: css$b,
  loadGlobalStyle: function loadGlobalStyle(globalCSS) {
    var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return useStyle(globalCSS, _objectSpread$1$2({
      name: "global"
    }, options2));
  }
});
function _typeof$m(o) {
  "@babel/helpers - typeof";
  return _typeof$m = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$m(o);
}
function ownKeys$j(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$j(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$j(Object(t), true).forEach(function(r2) {
      _defineProperty$l(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$j(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$l(obj, key, value) {
  key = _toPropertyKey$l(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$l(t) {
  var i = _toPrimitive$l(t, "string");
  return "symbol" == _typeof$m(i) ? i : String(i);
}
function _toPrimitive$l(t, r) {
  if ("object" != _typeof$m(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$m(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$N = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      "default": void 0
    },
    ptOptions: {
      type: Object,
      "default": void 0
    },
    unstyled: {
      type: Boolean,
      "default": void 0
    }
  },
  inject: {
    $parentInstance: {
      "default": void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: true,
      handler: function handler2(newValue) {
        if (!newValue) {
          var _this$$config, _this$$config2;
          BaseComponentStyle.loadStyle({
            nonce: (_this$$config = this.$config) === null || _this$$config === void 0 || (_this$$config = _this$$config.csp) === null || _this$$config === void 0 ? void 0 : _this$$config.nonce
          });
          this.$options.style && this.$style.loadStyle({
            nonce: (_this$$config2 = this.$config) === null || _this$$config2 === void 0 || (_this$$config2 = _this$$config2.csp) === null || _this$$config2 === void 0 ? void 0 : _this$$config2.nonce
          });
        }
      }
    }
  },
  beforeCreate: function beforeCreate() {
    var _this$pt, _this$pt2, _this$pt3, _ref, _ref$onBeforeCreate, _this$$config3, _this$$primevue, _this$$primevue2, _this$$primevue3, _ref2, _ref2$onBeforeCreate;
    var _usept = (_this$pt = this.pt) === null || _this$pt === void 0 ? void 0 : _this$pt["_usept"];
    var originalValue = _usept ? (_this$pt2 = this.pt) === null || _this$pt2 === void 0 || (_this$pt2 = _this$pt2.originalValue) === null || _this$pt2 === void 0 ? void 0 : _this$pt2[this.$.type.name] : void 0;
    var value = _usept ? (_this$pt3 = this.pt) === null || _this$pt3 === void 0 || (_this$pt3 = _this$pt3.value) === null || _this$pt3 === void 0 ? void 0 : _this$pt3[this.$.type.name] : this.pt;
    (_ref = value || originalValue) === null || _ref === void 0 || (_ref = _ref.hooks) === null || _ref === void 0 || (_ref$onBeforeCreate = _ref["onBeforeCreate"]) === null || _ref$onBeforeCreate === void 0 || _ref$onBeforeCreate.call(_ref);
    var _useptInConfig = (_this$$config3 = this.$config) === null || _this$$config3 === void 0 || (_this$$config3 = _this$$config3.pt) === null || _this$$config3 === void 0 ? void 0 : _this$$config3["_usept"];
    var originalValueInConfig = _useptInConfig ? (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.pt) === null || _this$$primevue === void 0 ? void 0 : _this$$primevue.originalValue : void 0;
    var valueInConfig = _useptInConfig ? (_this$$primevue2 = this.$primevue) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.config) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.pt) === null || _this$$primevue2 === void 0 ? void 0 : _this$$primevue2.value : (_this$$primevue3 = this.$primevue) === null || _this$$primevue3 === void 0 || (_this$$primevue3 = _this$$primevue3.config) === null || _this$$primevue3 === void 0 ? void 0 : _this$$primevue3.pt;
    (_ref2 = valueInConfig || originalValueInConfig) === null || _ref2 === void 0 || (_ref2 = _ref2[this.$.type.name]) === null || _ref2 === void 0 || (_ref2 = _ref2.hooks) === null || _ref2 === void 0 || (_ref2$onBeforeCreate = _ref2["onBeforeCreate"]) === null || _ref2$onBeforeCreate === void 0 || _ref2$onBeforeCreate.call(_ref2);
  },
  created: function created() {
    this._hook("onCreated");
  },
  beforeMount: function beforeMount() {
    var _this$$config4;
    BaseStyle.loadStyle({
      nonce: (_this$$config4 = this.$config) === null || _this$$config4 === void 0 || (_this$$config4 = _this$$config4.csp) === null || _this$$config4 === void 0 ? void 0 : _this$$config4.nonce
    });
    this._loadGlobalStyles();
    this._hook("onBeforeMount");
  },
  mounted: function mounted() {
    this._hook("onMounted");
  },
  beforeUpdate: function beforeUpdate() {
    this._hook("onBeforeUpdate");
  },
  updated: function updated() {
    this._hook("onUpdated");
  },
  beforeUnmount: function beforeUnmount() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function unmounted() {
    this._hook("onUnmounted");
  },
  methods: {
    _hook: function _hook(hookName) {
      if (!this.$options.hostName) {
        var selfHook = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(hookName));
        var defaultHook = this._useDefaultPT(this._getOptionValue, "hooks.".concat(hookName));
        selfHook === null || selfHook === void 0 || selfHook();
        defaultHook === null || defaultHook === void 0 || defaultHook();
      }
    },
    _loadGlobalStyles: function _loadGlobalStyles() {
      var _this$$config5;
      var globalCSS = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      ObjectUtils.isNotEmpty(globalCSS) && BaseComponentStyle.loadGlobalStyle(globalCSS, {
        nonce: (_this$$config5 = this.$config) === null || _this$$config5 === void 0 || (_this$$config5 = _this$$config5.csp) === null || _this$$config5 === void 0 ? void 0 : _this$$config5.nonce
      });
    },
    _getHostInstance: function _getHostInstance(instance) {
      return instance ? this.$options.hostName ? instance.$.type.name === this.$options.hostName ? instance : this._getHostInstance(instance.$parentInstance) : instance.$parentInstance : void 0;
    },
    _getPropValue: function _getPropValue(name) {
      var _this$_getHostInstanc;
      return this[name] || ((_this$_getHostInstanc = this._getHostInstance(this)) === null || _this$_getHostInstanc === void 0 ? void 0 : _this$_getHostInstanc[name]);
    },
    _getOptionValue: function _getOptionValue(options2) {
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var fKeys = ObjectUtils.toFlatCase(key).split(".");
      var fKey = fKeys.shift();
      return fKey ? ObjectUtils.isObject(options2) ? this._getOptionValue(ObjectUtils.getItemValue(options2[Object.keys(options2).find(function(k) {
        return ObjectUtils.toFlatCase(k) === fKey;
      }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options2, params);
    },
    _getPTValue: function _getPTValue() {
      var _this$$config6;
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var searchInDefaultPT = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
      var datasetPrefix = "data-pc-";
      var searchOut = /./g.test(key) && !!params[key.split(".")[0]];
      var _ref3 = this._getPropValue("ptOptions") || ((_this$$config6 = this.$config) === null || _this$$config6 === void 0 ? void 0 : _this$$config6.ptOptions) || {}, _ref3$mergeSections = _ref3.mergeSections, mergeSections = _ref3$mergeSections === void 0 ? true : _ref3$mergeSections, _ref3$mergeProps = _ref3.mergeProps, useMergeProps = _ref3$mergeProps === void 0 ? false : _ref3$mergeProps;
      var global2 = searchInDefaultPT ? searchOut ? this._useGlobalPT(this._getPTClassValue, key, params) : this._useDefaultPT(this._getPTClassValue, key, params) : void 0;
      var self2 = searchOut ? void 0 : this._usePT(this._getPT(obj, this.$name), this._getPTClassValue, key, _objectSpread$j(_objectSpread$j({}, params), {}, {
        global: global2 || {}
      }));
      var datasets = key !== "transition" && _objectSpread$j(_objectSpread$j({}, key === "root" && _defineProperty$l({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(this.$.type.name))), {}, _defineProperty$l({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key)));
      return mergeSections || !mergeSections && self2 ? useMergeProps ? mergeProps(global2, self2, datasets) : _objectSpread$j(_objectSpread$j(_objectSpread$j({}, global2), self2), datasets) : _objectSpread$j(_objectSpread$j({}, self2), datasets);
    },
    _getPTClassValue: function _getPTClassValue() {
      var value = this._getOptionValue.apply(this, arguments);
      return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
        "class": value
      } : value;
    },
    _getPT: function _getPT(pt) {
      var _this = this;
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var callback = arguments.length > 2 ? arguments[2] : void 0;
      var getValue = function getValue2(value) {
        var _ref5;
        var checkSameKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var computedValue = callback ? callback(value) : value;
        var _key = ObjectUtils.toFlatCase(key);
        var _cKey = ObjectUtils.toFlatCase(_this.$name);
        return (_ref5 = checkSameKey ? _key !== _cKey ? computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key] : void 0 : computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key]) !== null && _ref5 !== void 0 ? _ref5 : computedValue;
      };
      return pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept") ? {
        _usept: pt["_usept"],
        originalValue: getValue(pt.originalValue),
        value: getValue(pt.value)
      } : getValue(pt, true);
    },
    _usePT: function _usePT(pt, callback, key, params) {
      var fn = function fn2(value2) {
        return callback(value2, key, params);
      };
      if (pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept")) {
        var _this$$config7;
        var _ref6 = pt["_usept"] || ((_this$$config7 = this.$config) === null || _this$$config7 === void 0 ? void 0 : _this$$config7.ptOptions) || {}, _ref6$mergeSections = _ref6.mergeSections, mergeSections = _ref6$mergeSections === void 0 ? true : _ref6$mergeSections, _ref6$mergeProps = _ref6.mergeProps, useMergeProps = _ref6$mergeProps === void 0 ? false : _ref6$mergeProps;
        var originalValue = fn(pt.originalValue);
        var value = fn(pt.value);
        if (originalValue === void 0 && value === void 0)
          return void 0;
        else if (ObjectUtils.isString(value))
          return value;
        else if (ObjectUtils.isString(originalValue))
          return originalValue;
        return mergeSections || !mergeSections && value ? useMergeProps ? mergeProps(originalValue, value) : _objectSpread$j(_objectSpread$j({}, originalValue), value) : value;
      }
      return fn(pt);
    },
    _useGlobalPT: function _useGlobalPT(callback, key, params) {
      return this._usePT(this.globalPT, callback, key, params);
    },
    _useDefaultPT: function _useDefaultPT(callback, key, params) {
      return this._usePT(this.defaultPT, callback, key, params);
    },
    ptm: function ptm() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, key, _objectSpread$j(_objectSpread$j({}, this.$params), params));
    },
    ptmo: function ptmo() {
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(obj, key, _objectSpread$j({
        instance: this
      }, params), false);
    },
    cx: function cx() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return !this.isUnstyled ? this._getOptionValue(this.$style.classes, key, _objectSpread$j(_objectSpread$j({}, this.$params), params)) : void 0;
    },
    sx: function sx() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (when) {
        var self2 = this._getOptionValue(this.$style.inlineStyles, key, _objectSpread$j(_objectSpread$j({}, this.$params), params));
        var base = this._getOptionValue(BaseComponentStyle.inlineStyles, key, _objectSpread$j(_objectSpread$j({}, this.$params), params));
        return [base, self2];
      }
      return void 0;
    }
  },
  computed: {
    globalPT: function globalPT() {
      var _this$$config8, _this2 = this;
      return this._getPT((_this$$config8 = this.$config) === null || _this$$config8 === void 0 ? void 0 : _this$$config8.pt, void 0, function(value) {
        return ObjectUtils.getItemValue(value, {
          instance: _this2
        });
      });
    },
    defaultPT: function defaultPT() {
      var _this$$config9, _this3 = this;
      return this._getPT((_this$$config9 = this.$config) === null || _this$$config9 === void 0 ? void 0 : _this$$config9.pt, void 0, function(value) {
        return _this3._getOptionValue(value, _this3.$name, _objectSpread$j({}, _this3.$params)) || ObjectUtils.getItemValue(value, _objectSpread$j({}, _this3.$params));
      });
    },
    isUnstyled: function isUnstyled() {
      var _this$$config10;
      return this.unstyled !== void 0 ? this.unstyled : (_this$$config10 = this.$config) === null || _this$$config10 === void 0 ? void 0 : _this$$config10.unstyled;
    },
    $params: function $params() {
      var parentInstance = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: parentInstance,
          props: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$props,
          state: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$data,
          attrs: parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.$attrs
        },
        /* @deprecated since v3.43.0. Use the `parent.instance` instead of the `parentInstance`.*/
        parentInstance
      };
    },
    $style: function $style() {
      return _objectSpread$j(_objectSpread$j({
        classes: void 0,
        inlineStyles: void 0,
        loadStyle: function loadStyle2() {
        },
        loadCustomStyle: function loadCustomStyle() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $config: function $config() {
      var _this$$primevue4;
      return (_this$$primevue4 = this.$primevue) === null || _this$$primevue4 === void 0 ? void 0 : _this$$primevue4.config;
    },
    $name: function $name() {
      return this.$options.hostName || this.$.type.name;
    }
  }
};
var css$a = "\n.p-icon {\n    display: inline-block;\n}\n\n.p-icon-spin {\n    -webkit-animation: p-icon-spin 2s infinite linear;\n    animation: p-icon-spin 2s infinite linear;\n}\n\n@-webkit-keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n\n@keyframes p-icon-spin {\n    0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n    }\n    100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n    }\n}\n";
var BaseIconStyle = BaseStyle.extend({
  name: "baseicon",
  css: css$a
});
function _typeof$l(o) {
  "@babel/helpers - typeof";
  return _typeof$l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$l(o);
}
function ownKeys$i(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$i(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$i(Object(t), true).forEach(function(r2) {
      _defineProperty$k(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$i(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$k(obj, key, value) {
  key = _toPropertyKey$k(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$k(t) {
  var i = _toPrimitive$k(t, "string");
  return "symbol" == _typeof$l(i) ? i : String(i);
}
function _toPrimitive$k(t, r) {
  if ("object" != _typeof$l(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$l(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$M = {
  name: "BaseIcon",
  "extends": script$N,
  props: {
    label: {
      type: String,
      "default": void 0
    },
    spin: {
      type: Boolean,
      "default": false
    }
  },
  style: BaseIconStyle,
  methods: {
    pti: function pti() {
      var isLabelEmpty = ObjectUtils.isEmpty(this.label);
      return _objectSpread$i(_objectSpread$i({}, !this.isUnstyled && {
        "class": ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: !isLabelEmpty ? "img" : void 0,
        "aria-label": !isLabelEmpty ? this.label : void 0,
        "aria-hidden": isLabelEmpty
      });
    }
  },
  computed: {
    pathId: function pathId() {
      return UniqueComponentId("pv_icon_clip_pv_id_");
    }
  }
};
var script$L = {
  name: "BarsIcon",
  "extends": script$M
};
var _hoisted_1$E = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M13.3226 3.6129H0.677419C0.497757 3.6129 0.325452 3.54152 0.198411 3.41448C0.0713707 3.28744 0 3.11514 0 2.93548C0 2.75581 0.0713707 2.58351 0.198411 2.45647C0.325452 2.32943 0.497757 2.25806 0.677419 2.25806H13.3226C13.5022 2.25806 13.6745 2.32943 13.8016 2.45647C13.9286 2.58351 14 2.75581 14 2.93548C14 3.11514 13.9286 3.28744 13.8016 3.41448C13.6745 3.54152 13.5022 3.6129 13.3226 3.6129ZM13.3226 7.67741H0.677419C0.497757 7.67741 0.325452 7.60604 0.198411 7.479C0.0713707 7.35196 0 7.17965 0 6.99999C0 6.82033 0.0713707 6.64802 0.198411 6.52098C0.325452 6.39394 0.497757 6.32257 0.677419 6.32257H13.3226C13.5022 6.32257 13.6745 6.39394 13.8016 6.52098C13.9286 6.64802 14 6.82033 14 6.99999C14 7.17965 13.9286 7.35196 13.8016 7.479C13.6745 7.60604 13.5022 7.67741 13.3226 7.67741ZM0.677419 11.7419H13.3226C13.5022 11.7419 13.6745 11.6706 13.8016 11.5435C13.9286 11.4165 14 11.2442 14 11.0645C14 10.8848 13.9286 10.7125 13.8016 10.5855C13.6745 10.4585 13.5022 10.3871 13.3226 10.3871H0.677419C0.497757 10.3871 0.325452 10.4585 0.198411 10.5855C0.0713707 10.7125 0 10.8848 0 11.0645C0 11.2442 0.0713707 11.4165 0.198411 11.5435C0.325452 11.6706 0.497757 11.7419 0.677419 11.7419Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$y = [_hoisted_1$E];
function render$J(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$y, 16);
}
script$L.render = render$J;
var css$9 = "\n@layer primevue {\n    .p-menubar {\n        display: flex;\n        align-items: center;\n    }\n\n    .p-menubar ul {\n        margin: 0;\n        padding: 0;\n        list-style: none;\n    }\n\n    .p-menubar .p-menuitem-link {\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        text-decoration: none;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-menubar .p-menuitem-text {\n        line-height: 1;\n    }\n\n    .p-menubar .p-menuitem {\n        position: relative;\n    }\n\n    .p-menubar-root-list {\n        display: flex;\n        align-items: center;\n        flex-wrap: wrap;\n    }\n\n    .p-menubar-root-list > li ul {\n        display: none;\n        z-index: 1;\n    }\n\n    .p-menubar-root-list > .p-menuitem-active > .p-submenu-list {\n        display: block;\n    }\n\n    .p-menubar .p-submenu-list {\n        display: none;\n        position: absolute;\n        z-index: 1;\n    }\n\n    .p-menubar .p-submenu-list > .p-menuitem-active > .p-submenu-list {\n        display: block;\n        left: 100%;\n        top: 0;\n    }\n\n    .p-menubar .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link .p-submenu-icon {\n        margin-left: auto;\n    }\n\n    .p-menubar .p-menubar-end {\n        margin-left: auto;\n        align-self: center;\n    }\n\n    .p-menubar-button {\n        display: none;\n        cursor: pointer;\n        align-items: center;\n        justify-content: center;\n        text-decoration: none;\n    }\n\n    .p-menubar.p-menubar-mobile {\n        position: relative; \n    }\n\n    .p-menubar.p-menubar-mobile .p-menubar-button {\n        display: flex;\n    }\n\n    .p-menubar.p-menubar-mobile .p-menubar-root-list {\n        position: absolute;\n        display: none;\n        width: 100%;\n    }\n\n    .p-menubar.p-menubar-mobile .p-submenu-list {\n        width: 100%;\n        position: static;\n        box-shadow: none;\n        border: 0 none;\n    }\n\n    .p-menubar.p-menubar-mobile .p-menubar-root-list .p-menuitem {\n        width: 100%;\n        position: static;\n    }\n\n    .p-menubar.p-menubar-mobile-active .p-menubar-root-list {\n        display: flex;\n        flex-direction: column;\n        top: 100%;\n        left: 0;\n        z-index: 1;\n    }\n}\n";
var inlineStyles$1 = {
  submenu: function submenu(_ref) {
    var instance = _ref.instance, processedItem = _ref.processedItem;
    return {
      display: instance.isItemActive(processedItem) ? "block" : "none"
    };
  }
};
var classes$a = {
  root: function root(_ref2) {
    var instance = _ref2.instance;
    return ["p-menubar p-component", {
      "p-menubar-mobile": instance.queryMatches,
      "p-menubar-mobile-active": instance.mobileActive
    }];
  },
  start: "p-menubar-start",
  button: "p-menubar-button",
  menu: "p-menubar-root-list",
  menuitem: function menuitem(_ref3) {
    var instance = _ref3.instance, processedItem = _ref3.processedItem;
    return ["p-menuitem", {
      "p-menuitem-active p-highlight": instance.isItemActive(processedItem),
      "p-focus": instance.isItemFocused(processedItem),
      "p-disabled": instance.isItemDisabled(processedItem)
    }];
  },
  content: "p-menuitem-content",
  action: "p-menuitem-link",
  icon: "p-menuitem-icon",
  label: "p-menuitem-text",
  submenuIcon: "p-submenu-icon",
  submenu: "p-submenu-list",
  separator: "p-menuitem-separator",
  end: "p-menubar-end"
};
var MenubarStyle = BaseStyle.extend({
  name: "menubar",
  css: css$9,
  classes: classes$a,
  inlineStyles: inlineStyles$1
});
var script$K = {
  name: "AngleDownIcon",
  "extends": script$M
};
var _hoisted_1$D = /* @__PURE__ */ createBaseVNode("path", {
  d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$x = [_hoisted_1$D];
function render$I(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$x, 16);
}
script$K.render = render$I;
var script$J = {
  name: "AngleRightIcon",
  "extends": script$M
};
var _hoisted_1$C = /* @__PURE__ */ createBaseVNode("path", {
  d: "M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$w = [_hoisted_1$C];
function render$H(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$w, 16);
}
script$J.render = render$H;
function _typeof$k(o) {
  "@babel/helpers - typeof";
  return _typeof$k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$k(o);
}
function _slicedToArray$2(arr, i) {
  return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$8(arr, i) || _nonIterableRest$2();
}
function _nonIterableRest$2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$8(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$8(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$8(o, minLen);
}
function _arrayLikeToArray$8(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$2(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$2(arr) {
  if (Array.isArray(arr))
    return arr;
}
function ownKeys$h(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$h(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$h(Object(t), true).forEach(function(r2) {
      _defineProperty$j(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$h(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$j(obj, key, value) {
  key = _toPropertyKey$j(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$j(t) {
  var i = _toPrimitive$j(t, "string");
  return "symbol" == _typeof$k(i) ? i : String(i);
}
function _toPrimitive$j(t, r) {
  if ("object" != _typeof$k(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$k(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var BaseDirective = {
  _getMeta: function _getMeta() {
    return [ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? void 0 : arguments.length <= 0 ? void 0 : arguments[0], ObjectUtils.getItemValue(ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function _getConfig(binding, vnode) {
    var _ref, _binding$instance, _vnode$ctx;
    return (_ref = (binding === null || binding === void 0 || (_binding$instance = binding.instance) === null || _binding$instance === void 0 ? void 0 : _binding$instance.$primevue) || (vnode === null || vnode === void 0 || (_vnode$ctx = vnode.ctx) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.appContext) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.config) === null || _vnode$ctx === void 0 || (_vnode$ctx = _vnode$ctx.globalProperties) === null || _vnode$ctx === void 0 ? void 0 : _vnode$ctx.$primevue)) === null || _ref === void 0 ? void 0 : _ref.config;
  },
  _getOptionValue: function _getOptionValue2(options2) {
    var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var fKeys = ObjectUtils.toFlatCase(key).split(".");
    var fKey = fKeys.shift();
    return fKey ? ObjectUtils.isObject(options2) ? BaseDirective._getOptionValue(ObjectUtils.getItemValue(options2[Object.keys(options2).find(function(k) {
      return ObjectUtils.toFlatCase(k) === fKey;
    }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options2, params);
  },
  _getPTValue: function _getPTValue2() {
    var _instance$binding, _instance$$config;
    var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var obj = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var key = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
    var params = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var searchInDefaultPT = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var getValue = function getValue2() {
      var value = BaseDirective._getOptionValue.apply(BaseDirective, arguments);
      return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
        "class": value
      } : value;
    };
    var datasetPrefix = "data-pc-";
    var _ref2 = ((_instance$binding = instance.binding) === null || _instance$binding === void 0 || (_instance$binding = _instance$binding.value) === null || _instance$binding === void 0 ? void 0 : _instance$binding.ptOptions) || ((_instance$$config = instance.$config) === null || _instance$$config === void 0 ? void 0 : _instance$$config.ptOptions) || {}, _ref2$mergeSections = _ref2.mergeSections, mergeSections = _ref2$mergeSections === void 0 ? true : _ref2$mergeSections, _ref2$mergeProps = _ref2.mergeProps, useMergeProps = _ref2$mergeProps === void 0 ? false : _ref2$mergeProps;
    var global2 = searchInDefaultPT ? BaseDirective._useDefaultPT(instance, instance.defaultPT(), getValue, key, params) : void 0;
    var self2 = BaseDirective._usePT(instance, BaseDirective._getPT(obj, instance.$name), getValue, key, _objectSpread$h(_objectSpread$h({}, params), {}, {
      global: global2 || {}
    }));
    var datasets = _objectSpread$h(_objectSpread$h({}, key === "root" && _defineProperty$j({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(instance.$name))), {}, _defineProperty$j({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key)));
    return mergeSections || !mergeSections && self2 ? useMergeProps ? mergeProps(global2, self2, datasets) : _objectSpread$h(_objectSpread$h(_objectSpread$h({}, global2), self2), datasets) : _objectSpread$h(_objectSpread$h({}, self2), datasets);
  },
  _getPT: function _getPT2(pt) {
    var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var callback = arguments.length > 2 ? arguments[2] : void 0;
    var getValue = function getValue2(value) {
      var _computedValue$_key;
      var computedValue = callback ? callback(value) : value;
      var _key = ObjectUtils.toFlatCase(key);
      return (_computedValue$_key = computedValue === null || computedValue === void 0 ? void 0 : computedValue[_key]) !== null && _computedValue$_key !== void 0 ? _computedValue$_key : computedValue;
    };
    return pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept") ? {
      _usept: pt["_usept"],
      originalValue: getValue(pt.originalValue),
      value: getValue(pt.value)
    } : getValue(pt);
  },
  _usePT: function _usePT2() {
    var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var pt = arguments.length > 1 ? arguments[1] : void 0;
    var callback = arguments.length > 2 ? arguments[2] : void 0;
    var key = arguments.length > 3 ? arguments[3] : void 0;
    var params = arguments.length > 4 ? arguments[4] : void 0;
    var fn = function fn2(value2) {
      return callback(value2, key, params);
    };
    if (pt !== null && pt !== void 0 && pt.hasOwnProperty("_usept")) {
      var _instance$$config2;
      var _ref4 = pt["_usept"] || ((_instance$$config2 = instance.$config) === null || _instance$$config2 === void 0 ? void 0 : _instance$$config2.ptOptions) || {}, _ref4$mergeSections = _ref4.mergeSections, mergeSections = _ref4$mergeSections === void 0 ? true : _ref4$mergeSections, _ref4$mergeProps = _ref4.mergeProps, useMergeProps = _ref4$mergeProps === void 0 ? false : _ref4$mergeProps;
      var originalValue = fn(pt.originalValue);
      var value = fn(pt.value);
      if (originalValue === void 0 && value === void 0)
        return void 0;
      else if (ObjectUtils.isString(value))
        return value;
      else if (ObjectUtils.isString(originalValue))
        return originalValue;
      return mergeSections || !mergeSections && value ? useMergeProps ? mergeProps(originalValue, value) : _objectSpread$h(_objectSpread$h({}, originalValue), value) : value;
    }
    return fn(pt);
  },
  _useDefaultPT: function _useDefaultPT2() {
    var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var defaultPT2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var callback = arguments.length > 2 ? arguments[2] : void 0;
    var key = arguments.length > 3 ? arguments[3] : void 0;
    var params = arguments.length > 4 ? arguments[4] : void 0;
    return BaseDirective._usePT(instance, defaultPT2, callback, key, params);
  },
  _hook: function _hook2(directiveName, hookName, el, binding, vnode, prevVnode) {
    var _binding$value, _config$pt;
    var name = "on".concat(ObjectUtils.toCapitalCase(hookName));
    var config = BaseDirective._getConfig(binding, vnode);
    var instance = el === null || el === void 0 ? void 0 : el.$instance;
    var selfHook = BaseDirective._usePT(instance, BaseDirective._getPT(binding === null || binding === void 0 || (_binding$value = binding.value) === null || _binding$value === void 0 ? void 0 : _binding$value.pt, directiveName), BaseDirective._getOptionValue, "hooks.".concat(name));
    var defaultHook = BaseDirective._useDefaultPT(instance, config === null || config === void 0 || (_config$pt = config.pt) === null || _config$pt === void 0 || (_config$pt = _config$pt.directives) === null || _config$pt === void 0 ? void 0 : _config$pt[directiveName], BaseDirective._getOptionValue, "hooks.".concat(name));
    var options2 = {
      el,
      binding,
      vnode,
      prevVnode
    };
    selfHook === null || selfHook === void 0 || selfHook(instance, options2);
    defaultHook === null || defaultHook === void 0 || defaultHook(instance, options2);
  },
  _extend: function _extend(name) {
    var options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var handleHook = function handleHook2(hook, el, binding, vnode, prevVnode) {
      var _el$$instance$hook, _el$$instance7;
      el._$instances = el._$instances || {};
      var config = BaseDirective._getConfig(binding, vnode);
      var $prevInstance = el._$instances[name] || {};
      var $options = ObjectUtils.isEmpty($prevInstance) ? _objectSpread$h(_objectSpread$h({}, options2), options2 === null || options2 === void 0 ? void 0 : options2.methods) : {};
      el._$instances[name] = _objectSpread$h(_objectSpread$h({}, $prevInstance), {}, {
        /* new instance variables to pass in directive methods */
        $name: name,
        $host: el,
        $binding: binding,
        $modifiers: binding === null || binding === void 0 ? void 0 : binding.modifiers,
        $value: binding === null || binding === void 0 ? void 0 : binding.value,
        $el: $prevInstance["$el"] || el || void 0,
        $style: _objectSpread$h({
          classes: void 0,
          inlineStyles: void 0,
          loadStyle: function loadStyle2() {
          }
        }, options2 === null || options2 === void 0 ? void 0 : options2.style),
        $config: config,
        /* computed instance variables */
        defaultPT: function defaultPT2() {
          return BaseDirective._getPT(config === null || config === void 0 ? void 0 : config.pt, void 0, function(value) {
            var _value$directives;
            return value === null || value === void 0 || (_value$directives = value.directives) === null || _value$directives === void 0 ? void 0 : _value$directives[name];
          });
        },
        isUnstyled: function isUnstyled2() {
          var _el$$instance, _el$$instance2;
          return ((_el$$instance = el.$instance) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.$binding) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.value) === null || _el$$instance === void 0 ? void 0 : _el$$instance.unstyled) !== void 0 ? (_el$$instance2 = el.$instance) === null || _el$$instance2 === void 0 || (_el$$instance2 = _el$$instance2.$binding) === null || _el$$instance2 === void 0 || (_el$$instance2 = _el$$instance2.value) === null || _el$$instance2 === void 0 ? void 0 : _el$$instance2.unstyled : config === null || config === void 0 ? void 0 : config.unstyled;
        },
        /* instance's methods */
        ptm: function ptm2() {
          var _el$$instance3;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return BaseDirective._getPTValue(el.$instance, (_el$$instance3 = el.$instance) === null || _el$$instance3 === void 0 || (_el$$instance3 = _el$$instance3.$binding) === null || _el$$instance3 === void 0 || (_el$$instance3 = _el$$instance3.value) === null || _el$$instance3 === void 0 ? void 0 : _el$$instance3.pt, key, _objectSpread$h({}, params));
        },
        ptmo: function ptmo2() {
          var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
          var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return BaseDirective._getPTValue(el.$instance, obj, key, params, false);
        },
        cx: function cx2() {
          var _el$$instance4, _el$$instance5;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return !((_el$$instance4 = el.$instance) !== null && _el$$instance4 !== void 0 && _el$$instance4.isUnstyled()) ? BaseDirective._getOptionValue((_el$$instance5 = el.$instance) === null || _el$$instance5 === void 0 || (_el$$instance5 = _el$$instance5.$style) === null || _el$$instance5 === void 0 ? void 0 : _el$$instance5.classes, key, _objectSpread$h({}, params)) : void 0;
        },
        sx: function sx2() {
          var _el$$instance6;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return when ? BaseDirective._getOptionValue((_el$$instance6 = el.$instance) === null || _el$$instance6 === void 0 || (_el$$instance6 = _el$$instance6.$style) === null || _el$$instance6 === void 0 ? void 0 : _el$$instance6.inlineStyles, key, _objectSpread$h({}, params)) : void 0;
        }
      }, $options);
      el.$instance = el._$instances[name];
      (_el$$instance$hook = (_el$$instance7 = el.$instance)[hook]) === null || _el$$instance$hook === void 0 || _el$$instance$hook.call(_el$$instance7, el, binding, vnode, prevVnode);
      el["$".concat(name)] = el.$instance;
      BaseDirective._hook(name, hook, el, binding, vnode, prevVnode);
    };
    return {
      created: function created3(el, binding, vnode, prevVnode) {
        handleHook("created", el, binding, vnode, prevVnode);
      },
      beforeMount: function beforeMount3(el, binding, vnode, prevVnode) {
        var _config$csp, _el$$instance8, _el$$instance9, _config$csp2;
        var config = BaseDirective._getConfig(binding, vnode);
        BaseStyle.loadStyle({
          nonce: config === null || config === void 0 || (_config$csp = config.csp) === null || _config$csp === void 0 ? void 0 : _config$csp.nonce
        });
        !((_el$$instance8 = el.$instance) !== null && _el$$instance8 !== void 0 && _el$$instance8.isUnstyled()) && ((_el$$instance9 = el.$instance) === null || _el$$instance9 === void 0 || (_el$$instance9 = _el$$instance9.$style) === null || _el$$instance9 === void 0 ? void 0 : _el$$instance9.loadStyle({
          nonce: config === null || config === void 0 || (_config$csp2 = config.csp) === null || _config$csp2 === void 0 ? void 0 : _config$csp2.nonce
        }));
        handleHook("beforeMount", el, binding, vnode, prevVnode);
      },
      mounted: function mounted16(el, binding, vnode, prevVnode) {
        var _config$csp3, _el$$instance10, _el$$instance11, _config$csp4;
        var config = BaseDirective._getConfig(binding, vnode);
        BaseStyle.loadStyle({
          nonce: config === null || config === void 0 || (_config$csp3 = config.csp) === null || _config$csp3 === void 0 ? void 0 : _config$csp3.nonce
        });
        !((_el$$instance10 = el.$instance) !== null && _el$$instance10 !== void 0 && _el$$instance10.isUnstyled()) && ((_el$$instance11 = el.$instance) === null || _el$$instance11 === void 0 || (_el$$instance11 = _el$$instance11.$style) === null || _el$$instance11 === void 0 ? void 0 : _el$$instance11.loadStyle({
          nonce: config === null || config === void 0 || (_config$csp4 = config.csp) === null || _config$csp4 === void 0 ? void 0 : _config$csp4.nonce
        }));
        handleHook("mounted", el, binding, vnode, prevVnode);
      },
      beforeUpdate: function beforeUpdate2(el, binding, vnode, prevVnode) {
        handleHook("beforeUpdate", el, binding, vnode, prevVnode);
      },
      updated: function updated10(el, binding, vnode, prevVnode) {
        handleHook("updated", el, binding, vnode, prevVnode);
      },
      beforeUnmount: function beforeUnmount9(el, binding, vnode, prevVnode) {
        handleHook("beforeUnmount", el, binding, vnode, prevVnode);
      },
      unmounted: function unmounted6(el, binding, vnode, prevVnode) {
        handleHook("unmounted", el, binding, vnode, prevVnode);
      }
    };
  },
  extend: function extend3() {
    var _BaseDirective$_getMe = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe2 = _slicedToArray$2(_BaseDirective$_getMe, 2), name = _BaseDirective$_getMe2[0], options2 = _BaseDirective$_getMe2[1];
    return _objectSpread$h({
      extend: function extend4() {
        var _BaseDirective$_getMe3 = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe4 = _slicedToArray$2(_BaseDirective$_getMe3, 2), _name = _BaseDirective$_getMe4[0], _options = _BaseDirective$_getMe4[1];
        return BaseDirective.extend(_name, _objectSpread$h(_objectSpread$h(_objectSpread$h({}, options2), options2 === null || options2 === void 0 ? void 0 : options2.methods), _options));
      }
    }, BaseDirective._extend(name, options2));
  }
};
var css$8 = "\n@keyframes ripple {\n    100% {\n        opacity: 0;\n        transform: scale(2.5);\n    }\n}\n\n@layer primevue {\n    .p-ripple {\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-ink {\n        display: block;\n        position: absolute;\n        background: rgba(255, 255, 255, 0.5);\n        border-radius: 100%;\n        transform: scale(0);\n        pointer-events: none;\n    }\n\n    .p-ink-active {\n        animation: ripple 0.4s linear;\n    }\n\n    .p-ripple-disabled .p-ink {\n        display: none;\n    }\n}\n";
var classes$9 = {
  root: "p-ink"
};
var RippleStyle = BaseStyle.extend({
  name: "ripple",
  css: css$8,
  classes: classes$9
});
var BaseRipple = BaseDirective.extend({
  style: RippleStyle
});
function _toConsumableArray$5(arr) {
  return _arrayWithoutHoles$5(arr) || _iterableToArray$5(arr) || _unsupportedIterableToArray$7(arr) || _nonIterableSpread$5();
}
function _nonIterableSpread$5() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$7(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$7(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$7(o, minLen);
}
function _iterableToArray$5(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$5(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$7(arr);
}
function _arrayLikeToArray$7(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var Ripple = BaseRipple.extend("ripple", {
  mounted: function mounted2(el) {
    var _el$$instance;
    var config = el === null || el === void 0 || (_el$$instance = el.$instance) === null || _el$$instance === void 0 ? void 0 : _el$$instance.$config;
    if (config && config.ripple) {
      this.create(el);
      this.bindEvents(el);
      el.setAttribute("data-pd-ripple", true);
    }
  },
  unmounted: function unmounted2(el) {
    this.remove(el);
  },
  timeout: void 0,
  methods: {
    bindEvents: function bindEvents(el) {
      el.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function unbindEvents(el) {
      el.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    create: function create(el) {
      var ink = DomHandler.createElement("span", {
        role: "presentation",
        "aria-hidden": true,
        "data-p-ink": true,
        "data-p-ink-active": false,
        "class": !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this),
        "p-bind": this.ptm("root")
      });
      el.appendChild(ink);
      this.$el = ink;
    },
    remove: function remove2(el) {
      var ink = this.getInk(el);
      if (ink) {
        this.unbindEvents(el);
        ink.removeEventListener("animationend", this.onAnimationEnd);
        ink.remove();
      }
    },
    onMouseDown: function onMouseDown(event2) {
      var _this = this;
      var target = event2.currentTarget;
      var ink = this.getInk(target);
      if (!ink || getComputedStyle(ink, null).display === "none") {
        return;
      }
      !this.isUnstyled() && DomHandler.removeClass(ink, "p-ink-active");
      ink.setAttribute("data-p-ink-active", "false");
      if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
        var d = Math.max(DomHandler.getOuterWidth(target), DomHandler.getOuterHeight(target));
        ink.style.height = d + "px";
        ink.style.width = d + "px";
      }
      var offset = DomHandler.getOffset(target);
      var x = event2.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
      var y = event2.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
      ink.style.top = y + "px";
      ink.style.left = x + "px";
      !this.isUnstyled() && DomHandler.addClass(ink, "p-ink-active");
      ink.setAttribute("data-p-ink-active", "true");
      this.timeout = setTimeout(function() {
        if (ink) {
          !_this.isUnstyled() && DomHandler.removeClass(ink, "p-ink-active");
          ink.setAttribute("data-p-ink-active", "false");
        }
      }, 401);
    },
    onAnimationEnd: function onAnimationEnd(event2) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      !this.isUnstyled() && DomHandler.removeClass(event2.currentTarget, "p-ink-active");
      event2.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function getInk(el) {
      return el && el.children ? _toConsumableArray$5(el.children).find(function(child) {
        return DomHandler.getAttribute(child, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
var script$2$2 = {
  name: "BaseMenubar",
  "extends": script$N,
  props: {
    model: {
      type: Array,
      "default": null
    },
    buttonProps: {
      type: null,
      "default": null
    },
    breakpoint: {
      type: String,
      "default": "960px"
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: MenubarStyle,
  provide: function provide2() {
    return {
      $parentInstance: this
    };
  }
};
var script$1$b = {
  name: "MenubarSub",
  hostName: "Menubar",
  "extends": script$N,
  emits: ["item-mouseenter", "item-click"],
  props: {
    items: {
      type: Array,
      "default": null
    },
    root: {
      type: Boolean,
      "default": false
    },
    popup: {
      type: Boolean,
      "default": false
    },
    mobileActive: {
      type: Boolean,
      "default": false
    },
    templates: {
      type: Object,
      "default": null
    },
    level: {
      type: Number,
      "default": 0
    },
    menuId: {
      type: String,
      "default": null
    },
    focusedItemId: {
      type: String,
      "default": null
    },
    activeItemPath: {
      type: Object,
      "default": null
    }
  },
  list: null,
  methods: {
    getItemId: function getItemId(processedItem) {
      return "".concat(this.menuId, "_").concat(processedItem.key);
    },
    getItemKey: function getItemKey(processedItem) {
      return this.getItemId(processedItem);
    },
    getItemProp: function getItemProp(processedItem, name, params) {
      return processedItem && processedItem.item ? ObjectUtils.getItemValue(processedItem.item[name], params) : void 0;
    },
    getItemLabel: function getItemLabel(processedItem) {
      return this.getItemProp(processedItem, "label");
    },
    getItemLabelId: function getItemLabelId(processedItem) {
      return "".concat(this.menuId, "_").concat(processedItem.key, "_label");
    },
    getPTOptions: function getPTOptions(processedItem, index2, key) {
      return this.ptm(key, {
        context: {
          item: processedItem,
          index: index2,
          active: this.isItemActive(processedItem),
          focused: this.isItemFocused(processedItem),
          disabled: this.isItemDisabled(processedItem),
          level: this.level
        }
      });
    },
    isItemActive: function isItemActive(processedItem) {
      return this.activeItemPath.some(function(path) {
        return path.key === processedItem.key;
      });
    },
    isItemVisible: function isItemVisible(processedItem) {
      return this.getItemProp(processedItem, "visible") !== false;
    },
    isItemDisabled: function isItemDisabled(processedItem) {
      return this.getItemProp(processedItem, "disabled");
    },
    isItemFocused: function isItemFocused(processedItem) {
      return this.focusedItemId === this.getItemId(processedItem);
    },
    isItemGroup: function isItemGroup(processedItem) {
      return ObjectUtils.isNotEmpty(processedItem.items);
    },
    onItemClick: function onItemClick(event2, processedItem) {
      this.getItemProp(processedItem, "command", {
        originalEvent: event2,
        item: processedItem.item
      });
      this.$emit("item-click", {
        originalEvent: event2,
        processedItem,
        isFocus: true
      });
    },
    onItemMouseEnter: function onItemMouseEnter(event2, processedItem) {
      this.$emit("item-mouseenter", {
        originalEvent: event2,
        processedItem
      });
    },
    getAriaSetSize: function getAriaSetSize() {
      var _this = this;
      return this.items.filter(function(processedItem) {
        return _this.isItemVisible(processedItem) && !_this.getItemProp(processedItem, "separator");
      }).length;
    },
    getAriaPosInset: function getAriaPosInset(index2) {
      var _this2 = this;
      return index2 - this.items.slice(0, index2).filter(function(processedItem) {
        return _this2.isItemVisible(processedItem) && _this2.getItemProp(processedItem, "separator");
      }).length + 1;
    },
    getMenuItemProps: function getMenuItemProps(processedItem, index2) {
      return {
        action: mergeProps({
          "class": this.cx("action"),
          tabindex: -1,
          "aria-hidden": true
        }, this.getPTOptions(processedItem, index2, "action")),
        icon: mergeProps({
          "class": [this.cx("icon"), this.getItemProp(processedItem, "icon")]
        }, this.getPTOptions(processedItem, index2, "icon")),
        label: mergeProps({
          "class": this.cx("label")
        }, this.getPTOptions(processedItem, index2, "label")),
        submenuicon: mergeProps({
          "class": this.cx("submenuIcon")
        }, this.getPTOptions(processedItem, index2, "submenuIcon"))
      };
    }
  },
  components: {
    AngleRightIcon: script$J,
    AngleDownIcon: script$K
  },
  directives: {
    ripple: Ripple
  }
};
var _hoisted_1$1$2 = ["id", "aria-label", "aria-disabled", "aria-expanded", "aria-haspopup", "aria-level", "aria-setsize", "aria-posinset", "data-p-highlight", "data-p-focused", "data-p-disabled"];
var _hoisted_2$v = ["onClick", "onMouseenter"];
var _hoisted_3$h = ["href", "target"];
var _hoisted_4$g = ["id"];
var _hoisted_5$e = ["id"];
function render$1$2(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_MenubarSub = resolveComponent("MenubarSub", true);
  var _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("ul", mergeProps({
    "class": $props.level === 0 ? _ctx.cx("menu") : _ctx.cx("submenu")
  }, $props.level === 0 ? _ctx.ptm("menu") : _ctx.ptm("submenu")), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.items, function(processedItem, index2) {
    return openBlock(), createElementBlock(Fragment, {
      key: $options.getItemKey(processedItem)
    }, [$options.isItemVisible(processedItem) && !$options.getItemProp(processedItem, "separator") ? (openBlock(), createElementBlock("li", mergeProps({
      key: 0,
      id: $options.getItemId(processedItem),
      style: $options.getItemProp(processedItem, "style"),
      "class": [_ctx.cx("menuitem", {
        processedItem
      }), $options.getItemProp(processedItem, "class")],
      role: "menuitem",
      "aria-label": $options.getItemLabel(processedItem),
      "aria-disabled": $options.isItemDisabled(processedItem) || void 0,
      "aria-expanded": $options.isItemGroup(processedItem) ? $options.isItemActive(processedItem) : void 0,
      "aria-haspopup": $options.isItemGroup(processedItem) && !$options.getItemProp(processedItem, "to") ? "menu" : void 0,
      "aria-level": $props.level + 1,
      "aria-setsize": $options.getAriaSetSize(),
      "aria-posinset": $options.getAriaPosInset(index2)
    }, $options.getPTOptions(processedItem, index2, "menuitem"), {
      "data-p-highlight": $options.isItemActive(processedItem),
      "data-p-focused": $options.isItemFocused(processedItem),
      "data-p-disabled": $options.isItemDisabled(processedItem)
    }), [createBaseVNode("div", mergeProps({
      "class": _ctx.cx("content"),
      onClick: function onClick3($event) {
        return $options.onItemClick($event, processedItem);
      },
      onMouseenter: function onMouseenter($event) {
        return $options.onItemMouseEnter($event, processedItem);
      }
    }, $options.getPTOptions(processedItem, index2, "content")), [!$props.templates.item ? withDirectives((openBlock(), createElementBlock("a", mergeProps({
      key: 0,
      href: $options.getItemProp(processedItem, "url"),
      "class": _ctx.cx("action"),
      target: $options.getItemProp(processedItem, "target"),
      tabindex: "-1",
      "aria-hidden": "true"
    }, $options.getPTOptions(processedItem, index2, "action")), [$props.templates.itemicon ? (openBlock(), createBlock(resolveDynamicComponent($props.templates.itemicon), {
      key: 0,
      item: processedItem.item,
      "class": normalizeClass([_ctx.cx("icon"), $options.getItemProp(processedItem, "icon")])
    }, null, 8, ["item", "class"])) : $options.getItemProp(processedItem, "icon") ? (openBlock(), createElementBlock("span", mergeProps({
      key: 1,
      "class": [_ctx.cx("icon"), $options.getItemProp(processedItem, "icon")]
    }, $options.getPTOptions(processedItem, index2, "icon")), null, 16)) : createCommentVNode("", true), createBaseVNode("span", mergeProps({
      id: $options.getItemLabelId(processedItem),
      "class": _ctx.cx("label")
    }, $options.getPTOptions(processedItem, index2, "label")), toDisplayString($options.getItemLabel(processedItem)), 17, _hoisted_4$g), $options.getItemProp(processedItem, "items") ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [$props.templates.submenuicon ? (openBlock(), createBlock(resolveDynamicComponent($props.templates.submenuicon), {
      key: 0,
      root: $props.root,
      active: $options.isItemActive(processedItem),
      "class": normalizeClass(_ctx.cx("submenuIcon"))
    }, null, 8, ["root", "active", "class"])) : (openBlock(), createBlock(resolveDynamicComponent($props.root ? "AngleDownIcon" : "AngleRightIcon"), mergeProps({
      key: 1,
      "class": _ctx.cx("submenuIcon")
    }, $options.getPTOptions(processedItem, index2, "submenuIcon")), null, 16, ["class"]))], 64)) : createCommentVNode("", true)], 16, _hoisted_3$h)), [[_directive_ripple]]) : (openBlock(), createBlock(resolveDynamicComponent($props.templates.item), {
      key: 1,
      item: processedItem.item,
      root: $props.root,
      hasSubmenu: $options.getItemProp(processedItem, "items"),
      label: $options.getItemLabel(processedItem),
      props: $options.getMenuItemProps(processedItem, index2)
    }, null, 8, ["item", "root", "hasSubmenu", "label", "props"]))], 16, _hoisted_2$v), $options.isItemVisible(processedItem) && $options.isItemGroup(processedItem) ? (openBlock(), createBlock(_component_MenubarSub, {
      key: 0,
      menuId: $props.menuId,
      role: "menu",
      style: normalizeStyle(_ctx.sx("submenu", true, {
        processedItem
      })),
      focusedItemId: $props.focusedItemId,
      items: processedItem.items,
      mobileActive: $props.mobileActive,
      activeItemPath: $props.activeItemPath,
      templates: $props.templates,
      level: $props.level + 1,
      "aria-labelledby": $options.getItemLabelId(processedItem),
      pt: _ctx.pt,
      unstyled: _ctx.unstyled,
      onItemClick: _cache[0] || (_cache[0] = function($event) {
        return _ctx.$emit("item-click", $event);
      }),
      onItemMouseenter: _cache[1] || (_cache[1] = function($event) {
        return _ctx.$emit("item-mouseenter", $event);
      })
    }, null, 8, ["menuId", "style", "focusedItemId", "items", "mobileActive", "activeItemPath", "templates", "level", "aria-labelledby", "pt", "unstyled"])) : createCommentVNode("", true)], 16, _hoisted_1$1$2)) : createCommentVNode("", true), $options.isItemVisible(processedItem) && $options.getItemProp(processedItem, "separator") ? (openBlock(), createElementBlock("li", mergeProps({
      key: 1,
      id: $options.getItemId(processedItem),
      "class": [_ctx.cx("separator"), $options.getItemProp(processedItem, "class")],
      style: $options.getItemProp(processedItem, "style"),
      role: "separator"
    }, _ctx.ptm("separator")), null, 16, _hoisted_5$e)) : createCommentVNode("", true)], 64);
  }), 128))], 16);
}
script$1$b.render = render$1$2;
var script$I = {
  name: "Menubar",
  "extends": script$2$2,
  emits: ["focus", "blur"],
  matchMediaListener: null,
  data: function data() {
    return {
      id: this.$attrs.id,
      mobileActive: false,
      focused: false,
      focusedItemInfo: {
        index: -1,
        level: 0,
        parentKey: ""
      },
      activeItemPath: [],
      dirty: false,
      query: null,
      queryMatches: false
    };
  },
  watch: {
    "$attrs.id": function $attrsId(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    activeItemPath: function activeItemPath(newPath) {
      if (ObjectUtils.isNotEmpty(newPath)) {
        this.bindOutsideClickListener();
        this.bindResizeListener();
      } else {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
      }
    }
  },
  outsideClickListener: null,
  container: null,
  menubar: null,
  mounted: function mounted3() {
    this.id = this.id || UniqueComponentId();
    this.bindMatchMediaListener();
  },
  beforeUnmount: function beforeUnmount2() {
    this.mobileActive = false;
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    this.unbindMatchMediaListener();
    if (this.container) {
      ZIndexUtils.clear(this.container);
    }
    this.container = null;
  },
  methods: {
    getItemProp: function getItemProp2(item2, name) {
      return item2 ? ObjectUtils.getItemValue(item2[name]) : void 0;
    },
    getItemLabel: function getItemLabel2(item2) {
      return this.getItemProp(item2, "label");
    },
    isItemDisabled: function isItemDisabled2(item2) {
      return this.getItemProp(item2, "disabled");
    },
    isItemGroup: function isItemGroup2(item2) {
      return ObjectUtils.isNotEmpty(this.getItemProp(item2, "items"));
    },
    isItemSeparator: function isItemSeparator(item2) {
      return this.getItemProp(item2, "separator");
    },
    getProccessedItemLabel: function getProccessedItemLabel(processedItem) {
      return processedItem ? this.getItemLabel(processedItem.item) : void 0;
    },
    isProccessedItemGroup: function isProccessedItemGroup(processedItem) {
      return processedItem && ObjectUtils.isNotEmpty(processedItem.items);
    },
    toggle: function toggle(event2) {
      var _this = this;
      if (this.mobileActive) {
        this.mobileActive = false;
        ZIndexUtils.clear(this.menubar);
        this.hide();
      } else {
        this.mobileActive = true;
        ZIndexUtils.set("menu", this.menubar, this.$primevue.config.zIndex.menu);
        setTimeout(function() {
          _this.show();
        }, 1);
      }
      this.bindOutsideClickListener();
      event2.preventDefault();
    },
    show: function show() {
      this.focusedItemInfo = {
        index: this.findFirstFocusedItemIndex(),
        level: 0,
        parentKey: ""
      };
      DomHandler.focus(this.menubar);
    },
    hide: function hide(event2, isFocus) {
      var _this2 = this;
      if (this.mobileActive) {
        this.mobileActive = false;
        setTimeout(function() {
          DomHandler.focus(_this2.$refs.menubutton);
        }, 0);
      }
      this.activeItemPath = [];
      this.focusedItemInfo = {
        index: -1,
        level: 0,
        parentKey: ""
      };
      isFocus && DomHandler.focus(this.menubar);
      this.dirty = false;
    },
    onFocus: function onFocus(event2) {
      this.focused = true;
      this.focusedItemInfo = this.focusedItemInfo.index !== -1 ? this.focusedItemInfo : {
        index: this.findFirstFocusedItemIndex(),
        level: 0,
        parentKey: ""
      };
      this.$emit("focus", event2);
    },
    onBlur: function onBlur(event2) {
      this.focused = false;
      this.focusedItemInfo = {
        index: -1,
        level: 0,
        parentKey: ""
      };
      this.searchValue = "";
      this.dirty = false;
      this.$emit("blur", event2);
    },
    onKeyDown: function onKeyDown(event2) {
      var metaKey = event2.metaKey || event2.ctrlKey;
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2);
          break;
        case "ArrowLeft":
          this.onArrowLeftKey(event2);
          break;
        case "ArrowRight":
          this.onArrowRightKey(event2);
          break;
        case "Home":
          this.onHomeKey(event2);
          break;
        case "End":
          this.onEndKey(event2);
          break;
        case "Space":
          this.onSpaceKey(event2);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2);
          break;
        case "PageDown":
        case "PageUp":
        case "Backspace":
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event2.key)) {
            this.searchItems(event2, event2.key);
          }
          break;
      }
    },
    onItemChange: function onItemChange(event2) {
      var processedItem = event2.processedItem, isFocus = event2.isFocus;
      if (ObjectUtils.isEmpty(processedItem))
        return;
      var index2 = processedItem.index, key = processedItem.key, level = processedItem.level, parentKey = processedItem.parentKey, items2 = processedItem.items;
      var grouped = ObjectUtils.isNotEmpty(items2);
      var activeItemPath2 = this.activeItemPath.filter(function(p2) {
        return p2.parentKey !== parentKey && p2.parentKey !== key;
      });
      grouped && activeItemPath2.push(processedItem);
      this.focusedItemInfo = {
        index: index2,
        level,
        parentKey
      };
      this.activeItemPath = activeItemPath2;
      grouped && (this.dirty = true);
      isFocus && DomHandler.focus(this.menubar);
    },
    onItemClick: function onItemClick2(event2) {
      var originalEvent = event2.originalEvent, processedItem = event2.processedItem;
      var grouped = this.isProccessedItemGroup(processedItem);
      var root10 = ObjectUtils.isEmpty(processedItem.parent);
      var selected = this.isSelected(processedItem);
      if (selected) {
        var index2 = processedItem.index, key = processedItem.key, level = processedItem.level, parentKey = processedItem.parentKey;
        this.activeItemPath = this.activeItemPath.filter(function(p2) {
          return key !== p2.key && key.startsWith(p2.key);
        });
        this.focusedItemInfo = {
          index: index2,
          level,
          parentKey
        };
        this.dirty = !root10;
        DomHandler.focus(this.menubar);
      } else {
        if (grouped) {
          this.onItemChange(event2);
        } else {
          var rootProcessedItem = root10 ? processedItem : this.activeItemPath.find(function(p2) {
            return p2.parentKey === "";
          });
          this.hide(originalEvent);
          this.changeFocusedItemIndex(originalEvent, rootProcessedItem ? rootProcessedItem.index : -1);
          this.mobileActive = false;
          DomHandler.focus(this.menubar);
        }
      }
    },
    onItemMouseEnter: function onItemMouseEnter2(event2) {
      if (!this.mobileActive && this.dirty) {
        this.onItemChange(event2);
      }
    },
    menuButtonClick: function menuButtonClick(event2) {
      this.toggle(event2);
    },
    menuButtonKeydown: function menuButtonKeydown(event2) {
      (event2.code === "Enter" || event2.code === "NumpadEnter" || event2.code === "Space") && this.menuButtonClick(event2);
    },
    onArrowDownKey: function onArrowDownKey(event2) {
      var processedItem = this.visibleItems[this.focusedItemInfo.index];
      var root10 = processedItem ? ObjectUtils.isEmpty(processedItem.parent) : null;
      if (root10) {
        var grouped = this.isProccessedItemGroup(processedItem);
        if (grouped) {
          this.onItemChange({
            originalEvent: event2,
            processedItem
          });
          this.focusedItemInfo = {
            index: -1,
            parentKey: processedItem.key
          };
          this.onArrowRightKey(event2);
        }
      } else {
        var itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();
        this.changeFocusedItemIndex(event2, itemIndex);
      }
      event2.preventDefault();
    },
    onArrowUpKey: function onArrowUpKey(event2) {
      var _this3 = this;
      var processedItem = this.visibleItems[this.focusedItemInfo.index];
      var root10 = ObjectUtils.isEmpty(processedItem.parent);
      if (root10) {
        var grouped = this.isProccessedItemGroup(processedItem);
        if (grouped) {
          this.onItemChange({
            originalEvent: event2,
            processedItem
          });
          this.focusedItemInfo = {
            index: -1,
            parentKey: processedItem.key
          };
          var itemIndex = this.findLastItemIndex();
          this.changeFocusedItemIndex(event2, itemIndex);
        }
      } else {
        var parentItem = this.activeItemPath.find(function(p2) {
          return p2.key === processedItem.parentKey;
        });
        if (this.focusedItemInfo.index === 0) {
          this.focusedItemInfo = {
            index: -1,
            parentKey: parentItem ? parentItem.parentKey : ""
          };
          this.searchValue = "";
          this.onArrowLeftKey(event2);
          this.activeItemPath = this.activeItemPath.filter(function(p2) {
            return p2.parentKey !== _this3.focusedItemInfo.parentKey;
          });
        } else {
          var _itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();
          this.changeFocusedItemIndex(event2, _itemIndex);
        }
      }
      event2.preventDefault();
    },
    onArrowLeftKey: function onArrowLeftKey(event2) {
      var _this4 = this;
      var processedItem = this.visibleItems[this.focusedItemInfo.index];
      var parentItem = processedItem ? this.activeItemPath.find(function(p2) {
        return p2.key === processedItem.parentKey;
      }) : null;
      if (parentItem) {
        this.onItemChange({
          originalEvent: event2,
          processedItem: parentItem
        });
        this.activeItemPath = this.activeItemPath.filter(function(p2) {
          return p2.parentKey !== _this4.focusedItemInfo.parentKey;
        });
        event2.preventDefault();
      } else {
        var itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();
        this.changeFocusedItemIndex(event2, itemIndex);
        event2.preventDefault();
      }
    },
    onArrowRightKey: function onArrowRightKey(event2) {
      var processedItem = this.visibleItems[this.focusedItemInfo.index];
      var parentItem = processedItem ? this.activeItemPath.find(function(p2) {
        return p2.key === processedItem.parentKey;
      }) : null;
      if (parentItem) {
        var grouped = this.isProccessedItemGroup(processedItem);
        if (grouped) {
          this.onItemChange({
            originalEvent: event2,
            processedItem
          });
          this.focusedItemInfo = {
            index: -1,
            parentKey: processedItem.key
          };
          this.onArrowDownKey(event2);
        }
      } else {
        var itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();
        this.changeFocusedItemIndex(event2, itemIndex);
        event2.preventDefault();
      }
    },
    onHomeKey: function onHomeKey(event2) {
      this.changeFocusedItemIndex(event2, this.findFirstItemIndex());
      event2.preventDefault();
    },
    onEndKey: function onEndKey(event2) {
      this.changeFocusedItemIndex(event2, this.findLastItemIndex());
      event2.preventDefault();
    },
    onEnterKey: function onEnterKey(event2) {
      if (this.focusedItemInfo.index !== -1) {
        var element = DomHandler.findSingle(this.menubar, 'li[id="'.concat("".concat(this.focusedItemId), '"]'));
        var anchorElement = element && DomHandler.findSingle(element, 'a[data-pc-section="action"]');
        anchorElement ? anchorElement.click() : element && element.click();
        var processedItem = this.visibleItems[this.focusedItemInfo.index];
        var grouped = this.isProccessedItemGroup(processedItem);
        !grouped && (this.focusedItemInfo.index = this.findFirstFocusedItemIndex());
      }
      event2.preventDefault();
    },
    onSpaceKey: function onSpaceKey(event2) {
      this.onEnterKey(event2);
    },
    onEscapeKey: function onEscapeKey(event2) {
      this.hide(event2, true);
      this.focusedItemInfo.index = this.findFirstFocusedItemIndex();
      event2.preventDefault();
    },
    onTabKey: function onTabKey(event2) {
      if (this.focusedItemInfo.index !== -1) {
        var processedItem = this.visibleItems[this.focusedItemInfo.index];
        var grouped = this.isProccessedItemGroup(processedItem);
        !grouped && this.onItemChange({
          originalEvent: event2,
          processedItem
        });
      }
      this.hide();
    },
    bindOutsideClickListener: function bindOutsideClickListener() {
      var _this5 = this;
      if (!this.outsideClickListener) {
        this.outsideClickListener = function(event2) {
          var isOutsideContainer = _this5.container && !_this5.container.contains(event2.target);
          var isOutsideTarget = !(_this5.target && (_this5.target === event2.target || _this5.target.contains(event2.target)));
          if (isOutsideContainer && isOutsideTarget) {
            _this5.hide();
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener: function unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindResizeListener: function bindResizeListener() {
      var _this6 = this;
      if (!this.resizeListener) {
        this.resizeListener = function(event2) {
          if (!DomHandler.isTouchDevice()) {
            _this6.hide(event2, true);
          }
          _this6.mobileActive = false;
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener: function unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    bindMatchMediaListener: function bindMatchMediaListener() {
      var _this7 = this;
      if (!this.matchMediaListener) {
        var query = matchMedia("(max-width: ".concat(this.breakpoint, ")"));
        this.query = query;
        this.queryMatches = query.matches;
        this.matchMediaListener = function() {
          _this7.queryMatches = query.matches;
          _this7.mobileActive = false;
        };
        this.query.addEventListener("change", this.matchMediaListener);
      }
    },
    unbindMatchMediaListener: function unbindMatchMediaListener() {
      if (this.matchMediaListener) {
        this.query.removeEventListener("change", this.matchMediaListener);
        this.matchMediaListener = null;
      }
    },
    isItemMatched: function isItemMatched(processedItem) {
      var _this$getProccessedIt;
      return this.isValidItem(processedItem) && ((_this$getProccessedIt = this.getProccessedItemLabel(processedItem)) === null || _this$getProccessedIt === void 0 ? void 0 : _this$getProccessedIt.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()));
    },
    isValidItem: function isValidItem(processedItem) {
      return !!processedItem && !this.isItemDisabled(processedItem.item) && !this.isItemSeparator(processedItem.item);
    },
    isValidSelectedItem: function isValidSelectedItem(processedItem) {
      return this.isValidItem(processedItem) && this.isSelected(processedItem);
    },
    isSelected: function isSelected(processedItem) {
      return this.activeItemPath.some(function(p2) {
        return p2.key === processedItem.key;
      });
    },
    findFirstItemIndex: function findFirstItemIndex() {
      var _this8 = this;
      return this.visibleItems.findIndex(function(processedItem) {
        return _this8.isValidItem(processedItem);
      });
    },
    findLastItemIndex: function findLastItemIndex() {
      var _this9 = this;
      return ObjectUtils.findLastIndex(this.visibleItems, function(processedItem) {
        return _this9.isValidItem(processedItem);
      });
    },
    findNextItemIndex: function findNextItemIndex(index2) {
      var _this10 = this;
      var matchedItemIndex = index2 < this.visibleItems.length - 1 ? this.visibleItems.slice(index2 + 1).findIndex(function(processedItem) {
        return _this10.isValidItem(processedItem);
      }) : -1;
      return matchedItemIndex > -1 ? matchedItemIndex + index2 + 1 : index2;
    },
    findPrevItemIndex: function findPrevItemIndex(index2) {
      var _this11 = this;
      var matchedItemIndex = index2 > 0 ? ObjectUtils.findLastIndex(this.visibleItems.slice(0, index2), function(processedItem) {
        return _this11.isValidItem(processedItem);
      }) : -1;
      return matchedItemIndex > -1 ? matchedItemIndex : index2;
    },
    findSelectedItemIndex: function findSelectedItemIndex() {
      var _this12 = this;
      return this.visibleItems.findIndex(function(processedItem) {
        return _this12.isValidSelectedItem(processedItem);
      });
    },
    findFirstFocusedItemIndex: function findFirstFocusedItemIndex() {
      var selectedIndex = this.findSelectedItemIndex();
      return selectedIndex < 0 ? this.findFirstItemIndex() : selectedIndex;
    },
    findLastFocusedItemIndex: function findLastFocusedItemIndex() {
      var selectedIndex = this.findSelectedItemIndex();
      return selectedIndex < 0 ? this.findLastItemIndex() : selectedIndex;
    },
    searchItems: function searchItems(event2, _char) {
      var _this13 = this;
      this.searchValue = (this.searchValue || "") + _char;
      var itemIndex = -1;
      var matched = false;
      if (this.focusedItemInfo.index !== -1) {
        itemIndex = this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(processedItem) {
          return _this13.isItemMatched(processedItem);
        });
        itemIndex = itemIndex === -1 ? this.visibleItems.slice(0, this.focusedItemInfo.index).findIndex(function(processedItem) {
          return _this13.isItemMatched(processedItem);
        }) : itemIndex + this.focusedItemInfo.index;
      } else {
        itemIndex = this.visibleItems.findIndex(function(processedItem) {
          return _this13.isItemMatched(processedItem);
        });
      }
      if (itemIndex !== -1) {
        matched = true;
      }
      if (itemIndex === -1 && this.focusedItemInfo.index === -1) {
        itemIndex = this.findFirstFocusedItemIndex();
      }
      if (itemIndex !== -1) {
        this.changeFocusedItemIndex(event2, itemIndex);
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(function() {
        _this13.searchValue = "";
        _this13.searchTimeout = null;
      }, 500);
      return matched;
    },
    changeFocusedItemIndex: function changeFocusedItemIndex(event2, index2) {
      if (this.focusedItemInfo.index !== index2) {
        this.focusedItemInfo.index = index2;
        this.scrollInView();
      }
    },
    scrollInView: function scrollInView2() {
      var index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      var id = index2 !== -1 ? "".concat(this.id, "_").concat(index2) : this.focusedItemId;
      var element = DomHandler.findSingle(this.menubar, 'li[id="'.concat(id, '"]'));
      if (element) {
        element.scrollIntoView && element.scrollIntoView({
          block: "nearest",
          inline: "start"
        });
      }
    },
    createProcessedItems: function createProcessedItems(items2) {
      var _this14 = this;
      var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      var parent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var parentKey = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "";
      var processedItems2 = [];
      items2 && items2.forEach(function(item2, index2) {
        var key = (parentKey !== "" ? parentKey + "_" : "") + index2;
        var newItem = {
          item: item2,
          index: index2,
          level,
          key,
          parent,
          parentKey
        };
        newItem["items"] = _this14.createProcessedItems(item2.items, level + 1, newItem, key);
        processedItems2.push(newItem);
      });
      return processedItems2;
    },
    containerRef: function containerRef(el) {
      this.container = el;
    },
    menubarRef: function menubarRef(el) {
      this.menubar = el ? el.$el : void 0;
    }
  },
  computed: {
    processedItems: function processedItems() {
      return this.createProcessedItems(this.model || []);
    },
    visibleItems: function visibleItems() {
      var _this15 = this;
      var processedItem = this.activeItemPath.find(function(p2) {
        return p2.key === _this15.focusedItemInfo.parentKey;
      });
      return processedItem ? processedItem.items : this.processedItems;
    },
    focusedItemId: function focusedItemId() {
      return this.focusedItemInfo.index !== -1 ? "".concat(this.id).concat(ObjectUtils.isNotEmpty(this.focusedItemInfo.parentKey) ? "_" + this.focusedItemInfo.parentKey : "", "_").concat(this.focusedItemInfo.index) : null;
    }
  },
  components: {
    MenubarSub: script$1$b,
    BarsIcon: script$L
  }
};
function _typeof$j(o) {
  "@babel/helpers - typeof";
  return _typeof$j = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$j(o);
}
function ownKeys$g(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$g(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$g(Object(t), true).forEach(function(r2) {
      _defineProperty$i(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$g(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$i(obj, key, value) {
  key = _toPropertyKey$i(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$i(t) {
  var i = _toPrimitive$i(t, "string");
  return "symbol" == _typeof$j(i) ? i : String(i);
}
function _toPrimitive$i(t, r) {
  if ("object" != _typeof$j(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$j(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$B = ["aria-haspopup", "aria-expanded", "aria-controls", "aria-label"];
function render$G(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_BarsIcon = resolveComponent("BarsIcon");
  var _component_MenubarSub = resolveComponent("MenubarSub");
  return openBlock(), createElementBlock("div", mergeProps({
    ref: $options.containerRef,
    "class": _ctx.cx("root")
  }, _ctx.ptm("root")), [_ctx.$slots.start ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    "class": _ctx.cx("start")
  }, _ctx.ptm("start")), [renderSlot(_ctx.$slots, "start")], 16)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "menubutton", {
    id: $data.id,
    "class": normalizeClass(_ctx.cx("button")),
    toggleCallback: function toggleCallback(event2) {
      return $options.menuButtonClick(event2);
    }
  }, function() {
    var _ctx$$primevue$config;
    return [_ctx.model && _ctx.model.length > 0 ? (openBlock(), createElementBlock("a", mergeProps({
      key: 0,
      ref: "menubutton",
      role: "button",
      tabindex: "0",
      "class": _ctx.cx("button"),
      "aria-haspopup": _ctx.model.length && _ctx.model.length > 0 ? true : false,
      "aria-expanded": $data.mobileActive,
      "aria-controls": $data.id,
      "aria-label": (_ctx$$primevue$config = _ctx.$primevue.config.locale.aria) === null || _ctx$$primevue$config === void 0 ? void 0 : _ctx$$primevue$config.navigation,
      onClick: _cache[0] || (_cache[0] = function($event) {
        return $options.menuButtonClick($event);
      }),
      onKeydown: _cache[1] || (_cache[1] = function($event) {
        return $options.menuButtonKeydown($event);
      })
    }, _objectSpread$g(_objectSpread$g({}, _ctx.buttonProps), _ctx.ptm("button"))), [renderSlot(_ctx.$slots, "menubuttonicon", {}, function() {
      return [createVNode(_component_BarsIcon, normalizeProps(guardReactiveProps(_ctx.ptm("menubuttonicon"))), null, 16)];
    })], 16, _hoisted_1$B)) : createCommentVNode("", true)];
  }), createVNode(_component_MenubarSub, {
    ref: $options.menubarRef,
    id: $data.id,
    role: "menubar",
    items: $options.processedItems,
    templates: _ctx.$slots,
    root: true,
    mobileActive: $data.mobileActive,
    tabindex: "0",
    "aria-activedescendant": $data.focused ? $options.focusedItemId : void 0,
    menuId: $data.id,
    focusedItemId: $data.focused ? $options.focusedItemId : void 0,
    activeItemPath: $data.activeItemPath,
    level: 0,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    pt: _ctx.pt,
    unstyled: _ctx.unstyled,
    onFocus: $options.onFocus,
    onBlur: $options.onBlur,
    onKeydown: $options.onKeyDown,
    onItemClick: $options.onItemClick,
    onItemMouseenter: $options.onItemMouseEnter
  }, null, 8, ["id", "items", "templates", "mobileActive", "aria-activedescendant", "menuId", "focusedItemId", "activeItemPath", "aria-labelledby", "aria-label", "pt", "unstyled", "onFocus", "onBlur", "onKeydown", "onItemClick", "onItemMouseenter"]), _ctx.$slots.end ? (openBlock(), createElementBlock("div", mergeProps({
    key: 1,
    "class": _ctx.cx("end")
  }, _ctx.ptm("end")), [renderSlot(_ctx.$slots, "end")], 16)) : createCommentVNode("", true)], 16);
}
script$I.render = render$G;
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$7 = {
  data() {
    return {
      items: [
        {
          label: "Главная",
          icon: "fa-solid fa-igloo",
          command: () => {
            this.$router.push("/");
          }
        },
        {
          label: "Образование",
          icon: "fa-solid fa-graduation-cap",
          command: () => {
            this.$router.push("/education");
          }
        },
        {
          label: "Опыт работы",
          icon: "fa-solid fa-address-card",
          command: () => {
            this.$router.push("/experience");
          }
        },
        {
          label: "Портфолио",
          icon: "fa-solid fa-folder-open",
          command: () => {
            this.$router.push("/portfolio");
          }
        },
        {
          label: "О себе",
          icon: "fa-solid fa-user-check",
          command: () => {
            this.$router.push("/about");
          }
        },
        {
          label: "Контакты",
          icon: "fa-solid fa-envelope",
          command: () => {
            this.$router.push("/contacts");
          }
        }
      ]
    };
  },
  components: {
    Menubar: script$I
  }
};
const _hoisted_1$A = { class: "ml-2" };
const _hoisted_2$u = { class: "ml-2 btn-text" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_router_link = resolveComponent("router-link");
  const _component_Menubar = resolveComponent("Menubar");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_Menubar, {
      class: "mbr",
      model: $data.items
    }, {
      item: withCtx(({ item: item2, props }) => [
        item2.route ? (openBlock(), createBlock(_component_router_link, {
          key: 0,
          to: item2.route,
          custom: ""
        }, {
          default: withCtx(({ href, navigate }) => [
            createVNode(_component_Button, mergeProps({
              class: "btn",
              href
            }, props.action, { onClick: navigate }), {
              default: withCtx(() => [
                createBaseVNode("span", {
                  class: normalizeClass(item2.icon)
                }, null, 2),
                createBaseVNode("span", _hoisted_1$A, toDisplayString(item2.label), 1)
              ]),
              _: 2
            }, 1040, ["href", "onClick"])
          ]),
          _: 2
        }, 1032, ["to"])) : (openBlock(), createBlock(_component_Button, mergeProps({
          key: 1,
          class: "btn",
          href: item2.url,
          target: item2.target
        }, props.action), {
          default: withCtx(() => [
            createBaseVNode("span", {
              class: normalizeClass(item2.icon)
            }, null, 2),
            createBaseVNode("span", _hoisted_2$u, toDisplayString(item2.label), 1)
          ]),
          _: 2
        }, 1040, ["href", "target"]))
      ]),
      _: 1
    }, 8, ["model"])
  ]);
}
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = {
  components: {
    Navbar
  }
};
const _hoisted_1$z = { class: "app" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Navbar = resolveComponent("Navbar");
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_Navbar),
    createBaseVNode("div", _hoisted_1$z, [
      createVNode(_component_router_view)
    ])
  ], 64);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
var FilterMatchMode = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  IN: "in",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  BETWEEN: "between",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
var FilterOperator = {
  AND: "and",
  OR: "or"
};
function _createForOfIteratorHelper$2(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$6(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$6(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$6(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$6(o, minLen);
}
function _arrayLikeToArray$6(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var FilterService = {
  filter: function filter2(value, fields, filterValue, filterMatchMode, filterLocale) {
    var filteredItems = [];
    if (!value) {
      return filteredItems;
    }
    var _iterator = _createForOfIteratorHelper$2(value), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var item2 = _step.value;
        if (typeof item2 === "string") {
          if (this.filters[filterMatchMode](item2, filterValue, filterLocale)) {
            filteredItems.push(item2);
            continue;
          }
        } else {
          var _iterator2 = _createForOfIteratorHelper$2(fields), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var field2 = _step2.value;
              var fieldValue = ObjectUtils.resolveFieldData(item2, field2);
              if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
                filteredItems.push(item2);
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return filteredItems;
  },
  filters: {
    startsWith: function startsWith(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains: function contains2(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains: function notContains(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith: function endsWith(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      var filterValue = ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
      var stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals: function equals2(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() === filter4.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) == ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
    },
    notEquals: function notEquals(value, filter4, filterLocale) {
      if (filter4 === void 0 || filter4 === null || filter4 === "") {
        return false;
      }
      if (value === void 0 || value === null) {
        return true;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() !== filter4.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) != ObjectUtils.removeAccents(filter4.toString()).toLocaleLowerCase(filterLocale);
    },
    "in": function _in(value, filter4) {
      if (filter4 === void 0 || filter4 === null || filter4.length === 0) {
        return true;
      }
      for (var i = 0; i < filter4.length; i++) {
        if (ObjectUtils.equals(value, filter4[i])) {
          return true;
        }
      }
      return false;
    },
    between: function between(value, filter4) {
      if (filter4 == null || filter4[0] == null || filter4[1] == null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime)
        return filter4[0].getTime() <= value.getTime() && value.getTime() <= filter4[1].getTime();
      else
        return filter4[0] <= value && value <= filter4[1];
    },
    lt: function lt(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() < filter4.getTime();
      else
        return value < filter4;
    },
    lte: function lte(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() <= filter4.getTime();
      else
        return value <= filter4;
    },
    gt: function gt(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() > filter4.getTime();
      else
        return value > filter4;
    },
    gte: function gte(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter4.getTime)
        return value.getTime() >= filter4.getTime();
      else
        return value >= filter4;
    },
    dateIs: function dateIs(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() === filter4.toDateString();
    },
    dateIsNot: function dateIsNot(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() !== filter4.toDateString();
    },
    dateBefore: function dateBefore(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() < filter4.getTime();
    },
    dateAfter: function dateAfter(value, filter4) {
      if (filter4 === void 0 || filter4 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() > filter4.getTime();
    }
  },
  register: function register(rule, fn) {
    this.filters[rule] = fn;
  }
};
function _typeof$i(o) {
  "@babel/helpers - typeof";
  return _typeof$i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$i(o);
}
function ownKeys$f(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$f(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$f(Object(t), true).forEach(function(r2) {
      _defineProperty$h(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$f(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$h(obj, key, value) {
  key = _toPropertyKey$h(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$h(t) {
  var i = _toPrimitive$h(t, "string");
  return "symbol" == _typeof$i(i) ? i : String(i);
}
function _toPrimitive$h(t, r) {
  if ("object" != _typeof$i(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$i(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var defaultOptions = {
  ripple: false,
  inputStyle: "outlined",
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: false,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    // @deprecated Use 'emptySearchMessage' option instead.
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left"
    }
  },
  filterMatchModeOptions: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  pt: void 0,
  ptOptions: {
    mergeSections: true,
    mergeProps: false
  },
  unstyled: false,
  csp: {
    nonce: void 0
  }
};
var PrimeVueSymbol = Symbol();
function switchTheme(currentTheme, newTheme, linkElementId, callback) {
  if (currentTheme !== newTheme) {
    var linkElement = document.getElementById(linkElementId);
    var cloneLinkElement = linkElement.cloneNode(true);
    var newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
    cloneLinkElement.setAttribute("id", linkElementId + "-clone");
    cloneLinkElement.setAttribute("href", newThemeUrl);
    cloneLinkElement.addEventListener("load", function() {
      linkElement.remove();
      cloneLinkElement.setAttribute("id", linkElementId);
      if (callback) {
        callback();
      }
    });
    linkElement.parentNode && linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
  }
}
var PrimeVue = {
  install: function install(app2, options2) {
    var configOptions = options2 ? _objectSpread$f(_objectSpread$f({}, defaultOptions), options2) : _objectSpread$f({}, defaultOptions);
    var PrimeVue2 = {
      config: reactive(configOptions),
      changeTheme: switchTheme
    };
    app2.config.globalProperties.$primevue = PrimeVue2;
    app2.provide(PrimeVueSymbol, PrimeVue2);
  }
};
var css$7 = "\n@layer primevue {\n    .p-badge {\n        display: inline-block;\n        border-radius: 10px;\n        text-align: center;\n        padding: 0 .5rem;\n    }\n\n    .p-overlay-badge {\n        position: relative;\n    }\n\n    .p-overlay-badge .p-badge {\n        position: absolute;\n        top: 0;\n        right: 0;\n        transform: translate(50%,-50%);\n        transform-origin: 100% 0;\n        margin: 0;\n    }\n\n    .p-badge-dot {\n        width: .5rem;\n        min-width: .5rem;\n        height: .5rem;\n        border-radius: 50%;\n        padding: 0;\n    }\n\n    .p-badge-no-gutter {\n        padding: 0;\n        border-radius: 50%;\n    }\n}\n";
var classes$8 = {
  root: function root2(_ref) {
    var props = _ref.props, instance = _ref.instance;
    return ["p-badge p-component", {
      "p-badge-no-gutter": ObjectUtils.isNotEmpty(props.value) && String(props.value).length === 1,
      "p-badge-dot": ObjectUtils.isEmpty(props.value) && !instance.$slots["default"],
      "p-badge-lg": props.size === "large",
      "p-badge-xl": props.size === "xlarge",
      "p-badge-info": props.severity === "info",
      "p-badge-success": props.severity === "success",
      "p-badge-warning": props.severity === "warning",
      "p-badge-danger": props.severity === "danger"
    }];
  }
};
var BadgeStyle = BaseStyle.extend({
  name: "badge",
  css: css$7,
  classes: classes$8
});
var script$1$a = {
  name: "BaseBadge",
  "extends": script$N,
  props: {
    value: {
      type: [String, Number],
      "default": null
    },
    severity: {
      type: String,
      "default": null
    },
    size: {
      type: String,
      "default": null
    }
  },
  style: BadgeStyle,
  provide: function provide3() {
    return {
      $parentInstance: this
    };
  }
};
var script$H = {
  name: "Badge",
  "extends": script$1$a
};
function render$F(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptm("root"), {
    "data-pc-name": "badge"
  }), [renderSlot(_ctx.$slots, "default", {}, function() {
    return [createTextVNode(toDisplayString(_ctx.value), 1)];
  })], 16);
}
script$H.render = render$F;
var script$G = {
  name: "SpinnerIcon",
  "extends": script$M
};
var _hoisted_1$y = ["clip-path"];
var _hoisted_2$t = /* @__PURE__ */ createBaseVNode("path", {
  d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$g = [_hoisted_2$t];
var _hoisted_4$f = ["id"];
var _hoisted_5$d = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$c = [_hoisted_5$d];
function render$E(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$g, 8, _hoisted_1$y), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$c, 8, _hoisted_4$f)])], 16);
}
script$G.render = render$E;
function _typeof$h(o) {
  "@babel/helpers - typeof";
  return _typeof$h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$h(o);
}
function _defineProperty$g(obj, key, value) {
  key = _toPropertyKey$g(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$g(t) {
  var i = _toPrimitive$g(t, "string");
  return "symbol" == _typeof$h(i) ? i : String(i);
}
function _toPrimitive$g(t, r) {
  if ("object" != _typeof$h(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$h(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var classes$7 = {
  root: function root3(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-button p-component", _defineProperty$g(_defineProperty$g(_defineProperty$g(_defineProperty$g(_defineProperty$g(_defineProperty$g(_defineProperty$g(_defineProperty$g({
      "p-button-icon-only": instance.hasIcon && !props.label && !props.badge,
      "p-button-vertical": (props.iconPos === "top" || props.iconPos === "bottom") && props.label,
      "p-disabled": instance.$attrs.disabled || instance.$attrs.disabled === "" || props.loading,
      "p-button-loading": props.loading,
      "p-button-loading-label-only": props.loading && !instance.hasIcon && props.label,
      "p-button-link": props.link
    }, "p-button-".concat(props.severity), props.severity), "p-button-raised", props.raised), "p-button-rounded", props.rounded), "p-button-text", props.text), "p-button-outlined", props.outlined), "p-button-sm", props.size === "small"), "p-button-lg", props.size === "large"), "p-button-plain", props.plain)];
  },
  loadingIcon: "p-button-loading-icon pi-spin",
  icon: function icon(_ref3) {
    var props = _ref3.props;
    return ["p-button-icon", {
      "p-button-icon-left": props.iconPos === "left" && props.label,
      "p-button-icon-right": props.iconPos === "right" && props.label,
      "p-button-icon-top": props.iconPos === "top" && props.label,
      "p-button-icon-bottom": props.iconPos === "bottom" && props.label
    }];
  },
  label: "p-button-label"
};
var ButtonStyle = BaseStyle.extend({
  name: "button",
  classes: classes$7
});
var script$1$9 = {
  name: "BaseButton",
  "extends": script$N,
  props: {
    label: {
      type: String,
      "default": null
    },
    icon: {
      type: String,
      "default": null
    },
    iconPos: {
      type: String,
      "default": "left"
    },
    iconClass: {
      type: String,
      "default": null
    },
    badge: {
      type: String,
      "default": null
    },
    badgeClass: {
      type: String,
      "default": null
    },
    badgeSeverity: {
      type: String,
      "default": null
    },
    loading: {
      type: Boolean,
      "default": false
    },
    loadingIcon: {
      type: String,
      "default": void 0
    },
    link: {
      type: Boolean,
      "default": false
    },
    severity: {
      type: String,
      "default": null
    },
    raised: {
      type: Boolean,
      "default": false
    },
    rounded: {
      type: Boolean,
      "default": false
    },
    text: {
      type: Boolean,
      "default": false
    },
    outlined: {
      type: Boolean,
      "default": false
    },
    size: {
      type: String,
      "default": null
    },
    plain: {
      type: Boolean,
      "default": false
    }
  },
  style: ButtonStyle,
  provide: function provide4() {
    return {
      $parentInstance: this
    };
  }
};
var script$F = {
  name: "Button",
  "extends": script$1$9,
  methods: {
    getPTOptions: function getPTOptions2(key) {
      return this.ptm(key, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function disabled() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function defaultAriaLabel() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function hasIcon() {
      return this.icon || this.$slots.icon;
    }
  },
  components: {
    SpinnerIcon: script$G,
    Badge: script$H
  },
  directives: {
    ripple: Ripple
  }
};
var _hoisted_1$x = ["aria-label", "disabled", "data-pc-severity"];
function render$D(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  var _component_Badge = resolveComponent("Badge");
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("root"),
    type: "button",
    "aria-label": $options.defaultAriaLabel,
    disabled: $options.disabled
  }, $options.getPTOptions("root"), {
    "data-pc-name": "button",
    "data-pc-severity": _ctx.severity
  }), [renderSlot(_ctx.$slots, "default", {}, function() {
    return [_ctx.loading ? renderSlot(_ctx.$slots, "loadingicon", {
      key: 0,
      "class": normalizeClass([_ctx.cx("loadingIcon"), _ctx.cx("icon")])
    }, function() {
      return [_ctx.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
        key: 0,
        "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon"), _ctx.loadingIcon]
      }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
        key: 1,
        "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon")],
        spin: ""
      }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))];
    }) : renderSlot(_ctx.$slots, "icon", {
      key: 1,
      "class": normalizeClass([_ctx.cx("icon")])
    }, function() {
      return [_ctx.icon ? (openBlock(), createElementBlock("span", mergeProps({
        key: 0,
        "class": [_ctx.cx("icon"), _ctx.icon, _ctx.iconClass]
      }, _ctx.ptm("icon")), null, 16)) : createCommentVNode("", true)];
    }), createBaseVNode("span", mergeProps({
      "class": _ctx.cx("label")
    }, _ctx.ptm("label")), toDisplayString(_ctx.label || " "), 17), _ctx.badge ? (openBlock(), createBlock(_component_Badge, mergeProps({
      key: 2,
      value: _ctx.badge,
      "class": _ctx.badgeClass,
      severity: _ctx.badgeSeverity,
      unstyled: _ctx.unstyled
    }, _ctx.ptm("badge")), null, 16, ["value", "class", "severity", "unstyled"])) : createCommentVNode("", true)];
  })], 16, _hoisted_1$x)), [[_directive_ripple]]);
}
script$F.render = render$D;
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray2(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray2 = Array.isArray;
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray2(a) ? isEquivalentArray(a, b) : isArray2(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray2(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index2 = listeners.indexOf(callback);
      if (index2 > -1)
        listeners.splice(index2, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true
  });
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history2.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor, and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data17) {
    const state = assign({}, history2.state, buildState(
      historyState.value.back,
      // keep back and forward entries but override current position
      to,
      historyState.value.forward,
      true
    ), data17, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data17) {
    const currentState2 = assign(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState2.current, currentState2, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState2.position + 1 }, data17);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    // it's overridden right after
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function createWebHashHistory(base) {
  base = location.host ? base || location.pathname + location.search : "";
  if (!base.includes("#"))
    base += "#";
  return createWebHistory(base);
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options2 = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options2.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options2.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options2.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options2.strict && options2.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options2.strict)
    pattern += "/?";
  if (options2.end)
    pattern += "$";
  else if (options2.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options2.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify2(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray2(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text2 = isArray2(param) ? param.join("/") : param;
          if (!text2) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text2;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify: stringify2
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options2) {
  const parser = tokensToParser(tokenizePath(record.path), options2);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options2 = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          // we might be the child of an alias
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options2);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
        insertMatcher(matcher);
      }
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index2 = matchers.indexOf(matcherRef);
      if (index2 > -1) {
        matchers.splice(index2, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options2 = {};
  for (const key in defaults) {
    options2[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options2;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text2) {
  return encodeURI("" + text2).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text2) {
  return commonEncode(text2).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text2) {
  return commonEncode(text2).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text2) {
  return encodeQueryValue(text2).replace(EQUAL_RE, "%3D");
}
function encodePath(text2) {
  return commonEncode(text2).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text2) {
  return text2 == null ? "" : encodePath(text2).replace(SLASH_RE, "%2F");
}
function decode(text2) {
  try {
    return decodeURIComponent("" + text2);
  } catch (err) {
  }
  return "" + text2;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray2(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray2(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray2(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add2(handler7) {
    handlers.push(handler7);
    return () => {
      const i = handlers.indexOf(handler7);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add: add2,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options2 = rawComponent.__vccOpts || rawComponent;
        const guard = options2[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options2 = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options2[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => router2.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1)
      return index2;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options: options2 } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options2.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options2.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray2(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data17) {
  if (!slot)
    return null;
  const slotContent = slot(data17);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options2) {
  const matcher = createRouterMatcher(options2.routes, options2);
  const parseQuery$1 = options2.parseQuery || parseQuery;
  const stringifyQuery$1 = options2.stringifyQuery || stringifyQuery;
  const routerHistory = options2.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options2.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in newTargetLocation ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data17 = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data17, shouldRedirect.state) : data17,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data17, failure2.to.state) : data17,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data17);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray2(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data17) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data17));
      else
        routerHistory.push(toLocation.fullPath, data17);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            error.to,
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler7) => handler7(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve22, reject) => {
      readyHandlers.add([resolve22, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options2;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options: options2,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router22 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router22;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router22);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const _imports_0$3 = "" + new URL("Hello-fhnuFBnL.png", import.meta.url).href;
const _imports_1 = "" + new URL("my-photo-bcg7wWUh.png", import.meta.url).href;
const _sfc_main$5 = {
  name: "Home"
};
const _hoisted_1$w = { class: "main" };
const _hoisted_2$s = /* @__PURE__ */ createStaticVNode('<div class="head-container" data-v-d1693495><div class="hello-container" data-v-d1693495><img class="img-hello" src="' + _imports_0$3 + '" alt="Hello" data-v-d1693495><h1 data-v-d1693495>Добро пожаловать!</h1></div><div class="circle-photo" data-v-d1693495><img class="my-photo" src="' + _imports_1 + '" alt="my photo" data-v-d1693495></div></div><div class="content-container" data-v-d1693495><p data-v-d1693495>Меня зовут Александр, мне 36 лет.</p></div>', 2);
const _hoisted_4$e = [
  _hoisted_2$s
];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$w, _hoisted_4$e);
}
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-d1693495"]]);
const _imports_0$2 = "" + new URL("education-0BLuv_iF.png", import.meta.url).href;
const _sfc_main$4 = {};
const _hoisted_1$v = { class: "main" };
const _hoisted_2$r = /* @__PURE__ */ createStaticVNode('<div class="education" data-v-7d931606><div class="head-container" data-v-7d931606><img src="' + _imports_0$2 + '" alt="education" data-v-7d931606><h2 data-v-7d931606>Моё образование</h2></div><div class="content-container" data-v-7d931606><p data-v-7d931606><strong data-v-7d931606>Высшее техническое</strong></p><p data-v-7d931606>Липецкий Государственный Технический Университет (ЛГТУ)</p><p data-v-7d931606>Факультет: Механико-машиностроительный (ММФ)</p><p data-v-7d931606>Специальность: Технология машиностроения</p><p data-v-7d931606>Год окончания: 2012</p><p data-v-7d931606><strong data-v-7d931606>Дополнительное образование</strong></p><p data-v-7d931606>Образовательная онлайн платформа ООО &quot;Нетология&quot;</p><p data-v-7d931606>Специальность: JavaScript-программирование</p><p data-v-7d931606>Год окончания: 2023</p></div></div>', 1);
const _hoisted_3$f = [
  _hoisted_2$r
];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$v, _hoisted_3$f);
}
const Education = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-7d931606"]]);
var script$E = {
  name: "ArrowDownIcon",
  "extends": script$M
};
var _hoisted_1$u = ["clip-path"];
var _hoisted_2$q = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M6.99994 14C6.91097 14.0004 6.82281 13.983 6.74064 13.9489C6.65843 13.9148 6.58387 13.8646 6.52133 13.8013L1.10198 8.38193C0.982318 8.25351 0.917175 8.08367 0.920272 7.90817C0.923368 7.73267 0.994462 7.56523 1.11858 7.44111C1.24269 7.317 1.41014 7.2459 1.58563 7.2428C1.76113 7.23971 1.93098 7.30485 2.0594 7.42451L6.32263 11.6877V0.677419C6.32263 0.497756 6.394 0.325452 6.52104 0.198411C6.64808 0.0713706 6.82039 0 7.00005 0C7.17971 0 7.35202 0.0713706 7.47906 0.198411C7.6061 0.325452 7.67747 0.497756 7.67747 0.677419V11.6877L11.9407 7.42451C12.0691 7.30485 12.2389 7.23971 12.4144 7.2428C12.5899 7.2459 12.7574 7.317 12.8815 7.44111C13.0056 7.56523 13.0767 7.73267 13.0798 7.90817C13.0829 8.08367 13.0178 8.25351 12.8981 8.38193L7.47875 13.8013C7.41621 13.8646 7.34164 13.9148 7.25944 13.9489C7.17727 13.983 7.08912 14.0004 7.00015 14C7.00012 14 7.00009 14 7.00005 14C7.00001 14 6.99998 14 6.99994 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$e = [_hoisted_2$q];
var _hoisted_4$d = ["id"];
var _hoisted_5$c = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$b = [_hoisted_5$c];
function render$C(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$e, 8, _hoisted_1$u), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$b, 8, _hoisted_4$d)])], 16);
}
script$E.render = render$C;
var script$D = {
  name: "ArrowUpIcon",
  "extends": script$M
};
var _hoisted_1$t = ["clip-path"];
var _hoisted_2$p = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M6.51551 13.799C6.64205 13.9255 6.813 13.9977 6.99193 14C7.17087 13.9977 7.34182 13.9255 7.46835 13.799C7.59489 13.6725 7.66701 13.5015 7.66935 13.3226V2.31233L11.9326 6.57554C11.9951 6.63887 12.0697 6.68907 12.1519 6.72319C12.2341 6.75731 12.3223 6.77467 12.4113 6.77425C12.5003 6.77467 12.5885 6.75731 12.6707 6.72319C12.7529 6.68907 12.8274 6.63887 12.89 6.57554C13.0168 6.44853 13.0881 6.27635 13.0881 6.09683C13.0881 5.91732 13.0168 5.74514 12.89 5.61812L7.48846 0.216594C7.48274 0.210436 7.4769 0.204374 7.47094 0.198411C7.3439 0.0713707 7.1716 0 6.99193 0C6.81227 0 6.63997 0.0713707 6.51293 0.198411C6.50704 0.204296 6.50128 0.210278 6.49563 0.216354L1.09386 5.61812C0.974201 5.74654 0.909057 5.91639 0.912154 6.09189C0.91525 6.26738 0.986345 6.43483 1.11046 6.55894C1.23457 6.68306 1.40202 6.75415 1.57752 6.75725C1.75302 6.76035 1.92286 6.6952 2.05128 6.57554L6.31451 2.31231V13.3226C6.31685 13.5015 6.38898 13.6725 6.51551 13.799Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$d = [_hoisted_2$p];
var _hoisted_4$c = ["id"];
var _hoisted_5$b = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$a = [_hoisted_5$b];
function render$B(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$d, 8, _hoisted_1$t), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$a, 8, _hoisted_4$c)])], 16);
}
script$D.render = render$B;
function _typeof$g(o) {
  "@babel/helpers - typeof";
  return _typeof$g = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$g(o);
}
function _defineProperty$f(obj, key, value) {
  key = _toPropertyKey$f(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$f(t) {
  var i = _toPrimitive$f(t, "string");
  return "symbol" == _typeof$g(i) ? i : String(i);
}
function _toPrimitive$f(t, r) {
  if ("object" != _typeof$g(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$g(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var css$6 = "\n@layer primevue {\n    .p-paginator-default {\n        display: flex;\n    }\n\n    .p-paginator {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        flex-wrap: wrap;\n    }\n\n    .p-paginator-left-content {\n        margin-right: auto;\n    }\n\n    .p-paginator-right-content {\n        margin-left: auto;\n    }\n\n    .p-paginator-page,\n    .p-paginator-next,\n    .p-paginator-last,\n    .p-paginator-first,\n    .p-paginator-prev,\n    .p-paginator-current {\n        cursor: pointer;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        line-height: 1;\n        user-select: none;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-paginator-element:focus {\n        z-index: 1;\n        position: relative;\n    }\n}\n";
var classes$6 = {
  paginator: function paginator(_ref) {
    var instance = _ref.instance, key = _ref.key;
    return ["p-paginator p-component", _defineProperty$f({
      "p-paginator-default": !instance.hasBreakpoints()
    }, "p-paginator-".concat(key), instance.hasBreakpoints())];
  },
  start: "p-paginator-left-content",
  end: "p-paginator-right-content",
  firstPageButton: function firstPageButton(_ref3) {
    var instance = _ref3.instance;
    return ["p-paginator-first p-paginator-element p-link", {
      "p-disabled": instance.$attrs.disabled
    }];
  },
  firstPageIcon: "p-paginator-icon",
  previousPageButton: function previousPageButton(_ref4) {
    var instance = _ref4.instance;
    return ["p-paginator-prev p-paginator-element p-link", {
      "p-disabled": instance.$attrs.disabled
    }];
  },
  previousPageIcon: "p-paginator-icon",
  nextPageButton: function nextPageButton(_ref5) {
    var instance = _ref5.instance;
    return ["p-paginator-next p-paginator-element p-link", {
      "p-disabled": instance.$attrs.disabled
    }];
  },
  nextPageIcon: "p-paginator-icon",
  lastPageButton: function lastPageButton(_ref6) {
    var instance = _ref6.instance;
    return ["p-paginator-last p-paginator-element p-link", {
      "p-disabled": instance.$attrs.disabled
    }];
  },
  lastPageIcon: "p-paginator-icon",
  pages: "p-paginator-pages",
  pageButton: function pageButton(_ref7) {
    var props = _ref7.props, pageLink = _ref7.pageLink;
    return ["p-paginator-page p-paginator-element p-link", {
      "p-highlight": pageLink - 1 === props.page
    }];
  },
  current: "p-paginator-current",
  rowPerPageDropdown: "p-paginator-rpp-options",
  jumpToPageDropdown: "p-paginator-page-options",
  jumpToPageInput: "p-paginator-page-input"
};
var PaginatorStyle = BaseStyle.extend({
  name: "paginator",
  css: css$6,
  classes: classes$6
});
var script$C = {
  name: "AngleDoubleLeftIcon",
  "extends": script$M
};
var _hoisted_1$s = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$o = [_hoisted_1$s];
function render$A(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$o, 16);
}
script$C.render = render$A;
var script$B = {
  name: "BlankIcon",
  "extends": script$M
};
var _hoisted_1$r = /* @__PURE__ */ createBaseVNode("rect", {
  width: "1",
  height: "1",
  fill: "currentColor",
  "fill-opacity": "0"
}, null, -1);
var _hoisted_2$n = [_hoisted_1$r];
function render$z(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$n, 16);
}
script$B.render = render$z;
var script$A = {
  name: "CheckIcon",
  "extends": script$M
};
var _hoisted_1$q = /* @__PURE__ */ createBaseVNode("path", {
  d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$m = [_hoisted_1$q];
function render$y(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$m, 16);
}
script$A.render = render$y;
var script$z = {
  name: "ChevronDownIcon",
  "extends": script$M
};
var _hoisted_1$p = /* @__PURE__ */ createBaseVNode("path", {
  d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$l = [_hoisted_1$p];
function render$x(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$l, 16);
}
script$z.render = render$x;
var script$y = {
  name: "FilterIcon",
  "extends": script$M
};
var _hoisted_1$o = ["clip-path"];
var _hoisted_2$k = /* @__PURE__ */ createBaseVNode("path", {
  d: "M8.64708 14H5.35296C5.18981 13.9979 5.03395 13.9321 4.91858 13.8167C4.8032 13.7014 4.73745 13.5455 4.73531 13.3824V7L0.329431 0.98C0.259794 0.889466 0.217389 0.780968 0.20718 0.667208C0.19697 0.553448 0.219379 0.439133 0.271783 0.337647C0.324282 0.236453 0.403423 0.151519 0.500663 0.0920138C0.597903 0.0325088 0.709548 0.000692754 0.823548 0H13.1765C13.2905 0.000692754 13.4021 0.0325088 13.4994 0.0920138C13.5966 0.151519 13.6758 0.236453 13.7283 0.337647C13.7807 0.439133 13.8031 0.553448 13.7929 0.667208C13.7826 0.780968 13.7402 0.889466 13.6706 0.98L9.26472 7V13.3824C9.26259 13.5455 9.19683 13.7014 9.08146 13.8167C8.96609 13.9321 8.81022 13.9979 8.64708 14ZM5.97061 12.7647H8.02943V6.79412C8.02878 6.66289 8.07229 6.53527 8.15296 6.43177L11.9412 1.23529H2.05884L5.86355 6.43177C5.94422 6.53527 5.98773 6.66289 5.98708 6.79412L5.97061 12.7647Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$c = [_hoisted_2$k];
var _hoisted_4$b = ["id"];
var _hoisted_5$a = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$9 = [_hoisted_5$a];
function render$w(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$c, 8, _hoisted_1$o), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$9, 8, _hoisted_4$b)])], 16);
}
script$y.render = render$w;
var script$x = {
  name: "TimesIcon",
  "extends": script$M
};
var _hoisted_1$n = /* @__PURE__ */ createBaseVNode("path", {
  d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$j = [_hoisted_1$n];
function render$v(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$j, 16);
}
script$x.render = render$v;
var OverlayEventBus = primebus();
var script$w = {
  name: "Portal",
  props: {
    appendTo: {
      type: [String, Object],
      "default": "body"
    },
    disabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data2() {
    return {
      mounted: false
    };
  },
  mounted: function mounted4() {
    this.mounted = DomHandler.isClient();
  },
  computed: {
    inline: function inline() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return $options.inline ? renderSlot(_ctx.$slots, "default", {
    key: 0
  }) : $data.mounted ? (openBlock(), createBlock(Teleport, {
    key: 1,
    to: $props.appendTo
  }, [renderSlot(_ctx.$slots, "default")], 8, ["to"])) : createCommentVNode("", true);
}
script$w.render = render$u;
var css$5 = "\n@layer primevue {\n    .p-virtualscroller {\n        position: relative;\n        overflow: auto;\n        contain: strict;\n        transform: translateZ(0);\n        will-change: scroll-position;\n        outline: 0 none;\n    }\n\n    .p-virtualscroller-content {\n        position: absolute;\n        top: 0;\n        left: 0;\n        /* contain: content; */\n        min-height: 100%;\n        min-width: 100%;\n        will-change: transform;\n    }\n\n    .p-virtualscroller-spacer {\n        position: absolute;\n        top: 0;\n        left: 0;\n        height: 1px;\n        width: 1px;\n        transform-origin: 0 0;\n        pointer-events: none;\n    }\n\n    .p-virtualscroller .p-virtualscroller-loader {\n        position: sticky;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n\n    .p-virtualscroller-loader.p-component-overlay {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .p-virtualscroller-loading-icon {\n        font-size: 2rem;\n    }\n\n    .p-virtualscroller-loading-icon.p-icon {\n        width: 2rem;\n        height: 2rem;\n    }\n\n    .p-virtualscroller-horizontal > .p-virtualscroller-content {\n        display: flex;\n    }\n\n    /* Inline */\n    .p-virtualscroller-inline .p-virtualscroller-content {\n        position: static;\n    }\n}\n";
var VirtualScrollerStyle = BaseStyle.extend({
  name: "virtualscroller",
  css: css$5
});
var script$1$8 = {
  name: "BaseVirtualScroller",
  "extends": script$N,
  props: {
    id: {
      type: String,
      "default": null
    },
    style: null,
    "class": null,
    items: {
      type: Array,
      "default": null
    },
    itemSize: {
      type: [Number, Array],
      "default": 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      "default": "vertical"
    },
    numToleratedItems: {
      type: Number,
      "default": null
    },
    delay: {
      type: Number,
      "default": 0
    },
    resizeDelay: {
      type: Number,
      "default": 10
    },
    lazy: {
      type: Boolean,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    loaderDisabled: {
      type: Boolean,
      "default": false
    },
    columns: {
      type: Array,
      "default": null
    },
    loading: {
      type: Boolean,
      "default": false
    },
    showSpacer: {
      type: Boolean,
      "default": true
    },
    showLoader: {
      type: Boolean,
      "default": false
    },
    tabindex: {
      type: Number,
      "default": 0
    },
    inline: {
      type: Boolean,
      "default": false
    },
    step: {
      type: Number,
      "default": 0
    },
    appendOnly: {
      type: Boolean,
      "default": false
    },
    autoSize: {
      type: Boolean,
      "default": false
    }
  },
  style: VirtualScrollerStyle,
  provide: function provide5() {
    return {
      $parentInstance: this
    };
  },
  beforeMount: function beforeMount2() {
    var _this$$config;
    VirtualScrollerStyle.loadStyle({
      nonce: (_this$$config = this.$config) === null || _this$$config === void 0 || (_this$$config = _this$$config.csp) === null || _this$$config === void 0 ? void 0 : _this$$config.nonce
    });
  }
};
function _typeof$f(o) {
  "@babel/helpers - typeof";
  return _typeof$f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$f(o);
}
function ownKeys$e(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$e(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$e(Object(t), true).forEach(function(r2) {
      _defineProperty$e(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$e(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$e(obj, key, value) {
  key = _toPropertyKey$e(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$e(t) {
  var i = _toPrimitive$e(t, "string");
  return "symbol" == _typeof$f(i) ? i : String(i);
}
function _toPrimitive$e(t, r) {
  if ("object" != _typeof$f(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$f(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$v = {
  name: "VirtualScroller",
  "extends": script$1$8,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  data: function data3() {
    return {
      first: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      last: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      page: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: this.isBoth() ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: false,
  lazyLoadState: {},
  resizeListener: null,
  initialized: false,
  watch: {
    numToleratedItems: function numToleratedItems(newValue) {
      this.d_numToleratedItems = newValue;
    },
    loading: function loading(newValue, oldValue) {
      if (this.lazy && newValue !== oldValue && newValue !== this.d_loading) {
        this.d_loading = newValue;
      }
    },
    items: function items(newValue, oldValue) {
      if (!oldValue || oldValue.length !== (newValue || []).length) {
        this.init();
        this.calculateAutoSize();
      }
    },
    itemSize: function itemSize() {
      this.init();
      this.calculateAutoSize();
    },
    orientation: function orientation() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    },
    scrollHeight: function scrollHeight() {
      this.init();
      this.calculateAutoSize();
    },
    scrollWidth: function scrollWidth() {
      this.init();
      this.calculateAutoSize();
    }
  },
  mounted: function mounted5() {
    this.viewInit();
    this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0;
    this.lazyLoadState = this.lazyLoadState || {};
  },
  updated: function updated2() {
    !this.initialized && this.viewInit();
  },
  unmounted: function unmounted3() {
    this.unbindResizeListener();
    this.initialized = false;
  },
  methods: {
    viewInit: function viewInit() {
      if (DomHandler.isVisible(this.element)) {
        this.setContentEl(this.content);
        this.init();
        this.bindResizeListener();
        this.defaultWidth = DomHandler.getWidth(this.element);
        this.defaultHeight = DomHandler.getHeight(this.element);
        this.defaultContentWidth = DomHandler.getWidth(this.content);
        this.defaultContentHeight = DomHandler.getHeight(this.content);
        this.initialized = true;
      }
    },
    init: function init() {
      if (!this.disabled) {
        this.setSize();
        this.calculateOptions();
        this.setSpacerSize();
      }
    },
    isVertical: function isVertical() {
      return this.orientation === "vertical";
    },
    isHorizontal: function isHorizontal() {
      return this.orientation === "horizontal";
    },
    isBoth: function isBoth() {
      return this.orientation === "both";
    },
    scrollTo: function scrollTo(options2) {
      this.lastScrollPos = this.both ? {
        top: 0,
        left: 0
      } : 0;
      this.element && this.element.scrollTo(options2);
    },
    scrollToIndex: function scrollToIndex(index2) {
      var _this = this;
      var behavior = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto";
      var both = this.isBoth();
      var horizontal = this.isHorizontal();
      var valid = both ? index2.every(function(i) {
        return i > -1;
      }) : index2 > -1;
      if (valid) {
        var first3 = this.first;
        var _this$calculateNumIte = this.calculateNumItems(), numToleratedItems2 = _this$calculateNumIte.numToleratedItems;
        var contentPos = this.getContentPosition();
        var itemSize2 = this.itemSize;
        var calculateFirst = function calculateFirst2() {
          var _index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          var _numT = arguments.length > 1 ? arguments[1] : void 0;
          return _index <= _numT ? 0 : _index;
        };
        var calculateCoord = function calculateCoord2(_first, _size, _cpos) {
          return _first * _size + _cpos;
        };
        var scrollTo2 = function scrollTo3() {
          var left = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          var top = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return _this.scrollTo({
            left,
            top,
            behavior
          });
        };
        var newFirst = both ? {
          rows: 0,
          cols: 0
        } : 0;
        var isRangeChanged = false;
        if (both) {
          newFirst = {
            rows: calculateFirst(index2[0], numToleratedItems2[0]),
            cols: calculateFirst(index2[1], numToleratedItems2[1])
          };
          scrollTo2(calculateCoord(newFirst.cols, itemSize2[1], contentPos.left), calculateCoord(newFirst.rows, itemSize2[0], contentPos.top));
          isRangeChanged = newFirst.rows !== first3.rows || newFirst.cols !== first3.cols;
        } else {
          newFirst = calculateFirst(index2, numToleratedItems2);
          horizontal ? scrollTo2(calculateCoord(newFirst, itemSize2, contentPos.left), 0) : scrollTo2(0, calculateCoord(newFirst, itemSize2, contentPos.top));
          isRangeChanged = newFirst !== first3;
        }
        this.isRangeChanged = isRangeChanged;
        this.first = newFirst;
      }
    },
    scrollInView: function scrollInView3(index2, to) {
      var _this2 = this;
      var behavior = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (to) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var valid = both ? index2.every(function(i) {
          return i > -1;
        }) : index2 > -1;
        if (valid) {
          var _this$getRenderedRang = this.getRenderedRange(), first3 = _this$getRenderedRang.first, viewport = _this$getRenderedRang.viewport;
          var scrollTo2 = function scrollTo3() {
            var left = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
            var top = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return _this2.scrollTo({
              left,
              top,
              behavior
            });
          };
          var isToStart = to === "to-start";
          var isToEnd = to === "to-end";
          if (isToStart) {
            if (both) {
              if (viewport.first.rows - first3.rows > index2[0]) {
                scrollTo2(viewport.first.cols * this.itemSize[1], (viewport.first.rows - 1) * this.itemSize[0]);
              } else if (viewport.first.cols - first3.cols > index2[1]) {
                scrollTo2((viewport.first.cols - 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
              }
            } else {
              if (viewport.first - first3 > index2) {
                var pos = (viewport.first - 1) * this.itemSize;
                horizontal ? scrollTo2(pos, 0) : scrollTo2(0, pos);
              }
            }
          } else if (isToEnd) {
            if (both) {
              if (viewport.last.rows - first3.rows <= index2[0] + 1) {
                scrollTo2(viewport.first.cols * this.itemSize[1], (viewport.first.rows + 1) * this.itemSize[0]);
              } else if (viewport.last.cols - first3.cols <= index2[1] + 1) {
                scrollTo2((viewport.first.cols + 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
              }
            } else {
              if (viewport.last - first3 <= index2 + 1) {
                var _pos2 = (viewport.first + 1) * this.itemSize;
                horizontal ? scrollTo2(_pos2, 0) : scrollTo2(0, _pos2);
              }
            }
          }
        }
      } else {
        this.scrollToIndex(index2, behavior);
      }
    },
    getRenderedRange: function getRenderedRange() {
      var calculateFirstInViewport = function calculateFirstInViewport2(_pos, _size) {
        return Math.floor(_pos / (_size || _pos));
      };
      var firstInViewport = this.first;
      var lastInViewport = 0;
      if (this.element) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var _this$element = this.element, scrollTop = _this$element.scrollTop, scrollLeft = _this$element.scrollLeft;
        if (both) {
          firstInViewport = {
            rows: calculateFirstInViewport(scrollTop, this.itemSize[0]),
            cols: calculateFirstInViewport(scrollLeft, this.itemSize[1])
          };
          lastInViewport = {
            rows: firstInViewport.rows + this.numItemsInViewport.rows,
            cols: firstInViewport.cols + this.numItemsInViewport.cols
          };
        } else {
          var scrollPos = horizontal ? scrollLeft : scrollTop;
          firstInViewport = calculateFirstInViewport(scrollPos, this.itemSize);
          lastInViewport = firstInViewport + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: firstInViewport,
          last: lastInViewport
        }
      };
    },
    calculateNumItems: function calculateNumItems() {
      var both = this.isBoth();
      var horizontal = this.isHorizontal();
      var itemSize2 = this.itemSize;
      var contentPos = this.getContentPosition();
      var contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
      var contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
      var calculateNumItemsInViewport = function calculateNumItemsInViewport2(_contentSize, _itemSize) {
        return Math.ceil(_contentSize / (_itemSize || _contentSize));
      };
      var calculateNumToleratedItems = function calculateNumToleratedItems2(_numItems) {
        return Math.ceil(_numItems / 2);
      };
      var numItemsInViewport = both ? {
        rows: calculateNumItemsInViewport(contentHeight, itemSize2[0]),
        cols: calculateNumItemsInViewport(contentWidth, itemSize2[1])
      } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize2);
      var numToleratedItems2 = this.d_numToleratedItems || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
      return {
        numItemsInViewport,
        numToleratedItems: numToleratedItems2
      };
    },
    calculateOptions: function calculateOptions() {
      var _this3 = this;
      var both = this.isBoth();
      var first3 = this.first;
      var _this$calculateNumIte2 = this.calculateNumItems(), numItemsInViewport = _this$calculateNumIte2.numItemsInViewport, numToleratedItems2 = _this$calculateNumIte2.numToleratedItems;
      var calculateLast = function calculateLast2(_first, _num, _numT) {
        var _isCols = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return _this3.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
      };
      var last = both ? {
        rows: calculateLast(first3.rows, numItemsInViewport.rows, numToleratedItems2[0]),
        cols: calculateLast(first3.cols, numItemsInViewport.cols, numToleratedItems2[1], true)
      } : calculateLast(first3, numItemsInViewport, numToleratedItems2);
      this.last = last;
      this.numItemsInViewport = numItemsInViewport;
      this.d_numToleratedItems = numToleratedItems2;
      this.$emit("update:numToleratedItems", this.d_numToleratedItems);
      if (this.showLoader) {
        this.loaderArr = both ? Array.from({
          length: numItemsInViewport.rows
        }).map(function() {
          return Array.from({
            length: numItemsInViewport.cols
          });
        }) : Array.from({
          length: numItemsInViewport
        });
      }
      if (this.lazy) {
        Promise.resolve().then(function() {
          _this3.lazyLoadState = {
            first: _this3.step ? both ? {
              rows: 0,
              cols: first3.cols
            } : 0 : first3,
            last: Math.min(_this3.step ? _this3.step : last, _this3.items.length)
          };
          _this3.$emit("lazy-load", _this3.lazyLoadState);
        });
      }
    },
    calculateAutoSize: function calculateAutoSize() {
      var _this4 = this;
      if (this.autoSize && !this.d_loading) {
        Promise.resolve().then(function() {
          if (_this4.content) {
            var both = _this4.isBoth();
            var horizontal = _this4.isHorizontal();
            var vertical = _this4.isVertical();
            _this4.content.style.minHeight = _this4.content.style.minWidth = "auto";
            _this4.content.style.position = "relative";
            _this4.element.style.contain = "none";
            var _ref = [DomHandler.getWidth(_this4.content), DomHandler.getHeight(_this4.content)], contentWidth = _ref[0], contentHeight = _ref[1];
            contentWidth !== _this4.defaultContentWidth && (_this4.element.style.width = "");
            contentHeight !== _this4.defaultContentHeight && (_this4.element.style.height = "");
            var _ref2 = [DomHandler.getWidth(_this4.element), DomHandler.getHeight(_this4.element)], width2 = _ref2[0], height = _ref2[1];
            (both || horizontal) && (_this4.element.style.width = width2 < _this4.defaultWidth ? width2 + "px" : _this4.scrollWidth || _this4.defaultWidth + "px");
            (both || vertical) && (_this4.element.style.height = height < _this4.defaultHeight ? height + "px" : _this4.scrollHeight || _this4.defaultHeight + "px");
            _this4.content.style.minHeight = _this4.content.style.minWidth = "";
            _this4.content.style.position = "";
            _this4.element.style.contain = "";
          }
        });
      }
    },
    getLast: function getLast() {
      var last = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      var isCols = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(isCols ? (this.columns || this.items[0]).length : this.items.length, last) : 0;
    },
    getContentPosition: function getContentPosition() {
      if (this.content) {
        var style = getComputedStyle(this.content);
        var left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
        var right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
        var top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
        var bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
        return {
          left,
          right,
          top,
          bottom,
          x: left + right,
          y: top + bottom
        };
      }
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },
    setSize: function setSize() {
      var _this5 = this;
      if (this.element) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var parentElement = this.element.parentElement;
        var width2 = this.scrollWidth || "".concat(this.element.offsetWidth || parentElement.offsetWidth, "px");
        var height = this.scrollHeight || "".concat(this.element.offsetHeight || parentElement.offsetHeight, "px");
        var setProp = function setProp2(_name, _value) {
          return _this5.element.style[_name] = _value;
        };
        if (both || horizontal) {
          setProp("height", height);
          setProp("width", width2);
        } else {
          setProp("height", height);
        }
      }
    },
    setSpacerSize: function setSpacerSize() {
      var _this6 = this;
      var items2 = this.items;
      if (items2) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var contentPos = this.getContentPosition();
        var setProp = function setProp2(_name, _value, _size) {
          var _cpos = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return _this6.spacerStyle = _objectSpread$e(_objectSpread$e({}, _this6.spacerStyle), _defineProperty$e({}, "".concat(_name), (_value || []).length * _size + _cpos + "px"));
        };
        if (both) {
          setProp("height", items2, this.itemSize[0], contentPos.y);
          setProp("width", this.columns || items2[1], this.itemSize[1], contentPos.x);
        } else {
          horizontal ? setProp("width", this.columns || items2, this.itemSize, contentPos.x) : setProp("height", items2, this.itemSize, contentPos.y);
        }
      }
    },
    setContentPosition: function setContentPosition(pos) {
      var _this7 = this;
      if (this.content && !this.appendOnly) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        var first3 = pos ? pos.first : this.first;
        var calculateTranslateVal = function calculateTranslateVal2(_first, _size) {
          return _first * _size;
        };
        var setTransform = function setTransform2() {
          var _x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          var _y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return _this7.contentStyle = _objectSpread$e(_objectSpread$e({}, _this7.contentStyle), {
            transform: "translate3d(".concat(_x, "px, ").concat(_y, "px, 0)")
          });
        };
        if (both) {
          setTransform(calculateTranslateVal(first3.cols, this.itemSize[1]), calculateTranslateVal(first3.rows, this.itemSize[0]));
        } else {
          var translateVal = calculateTranslateVal(first3, this.itemSize);
          horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
        }
      }
    },
    onScrollPositionChange: function onScrollPositionChange(event2) {
      var _this8 = this;
      var target = event2.target;
      var both = this.isBoth();
      var horizontal = this.isHorizontal();
      var contentPos = this.getContentPosition();
      var calculateScrollPos = function calculateScrollPos2(_pos, _cpos) {
        return _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;
      };
      var calculateCurrentIndex = function calculateCurrentIndex2(_pos, _size) {
        return Math.floor(_pos / (_size || _pos));
      };
      var calculateTriggerIndex = function calculateTriggerIndex2(_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
        return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
      };
      var calculateFirst = function calculateFirst2(_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
        if (_currentIndex <= _numT)
          return 0;
        else
          return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
      };
      var calculateLast = function calculateLast2(_currentIndex, _first, _last, _num, _numT, _isCols) {
        var lastValue = _first + _num + 2 * _numT;
        if (_currentIndex >= _numT) {
          lastValue += _numT + 1;
        }
        return _this8.getLast(lastValue, _isCols);
      };
      var scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
      var scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
      var newFirst = both ? {
        rows: 0,
        cols: 0
      } : 0;
      var newLast = this.last;
      var isRangeChanged = false;
      var newScrollPos = this.lastScrollPos;
      if (both) {
        var isScrollDown = this.lastScrollPos.top <= scrollTop;
        var isScrollRight = this.lastScrollPos.left <= scrollLeft;
        if (!this.appendOnly || this.appendOnly && (isScrollDown || isScrollRight)) {
          var currentIndex = {
            rows: calculateCurrentIndex(scrollTop, this.itemSize[0]),
            cols: calculateCurrentIndex(scrollLeft, this.itemSize[1])
          };
          var triggerIndex = {
            rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newFirst = {
            rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newLast = {
            rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
          };
          isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
          newScrollPos = {
            top: scrollTop,
            left: scrollLeft
          };
        }
      } else {
        var scrollPos = horizontal ? scrollLeft : scrollTop;
        var isScrollDownOrRight = this.lastScrollPos <= scrollPos;
        if (!this.appendOnly || this.appendOnly && isScrollDownOrRight) {
          var _currentIndex2 = calculateCurrentIndex(scrollPos, this.itemSize);
          var _triggerIndex2 = calculateTriggerIndex(_currentIndex2, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newFirst = calculateFirst(_currentIndex2, _triggerIndex2, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newLast = calculateLast(_currentIndex2, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
          isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
          newScrollPos = scrollPos;
        }
      }
      return {
        first: newFirst,
        last: newLast,
        isRangeChanged,
        scrollPos: newScrollPos
      };
    },
    onScrollChange: function onScrollChange(event2) {
      var _this$onScrollPositio = this.onScrollPositionChange(event2), first3 = _this$onScrollPositio.first, last = _this$onScrollPositio.last, isRangeChanged = _this$onScrollPositio.isRangeChanged, scrollPos = _this$onScrollPositio.scrollPos;
      if (isRangeChanged) {
        var newState = {
          first: first3,
          last
        };
        this.setContentPosition(newState);
        this.first = first3;
        this.last = last;
        this.lastScrollPos = scrollPos;
        this.$emit("scroll-index-change", newState);
        if (this.lazy && this.isPageChanged(first3)) {
          var lazyLoadState = {
            first: this.step ? Math.min(this.getPageByFirst(first3) * this.step, this.items.length - this.step) : first3,
            last: Math.min(this.step ? (this.getPageByFirst(first3) + 1) * this.step : last, this.items.length)
          };
          var isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
          isLazyStateChanged && this.$emit("lazy-load", lazyLoadState);
          this.lazyLoadState = lazyLoadState;
        }
      }
    },
    onScroll: function onScroll(event2) {
      var _this9 = this;
      this.$emit("scroll", event2);
      if (this.delay) {
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        if (this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var _this$onScrollPositio2 = this.onScrollPositionChange(event2), isRangeChanged = _this$onScrollPositio2.isRangeChanged;
            var changed = isRangeChanged || (this.step ? this.isPageChanged() : false);
            changed && (this.d_loading = true);
          }
          this.scrollTimeout = setTimeout(function() {
            _this9.onScrollChange(event2);
            if (_this9.d_loading && _this9.showLoader && (!_this9.lazy || _this9.loading === void 0)) {
              _this9.d_loading = false;
              _this9.page = _this9.getPageByFirst();
            }
          }, this.delay);
        }
      } else {
        this.onScrollChange(event2);
      }
    },
    onResize: function onResize() {
      var _this10 = this;
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(function() {
        if (DomHandler.isVisible(_this10.element)) {
          var both = _this10.isBoth();
          var vertical = _this10.isVertical();
          var horizontal = _this10.isHorizontal();
          var _ref3 = [DomHandler.getWidth(_this10.element), DomHandler.getHeight(_this10.element)], width2 = _ref3[0], height = _ref3[1];
          var isDiffWidth = width2 !== _this10.defaultWidth, isDiffHeight = height !== _this10.defaultHeight;
          var reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;
          if (reinit) {
            _this10.d_numToleratedItems = _this10.numToleratedItems;
            _this10.defaultWidth = width2;
            _this10.defaultHeight = height;
            _this10.defaultContentWidth = DomHandler.getWidth(_this10.content);
            _this10.defaultContentHeight = DomHandler.getHeight(_this10.content);
            _this10.init();
          }
        }
      }, this.resizeDelay);
    },
    bindResizeListener: function bindResizeListener2() {
      if (!this.resizeListener) {
        this.resizeListener = this.onResize.bind(this);
        window.addEventListener("resize", this.resizeListener);
        window.addEventListener("orientationchange", this.resizeListener);
      }
    },
    unbindResizeListener: function unbindResizeListener2() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("orientationchange", this.resizeListener);
        this.resizeListener = null;
      }
    },
    getOptions: function getOptions(renderedIndex) {
      var count = (this.items || []).length;
      var index2 = this.isBoth() ? this.first.rows + renderedIndex : this.first + renderedIndex;
      return {
        index: index2,
        count,
        first: index2 === 0,
        last: index2 === count - 1,
        even: index2 % 2 === 0,
        odd: index2 % 2 !== 0
      };
    },
    getLoaderOptions: function getLoaderOptions(index2, extOptions) {
      var count = this.loaderArr.length;
      return _objectSpread$e({
        index: index2,
        count,
        first: index2 === 0,
        last: index2 === count - 1,
        even: index2 % 2 === 0,
        odd: index2 % 2 !== 0
      }, extOptions);
    },
    getPageByFirst: function getPageByFirst(first3) {
      return Math.floor(((first3 !== null && first3 !== void 0 ? first3 : this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged: function isPageChanged(first3) {
      return this.step ? this.page !== this.getPageByFirst(first3 !== null && first3 !== void 0 ? first3 : this.first) : true;
    },
    setContentEl: function setContentEl(el) {
      this.content = el || this.content || DomHandler.findSingle(this.element, '[data-pc-section="content"]');
    },
    elementRef: function elementRef(el) {
      this.element = el;
    },
    contentRef: function contentRef(el) {
      this.content = el;
    }
  },
  computed: {
    containerClass: function containerClass() {
      return ["p-virtualscroller", this["class"], {
        "p-virtualscroller-inline": this.inline,
        "p-virtualscroller-both p-both-scroll": this.isBoth(),
        "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
      }];
    },
    contentClass: function contentClass() {
      return ["p-virtualscroller-content", {
        "p-virtualscroller-loading": this.d_loading
      }];
    },
    loaderClass: function loaderClass() {
      return ["p-virtualscroller-loader", {
        "p-component-overlay": !this.$slots.loader
      }];
    },
    loadedItems: function loadedItems() {
      var _this11 = this;
      if (this.items && !this.d_loading) {
        if (this.isBoth())
          return this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(item2) {
            return _this11.columns ? item2 : item2.slice(_this11.appendOnly ? 0 : _this11.first.cols, _this11.last.cols);
          });
        else if (this.isHorizontal() && this.columns)
          return this.items;
        else
          return this.items.slice(this.appendOnly ? 0 : this.first, this.last);
      }
      return [];
    },
    loadedRows: function loadedRows() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns: function loadedColumns() {
      if (this.columns) {
        var both = this.isBoth();
        var horizontal = this.isHorizontal();
        if (both || horizontal) {
          return this.d_loading && this.loaderDisabled ? both ? this.loaderArr[0] : this.loaderArr : this.columns.slice(both ? this.first.cols : this.first, both ? this.last.cols : this.last);
        }
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: script$G
  }
};
var _hoisted_1$m = ["tabindex"];
function render$t(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  return !_ctx.disabled ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    ref: $options.elementRef,
    "class": $options.containerClass,
    tabindex: _ctx.tabindex,
    style: _ctx.style,
    onScroll: _cache[0] || (_cache[0] = function() {
      return $options.onScroll && $options.onScroll.apply($options, arguments);
    })
  }, _ctx.ptm("root"), {
    "data-pc-name": "virtualscroller"
  }), [renderSlot(_ctx.$slots, "content", {
    styleClass: $options.contentClass,
    items: $options.loadedItems,
    getItemOptions: $options.getOptions,
    loading: $data.d_loading,
    getLoaderOptions: $options.getLoaderOptions,
    itemSize: _ctx.itemSize,
    rows: $options.loadedRows,
    columns: $options.loadedColumns,
    contentRef: $options.contentRef,
    spacerStyle: $data.spacerStyle,
    contentStyle: $data.contentStyle,
    vertical: $options.isVertical(),
    horizontal: $options.isHorizontal(),
    both: $options.isBoth()
  }, function() {
    return [createBaseVNode("div", mergeProps({
      ref: $options.contentRef,
      "class": $options.contentClass,
      style: $data.contentStyle
    }, _ctx.ptm("content")), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.loadedItems, function(item2, index2) {
      return renderSlot(_ctx.$slots, "item", {
        key: index2,
        item: item2,
        options: $options.getOptions(index2)
      });
    }), 128))], 16)];
  }), _ctx.showSpacer ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    "class": "p-virtualscroller-spacer",
    style: $data.spacerStyle
  }, _ctx.ptm("spacer")), null, 16)) : createCommentVNode("", true), !_ctx.loaderDisabled && _ctx.showLoader && $data.d_loading ? (openBlock(), createElementBlock("div", mergeProps({
    key: 1,
    "class": $options.loaderClass
  }, _ctx.ptm("loader")), [_ctx.$slots && _ctx.$slots.loader ? (openBlock(true), createElementBlock(Fragment, {
    key: 0
  }, renderList($data.loaderArr, function(_, index2) {
    return renderSlot(_ctx.$slots, "loader", {
      key: index2,
      options: $options.getLoaderOptions(index2, $options.isBoth() && {
        numCols: _ctx.d_numItemsInViewport.cols
      })
    });
  }), 128)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "loadingicon", {}, function() {
    return [createVNode(_component_SpinnerIcon, mergeProps({
      spin: "",
      "class": "p-virtualscroller-loading-icon"
    }, _ctx.ptm("loadingIcon")), null, 16)];
  })], 16)) : createCommentVNode("", true)], 16, _hoisted_1$m)) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [renderSlot(_ctx.$slots, "default"), renderSlot(_ctx.$slots, "content", {
    items: _ctx.items,
    rows: _ctx.items,
    columns: $options.loadedColumns
  })], 64));
}
script$v.render = render$t;
var css$4 = "\n@layer primevue {\n    .p-dropdown {\n        display: inline-flex;\n        cursor: pointer;\n        position: relative;\n        user-select: none;\n    }\n\n    .p-dropdown-clear-icon {\n        position: absolute;\n        top: 50%;\n        margin-top: -0.5rem;\n    }\n\n    .p-dropdown-trigger {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        flex-shrink: 0;\n    }\n\n    .p-dropdown-label {\n        display: block;\n        white-space: nowrap;\n        overflow: hidden;\n        flex: 1 1 auto;\n        width: 1%;\n        text-overflow: ellipsis;\n        cursor: pointer;\n    }\n\n    .p-dropdown-label-empty {\n        overflow: hidden;\n        opacity: 0;\n    }\n\n    input.p-dropdown-label {\n        cursor: default;\n    }\n\n    .p-dropdown .p-dropdown-panel {\n        min-width: 100%;\n    }\n\n    .p-dropdown-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n\n    .p-dropdown-items-wrapper {\n        overflow: auto;\n    }\n\n    .p-dropdown-item {\n        cursor: pointer;\n        font-weight: normal;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n        display: flex;\n        align-items: center;\n    }\n\n    .p-dropdown-item-group {\n        cursor: auto;\n    }\n\n    .p-dropdown-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n\n    .p-dropdown-filter {\n        width: 100%;\n    }\n\n    .p-dropdown-filter-container {\n        position: relative;\n    }\n\n    .p-dropdown-filter-icon {\n        position: absolute;\n        top: 50%;\n        margin-top: -0.5rem;\n    }\n\n    .p-fluid .p-dropdown {\n        display: flex;\n    }\n\n    .p-fluid .p-dropdown .p-dropdown-label {\n        width: 1%;\n    }\n}\n";
var classes$5 = {
  root: function root4(_ref) {
    var instance = _ref.instance, props = _ref.props, state = _ref.state;
    return ["p-dropdown p-component p-inputwrapper", {
      "p-disabled": props.disabled,
      "p-dropdown-clearable": props.showClear,
      "p-focus": state.focused,
      "p-inputwrapper-filled": instance.hasSelectedOption,
      "p-inputwrapper-focus": state.focused || state.overlayVisible,
      "p-overlay-open": state.overlayVisible
    }];
  },
  input: function input(_ref2) {
    var instance = _ref2.instance, props = _ref2.props;
    return ["p-dropdown-label p-inputtext", {
      "p-placeholder": !props.editable && instance.label === props.placeholder,
      "p-dropdown-label-empty": !props.editable && !instance.$slots["value"] && (instance.label === "p-emptylabel" || instance.label.length === 0)
    }];
  },
  clearIcon: "p-dropdown-clear-icon",
  trigger: "p-dropdown-trigger",
  loadingicon: "p-dropdown-trigger-icon",
  dropdownIcon: "p-dropdown-trigger-icon",
  panel: function panel(_ref3) {
    var instance = _ref3.instance;
    return ["p-dropdown-panel p-component", {
      "p-input-filled": instance.$primevue.config.inputStyle === "filled",
      "p-ripple-disabled": instance.$primevue.config.ripple === false
    }];
  },
  header: "p-dropdown-header",
  filterContainer: "p-dropdown-filter-container",
  filterInput: "p-dropdown-filter p-inputtext p-component",
  filterIcon: "p-dropdown-filter-icon",
  wrapper: "p-dropdown-items-wrapper",
  list: "p-dropdown-items",
  itemGroup: "p-dropdown-item-group",
  itemGroupLabel: "p-dropdown-item-group-label",
  item: function item(_ref4) {
    var instance = _ref4.instance, props = _ref4.props, state = _ref4.state, option = _ref4.option, focusedOption = _ref4.focusedOption;
    return ["p-dropdown-item", {
      "p-highlight": instance.isSelected(option) && props.highlightOnSelect,
      "p-focus": state.focusedOptionIndex === focusedOption,
      "p-disabled": instance.isOptionDisabled(option)
    }];
  },
  itemLabel: "p-dropdown-item-label",
  checkIcon: "p-dropdown-check-icon",
  blankIcon: "p-dropdown-blank-icon",
  emptyMessage: "p-dropdown-empty-message"
};
var DropdownStyle = BaseStyle.extend({
  name: "dropdown",
  css: css$4,
  classes: classes$5
});
var script$1$7 = {
  name: "BaseDropdown",
  "extends": script$N,
  props: {
    modelValue: null,
    options: Array,
    optionLabel: [String, Function],
    optionValue: [String, Function],
    optionDisabled: [String, Function],
    optionGroupLabel: [String, Function],
    optionGroupChildren: [String, Function],
    scrollHeight: {
      type: String,
      "default": "200px"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      "default": "contains"
    },
    filterFields: {
      type: Array,
      "default": null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      "default": null
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      "default": false
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    inputProps: {
      type: null,
      "default": null
    },
    panelClass: {
      type: [String, Object],
      "default": null
    },
    panelStyle: {
      type: Object,
      "default": null
    },
    panelProps: {
      type: null,
      "default": null
    },
    filterInputProps: {
      type: null,
      "default": null
    },
    clearIconProps: {
      type: null,
      "default": null
    },
    appendTo: {
      type: [String, Object],
      "default": "body"
    },
    loading: {
      type: Boolean,
      "default": false
    },
    clearIcon: {
      type: String,
      "default": void 0
    },
    dropdownIcon: {
      type: String,
      "default": void 0
    },
    filterIcon: {
      type: String,
      "default": void 0
    },
    loadingIcon: {
      type: String,
      "default": void 0
    },
    resetFilterOnHide: {
      type: Boolean,
      "default": false
    },
    resetFilterOnClear: {
      type: Boolean,
      "default": false
    },
    virtualScrollerOptions: {
      type: Object,
      "default": null
    },
    autoOptionFocus: {
      type: Boolean,
      "default": false
    },
    autoFilterFocus: {
      type: Boolean,
      "default": false
    },
    selectOnFocus: {
      type: Boolean,
      "default": false
    },
    focusOnHover: {
      type: Boolean,
      "default": true
    },
    highlightOnSelect: {
      type: Boolean,
      "default": true
    },
    checkmark: {
      type: Boolean,
      "default": false
    },
    filterMessage: {
      type: String,
      "default": null
    },
    selectionMessage: {
      type: String,
      "default": null
    },
    emptySelectionMessage: {
      type: String,
      "default": null
    },
    emptyFilterMessage: {
      type: String,
      "default": null
    },
    emptyMessage: {
      type: String,
      "default": null
    },
    tabindex: {
      type: Number,
      "default": 0
    },
    ariaLabel: {
      type: String,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    }
  },
  style: DropdownStyle,
  provide: function provide6() {
    return {
      $parentInstance: this
    };
  }
};
function _typeof$1$1(o) {
  "@babel/helpers - typeof";
  return _typeof$1$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1$1(o);
}
function _toConsumableArray$4(arr) {
  return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _unsupportedIterableToArray$5(arr) || _nonIterableSpread$4();
}
function _nonIterableSpread$4() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$5(o, minLen);
}
function _iterableToArray$4(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$4(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$5(arr);
}
function _arrayLikeToArray$5(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function ownKeys$1$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1$1(obj, key, value) {
  key = _toPropertyKey$1$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$1$1(t) {
  var i = _toPrimitive$1$1(t, "string");
  return "symbol" == _typeof$1$1(i) ? i : String(i);
}
function _toPrimitive$1$1(t, r) {
  if ("object" != _typeof$1$1(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$1$1(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$u = {
  name: "Dropdown",
  "extends": script$1$7,
  emits: ["update:modelValue", "change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  labelClickListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: false,
  data: function data4() {
    return {
      id: this.$attrs.id,
      clicked: false,
      focused: false,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: false
    };
  },
  watch: {
    "$attrs.id": function $attrsId2(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    modelValue: function modelValue() {
      this.isModelValueChanged = true;
    },
    options: function options() {
      this.autoUpdateModel();
    }
  },
  mounted: function mounted6() {
    this.id = this.id || UniqueComponentId();
    this.autoUpdateModel();
    this.bindLabelClickListener();
  },
  updated: function updated3() {
    if (this.overlayVisible && this.isModelValueChanged) {
      this.scrollInView(this.findSelectedOptionIndex());
    }
    this.isModelValueChanged = false;
  },
  beforeUnmount: function beforeUnmount3() {
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    this.unbindLabelClickListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.overlay = null;
    }
  },
  methods: {
    getOptionIndex: function getOptionIndex(index2, fn) {
      return this.virtualScrollerDisabled ? index2 : fn && fn(index2)["index"];
    },
    getOptionLabel: function getOptionLabel(option) {
      return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    },
    getOptionValue: function getOptionValue(option) {
      return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    },
    getOptionRenderKey: function getOptionRenderKey(option, index2) {
      return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + "_" + index2;
    },
    getPTItemOptions: function getPTItemOptions(option, itemOptions, index2, key) {
      return this.ptm(key, {
        context: {
          selected: this.isSelected(option),
          focused: this.focusedOptionIndex === this.getOptionIndex(index2, itemOptions),
          disabled: this.isOptionDisabled(option)
        }
      });
    },
    isOptionDisabled: function isOptionDisabled(option) {
      return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
    },
    isOptionGroup: function isOptionGroup(option) {
      return this.optionGroupLabel && option.optionGroup && option.group;
    },
    getOptionGroupLabel: function getOptionGroupLabel(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
    },
    getOptionGroupChildren: function getOptionGroupChildren(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
    },
    getAriaPosInset: function getAriaPosInset2(index2) {
      var _this = this;
      return (this.optionGroupLabel ? index2 - this.visibleOptions.slice(0, index2).filter(function(option) {
        return _this.isOptionGroup(option);
      }).length : index2) + 1;
    },
    show: function show2(isFocus) {
      this.$emit("before-show");
      this.overlayVisible = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex();
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },
    hide: function hide2(isFocus) {
      var _this2 = this;
      var _hide = function _hide2() {
        _this2.$emit("before-hide");
        _this2.overlayVisible = false;
        _this2.clicked = false;
        _this2.focusedOptionIndex = -1;
        _this2.searchValue = "";
        _this2.resetFilterOnHide && (_this2.filterValue = null);
        isFocus && DomHandler.focus(_this2.$refs.focusInput);
      };
      setTimeout(function() {
        _hide();
      }, 0);
    },
    onFocus: function onFocus2(event2) {
      if (this.disabled) {
        return;
      }
      this.focused = true;
      if (this.overlayVisible) {
        this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex();
        this.scrollInView(this.focusedOptionIndex);
      }
      this.$emit("focus", event2);
    },
    onBlur: function onBlur2(event2) {
      this.focused = false;
      this.focusedOptionIndex = -1;
      this.searchValue = "";
      this.$emit("blur", event2);
    },
    onKeyDown: function onKeyDown2(event2) {
      if (this.disabled || DomHandler.isAndroid()) {
        event2.preventDefault();
        return;
      }
      var metaKey = event2.metaKey || event2.ctrlKey;
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, this.editable);
          break;
        case "Delete":
          this.onDeleteKey(event2);
        case "Home":
          this.onHomeKey(event2, this.editable);
          break;
        case "End":
          this.onEndKey(event2, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(event2);
          break;
        case "PageUp":
          this.onPageUpKey(event2);
          break;
        case "Space":
          this.onSpaceKey(event2, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2);
          break;
        case "Backspace":
          this.onBackspaceKey(event2, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event2.key)) {
            !this.overlayVisible && this.show();
            !this.editable && this.searchOptions(event2, event2.key);
          }
          break;
      }
      this.clicked = false;
    },
    onEditableInput: function onEditableInput(event2) {
      var value = event2.target.value;
      this.searchValue = "";
      var matched = this.searchOptions(event2, value);
      !matched && (this.focusedOptionIndex = -1);
      this.updateModel(event2, value);
      !this.overlayVisible && ObjectUtils.isNotEmpty(value) && this.show();
    },
    onContainerClick: function onContainerClick(event2) {
      if (this.disabled || this.loading) {
        return;
      }
      if (event2.target.tagName === "INPUT" || event2.target.getAttribute("data-pc-section") === "clearicon" || event2.target.closest('[data-pc-section="clearicon"]')) {
        return;
      } else if (!this.overlay || !this.overlay.contains(event2.target)) {
        this.overlayVisible ? this.hide(true) : this.show(true);
      }
      this.clicked = true;
    },
    onClearClick: function onClearClick(event2) {
      this.updateModel(event2, null);
      this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function onFirstHiddenFocus(event2) {
      var focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getFirstFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onLastHiddenFocus: function onLastHiddenFocus(event2) {
      var focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getLastFocusableElement(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onOptionSelect: function onOptionSelect(event2, option) {
      var isHide = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
      var value = this.getOptionValue(option);
      this.updateModel(event2, value);
      isHide && this.hide(true);
    },
    onOptionMouseMove: function onOptionMouseMove(event2, index2) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event2, index2);
      }
    },
    onFilterChange: function onFilterChange(event2) {
      var value = event2.target.value;
      this.filterValue = value;
      this.focusedOptionIndex = -1;
      this.$emit("filter", {
        originalEvent: event2,
        value
      });
      !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown: function onFilterKeyDown(event2) {
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, true);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, true);
          break;
        case "Home":
          this.onHomeKey(event2, true);
          break;
        case "End":
          this.onEndKey(event2, true);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2, true);
          break;
      }
    },
    onFilterBlur: function onFilterBlur() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated: function onFilterUpdated() {
      if (this.overlayVisible) {
        this.alignOverlay();
      }
    },
    onOverlayClick: function onOverlayClick(event2) {
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.$el
      });
    },
    onOverlayKeyDown: function onOverlayKeyDown(event2) {
      switch (event2.code) {
        case "Escape":
          this.onEscapeKey(event2);
          break;
      }
    },
    onDeleteKey: function onDeleteKey(event2) {
      if (this.showClear) {
        this.updateModel(event2, null);
        event2.preventDefault();
      }
    },
    onArrowDownKey: function onArrowDownKey2(event2) {
      if (!this.overlayVisible) {
        this.show();
        this.editable && this.changeFocusedOptionIndex(event2, this.findSelectedOptionIndex());
      } else {
        var optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();
        this.changeFocusedOptionIndex(event2, optionIndex);
      }
      event2.preventDefault();
    },
    onArrowUpKey: function onArrowUpKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (event2.altKey && !pressedInInputText) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.overlayVisible && this.hide();
        event2.preventDefault();
      } else {
        var optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(event2, optionIndex);
        !this.overlayVisible && this.show();
        event2.preventDefault();
      }
    },
    onArrowLeftKey: function onArrowLeftKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      pressedInInputText && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function onHomeKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (pressedInInputText) {
        event2.currentTarget.setSelectionRange(0, 0);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findFirstOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onEndKey: function onEndKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (pressedInInputText) {
        var target = event2.currentTarget;
        var len = target.value.length;
        target.setSelectionRange(len, len);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findLastOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onPageUpKey: function onPageUpKey(event2) {
      this.scrollInView(0);
      event2.preventDefault();
    },
    onPageDownKey: function onPageDownKey(event2) {
      this.scrollInView(this.visibleOptions.length - 1);
      event2.preventDefault();
    },
    onEnterKey: function onEnterKey2(event2) {
      if (!this.overlayVisible) {
        this.focusedOptionIndex = -1;
        this.onArrowDownKey(event2);
      } else {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.hide();
      }
      event2.preventDefault();
    },
    onSpaceKey: function onSpaceKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      !pressedInInputText && this.onEnterKey(event2);
    },
    onEscapeKey: function onEscapeKey2(event2) {
      this.overlayVisible && this.hide(true);
      event2.preventDefault();
    },
    onTabKey: function onTabKey2(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!pressedInInputText) {
        if (this.overlayVisible && this.hasFocusableElements()) {
          DomHandler.focus(this.$refs.firstHiddenFocusableElementOnOverlay);
          event2.preventDefault();
        } else {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
          }
          this.overlayVisible && this.hide(this.filter);
        }
      }
    },
    onBackspaceKey: function onBackspaceKey(event2) {
      var pressedInInputText = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (pressedInInputText) {
        !this.overlayVisible && this.show();
      }
    },
    onOverlayEnter: function onOverlayEnter(el) {
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      DomHandler.addStyles(el, {
        position: "absolute",
        top: "0",
        left: "0"
      });
      this.alignOverlay();
      this.scrollInView();
      this.autoFilterFocus && DomHandler.focus(this.$refs.filterInput);
    },
    onOverlayAfterEnter: function onOverlayAfterEnter() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.$emit("show");
    },
    onOverlayLeave: function onOverlayLeave() {
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit("hide");
      this.overlay = null;
    },
    onOverlayAfterLeave: function onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    alignOverlay: function alignOverlay() {
      if (this.appendTo === "self") {
        DomHandler.relativePosition(this.overlay, this.$el);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + "px";
        DomHandler.absolutePosition(this.overlay, this.$el);
      }
    },
    bindOutsideClickListener: function bindOutsideClickListener2() {
      var _this3 = this;
      if (!this.outsideClickListener) {
        this.outsideClickListener = function(event2) {
          if (_this3.overlayVisible && _this3.overlay && !_this3.$el.contains(event2.target) && !_this3.overlay.contains(event2.target)) {
            _this3.hide();
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener: function unbindOutsideClickListener2() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener: function bindScrollListener() {
      var _this4 = this;
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, function() {
          if (_this4.overlayVisible) {
            _this4.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener: function bindResizeListener3() {
      var _this5 = this;
      if (!this.resizeListener) {
        this.resizeListener = function() {
          if (_this5.overlayVisible && !DomHandler.isTouchDevice()) {
            _this5.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener: function unbindResizeListener3() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    bindLabelClickListener: function bindLabelClickListener() {
      var _this6 = this;
      if (!this.editable && !this.labelClickListener) {
        var label2 = document.querySelector('label[for="'.concat(this.inputId, '"]'));
        if (label2 && DomHandler.isVisible(label2)) {
          this.labelClickListener = function() {
            DomHandler.focus(_this6.$refs.focusInput);
          };
          label2.addEventListener("click", this.labelClickListener);
        }
      }
    },
    unbindLabelClickListener: function unbindLabelClickListener() {
      if (this.labelClickListener) {
        var label2 = document.querySelector('label[for="'.concat(this.inputId, '"]'));
        if (label2 && DomHandler.isVisible(label2)) {
          label2.removeEventListener("click", this.labelClickListener);
        }
      }
    },
    hasFocusableElements: function hasFocusableElements() {
      return DomHandler.getFocusableElements(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
    },
    isOptionMatched: function isOptionMatched(option) {
      var _this$getOptionLabel;
      return this.isValidOption(option) && ((_this$getOptionLabel = this.getOptionLabel(option)) === null || _this$getOptionLabel === void 0 ? void 0 : _this$getOptionLabel.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function isValidOption(option) {
      return ObjectUtils.isNotEmpty(option) && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    },
    isValidSelectedOption: function isValidSelectedOption(option) {
      return this.isValidOption(option) && this.isSelected(option);
    },
    isSelected: function isSelected2(option) {
      return this.isValidOption(option) && ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
    },
    findFirstOptionIndex: function findFirstOptionIndex() {
      var _this7 = this;
      return this.visibleOptions.findIndex(function(option) {
        return _this7.isValidOption(option);
      });
    },
    findLastOptionIndex: function findLastOptionIndex() {
      var _this8 = this;
      return ObjectUtils.findLastIndex(this.visibleOptions, function(option) {
        return _this8.isValidOption(option);
      });
    },
    findNextOptionIndex: function findNextOptionIndex(index2) {
      var _this9 = this;
      var matchedOptionIndex = index2 < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index2 + 1).findIndex(function(option) {
        return _this9.isValidOption(option);
      }) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index2 + 1 : index2;
    },
    findPrevOptionIndex: function findPrevOptionIndex(index2) {
      var _this10 = this;
      var matchedOptionIndex = index2 > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index2), function(option) {
        return _this10.isValidOption(option);
      }) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : index2;
    },
    findSelectedOptionIndex: function findSelectedOptionIndex() {
      var _this11 = this;
      return this.hasSelectedOption ? this.visibleOptions.findIndex(function(option) {
        return _this11.isValidSelectedOption(option);
      }) : -1;
    },
    findFirstFocusedOptionIndex: function findFirstFocusedOptionIndex() {
      var selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },
    findLastFocusedOptionIndex: function findLastFocusedOptionIndex() {
      var selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },
    searchOptions: function searchOptions(event2, _char) {
      var _this12 = this;
      this.searchValue = (this.searchValue || "") + _char;
      var optionIndex = -1;
      var matched = false;
      if (ObjectUtils.isNotEmpty(this.searchValue)) {
        if (this.focusedOptionIndex !== -1) {
          optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex(function(option) {
            return _this12.isOptionMatched(option);
          });
          optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex(function(option) {
            return _this12.isOptionMatched(option);
          }) : optionIndex + this.focusedOptionIndex;
        } else {
          optionIndex = this.visibleOptions.findIndex(function(option) {
            return _this12.isOptionMatched(option);
          });
        }
        if (optionIndex !== -1) {
          matched = true;
        }
        if (optionIndex === -1 && this.focusedOptionIndex === -1) {
          optionIndex = this.findFirstFocusedOptionIndex();
        }
        if (optionIndex !== -1) {
          this.changeFocusedOptionIndex(event2, optionIndex);
        }
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(function() {
        _this12.searchValue = "";
        _this12.searchTimeout = null;
      }, 500);
      return matched;
    },
    changeFocusedOptionIndex: function changeFocusedOptionIndex(event2, index2) {
      if (this.focusedOptionIndex !== index2) {
        this.focusedOptionIndex = index2;
        this.scrollInView();
        if (this.selectOnFocus) {
          this.onOptionSelect(event2, this.visibleOptions[index2], false);
        }
      }
    },
    scrollInView: function scrollInView4() {
      var _this13 = this;
      var index2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var id = index2 !== -1 ? "".concat(_this13.id, "_").concat(index2) : _this13.focusedOptionId;
        var element = DomHandler.findSingle(_this13.list, 'li[id="'.concat(id, '"]'));
        if (element) {
          element.scrollIntoView && element.scrollIntoView({
            block: "nearest",
            inline: "start"
          });
        } else if (!_this13.virtualScrollerDisabled) {
          _this13.virtualScroller && _this13.virtualScroller.scrollToIndex(index2 !== -1 ? index2 : _this13.focusedOptionIndex);
        }
      });
    },
    autoUpdateModel: function autoUpdateModel() {
      if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
      }
    },
    updateModel: function updateModel(event2, value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", {
        originalEvent: event2,
        value
      });
    },
    flatOptions: function flatOptions(options2) {
      var _this14 = this;
      return (options2 || []).reduce(function(result, option, index2) {
        result.push({
          optionGroup: option,
          group: true,
          index: index2
        });
        var optionGroupChildren = _this14.getOptionGroupChildren(option);
        optionGroupChildren && optionGroupChildren.forEach(function(o) {
          return result.push(o);
        });
        return result;
      }, []);
    },
    overlayRef: function overlayRef(el) {
      this.overlay = el;
    },
    listRef: function listRef(el, contentRef2) {
      this.list = el;
      contentRef2 && contentRef2(el);
    },
    virtualScrollerRef: function virtualScrollerRef(el) {
      this.virtualScroller = el;
    }
  },
  computed: {
    visibleOptions: function visibleOptions() {
      var _this15 = this;
      var options2 = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        var filteredOptions = FilterService.filter(options2, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var optionGroups = this.options || [];
          var filtered = [];
          optionGroups.forEach(function(group) {
            var groupChildren = _this15.getOptionGroupChildren(group);
            var filteredItems = groupChildren.filter(function(item2) {
              return filteredOptions.includes(item2);
            });
            if (filteredItems.length > 0)
              filtered.push(_objectSpread$1$1(_objectSpread$1$1({}, group), {}, _defineProperty$1$1({}, typeof _this15.optionGroupChildren === "string" ? _this15.optionGroupChildren : "items", _toConsumableArray$4(filteredItems))));
          });
          return this.flatOptions(filtered);
        }
        return filteredOptions;
      }
      return options2;
    },
    hasSelectedOption: function hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },
    label: function label() {
      var selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue: function editableInputValue() {
      var selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.modelValue || "";
    },
    equalityKey: function equalityKey() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function searchFields() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function filterResultMessageText() {
      return ObjectUtils.isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function filterMessageText() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function emptyFilterMessageText() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function emptyMessageText() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function selectionMessageText() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function emptySelectionMessageText() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function selectedMessageText() {
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function focusedOptionId() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function ariaSetSize() {
      var _this16 = this;
      return this.visibleOptions.filter(function(option) {
        return !_this16.isOptionGroup(option);
      }).length;
    },
    virtualScrollerDisabled: function virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }
  },
  directives: {
    ripple: Ripple
  },
  components: {
    VirtualScroller: script$v,
    Portal: script$w,
    TimesIcon: script$x,
    ChevronDownIcon: script$z,
    SpinnerIcon: script$G,
    FilterIcon: script$y,
    CheckIcon: script$A,
    BlankIcon: script$B
  }
};
function _typeof$e(o) {
  "@babel/helpers - typeof";
  return _typeof$e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$e(o);
}
function ownKeys$d(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$d(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$d(Object(t), true).forEach(function(r2) {
      _defineProperty$d(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$d(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$d(obj, key, value) {
  key = _toPropertyKey$d(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$d(t) {
  var i = _toPrimitive$d(t, "string");
  return "symbol" == _typeof$e(i) ? i : String(i);
}
function _toPrimitive$d(t, r) {
  if ("object" != _typeof$e(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$e(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$l = ["id"];
var _hoisted_2$i = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
var _hoisted_3$b = ["id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-disabled"];
var _hoisted_4$a = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
var _hoisted_5$9 = ["id"];
var _hoisted_6$8 = ["id"];
var _hoisted_7$1 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove", "data-p-highlight", "data-p-focused", "data-p-disabled"];
function render$s(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  var _component_CheckIcon = resolveComponent("CheckIcon");
  var _component_BlankIcon = resolveComponent("BlankIcon");
  var _component_VirtualScroller = resolveComponent("VirtualScroller");
  var _component_Portal = resolveComponent("Portal");
  var _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("div", mergeProps({
    ref: "container",
    id: $data.id,
    "class": _ctx.cx("root"),
    onClick: _cache[15] || (_cache[15] = function() {
      return $options.onContainerClick && $options.onContainerClick.apply($options, arguments);
    })
  }, _ctx.ptm("root"), {
    "data-pc-name": "dropdown"
  }), [_ctx.editable ? (openBlock(), createElementBlock("input", mergeProps({
    key: 0,
    ref: "focusInput",
    id: _ctx.inputId,
    type: "text",
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    value: $options.editableInputValue,
    placeholder: _ctx.placeholder,
    tabindex: !_ctx.disabled ? _ctx.tabindex : -1,
    disabled: _ctx.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": _ctx.ariaLabel,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $data.id + "_list",
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
    onFocus: _cache[0] || (_cache[0] = function() {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }),
    onBlur: _cache[1] || (_cache[1] = function() {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }),
    onKeydown: _cache[2] || (_cache[2] = function() {
      return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
    }),
    onInput: _cache[3] || (_cache[3] = function() {
      return $options.onEditableInput && $options.onEditableInput.apply($options, arguments);
    })
  }, _objectSpread$d(_objectSpread$d({}, _ctx.inputProps), _ctx.ptm("input"))), null, 16, _hoisted_2$i)) : (openBlock(), createElementBlock("span", mergeProps({
    key: 1,
    ref: "focusInput",
    id: _ctx.inputId,
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    tabindex: !_ctx.disabled ? _ctx.tabindex : -1,
    role: "combobox",
    "aria-label": _ctx.ariaLabel || ($options.label === "p-emptylabel" ? void 0 : $options.label),
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $data.id + "_list",
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
    "aria-disabled": _ctx.disabled,
    onFocus: _cache[4] || (_cache[4] = function() {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }),
    onBlur: _cache[5] || (_cache[5] = function() {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }),
    onKeydown: _cache[6] || (_cache[6] = function() {
      return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
    })
  }, _objectSpread$d(_objectSpread$d({}, _ctx.inputProps), _ctx.ptm("input"))), [renderSlot(_ctx.$slots, "value", {
    value: _ctx.modelValue,
    placeholder: _ctx.placeholder
  }, function() {
    return [createTextVNode(toDisplayString($options.label === "p-emptylabel" ? " " : $options.label || "empty"), 1)];
  })], 16, _hoisted_3$b)), _ctx.showClear && _ctx.modelValue != null ? renderSlot(_ctx.$slots, "clearicon", {
    key: 2,
    "class": normalizeClass(_ctx.cx("clearIcon")),
    onClick: $options.onClearClick,
    clearCallback: $options.onClearClick
  }, function() {
    return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.clearIcon ? "i" : "TimesIcon"), mergeProps({
      ref: "clearIcon",
      "class": [_ctx.cx("clearIcon"), _ctx.clearIcon],
      onClick: $options.onClearClick
    }, _objectSpread$d(_objectSpread$d({}, _ctx.clearIconProps), _ctx.ptm("clearIcon")), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("trigger")
  }, _ctx.ptm("trigger")), [_ctx.loading ? renderSlot(_ctx.$slots, "loadingicon", {
    key: 0,
    "class": normalizeClass(_ctx.cx("loadingIcon"))
  }, function() {
    return [_ctx.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
      key: 0,
      "class": [_ctx.cx("loadingIcon"), "pi-spin", _ctx.loadingIcon],
      "aria-hidden": "true"
    }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
      key: 1,
      "class": _ctx.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : renderSlot(_ctx.$slots, "dropdownicon", {
    key: 1,
    "class": normalizeClass(_ctx.cx("dropdownIcon"))
  }, function() {
    return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.dropdownIcon ? "span" : "ChevronDownIcon"), mergeProps({
      "class": [_ctx.cx("dropdownIcon"), _ctx.dropdownIcon],
      "aria-hidden": "true"
    }, _ctx.ptm("dropdownIcon")), null, 16, ["class"]))];
  })], 16), createVNode(_component_Portal, {
    appendTo: _ctx.appendTo
  }, {
    "default": withCtx(function() {
      return [createVNode(Transition, mergeProps({
        name: "p-connected-overlay",
        onEnter: $options.onOverlayEnter,
        onAfterEnter: $options.onOverlayAfterEnter,
        onLeave: $options.onOverlayLeave,
        onAfterLeave: $options.onOverlayAfterLeave
      }, _ctx.ptm("transition")), {
        "default": withCtx(function() {
          return [$data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            ref: $options.overlayRef,
            "class": [_ctx.cx("panel"), _ctx.panelClass],
            style: _ctx.panelStyle,
            onClick: _cache[13] || (_cache[13] = function() {
              return $options.onOverlayClick && $options.onOverlayClick.apply($options, arguments);
            }),
            onKeydown: _cache[14] || (_cache[14] = function() {
              return $options.onOverlayKeyDown && $options.onOverlayKeyDown.apply($options, arguments);
            })
          }, _objectSpread$d(_objectSpread$d({}, _ctx.panelProps), _ctx.ptm("panel"))), [createBaseVNode("span", mergeProps({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            "class": "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: _cache[7] || (_cache[7] = function() {
              return $options.onFirstHiddenFocus && $options.onFirstHiddenFocus.apply($options, arguments);
            })
          }, _ctx.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": true,
            "data-p-hidden-focusable": true
          }), null, 16), renderSlot(_ctx.$slots, "header", {
            value: _ctx.modelValue,
            options: $options.visibleOptions
          }), _ctx.filter ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            "class": _ctx.cx("header")
          }, _ctx.ptm("header")), [createBaseVNode("div", mergeProps({
            "class": _ctx.cx("filterContainer")
          }, _ctx.ptm("filterContainer")), [createBaseVNode("input", mergeProps({
            ref: "filterInput",
            type: "text",
            value: $data.filterValue,
            onVnodeMounted: _cache[8] || (_cache[8] = function() {
              return $options.onFilterUpdated && $options.onFilterUpdated.apply($options, arguments);
            }),
            "class": _ctx.cx("filterInput"),
            placeholder: _ctx.filterPlaceholder,
            role: "searchbox",
            autocomplete: "off",
            "aria-owns": $data.id + "_list",
            "aria-activedescendant": $options.focusedOptionId,
            onKeydown: _cache[9] || (_cache[9] = function() {
              return $options.onFilterKeyDown && $options.onFilterKeyDown.apply($options, arguments);
            }),
            onBlur: _cache[10] || (_cache[10] = function() {
              return $options.onFilterBlur && $options.onFilterBlur.apply($options, arguments);
            }),
            onInput: _cache[11] || (_cache[11] = function() {
              return $options.onFilterChange && $options.onFilterChange.apply($options, arguments);
            })
          }, _objectSpread$d(_objectSpread$d({}, _ctx.filterInputProps), _ctx.ptm("filterInput"))), null, 16, _hoisted_4$a), renderSlot(_ctx.$slots, "filtericon", {
            "class": normalizeClass(_ctx.cx("filterIcon"))
          }, function() {
            return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.filterIcon ? "span" : "FilterIcon"), mergeProps({
              "class": [_ctx.cx("filterIcon"), _ctx.filterIcon]
            }, _ctx.ptm("filterIcon")), null, 16, ["class"]))];
          })], 16), createBaseVNode("span", mergeProps({
            role: "status",
            "aria-live": "polite",
            "class": "p-hidden-accessible"
          }, _ctx.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": true
          }), toDisplayString($options.filterResultMessageText), 17)], 16)) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
            "class": _ctx.cx("wrapper"),
            style: {
              "max-height": $options.virtualScrollerDisabled ? _ctx.scrollHeight : ""
            }
          }, _ctx.ptm("wrapper")), [createVNode(_component_VirtualScroller, mergeProps({
            ref: $options.virtualScrollerRef
          }, _ctx.virtualScrollerOptions, {
            items: $options.visibleOptions,
            style: {
              height: _ctx.scrollHeight
            },
            tabindex: -1,
            disabled: $options.virtualScrollerDisabled,
            pt: _ctx.ptm("virtualScroller")
          }), createSlots({
            content: withCtx(function(_ref) {
              var styleClass = _ref.styleClass, contentRef2 = _ref.contentRef, items2 = _ref.items, getItemOptions = _ref.getItemOptions, contentStyle = _ref.contentStyle, itemSize2 = _ref.itemSize;
              return [createBaseVNode("ul", mergeProps({
                ref: function ref2(el) {
                  return $options.listRef(el, contentRef2);
                },
                id: $data.id + "_list",
                "class": [_ctx.cx("list"), styleClass],
                style: contentStyle,
                role: "listbox"
              }, _ctx.ptm("list")), [(openBlock(true), createElementBlock(Fragment, null, renderList(items2, function(option, i) {
                return openBlock(), createElementBlock(Fragment, {
                  key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                }, [$options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", mergeProps({
                  key: 0,
                  id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                  style: {
                    height: itemSize2 ? itemSize2 + "px" : void 0
                  },
                  "class": _ctx.cx("itemGroup"),
                  role: "option"
                }, _ctx.ptm("itemGroup")), [renderSlot(_ctx.$slots, "optiongroup", {
                  option: option.optionGroup,
                  index: $options.getOptionIndex(i, getItemOptions)
                }, function() {
                  return [createBaseVNode("span", mergeProps({
                    "class": _ctx.cx("itemGroupLabel")
                  }, _ctx.ptm("itemGroupLabel")), toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 17)];
                })], 16, _hoisted_6$8)) : withDirectives((openBlock(), createElementBlock("li", mergeProps({
                  key: 1,
                  id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                  "class": _ctx.cx("item", {
                    option,
                    focusedOption: $options.getOptionIndex(i, getItemOptions)
                  }),
                  style: {
                    height: itemSize2 ? itemSize2 + "px" : void 0
                  },
                  role: "option",
                  "aria-label": $options.getOptionLabel(option),
                  "aria-selected": $options.isSelected(option),
                  "aria-disabled": $options.isOptionDisabled(option),
                  "aria-setsize": $options.ariaSetSize,
                  "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                  onClick: function onClick3($event) {
                    return $options.onOptionSelect($event, option);
                  },
                  onMousemove: function onMousemove($event) {
                    return $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions));
                  },
                  "data-p-highlight": $options.isSelected(option),
                  "data-p-focused": $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions),
                  "data-p-disabled": $options.isOptionDisabled(option)
                }, $options.getPTItemOptions(option, getItemOptions, i, "item")), [_ctx.checkmark ? (openBlock(), createElementBlock(Fragment, {
                  key: 0
                }, [$options.isSelected(option) ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
                  key: 0,
                  "class": _ctx.cx("checkIcon")
                }, _ctx.ptm("checkIcon")), null, 16, ["class"])) : (openBlock(), createBlock(_component_BlankIcon, mergeProps({
                  key: 1,
                  "class": _ctx.cx("blankIcon")
                }, _ctx.ptm("blankIcon")), null, 16, ["class"]))], 64)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "option", {
                  option,
                  index: $options.getOptionIndex(i, getItemOptions)
                }, function() {
                  return [createBaseVNode("span", mergeProps({
                    "class": _ctx.cx("itemLabel")
                  }, _ctx.ptm("itemLabel")), toDisplayString($options.getOptionLabel(option)), 17)];
                })], 16, _hoisted_7$1)), [[_directive_ripple]])], 64);
              }), 128)), $data.filterValue && (!items2 || items2 && items2.length === 0) ? (openBlock(), createElementBlock("li", mergeProps({
                key: 0,
                "class": _ctx.cx("emptyMessage"),
                role: "option"
              }, _ctx.ptm("emptyMessage"), {
                "data-p-hidden-accessible": true
              }), [renderSlot(_ctx.$slots, "emptyfilter", {}, function() {
                return [createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)];
              })], 16)) : !_ctx.options || _ctx.options && _ctx.options.length === 0 ? (openBlock(), createElementBlock("li", mergeProps({
                key: 1,
                "class": _ctx.cx("emptyMessage"),
                role: "option"
              }, _ctx.ptm("emptyMessage"), {
                "data-p-hidden-accessible": true
              }), [renderSlot(_ctx.$slots, "empty", {}, function() {
                return [createTextVNode(toDisplayString($options.emptyMessageText), 1)];
              })], 16)) : createCommentVNode("", true)], 16, _hoisted_5$9)];
            }),
            _: 2
          }, [_ctx.$slots.loader ? {
            name: "loader",
            fn: withCtx(function(_ref2) {
              var options2 = _ref2.options;
              return [renderSlot(_ctx.$slots, "loader", {
                options: options2
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), renderSlot(_ctx.$slots, "footer", {
            value: _ctx.modelValue,
            options: $options.visibleOptions
          }), !_ctx.options || _ctx.options && _ctx.options.length === 0 ? (openBlock(), createElementBlock("span", mergeProps({
            key: 1,
            role: "status",
            "aria-live": "polite",
            "class": "p-hidden-accessible"
          }, _ctx.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": true
          }), toDisplayString($options.emptyMessageText), 17)) : createCommentVNode("", true), createBaseVNode("span", mergeProps({
            role: "status",
            "aria-live": "polite",
            "class": "p-hidden-accessible"
          }, _ctx.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": true
          }), toDisplayString($options.selectedMessageText), 17), createBaseVNode("span", mergeProps({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            "class": "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: _cache[12] || (_cache[12] = function() {
              return $options.onLastHiddenFocus && $options.onLastHiddenFocus.apply($options, arguments);
            })
          }, _ctx.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": true,
            "data-p-hidden-focusable": true
          }), null, 16)], 16)) : createCommentVNode("", true)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, _hoisted_1$l);
}
script$u.render = render$s;
var script$t = {
  name: "AngleUpIcon",
  "extends": script$M
};
var _hoisted_1$k = /* @__PURE__ */ createBaseVNode("path", {
  d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$h = [_hoisted_1$k];
function render$r(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$h, 16);
}
script$t.render = render$r;
var classes$4 = {
  root: function root5(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-inputtext p-component", {
      "p-filled": instance.filled,
      "p-inputtext-sm": props.size === "small",
      "p-inputtext-lg": props.size === "large"
    }];
  }
};
var InputTextStyle = BaseStyle.extend({
  name: "inputtext",
  classes: classes$4
});
var script$1$6 = {
  name: "BaseInputText",
  "extends": script$N,
  props: {
    modelValue: null,
    size: {
      type: String,
      "default": null
    }
  },
  style: InputTextStyle,
  provide: function provide7() {
    return {
      $parentInstance: this
    };
  }
};
var script$s = {
  name: "InputText",
  "extends": script$1$6,
  emits: ["update:modelValue"],
  methods: {
    getPTOptions: function getPTOptions3(key) {
      return this.ptm(key, {
        context: {
          filled: this.filled,
          disabled: this.$attrs.disabled || this.$attrs.disabled === ""
        }
      });
    },
    onInput: function onInput(event2) {
      this.$emit("update:modelValue", event2.target.value);
    }
  },
  computed: {
    filled: function filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    }
  }
};
var _hoisted_1$j = ["value"];
function render$q(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("input", mergeProps({
    "class": _ctx.cx("root"),
    value: _ctx.modelValue,
    onInput: _cache[0] || (_cache[0] = function() {
      return $options.onInput && $options.onInput.apply($options, arguments);
    })
  }, $options.getPTOptions("root"), {
    "data-pc-name": "inputtext"
  }), null, 16, _hoisted_1$j);
}
script$s.render = render$q;
var css$3 = "\n@layer primevue {\n    .p-inputnumber {\n        display: inline-flex;\n    }\n\n    .p-inputnumber-button {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        flex: 0 0 auto;\n    }\n\n    .p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,\n    .p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label {\n        display: none;\n    }\n\n    .p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up {\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0;\n        padding: 0;\n    }\n\n    .p-inputnumber-buttons-stacked .p-inputnumber-input {\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n\n    .p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down {\n        border-top-left-radius: 0;\n        border-top-right-radius: 0;\n        border-bottom-left-radius: 0;\n        padding: 0;\n    }\n\n    .p-inputnumber-buttons-stacked .p-inputnumber-button-group {\n        display: flex;\n        flex-direction: column;\n    }\n\n    .p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button {\n        flex: 1 1 auto;\n    }\n\n    .p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up {\n        order: 3;\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0;\n    }\n\n    .p-inputnumber-buttons-horizontal .p-inputnumber-input {\n        order: 2;\n        border-radius: 0;\n    }\n\n    .p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down {\n        order: 1;\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n    }\n\n    .p-inputnumber-buttons-vertical {\n        flex-direction: column;\n    }\n\n    .p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up {\n        order: 1;\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0;\n        width: 100%;\n    }\n\n    .p-inputnumber-buttons-vertical .p-inputnumber-input {\n        order: 2;\n        border-radius: 0;\n        text-align: center;\n    }\n\n    .p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down {\n        order: 3;\n        border-top-left-radius: 0;\n        border-top-right-radius: 0;\n        width: 100%;\n    }\n\n    .p-inputnumber-input {\n        flex: 1 1 auto;\n    }\n\n    .p-fluid .p-inputnumber {\n        width: 100%;\n    }\n\n    .p-fluid .p-inputnumber .p-inputnumber-input {\n        width: 1%;\n    }\n\n    .p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input {\n        width: 100%;\n    }\n}\n";
var classes$3 = {
  root: function root6(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-inputnumber p-component p-inputwrapper", {
      "p-inputwrapper-filled": instance.filled || props.allowEmpty === false,
      "p-inputwrapper-focus": instance.focused,
      "p-inputnumber-buttons-stacked": props.showButtons && props.buttonLayout === "stacked",
      "p-inputnumber-buttons-horizontal": props.showButtons && props.buttonLayout === "horizontal",
      "p-inputnumber-buttons-vertical": props.showButtons && props.buttonLayout === "vertical"
    }];
  },
  input: "p-inputnumber-input",
  buttonGroup: "p-inputnumber-button-group",
  incrementButton: function incrementButton(_ref2) {
    var instance = _ref2.instance, props = _ref2.props;
    return ["p-inputnumber-button p-inputnumber-button-up", {
      "p-disabled": props.showButtons && props.max !== null && instance.maxBoundry()
    }];
  },
  decrementButton: function decrementButton(_ref3) {
    var instance = _ref3.instance, props = _ref3.props;
    return ["p-inputnumber-button p-inputnumber-button-down", {
      "p-disabled": props.showButtons && props.min !== null && instance.minBoundry()
    }];
  }
};
var InputNumberStyle = BaseStyle.extend({
  name: "inputnumber",
  css: css$3,
  classes: classes$3
});
var script$1$5 = {
  name: "BaseInputNumber",
  "extends": script$N,
  props: {
    modelValue: {
      type: Number,
      "default": null
    },
    format: {
      type: Boolean,
      "default": true
    },
    showButtons: {
      type: Boolean,
      "default": false
    },
    buttonLayout: {
      type: String,
      "default": "stacked"
    },
    incrementButtonClass: {
      type: String,
      "default": null
    },
    decrementButtonClass: {
      type: String,
      "default": null
    },
    incrementButtonIcon: {
      type: String,
      "default": void 0
    },
    decrementButtonIcon: {
      type: String,
      "default": void 0
    },
    locale: {
      type: String,
      "default": void 0
    },
    localeMatcher: {
      type: String,
      "default": void 0
    },
    mode: {
      type: String,
      "default": "decimal"
    },
    prefix: {
      type: String,
      "default": null
    },
    suffix: {
      type: String,
      "default": null
    },
    currency: {
      type: String,
      "default": void 0
    },
    currencyDisplay: {
      type: String,
      "default": void 0
    },
    useGrouping: {
      type: Boolean,
      "default": true
    },
    minFractionDigits: {
      type: Number,
      "default": void 0
    },
    maxFractionDigits: {
      type: Number,
      "default": void 0
    },
    roundingMode: {
      type: String,
      "default": "halfExpand",
      validator: function validator(value) {
        return ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"].includes(value);
      }
    },
    min: {
      type: Number,
      "default": null
    },
    max: {
      type: Number,
      "default": null
    },
    step: {
      type: Number,
      "default": 1
    },
    allowEmpty: {
      type: Boolean,
      "default": true
    },
    highlightOnFocus: {
      type: Boolean,
      "default": false
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    placeholder: {
      type: String,
      "default": null
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    inputProps: {
      type: null,
      "default": null
    },
    incrementButtonProps: {
      type: null,
      "default": null
    },
    decrementButtonProps: {
      type: null,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: InputNumberStyle,
  provide: function provide8() {
    return {
      $parentInstance: this
    };
  }
};
function _typeof$d(o) {
  "@babel/helpers - typeof";
  return _typeof$d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$d(o);
}
function ownKeys$c(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$c(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$c(Object(t), true).forEach(function(r2) {
      _defineProperty$c(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$c(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$c(obj, key, value) {
  key = _toPropertyKey$c(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$c(t) {
  var i = _toPrimitive$c(t, "string");
  return "symbol" == _typeof$d(i) ? i : String(i);
}
function _toPrimitive$c(t, r) {
  if ("object" != _typeof$d(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$d(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toConsumableArray$3(arr) {
  return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _unsupportedIterableToArray$4(arr) || _nonIterableSpread$3();
}
function _nonIterableSpread$3() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$4(o, minLen);
}
function _iterableToArray$3(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$3(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$4(arr);
}
function _arrayLikeToArray$4(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var script$r = {
  name: "InputNumber",
  "extends": script$1$5,
  emits: ["update:modelValue", "input", "focus", "blur"],
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data: function data5() {
    return {
      d_modelValue: this.modelValue,
      focused: false
    };
  },
  watch: {
    modelValue: function modelValue2(newValue) {
      this.d_modelValue = newValue;
    },
    locale: function locale(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    localeMatcher: function localeMatcher(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    mode: function mode(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currency: function currency(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currencyDisplay: function currencyDisplay(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    useGrouping: function useGrouping(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    minFractionDigits: function minFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    maxFractionDigits: function maxFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    suffix: function suffix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    prefix: function prefix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    }
  },
  created: function created2() {
    this.constructParser();
  },
  methods: {
    getOptions: function getOptions2() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits,
        roundingMode: this.roundingMode
      };
    },
    constructParser: function constructParser() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      var numerals = _toConsumableArray$3(new Intl.NumberFormat(this.locale, {
        useGrouping: false
      }).format(9876543210)).reverse();
      var index2 = new Map(numerals.map(function(d, i) {
        return [d, i];
      }));
      this._numeral = new RegExp("[".concat(numerals.join(""), "]"), "g");
      this._group = this.getGroupingExpression();
      this._minusSign = this.getMinusSignExpression();
      this._currency = this.getCurrencyExpression();
      this._decimal = this.getDecimalExpression();
      this._suffix = this.getSuffixExpression();
      this._prefix = this.getPrefixExpression();
      this._index = function(d) {
        return index2.get(d);
      };
    },
    updateConstructParser: function updateConstructParser(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.constructParser();
      }
    },
    escapeRegExp: function escapeRegExp(text2) {
      return text2.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression: function getDecimalExpression() {
      var formatter = new Intl.NumberFormat(this.locale, _objectSpread$c(_objectSpread$c({}, this.getOptions()), {}, {
        useGrouping: false
      }));
      return new RegExp("[".concat(formatter.format(1.1).replace(this._currency, "").trim().replace(this._numeral, ""), "]"), "g");
    },
    getGroupingExpression: function getGroupingExpression() {
      var formatter = new Intl.NumberFormat(this.locale, {
        useGrouping: true
      });
      this.groupChar = formatter.format(1e6).trim().replace(this._numeral, "").charAt(0);
      return new RegExp("[".concat(this.groupChar, "]"), "g");
    },
    getMinusSignExpression: function getMinusSignExpression() {
      var formatter = new Intl.NumberFormat(this.locale, {
        useGrouping: false
      });
      return new RegExp("[".concat(formatter.format(-1).trim().replace(this._numeral, ""), "]"), "g");
    },
    getCurrencyExpression: function getCurrencyExpression() {
      if (this.currency) {
        var formatter = new Intl.NumberFormat(this.locale, {
          style: "currency",
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        return new RegExp("[".concat(formatter.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, ""), "]"), "g");
      }
      return new RegExp("[]", "g");
    },
    getPrefixExpression: function getPrefixExpression() {
      if (this.prefix) {
        this.prefixChar = this.prefix;
      } else {
        var formatter = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay
        });
        this.prefixChar = formatter.format(1).split("1")[0];
      }
      return new RegExp("".concat(this.escapeRegExp(this.prefixChar || "")), "g");
    },
    getSuffixExpression: function getSuffixExpression() {
      if (this.suffix) {
        this.suffixChar = this.suffix;
      } else {
        var formatter = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        this.suffixChar = formatter.format(1).split("1")[1];
      }
      return new RegExp("".concat(this.escapeRegExp(this.suffixChar || "")), "g");
    },
    formatValue: function formatValue(value) {
      if (value != null) {
        if (value === "-") {
          return value;
        }
        if (this.format) {
          var formatter = new Intl.NumberFormat(this.locale, this.getOptions());
          var formattedValue2 = formatter.format(value);
          if (this.prefix) {
            formattedValue2 = this.prefix + formattedValue2;
          }
          if (this.suffix) {
            formattedValue2 = formattedValue2 + this.suffix;
          }
          return formattedValue2;
        }
        return value.toString();
      }
      return "";
    },
    parseValue: function parseValue(text2) {
      var filteredText = text2.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (filteredText) {
        if (filteredText === "-")
          return filteredText;
        var parsedValue = +filteredText;
        return isNaN(parsedValue) ? null : parsedValue;
      }
      return null;
    },
    repeat: function repeat(event2, interval, dir) {
      var _this = this;
      if (this.readonly) {
        return;
      }
      var i = interval || 500;
      this.clearTimer();
      this.timer = setTimeout(function() {
        _this.repeat(event2, 40, dir);
      }, i);
      this.spin(event2, dir);
    },
    spin: function spin(event2, dir) {
      if (this.$refs.input) {
        var step = this.step * dir;
        var currentValue = this.parseValue(this.$refs.input.$el.value) || 0;
        var newValue = this.validateValue(currentValue + step);
        this.updateInput(newValue, null, "spin");
        this.updateModel(event2, newValue);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    onUpButtonMouseDown: function onUpButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, 1);
        event2.preventDefault();
      }
    },
    onUpButtonMouseUp: function onUpButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonMouseLeave: function onUpButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyUp: function onUpButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyDown: function onUpButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, 1);
      }
    },
    onDownButtonMouseDown: function onDownButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, -1);
        event2.preventDefault();
      }
    },
    onDownButtonMouseUp: function onDownButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonMouseLeave: function onDownButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyUp: function onDownButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyDown: function onDownButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, -1);
      }
    },
    onUserInput: function onUserInput() {
      if (this.isSpecialChar) {
        this.$refs.input.$el.value = this.lastValue;
      }
      this.isSpecialChar = false;
    },
    onInputKeyDown: function onInputKeyDown(event2) {
      if (this.readonly) {
        return;
      }
      this.lastValue = event2.target.value;
      if (event2.shiftKey || event2.altKey) {
        this.isSpecialChar = true;
        return;
      }
      var selectionStart = event2.target.selectionStart;
      var selectionEnd = event2.target.selectionEnd;
      var inputValue = event2.target.value;
      var newValueStr = null;
      if (event2.altKey) {
        event2.preventDefault();
      }
      switch (event2.code) {
        case "ArrowUp":
          this.spin(event2, 1);
          event2.preventDefault();
          break;
        case "ArrowDown":
          this.spin(event2, -1);
          event2.preventDefault();
          break;
        case "ArrowLeft":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
            event2.preventDefault();
          }
          break;
        case "ArrowRight":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
            event2.preventDefault();
          }
          break;
        case "Tab":
        case "Enter":
        case "NumpadEnter":
          newValueStr = this.validateValue(this.parseValue(inputValue));
          this.$refs.input.$el.value = this.formatValue(newValueStr);
          this.$refs.input.$el.setAttribute("aria-valuenow", newValueStr);
          this.updateModel(event2, newValueStr);
          break;
        case "Backspace": {
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            var deleteChar = inputValue.charAt(selectionStart - 1);
            var _this$getDecimalCharI = this.getDecimalCharIndexes(inputValue), decimalCharIndex = _this$getDecimalCharI.decimalCharIndex, decimalCharIndexWithoutPrefix = _this$getDecimalCharI.decimalCharIndexWithoutPrefix;
            if (this.isNumeralChar(deleteChar)) {
              var decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;
                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart - 1, selectionStart - 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                var insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart - 1) + "0" + inputValue.slice(selectionStart);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        }
        case "Delete":
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            var _deleteChar = inputValue.charAt(selectionStart);
            var _this$getDecimalCharI2 = this.getDecimalCharIndexes(inputValue), _decimalCharIndex = _this$getDecimalCharI2.decimalCharIndex, _decimalCharIndexWithoutPrefix = _this$getDecimalCharI2.decimalCharIndexWithoutPrefix;
            if (this.isNumeralChar(_deleteChar)) {
              var _decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(_deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
              } else if (this._decimal.test(_deleteChar)) {
                this._decimal.lastIndex = 0;
                if (_decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart + 1, selectionStart + 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                }
              } else if (_decimalCharIndex > 0 && selectionStart > _decimalCharIndex) {
                var _insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < _decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart) + _insertedText + inputValue.slice(selectionStart + 1);
              } else if (_decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart) + "0" + inputValue.slice(selectionStart + 1);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-back-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        case "Home":
          event2.preventDefault();
          if (!ObjectUtils.isEmpty(this.min)) {
            this.updateModel(event2, this.min);
          }
          break;
        case "End":
          event2.preventDefault();
          if (!ObjectUtils.isEmpty(this.max)) {
            this.updateModel(event2, this.max);
          }
          break;
      }
    },
    onInputKeyPress: function onInputKeyPress(event2) {
      if (this.readonly) {
        return;
      }
      event2.preventDefault();
      var code = event2.which || event2.keyCode;
      var _char = String.fromCharCode(code);
      var isDecimalSign2 = this.isDecimalSign(_char);
      var isMinusSign2 = this.isMinusSign(_char);
      if (48 <= code && code <= 57 || isMinusSign2 || isDecimalSign2) {
        this.insert(event2, _char, {
          isDecimalSign: isDecimalSign2,
          isMinusSign: isMinusSign2
        });
      }
    },
    onPaste: function onPaste(event2) {
      event2.preventDefault();
      var data17 = (event2.clipboardData || window["clipboardData"]).getData("Text");
      if (data17) {
        var filteredData = this.parseValue(data17);
        if (filteredData != null) {
          this.insert(event2, filteredData.toString());
        }
      }
    },
    allowMinusSign: function allowMinusSign() {
      return this.min === null || this.min < 0;
    },
    isMinusSign: function isMinusSign(_char2) {
      if (this._minusSign.test(_char2) || _char2 === "-") {
        this._minusSign.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalSign: function isDecimalSign(_char3) {
      if (this._decimal.test(_char3)) {
        this._decimal.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalMode: function isDecimalMode() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes: function getDecimalCharIndexes(val) {
      var decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      var filteredVal = val.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "");
      var decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
      this._decimal.lastIndex = 0;
      return {
        decimalCharIndex,
        decimalCharIndexWithoutPrefix
      };
    },
    getCharIndexes: function getCharIndexes(val) {
      var decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      var minusCharIndex = val.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      var suffixCharIndex = val.search(this._suffix);
      this._suffix.lastIndex = 0;
      var currencyCharIndex = val.search(this._currency);
      this._currency.lastIndex = 0;
      return {
        decimalCharIndex,
        minusCharIndex,
        suffixCharIndex,
        currencyCharIndex
      };
    },
    insert: function insert(event2, text2) {
      var sign = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        isDecimalSign: false,
        isMinusSign: false
      };
      var minusCharIndexOnText = text2.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
        return;
      }
      var selectionStart = this.$refs.input.$el.selectionStart;
      var selectionEnd = this.$refs.input.$el.selectionEnd;
      var inputValue = this.$refs.input.$el.value.trim();
      var _this$getCharIndexes = this.getCharIndexes(inputValue), decimalCharIndex = _this$getCharIndexes.decimalCharIndex, minusCharIndex = _this$getCharIndexes.minusCharIndex, suffixCharIndex = _this$getCharIndexes.suffixCharIndex, currencyCharIndex = _this$getCharIndexes.currencyCharIndex;
      var newValueStr;
      if (sign.isMinusSign) {
        if (selectionStart === 0) {
          newValueStr = inputValue;
          if (minusCharIndex === -1 || selectionEnd !== 0) {
            newValueStr = this.insertText(inputValue, text2, 0, selectionEnd);
          }
          this.updateValue(event2, newValueStr, text2, "insert");
        }
      } else if (sign.isDecimalSign) {
        if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
          this.updateValue(event2, inputValue, text2, "insert");
        } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
          newValueStr = this.insertText(inputValue, text2, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text2, "insert");
        } else if (decimalCharIndex === -1 && this.maxFractionDigits) {
          newValueStr = this.insertText(inputValue, text2, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text2, "insert");
        }
      } else {
        var maxFractionDigits2 = this.numberFormat.resolvedOptions().maximumFractionDigits;
        var operation = selectionStart !== selectionEnd ? "range-insert" : "insert";
        if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
          if (selectionStart + text2.length - (decimalCharIndex + 1) <= maxFractionDigits2) {
            var charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;
            newValueStr = inputValue.slice(0, selectionStart) + text2 + inputValue.slice(selectionStart + text2.length, charIndex) + inputValue.slice(charIndex);
            this.updateValue(event2, newValueStr, text2, operation);
          }
        } else {
          newValueStr = this.insertText(inputValue, text2, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text2, operation);
        }
      }
    },
    insertText: function insertText(value, text2, start, end) {
      var textSplit = text2 === "." ? text2 : text2.split(".");
      if (textSplit.length === 2) {
        var decimalCharIndex = value.slice(start, end).search(this._decimal);
        this._decimal.lastIndex = 0;
        return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text2) + value.slice(end) : this.formatValue(text2) || value;
      } else if (end - start === value.length) {
        return this.formatValue(text2);
      } else if (start === 0) {
        return text2 + value.slice(end);
      } else if (end === value.length) {
        return value.slice(0, start) + text2;
      } else {
        return value.slice(0, start) + text2 + value.slice(end);
      }
    },
    deleteRange: function deleteRange(value, start, end) {
      var newValueStr;
      if (end - start === value.length)
        newValueStr = "";
      else if (start === 0)
        newValueStr = value.slice(end);
      else if (end === value.length)
        newValueStr = value.slice(0, start);
      else
        newValueStr = value.slice(0, start) + value.slice(end);
      return newValueStr;
    },
    initCursor: function initCursor() {
      var selectionStart = this.$refs.input.$el.selectionStart;
      var inputValue = this.$refs.input.$el.value;
      var valueLength = inputValue.length;
      var index2 = null;
      var prefixLength = (this.prefixChar || "").length;
      inputValue = inputValue.replace(this._prefix, "");
      selectionStart = selectionStart - prefixLength;
      var _char4 = inputValue.charAt(selectionStart);
      if (this.isNumeralChar(_char4)) {
        return selectionStart + prefixLength;
      }
      var i = selectionStart - 1;
      while (i >= 0) {
        _char4 = inputValue.charAt(i);
        if (this.isNumeralChar(_char4)) {
          index2 = i + prefixLength;
          break;
        } else {
          i--;
        }
      }
      if (index2 !== null) {
        this.$refs.input.$el.setSelectionRange(index2 + 1, index2 + 1);
      } else {
        i = selectionStart;
        while (i < valueLength) {
          _char4 = inputValue.charAt(i);
          if (this.isNumeralChar(_char4)) {
            index2 = i + prefixLength;
            break;
          } else {
            i++;
          }
        }
        if (index2 !== null) {
          this.$refs.input.$el.setSelectionRange(index2, index2);
        }
      }
      return index2 || 0;
    },
    onInputClick: function onInputClick() {
      var currentValue = this.$refs.input.$el.value;
      if (!this.readonly && currentValue !== DomHandler.getSelection()) {
        this.initCursor();
      }
    },
    isNumeralChar: function isNumeralChar(_char5) {
      if (_char5.length === 1 && (this._numeral.test(_char5) || this._decimal.test(_char5) || this._group.test(_char5) || this._minusSign.test(_char5))) {
        this.resetRegex();
        return true;
      }
      return false;
    },
    resetRegex: function resetRegex() {
      this._numeral.lastIndex = 0;
      this._decimal.lastIndex = 0;
      this._group.lastIndex = 0;
      this._minusSign.lastIndex = 0;
    },
    updateValue: function updateValue(event2, valueStr, insertedValueStr, operation) {
      var currentValue = this.$refs.input.$el.value;
      var newValue = null;
      if (valueStr != null) {
        newValue = this.parseValue(valueStr);
        newValue = !newValue && !this.allowEmpty ? 0 : newValue;
        this.updateInput(newValue, insertedValueStr, operation, valueStr);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    handleOnInput: function handleOnInput(event2, currentValue, newValue) {
      if (this.isValueChanged(currentValue, newValue)) {
        this.$emit("input", {
          originalEvent: event2,
          value: newValue,
          formattedValue: currentValue
        });
      }
    },
    isValueChanged: function isValueChanged(currentValue, newValue) {
      if (newValue === null && currentValue !== null) {
        return true;
      }
      if (newValue != null) {
        var parsedCurrentValue = typeof currentValue === "string" ? this.parseValue(currentValue) : currentValue;
        return newValue !== parsedCurrentValue;
      }
      return false;
    },
    validateValue: function validateValue(value) {
      if (value === "-" || value == null) {
        return null;
      }
      if (this.min != null && value < this.min) {
        return this.min;
      }
      if (this.max != null && value > this.max) {
        return this.max;
      }
      return value;
    },
    updateInput: function updateInput(value, insertedValueStr, operation, valueStr) {
      insertedValueStr = insertedValueStr || "";
      var inputValue = this.$refs.input.$el.value;
      var newValue = this.formatValue(value);
      var currentLength = inputValue.length;
      if (newValue !== valueStr) {
        newValue = this.concatValues(newValue, valueStr);
      }
      if (currentLength === 0) {
        this.$refs.input.$el.value = newValue;
        this.$refs.input.$el.setSelectionRange(0, 0);
        var index2 = this.initCursor();
        var selectionEnd = index2 + insertedValueStr.length;
        this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
      } else {
        var selectionStart = this.$refs.input.$el.selectionStart;
        var _selectionEnd = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = newValue;
        var newLength = newValue.length;
        if (operation === "range-insert") {
          var startValue = this.parseValue((inputValue || "").slice(0, selectionStart));
          var startValueStr = startValue !== null ? startValue.toString() : "";
          var startExpr = startValueStr.split("").join("(".concat(this.groupChar, ")?"));
          var sRegex = new RegExp(startExpr, "g");
          sRegex.test(newValue);
          var tExpr = insertedValueStr.split("").join("(".concat(this.groupChar, ")?"));
          var tRegex = new RegExp(tExpr, "g");
          tRegex.test(newValue.slice(sRegex.lastIndex));
          _selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
          this.$refs.input.$el.setSelectionRange(_selectionEnd, _selectionEnd);
        } else if (newLength === currentLength) {
          if (operation === "insert" || operation === "delete-back-single") {
            var re = /[.,]/g;
            var newSelectionEnd = _selectionEnd + Number(re.test(value) || re.test(insertedValueStr));
            this.$refs.input.$el.setSelectionRange(newSelectionEnd, newSelectionEnd);
          } else if (operation === "delete-single") {
            this.$refs.input.$el.setSelectionRange(_selectionEnd - 1, _selectionEnd - 1);
          } else if (operation === "delete-range" || operation === "spin") {
            this.$refs.input.$el.setSelectionRange(_selectionEnd, _selectionEnd);
          }
        } else if (operation === "delete-back-single") {
          var prevChar = inputValue.charAt(_selectionEnd - 1);
          var nextChar = inputValue.charAt(_selectionEnd);
          var diff = currentLength - newLength;
          var isGroupChar = this._group.test(nextChar);
          if (isGroupChar && diff === 1) {
            _selectionEnd += 1;
          } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
            _selectionEnd += -1 * diff + 1;
          }
          this._group.lastIndex = 0;
          this.$refs.input.$el.setSelectionRange(_selectionEnd, _selectionEnd);
        } else if (inputValue === "-" && operation === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var _index = this.initCursor();
          var _selectionEnd2 = _index + insertedValueStr.length + 1;
          this.$refs.input.$el.setSelectionRange(_selectionEnd2, _selectionEnd2);
        } else {
          _selectionEnd = _selectionEnd + (newLength - currentLength);
          this.$refs.input.$el.setSelectionRange(_selectionEnd, _selectionEnd);
        }
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", value);
    },
    concatValues: function concatValues(val1, val2) {
      if (val1 && val2) {
        var decimalCharIndex = val2.search(this._decimal);
        this._decimal.lastIndex = 0;
        if (this.suffixChar) {
          return decimalCharIndex !== -1 ? val1.replace(this.suffixChar, "").split(this._decimal)[0] + val2.replace(this.suffixChar, "").slice(decimalCharIndex) + this.suffixChar : val1;
        } else {
          return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
        }
      }
      return val1;
    },
    getDecimalLength: function getDecimalLength(value) {
      if (value) {
        var valueSplit = value.split(this._decimal);
        if (valueSplit.length === 2) {
          return valueSplit[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
        }
      }
      return 0;
    },
    updateModel: function updateModel2(event2, value) {
      this.d_modelValue = value;
      this.$emit("update:modelValue", value);
    },
    onInputFocus: function onInputFocus(event2) {
      this.focused = true;
      if (!this.disabled && !this.readonly && this.$refs.input.$el.value !== DomHandler.getSelection() && this.highlightOnFocus) {
        event2.target.select();
      }
      this.$emit("focus", event2);
    },
    onInputBlur: function onInputBlur(event2) {
      this.focused = false;
      var input2 = event2.target;
      var newValue = this.validateValue(this.parseValue(input2.value));
      this.$emit("blur", {
        originalEvent: event2,
        value: input2.value
      });
      input2.value = this.formatValue(newValue);
      input2.setAttribute("aria-valuenow", newValue);
      this.updateModel(event2, newValue);
      if (!this.disabled && !this.readonly && this.highlightOnFocus) {
        DomHandler.clearSelection();
      }
    },
    clearTimer: function clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    maxBoundry: function maxBoundry() {
      return this.d_modelValue >= this.max;
    },
    minBoundry: function minBoundry() {
      return this.d_modelValue <= this.min;
    }
  },
  computed: {
    filled: function filled2() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    },
    upButtonListeners: function upButtonListeners() {
      var _this2 = this;
      return {
        mousedown: function mousedown(event2) {
          return _this2.onUpButtonMouseDown(event2);
        },
        mouseup: function mouseup(event2) {
          return _this2.onUpButtonMouseUp(event2);
        },
        mouseleave: function mouseleave(event2) {
          return _this2.onUpButtonMouseLeave(event2);
        },
        keydown: function keydown(event2) {
          return _this2.onUpButtonKeyDown(event2);
        },
        keyup: function keyup(event2) {
          return _this2.onUpButtonKeyUp(event2);
        }
      };
    },
    downButtonListeners: function downButtonListeners() {
      var _this3 = this;
      return {
        mousedown: function mousedown(event2) {
          return _this3.onDownButtonMouseDown(event2);
        },
        mouseup: function mouseup(event2) {
          return _this3.onDownButtonMouseUp(event2);
        },
        mouseleave: function mouseleave(event2) {
          return _this3.onDownButtonMouseLeave(event2);
        },
        keydown: function keydown(event2) {
          return _this3.onDownButtonKeyDown(event2);
        },
        keyup: function keyup(event2) {
          return _this3.onDownButtonKeyUp(event2);
        }
      };
    },
    formattedValue: function formattedValue() {
      var val = !this.modelValue && !this.allowEmpty ? 0 : this.modelValue;
      return this.formatValue(val);
    },
    getFormatter: function getFormatter() {
      return this.numberFormat;
    }
  },
  components: {
    INInputText: script$s,
    INButton: script$F,
    AngleUpIcon: script$t,
    AngleDownIcon: script$K
  }
};
function render$p(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_INInputText = resolveComponent("INInputText");
  var _component_INButton = resolveComponent("INButton");
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptm("root"), {
    "data-pc-name": "inputnumber"
  }), [createVNode(_component_INInputText, mergeProps({
    ref: "input",
    id: _ctx.inputId,
    role: "spinbutton",
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    value: $options.formattedValue,
    "aria-valuemin": _ctx.min,
    "aria-valuemax": _ctx.max,
    "aria-valuenow": _ctx.modelValue,
    disabled: _ctx.disabled,
    readonly: _ctx.readonly,
    placeholder: _ctx.placeholder,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    onInput: $options.onUserInput,
    onKeydown: $options.onInputKeyDown,
    onKeypress: $options.onInputKeyPress,
    onPaste: $options.onPaste,
    onClick: $options.onInputClick,
    onFocus: $options.onInputFocus,
    onBlur: $options.onInputBlur
  }, _ctx.inputProps, {
    pt: _ctx.ptm("input"),
    unstyled: _ctx.unstyled,
    "data-pc-section": "input"
  }), null, 16, ["id", "class", "style", "value", "aria-valuemin", "aria-valuemax", "aria-valuenow", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur", "pt", "unstyled"]), _ctx.showButtons && _ctx.buttonLayout === "stacked" ? (openBlock(), createElementBlock("span", mergeProps({
    key: 0,
    "class": _ctx.cx("buttonGroup")
  }, _ctx.ptm("buttonGroup")), [createVNode(_component_INButton, mergeProps({
    "class": [_ctx.cx("incrementButton"), _ctx.incrementButtonClass]
  }, toHandlers($options.upButtonListeners), {
    disabled: _ctx.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, _ctx.incrementButtonProps, {
    pt: _ctx.ptm("incrementButton"),
    unstyled: _ctx.unstyled,
    "data-pc-section": "incrementbutton"
  }), {
    icon: withCtx(function() {
      return [renderSlot(_ctx.$slots, "incrementbuttonicon", {}, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementButtonIcon ? "span" : "AngleUpIcon"), mergeProps({
          "class": _ctx.incrementButtonIcon
        }, _ctx.ptm("incrementButton")["icon"], {
          "data-pc-section": "incrementbuttonicon"
        }), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["class", "disabled", "pt", "unstyled"]), createVNode(_component_INButton, mergeProps({
    "class": [_ctx.cx("decrementButton"), _ctx.decrementButtonClass]
  }, toHandlers($options.downButtonListeners), {
    disabled: _ctx.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, _ctx.decrementButtonProps, {
    pt: _ctx.ptm("decrementButton"),
    unstyled: _ctx.unstyled,
    "data-pc-section": "decrementbutton"
  }), {
    icon: withCtx(function() {
      return [renderSlot(_ctx.$slots, "decrementbuttonicon", {}, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementButtonIcon ? "span" : "AngleDownIcon"), mergeProps({
          "class": _ctx.decrementButtonIcon
        }, _ctx.ptm("decrementButton")["icon"], {
          "data-pc-section": "decrementbuttonicon"
        }), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["class", "disabled", "pt", "unstyled"])], 16)) : createCommentVNode("", true), _ctx.showButtons && _ctx.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
    key: 1,
    "class": [_ctx.cx("incrementButton"), _ctx.incrementButtonClass]
  }, toHandlers($options.upButtonListeners), {
    disabled: _ctx.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, _ctx.incrementButtonProps, {
    pt: _ctx.ptm("incrementButton"),
    unstyled: _ctx.unstyled,
    "data-pc-section": "incrementbutton"
  }), {
    icon: withCtx(function() {
      return [renderSlot(_ctx.$slots, "incrementbuttonicon", {}, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementButtonIcon ? "span" : "AngleUpIcon"), mergeProps({
          "class": _ctx.incrementButtonIcon
        }, _ctx.ptm("incrementButton")["icon"], {
          "data-pc-section": "incrementbuttonicon"
        }), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["class", "disabled", "pt", "unstyled"])) : createCommentVNode("", true), _ctx.showButtons && _ctx.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
    key: 2,
    "class": [_ctx.cx("decrementButton"), _ctx.decrementButtonClass]
  }, toHandlers($options.downButtonListeners), {
    disabled: _ctx.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, _ctx.decrementButtonProps, {
    pt: _ctx.ptm("decrementButton"),
    unstyled: _ctx.unstyled,
    "data-pc-section": "decrementbutton"
  }), {
    icon: withCtx(function() {
      return [renderSlot(_ctx.$slots, "decrementbuttonicon", {}, function() {
        return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementButtonIcon ? "span" : "AngleDownIcon"), mergeProps({
          "class": _ctx.decrementButtonIcon
        }, _ctx.ptm("decrementButton")["icon"], {
          "data-pc-section": "decrementbuttonicon"
        }), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["class", "disabled", "pt", "unstyled"])) : createCommentVNode("", true)], 16);
}
script$r.render = render$p;
var script$q = {
  name: "AngleDoubleRightIcon",
  "extends": script$M
};
var _hoisted_1$i = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$g = [_hoisted_1$i];
function render$o(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$g, 16);
}
script$q.render = render$o;
var script$p = {
  name: "AngleLeftIcon",
  "extends": script$M
};
var _hoisted_1$h = /* @__PURE__ */ createBaseVNode("path", {
  d: "M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$f = [_hoisted_1$h];
function render$n(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$f, 16);
}
script$p.render = render$n;
var script$a$1 = {
  name: "BasePaginator",
  "extends": script$N,
  props: {
    totalRecords: {
      type: Number,
      "default": 0
    },
    rows: {
      type: Number,
      "default": 0
    },
    first: {
      type: Number,
      "default": 0
    },
    pageLinkSize: {
      type: Number,
      "default": 5
    },
    rowsPerPageOptions: {
      type: Array,
      "default": null
    },
    template: {
      type: [Object, String],
      "default": "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    currentPageReportTemplate: {
      type: null,
      "default": "({currentPage} of {totalPages})"
    },
    alwaysShow: {
      type: Boolean,
      "default": true
    }
  },
  style: PaginatorStyle,
  provide: function provide9() {
    return {
      $parentInstance: this
    };
  }
};
var script$9$1 = {
  name: "CurrentPageReport",
  hostName: "Paginator",
  "extends": script$N,
  props: {
    pageCount: {
      type: Number,
      "default": 0
    },
    currentPage: {
      type: Number,
      "default": 0
    },
    page: {
      type: Number,
      "default": 0
    },
    first: {
      type: Number,
      "default": 0
    },
    rows: {
      type: Number,
      "default": 0
    },
    totalRecords: {
      type: Number,
      "default": 0
    },
    template: {
      type: String,
      "default": "({currentPage} of {totalPages})"
    }
  },
  computed: {
    text: function text() {
      var text2 = this.template.replace("{currentPage}", this.currentPage).replace("{totalPages}", this.pageCount).replace("{first}", this.pageCount > 0 ? this.first + 1 : 0).replace("{last}", Math.min(this.first + this.rows, this.totalRecords)).replace("{rows}", this.rows).replace("{totalRecords}", this.totalRecords);
      return text2;
    }
  }
};
function render$9$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("current")
  }, _ctx.ptm("current")), toDisplayString($options.text), 17);
}
script$9$1.render = render$9$1;
var script$8$1 = {
  name: "FirstPageLink",
  hostName: "Paginator",
  "extends": script$N,
  props: {
    template: {
      type: Function,
      "default": null
    }
  },
  methods: {
    getPTOptions: function getPTOptions4(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleDoubleLeftIcon: script$C
  },
  directives: {
    ripple: Ripple
  }
};
function render$8$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("firstPageButton"),
    type: "button"
  }, $options.getPTOptions("firstPageButton"), {
    "data-pc-group-section": "pagebutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleDoubleLeftIcon"), mergeProps({
    "class": _ctx.cx("firstPageIcon")
  }, $options.getPTOptions("firstPageIcon")), null, 16, ["class"]))], 16)), [[_directive_ripple]]);
}
script$8$1.render = render$8$1;
var script$7$1 = {
  name: "JumpToPageDropdown",
  hostName: "Paginator",
  "extends": script$N,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean,
    templates: null
  },
  methods: {
    onChange: function onChange(value) {
      this.$emit("page-change", value);
    }
  },
  computed: {
    pageOptions: function pageOptions() {
      var opts = [];
      for (var i = 0; i < this.pageCount; i++) {
        opts.push({
          label: String(i + 1),
          value: i
        });
      }
      return opts;
    }
  },
  components: {
    JTPDropdown: script$u
  }
};
function render$7$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_JTPDropdown = resolveComponent("JTPDropdown");
  return openBlock(), createBlock(_component_JTPDropdown, {
    modelValue: $props.page,
    options: $options.pageOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function($event) {
      return $options.onChange($event);
    }),
    "class": normalizeClass(_ctx.cx("jumpToPageDropdown")),
    disabled: $props.disabled,
    unstyled: _ctx.unstyled,
    pt: _ctx.ptm("jumpToPageDropdown"),
    "data-pc-section": "jumptopagedropdown",
    "data-pc-group-section": "pagedropdown"
  }, createSlots({
    _: 2
  }, [$props.templates["jumptopagedropdownicon"] ? {
    name: "dropdownicon",
    fn: withCtx(function(slotProps) {
      return [(openBlock(), createBlock(resolveDynamicComponent($props.templates["jumptopagedropdownicon"]), {
        "class": normalizeClass(slotProps["class"])
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
script$7$1.render = render$7$1;
var script$6$1 = {
  name: "JumpToPageInput",
  hostName: "Paginator",
  "extends": script$N,
  inheritAttrs: false,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  data: function data6() {
    return {
      d_page: this.page
    };
  },
  watch: {
    page: function page(newValue) {
      this.d_page = newValue;
    }
  },
  methods: {
    onChange: function onChange2(value) {
      if (value !== this.page) {
        this.d_page = value;
        this.$emit("page-change", value - 1);
      }
    }
  },
  computed: {
    inputArialabel: function inputArialabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.jumpToPageInputLabel : void 0;
    }
  },
  components: {
    JTPInput: script$r
  }
};
function render$6$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_JTPInput = resolveComponent("JTPInput");
  return openBlock(), createBlock(_component_JTPInput, {
    ref: "jtpInput",
    modelValue: $data.d_page,
    "class": normalizeClass(_ctx.cx("jumpToPageInput")),
    "aria-label": $options.inputArialabel,
    disabled: $props.disabled,
    "onUpdate:modelValue": $options.onChange,
    unstyled: _ctx.unstyled,
    pt: _ctx.ptm("jumpToPageInput"),
    "data-pc-section": "jumptopageinput"
  }, null, 8, ["modelValue", "class", "aria-label", "disabled", "onUpdate:modelValue", "unstyled", "pt"]);
}
script$6$1.render = render$6$1;
var script$5$1 = {
  name: "LastPageLink",
  hostName: "Paginator",
  "extends": script$N,
  props: {
    template: {
      type: Function,
      "default": null
    }
  },
  methods: {
    getPTOptions: function getPTOptions5(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleDoubleRightIcon: script$q
  },
  directives: {
    ripple: Ripple
  }
};
function render$5$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("lastPageButton"),
    type: "button"
  }, $options.getPTOptions("lastPageButton"), {
    "data-pc-group-section": "pagebutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleDoubleRightIcon"), mergeProps({
    "class": _ctx.cx("lastPageIcon")
  }, $options.getPTOptions("lastPageIcon")), null, 16, ["class"]))], 16)), [[_directive_ripple]]);
}
script$5$1.render = render$5$1;
var script$4$1 = {
  name: "NextPageLink",
  hostName: "Paginator",
  "extends": script$N,
  props: {
    template: {
      type: Function,
      "default": null
    }
  },
  methods: {
    getPTOptions: function getPTOptions6(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleRightIcon: script$J
  },
  directives: {
    ripple: Ripple
  }
};
function render$4$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("nextPageButton"),
    type: "button"
  }, $options.getPTOptions("nextPageButton"), {
    "data-pc-group-section": "pagebutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleRightIcon"), mergeProps({
    "class": _ctx.cx("nextPageIcon")
  }, $options.getPTOptions("nextPageIcon")), null, 16, ["class"]))], 16)), [[_directive_ripple]]);
}
script$4$1.render = render$4$1;
var script$3$1 = {
  name: "PageLinks",
  hostName: "Paginator",
  "extends": script$N,
  inheritAttrs: false,
  emits: ["click"],
  props: {
    value: Array,
    page: Number
  },
  methods: {
    getPTOptions: function getPTOptions7(pageLink, key) {
      return this.ptm(key, {
        context: {
          active: pageLink === this.page
        }
      });
    },
    onPageLinkClick: function onPageLinkClick(event2, pageLink) {
      this.$emit("click", {
        originalEvent: event2,
        value: pageLink
      });
    },
    ariaPageLabel: function ariaPageLabel(value) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.pageLabel.replace(/{page}/g, value) : void 0;
    }
  },
  directives: {
    ripple: Ripple
  }
};
var _hoisted_1$g = ["aria-label", "aria-current", "onClick", "data-p-highlight"];
function render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("pages")
  }, _ctx.ptm("pages")), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.value, function(pageLink) {
    return withDirectives((openBlock(), createElementBlock("button", mergeProps({
      key: pageLink,
      "class": _ctx.cx("pageButton", {
        pageLink
      }),
      type: "button",
      "aria-label": $options.ariaPageLabel(pageLink),
      "aria-current": pageLink - 1 === $props.page ? "page" : void 0,
      onClick: function onClick3($event) {
        return $options.onPageLinkClick($event, pageLink);
      }
    }, $options.getPTOptions(pageLink - 1, "pageButton"), {
      "data-p-highlight": pageLink - 1 === $props.page
    }), [createTextVNode(toDisplayString(pageLink), 1)], 16, _hoisted_1$g)), [[_directive_ripple]]);
  }), 128))], 16);
}
script$3$1.render = render$3$1;
var script$2$1 = {
  name: "PrevPageLink",
  hostName: "Paginator",
  "extends": script$N,
  props: {
    template: {
      type: Function,
      "default": null
    }
  },
  methods: {
    getPTOptions: function getPTOptions8(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleLeftIcon: script$p
  },
  directives: {
    ripple: Ripple
  }
};
function render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("previousPageButton"),
    type: "button"
  }, $options.getPTOptions("previousPageButton"), {
    "data-pc-group-section": "pagebutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleLeftIcon"), mergeProps({
    "class": _ctx.cx("previousPageIcon")
  }, $options.getPTOptions("previousPageIcon")), null, 16, ["class"]))], 16)), [[_directive_ripple]]);
}
script$2$1.render = render$2$1;
var script$1$4 = {
  name: "RowsPerPageDropdown",
  hostName: "Paginator",
  "extends": script$N,
  emits: ["rows-change"],
  props: {
    options: Array,
    rows: Number,
    disabled: Boolean,
    templates: null
  },
  methods: {
    onChange: function onChange3(value) {
      this.$emit("rows-change", value);
    }
  },
  computed: {
    rowsOptions: function rowsOptions() {
      var opts = [];
      if (this.options) {
        for (var i = 0; i < this.options.length; i++) {
          opts.push({
            label: String(this.options[i]),
            value: this.options[i]
          });
        }
      }
      return opts;
    }
  },
  components: {
    RPPDropdown: script$u
  }
};
function render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_RPPDropdown = resolveComponent("RPPDropdown");
  return openBlock(), createBlock(_component_RPPDropdown, {
    modelValue: $props.rows,
    options: $options.rowsOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function($event) {
      return $options.onChange($event);
    }),
    "class": normalizeClass(_ctx.cx("rowPerPageDropdown")),
    disabled: $props.disabled,
    unstyled: _ctx.unstyled,
    pt: _ctx.ptm("rowPerPageDropdown"),
    "data-pc-section": "rowperpagedropdown",
    "data-pc-group-section": "pagedropdown"
  }, createSlots({
    _: 2
  }, [$props.templates["rowsperpagedropdownicon"] ? {
    name: "dropdownicon",
    fn: withCtx(function(slotProps) {
      return [(openBlock(), createBlock(resolveDynamicComponent($props.templates["rowsperpagedropdownicon"]), {
        "class": normalizeClass(slotProps["class"])
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
script$1$4.render = render$1$1;
function _toConsumableArray$2(arr) {
  return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$3(arr) || _nonIterableSpread$2();
}
function _nonIterableSpread$2() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$2(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$2(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$3(arr);
}
function _typeof$c(o) {
  "@babel/helpers - typeof";
  return _typeof$c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$c(o);
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$3(o, minLen);
}
function _arrayLikeToArray$3(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$1(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr))
    return arr;
}
var script$o = {
  name: "Paginator",
  "extends": script$a$1,
  emits: ["update:first", "update:rows", "page"],
  data: function data7() {
    return {
      d_first: this.first,
      d_rows: this.rows
    };
  },
  watch: {
    first: function first(newValue) {
      this.d_first = newValue;
    },
    rows: function rows(newValue) {
      this.d_rows = newValue;
    },
    totalRecords: function totalRecords(newValue) {
      if (this.page > 0 && newValue && this.d_first >= newValue) {
        this.changePage(this.pageCount - 1);
      }
    }
  },
  mounted: function mounted7() {
    this.setPaginatorAttribute();
    this.createStyle();
  },
  methods: {
    changePage: function changePage(p2) {
      var pc = this.pageCount;
      if (p2 >= 0 && p2 < pc) {
        this.d_first = this.d_rows * p2;
        var state = {
          page: p2,
          first: this.d_first,
          rows: this.d_rows,
          pageCount: pc
        };
        this.$emit("update:first", this.d_first);
        this.$emit("update:rows", this.d_rows);
        this.$emit("page", state);
      }
    },
    changePageToFirst: function changePageToFirst(event2) {
      if (!this.isFirstPage) {
        this.changePage(0);
      }
      event2.preventDefault();
    },
    changePageToPrev: function changePageToPrev(event2) {
      this.changePage(this.page - 1);
      event2.preventDefault();
    },
    changePageLink: function changePageLink(event2) {
      this.changePage(event2.value - 1);
      event2.originalEvent.preventDefault();
    },
    changePageToNext: function changePageToNext(event2) {
      this.changePage(this.page + 1);
      event2.preventDefault();
    },
    changePageToLast: function changePageToLast(event2) {
      if (!this.isLastPage) {
        this.changePage(this.pageCount - 1);
      }
      event2.preventDefault();
    },
    onRowChange: function onRowChange(value) {
      this.d_rows = value;
      this.changePage(this.page);
    },
    createStyle: function createStyle() {
      var _this = this;
      if (this.hasBreakpoints() && !this.isUnstyled) {
        var _this$$primevue;
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        DomHandler.setAttribute(this.styleElement, "nonce", (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.csp) === null || _this$$primevue === void 0 ? void 0 : _this$$primevue.nonce);
        document.head.appendChild(this.styleElement);
        var innerHTML = "";
        var keys = Object.keys(this.template);
        var sortedBreakpoints = {};
        keys.sort(function(a, b) {
          return parseInt(a) - parseInt(b);
        }).forEach(function(key2) {
          sortedBreakpoints[key2] = _this.template[key2];
        });
        for (var _i = 0, _Object$entries = Object.entries(Object.entries(sortedBreakpoints)); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray$1(_Object$entries[_i], 2), index2 = _Object$entries$_i[0], _Object$entries$_i$ = _slicedToArray$1(_Object$entries$_i[1], 1), key = _Object$entries$_i$[0];
          var minValue = void 0, calculatedMinValue = void 0;
          if (key !== "default" && typeof Object.keys(sortedBreakpoints)[index2 - 1] === "string") {
            calculatedMinValue = Number(Object.keys(sortedBreakpoints)[index2 - 1].slice(0, -2)) + 1 + "px";
          } else {
            calculatedMinValue = Object.keys(sortedBreakpoints)[index2 - 1];
          }
          minValue = Object.entries(sortedBreakpoints)[index2 - 1] ? "and (min-width:".concat(calculatedMinValue, ")") : "";
          if (key === "default") {
            innerHTML += "\n                            @media screen ".concat(minValue, " {\n                                .paginator[").concat(this.attributeSelector, "],\n                                .p-paginator-default{\n                                    display: flex;\n                                }\n                            }\n                        ");
          } else {
            innerHTML += "\n.paginator[".concat(this.attributeSelector, "], .p-paginator-").concat(key, " {\n    display: none;\n}\n@media screen ").concat(minValue, " and (max-width: ").concat(key, ") {\n    .paginator[").concat(this.attributeSelector, "], .p-paginator-").concat(key, " {\n        display: flex;\n    }\n    .paginator[").concat(this.attributeSelector, "],\n    .p-paginator-default{\n        display: none;\n    }\n}\n                    ");
          }
        }
        this.styleElement.innerHTML = innerHTML;
      }
    },
    hasBreakpoints: function hasBreakpoints() {
      return _typeof$c(this.template) === "object";
    },
    setPaginatorAttribute: function setPaginatorAttribute() {
      var _this2 = this;
      if (this.$refs.paginator && this.$refs.paginator.length >= 0) {
        _toConsumableArray$2(this.$refs.paginator).forEach(function(el) {
          el.setAttribute(_this2.attributeSelector, "");
        });
      }
    },
    getAriaLabel: function getAriaLabel(labelType) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[labelType] : void 0;
    }
  },
  computed: {
    templateItems: function templateItems() {
      var keys = {};
      if (this.hasBreakpoints()) {
        keys = this.template;
        if (!keys["default"]) {
          keys["default"] = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
        }
        for (var item2 in keys) {
          keys[item2] = this.template[item2].split(" ").map(function(value) {
            return value.trim();
          });
        }
        return keys;
      }
      keys["default"] = this.template.split(" ").map(function(value) {
        return value.trim();
      });
      return keys;
    },
    page: function page2() {
      return Math.floor(this.d_first / this.d_rows);
    },
    pageCount: function pageCount() {
      return Math.ceil(this.totalRecords / this.d_rows);
    },
    isFirstPage: function isFirstPage() {
      return this.page === 0;
    },
    isLastPage: function isLastPage() {
      return this.page === this.pageCount - 1;
    },
    calculatePageLinkBoundaries: function calculatePageLinkBoundaries() {
      var numberOfPages = this.pageCount;
      var visiblePages = Math.min(this.pageLinkSize, numberOfPages);
      var start = Math.max(0, Math.ceil(this.page - visiblePages / 2));
      var end = Math.min(numberOfPages - 1, start + visiblePages - 1);
      var delta = this.pageLinkSize - (end - start + 1);
      start = Math.max(0, start - delta);
      return [start, end];
    },
    pageLinks: function pageLinks() {
      var pageLinks2 = [];
      var boundaries = this.calculatePageLinkBoundaries;
      var start = boundaries[0];
      var end = boundaries[1];
      for (var i = start; i <= end; i++) {
        pageLinks2.push(i + 1);
      }
      return pageLinks2;
    },
    currentState: function currentState() {
      return {
        page: this.page,
        first: this.d_first,
        rows: this.d_rows
      };
    },
    empty: function empty() {
      return this.pageCount === 0;
    },
    currentPage: function currentPage() {
      return this.pageCount > 0 ? this.page + 1 : 0;
    },
    attributeSelector: function attributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    CurrentPageReport: script$9$1,
    FirstPageLink: script$8$1,
    LastPageLink: script$5$1,
    NextPageLink: script$4$1,
    PageLinks: script$3$1,
    PrevPageLink: script$2$1,
    RowsPerPageDropdown: script$1$4,
    JumpToPageDropdown: script$7$1,
    JumpToPageInput: script$6$1
  }
};
function render$m(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_FirstPageLink = resolveComponent("FirstPageLink");
  var _component_PrevPageLink = resolveComponent("PrevPageLink");
  var _component_NextPageLink = resolveComponent("NextPageLink");
  var _component_LastPageLink = resolveComponent("LastPageLink");
  var _component_PageLinks = resolveComponent("PageLinks");
  var _component_CurrentPageReport = resolveComponent("CurrentPageReport");
  var _component_RowsPerPageDropdown = resolveComponent("RowsPerPageDropdown");
  var _component_JumpToPageDropdown = resolveComponent("JumpToPageDropdown");
  var _component_JumpToPageInput = resolveComponent("JumpToPageInput");
  return (_ctx.alwaysShow ? true : $options.pageLinks && $options.pageLinks.length > 1) ? (openBlock(), createElementBlock("nav", normalizeProps(mergeProps({
    key: 0
  }, _ctx.ptm("paginatorWrapper"))), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.templateItems, function(value, key) {
    return openBlock(), createElementBlock("div", mergeProps({
      key,
      ref_for: true,
      ref: "paginator",
      "class": _ctx.cx("paginator", {
        key
      })
    }, _ctx.ptm("root"), {
      "data-pc-name": "paginator"
    }), [_ctx.$slots.start ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      "class": _ctx.cx("start")
    }, _ctx.ptm("start")), [renderSlot(_ctx.$slots, "start", {
      state: $options.currentState
    })], 16)) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(value, function(item2) {
      return openBlock(), createElementBlock(Fragment, {
        key: item2
      }, [item2 === "FirstPageLink" ? (openBlock(), createBlock(_component_FirstPageLink, {
        key: 0,
        "aria-label": $options.getAriaLabel("firstPageLabel"),
        template: _ctx.$slots.firstpagelinkicon,
        onClick: _cache[0] || (_cache[0] = function($event) {
          return $options.changePageToFirst($event);
        }),
        disabled: $options.isFirstPage || $options.empty,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : item2 === "PrevPageLink" ? (openBlock(), createBlock(_component_PrevPageLink, {
        key: 1,
        "aria-label": $options.getAriaLabel("prevPageLabel"),
        template: _ctx.$slots.prevpagelinkicon,
        onClick: _cache[1] || (_cache[1] = function($event) {
          return $options.changePageToPrev($event);
        }),
        disabled: $options.isFirstPage || $options.empty,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : item2 === "NextPageLink" ? (openBlock(), createBlock(_component_NextPageLink, {
        key: 2,
        "aria-label": $options.getAriaLabel("nextPageLabel"),
        template: _ctx.$slots.nextpagelinkicon,
        onClick: _cache[2] || (_cache[2] = function($event) {
          return $options.changePageToNext($event);
        }),
        disabled: $options.isLastPage || $options.empty,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : item2 === "LastPageLink" ? (openBlock(), createBlock(_component_LastPageLink, {
        key: 3,
        "aria-label": $options.getAriaLabel("lastPageLabel"),
        template: _ctx.$slots.lastpagelinkicon,
        onClick: _cache[3] || (_cache[3] = function($event) {
          return $options.changePageToLast($event);
        }),
        disabled: $options.isLastPage || $options.empty,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : item2 === "PageLinks" ? (openBlock(), createBlock(_component_PageLinks, {
        key: 4,
        "aria-label": $options.getAriaLabel("pageLabel"),
        value: $options.pageLinks,
        page: $options.page,
        onClick: _cache[4] || (_cache[4] = function($event) {
          return $options.changePageLink($event);
        }),
        pt: _ctx.pt
      }, null, 8, ["aria-label", "value", "page", "pt"])) : item2 === "CurrentPageReport" ? (openBlock(), createBlock(_component_CurrentPageReport, {
        key: 5,
        "aria-live": "polite",
        template: _ctx.currentPageReportTemplate,
        currentPage: $options.currentPage,
        page: $options.page,
        pageCount: $options.pageCount,
        first: $data.d_first,
        rows: $data.d_rows,
        totalRecords: _ctx.totalRecords,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["template", "currentPage", "page", "pageCount", "first", "rows", "totalRecords", "unstyled", "pt"])) : item2 === "RowsPerPageDropdown" && _ctx.rowsPerPageOptions ? (openBlock(), createBlock(_component_RowsPerPageDropdown, {
        key: 6,
        "aria-label": $options.getAriaLabel("rowsPerPageLabel"),
        rows: $data.d_rows,
        options: _ctx.rowsPerPageOptions,
        onRowsChange: _cache[5] || (_cache[5] = function($event) {
          return $options.onRowChange($event);
        }),
        disabled: $options.empty,
        templates: _ctx.$slots,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "rows", "options", "disabled", "templates", "unstyled", "pt"])) : item2 === "JumpToPageDropdown" ? (openBlock(), createBlock(_component_JumpToPageDropdown, {
        key: 7,
        "aria-label": $options.getAriaLabel("jumpToPageDropdownLabel"),
        page: $options.page,
        pageCount: $options.pageCount,
        onPageChange: _cache[6] || (_cache[6] = function($event) {
          return $options.changePage($event);
        }),
        disabled: $options.empty,
        templates: _ctx.$slots,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["aria-label", "page", "pageCount", "disabled", "templates", "unstyled", "pt"])) : item2 === "JumpToPageInput" ? (openBlock(), createBlock(_component_JumpToPageInput, {
        key: 8,
        page: $options.currentPage,
        onPageChange: _cache[7] || (_cache[7] = function($event) {
          return $options.changePage($event);
        }),
        disabled: $options.empty,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["page", "disabled", "unstyled", "pt"])) : createCommentVNode("", true)], 64);
    }), 128)), _ctx.$slots.end ? (openBlock(), createElementBlock("div", mergeProps({
      key: 1,
      "class": _ctx.cx("end")
    }, _ctx.ptm("end")), [renderSlot(_ctx.$slots, "end", {
      state: $options.currentState
    })], 16)) : createCommentVNode("", true)], 16);
  }), 128))], 16)) : createCommentVNode("", true);
}
script$o.render = render$m;
var css$2 = "\n@layer primevue {\n    .p-datatable {\n        position: relative;\n    }\n\n    .p-datatable-table {\n        border-spacing: 0px;\n        width: 100%;\n    }\n\n    .p-datatable .p-sortable-column {\n        cursor: pointer;\n        user-select: none;\n    }\n\n    .p-datatable .p-sortable-column .p-column-title,\n    .p-datatable .p-sortable-column .p-sortable-column-icon,\n    .p-datatable .p-sortable-column .p-sortable-column-badge {\n        vertical-align: middle;\n    }\n\n    .p-datatable .p-sortable-column .p-sortable-column-badge {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n    }\n\n    .p-datatable-hoverable-rows .p-selectable-row {\n        cursor: pointer;\n    }\n\n    /* Scrollable */\n    .p-datatable-scrollable > .p-datatable-wrapper {\n        position: relative;\n    }\n\n    .p-datatable-scrollable-table > .p-datatable-thead {\n        top: 0;\n        z-index: 1;\n    }\n\n    .p-datatable-scrollable-table > .p-datatable-frozen-tbody {\n        position: sticky;\n        z-index: 1;\n    }\n\n    .p-datatable-scrollable-table > .p-datatable-tfoot {\n        bottom: 0;\n        z-index: 1;\n    }\n\n    .p-datatable-scrollable .p-frozen-column {\n        position: sticky;\n        background: inherit;\n    }\n\n    .p-datatable-scrollable th.p-frozen-column {\n        z-index: 1;\n    }\n\n    .p-datatable-flex-scrollable {\n        display: flex;\n        flex-direction: column;\n        height: 100%;\n    }\n\n    .p-datatable-flex-scrollable > .p-datatable-wrapper {\n        display: flex;\n        flex-direction: column;\n        flex: 1;\n        height: 100%;\n    }\n\n    .p-datatable-scrollable-table > .p-datatable-tbody > .p-rowgroup-header {\n        position: sticky;\n        z-index: 1;\n    }\n\n    /* Resizable */\n    .p-datatable-resizable-table > .p-datatable-thead > tr > th,\n    .p-datatable-resizable-table > .p-datatable-tfoot > tr > td,\n    .p-datatable-resizable-table > .p-datatable-tbody > tr > td {\n        overflow: hidden;\n        white-space: nowrap;\n    }\n\n    .p-datatable-resizable-table > .p-datatable-thead > tr > th.p-resizable-column:not(.p-frozen-column) {\n        background-clip: padding-box;\n        position: relative;\n    }\n\n    .p-datatable-resizable-table-fit > .p-datatable-thead > tr > th.p-resizable-column:last-child .p-column-resizer {\n        display: none;\n    }\n\n    .p-datatable .p-column-resizer {\n        display: block;\n        position: absolute;\n        top: 0;\n        right: 0;\n        margin: 0;\n        width: 0.5rem;\n        height: 100%;\n        padding: 0px;\n        cursor: col-resize;\n        border: 1px solid transparent;\n    }\n\n    .p-datatable .p-column-header-content {\n        display: flex;\n        align-items: center;\n    }\n\n    .p-datatable .p-column-resizer-helper {\n        width: 1px;\n        position: absolute;\n        z-index: 10;\n        display: none;\n    }\n\n    .p-datatable .p-row-editor-init,\n    .p-datatable .p-row-editor-save,\n    .p-datatable .p-row-editor-cancel {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        overflow: hidden;\n        position: relative;\n    }\n\n    /* Expand */\n    .p-datatable .p-row-toggler {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        overflow: hidden;\n        position: relative;\n    }\n\n    /* Reorder */\n    .p-datatable-reorder-indicator-up,\n    .p-datatable-reorder-indicator-down {\n        position: absolute;\n        display: none;\n    }\n\n    .p-reorderable-column,\n    .p-datatable-reorderablerow-handle {\n        cursor: move;\n    }\n\n    /* Loader */\n    .p-datatable .p-datatable-loading-overlay {\n        position: absolute;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        z-index: 2;\n    }\n\n    /* Filter */\n    .p-column-filter-row {\n        display: flex;\n        align-items: center;\n        width: 100%;\n    }\n\n    .p-column-filter-menu {\n        display: inline-flex;\n        margin-left: auto;\n    }\n\n    .p-column-filter-row .p-column-filter-element {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n\n    .p-column-filter-menu-button,\n    .p-column-filter-clear-button {\n        display: inline-flex;\n        justify-content: center;\n        align-items: center;\n        cursor: pointer;\n        text-decoration: none;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .p-column-filter-row-items {\n        margin: 0;\n        padding: 0;\n        list-style: none;\n    }\n\n    .p-column-filter-row-item {\n        cursor: pointer;\n    }\n\n    .p-column-filter-add-button,\n    .p-column-filter-remove-button {\n        justify-content: center;\n    }\n\n    .p-column-filter-add-button .p-button-label,\n    .p-column-filter-remove-button .p-button-label {\n        flex-grow: 0;\n    }\n\n    .p-column-filter-buttonbar {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n    }\n\n    .p-column-filter-buttonbar .p-button:not(.p-button-icon-only) {\n        width: auto;\n    }\n\n    /* Responsive */\n    .p-datatable .p-datatable-tbody > tr > td > .p-column-title {\n        display: none;\n    }\n\n    /* VirtualScroller */\n    .p-datatable-virtualscroller-spacer {\n        display: flex;\n    }\n\n    .p-datatable .p-virtualscroller .p-virtualscroller-loading {\n        transform: none !important;\n        min-height: 0;\n        position: sticky;\n        top: 0;\n        left: 0;\n    }\n}\n";
var classes$2 = {
  root: function root7(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-datatable p-component", {
      "p-datatable-hoverable-rows": props.rowHover || props.selectionMode,
      "p-datatable-resizable": props.resizableColumns,
      "p-datatable-resizable-fit": props.resizableColumns && props.columnResizeMode === "fit",
      "p-datatable-scrollable": props.scrollable,
      "p-datatable-flex-scrollable": props.scrollable && props.scrollHeight === "flex",
      "p-datatable-responsive-stack": props.responsiveLayout === "stack",
      "p-datatable-responsive-scroll": props.responsiveLayout === "scroll",
      "p-datatable-striped": props.stripedRows,
      "p-datatable-gridlines": props.showGridlines,
      "p-datatable-grouped-header": instance.headerColumnGroup != null,
      "p-datatable-grouped-footer": instance.footerColumnGroup != null,
      "p-datatable-sm": props.size === "small",
      "p-datatable-lg": props.size === "large"
    }];
  },
  loadingOverlay: "p-datatable-loading-overlay p-component-overlay",
  loadingIcon: "p-datatable-loading-icon",
  header: "p-datatable-header",
  paginator: function paginator2(_ref2) {
    var instance = _ref2.instance;
    return instance.paginatorTop ? "p-paginator-top" : instance.paginatorBottom ? "p-paginator-bottom" : "";
  },
  wrapper: "p-datatable-wrapper",
  table: function table(_ref3) {
    var props = _ref3.props;
    return ["p-datatable-table", {
      "p-datatable-scrollable-table": props.scrollable,
      "p-datatable-resizable-table": props.resizableColumns,
      "p-datatable-resizable-table-fit": props.resizableColumns && props.columnResizeMode === "fit"
    }];
  },
  //tablehead
  thead: "p-datatable-thead",
  // headercell
  headerCell: function headerCell(_ref4) {
    var instance = _ref4.instance, props = _ref4.props, column = _ref4.column;
    return column && !instance.columnProp(column, "hidden") && (props.rowGroupMode !== "subheader" || props.groupRowsBy !== instance.columnProp(column, "field")) ? ["p-filter-column", {
      "p-frozen-column": instance.columnProp(column, "frozen")
    }] : [{
      "p-sortable-column": instance.columnProp("sortable"),
      "p-resizable-column": instance.resizableColumns,
      "p-highlight": instance.isColumnSorted(),
      "p-filter-column": props.filterColumn,
      "p-frozen-column": instance.columnProp("frozen"),
      "p-reorderable-column": props.reorderableColumns
    }];
  },
  columnResizer: "p-column-resizer",
  headerContent: "p-column-header-content",
  headerTitle: "p-column-title",
  sortIcon: "p-sortable-column-icon",
  sortBadge: "p-sortable-column-badge",
  // columnfilter
  columnFilter: function columnFilter(_ref5) {
    var props = _ref5.props;
    return ["p-column-filter p-fluid", {
      "p-column-filter-row": props.display === "row",
      "p-column-filter-menu": props.display === "menu"
    }];
  },
  filterInput: "p-fluid p-column-filter-element",
  filterMenuButton: function filterMenuButton(_ref6) {
    var instance = _ref6.instance;
    return ["p-column-filter-menu-button p-link", {
      "p-column-filter-menu-button-open": instance.overlayVisible,
      "p-column-filter-menu-button-active": instance.hasFilter()
    }];
  },
  headerFilterClearButton: function headerFilterClearButton(_ref7) {
    var instance = _ref7.instance;
    return ["p-column-filter-clear-button p-link", {
      "p-hidden-space": !instance.hasRowFilter()
    }];
  },
  filterOverlay: function filterOverlay(_ref8) {
    var instance = _ref8.instance, props = _ref8.props;
    return [{
      "p-column-filter-overlay p-component p-fluid": true,
      "p-column-filter-overlay-menu": props.display === "menu",
      "p-input-filled": instance.$primevue.config.inputStyle === "filled",
      "p-ripple-disabled": instance.$primevue.config.ripple === false
    }];
  },
  filterRowItems: "p-column-filter-row-items",
  filterRowItem: function filterRowItem(_ref9) {
    var instance = _ref9.instance, matchMode = _ref9.matchMode;
    return ["p-column-filter-row-item", {
      "p-highlight": matchMode && instance.isRowMatchModeSelected(matchMode.value)
    }];
  },
  filterSeparator: "p-column-filter-separator",
  filterOperator: "p-column-filter-operator",
  filterOperatorDropdown: "p-column-filter-operator-dropdown",
  filterConstraints: "p-column-filter-constraints",
  filterConstraint: "p-column-filter-constraint",
  filterMatchModeDropdown: "p-column-filter-matchmode-dropdown",
  filterRemoveButton: "p-column-filter-remove-button p-button-text p-button-danger p-button-sm",
  filterAddRule: "p-column-filter-add-rule",
  filterAddRuleButton: "p-column-filter-add-button p-button-text p-button-sm",
  filterButtonbar: "p-column-filter-buttonbar",
  filterClearButton: "p-button-outlined p-button-sm",
  filterApplyButton: "p-button-sm",
  //tablebody
  tbody: function tbody(_ref10) {
    var props = _ref10.props;
    return props.frozenRow ? "p-datatable-tbody p-datatable-frozen-tbody" : "p-datatable-tbody";
  },
  rowgroupHeader: "p-rowgroup-header",
  rowGroupToggler: "p-row-toggler p-link",
  rowGroupTogglerIcon: "p-row-toggler-icon",
  row: function row(_ref11) {
    var instance = _ref11.instance, props = _ref11.props, index2 = _ref11.index;
    var rowStyleClass = [];
    if (props.selectionMode) {
      rowStyleClass.push("p-selectable-row");
    }
    if (props.selection) {
      rowStyleClass.push({
        "p-highlight": instance.isSelected && instance.$parentInstance.$parentInstance.highlightOnSelect
      });
    }
    if (props.contextMenuSelection) {
      rowStyleClass.push({
        "p-highlight-contextmenu": instance.isSelectedWithContextMenu
      });
    }
    rowStyleClass.push(index2 % 2 === 0 ? "p-row-even" : "p-row-odd");
    return rowStyleClass;
  },
  rowExpansion: "p-datatable-row-expansion",
  rowgroupFooter: "p-rowgroup-footer",
  emptyMessage: "p-datatable-emptymessage",
  //bodycell
  bodyCell: function bodyCell(_ref12) {
    var instance = _ref12.instance;
    return [{
      "p-selection-column": instance.columnProp("selectionMode") != null,
      "p-editable-column": instance.isEditable(),
      "p-cell-editing": instance.d_editing,
      "p-frozen-column": instance.columnProp("frozen")
    }];
  },
  columnTitle: "p-column-title",
  rowReorderIcon: "p-datatable-reorderablerow-handle",
  rowToggler: "p-row-toggler p-link",
  rowTogglerIcon: "p-row-toggler-icon",
  rowEditorInitButton: "p-row-editor-init p-link",
  rowEditorInitIcon: "p-row-editor-init-icon",
  rowEditorSaveButton: "p-row-editor-save p-link",
  rowEditorSaveIcon: "p-row-editor-save-icon",
  rowEditorCancelButton: "p-row-editor-cancel p-link",
  rowEditorCancelIcon: "p-row-editor-cancel-icon",
  //tablefooter
  tfoot: "p-datatable-tfoot",
  //footercell
  footerCell: function footerCell(_ref13) {
    var instance = _ref13.instance;
    return [{
      "p-frozen-column": instance.columnProp("frozen")
    }];
  },
  //datatable
  virtualScrollerSpacer: "p-datatable-virtualscroller-spacer",
  footer: "p-datatable-footer",
  resizeHelper: "p-column-resizer-helper",
  reorderIndicatorUp: "p-datatable-reorder-indicator-up",
  reorderIndicatorDown: "p-datatable-reorder-indicator-down"
};
var inlineStyles = {
  wrapper: {
    overflow: "auto"
  },
  thead: {
    position: "sticky"
  },
  tfoot: {
    position: "sticky"
  }
};
var DataTableStyle = BaseStyle.extend({
  name: "datatable",
  css: css$2,
  classes: classes$2,
  inlineStyles
});
var script$n = {
  name: "ChevronRightIcon",
  "extends": script$M
};
var _hoisted_1$f = /* @__PURE__ */ createBaseVNode("path", {
  d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_2$e = [_hoisted_1$f];
function render$l(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$e, 16);
}
script$n.render = render$l;
var script$m = {
  name: "PencilIcon",
  "extends": script$M
};
var _hoisted_1$e = ["clip-path"];
var _hoisted_2$d = /* @__PURE__ */ createBaseVNode("path", {
  d: "M0.609628 13.959C0.530658 13.9599 0.452305 13.9451 0.379077 13.9156C0.305849 13.8861 0.239191 13.8424 0.18294 13.787C0.118447 13.7234 0.0688234 13.6464 0.0376166 13.5614C0.00640987 13.4765 -0.00560954 13.3857 0.00241768 13.2956L0.25679 10.1501C0.267698 10.0041 0.331934 9.86709 0.437312 9.76516L9.51265 0.705715C10.0183 0.233014 10.6911 -0.0203041 11.3835 0.00127367C12.0714 0.00660201 12.7315 0.27311 13.2298 0.746671C13.7076 1.23651 13.9824 1.88848 13.9992 2.57201C14.0159 3.25554 13.7733 3.92015 13.32 4.4327L4.23648 13.5331C4.13482 13.6342 4.0017 13.6978 3.85903 13.7133L0.667067 14L0.609628 13.959ZM1.43018 10.4696L1.25787 12.714L3.50619 12.5092L12.4502 3.56444C12.6246 3.35841 12.7361 3.10674 12.7714 2.83933C12.8067 2.57193 12.7644 2.30002 12.6495 2.05591C12.5346 1.8118 12.3519 1.60575 12.1231 1.46224C11.8943 1.31873 11.6291 1.2438 11.3589 1.24633C11.1813 1.23508 11.0033 1.25975 10.8355 1.31887C10.6677 1.37798 10.5136 1.47033 10.3824 1.59036L1.43018 10.4696Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$a = [_hoisted_2$d];
var _hoisted_4$9 = ["id"];
var _hoisted_5$8 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$7 = [_hoisted_5$8];
function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$a, 8, _hoisted_1$e), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$7, 8, _hoisted_4$9)])], 16);
}
script$m.render = render$k;
var css$1 = "\n@layer primevue {\n    .p-checkbox {\n        position: relative;\n        display: inline-flex;\n        user-select: none;\n        vertical-align: bottom;\n    }\n\n    .p-checkbox-input {\n        cursor: pointer;\n    }\n\n    .p-checkbox-box {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n    }\n}\n";
var classes$1 = {
  root: function root8(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-checkbox p-component", {
      "p-highlight": instance.checked,
      "p-disabled": props.disabled
    }];
  },
  box: "p-checkbox-box",
  input: "p-checkbox-input",
  icon: "p-checkbox-icon"
};
var CheckboxStyle = BaseStyle.extend({
  name: "checkbox",
  css: css$1,
  classes: classes$1
});
var script$1$3 = {
  name: "BaseCheckbox",
  "extends": script$N,
  props: {
    value: null,
    modelValue: null,
    binary: Boolean,
    name: {
      type: String,
      "default": null
    },
    trueValue: {
      type: null,
      "default": true
    },
    falseValue: {
      type: null,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    required: {
      type: Boolean,
      "default": false
    },
    tabindex: {
      type: Number,
      "default": null
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: CheckboxStyle,
  provide: function provide10() {
    return {
      $parentInstance: this
    };
  }
};
function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2(o, minLen);
}
function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$2(arr);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var script$l = {
  name: "Checkbox",
  "extends": script$1$3,
  emits: ["update:modelValue", "change", "focus", "blur"],
  methods: {
    getPTOptions: function getPTOptions9(key) {
      return this.ptm(key, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function onChange4(event2) {
      var _this = this;
      if (!this.disabled && !this.readonly) {
        var newModelValue;
        if (this.binary) {
          newModelValue = this.checked ? this.falseValue : this.trueValue;
        } else {
          if (this.checked)
            newModelValue = this.modelValue.filter(function(val) {
              return !ObjectUtils.equals(val, _this.value);
            });
          else
            newModelValue = this.modelValue ? [].concat(_toConsumableArray$1(this.modelValue), [this.value]) : [this.value];
        }
        this.$emit("update:modelValue", newModelValue);
        this.$emit("change", event2);
      }
    },
    onFocus: function onFocus3(event2) {
      this.$emit("focus", event2);
    },
    onBlur: function onBlur3(event2) {
      this.$emit("blur", event2);
    }
  },
  computed: {
    checked: function checked() {
      return this.binary ? this.modelValue === this.trueValue : ObjectUtils.contains(this.value, this.modelValue);
    }
  },
  components: {
    CheckIcon: script$A
  }
};
var _hoisted_1$d = ["data-p-highlight", "data-p-disabled"];
var _hoisted_2$c = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "required", "aria-labelledby", "aria-label"];
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CheckIcon = resolveComponent("CheckIcon");
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, $options.getPTOptions("root"), {
    "data-pc-name": "checkbox",
    "data-p-highlight": $options.checked,
    "data-p-disabled": _ctx.disabled
  }), [createBaseVNode("input", mergeProps({
    id: _ctx.inputId,
    type: "checkbox",
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    value: _ctx.value,
    name: _ctx.name,
    checked: $options.checked,
    tabindex: _ctx.tabindex,
    disabled: _ctx.disabled,
    readonly: _ctx.readonly,
    required: _ctx.required,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    onFocus: _cache[0] || (_cache[0] = function() {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }),
    onBlur: _cache[1] || (_cache[1] = function() {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }),
    onChange: _cache[2] || (_cache[2] = function() {
      return $options.onChange && $options.onChange.apply($options, arguments);
    })
  }, $options.getPTOptions("input")), null, 16, _hoisted_2$c), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("box")
  }, $options.getPTOptions("box")), [renderSlot(_ctx.$slots, "icon", {
    checked: $options.checked,
    "class": normalizeClass(_ctx.cx("icon"))
  }, function() {
    return [$options.checked ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
      key: 0,
      "class": _ctx.cx("icon")
    }, $options.getPTOptions("icon")), null, 16, ["class"])) : createCommentVNode("", true)];
  })], 16)], 16, _hoisted_1$d);
}
script$l.render = render$j;
var css = "\n@layer primevue {\n    .p-radiobutton {\n        position: relative;\n        display: inline-flex;\n        user-select: none;\n        vertical-align: bottom;\n    }\n\n    .p-radiobutton-input {\n        cursor: pointer;\n    }\n\n    .p-radiobutton-box {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n    }\n\n    .p-radiobutton-icon {\n        -webkit-backface-visibility: hidden;\n        backface-visibility: hidden;\n        transform: translateZ(0) scale(.1);\n        border-radius: 50%;\n        visibility: hidden;\n    }\n\n    .p-radiobutton.p-highlight .p-radiobutton-icon {\n        transform: translateZ(0) scale(1.0, 1.0);\n        visibility: visible;\n    }\n}\n";
var classes = {
  root: function root9(_ref) {
    var instance = _ref.instance, props = _ref.props;
    return ["p-radiobutton p-component", {
      "p-highlight": instance.checked,
      "p-disabled": props.disabled
    }];
  },
  box: "p-radiobutton-box",
  input: "p-radiobutton-input",
  icon: "p-radiobutton-icon"
};
var RadioButtonStyle = BaseStyle.extend({
  name: "radiobutton",
  css,
  classes
});
var script$1$2 = {
  name: "BaseRadioButton",
  "extends": script$N,
  props: {
    value: null,
    modelValue: null,
    binary: Boolean,
    name: {
      type: String,
      "default": null
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    tabindex: {
      type: Number,
      "default": null
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: RadioButtonStyle,
  provide: function provide11() {
    return {
      $parentInstance: this
    };
  }
};
var script$k = {
  name: "RadioButton",
  "extends": script$1$2,
  emits: ["update:modelValue", "change", "focus", "blur"],
  methods: {
    getPTOptions: function getPTOptions10(key) {
      return this.ptm(key, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function onChange5(event2) {
      if (!this.disabled && !this.readonly) {
        var newModelValue = this.binary ? !this.checked : this.value;
        this.$emit("update:modelValue", newModelValue);
        this.$emit("change", event2);
      }
    },
    onFocus: function onFocus4(event2) {
      this.$emit("focus", event2);
    },
    onBlur: function onBlur4(event2) {
      this.$emit("blur", event2);
    }
  },
  computed: {
    checked: function checked2() {
      return this.modelValue != null && (this.binary ? !!this.modelValue : ObjectUtils.equals(this.modelValue, this.value));
    }
  }
};
var _hoisted_1$c = ["data-p-highlight", "data-p-disabled"];
var _hoisted_2$b = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "aria-labelledby", "aria-label"];
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, $options.getPTOptions("root"), {
    "data-pc-name": "radiobutton",
    "data-p-highlight": $options.checked,
    "data-p-disabled": _ctx.disabled
  }), [createBaseVNode("input", mergeProps({
    id: _ctx.inputId,
    type: "radio",
    "class": [_ctx.cx("input"), _ctx.inputClass],
    style: _ctx.inputStyle,
    value: _ctx.value,
    name: _ctx.name,
    checked: $options.checked,
    tabindex: _ctx.tabindex,
    disabled: _ctx.disabled,
    readonly: _ctx.readonly,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    onFocus: _cache[0] || (_cache[0] = function() {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }),
    onBlur: _cache[1] || (_cache[1] = function() {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }),
    onChange: _cache[2] || (_cache[2] = function() {
      return $options.onChange && $options.onChange.apply($options, arguments);
    })
  }, $options.getPTOptions("input")), null, 16, _hoisted_2$b), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("box")
  }, $options.getPTOptions("box")), [createBaseVNode("div", mergeProps({
    "class": _ctx.cx("icon")
  }, $options.getPTOptions("icon")), null, 16)], 16)], 16, _hoisted_1$c);
}
script$k.render = render$i;
var FocusTrapStyle = {};
var BaseFocusTrap = BaseDirective.extend({
  style: FocusTrapStyle
});
function _typeof$b(o) {
  "@babel/helpers - typeof";
  return _typeof$b = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$b(o);
}
function ownKeys$b(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$b(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$b(Object(t), true).forEach(function(r2) {
      _defineProperty$b(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$b(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$b(obj, key, value) {
  key = _toPropertyKey$b(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$b(t) {
  var i = _toPrimitive$b(t, "string");
  return "symbol" == _typeof$b(i) ? i : String(i);
}
function _toPrimitive$b(t, r) {
  if ("object" != _typeof$b(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$b(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var FocusTrap = BaseFocusTrap.extend("focustrap", {
  mounted: function mounted8(el, binding) {
    var _ref = binding.value || {}, disabled2 = _ref.disabled;
    if (!disabled2) {
      this.createHiddenFocusableElements(el, binding);
      this.bind(el, binding);
      this.autoElementFocus(el, binding);
    }
    el.setAttribute("data-pd-focustrap", true);
    this.$el = el;
  },
  updated: function updated4(el, binding) {
    var _ref2 = binding.value || {}, disabled2 = _ref2.disabled;
    disabled2 && this.unbind(el);
  },
  unmounted: function unmounted4(el) {
    this.unbind(el);
  },
  methods: {
    getComputedSelector: function getComputedSelector(selector) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(selector !== null && selector !== void 0 ? selector : "");
    },
    bind: function bind(el, binding) {
      var _this = this;
      var _ref3 = binding.value || {}, onFocusIn = _ref3.onFocusIn, onFocusOut = _ref3.onFocusOut;
      el.$_pfocustrap_mutationobserver = new MutationObserver(function(mutationList) {
        mutationList.forEach(function(mutation) {
          if (mutation.type === "childList" && !el.contains(document.activeElement)) {
            var findNextFocusableElement = function findNextFocusableElement2(_el) {
              var focusableElement = DomHandler.isFocusableElement(_el) ? DomHandler.isFocusableElement(_el, _this.getComputedSelector(el.$_pfocustrap_focusableselector)) ? _el : DomHandler.getFirstFocusableElement(el, _this.getComputedSelector(el.$_pfocustrap_focusableselector)) : DomHandler.getFirstFocusableElement(_el);
              return ObjectUtils.isNotEmpty(focusableElement) ? focusableElement : _el.nextSibling && findNextFocusableElement2(_el.nextSibling);
            };
            DomHandler.focus(findNextFocusableElement(mutation.nextSibling));
          }
        });
      });
      el.$_pfocustrap_mutationobserver.disconnect();
      el.$_pfocustrap_mutationobserver.observe(el, {
        childList: true
      });
      el.$_pfocustrap_focusinlistener = function(event2) {
        return onFocusIn && onFocusIn(event2);
      };
      el.$_pfocustrap_focusoutlistener = function(event2) {
        return onFocusOut && onFocusOut(event2);
      };
      el.addEventListener("focusin", el.$_pfocustrap_focusinlistener);
      el.addEventListener("focusout", el.$_pfocustrap_focusoutlistener);
    },
    unbind: function unbind(el) {
      el.$_pfocustrap_mutationobserver && el.$_pfocustrap_mutationobserver.disconnect();
      el.$_pfocustrap_focusinlistener && el.removeEventListener("focusin", el.$_pfocustrap_focusinlistener) && (el.$_pfocustrap_focusinlistener = null);
      el.$_pfocustrap_focusoutlistener && el.removeEventListener("focusout", el.$_pfocustrap_focusoutlistener) && (el.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function autoFocus(options2) {
      this.autoElementFocus(this.$el, {
        value: _objectSpread$b(_objectSpread$b({}, options2), {}, {
          autoFocus: true
        })
      });
    },
    autoElementFocus: function autoElementFocus(el, binding) {
      var _ref4 = binding.value || {}, _ref4$autoFocusSelect = _ref4.autoFocusSelector, autoFocusSelector = _ref4$autoFocusSelect === void 0 ? "" : _ref4$autoFocusSelect, _ref4$firstFocusableS = _ref4.firstFocusableSelector, firstFocusableSelector = _ref4$firstFocusableS === void 0 ? "" : _ref4$firstFocusableS, _ref4$autoFocus = _ref4.autoFocus, autoFocus2 = _ref4$autoFocus === void 0 ? false : _ref4$autoFocus;
      var focusableElement = DomHandler.getFirstFocusableElement(el, "[autofocus]".concat(this.getComputedSelector(autoFocusSelector)));
      autoFocus2 && !focusableElement && (focusableElement = DomHandler.getFirstFocusableElement(el, this.getComputedSelector(firstFocusableSelector)));
      DomHandler.focus(focusableElement);
    },
    onFirstHiddenElementFocus: function onFirstHiddenElementFocus(event2) {
      var _this$$el;
      var currentTarget = event2.currentTarget, relatedTarget = event2.relatedTarget;
      var focusableElement = relatedTarget === currentTarget.$_pfocustrap_lasthiddenfocusableelement || !((_this$$el = this.$el) !== null && _this$$el !== void 0 && _this$$el.contains(relatedTarget)) ? DomHandler.getFirstFocusableElement(currentTarget.parentElement, this.getComputedSelector(currentTarget.$_pfocustrap_focusableselector)) : currentTarget.$_pfocustrap_lasthiddenfocusableelement;
      DomHandler.focus(focusableElement);
    },
    onLastHiddenElementFocus: function onLastHiddenElementFocus(event2) {
      var _this$$el2;
      var currentTarget = event2.currentTarget, relatedTarget = event2.relatedTarget;
      var focusableElement = relatedTarget === currentTarget.$_pfocustrap_firsthiddenfocusableelement || !((_this$$el2 = this.$el) !== null && _this$$el2 !== void 0 && _this$$el2.contains(relatedTarget)) ? DomHandler.getLastFocusableElement(currentTarget.parentElement, this.getComputedSelector(currentTarget.$_pfocustrap_focusableselector)) : currentTarget.$_pfocustrap_firsthiddenfocusableelement;
      DomHandler.focus(focusableElement);
    },
    createHiddenFocusableElements: function createHiddenFocusableElements(el, binding) {
      var _this2 = this;
      var _ref5 = binding.value || {}, _ref5$tabIndex = _ref5.tabIndex, tabIndex = _ref5$tabIndex === void 0 ? 0 : _ref5$tabIndex, _ref5$firstFocusableS = _ref5.firstFocusableSelector, firstFocusableSelector = _ref5$firstFocusableS === void 0 ? "" : _ref5$firstFocusableS, _ref5$lastFocusableSe = _ref5.lastFocusableSelector, lastFocusableSelector = _ref5$lastFocusableSe === void 0 ? "" : _ref5$lastFocusableSe;
      var createFocusableElement = function createFocusableElement2(onFocus5) {
        return DomHandler.createElement("span", {
          "class": "p-hidden-accessible p-hidden-focusable",
          tabIndex,
          role: "presentation",
          "aria-hidden": true,
          "data-p-hidden-accessible": true,
          "data-p-hidden-focusable": true,
          onFocus: onFocus5 === null || onFocus5 === void 0 ? void 0 : onFocus5.bind(_this2)
        });
      };
      var firstFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
      var lastFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);
      firstFocusableElement.$_pfocustrap_lasthiddenfocusableelement = lastFocusableElement;
      firstFocusableElement.$_pfocustrap_focusableselector = firstFocusableSelector;
      firstFocusableElement.setAttribute("data-pc-section", "firstfocusableelement");
      lastFocusableElement.$_pfocustrap_firsthiddenfocusableelement = firstFocusableElement;
      lastFocusableElement.$_pfocustrap_focusableselector = lastFocusableSelector;
      lastFocusableElement.setAttribute("data-pc-section", "lastfocusableelement");
      el.prepend(firstFocusableElement);
      el.append(lastFocusableElement);
    }
  }
});
var script$j = {
  name: "FilterSlashIcon",
  "extends": script$M
};
var _hoisted_1$b = ["clip-path"];
var _hoisted_2$a = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M13.4994 0.0920138C13.5967 0.151519 13.6758 0.236453 13.7283 0.337647C13.7807 0.439133 13.8031 0.553448 13.7929 0.667208C13.7827 0.780968 13.7403 0.889466 13.6707 0.98L11.406 4.06823C11.3099 4.19928 11.1656 4.28679 11.005 4.3115C10.8444 4.33621 10.6805 4.2961 10.5495 4.2C10.4184 4.1039 10.3309 3.95967 10.3062 3.79905C10.2815 3.63843 10.3216 3.47458 10.4177 3.34353L11.9412 1.23529H7.41184C7.24803 1.23529 7.09093 1.17022 6.97509 1.05439C6.85926 0.938558 6.79419 0.781457 6.79419 0.617647C6.79419 0.453837 6.85926 0.296736 6.97509 0.180905C7.09093 0.0650733 7.24803 0 7.41184 0H13.1765C13.2905 0.000692754 13.4022 0.0325088 13.4994 0.0920138ZM4.20008 0.181168H4.24126L13.2013 9.03411C13.3169 9.14992 13.3819 9.3069 13.3819 9.47058C13.3819 9.63426 13.3169 9.79124 13.2013 9.90705C13.1445 9.96517 13.0766 10.0112 13.0016 10.0423C12.9266 10.0735 12.846 10.0891 12.7648 10.0882C12.6836 10.0886 12.6032 10.0728 12.5283 10.0417C12.4533 10.0106 12.3853 9.96479 12.3283 9.90705L9.3142 6.92587L9.26479 6.99999V13.3823C9.26265 13.5455 9.19689 13.7014 9.08152 13.8167C8.96615 13.9321 8.81029 13.9979 8.64714 14H5.35302C5.18987 13.9979 5.03401 13.9321 4.91864 13.8167C4.80327 13.7014 4.73751 13.5455 4.73537 13.3823V6.99999L0.329492 1.02117C0.259855 0.930634 0.21745 0.822137 0.207241 0.708376C0.197031 0.594616 0.21944 0.480301 0.271844 0.378815C0.324343 0.277621 0.403484 0.192687 0.500724 0.133182C0.597964 0.073677 0.709609 0.041861 0.823609 0.0411682H3.86243C3.92448 0.0461551 3.9855 0.060022 4.04361 0.0823446C4.10037 0.10735 4.15311 0.140655 4.20008 0.181168ZM8.02949 6.79411C8.02884 6.66289 8.07235 6.53526 8.15302 6.43176L8.42478 6.05293L3.55773 1.23529H2.0589L5.84714 6.43176C5.92781 6.53526 5.97132 6.66289 5.97067 6.79411V12.7647H8.02949V6.79411Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$9 = [_hoisted_2$a];
var _hoisted_4$8 = ["id"];
var _hoisted_5$7 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$6 = [_hoisted_5$7];
function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$9, 8, _hoisted_1$b), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$6, 8, _hoisted_4$8)])], 16);
}
script$j.render = render$h;
var script$i = {
  name: "PlusIcon",
  "extends": script$M
};
var _hoisted_1$a = ["clip-path"];
var _hoisted_2$9 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M7.67742 6.32258V0.677419C7.67742 0.497757 7.60605 0.325452 7.47901 0.198411C7.35197 0.0713707 7.17966 0 7 0C6.82034 0 6.64803 0.0713707 6.52099 0.198411C6.39395 0.325452 6.32258 0.497757 6.32258 0.677419V6.32258H0.677419C0.497757 6.32258 0.325452 6.39395 0.198411 6.52099C0.0713707 6.64803 0 6.82034 0 7C0 7.17966 0.0713707 7.35197 0.198411 7.47901C0.325452 7.60605 0.497757 7.67742 0.677419 7.67742H6.32258V13.3226C6.32492 13.5015 6.39704 13.6725 6.52358 13.799C6.65012 13.9255 6.82106 13.9977 7 14C7.17966 14 7.35197 13.9286 7.47901 13.8016C7.60605 13.6745 7.67742 13.5022 7.67742 13.3226V7.67742H13.3226C13.5022 7.67742 13.6745 7.60605 13.8016 7.47901C13.9286 7.35197 14 7.17966 14 7C13.9977 6.82106 13.9255 6.65012 13.799 6.52358C13.6725 6.39704 13.5015 6.32492 13.3226 6.32258H7.67742Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$8 = [_hoisted_2$9];
var _hoisted_4$7 = ["id"];
var _hoisted_5$6 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$5 = [_hoisted_5$6];
function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$8, 8, _hoisted_1$a), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$5, 8, _hoisted_4$7)])], 16);
}
script$i.render = render$g;
var script$h = {
  name: "TrashIcon",
  "extends": script$M
};
var _hoisted_1$9 = ["clip-path"];
var _hoisted_2$8 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M3.44802 13.9955H10.552C10.8056 14.0129 11.06 13.9797 11.3006 13.898C11.5412 13.8163 11.7632 13.6877 11.9537 13.5196C12.1442 13.3515 12.2995 13.1473 12.4104 12.9188C12.5213 12.6903 12.5858 12.442 12.6 12.1884V4.36041H13.4C13.5591 4.36041 13.7117 4.29722 13.8243 4.18476C13.9368 4.07229 14 3.91976 14 3.76071C14 3.60166 13.9368 3.44912 13.8243 3.33666C13.7117 3.22419 13.5591 3.16101 13.4 3.16101H12.0537C12.0203 3.1557 11.9863 3.15299 11.952 3.15299C11.9178 3.15299 11.8838 3.1557 11.8503 3.16101H11.2285C11.2421 3.10893 11.2487 3.05513 11.248 3.00106V1.80966C11.2171 1.30262 10.9871 0.828306 10.608 0.48989C10.229 0.151475 9.73159 -0.0236625 9.22402 0.00257442H4.77602C4.27251 -0.0171866 3.78126 0.160868 3.40746 0.498617C3.03365 0.836366 2.807 1.30697 2.77602 1.80966V3.00106C2.77602 3.0556 2.78346 3.10936 2.79776 3.16101H0.6C0.521207 3.16101 0.443185 3.17652 0.37039 3.20666C0.297595 3.2368 0.231451 3.28097 0.175736 3.33666C0.120021 3.39235 0.0758251 3.45846 0.0456722 3.53121C0.0155194 3.60397 0 3.68196 0 3.76071C0 3.83946 0.0155194 3.91744 0.0456722 3.9902C0.0758251 4.06296 0.120021 4.12907 0.175736 4.18476C0.231451 4.24045 0.297595 4.28462 0.37039 4.31476C0.443185 4.3449 0.521207 4.36041 0.6 4.36041H1.40002V12.1884C1.41426 12.442 1.47871 12.6903 1.58965 12.9188C1.7006 13.1473 1.85582 13.3515 2.04633 13.5196C2.23683 13.6877 2.45882 13.8163 2.69944 13.898C2.94005 13.9797 3.1945 14.0129 3.44802 13.9955ZM2.60002 4.36041H11.304V12.1884C11.304 12.5163 10.952 12.7961 10.504 12.7961H3.40002C2.97602 12.7961 2.60002 12.5163 2.60002 12.1884V4.36041ZM3.95429 3.16101C3.96859 3.10936 3.97602 3.0556 3.97602 3.00106V1.80966C3.97602 1.48183 4.33602 1.20197 4.77602 1.20197H9.24802C9.66403 1.20197 10.048 1.48183 10.048 1.80966V3.00106C10.0473 3.05515 10.054 3.10896 10.0678 3.16101H3.95429ZM5.57571 10.997C5.41731 10.995 5.26597 10.9311 5.15395 10.8191C5.04193 10.7071 4.97808 10.5558 4.97601 10.3973V6.77517C4.97601 6.61612 5.0392 6.46359 5.15166 6.35112C5.26413 6.23866 5.41666 6.17548 5.57571 6.17548C5.73476 6.17548 5.8873 6.23866 5.99976 6.35112C6.11223 6.46359 6.17541 6.61612 6.17541 6.77517V10.3894C6.17647 10.4688 6.16174 10.5476 6.13208 10.6213C6.10241 10.695 6.05841 10.762 6.00261 10.8186C5.94682 10.8751 5.88035 10.92 5.80707 10.9506C5.73378 10.9813 5.65514 10.9971 5.57571 10.997ZM7.99968 10.8214C8.11215 10.9339 8.26468 10.997 8.42373 10.997C8.58351 10.9949 8.73604 10.93 8.84828 10.8163C8.96052 10.7025 9.02345 10.5491 9.02343 10.3894V6.77517C9.02343 6.61612 8.96025 6.46359 8.84778 6.35112C8.73532 6.23866 8.58278 6.17548 8.42373 6.17548C8.26468 6.17548 8.11215 6.23866 7.99968 6.35112C7.88722 6.46359 7.82404 6.61612 7.82404 6.77517V10.3973C7.82404 10.5564 7.88722 10.7089 7.99968 10.8214Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$7 = [_hoisted_2$8];
var _hoisted_4$6 = ["id"];
var _hoisted_5$5 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$4 = [_hoisted_5$5];
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$7, 8, _hoisted_1$9), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$4, 8, _hoisted_4$6)])], 16);
}
script$h.render = render$f;
var script$g = {
  name: "SortAltIcon",
  "extends": script$M
};
var _hoisted_1$8 = ["clip-path"];
var _hoisted_2$7 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M5.64515 3.61291C5.47353 3.61291 5.30192 3.54968 5.16644 3.4142L3.38708 1.63484L1.60773 3.4142C1.34579 3.67613 0.912244 3.67613 0.650309 3.4142C0.388374 3.15226 0.388374 2.71871 0.650309 2.45678L2.90837 0.198712C3.17031 -0.0632236 3.60386 -0.0632236 3.86579 0.198712L6.12386 2.45678C6.38579 2.71871 6.38579 3.15226 6.12386 3.4142C5.98837 3.54968 5.81676 3.61291 5.64515 3.61291Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$6 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M3.38714 14C3.01681 14 2.70972 13.6929 2.70972 13.3226V0.677419C2.70972 0.307097 3.01681 0 3.38714 0C3.75746 0 4.06456 0.307097 4.06456 0.677419V13.3226C4.06456 13.6929 3.75746 14 3.38714 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_4$5 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M10.6129 14C10.4413 14 10.2697 13.9368 10.1342 13.8013L7.87611 11.5432C7.61418 11.2813 7.61418 10.8477 7.87611 10.5858C8.13805 10.3239 8.5716 10.3239 8.83353 10.5858L10.6129 12.3652L12.3922 10.5858C12.6542 10.3239 13.0877 10.3239 13.3497 10.5858C13.6116 10.8477 13.6116 11.2813 13.3497 11.5432L11.0916 13.8013C10.9561 13.9368 10.7845 14 10.6129 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_5$4 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M10.6129 14C10.2426 14 9.93552 13.6929 9.93552 13.3226V0.677419C9.93552 0.307097 10.2426 0 10.6129 0C10.9833 0 11.2904 0.307097 11.2904 0.677419V13.3226C11.2904 13.6929 10.9832 14 10.6129 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_6$3 = [_hoisted_2$7, _hoisted_3$6, _hoisted_4$5, _hoisted_5$4];
var _hoisted_7 = ["id"];
var _hoisted_8 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_9 = [_hoisted_8];
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_6$3, 8, _hoisted_1$8), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_9, 8, _hoisted_7)])], 16);
}
script$g.render = render$e;
var script$f = {
  name: "SortAmountDownIcon",
  "extends": script$M
};
var _hoisted_1$7 = ["clip-path"];
var _hoisted_2$6 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M4.93953 10.5858L3.83759 11.6877V0.677419C3.83759 0.307097 3.53049 0 3.16017 0C2.78985 0 2.48275 0.307097 2.48275 0.677419V11.6877L1.38082 10.5858C1.11888 10.3239 0.685331 10.3239 0.423396 10.5858C0.16146 10.8477 0.16146 11.2813 0.423396 11.5432L2.68146 13.8013C2.74469 13.8645 2.81694 13.9097 2.89823 13.9458C2.97952 13.9819 3.06985 14 3.16017 14C3.25049 14 3.33178 13.9819 3.42211 13.9458C3.5034 13.9097 3.57565 13.8645 3.63888 13.8013L5.89694 11.5432C6.15888 11.2813 6.15888 10.8477 5.89694 10.5858C5.63501 10.3239 5.20146 10.3239 4.93953 10.5858ZM13.0957 0H7.22468C6.85436 0 6.54726 0.307097 6.54726 0.677419C6.54726 1.04774 6.85436 1.35484 7.22468 1.35484H13.0957C13.466 1.35484 13.7731 1.04774 13.7731 0.677419C13.7731 0.307097 13.466 0 13.0957 0ZM7.22468 5.41935H9.48275C9.85307 5.41935 10.1602 5.72645 10.1602 6.09677C10.1602 6.4671 9.85307 6.77419 9.48275 6.77419H7.22468C6.85436 6.77419 6.54726 6.4671 6.54726 6.09677C6.54726 5.72645 6.85436 5.41935 7.22468 5.41935ZM7.6763 8.12903H7.22468C6.85436 8.12903 6.54726 8.43613 6.54726 8.80645C6.54726 9.17677 6.85436 9.48387 7.22468 9.48387H7.6763C8.04662 9.48387 8.35372 9.17677 8.35372 8.80645C8.35372 8.43613 8.04662 8.12903 7.6763 8.12903ZM7.22468 2.70968H11.2892C11.6595 2.70968 11.9666 3.01677 11.9666 3.3871C11.9666 3.75742 11.6595 4.06452 11.2892 4.06452H7.22468C6.85436 4.06452 6.54726 3.75742 6.54726 3.3871C6.54726 3.01677 6.85436 2.70968 7.22468 2.70968Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$5 = [_hoisted_2$6];
var _hoisted_4$4 = ["id"];
var _hoisted_5$3 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$2 = [_hoisted_5$3];
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$5, 8, _hoisted_1$7), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$2, 8, _hoisted_4$4)])], 16);
}
script$f.render = render$d;
var script$e = {
  name: "SortAmountUpAltIcon",
  "extends": script$M
};
var _hoisted_1$6 = ["clip-path"];
var _hoisted_2$5 = /* @__PURE__ */ createBaseVNode("path", {
  d: "M3.63435 0.19871C3.57113 0.135484 3.49887 0.0903226 3.41758 0.0541935C3.255 -0.0180645 3.06532 -0.0180645 2.90274 0.0541935C2.82145 0.0903226 2.74919 0.135484 2.68597 0.19871L0.427901 2.45677C0.165965 2.71871 0.165965 3.15226 0.427901 3.41419C0.689836 3.67613 1.12338 3.67613 1.38532 3.41419L2.48726 2.31226V13.3226C2.48726 13.6929 2.79435 14 3.16467 14C3.535 14 3.84209 13.6929 3.84209 13.3226V2.31226L4.94403 3.41419C5.07951 3.54968 5.25113 3.6129 5.42274 3.6129C5.59435 3.6129 5.76597 3.54968 5.90145 3.41419C6.16338 3.15226 6.16338 2.71871 5.90145 2.45677L3.64338 0.19871H3.63435ZM13.7685 13.3226C13.7685 12.9523 13.4615 12.6452 13.0911 12.6452H7.22016C6.84984 12.6452 6.54274 12.9523 6.54274 13.3226C6.54274 13.6929 6.84984 14 7.22016 14H13.0911C13.4615 14 13.7685 13.6929 13.7685 13.3226ZM7.22016 8.58064C6.84984 8.58064 6.54274 8.27355 6.54274 7.90323C6.54274 7.5329 6.84984 7.22581 7.22016 7.22581H9.47823C9.84855 7.22581 10.1556 7.5329 10.1556 7.90323C10.1556 8.27355 9.84855 8.58064 9.47823 8.58064H7.22016ZM7.22016 5.87097H7.67177C8.0421 5.87097 8.34919 5.56387 8.34919 5.19355C8.34919 4.82323 8.0421 4.51613 7.67177 4.51613H7.22016C6.84984 4.51613 6.54274 4.82323 6.54274 5.19355C6.54274 5.56387 6.84984 5.87097 7.22016 5.87097ZM11.2847 11.2903H7.22016C6.84984 11.2903 6.54274 10.9832 6.54274 10.6129C6.54274 10.2426 6.84984 9.93548 7.22016 9.93548H11.2847C11.655 9.93548 11.9621 10.2426 11.9621 10.6129C11.9621 10.9832 11.655 11.2903 11.2847 11.2903Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3$4 = [_hoisted_2$5];
var _hoisted_4$3 = ["id"];
var _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6$1 = [_hoisted_5$2];
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createBaseVNode("g", {
    "clip-path": "url(#".concat(_ctx.pathId, ")")
  }, _hoisted_3$4, 8, _hoisted_1$6), createBaseVNode("defs", null, [createBaseVNode("clipPath", {
    id: "".concat(_ctx.pathId)
  }, _hoisted_6$1, 8, _hoisted_4$3)])], 16);
}
script$e.render = render$c;
var script$c = {
  name: "BaseDataTable",
  "extends": script$N,
  props: {
    value: {
      type: Array,
      "default": null
    },
    dataKey: {
      type: [String, Function],
      "default": null
    },
    rows: {
      type: Number,
      "default": 0
    },
    first: {
      type: Number,
      "default": 0
    },
    totalRecords: {
      type: Number,
      "default": 0
    },
    paginator: {
      type: Boolean,
      "default": false
    },
    paginatorPosition: {
      type: String,
      "default": "bottom"
    },
    alwaysShowPaginator: {
      type: Boolean,
      "default": true
    },
    paginatorTemplate: {
      type: [Object, String],
      "default": "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    pageLinkSize: {
      type: Number,
      "default": 5
    },
    rowsPerPageOptions: {
      type: Array,
      "default": null
    },
    currentPageReportTemplate: {
      type: String,
      "default": "({currentPage} of {totalPages})"
    },
    lazy: {
      type: Boolean,
      "default": false
    },
    loading: {
      type: Boolean,
      "default": false
    },
    loadingIcon: {
      type: String,
      "default": void 0
    },
    sortField: {
      type: [String, Function],
      "default": null
    },
    sortOrder: {
      type: Number,
      "default": null
    },
    defaultSortOrder: {
      type: Number,
      "default": 1
    },
    nullSortOrder: {
      type: Number,
      "default": 1
    },
    multiSortMeta: {
      type: Array,
      "default": null
    },
    sortMode: {
      type: String,
      "default": "single"
    },
    removableSort: {
      type: Boolean,
      "default": false
    },
    filters: {
      type: Object,
      "default": null
    },
    filterDisplay: {
      type: String,
      "default": null
    },
    globalFilterFields: {
      type: Array,
      "default": null
    },
    filterLocale: {
      type: String,
      "default": void 0
    },
    selection: {
      type: [Array, Object],
      "default": null
    },
    selectionMode: {
      type: String,
      "default": null
    },
    compareSelectionBy: {
      type: String,
      "default": "deepEquals"
    },
    metaKeySelection: {
      type: Boolean,
      "default": false
    },
    contextMenu: {
      type: Boolean,
      "default": false
    },
    contextMenuSelection: {
      type: Object,
      "default": null
    },
    selectAll: {
      type: Boolean,
      "default": null
    },
    rowHover: {
      type: Boolean,
      "default": false
    },
    csvSeparator: {
      type: String,
      "default": ","
    },
    exportFilename: {
      type: String,
      "default": "download"
    },
    exportFunction: {
      type: Function,
      "default": null
    },
    resizableColumns: {
      type: Boolean,
      "default": false
    },
    columnResizeMode: {
      type: String,
      "default": "fit"
    },
    reorderableColumns: {
      type: Boolean,
      "default": false
    },
    expandedRows: {
      type: [Array, Object],
      "default": null
    },
    expandedRowIcon: {
      type: String,
      "default": void 0
    },
    collapsedRowIcon: {
      type: String,
      "default": void 0
    },
    rowGroupMode: {
      type: String,
      "default": null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      "default": null
    },
    expandableRowGroups: {
      type: Boolean,
      "default": false
    },
    expandedRowGroups: {
      type: Array,
      "default": null
    },
    stateStorage: {
      type: String,
      "default": "session"
    },
    stateKey: {
      type: String,
      "default": null
    },
    editMode: {
      type: String,
      "default": null
    },
    editingRows: {
      type: Array,
      "default": null
    },
    rowClass: {
      type: null,
      "default": null
    },
    rowStyle: {
      type: null,
      "default": null
    },
    scrollable: {
      type: Boolean,
      "default": false
    },
    virtualScrollerOptions: {
      type: Object,
      "default": null
    },
    scrollHeight: {
      type: String,
      "default": null
    },
    frozenValue: {
      type: Array,
      "default": null
    },
    responsiveLayout: {
      type: String,
      "default": "scroll"
    },
    breakpoint: {
      type: String,
      "default": "960px"
    },
    showGridlines: {
      type: Boolean,
      "default": false
    },
    stripedRows: {
      type: Boolean,
      "default": false
    },
    highlightOnSelect: {
      type: Boolean,
      "default": false
    },
    size: {
      type: String,
      "default": null
    },
    tableStyle: {
      type: null,
      "default": null
    },
    tableClass: {
      type: String,
      "default": null
    },
    tableProps: {
      type: null,
      "default": null
    },
    filterInputProps: {
      type: null,
      "default": null
    }
  },
  style: DataTableStyle,
  provide: function provide12() {
    return {
      $parentInstance: this
    };
  }
};
var script$b = {
  name: "RowCheckbox",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["change"],
  props: {
    value: null,
    checked: null,
    column: null,
    rowCheckboxIconTemplate: {
      type: Function,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    }
  },
  methods: {
    getColumnPT: function getColumnPT(key) {
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: this.index,
          checked: this.checked,
          disabled: this.$attrs.disabled
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onChange: function onChange6(event2) {
      if (!this.$attrs.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          data: this.value
        });
      }
    }
  },
  computed: {
    checkboxAriaLabel: function checkboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectRow : this.$primevue.config.locale.aria.unselectRow : void 0;
    }
  },
  components: {
    CheckIcon: script$A,
    Checkbox: script$l
  }
};
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CheckIcon = resolveComponent("CheckIcon");
  var _component_Checkbox = resolveComponent("Checkbox");
  return openBlock(), createBlock(_component_Checkbox, {
    modelValue: $props.checked,
    binary: true,
    disabled: _ctx.$attrs.disabled,
    "aria-label": $options.checkboxAriaLabel,
    onChange: $options.onChange,
    unstyled: _ctx.unstyled,
    pt: $options.getColumnPT("rowCheckbox")
  }, {
    icon: withCtx(function(slotProps) {
      return [$props.rowCheckboxIconTemplate ? (openBlock(), createBlock(resolveDynamicComponent($props.rowCheckboxIconTemplate), {
        key: 0,
        checked: slotProps.checked,
        "class": normalizeClass(slotProps["class"])
      }, null, 8, ["checked", "class"])) : !$props.rowCheckboxIconTemplate && slotProps.checked ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
        key: 1,
        "class": slotProps["class"]
      }, $options.getColumnPT("rowCheckbox.icon")), null, 16, ["class"])) : createCommentVNode("", true)];
    }),
    _: 1
  }, 8, ["modelValue", "disabled", "aria-label", "onChange", "unstyled", "pt"]);
}
script$b.render = render$b;
var script$a = {
  name: "RowRadioButton",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["change"],
  props: {
    value: null,
    checked: null,
    name: null,
    column: null,
    index: {
      type: Number,
      "default": null
    }
  },
  methods: {
    getColumnPT: function getColumnPT2(key) {
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: this.index,
          checked: this.checked,
          disabled: this.$attrs.disabled
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp2() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onChange: function onChange7(event2) {
      if (!this.$attrs.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          data: this.value
        });
      }
    }
  },
  components: {
    RadioButton: script$k
  }
};
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_RadioButton = resolveComponent("RadioButton");
  return openBlock(), createBlock(_component_RadioButton, {
    modelValue: $props.checked,
    binary: true,
    disabled: _ctx.$attrs.disabled,
    name: $props.name,
    onChange: $options.onChange,
    unstyled: _ctx.unstyled,
    pt: $options.getColumnPT("rowRadiobutton")
  }, null, 8, ["modelValue", "disabled", "name", "onChange", "unstyled", "pt"]);
}
script$a.render = render$a;
var script$9 = {
  name: "BodyCell",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "row-edit-init", "row-edit-save", "row-edit-cancel", "row-toggle", "radio-change", "checkbox-change", "editing-meta-change"],
  props: {
    rowData: {
      type: Object,
      "default": null
    },
    column: {
      type: Object,
      "default": null
    },
    frozenRow: {
      type: Boolean,
      "default": false
    },
    rowIndex: {
      type: Number,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    },
    isRowExpanded: {
      type: Boolean,
      "default": false
    },
    selected: {
      type: Boolean,
      "default": false
    },
    editing: {
      type: Boolean,
      "default": false
    },
    editingMeta: {
      type: Object,
      "default": null
    },
    editMode: {
      type: String,
      "default": null
    },
    responsiveLayout: {
      type: String,
      "default": "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      "default": null
    },
    ariaControls: {
      type: String,
      "default": null
    },
    name: {
      type: String,
      "default": null
    },
    expandedRowIcon: {
      type: String,
      "default": null
    },
    collapsedRowIcon: {
      type: String,
      "default": null
    }
  },
  documentEditListener: null,
  selfClick: false,
  overlayEventListener: null,
  data: function data8() {
    return {
      d_editing: this.editing,
      styleObject: {}
    };
  },
  watch: {
    editing: function editing(newValue) {
      this.d_editing = newValue;
    },
    "$data.d_editing": function $dataD_editing(newValue) {
      this.$emit("editing-meta-change", {
        data: this.rowData,
        field: this.field || "field_".concat(this.index),
        index: this.rowIndex,
        editing: newValue
      });
    }
  },
  mounted: function mounted9() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated: function updated5() {
    var _this = this;
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
    if (this.d_editing && (this.editMode === "cell" || this.editMode === "row" && this.columnProp("rowEditor"))) {
      setTimeout(function() {
        var focusableEl = DomHandler.getFirstFocusableElement(_this.$el);
        focusableEl && focusableEl.focus();
      }, 1);
    }
  },
  beforeUnmount: function beforeUnmount4() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
  },
  methods: {
    columnProp: function columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPT: function getColumnPT3(key) {
      var _this$$parentInstance, _this$$parentInstance2;
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: this.index,
          size: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.size,
          showGridlines: (_this$$parentInstance2 = this.$parentInstance) === null || _this$$parentInstance2 === void 0 || (_this$$parentInstance2 = _this$$parentInstance2.$parentInstance) === null || _this$$parentInstance2 === void 0 ? void 0 : _this$$parentInstance2.showGridlines
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp3() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    resolveFieldData: function resolveFieldData2() {
      return ObjectUtils.resolveFieldData(this.rowData, this.field);
    },
    toggleRow: function toggleRow(event2) {
      this.$emit("row-toggle", {
        originalEvent: event2,
        data: this.rowData
      });
    },
    toggleRowWithRadio: function toggleRowWithRadio(event2, index2) {
      this.$emit("radio-change", {
        originalEvent: event2.originalEvent,
        index: index2,
        data: event2.data
      });
    },
    toggleRowWithCheckbox: function toggleRowWithCheckbox(event2, index2) {
      this.$emit("checkbox-change", {
        originalEvent: event2.originalEvent,
        index: index2,
        data: event2.data
      });
    },
    isEditable: function isEditable() {
      return this.column.children && this.column.children.editor != null;
    },
    bindDocumentEditListener: function bindDocumentEditListener() {
      var _this2 = this;
      if (!this.documentEditListener) {
        this.documentEditListener = function(event2) {
          if (!_this2.selfClick) {
            _this2.completeEdit(event2, "outside");
          }
          _this2.selfClick = false;
        };
        document.addEventListener("click", this.documentEditListener);
      }
    },
    unbindDocumentEditListener: function unbindDocumentEditListener() {
      if (this.documentEditListener) {
        document.removeEventListener("click", this.documentEditListener);
        this.documentEditListener = null;
        this.selfClick = false;
      }
    },
    switchCellToViewMode: function switchCellToViewMode() {
      this.d_editing = false;
      this.unbindDocumentEditListener();
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    onClick: function onClick(event2) {
      var _this3 = this;
      if (this.editMode === "cell" && this.isEditable()) {
        this.selfClick = true;
        if (!this.d_editing) {
          this.d_editing = true;
          this.bindDocumentEditListener();
          this.$emit("cell-edit-init", {
            originalEvent: event2,
            data: this.rowData,
            field: this.field,
            index: this.rowIndex
          });
          this.overlayEventListener = function(e) {
            if (_this3.$el && _this3.$el.contains(e.target)) {
              _this3.selfClick = true;
            }
          };
          OverlayEventBus.on("overlay-click", this.overlayEventListener);
        }
      }
    },
    completeEdit: function completeEdit(event2, type) {
      var completeEvent = {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        value: this.rowData[this.field],
        newValue: this.editingRowData[this.field],
        field: this.field,
        index: this.rowIndex,
        type,
        defaultPrevented: false,
        preventDefault: function preventDefault() {
          this.defaultPrevented = true;
        }
      };
      this.$emit("cell-edit-complete", completeEvent);
      if (!completeEvent.defaultPrevented) {
        this.switchCellToViewMode();
      }
    },
    onKeyDown: function onKeyDown3(event2) {
      if (this.editMode === "cell") {
        switch (event2.code) {
          case "Enter":
          case "NumpadEnter":
            this.completeEdit(event2, "enter");
            break;
          case "Escape":
            this.switchCellToViewMode();
            this.$emit("cell-edit-cancel", {
              originalEvent: event2,
              data: this.rowData,
              field: this.field,
              index: this.rowIndex
            });
            break;
          case "Tab":
            this.completeEdit(event2, "tab");
            if (event2.shiftKey)
              this.moveToPreviousCell(event2);
            else
              this.moveToNextCell(event2);
            break;
        }
      }
    },
    moveToPreviousCell: function moveToPreviousCell(event2) {
      var currentCell = this.findCell(event2.target);
      var targetCell = this.findPreviousEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    moveToNextCell: function moveToNextCell(event2) {
      var currentCell = this.findCell(event2.target);
      var targetCell = this.findNextEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    findCell: function findCell(element) {
      if (element) {
        var cell = element;
        while (cell && !DomHandler.getAttribute(cell, "data-p-cell-editing")) {
          cell = cell.parentElement;
        }
        return cell;
      } else {
        return null;
      }
    },
    findPreviousEditableColumn: function findPreviousEditableColumn(cell) {
      var prevCell = cell.previousElementSibling;
      if (!prevCell) {
        var previousRow = cell.parentElement.previousElementSibling;
        if (previousRow) {
          prevCell = previousRow.lastElementChild;
        }
      }
      if (prevCell) {
        if (DomHandler.getAttribute(prevCell, "data-p-editable-column"))
          return prevCell;
        else
          return this.findPreviousEditableColumn(prevCell);
      } else {
        return null;
      }
    },
    findNextEditableColumn: function findNextEditableColumn(cell) {
      var nextCell = cell.nextElementSibling;
      if (!nextCell) {
        var nextRow = cell.parentElement.nextElementSibling;
        if (nextRow) {
          nextCell = nextRow.firstElementChild;
        }
      }
      if (nextCell) {
        if (DomHandler.getAttribute(nextCell, "data-p-editable-column"))
          return nextCell;
        else
          return this.findNextEditableColumn(nextCell);
      } else {
        return null;
      }
    },
    isEditingCellValid: function isEditingCellValid() {
      return DomHandler.find(this.$el, ".p-invalid").length === 0;
    },
    onRowEditInit: function onRowEditInit(event2) {
      this.$emit("row-edit-init", {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        field: this.field,
        index: this.rowIndex
      });
    },
    onRowEditSave: function onRowEditSave(event2) {
      this.$emit("row-edit-save", {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        field: this.field,
        index: this.rowIndex
      });
    },
    onRowEditCancel: function onRowEditCancel(event2) {
      this.$emit("row-edit-cancel", {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        field: this.field,
        index: this.rowIndex
      });
    },
    editorInitCallback: function editorInitCallback(event2) {
      this.$emit("row-edit-init", {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        field: this.field,
        index: this.rowIndex
      });
    },
    editorSaveCallback: function editorSaveCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-save", {
          originalEvent: event2,
          data: this.rowData,
          newData: this.editingRowData,
          field: this.field,
          index: this.rowIndex
        });
      } else {
        this.completeEdit(event2, "enter");
      }
    },
    editorCancelCallback: function editorCancelCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-cancel", {
          originalEvent: event2,
          data: this.rowData,
          newData: this.editingRowData,
          field: this.field,
          index: this.rowIndex
        });
      } else {
        this.switchCellToViewMode();
        this.$emit("cell-edit-cancel", {
          originalEvent: event2,
          data: this.rowData,
          field: this.field,
          index: this.rowIndex
        });
      }
    },
    updateStickyPosition: function updateStickyPosition() {
      if (this.columnProp("frozen")) {
        var align = this.columnProp("alignFrozen");
        if (align === "right") {
          var right = 0;
          var next = DomHandler.getNextElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          var left = 0;
          var prev = DomHandler.getPreviousElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    },
    getVirtualScrollerProp: function getVirtualScrollerProp(option) {
      return this.virtualScrollerContentProps ? this.virtualScrollerContentProps[option] : null;
    }
  },
  computed: {
    editingRowData: function editingRowData() {
      return this.editingMeta[this.rowIndex] ? this.editingMeta[this.rowIndex].data : this.rowData;
    },
    field: function field() {
      return this.columnProp("field");
    },
    containerClass: function containerClass2() {
      return [this.columnProp("bodyClass"), this.columnProp("class"), this.cx("bodyCell")];
    },
    containerStyle: function containerStyle() {
      var bodyStyle2 = this.columnProp("bodyStyle");
      var columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle2, this.styleObject] : [columnStyle, bodyStyle2];
    },
    loading: function loading2() {
      return this.getVirtualScrollerProp("loading");
    },
    loadingOptions: function loadingOptions() {
      var getLoaderOptions2 = this.getVirtualScrollerProp("getLoaderOptions");
      return getLoaderOptions2 && getLoaderOptions2(this.rowIndex, {
        cellIndex: this.index,
        cellFirst: this.index === 0,
        cellLast: this.index === this.getVirtualScrollerProp("columns").length - 1,
        cellEven: this.index % 2 === 0,
        cellOdd: this.index % 2 !== 0,
        column: this.column,
        field: this.field
      });
    },
    expandButtonAriaLabel: function expandButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.isRowExpanded ? this.$primevue.config.locale.aria.expandRow : this.$primevue.config.locale.aria.collapseRow : void 0;
    },
    initButtonAriaLabel: function initButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.editRow : void 0;
    },
    saveButtonAriaLabel: function saveButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.saveEdit : void 0;
    },
    cancelButtonAriaLabel: function cancelButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.cancelEdit : void 0;
    }
  },
  components: {
    DTRadioButton: script$a,
    DTCheckbox: script$b,
    ChevronDownIcon: script$z,
    ChevronRightIcon: script$n,
    BarsIcon: script$L,
    PencilIcon: script$m,
    CheckIcon: script$A,
    TimesIcon: script$x
  },
  directives: {
    ripple: Ripple
  }
};
function _typeof$a(o) {
  "@babel/helpers - typeof";
  return _typeof$a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$a(o);
}
function ownKeys$a(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$a(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$a(Object(t), true).forEach(function(r2) {
      _defineProperty$a(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$a(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$a(obj, key, value) {
  key = _toPropertyKey$a(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$a(t) {
  var i = _toPrimitive$a(t, "string");
  return "symbol" == _typeof$a(i) ? i : String(i);
}
function _toPrimitive$a(t, r) {
  if ("object" != _typeof$a(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$a(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$4 = ["colspan", "rowspan", "data-p-selection-column", "data-p-editable-column", "data-p-cell-editing", "data-p-frozen-column"];
var _hoisted_2$2$1 = ["aria-expanded", "aria-controls", "aria-label"];
var _hoisted_3$2 = ["aria-label"];
var _hoisted_4$1 = ["aria-label"];
var _hoisted_5$1 = ["aria-label"];
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DTRadioButton = resolveComponent("DTRadioButton");
  var _component_DTCheckbox = resolveComponent("DTCheckbox");
  var _component_BarsIcon = resolveComponent("BarsIcon");
  var _component_ChevronDownIcon = resolveComponent("ChevronDownIcon");
  var _component_ChevronRightIcon = resolveComponent("ChevronRightIcon");
  var _directive_ripple = resolveDirective("ripple");
  return $options.loading ? (openBlock(), createElementBlock("td", mergeProps({
    key: 0,
    style: $options.containerStyle,
    "class": $options.containerClass,
    role: "cell"
  }, _objectSpread$a(_objectSpread$a({}, $options.getColumnPT("root")), $options.getColumnPT("bodyCell"))), [(openBlock(), createBlock(resolveDynamicComponent($props.column.children.loading), {
    data: $props.rowData,
    column: $props.column,
    field: $options.field,
    index: $props.rowIndex,
    frozenRow: $props.frozenRow,
    loadingOptions: $options.loadingOptions
  }, null, 8, ["data", "column", "field", "index", "frozenRow", "loadingOptions"]))], 16)) : (openBlock(), createElementBlock("td", mergeProps({
    key: 1,
    style: $options.containerStyle,
    "class": $options.containerClass,
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan"),
    onClick: _cache[6] || (_cache[6] = function() {
      return $options.onClick && $options.onClick.apply($options, arguments);
    }),
    onKeydown: _cache[7] || (_cache[7] = function() {
      return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
    }),
    role: "cell"
  }, _objectSpread$a(_objectSpread$a({}, $options.getColumnPT("root")), $options.getColumnPT("bodyCell")), {
    "data-p-selection-column": $options.columnProp("selectionMode") != null,
    "data-p-editable-column": $options.isEditable(),
    "data-p-cell-editing": $data.d_editing,
    "data-p-frozen-column": $options.columnProp("frozen")
  }), [$props.responsiveLayout === "stack" ? (openBlock(), createElementBlock("span", mergeProps({
    key: 0,
    "class": _ctx.cx("columnTitle")
  }, $options.getColumnPT("columnTitle")), toDisplayString($options.columnProp("header")), 17)) : createCommentVNode("", true), $props.column.children && $props.column.children.body && !$data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
    key: 1,
    data: $props.rowData,
    column: $props.column,
    field: $options.field,
    index: $props.rowIndex,
    frozenRow: $props.frozenRow,
    editorInitCallback: $options.editorInitCallback,
    rowTogglerCallback: $options.toggleRow
  }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorInitCallback", "rowTogglerCallback"])) : $props.column.children && $props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.editor), {
    key: 2,
    data: $options.editingRowData,
    column: $props.column,
    field: $options.field,
    index: $props.rowIndex,
    frozenRow: $props.frozenRow,
    editorSaveCallback: $options.editorSaveCallback,
    editorCancelCallback: $options.editorCancelCallback
  }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorSaveCallback", "editorCancelCallback"])) : $props.column.children && $props.column.children.body && !$props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
    key: 3,
    data: $options.editingRowData,
    column: $props.column,
    field: $options.field,
    index: $props.rowIndex,
    frozenRow: $props.frozenRow
  }, null, 8, ["data", "column", "field", "index", "frozenRow"])) : $options.columnProp("selectionMode") ? (openBlock(), createElementBlock(Fragment, {
    key: 4
  }, [$options.columnProp("selectionMode") === "single" ? (openBlock(), createBlock(_component_DTRadioButton, {
    key: 0,
    value: $props.rowData,
    name: $props.name,
    checked: $props.selected,
    onChange: _cache[0] || (_cache[0] = function($event) {
      return $options.toggleRowWithRadio($event, $props.rowIndex);
    }),
    column: $props.column,
    index: $props.index,
    unstyled: _ctx.unstyled,
    pt: _ctx.pt
  }, null, 8, ["value", "name", "checked", "column", "index", "unstyled", "pt"])) : $options.columnProp("selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTCheckbox, {
    key: 1,
    value: $props.rowData,
    checked: $props.selected,
    rowCheckboxIconTemplate: $props.column.children && $props.column.children.rowcheckboxicon,
    "aria-selected": $props.selected ? true : void 0,
    onChange: _cache[1] || (_cache[1] = function($event) {
      return $options.toggleRowWithCheckbox($event, $props.rowIndex);
    }),
    column: $props.column,
    index: $props.index,
    unstyled: _ctx.unstyled,
    pt: _ctx.pt
  }, null, 8, ["value", "checked", "rowCheckboxIconTemplate", "aria-selected", "column", "index", "unstyled", "pt"])) : createCommentVNode("", true)], 64)) : $options.columnProp("rowReorder") ? (openBlock(), createElementBlock(Fragment, {
    key: 5
  }, [$props.column.children && $props.column.children.rowreordericon ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.rowreordericon), {
    key: 0,
    "class": normalizeClass(_ctx.cx("rowReorderIcon"))
  }, null, 8, ["class"])) : $options.columnProp("rowReorderIcon") ? (openBlock(), createElementBlock("i", mergeProps({
    key: 1,
    "class": [_ctx.cx("rowReorderIcon"), $options.columnProp("rowReorderIcon")]
  }, $options.getColumnPT("rowReorderIcon")), null, 16)) : (openBlock(), createBlock(_component_BarsIcon, mergeProps({
    key: 2,
    "class": _ctx.cx("rowReorderIcon")
  }, $options.getColumnPT("rowReorderIcon")), null, 16, ["class"]))], 64)) : $options.columnProp("expander") ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 6,
    "class": _ctx.cx("rowToggler"),
    type: "button",
    "aria-expanded": $props.isRowExpanded,
    "aria-controls": $props.ariaControls,
    "aria-label": $options.expandButtonAriaLabel,
    onClick: _cache[2] || (_cache[2] = function() {
      return $options.toggleRow && $options.toggleRow.apply($options, arguments);
    })
  }, $options.getColumnPT("rowToggler"), {
    "data-pc-group-section": "rowactionbutton"
  }), [$props.column.children && $props.column.children.rowtogglericon ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.rowtogglericon), {
    key: 0,
    "class": normalizeClass(_ctx.cx("rowTogglerIcon")),
    rowExpanded: $props.isRowExpanded
  }, null, 8, ["class", "rowExpanded"])) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [$props.isRowExpanded && $props.expandedRowIcon ? (openBlock(), createElementBlock("span", {
    key: 0,
    "class": normalizeClass([_ctx.cx("rowTogglerIcon"), $props.expandedRowIcon])
  }, null, 2)) : $props.isRowExpanded && !$props.expandedRowIcon ? (openBlock(), createBlock(_component_ChevronDownIcon, mergeProps({
    key: 1,
    "class": _ctx.cx("rowTogglerIcon")
  }, $options.getColumnPT("rowTogglerIcon")), null, 16, ["class"])) : !$props.isRowExpanded && $props.collapsedRowIcon ? (openBlock(), createElementBlock("span", {
    key: 2,
    "class": normalizeClass([_ctx.cx("rowTogglerIcon"), $props.collapsedRowIcon])
  }, null, 2)) : !$props.isRowExpanded && !$props.collapsedRowIcon ? (openBlock(), createBlock(_component_ChevronRightIcon, mergeProps({
    key: 3,
    "class": _ctx.cx("rowTogglerIcon")
  }, $options.getColumnPT("rowTogglerIcon")), null, 16, ["class"])) : createCommentVNode("", true)], 64))], 16, _hoisted_2$2$1)), [[_directive_ripple]]) : $props.editMode === "row" && $options.columnProp("rowEditor") ? (openBlock(), createElementBlock(Fragment, {
    key: 7
  }, [!$data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 0,
    "class": _ctx.cx("rowEditorInitButton"),
    type: "button",
    "aria-label": $options.initButtonAriaLabel,
    onClick: _cache[3] || (_cache[3] = function() {
      return $options.onRowEditInit && $options.onRowEditInit.apply($options, arguments);
    })
  }, $options.getColumnPT("rowEditorInitButton"), {
    "data-pc-group-section": "rowactionbutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditoriniticon || "PencilIcon"), mergeProps({
    "class": _ctx.cx("rowEditorInitIcon")
  }, $options.getColumnPT("rowEditorInitIcon")), null, 16, ["class"]))], 16, _hoisted_3$2)), [[_directive_ripple]]) : createCommentVNode("", true), $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 1,
    "class": _ctx.cx("rowEditorSaveButton"),
    type: "button",
    "aria-label": $options.saveButtonAriaLabel,
    onClick: _cache[4] || (_cache[4] = function() {
      return $options.onRowEditSave && $options.onRowEditSave.apply($options, arguments);
    })
  }, $options.getColumnPT("rowEditorSaveButton"), {
    "data-pc-group-section": "rowactionbutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditorsaveicon || "CheckIcon"), mergeProps({
    "class": _ctx.cx("rowEditorSaveIcon")
  }, $options.getColumnPT("rowEditorSaveIcon")), null, 16, ["class"]))], 16, _hoisted_4$1)), [[_directive_ripple]]) : createCommentVNode("", true), $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 2,
    "class": _ctx.cx("rowEditorCancelButton"),
    type: "button",
    "aria-label": $options.cancelButtonAriaLabel,
    onClick: _cache[5] || (_cache[5] = function() {
      return $options.onRowEditCancel && $options.onRowEditCancel.apply($options, arguments);
    })
  }, $options.getColumnPT("rowEditorCancelButton"), {
    "data-pc-group-section": "rowactionbutton"
  }), [(openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditorcancelicon || "TimesIcon"), mergeProps({
    "class": _ctx.cx("rowEditorCancelIcon")
  }, $options.getColumnPT("rowEditorCancelIcon")), null, 16, ["class"]))], 16, _hoisted_5$1)), [[_directive_ripple]]) : createCommentVNode("", true)], 64)) : (openBlock(), createElementBlock(Fragment, {
    key: 8
  }, [createTextVNode(toDisplayString($options.resolveFieldData()), 1)], 64))], 16, _hoisted_1$4));
}
script$9.render = render$9;
function _typeof$9(o) {
  "@babel/helpers - typeof";
  return _typeof$9 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$9(o);
}
function ownKeys$9(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$9(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$9(Object(t), true).forEach(function(r2) {
      _defineProperty$9(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$9(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$9(obj, key, value) {
  key = _toPropertyKey$9(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$9(t) {
  var i = _toPrimitive$9(t, "string");
  return "symbol" == _typeof$9(i) ? i : String(i);
}
function _toPrimitive$9(t, r) {
  if ("object" != _typeof$9(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$9(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$8 = {
  name: "BodyRow",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["rowgroup-toggle", "row-click", "row-dblclick", "row-rightclick", "row-touchend", "row-keydown", "row-mousedown", "row-dragstart", "row-dragover", "row-dragleave", "row-dragend", "row-drop", "row-toggle", "radio-change", "checkbox-change", "cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "row-edit-init", "row-edit-save", "row-edit-cancel", "editing-meta-change"],
  props: {
    rowData: {
      type: Object,
      "default": null
    },
    index: {
      type: Number,
      "default": 0
    },
    value: {
      type: Array,
      "default": null
    },
    columns: {
      type: null,
      "default": null
    },
    frozenRow: {
      type: Boolean,
      "default": false
    },
    empty: {
      type: Boolean,
      "default": false
    },
    rowGroupMode: {
      type: String,
      "default": null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      "default": null
    },
    expandableRowGroups: {
      type: Boolean,
      "default": false
    },
    expandedRowGroups: {
      type: Array,
      "default": null
    },
    first: {
      type: Number,
      "default": 0
    },
    dataKey: {
      type: [String, Function],
      "default": null
    },
    expandedRowIcon: {
      type: String,
      "default": null
    },
    collapsedRowIcon: {
      type: String,
      "default": null
    },
    expandedRows: {
      type: [Array, Object],
      "default": null
    },
    selection: {
      type: [Array, Object],
      "default": null
    },
    selectionKeys: {
      type: null,
      "default": null
    },
    selectionMode: {
      type: String,
      "default": null
    },
    contextMenu: {
      type: Boolean,
      "default": false
    },
    contextMenuSelection: {
      type: Object,
      "default": null
    },
    rowClass: {
      type: null,
      "default": null
    },
    rowStyle: {
      type: null,
      "default": null
    },
    rowGroupHeaderStyle: {
      type: null,
      "default": null
    },
    editMode: {
      type: String,
      "default": null
    },
    compareSelectionBy: {
      type: String,
      "default": "deepEquals"
    },
    editingRows: {
      type: Array,
      "default": null
    },
    editingRowKeys: {
      type: null,
      "default": null
    },
    editingMeta: {
      type: Object,
      "default": null
    },
    templates: {
      type: null,
      "default": null
    },
    scrollable: {
      type: Boolean,
      "default": false
    },
    responsiveLayout: {
      type: String,
      "default": "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      "default": null
    },
    isVirtualScrollerDisabled: {
      type: Boolean,
      "default": false
    },
    expandedRowId: {
      type: String,
      "default": null
    },
    nameAttributeSelector: {
      type: String,
      "default": null
    }
  },
  data: function data9() {
    return {
      d_rowExpanded: false
    };
  },
  watch: {
    expandedRows: {
      immediate: true,
      handler: function handler3(newValue) {
        var _this = this;
        this.d_rowExpanded = this.dataKey ? (newValue === null || newValue === void 0 ? void 0 : newValue[ObjectUtils.resolveFieldData(this.rowData, this.dataKey)]) !== void 0 : newValue === null || newValue === void 0 ? void 0 : newValue.some(function(d) {
          return _this.equals(_this.rowData, d);
        });
      }
    }
  },
  methods: {
    columnProp: function columnProp2(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    //@todo - update this method
    getColumnPT: function getColumnPT4(key) {
      var columnMetaData = {
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.columnProp({}, "pt"), key, columnMetaData));
    },
    //@todo - update this method
    getBodyRowPTOptions: function getBodyRowPTOptions(key) {
      var _this$$parentInstance;
      var datatable = (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.$parentInstance;
      return this.ptm(key, {
        context: {
          index: this.rowIndex,
          selectable: (datatable === null || datatable === void 0 ? void 0 : datatable.rowHover) || (datatable === null || datatable === void 0 ? void 0 : datatable.selectionMode),
          selected: this.isSelected,
          stripedRows: (datatable === null || datatable === void 0 ? void 0 : datatable.stripedRows) || false
        }
      });
    },
    shouldRenderBodyCell: function shouldRenderBodyCell(column) {
      var isHidden = this.columnProp(column, "hidden");
      if (this.rowGroupMode && !isHidden) {
        var field2 = this.columnProp(column, "field");
        if (this.rowGroupMode === "subheader") {
          return this.groupRowsBy !== field2;
        } else if (this.rowGroupMode === "rowspan") {
          if (this.isGrouped(column)) {
            var prevRowData = this.value[this.rowIndex - 1];
            if (prevRowData) {
              var currentRowFieldData = ObjectUtils.resolveFieldData(this.value[this.rowIndex], field2);
              var previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, field2);
              return currentRowFieldData !== previousRowFieldData;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      } else {
        return !isHidden;
      }
    },
    calculateRowGroupSize: function calculateRowGroupSize(column) {
      if (this.isGrouped(column)) {
        var index2 = this.rowIndex;
        var field2 = this.columnProp(column, "field");
        var currentRowFieldData = ObjectUtils.resolveFieldData(this.value[index2], field2);
        var nextRowFieldData = currentRowFieldData;
        var groupRowSpan = 0;
        while (currentRowFieldData === nextRowFieldData) {
          groupRowSpan++;
          var nextRowData = this.value[++index2];
          if (nextRowData) {
            nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, field2);
          } else {
            break;
          }
        }
        return groupRowSpan === 1 ? null : groupRowSpan;
      } else {
        return null;
      }
    },
    isGrouped: function isGrouped(column) {
      var field2 = this.columnProp(column, "field");
      if (this.groupRowsBy && field2) {
        if (Array.isArray(this.groupRowsBy))
          return this.groupRowsBy.indexOf(field2) > -1;
        else
          return this.groupRowsBy === field2;
      } else {
        return false;
      }
    },
    findIndexInSelection: function findIndexInSelection(data17) {
      return this.findIndex(data17, this.selection);
    },
    findIndex: function findIndex(data17, collection) {
      var index2 = -1;
      if (collection && collection.length) {
        for (var i = 0; i < collection.length; i++) {
          if (this.equals(data17, collection[i])) {
            index2 = i;
            break;
          }
        }
      }
      return index2;
    },
    equals: function equals3(data1, data22) {
      return this.compareSelectionBy === "equals" ? data1 === data22 : ObjectUtils.equals(data1, data22, this.dataKey);
    },
    onRowGroupToggle: function onRowGroupToggle(event2) {
      this.$emit("rowgroup-toggle", {
        originalEvent: event2,
        data: this.rowData
      });
    },
    onRowClick: function onRowClick(event2) {
      this.$emit("row-click", {
        originalEvent: event2,
        data: this.rowData,
        index: this.rowIndex
      });
    },
    onRowDblClick: function onRowDblClick(event2) {
      this.$emit("row-dblclick", {
        originalEvent: event2,
        data: this.rowData,
        index: this.rowIndex
      });
    },
    onRowRightClick: function onRowRightClick(event2) {
      this.$emit("row-rightclick", {
        originalEvent: event2,
        data: this.rowData,
        index: this.rowIndex
      });
    },
    onRowTouchEnd: function onRowTouchEnd(event2) {
      this.$emit("row-touchend", event2);
    },
    onRowKeyDown: function onRowKeyDown(event2) {
      this.$emit("row-keydown", {
        originalEvent: event2,
        data: this.rowData,
        index: this.rowIndex
      });
    },
    onRowMouseDown: function onRowMouseDown(event2) {
      this.$emit("row-mousedown", event2);
    },
    onRowDragStart: function onRowDragStart(event2) {
      this.$emit("row-dragstart", {
        originalEvent: event2,
        index: this.rowIndex
      });
    },
    onRowDragOver: function onRowDragOver(event2) {
      this.$emit("row-dragover", {
        originalEvent: event2,
        index: this.rowIndex
      });
    },
    onRowDragLeave: function onRowDragLeave(event2) {
      this.$emit("row-dragleave", event2);
    },
    onRowDragEnd: function onRowDragEnd(event2) {
      this.$emit("row-dragend", event2);
    },
    onRowDrop: function onRowDrop(event2) {
      this.$emit("row-drop", event2);
    },
    onRowToggle: function onRowToggle(event2) {
      this.d_rowExpanded = !this.d_rowExpanded;
      this.$emit("row-toggle", _objectSpread$9(_objectSpread$9({}, event2), {}, {
        expanded: this.d_rowExpanded
      }));
    },
    onRadioChange: function onRadioChange(event2) {
      this.$emit("radio-change", event2);
    },
    onCheckboxChange: function onCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    },
    onCellEditInit: function onCellEditInit(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete: function onCellEditComplete(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel: function onCellEditCancel(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit: function onRowEditInit2(event2) {
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave: function onRowEditSave2(event2) {
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel: function onRowEditCancel2(event2) {
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange: function onEditingMetaChange(event2) {
      this.$emit("editing-meta-change", event2);
    },
    getVirtualScrollerProp: function getVirtualScrollerProp2(option, options2) {
      options2 = options2 || this.virtualScrollerContentProps;
      return options2 ? options2[option] : null;
    }
  },
  computed: {
    rowIndex: function rowIndex() {
      var getItemOptions = this.getVirtualScrollerProp("getItemOptions");
      return getItemOptions ? getItemOptions(this.index).index : this.index;
    },
    rowStyles: function rowStyles() {
      var _this$rowStyle;
      return (_this$rowStyle = this.rowStyle) === null || _this$rowStyle === void 0 ? void 0 : _this$rowStyle.call(this, this.rowData);
    },
    rowClasses: function rowClasses() {
      var rowStyleClass = [];
      if (this.rowClass) {
        var rowClassValue = this.rowClass(this.rowData);
        if (rowClassValue) {
          rowStyleClass.push(rowClassValue);
        }
      }
      return [this.cx("row", {
        rowData: this.rowData,
        index: this.rowIndex
      }), rowStyleClass];
    },
    rowTabindex: function rowTabindex() {
      if (this.selection === null && (this.selectionMode === "single" || this.selectionMode === "multiple")) {
        return this.rowIndex === 0 ? 0 : -1;
      }
      return -1;
    },
    isRowEditing: function isRowEditing() {
      if (this.rowData && this.editingRows) {
        if (this.dataKey)
          return this.editingRowKeys ? this.editingRowKeys[ObjectUtils.resolveFieldData(this.rowData, this.dataKey)] !== void 0 : false;
        else
          return this.findIndex(this.rowData, this.editingRows) > -1;
      }
      return false;
    },
    isRowGroupExpanded: function isRowGroupExpanded() {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        var groupFieldValue = ObjectUtils.resolveFieldData(this.rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isSelected: function isSelected3() {
      if (this.rowData && this.selection) {
        if (this.dataKey) {
          return this.selectionKeys ? this.selectionKeys[ObjectUtils.resolveFieldData(this.rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(this.rowData) > -1;
          else
            return this.equals(this.rowData, this.selection);
        }
      }
      return false;
    },
    isSelectedWithContextMenu: function isSelectedWithContextMenu() {
      if (this.rowData && this.contextMenuSelection) {
        return this.equals(this.rowData, this.contextMenuSelection, this.dataKey);
      }
      return false;
    },
    shouldRenderRowGroupHeader: function shouldRenderRowGroupHeader() {
      var currentRowFieldData = ObjectUtils.resolveFieldData(this.rowData, this.groupRowsBy);
      var prevRowData = this.value[this.rowIndex - 1];
      if (prevRowData) {
        var previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.groupRowsBy);
        return currentRowFieldData !== previousRowFieldData;
      } else {
        return true;
      }
    },
    shouldRenderRowGroupFooter: function shouldRenderRowGroupFooter() {
      if (this.expandableRowGroups && !this.isRowGroupExpanded) {
        return false;
      } else {
        var currentRowFieldData = ObjectUtils.resolveFieldData(this.rowData, this.groupRowsBy);
        var nextRowData = this.value[this.rowIndex + 1];
        if (nextRowData) {
          var nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.groupRowsBy);
          return currentRowFieldData !== nextRowFieldData;
        } else {
          return true;
        }
      }
    },
    columnsLength: function columnsLength() {
      var _this2 = this;
      if (this.columns) {
        var hiddenColLength = 0;
        this.columns.forEach(function(column) {
          if (_this2.columnProp(column, "selectionMode") === "single")
            hiddenColLength--;
          if (_this2.columnProp(column, "hidden"))
            hiddenColLength++;
        });
        return this.columns.length - hiddenColLength;
      }
      return 0;
    }
  },
  components: {
    DTBodyCell: script$9,
    ChevronDownIcon: script$z,
    ChevronRightIcon: script$n
  }
};
function _typeof$8(o) {
  "@babel/helpers - typeof";
  return _typeof$8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$8(o);
}
function ownKeys$8(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$8(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$8(Object(t), true).forEach(function(r2) {
      _defineProperty$8(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$8(obj, key, value) {
  key = _toPropertyKey$8(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$8(t) {
  var i = _toPrimitive$8(t, "string");
  return "symbol" == _typeof$8(i) ? i : String(i);
}
function _toPrimitive$8(t, r) {
  if ("object" != _typeof$8(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$8(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$3$1 = ["colspan"];
var _hoisted_2$1$1 = ["tabindex", "aria-selected", "data-p-index", "data-p-selectable-row", "data-p-highlight", "data-p-highlight-contextmenu"];
var _hoisted_3$1$1 = ["id"];
var _hoisted_4$2 = ["colspan"];
var _hoisted_5 = ["colspan"];
var _hoisted_6 = ["colspan"];
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_ChevronDownIcon = resolveComponent("ChevronDownIcon");
  var _component_ChevronRightIcon = resolveComponent("ChevronRightIcon");
  var _component_DTBodyCell = resolveComponent("DTBodyCell");
  return !$props.empty ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [$props.templates["groupheader"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupHeader ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 0,
    "class": _ctx.cx("rowGroupHeader"),
    style: $props.rowGroupHeaderStyle,
    role: "row"
  }, _ctx.ptm("rowGroupHeader")), [createBaseVNode("td", mergeProps({
    colspan: $options.columnsLength - 1
  }, _objectSpread$8(_objectSpread$8({}, $options.getColumnPT("bodycell")), _ctx.ptm("rowGroupHeaderCell"))), [$props.expandableRowGroups ? (openBlock(), createElementBlock("button", mergeProps({
    key: 0,
    "class": _ctx.cx("rowGroupToggler"),
    onClick: _cache[0] || (_cache[0] = function() {
      return $options.onRowGroupToggle && $options.onRowGroupToggle.apply($options, arguments);
    }),
    type: "button"
  }, _ctx.ptm("rowGroupToggler")), [$props.templates["rowgrouptogglericon"] ? (openBlock(), createBlock(resolveDynamicComponent($props.templates["rowgrouptogglericon"]), {
    key: 0,
    expanded: $options.isRowGroupExpanded
  }, null, 8, ["expanded"])) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [$options.isRowGroupExpanded && $props.expandedRowIcon ? (openBlock(), createElementBlock("span", mergeProps({
    key: 0,
    "class": [_ctx.cx("rowGroupTogglerIcon"), $props.expandedRowIcon]
  }, _ctx.ptm("rowGroupTogglerIcon")), null, 16)) : $options.isRowGroupExpanded && !$props.expandedRowIcon ? (openBlock(), createBlock(_component_ChevronDownIcon, mergeProps({
    key: 1,
    "class": _ctx.cx("rowGroupTogglerIcon")
  }, _ctx.ptm("rowGroupTogglerIcon")), null, 16, ["class"])) : !$options.isRowGroupExpanded && $props.collapsedRowIcon ? (openBlock(), createElementBlock("span", mergeProps({
    key: 2,
    "class": [_ctx.cx("rowGroupTogglerIcon"), $props.collapsedRowIcon]
  }, _ctx.ptm("rowGroupTogglerIcon")), null, 16)) : !$options.isRowGroupExpanded && !$props.collapsedRowIcon ? (openBlock(), createBlock(_component_ChevronRightIcon, mergeProps({
    key: 3,
    "class": _ctx.cx("rowGroupTogglerIcon")
  }, _ctx.ptm("rowGroupTogglerIcon")), null, 16, ["class"])) : createCommentVNode("", true)], 64))], 16)) : createCommentVNode("", true), (openBlock(), createBlock(resolveDynamicComponent($props.templates["groupheader"]), {
    data: $props.rowData,
    index: $options.rowIndex
  }, null, 8, ["data", "index"]))], 16, _hoisted_1$3$1)], 16)) : createCommentVNode("", true), ($props.expandableRowGroups ? $options.isRowGroupExpanded : true) ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 1,
    "class": $options.rowClasses,
    style: $options.rowStyles,
    tabindex: $options.rowTabindex,
    role: "row",
    "aria-selected": $props.selectionMode ? $options.isSelected : null,
    onClick: _cache[1] || (_cache[1] = function() {
      return $options.onRowClick && $options.onRowClick.apply($options, arguments);
    }),
    onDblclick: _cache[2] || (_cache[2] = function() {
      return $options.onRowDblClick && $options.onRowDblClick.apply($options, arguments);
    }),
    onContextmenu: _cache[3] || (_cache[3] = function() {
      return $options.onRowRightClick && $options.onRowRightClick.apply($options, arguments);
    }),
    onTouchend: _cache[4] || (_cache[4] = function() {
      return $options.onRowTouchEnd && $options.onRowTouchEnd.apply($options, arguments);
    }),
    onKeydown: _cache[5] || (_cache[5] = withModifiers(function() {
      return $options.onRowKeyDown && $options.onRowKeyDown.apply($options, arguments);
    }, ["self"])),
    onMousedown: _cache[6] || (_cache[6] = function() {
      return $options.onRowMouseDown && $options.onRowMouseDown.apply($options, arguments);
    }),
    onDragstart: _cache[7] || (_cache[7] = function() {
      return $options.onRowDragStart && $options.onRowDragStart.apply($options, arguments);
    }),
    onDragover: _cache[8] || (_cache[8] = function() {
      return $options.onRowDragOver && $options.onRowDragOver.apply($options, arguments);
    }),
    onDragleave: _cache[9] || (_cache[9] = function() {
      return $options.onRowDragLeave && $options.onRowDragLeave.apply($options, arguments);
    }),
    onDragend: _cache[10] || (_cache[10] = function() {
      return $options.onRowDragEnd && $options.onRowDragEnd.apply($options, arguments);
    }),
    onDrop: _cache[11] || (_cache[11] = function() {
      return $options.onRowDrop && $options.onRowDrop.apply($options, arguments);
    })
  }, $options.getBodyRowPTOptions("bodyRow"), {
    "data-p-index": $options.rowIndex,
    "data-p-selectable-row": $props.selectionMode ? true : false,
    "data-p-highlight": $props.selection && $options.isSelected,
    "data-p-highlight-contextmenu": $props.contextMenuSelection && $options.isSelectedWithContextMenu
  }), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, function(col, i) {
    return openBlock(), createElementBlock(Fragment, null, [$options.shouldRenderBodyCell(col) ? (openBlock(), createBlock(_component_DTBodyCell, {
      key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i,
      rowData: $props.rowData,
      column: col,
      rowIndex: $options.rowIndex,
      index: i,
      selected: $options.isSelected,
      frozenRow: $props.frozenRow,
      rowspan: $props.rowGroupMode === "rowspan" ? $options.calculateRowGroupSize(col) : null,
      editMode: $props.editMode,
      editing: $props.editMode === "row" && $options.isRowEditing,
      editingMeta: $props.editingMeta,
      responsiveLayout: $props.responsiveLayout,
      virtualScrollerContentProps: $props.virtualScrollerContentProps,
      ariaControls: $props.expandedRowId + "_" + $options.rowIndex + "_expansion",
      name: $props.nameAttributeSelector,
      isRowExpanded: $data.d_rowExpanded,
      expandedRowIcon: $props.expandedRowIcon,
      collapsedRowIcon: $props.collapsedRowIcon,
      onRadioChange: $options.onRadioChange,
      onCheckboxChange: $options.onCheckboxChange,
      onRowToggle: $options.onRowToggle,
      onCellEditInit: $options.onCellEditInit,
      onCellEditComplete: $options.onCellEditComplete,
      onCellEditCancel: $options.onCellEditCancel,
      onRowEditInit: $options.onRowEditInit,
      onRowEditSave: $options.onRowEditSave,
      onRowEditCancel: $options.onRowEditCancel,
      onEditingMetaChange: $options.onEditingMetaChange,
      unstyled: _ctx.unstyled,
      pt: _ctx.pt
    }, null, 8, ["rowData", "column", "rowIndex", "index", "selected", "frozenRow", "rowspan", "editMode", "editing", "editingMeta", "responsiveLayout", "virtualScrollerContentProps", "ariaControls", "name", "isRowExpanded", "expandedRowIcon", "collapsedRowIcon", "onRadioChange", "onCheckboxChange", "onRowToggle", "onCellEditInit", "onCellEditComplete", "onCellEditCancel", "onRowEditInit", "onRowEditSave", "onRowEditCancel", "onEditingMetaChange", "unstyled", "pt"])) : createCommentVNode("", true)], 64);
  }), 256))], 16, _hoisted_2$1$1)) : createCommentVNode("", true), $props.templates["expansion"] && $props.expandedRows && $data.d_rowExpanded ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 2,
    id: $props.expandedRowId + "_" + $options.rowIndex + "_expansion",
    "class": _ctx.cx("rowExpansion"),
    role: "row"
  }, _ctx.ptm("rowExpansion")), [createBaseVNode("td", mergeProps({
    colspan: $options.columnsLength
  }, _objectSpread$8(_objectSpread$8({}, $options.getColumnPT("bodycell")), _ctx.ptm("rowExpansionCell"))), [(openBlock(), createBlock(resolveDynamicComponent($props.templates["expansion"]), {
    data: $props.rowData,
    index: $options.rowIndex
  }, null, 8, ["data", "index"]))], 16, _hoisted_4$2)], 16, _hoisted_3$1$1)) : createCommentVNode("", true), $props.templates["groupfooter"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupFooter ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 3,
    "class": _ctx.cx("rowGroupFooter"),
    role: "row"
  }, _ctx.ptm("rowGroupFooter")), [createBaseVNode("td", mergeProps({
    colspan: $options.columnsLength - 1
  }, _objectSpread$8(_objectSpread$8({}, $options.getColumnPT("bodycell")), _ctx.ptm("rowGroupFooterCell"))), [(openBlock(), createBlock(resolveDynamicComponent($props.templates["groupfooter"]), {
    data: $props.rowData,
    index: $options.rowIndex
  }, null, 8, ["data", "index"]))], 16, _hoisted_5)], 16)) : createCommentVNode("", true)], 64)) : (openBlock(), createElementBlock("tr", mergeProps({
    key: 1,
    "class": _ctx.cx("emptyMessage"),
    role: "row"
  }, _ctx.ptm("emptyMessage")), [createBaseVNode("td", mergeProps({
    colspan: $options.columnsLength
  }, _objectSpread$8(_objectSpread$8({}, $options.getColumnPT("bodycell")), _ctx.ptm("emptyMessageCell"))), [$props.templates.empty ? (openBlock(), createBlock(resolveDynamicComponent($props.templates.empty), {
    key: 0
  })) : createCommentVNode("", true)], 16, _hoisted_6)], 16));
}
script$8.render = render$8;
var script$7 = {
  name: "TableBody",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["rowgroup-toggle", "row-click", "row-dblclick", "row-rightclick", "row-touchend", "row-keydown", "row-mousedown", "row-dragstart", "row-dragover", "row-dragleave", "row-dragend", "row-drop", "row-toggle", "radio-change", "checkbox-change", "cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "row-edit-init", "row-edit-save", "row-edit-cancel", "editing-meta-change"],
  props: {
    value: {
      type: Array,
      "default": null
    },
    columns: {
      type: null,
      "default": null
    },
    frozenRow: {
      type: Boolean,
      "default": false
    },
    empty: {
      type: Boolean,
      "default": false
    },
    rowGroupMode: {
      type: String,
      "default": null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      "default": null
    },
    expandableRowGroups: {
      type: Boolean,
      "default": false
    },
    expandedRowGroups: {
      type: Array,
      "default": null
    },
    first: {
      type: Number,
      "default": 0
    },
    dataKey: {
      type: [String, Function],
      "default": null
    },
    expandedRowIcon: {
      type: String,
      "default": null
    },
    collapsedRowIcon: {
      type: String,
      "default": null
    },
    expandedRows: {
      type: [Array, Object],
      "default": null
    },
    selection: {
      type: [Array, Object],
      "default": null
    },
    selectionKeys: {
      type: null,
      "default": null
    },
    selectionMode: {
      type: String,
      "default": null
    },
    contextMenu: {
      type: Boolean,
      "default": false
    },
    contextMenuSelection: {
      type: Object,
      "default": null
    },
    rowClass: {
      type: null,
      "default": null
    },
    rowStyle: {
      type: null,
      "default": null
    },
    editMode: {
      type: String,
      "default": null
    },
    compareSelectionBy: {
      type: String,
      "default": "deepEquals"
    },
    editingRows: {
      type: Array,
      "default": null
    },
    editingRowKeys: {
      type: null,
      "default": null
    },
    editingMeta: {
      type: Object,
      "default": null
    },
    templates: {
      type: null,
      "default": null
    },
    scrollable: {
      type: Boolean,
      "default": false
    },
    responsiveLayout: {
      type: String,
      "default": "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      "default": null
    },
    isVirtualScrollerDisabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data10() {
    return {
      rowGroupHeaderStyleObject: {}
    };
  },
  mounted: function mounted10() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  updated: function updated6() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  methods: {
    updateFrozenRowStickyPosition: function updateFrozenRowStickyPosition() {
      this.$el.style.top = DomHandler.getOuterHeight(this.$el.previousElementSibling) + "px";
    },
    updateFrozenRowGroupHeaderStickyPosition: function updateFrozenRowGroupHeaderStickyPosition() {
      var tableHeaderHeight = DomHandler.getOuterHeight(this.$el.previousElementSibling);
      this.rowGroupHeaderStyleObject.top = tableHeaderHeight + "px";
    },
    getVirtualScrollerProp: function getVirtualScrollerProp3(option, options2) {
      options2 = options2 || this.virtualScrollerContentProps;
      return options2 ? options2[option] : null;
    },
    bodyRef: function bodyRef(el) {
      var contentRef2 = this.getVirtualScrollerProp("contentRef");
      contentRef2 && contentRef2(el);
    }
  },
  computed: {
    rowGroupHeaderStyle: function rowGroupHeaderStyle() {
      if (this.scrollable) {
        return {
          top: this.rowGroupHeaderStyleObject.top
        };
      }
      return null;
    },
    bodyStyle: function bodyStyle() {
      return this.getVirtualScrollerProp("contentStyle");
    },
    ptmTBodyOptions: function ptmTBodyOptions() {
      var _this$$parentInstance;
      return {
        context: {
          scrollable: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.scrollable
        }
      };
    },
    expandedRowId: function expandedRowId() {
      return UniqueComponentId();
    },
    nameAttributeSelector: function nameAttributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    DTBodyRow: script$8
  }
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DTBodyRow = resolveComponent("DTBodyRow");
  return openBlock(), createElementBlock("tbody", mergeProps({
    ref: $options.bodyRef,
    "class": _ctx.cx("tbody"),
    role: "rowgroup",
    style: $options.bodyStyle
  }, _ctx.ptm("tbody", $options.ptmTBodyOptions)), [!$props.empty ? (openBlock(true), createElementBlock(Fragment, {
    key: 0
  }, renderList($props.value, function(rowData, rowIndex2) {
    return openBlock(), createBlock(_component_DTBodyRow, {
      key: rowIndex2,
      rowData,
      index: rowIndex2,
      value: $props.value,
      columns: $props.columns,
      frozenRow: $props.frozenRow,
      empty: $props.empty,
      first: $props.first,
      dataKey: $props.dataKey,
      selection: $props.selection,
      selectionKeys: $props.selectionKeys,
      selectionMode: $props.selectionMode,
      contextMenu: $props.contextMenu,
      contextMenuSelection: $props.contextMenuSelection,
      rowGroupMode: $props.rowGroupMode,
      groupRowsBy: $props.groupRowsBy,
      expandableRowGroups: $props.expandableRowGroups,
      rowClass: $props.rowClass,
      rowStyle: $props.rowStyle,
      editMode: $props.editMode,
      compareSelectionBy: $props.compareSelectionBy,
      scrollable: $props.scrollable,
      expandedRowIcon: $props.expandedRowIcon,
      collapsedRowIcon: $props.collapsedRowIcon,
      expandedRows: $props.expandedRows,
      expandedRowGroups: $props.expandedRowGroups,
      editingRows: $props.editingRows,
      editingRowKeys: $props.editingRowKeys,
      templates: $props.templates,
      responsiveLayout: $props.responsiveLayout,
      virtualScrollerContentProps: $props.virtualScrollerContentProps,
      isVirtualScrollerDisabled: $props.isVirtualScrollerDisabled,
      editingMeta: $props.editingMeta,
      rowGroupHeaderStyle: $options.rowGroupHeaderStyle,
      expandedRowId: $options.expandedRowId,
      nameAttributeSelector: $options.nameAttributeSelector,
      onRowgroupToggle: _cache[0] || (_cache[0] = function($event) {
        return _ctx.$emit("rowgroup-toggle", $event);
      }),
      onRowClick: _cache[1] || (_cache[1] = function($event) {
        return _ctx.$emit("row-click", $event);
      }),
      onRowDblclick: _cache[2] || (_cache[2] = function($event) {
        return _ctx.$emit("row-dblclick", $event);
      }),
      onRowRightclick: _cache[3] || (_cache[3] = function($event) {
        return _ctx.$emit("row-rightclick", $event);
      }),
      onRowTouchend: _cache[4] || (_cache[4] = function($event) {
        return _ctx.$emit("row-touchend", $event);
      }),
      onRowKeydown: _cache[5] || (_cache[5] = function($event) {
        return _ctx.$emit("row-keydown", $event);
      }),
      onRowMousedown: _cache[6] || (_cache[6] = function($event) {
        return _ctx.$emit("row-mousedown", $event);
      }),
      onRowDragstart: _cache[7] || (_cache[7] = function($event) {
        return _ctx.$emit("row-dragstart", $event);
      }),
      onRowDragover: _cache[8] || (_cache[8] = function($event) {
        return _ctx.$emit("row-dragover", $event);
      }),
      onRowDragleave: _cache[9] || (_cache[9] = function($event) {
        return _ctx.$emit("row-dragleave", $event);
      }),
      onRowDragend: _cache[10] || (_cache[10] = function($event) {
        return _ctx.$emit("row-dragend", $event);
      }),
      onRowDrop: _cache[11] || (_cache[11] = function($event) {
        return _ctx.$emit("row-drop", $event);
      }),
      onRowToggle: _cache[12] || (_cache[12] = function($event) {
        return _ctx.$emit("row-toggle", $event);
      }),
      onRadioChange: _cache[13] || (_cache[13] = function($event) {
        return _ctx.$emit("radio-change", $event);
      }),
      onCheckboxChange: _cache[14] || (_cache[14] = function($event) {
        return _ctx.$emit("checkbox-change", $event);
      }),
      onCellEditInit: _cache[15] || (_cache[15] = function($event) {
        return _ctx.$emit("cell-edit-init", $event);
      }),
      onCellEditComplete: _cache[16] || (_cache[16] = function($event) {
        return _ctx.$emit("cell-edit-complete", $event);
      }),
      onCellEditCancel: _cache[17] || (_cache[17] = function($event) {
        return _ctx.$emit("cell-edit-cancel", $event);
      }),
      onRowEditInit: _cache[18] || (_cache[18] = function($event) {
        return _ctx.$emit("row-edit-init", $event);
      }),
      onRowEditSave: _cache[19] || (_cache[19] = function($event) {
        return _ctx.$emit("row-edit-save", $event);
      }),
      onRowEditCancel: _cache[20] || (_cache[20] = function($event) {
        return _ctx.$emit("row-edit-cancel", $event);
      }),
      onEditingMetaChange: _cache[21] || (_cache[21] = function($event) {
        return _ctx.$emit("editing-meta-change", $event);
      }),
      unstyled: _ctx.unstyled,
      pt: _ctx.pt
    }, null, 8, ["rowData", "index", "value", "columns", "frozenRow", "empty", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "virtualScrollerContentProps", "isVirtualScrollerDisabled", "editingMeta", "rowGroupHeaderStyle", "expandedRowId", "nameAttributeSelector", "unstyled", "pt"]);
  }), 128)) : (openBlock(), createBlock(_component_DTBodyRow, {
    key: 1,
    empty: $props.empty,
    columns: $props.columns,
    templates: $props.templates
  }, null, 8, ["empty", "columns", "templates"]))], 16);
}
script$7.render = render$7;
var script$6 = {
  name: "FooterCell",
  hostName: "DataTable",
  "extends": script$N,
  props: {
    column: {
      type: Object,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    }
  },
  data: function data11() {
    return {
      styleObject: {}
    };
  },
  mounted: function mounted11() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated: function updated7() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp: function columnProp3(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPT: function getColumnPT5(key) {
      var _this$$parentInstance, _this$$parentInstance2;
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: this.index,
          size: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.size,
          showGridlines: ((_this$$parentInstance2 = this.$parentInstance) === null || _this$$parentInstance2 === void 0 || (_this$$parentInstance2 = _this$$parentInstance2.$parentInstance) === null || _this$$parentInstance2 === void 0 ? void 0 : _this$$parentInstance2.showGridlines) || false
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp4() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    updateStickyPosition: function updateStickyPosition2() {
      if (this.columnProp("frozen")) {
        var align = this.columnProp("alignFrozen");
        if (align === "right") {
          var right = 0;
          var next = DomHandler.getNextElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          var left = 0;
          var prev = DomHandler.getPreviousElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    }
  },
  computed: {
    containerClass: function containerClass3() {
      return [this.columnProp("footerClass"), this.columnProp("class"), this.cx("footerCell")];
    },
    containerStyle: function containerStyle2() {
      var bodyStyle2 = this.columnProp("footerStyle");
      var columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle2, this.styleObject] : [columnStyle, bodyStyle2];
    }
  }
};
function _typeof$7(o) {
  "@babel/helpers - typeof";
  return _typeof$7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$7(o);
}
function ownKeys$7(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$7(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$7(Object(t), true).forEach(function(r2) {
      _defineProperty$7(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$7(obj, key, value) {
  key = _toPropertyKey$7(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$7(t) {
  var i = _toPrimitive$7(t, "string");
  return "symbol" == _typeof$7(i) ? i : String(i);
}
function _toPrimitive$7(t, r) {
  if ("object" != _typeof$7(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$7(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$2$1 = ["colspan", "rowspan", "data-p-frozen-column"];
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("td", mergeProps({
    style: $options.containerStyle,
    "class": $options.containerClass,
    role: "cell",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan")
  }, _objectSpread$7(_objectSpread$7({}, $options.getColumnPT("root")), $options.getColumnPT("footerCell")), {
    "data-p-frozen-column": $options.columnProp("frozen")
  }), [$props.column.children && $props.column.children.footer ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.footer), {
    key: 0,
    column: $props.column
  }, null, 8, ["column"])) : createCommentVNode("", true), createTextVNode(" " + toDisplayString($options.columnProp("footer")), 1)], 16, _hoisted_1$2$1);
}
script$6.render = render$6;
function _createForOfIteratorHelper$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var script$5 = {
  name: "TableFooter",
  hostName: "DataTable",
  "extends": script$N,
  props: {
    columnGroup: {
      type: null,
      "default": null
    },
    columns: {
      type: Object,
      "default": null
    }
  },
  provide: function provide13() {
    return {
      $rows: this.d_footerRows,
      $columns: this.d_footerColumns
    };
  },
  data: function data12() {
    return {
      d_footerRows: new _default({
        type: "Row"
      }),
      d_footerColumns: new _default({
        type: "Column"
      })
    };
  },
  beforeUnmount: function beforeUnmount5() {
    this.d_footerRows.clear();
    this.d_footerColumns.clear();
  },
  methods: {
    columnProp: function columnProp4(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getColumnGroupPT: function getColumnGroupPT(key) {
      var columnGroupMetaData = {
        props: this.getColumnGroupProps(),
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          type: "footer",
          scrollable: this.ptmTFootOptions.context.scrollable
        }
      };
      return mergeProps(this.ptm("columnGroup.".concat(key), {
        columnGroup: columnGroupMetaData
      }), this.ptm("columnGroup.".concat(key), columnGroupMetaData), this.ptmo(this.getColumnGroupProps(), key, columnGroupMetaData));
    },
    getColumnGroupProps: function getColumnGroupProps() {
      return this.columnGroup && this.columnGroup.props && this.columnGroup.props.pt ? this.columnGroup.props.pt : void 0;
    },
    getRowPT: function getRowPT(row2, key, index2) {
      var rowMetaData = {
        props: row2.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: index2
        }
      };
      return mergeProps(this.ptm("row.".concat(key), {
        row: rowMetaData
      }), this.ptm("row.".concat(key), rowMetaData), this.ptmo(this.getRowProp(row2), key, rowMetaData));
    },
    getRowProp: function getRowProp(row2) {
      return row2.props && row2.props.pt ? row2.props.pt : void 0;
    },
    getFooterRows: function getFooterRows() {
      var _this$d_footerRows;
      return (_this$d_footerRows = this.d_footerRows) === null || _this$d_footerRows === void 0 ? void 0 : _this$d_footerRows.get(this.columnGroup, this.columnGroup.children);
    },
    getFooterColumns: function getFooterColumns(row2) {
      var _this$d_footerColumns;
      return (_this$d_footerColumns = this.d_footerColumns) === null || _this$d_footerColumns === void 0 ? void 0 : _this$d_footerColumns.get(row2, row2.children);
    }
  },
  computed: {
    hasFooter: function hasFooter() {
      var hasFooter2 = false;
      if (this.columnGroup) {
        hasFooter2 = true;
      } else if (this.columns) {
        var _iterator = _createForOfIteratorHelper$1(this.columns), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var col = _step.value;
            if (this.columnProp(col, "footer") || col.children && col.children.footer) {
              hasFooter2 = true;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return hasFooter2;
    },
    ptmTFootOptions: function ptmTFootOptions() {
      var _this$$parentInstance;
      return {
        context: {
          scrollable: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.scrollable
        }
      };
    }
  },
  components: {
    DTFooterCell: script$6
  }
};
function _typeof$6(o) {
  "@babel/helpers - typeof";
  return _typeof$6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$6(o);
}
function ownKeys$6(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$6(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$6(Object(t), true).forEach(function(r2) {
      _defineProperty$6(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$6(obj, key, value) {
  key = _toPropertyKey$6(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$6(t) {
  var i = _toPrimitive$6(t, "string");
  return "symbol" == _typeof$6(i) ? i : String(i);
}
function _toPrimitive$6(t, r) {
  if ("object" != _typeof$6(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$6(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DTFooterCell = resolveComponent("DTFooterCell");
  return $options.hasFooter ? (openBlock(), createElementBlock("tfoot", mergeProps({
    key: 0,
    "class": _ctx.cx("tfoot"),
    style: _ctx.sx("tfoot"),
    role: "rowgroup"
  }, $props.columnGroup ? _objectSpread$6(_objectSpread$6({}, _ctx.ptm("tfoot", $options.ptmTFootOptions)), $options.getColumnGroupPT("root")) : _ctx.ptm("tfoot", $options.ptmTFootOptions), {
    "data-pc-section": "tfoot"
  }), [!$props.columnGroup ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 0,
    role: "row"
  }, _ctx.ptm("footerRow")), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, function(col, i) {
    return openBlock(), createElementBlock(Fragment, {
      key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
    }, [!$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
      key: 0,
      column: col,
      pt: _ctx.pt
    }, null, 8, ["column", "pt"])) : createCommentVNode("", true)], 64);
  }), 128))], 16)) : (openBlock(true), createElementBlock(Fragment, {
    key: 1
  }, renderList($options.getFooterRows(), function(row2, i) {
    return openBlock(), createElementBlock("tr", mergeProps({
      key: i,
      role: "row"
    }, _objectSpread$6(_objectSpread$6({}, _ctx.ptm("footerRow")), $options.getRowPT(row2, "root", i))), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.getFooterColumns(row2), function(col, j) {
      return openBlock(), createElementBlock(Fragment, {
        key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
      }, [!$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
        key: 0,
        column: col,
        index: i,
        pt: _ctx.pt
      }, null, 8, ["column", "index", "pt"])) : createCommentVNode("", true)], 64);
    }), 128))], 16);
  }), 128))], 16)) : createCommentVNode("", true);
}
script$5.render = render$5;
function _typeof$5(o) {
  "@babel/helpers - typeof";
  return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$5(o);
}
function ownKeys$5(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$5(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$5(Object(t), true).forEach(function(r2) {
      _defineProperty$5(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$5(obj, key, value) {
  key = _toPropertyKey$5(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$5(t) {
  var i = _toPrimitive$5(t, "string");
  return "symbol" == _typeof$5(i) ? i : String(i);
}
function _toPrimitive$5(t, r) {
  if ("object" != _typeof$5(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$5(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var script$4 = {
  name: "ColumnFilter",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["filter-change", "filter-apply", "operator-change", "matchmode-change", "constraint-add", "constraint-remove", "filter-clear", "apply-click"],
  props: {
    field: {
      type: String,
      "default": null
    },
    type: {
      type: String,
      "default": "text"
    },
    display: {
      type: String,
      "default": null
    },
    showMenu: {
      type: Boolean,
      "default": true
    },
    matchMode: {
      type: String,
      "default": null
    },
    showOperator: {
      type: Boolean,
      "default": true
    },
    showClearButton: {
      type: Boolean,
      "default": true
    },
    showApplyButton: {
      type: Boolean,
      "default": true
    },
    showMatchModes: {
      type: Boolean,
      "default": true
    },
    showAddButton: {
      type: Boolean,
      "default": true
    },
    matchModeOptions: {
      type: Array,
      "default": null
    },
    maxConstraints: {
      type: Number,
      "default": 2
    },
    filterElement: {
      type: Function,
      "default": null
    },
    filterHeaderTemplate: {
      type: Function,
      "default": null
    },
    filterFooterTemplate: {
      type: Function,
      "default": null
    },
    filterClearTemplate: {
      type: Function,
      "default": null
    },
    filterApplyTemplate: {
      type: Function,
      "default": null
    },
    filterIconTemplate: {
      type: Function,
      "default": null
    },
    filterAddIconTemplate: {
      type: Function,
      "default": null
    },
    filterRemoveIconTemplate: {
      type: Function,
      "default": null
    },
    filterClearIconTemplate: {
      type: Function,
      "default": null
    },
    filters: {
      type: Object,
      "default": null
    },
    filtersStore: {
      type: Object,
      "default": null
    },
    filterMenuClass: {
      type: String,
      "default": null
    },
    filterMenuStyle: {
      type: null,
      "default": null
    },
    filterInputProps: {
      type: null,
      "default": null
    },
    column: null
  },
  data: function data13() {
    return {
      overlayVisible: false,
      defaultMatchMode: null,
      defaultOperator: null
    };
  },
  overlay: null,
  selfClick: false,
  overlayEventListener: null,
  beforeUnmount: function beforeUnmount6() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.onOverlayHide();
    }
  },
  mounted: function mounted12() {
    if (this.filters && this.filters[this.field]) {
      var fieldFilters = this.filters[this.field];
      if (fieldFilters.operator) {
        this.defaultMatchMode = fieldFilters.constraints[0].matchMode;
        this.defaultOperator = fieldFilters.operator;
      } else {
        this.defaultMatchMode = this.filters[this.field].matchMode;
      }
    }
  },
  methods: {
    getColumnPT: function getColumnPT6(key, params) {
      var columnMetaData = _objectSpread$5({
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        }
      }, params);
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp5() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    ptmFilterRowItemOptions: function ptmFilterRowItemOptions(matchMode) {
      return {
        context: {
          highlighted: matchMode && this.isRowMatchModeSelected(matchMode.value)
        }
      };
    },
    clearFilter: function clearFilter() {
      var _filters = _objectSpread$5({}, this.filters);
      if (_filters[this.field].operator) {
        _filters[this.field].constraints.splice(1);
        _filters[this.field].operator = this.defaultOperator;
        _filters[this.field].constraints[0] = {
          value: null,
          matchMode: this.defaultMatchMode
        };
      } else {
        _filters[this.field].value = null;
        _filters[this.field].matchMode = this.defaultMatchMode;
      }
      this.$emit("filter-clear");
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    applyFilter: function applyFilter() {
      this.$emit("apply-click", {
        field: this.field,
        constraints: this.filters[this.field]
      });
      this.$emit("filter-apply");
      this.hide();
    },
    hasFilter: function hasFilter() {
      if (this.filtersStore) {
        var fieldFilter = this.filtersStore[this.field];
        if (fieldFilter) {
          if (fieldFilter.operator)
            return !this.isFilterBlank(fieldFilter.constraints[0].value);
          else
            return !this.isFilterBlank(fieldFilter.value);
        }
      }
      return false;
    },
    hasRowFilter: function hasRowFilter() {
      return this.filters[this.field] && !this.isFilterBlank(this.filters[this.field].value);
    },
    isFilterBlank: function isFilterBlank(filter4) {
      if (filter4 !== null && filter4 !== void 0) {
        if (typeof filter4 === "string" && filter4.trim().length == 0 || filter4 instanceof Array && filter4.length == 0)
          return true;
        else
          return false;
      }
      return true;
    },
    toggleMenu: function toggleMenu(event2) {
      this.overlayVisible = !this.overlayVisible;
      event2.preventDefault();
    },
    onToggleButtonKeyDown: function onToggleButtonKeyDown(event2) {
      switch (event2.code) {
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.toggleMenu(event2);
          break;
        case "Escape":
          this.overlayVisible = false;
          break;
      }
    },
    onRowMatchModeChange: function onRowMatchModeChange(matchMode) {
      var _filters = _objectSpread$5({}, this.filters);
      _filters[this.field].matchMode = matchMode;
      this.$emit("matchmode-change", {
        field: this.field,
        matchMode
      });
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    onRowMatchModeKeyDown: function onRowMatchModeKeyDown(event2) {
      var item2 = event2.target;
      switch (event2.code) {
        case "ArrowDown":
          var nextItem = this.findNextItem(item2);
          if (nextItem) {
            item2.removeAttribute("tabindex");
            nextItem.tabIndex = "0";
            nextItem.focus();
          }
          event2.preventDefault();
          break;
        case "ArrowUp":
          var prevItem = this.findPrevItem(item2);
          if (prevItem) {
            item2.removeAttribute("tabindex");
            prevItem.tabIndex = "0";
            prevItem.focus();
          }
          event2.preventDefault();
          break;
      }
    },
    isRowMatchModeSelected: function isRowMatchModeSelected(matchMode) {
      return this.filters[this.field].matchMode === matchMode;
    },
    onOperatorChange: function onOperatorChange(value) {
      var _filters = _objectSpread$5({}, this.filters);
      _filters[this.field].operator = value;
      this.$emit("filter-change", _filters);
      this.$emit("operator-change", {
        field: this.field,
        operator: value
      });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    onMenuMatchModeChange: function onMenuMatchModeChange(value, index2) {
      var _filters = _objectSpread$5({}, this.filters);
      _filters[this.field].constraints[index2].matchMode = value;
      this.$emit("matchmode-change", {
        field: this.field,
        matchMode: value,
        index: index2
      });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    addConstraint: function addConstraint() {
      var _filters = _objectSpread$5({}, this.filters);
      var newConstraint = {
        value: null,
        matchMode: this.defaultMatchMode
      };
      _filters[this.field].constraints.push(newConstraint);
      this.$emit("constraint-add", {
        field: this.field,
        constraing: newConstraint
      });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    removeConstraint: function removeConstraint(index2) {
      var _filters = _objectSpread$5({}, this.filters);
      var removedConstraint = _filters[this.field].constraints.splice(index2, 1);
      this.$emit("constraint-remove", {
        field: this.field,
        constraing: removedConstraint
      });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    filterCallback: function filterCallback() {
      this.$emit("filter-apply");
    },
    findNextItem: function findNextItem(item2) {
      var nextItem = item2.nextElementSibling;
      if (nextItem)
        return DomHandler.getAttribute(nextItem, "data-pc-section") === "filterseparator" ? this.findNextItem(nextItem) : nextItem;
      else
        return item2.parentElement.firstElementChild;
    },
    findPrevItem: function findPrevItem(item2) {
      var prevItem = item2.previousElementSibling;
      if (prevItem)
        return DomHandler.getAttribute(prevItem, "data-pc-section") === "filterseparator" ? this.findPrevItem(prevItem) : prevItem;
      else
        return item2.parentElement.lastElementChild;
    },
    hide: function hide3() {
      this.overlayVisible = false;
      DomHandler.focus(this.$refs.icon);
    },
    onContentClick: function onContentClick(event2) {
      this.selfClick = true;
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.overlay
      });
    },
    onContentMouseDown: function onContentMouseDown() {
      this.selfClick = true;
    },
    onOverlayEnter: function onOverlayEnter2(el) {
      var _this = this;
      if (this.filterMenuStyle) {
        DomHandler.applyStyle(this.overlay, this.filterMenuStyle);
      }
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      DomHandler.addStyles(el, {
        position: "absolute",
        top: "0",
        left: "0"
      });
      DomHandler.absolutePosition(this.overlay, this.$refs.icon);
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.overlayEventListener = function(e) {
        if (!_this.isOutsideClicked(e.target)) {
          _this.selfClick = true;
        }
      };
      OverlayEventBus.on("overlay-click", this.overlayEventListener);
    },
    onOverlayAfterEnter: function onOverlayAfterEnter2() {
      var _this$overlay;
      (_this$overlay = this.overlay) === null || _this$overlay === void 0 || (_this$overlay = _this$overlay.$focustrap) === null || _this$overlay === void 0 || _this$overlay.autoFocus();
    },
    onOverlayLeave: function onOverlayLeave2() {
      this.onOverlayHide();
    },
    onOverlayAfterLeave: function onOverlayAfterLeave2(el) {
      ZIndexUtils.clear(el);
    },
    onOverlayHide: function onOverlayHide() {
      this.unbindOutsideClickListener();
      this.unbindResizeListener();
      this.unbindScrollListener();
      this.overlay = null;
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    overlayRef: function overlayRef2(el) {
      this.overlay = el;
    },
    isOutsideClicked: function isOutsideClicked(target) {
      return !this.isTargetClicked(target) && this.overlay && !(this.overlay.isSameNode(target) || this.overlay.contains(target));
    },
    isTargetClicked: function isTargetClicked(target) {
      return this.$refs.icon && (this.$refs.icon.isSameNode(target) || this.$refs.icon.contains(target));
    },
    bindOutsideClickListener: function bindOutsideClickListener3() {
      var _this2 = this;
      if (!this.outsideClickListener) {
        this.outsideClickListener = function(event2) {
          if (_this2.overlayVisible && !_this2.selfClick && _this2.isOutsideClicked(event2.target)) {
            _this2.overlayVisible = false;
          }
          _this2.selfClick = false;
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener: function unbindOutsideClickListener3() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
        this.selfClick = false;
      }
    },
    bindScrollListener: function bindScrollListener2() {
      var _this3 = this;
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.icon, function() {
          if (_this3.overlayVisible) {
            _this3.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function unbindScrollListener2() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener: function bindResizeListener4() {
      var _this4 = this;
      if (!this.resizeListener) {
        this.resizeListener = function() {
          if (_this4.overlayVisible && !DomHandler.isTouchDevice()) {
            _this4.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener: function unbindResizeListener4() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    }
  },
  computed: {
    showMenuButton: function showMenuButton() {
      return this.showMenu && (this.display === "row" ? this.type !== "boolean" : true);
    },
    overlayId: function overlayId() {
      return UniqueComponentId();
    },
    matchModes: function matchModes() {
      var _this5 = this;
      return this.matchModeOptions || this.$primevue.config.filterMatchModeOptions[this.type].map(function(key) {
        return {
          label: _this5.$primevue.config.locale[key],
          value: key
        };
      });
    },
    isShowMatchModes: function isShowMatchModes() {
      return this.type !== "boolean" && this.showMatchModes && this.matchModes;
    },
    operatorOptions: function operatorOptions() {
      return [{
        label: this.$primevue.config.locale.matchAll,
        value: FilterOperator.AND
      }, {
        label: this.$primevue.config.locale.matchAny,
        value: FilterOperator.OR
      }];
    },
    noFilterLabel: function noFilterLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.noFilter : void 0;
    },
    isShowOperator: function isShowOperator() {
      return this.showOperator && this.filters[this.field].operator;
    },
    operator: function operator() {
      return this.filters[this.field].operator;
    },
    fieldConstraints: function fieldConstraints() {
      return this.filters[this.field].constraints || [this.filters[this.field]];
    },
    showRemoveIcon: function showRemoveIcon() {
      return this.fieldConstraints.length > 1;
    },
    removeRuleButtonLabel: function removeRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.removeRule : void 0;
    },
    addRuleButtonLabel: function addRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.addRule : void 0;
    },
    isShowAddConstraint: function isShowAddConstraint() {
      return this.showAddButton && this.filters[this.field].operator && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints;
    },
    clearButtonLabel: function clearButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.clear : void 0;
    },
    applyButtonLabel: function applyButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.apply : void 0;
    },
    filterMenuButtonAriaLabel: function filterMenuButtonAriaLabel() {
      return this.$primevue.config.locale ? this.overlayVisible ? this.$primevue.config.locale.showFilterMenu : this.$primevue.config.locale.hideFilterMenu : void 0;
    },
    filterOperatorAriaLabel: function filterOperatorAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterOperator : void 0;
    },
    filterConstraintAriaLabel: function filterConstraintAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterConstraint : void 0;
    },
    ptmHeaderFilterClearParams: function ptmHeaderFilterClearParams() {
      return {
        context: {
          hidden: this.hasRowFilter()
        }
      };
    },
    ptmFilterMenuParams: function ptmFilterMenuParams() {
      return {
        context: {
          overlayVisible: this.overlayVisible,
          active: this.hasFilter()
        }
      };
    }
  },
  components: {
    CFDropdown: script$u,
    CFButton: script$F,
    Portal: script$w,
    FilterSlashIcon: script$j,
    FilterIcon: script$y,
    TrashIcon: script$h,
    PlusIcon: script$i
  },
  directives: {
    focustrap: FocusTrap
  }
};
function _typeof$4(o) {
  "@babel/helpers - typeof";
  return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$4(o);
}
function ownKeys$4(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$4(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$4(Object(t), true).forEach(function(r2) {
      _defineProperty$4(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$4(obj, key, value) {
  key = _toPropertyKey$4(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$4(t) {
  var i = _toPrimitive$4(t, "string");
  return "symbol" == _typeof$4(i) ? i : String(i);
}
function _toPrimitive$4(t, r) {
  if ("object" != _typeof$4(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$4(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$1$1 = ["aria-label", "aria-expanded", "aria-controls"];
var _hoisted_2$4 = ["id", "aria-modal"];
var _hoisted_3$3 = ["onClick", "onKeydown", "tabindex"];
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CFDropdown = resolveComponent("CFDropdown");
  var _component_CFButton = resolveComponent("CFButton");
  var _component_Portal = resolveComponent("Portal");
  var _directive_focustrap = resolveDirective("focustrap");
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("columnFilter")
  }, $options.getColumnPT("columnFilter")), [$props.display === "row" ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    "class": _ctx.cx("filterInput")
  }, _objectSpread$4(_objectSpread$4({}, $props.filterInputProps), $options.getColumnPT("filterInput"))), [(openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
    field: $props.field,
    filterModel: $props.filters[$props.field],
    filterCallback: $options.filterCallback
  }, null, 8, ["field", "filterModel", "filterCallback"]))], 16)) : createCommentVNode("", true), $options.showMenuButton ? (openBlock(), createElementBlock("button", mergeProps({
    key: 1,
    ref: "icon",
    type: "button",
    "aria-label": $options.filterMenuButtonAriaLabel,
    "aria-haspopup": "true",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.overlayId,
    "class": _ctx.cx("filterMenuButton"),
    onClick: _cache[0] || (_cache[0] = function($event) {
      return $options.toggleMenu($event);
    }),
    onKeydown: _cache[1] || (_cache[1] = function($event) {
      return $options.onToggleButtonKeyDown($event);
    })
  }, $options.getColumnPT("filterMenuButton", $options.ptmFilterMenuParams)), [(openBlock(), createBlock(resolveDynamicComponent($props.filterIconTemplate || "FilterIcon"), normalizeProps(guardReactiveProps($options.getColumnPT("filterMenuIcon"))), null, 16))], 16, _hoisted_1$1$1)) : createCommentVNode("", true), $props.showClearButton && $props.display === "row" ? (openBlock(), createElementBlock("button", mergeProps({
    key: 2,
    "class": _ctx.cx("headerFilterClearButton"),
    type: "button",
    onClick: _cache[2] || (_cache[2] = function($event) {
      return $options.clearFilter();
    })
  }, $options.getColumnPT("headerFilterClearButton", $options.ptmHeaderFilterClearParams)), [(openBlock(), createBlock(resolveDynamicComponent($props.filterClearIconTemplate || "FilterSlashIcon"), normalizeProps(guardReactiveProps($options.getColumnPT("filterClearIcon"))), null, 16))], 16)) : createCommentVNode("", true), createVNode(_component_Portal, null, {
    "default": withCtx(function() {
      return [createVNode(Transition, mergeProps({
        name: "p-connected-overlay",
        onEnter: $options.onOverlayEnter,
        onAfterEnter: $options.onOverlayAfterEnter,
        onLeave: $options.onOverlayLeave,
        onAfterLeave: $options.onOverlayAfterLeave
      }, $options.getColumnPT("transition")), {
        "default": withCtx(function() {
          return [$data.overlayVisible ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            ref: $options.overlayRef,
            id: $options.overlayId,
            "aria-modal": $data.overlayVisible,
            role: "dialog",
            "class": [_ctx.cx("filterOverlay"), $props.filterMenuClass],
            onKeydown: _cache[10] || (_cache[10] = withKeys(function() {
              return $options.hide && $options.hide.apply($options, arguments);
            }, ["escape"])),
            onClick: _cache[11] || (_cache[11] = function() {
              return $options.onContentClick && $options.onContentClick.apply($options, arguments);
            }),
            onMousedown: _cache[12] || (_cache[12] = function() {
              return $options.onContentMouseDown && $options.onContentMouseDown.apply($options, arguments);
            })
          }, $options.getColumnPT("filterOverlay")), [(openBlock(), createBlock(resolveDynamicComponent($props.filterHeaderTemplate), {
            field: $props.field,
            filterModel: $props.filters[$props.field],
            filterCallback: $options.filterCallback
          }, null, 8, ["field", "filterModel", "filterCallback"])), $props.display === "row" ? (openBlock(), createElementBlock("ul", mergeProps({
            key: 0,
            "class": _ctx.cx("filterRowItems")
          }, $options.getColumnPT("filterRowItems")), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.matchModes, function(matchMode, i) {
            return openBlock(), createElementBlock("li", mergeProps({
              key: matchMode.label,
              "class": _ctx.cx("filterRowItem", {
                matchMode
              }),
              onClick: function onClick3($event) {
                return $options.onRowMatchModeChange(matchMode.value);
              },
              onKeydown: [_cache[3] || (_cache[3] = function($event) {
                return $options.onRowMatchModeKeyDown($event);
              }), withKeys(withModifiers(function($event) {
                return $options.onRowMatchModeChange(matchMode.value);
              }, ["prevent"]), ["enter"])],
              tabindex: i === 0 ? "0" : null
            }, $options.getColumnPT("filterRowItem", $options.ptmFilterRowItemOptions(matchMode))), toDisplayString(matchMode.label), 17, _hoisted_3$3);
          }), 128)), createBaseVNode("li", mergeProps({
            "class": _ctx.cx("filterSeparator")
          }, $options.getColumnPT("filterSeparator")), null, 16), createBaseVNode("li", mergeProps({
            "class": _ctx.cx("filterRowItem"),
            onClick: _cache[4] || (_cache[4] = function($event) {
              return $options.clearFilter();
            }),
            onKeydown: [_cache[5] || (_cache[5] = function($event) {
              return $options.onRowMatchModeKeyDown($event);
            }), _cache[6] || (_cache[6] = withKeys(function($event) {
              return _ctx.onRowClearItemClick();
            }, ["enter"]))]
          }, $options.getColumnPT("filterRowItem")), toDisplayString($options.noFilterLabel), 17)], 16)) : (openBlock(), createElementBlock(Fragment, {
            key: 1
          }, [$options.isShowOperator ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            "class": _ctx.cx("filterOperator")
          }, $options.getColumnPT("filterOperator")), [createVNode(_component_CFDropdown, {
            options: $options.operatorOptions,
            modelValue: $options.operator,
            "aria-label": $options.filterOperatorAriaLabel,
            "class": normalizeClass(_ctx.cx("filterOperatorDropdown")),
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": _cache[7] || (_cache[7] = function($event) {
              return $options.onOperatorChange($event);
            }),
            unstyled: _ctx.unstyled,
            pt: $options.getColumnPT("filterOperatorDropdown"),
            "data-pc-section": "filteroperatordropdown"
          }, null, 8, ["options", "modelValue", "aria-label", "class", "unstyled", "pt"])], 16)) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
            "class": _ctx.cx("filterConstraints")
          }, $options.getColumnPT("filterConstraints")), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.fieldConstraints, function(fieldConstraint, i) {
            return openBlock(), createElementBlock("div", mergeProps({
              key: i,
              "class": _ctx.cx("filterConstraint")
            }, $options.getColumnPT("filterConstraint")), [$options.isShowMatchModes ? (openBlock(), createBlock(_component_CFDropdown, {
              key: 0,
              options: $options.matchModes,
              modelValue: fieldConstraint.matchMode,
              "class": normalizeClass(_ctx.cx("filterMatchModeDropdown")),
              optionLabel: "label",
              optionValue: "value",
              "aria-label": $options.filterConstraintAriaLabel,
              "onUpdate:modelValue": function onUpdateModelValue($event) {
                return $options.onMenuMatchModeChange($event, i);
              },
              unstyled: _ctx.unstyled,
              pt: $options.getColumnPT("filterMatchModeDropdown"),
              "data-pc-section": "filtermatchmodedropdown"
            }, null, 8, ["options", "modelValue", "class", "aria-label", "onUpdate:modelValue", "unstyled", "pt"])) : createCommentVNode("", true), $props.display === "menu" ? (openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
              key: 1,
              field: $props.field,
              filterModel: fieldConstraint,
              filterCallback: $options.filterCallback,
              applyFilter: $options.applyFilter
            }, null, 8, ["field", "filterModel", "filterCallback", "applyFilter"])) : createCommentVNode("", true), createBaseVNode("div", normalizeProps(guardReactiveProps($options.getColumnPT("filterRemove"))), [$options.showRemoveIcon ? (openBlock(), createBlock(_component_CFButton, {
              key: 0,
              type: "button",
              "class": normalizeClass(_ctx.cx("filterRemoveButton")),
              onClick: function onClick3($event) {
                return $options.removeConstraint(i);
              },
              label: $options.removeRuleButtonLabel,
              unstyled: _ctx.unstyled,
              text: "",
              severity: "danger",
              size: "small",
              pt: $options.getColumnPT("filterRemoveButton"),
              "data-pc-section": "filterremovebutton"
            }, {
              icon: withCtx(function(iconProps) {
                return [(openBlock(), createBlock(resolveDynamicComponent($props.filterRemoveIconTemplate || "TrashIcon"), mergeProps({
                  "class": iconProps["class"]
                }, $options.getColumnPT("filterRemoveButton")["icon"]), null, 16, ["class"]))];
              }),
              _: 2
            }, 1032, ["class", "onClick", "label", "unstyled", "pt"])) : createCommentVNode("", true)], 16)], 16);
          }), 128))], 16), $options.isShowAddConstraint ? (openBlock(), createElementBlock("div", mergeProps({
            key: 1,
            "class": _ctx.cx("filterAddRule")
          }, $options.getColumnPT("filterAddRule")), [createVNode(_component_CFButton, {
            type: "button",
            label: $options.addRuleButtonLabel,
            iconPos: "left",
            "class": normalizeClass(_ctx.cx("filterAddRuleButton")),
            onClick: _cache[8] || (_cache[8] = function($event) {
              return $options.addConstraint();
            }),
            unstyled: _ctx.unstyled,
            text: "",
            severity: "info",
            size: "small",
            pt: $options.getColumnPT("filterAddRuleButton"),
            "data-pc-section": "filteraddrulebutton"
          }, {
            icon: withCtx(function(iconProps) {
              return [(openBlock(), createBlock(resolveDynamicComponent($props.filterAddIconTemplate || "PlusIcon"), mergeProps({
                "class": iconProps["class"]
              }, $options.getColumnPT("filterAddRuleButton")["icon"]), null, 16, ["class"]))];
            }),
            _: 1
          }, 8, ["label", "class", "unstyled", "pt"])], 16)) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
            "class": _ctx.cx("filterButtonbar")
          }, $options.getColumnPT("filterButtonbar")), [!$props.filterClearTemplate && $props.showClearButton ? (openBlock(), createBlock(_component_CFButton, {
            key: 0,
            type: "button",
            "class": normalizeClass(_ctx.cx("filterClearButton")),
            label: $options.clearButtonLabel,
            onClick: $options.clearFilter,
            unstyled: _ctx.unstyled,
            size: "small",
            outlined: "",
            pt: $options.getColumnPT("filterClearButton"),
            "data-pc-section": "filterclearbutton"
          }, null, 8, ["class", "label", "onClick", "unstyled", "pt"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterClearTemplate), {
            key: 1,
            field: $props.field,
            filterModel: $props.filters[$props.field],
            filterCallback: $options.clearFilter
          }, null, 8, ["field", "filterModel", "filterCallback"])), $props.showApplyButton ? (openBlock(), createElementBlock(Fragment, {
            key: 2
          }, [!$props.filterApplyTemplate ? (openBlock(), createBlock(_component_CFButton, {
            key: 0,
            type: "button",
            "class": normalizeClass(_ctx.cx("filterApplyButton")),
            label: $options.applyButtonLabel,
            onClick: _cache[9] || (_cache[9] = function($event) {
              return $options.applyFilter();
            }),
            unstyled: _ctx.unstyled,
            size: "small",
            pt: $options.getColumnPT("filterApplyButton"),
            "data-pc-section": "filterapplybutton"
          }, null, 8, ["class", "label", "unstyled", "pt"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterApplyTemplate), {
            key: 1,
            field: $props.field,
            filterModel: $props.filters[$props.field],
            filterCallback: $options.applyFilter
          }, null, 8, ["field", "filterModel", "filterCallback"]))], 64)) : createCommentVNode("", true)], 16)], 64)), (openBlock(), createBlock(resolveDynamicComponent($props.filterFooterTemplate), {
            field: $props.field,
            filterModel: $props.filters[$props.field],
            filterCallback: $options.filterCallback
          }, null, 8, ["field", "filterModel", "filterCallback"]))], 16, _hoisted_2$4)), [[_directive_focustrap]]) : createCommentVNode("", true)];
        }),
        _: 1
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 1
  })], 16);
}
script$4.render = render$4;
var script$3 = {
  name: "HeaderCheckbox",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["change"],
  props: {
    checked: null,
    disabled: null,
    column: null,
    headerCheckboxIconTemplate: {
      type: Function,
      "default": null
    }
  },
  methods: {
    getColumnPT: function getColumnPT7(key) {
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp6() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onChange: function onChange8(event2) {
      this.$emit("change", {
        originalEvent: event2,
        checked: !this.checked
      });
    }
  },
  computed: {
    headerCheckboxAriaLabel: function headerCheckboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectAll : this.$primevue.config.locale.aria.unselectAll : void 0;
    }
  },
  components: {
    CheckIcon: script$A,
    Checkbox: script$l
  }
};
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CheckIcon = resolveComponent("CheckIcon");
  var _component_Checkbox = resolveComponent("Checkbox");
  return openBlock(), createBlock(_component_Checkbox, {
    modelValue: $props.checked,
    binary: true,
    disabled: $props.disabled,
    "aria-label": $options.headerCheckboxAriaLabel,
    onChange: $options.onChange,
    pt: $options.getColumnPT("headerCheckbox")
  }, {
    icon: withCtx(function(slotProps) {
      return [$props.headerCheckboxIconTemplate ? (openBlock(), createBlock(resolveDynamicComponent($props.headerCheckboxIconTemplate), {
        key: 0,
        checked: slotProps.checked,
        "class": normalizeClass(slotProps["class"])
      }, null, 8, ["checked", "class"])) : !$props.headerCheckboxIconTemplate && slotProps.checked ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
        key: 1,
        "class": slotProps["class"]
      }, $options.getColumnPT("headerCheckbox.icon")), null, 16, ["class"])) : createCommentVNode("", true)];
    }),
    _: 1
  }, 8, ["modelValue", "disabled", "aria-label", "onChange", "pt"]);
}
script$3.render = render$3;
var script$2 = {
  name: "HeaderCell",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["column-click", "column-mousedown", "column-dragstart", "column-dragover", "column-dragleave", "column-drop", "column-resizestart", "checkbox-change", "filter-change", "filter-apply", "operator-change", "matchmode-change", "constraint-add", "constraint-remove", "filter-clear", "apply-click"],
  props: {
    column: {
      type: Object,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    },
    resizableColumns: {
      type: Boolean,
      "default": false
    },
    groupRowsBy: {
      type: [Array, String, Function],
      "default": null
    },
    sortMode: {
      type: String,
      "default": "single"
    },
    groupRowSortField: {
      type: [String, Function],
      "default": null
    },
    sortField: {
      type: [String, Function],
      "default": null
    },
    sortOrder: {
      type: Number,
      "default": null
    },
    multiSortMeta: {
      type: Array,
      "default": null
    },
    allRowsSelected: {
      type: Boolean,
      "default": false
    },
    empty: {
      type: Boolean,
      "default": false
    },
    filterDisplay: {
      type: String,
      "default": null
    },
    filters: {
      type: Object,
      "default": null
    },
    filtersStore: {
      type: Object,
      "default": null
    },
    filterColumn: {
      type: Boolean,
      "default": false
    },
    reorderableColumns: {
      type: Boolean,
      "default": false
    },
    filterInputProps: {
      type: null,
      "default": null
    }
  },
  data: function data14() {
    return {
      styleObject: {}
    };
  },
  mounted: function mounted13() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated: function updated8() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp: function columnProp5(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPT: function getColumnPT8(key) {
      var _this$$parentInstance, _this$$parentInstance2;
      var columnMetaData = {
        props: this.column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: this.index,
          sortable: this.columnProp("sortable") === "" || this.columnProp("sortable"),
          sorted: this.isColumnSorted(),
          resizable: this.resizableColumns,
          size: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.size,
          showGridlines: ((_this$$parentInstance2 = this.$parentInstance) === null || _this$$parentInstance2 === void 0 || (_this$$parentInstance2 = _this$$parentInstance2.$parentInstance) === null || _this$$parentInstance2 === void 0 ? void 0 : _this$$parentInstance2.showGridlines) || false
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(), key, columnMetaData));
    },
    getColumnProp: function getColumnProp7() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onClick: function onClick2(event2) {
      this.$emit("column-click", {
        originalEvent: event2,
        column: this.column
      });
    },
    onKeyDown: function onKeyDown4(event2) {
      if ((event2.code === "Enter" || event2.code === "NumpadEnter" || event2.code === "Space") && event2.currentTarget.nodeName === "TH" && DomHandler.getAttribute(event2.currentTarget, "data-p-sortable-column")) {
        this.$emit("column-click", {
          originalEvent: event2,
          column: this.column
        });
        event2.preventDefault();
      }
    },
    onMouseDown: function onMouseDown2(event2) {
      this.$emit("column-mousedown", {
        originalEvent: event2,
        column: this.column
      });
    },
    onDragStart: function onDragStart(event2) {
      this.$emit("column-dragstart", {
        originalEvent: event2,
        column: this.column
      });
    },
    onDragOver: function onDragOver(event2) {
      this.$emit("column-dragover", {
        originalEvent: event2,
        column: this.column
      });
    },
    onDragLeave: function onDragLeave(event2) {
      this.$emit("column-dragleave", {
        originalEvent: event2,
        column: this.column
      });
    },
    onDrop: function onDrop(event2) {
      this.$emit("column-drop", {
        originalEvent: event2,
        column: this.column
      });
    },
    onResizeStart: function onResizeStart(event2) {
      this.$emit("column-resizestart", event2);
    },
    getMultiSortMetaIndex: function getMultiSortMetaIndex() {
      var _this = this;
      return this.multiSortMeta.findIndex(function(meta) {
        return meta.field === _this.columnProp("field") || meta.field === _this.columnProp("sortField");
      });
    },
    getBadgeValue: function getBadgeValue() {
      var index2 = this.getMultiSortMetaIndex();
      return this.groupRowsBy && this.groupRowsBy === this.groupRowSortField && index2 > -1 ? index2 : index2 + 1;
    },
    isMultiSorted: function isMultiSorted() {
      return this.sortMode === "multiple" && this.columnProp("sortable") && this.getMultiSortMetaIndex() > -1;
    },
    isColumnSorted: function isColumnSorted() {
      return this.sortMode === "single" ? this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField")) : this.isMultiSorted();
    },
    updateStickyPosition: function updateStickyPosition3() {
      if (this.columnProp("frozen")) {
        var align = this.columnProp("alignFrozen");
        if (align === "right") {
          var right = 0;
          var next = DomHandler.getNextElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          var left = 0;
          var prev = DomHandler.getPreviousElementSibling(this.$el, '[data-p-frozen-column="true"]');
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
        var filterRow = this.$el.parentElement.nextElementSibling;
        if (filterRow) {
          var index2 = DomHandler.index(this.$el);
          if (filterRow.children[index2]) {
            filterRow.children[index2].style.left = this.styleObject.left;
            filterRow.children[index2].style.right = this.styleObject.right;
          }
        }
      }
    },
    onHeaderCheckboxChange: function onHeaderCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    }
  },
  computed: {
    containerClass: function containerClass4() {
      return [this.cx("headerCell"), this.filterColumn ? this.columnProp("filterHeaderClass") : this.columnProp("headerClass"), this.columnProp("class")];
    },
    containerStyle: function containerStyle3() {
      var headerStyle = this.filterColumn ? this.columnProp("filterHeaderStyle") : this.columnProp("headerStyle");
      var columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, headerStyle, this.styleObject] : [columnStyle, headerStyle];
    },
    sortState: function sortState() {
      var sorted2 = false;
      var sortOrder2 = null;
      if (this.sortMode === "single") {
        sorted2 = this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField"));
        sortOrder2 = sorted2 ? this.sortOrder : 0;
      } else if (this.sortMode === "multiple") {
        var metaIndex = this.getMultiSortMetaIndex();
        if (metaIndex > -1) {
          sorted2 = true;
          sortOrder2 = this.multiSortMeta[metaIndex].order;
        }
      }
      return {
        sorted: sorted2,
        sortOrder: sortOrder2
      };
    },
    sortableColumnIcon: function sortableColumnIcon() {
      var _this$sortState = this.sortState, sorted2 = _this$sortState.sorted, sortOrder2 = _this$sortState.sortOrder;
      if (!sorted2)
        return script$g;
      else if (sorted2 && sortOrder2 > 0)
        return script$e;
      else if (sorted2 && sortOrder2 < 0)
        return script$f;
      return null;
    },
    ariaSort: function ariaSort() {
      if (this.columnProp("sortable")) {
        var _this$sortState2 = this.sortState, sorted2 = _this$sortState2.sorted, sortOrder2 = _this$sortState2.sortOrder;
        if (sorted2 && sortOrder2 < 0)
          return "descending";
        else if (sorted2 && sortOrder2 > 0)
          return "ascending";
        else
          return "none";
      } else {
        return null;
      }
    }
  },
  components: {
    DTHeaderCheckbox: script$3,
    DTColumnFilter: script$4,
    SortAltIcon: script$g,
    SortAmountUpAltIcon: script$e,
    SortAmountDownIcon: script$f
  }
};
function _typeof$3(o) {
  "@babel/helpers - typeof";
  return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$3(o);
}
function ownKeys$3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty$3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$3(obj, key, value) {
  key = _toPropertyKey$3(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$3(t) {
  var i = _toPrimitive$3(t, "string");
  return "symbol" == _typeof$3(i) ? i : String(i);
}
function _toPrimitive$3(t, r) {
  if ("object" != _typeof$3(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$3(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var _hoisted_1$5 = ["tabindex", "colspan", "rowspan", "aria-sort", "data-p-sortable-column", "data-p-resizable-column", "data-p-highlight", "data-p-filter-column", "data-p-frozen-column", "data-p-reorderable-column"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  var _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("th", mergeProps({
    style: $options.containerStyle,
    "class": $options.containerClass,
    tabindex: $options.columnProp("sortable") ? "0" : null,
    role: "columnheader",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan"),
    "aria-sort": $options.ariaSort,
    onClick: _cache[8] || (_cache[8] = function() {
      return $options.onClick && $options.onClick.apply($options, arguments);
    }),
    onKeydown: _cache[9] || (_cache[9] = function() {
      return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
    }),
    onMousedown: _cache[10] || (_cache[10] = function() {
      return $options.onMouseDown && $options.onMouseDown.apply($options, arguments);
    }),
    onDragstart: _cache[11] || (_cache[11] = function() {
      return $options.onDragStart && $options.onDragStart.apply($options, arguments);
    }),
    onDragover: _cache[12] || (_cache[12] = function() {
      return $options.onDragOver && $options.onDragOver.apply($options, arguments);
    }),
    onDragleave: _cache[13] || (_cache[13] = function() {
      return $options.onDragLeave && $options.onDragLeave.apply($options, arguments);
    }),
    onDrop: _cache[14] || (_cache[14] = function() {
      return $options.onDrop && $options.onDrop.apply($options, arguments);
    })
  }, _objectSpread$3(_objectSpread$3({}, $options.getColumnPT("root")), $options.getColumnPT("headerCell")), {
    "data-p-sortable-column": $options.columnProp("sortable"),
    "data-p-resizable-column": $props.resizableColumns,
    "data-p-highlight": $options.isColumnSorted(),
    "data-p-filter-column": $props.filterColumn,
    "data-p-frozen-column": $options.columnProp("frozen"),
    "data-p-reorderable-column": $props.reorderableColumns
  }), [$props.resizableColumns && !$options.columnProp("frozen") ? (openBlock(), createElementBlock("span", mergeProps({
    key: 0,
    "class": _ctx.cx("columnResizer"),
    onMousedown: _cache[0] || (_cache[0] = function() {
      return $options.onResizeStart && $options.onResizeStart.apply($options, arguments);
    })
  }, $options.getColumnPT("columnResizer")), null, 16)) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("headerContent")
  }, $options.getColumnPT("headerContent")), [$props.column.children && $props.column.children.header ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.header), {
    key: 0,
    column: $props.column
  }, null, 8, ["column"])) : createCommentVNode("", true), $options.columnProp("header") ? (openBlock(), createElementBlock("span", mergeProps({
    key: 1,
    "class": _ctx.cx("headerTitle")
  }, $options.getColumnPT("headerTitle")), toDisplayString($options.columnProp("header")), 17)) : createCommentVNode("", true), $options.columnProp("sortable") ? (openBlock(), createElementBlock("span", normalizeProps(mergeProps({
    key: 2
  }, $options.getColumnPT("sort"))), [(openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.sorticon || $options.sortableColumnIcon), mergeProps({
    sorted: $options.sortState.sorted,
    sortOrder: $options.sortState.sortOrder,
    "class": _ctx.cx("sortIcon")
  }, $options.getColumnPT("sorticon"), {
    "data-pc-section": "sorticon"
  }), null, 16, ["sorted", "sortOrder", "class"]))], 16)) : createCommentVNode("", true), $options.isMultiSorted() ? (openBlock(), createElementBlock("span", mergeProps({
    key: 3,
    "class": _ctx.cx("sortBadge")
  }, $options.getColumnPT("sortBadge")), toDisplayString($options.getBadgeValue()), 17)) : createCommentVNode("", true), $options.columnProp("selectionMode") === "multiple" && $props.filterDisplay !== "row" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
    key: 4,
    checked: $props.allRowsSelected,
    onChange: $options.onHeaderCheckboxChange,
    disabled: $props.empty,
    headerCheckboxIconTemplate: $props.column.children && $props.column.children.headercheckboxicon,
    column: $props.column,
    unstyled: _ctx.unstyled,
    pt: _ctx.pt
  }, null, 8, ["checked", "onChange", "disabled", "headerCheckboxIconTemplate", "column", "unstyled", "pt"])) : createCommentVNode("", true), $props.filterDisplay === "menu" && $props.column.children && $props.column.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
    key: 5,
    field: $options.columnProp("filterField") || $options.columnProp("field"),
    type: $options.columnProp("dataType"),
    display: "menu",
    showMenu: $options.columnProp("showFilterMenu"),
    filterElement: $props.column.children && $props.column.children.filter,
    filterHeaderTemplate: $props.column.children && $props.column.children.filterheader,
    filterFooterTemplate: $props.column.children && $props.column.children.filterfooter,
    filterClearTemplate: $props.column.children && $props.column.children.filterclear,
    filterApplyTemplate: $props.column.children && $props.column.children.filterapply,
    filterIconTemplate: $props.column.children && $props.column.children.filtericon,
    filterAddIconTemplate: $props.column.children && $props.column.children.filteraddicon,
    filterRemoveIconTemplate: $props.column.children && $props.column.children.filterremoveicon,
    filterClearIconTemplate: $props.column.children && $props.column.children.filterclearicon,
    filters: $props.filters,
    filtersStore: $props.filtersStore,
    filterInputProps: $props.filterInputProps,
    onFilterChange: _cache[1] || (_cache[1] = function($event) {
      return _ctx.$emit("filter-change", $event);
    }),
    onFilterApply: _cache[2] || (_cache[2] = function($event) {
      return _ctx.$emit("filter-apply");
    }),
    filterMenuStyle: $options.columnProp("filterMenuStyle"),
    filterMenuClass: $options.columnProp("filterMenuClass"),
    showOperator: $options.columnProp("showFilterOperator"),
    showClearButton: $options.columnProp("showClearButton"),
    showApplyButton: $options.columnProp("showApplyButton"),
    showMatchModes: $options.columnProp("showFilterMatchModes"),
    showAddButton: $options.columnProp("showAddButton"),
    matchModeOptions: $options.columnProp("filterMatchModeOptions"),
    maxConstraints: $options.columnProp("maxConstraints"),
    onOperatorChange: _cache[3] || (_cache[3] = function($event) {
      return _ctx.$emit("operator-change", $event);
    }),
    onMatchmodeChange: _cache[4] || (_cache[4] = function($event) {
      return _ctx.$emit("matchmode-change", $event);
    }),
    onConstraintAdd: _cache[5] || (_cache[5] = function($event) {
      return _ctx.$emit("constraint-add", $event);
    }),
    onConstraintRemove: _cache[6] || (_cache[6] = function($event) {
      return _ctx.$emit("constraint-remove", $event);
    }),
    onApplyClick: _cache[7] || (_cache[7] = function($event) {
      return _ctx.$emit("apply-click", $event);
    }),
    column: $props.column,
    unstyled: _ctx.unstyled,
    pt: _ctx.pt
  }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filterIconTemplate", "filterAddIconTemplate", "filterRemoveIconTemplate", "filterClearIconTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints", "column", "unstyled", "pt"])) : createCommentVNode("", true)], 16)], 16, _hoisted_1$5);
}
script$2.render = render$2;
var script$1$1 = {
  name: "TableHeader",
  hostName: "DataTable",
  "extends": script$N,
  emits: ["column-click", "column-mousedown", "column-dragstart", "column-dragover", "column-dragleave", "column-drop", "column-resizestart", "checkbox-change", "filter-change", "filter-apply", "operator-change", "matchmode-change", "constraint-add", "constraint-remove", "filter-clear", "apply-click"],
  props: {
    columnGroup: {
      type: null,
      "default": null
    },
    columns: {
      type: null,
      "default": null
    },
    rowGroupMode: {
      type: String,
      "default": null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      "default": null
    },
    resizableColumns: {
      type: Boolean,
      "default": false
    },
    allRowsSelected: {
      type: Boolean,
      "default": false
    },
    empty: {
      type: Boolean,
      "default": false
    },
    sortMode: {
      type: String,
      "default": "single"
    },
    groupRowSortField: {
      type: [String, Function],
      "default": null
    },
    sortField: {
      type: [String, Function],
      "default": null
    },
    sortOrder: {
      type: Number,
      "default": null
    },
    multiSortMeta: {
      type: Array,
      "default": null
    },
    filterDisplay: {
      type: String,
      "default": null
    },
    filters: {
      type: Object,
      "default": null
    },
    filtersStore: {
      type: Object,
      "default": null
    },
    reorderableColumns: {
      type: Boolean,
      "default": false
    },
    filterInputProps: {
      type: null,
      "default": null
    }
  },
  provide: function provide14() {
    return {
      $rows: this.d_headerRows,
      $columns: this.d_headerColumns
    };
  },
  data: function data15() {
    return {
      d_headerRows: new _default({
        type: "Row"
      }),
      d_headerColumns: new _default({
        type: "Column"
      })
    };
  },
  beforeUnmount: function beforeUnmount7() {
    this.d_headerRows.clear();
    this.d_headerColumns.clear();
  },
  methods: {
    columnProp: function columnProp6(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getColumnGroupPT: function getColumnGroupPT2(key) {
      var _this$$parentInstance;
      var columnGroupMetaData = {
        props: this.getColumnGroupProps(),
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          type: "header",
          scrollable: (_this$$parentInstance = this.$parentInstance) === null || _this$$parentInstance === void 0 || (_this$$parentInstance = _this$$parentInstance.$parentInstance) === null || _this$$parentInstance === void 0 ? void 0 : _this$$parentInstance.scrollable
        }
      };
      return mergeProps(this.ptm("columnGroup.".concat(key), {
        columnGroup: columnGroupMetaData
      }), this.ptm("columnGroup.".concat(key), columnGroupMetaData), this.ptmo(this.getColumnGroupProps(), key, columnGroupMetaData));
    },
    getColumnGroupProps: function getColumnGroupProps2() {
      return this.columnGroup && this.columnGroup.props && this.columnGroup.props.pt ? this.columnGroup.props.pt : void 0;
    },
    getRowPT: function getRowPT2(row2, key, index2) {
      var rowMetaData = {
        props: row2.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: index2
        }
      };
      return mergeProps(this.ptm("row.".concat(key), {
        row: rowMetaData
      }), this.ptm("row.".concat(key), rowMetaData), this.ptmo(this.getRowProp(row2), key, rowMetaData));
    },
    getRowProp: function getRowProp2(row2) {
      return row2.props && row2.props.pt ? row2.props.pt : void 0;
    },
    getColumnPT: function getColumnPT9(column, key, index2) {
      var columnMetaData = {
        props: column.props,
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: index2
        }
      };
      return mergeProps(this.ptm("column.".concat(key), {
        column: columnMetaData
      }), this.ptm("column.".concat(key), columnMetaData), this.ptmo(this.getColumnProp(column), key, columnMetaData));
    },
    getColumnProp: function getColumnProp8(column) {
      return column.props && column.props.pt ? column.props.pt : void 0;
    },
    getFilterColumnHeaderClass: function getFilterColumnHeaderClass(column) {
      return [this.cx("headerCell", {
        column
      }), this.columnProp(column, "filterHeaderClass"), this.columnProp(column, "class")];
    },
    getFilterColumnHeaderStyle: function getFilterColumnHeaderStyle(column) {
      return [this.columnProp(column, "filterHeaderStyle"), this.columnProp(column, "style")];
    },
    getHeaderRows: function getHeaderRows() {
      var _this$d_headerRows;
      return (_this$d_headerRows = this.d_headerRows) === null || _this$d_headerRows === void 0 ? void 0 : _this$d_headerRows.get(this.columnGroup, this.columnGroup.children);
    },
    getHeaderColumns: function getHeaderColumns(row2) {
      var _this$d_headerColumns;
      return (_this$d_headerColumns = this.d_headerColumns) === null || _this$d_headerColumns === void 0 ? void 0 : _this$d_headerColumns.get(row2, row2.children);
    }
  },
  computed: {
    ptmTHeadOptions: function ptmTHeadOptions() {
      var _this$$parentInstance2;
      return {
        context: {
          scrollable: (_this$$parentInstance2 = this.$parentInstance) === null || _this$$parentInstance2 === void 0 || (_this$$parentInstance2 = _this$$parentInstance2.$parentInstance) === null || _this$$parentInstance2 === void 0 ? void 0 : _this$$parentInstance2.scrollable
        }
      };
    }
  },
  components: {
    DTHeaderCell: script$2,
    DTHeaderCheckbox: script$3,
    DTColumnFilter: script$4
  }
};
function _typeof$2(o) {
  "@babel/helpers - typeof";
  return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$2(o);
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$2(obj, key, value) {
  key = _toPropertyKey$2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == _typeof$2(i) ? i : String(i);
}
function _toPrimitive$2(t, r) {
  if ("object" != _typeof$2(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$2(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DTHeaderCell = resolveComponent("DTHeaderCell");
  var _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  var _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("thead", mergeProps({
    "class": _ctx.cx("thead"),
    style: _ctx.sx("thead"),
    role: "rowgroup"
  }, $props.columnGroup ? _objectSpread$2(_objectSpread$2({}, _ctx.ptm("thead", $options.ptmTHeadOptions)), $options.getColumnGroupPT("root")) : _ctx.ptm("thead", $options.ptmTHeadOptions), {
    "data-pc-section": "thead"
  }), [!$props.columnGroup ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createBaseVNode("tr", mergeProps({
    role: "row"
  }, _ctx.ptm("headerRow")), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, function(col, i) {
    return openBlock(), createElementBlock(Fragment, {
      key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
    }, [!$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createBlock(_component_DTHeaderCell, {
      key: 0,
      column: col,
      index: i,
      onColumnClick: _cache[0] || (_cache[0] = function($event) {
        return _ctx.$emit("column-click", $event);
      }),
      onColumnMousedown: _cache[1] || (_cache[1] = function($event) {
        return _ctx.$emit("column-mousedown", $event);
      }),
      onColumnDragstart: _cache[2] || (_cache[2] = function($event) {
        return _ctx.$emit("column-dragstart", $event);
      }),
      onColumnDragover: _cache[3] || (_cache[3] = function($event) {
        return _ctx.$emit("column-dragover", $event);
      }),
      onColumnDragleave: _cache[4] || (_cache[4] = function($event) {
        return _ctx.$emit("column-dragleave", $event);
      }),
      onColumnDrop: _cache[5] || (_cache[5] = function($event) {
        return _ctx.$emit("column-drop", $event);
      }),
      groupRowsBy: $props.groupRowsBy,
      groupRowSortField: $props.groupRowSortField,
      reorderableColumns: $props.reorderableColumns,
      resizableColumns: $props.resizableColumns,
      onColumnResizestart: _cache[6] || (_cache[6] = function($event) {
        return _ctx.$emit("column-resizestart", $event);
      }),
      sortMode: $props.sortMode,
      sortField: $props.sortField,
      sortOrder: $props.sortOrder,
      multiSortMeta: $props.multiSortMeta,
      allRowsSelected: $props.allRowsSelected,
      empty: $props.empty,
      onCheckboxChange: _cache[7] || (_cache[7] = function($event) {
        return _ctx.$emit("checkbox-change", $event);
      }),
      filters: $props.filters,
      filterDisplay: $props.filterDisplay,
      filtersStore: $props.filtersStore,
      filterInputProps: $props.filterInputProps,
      onFilterChange: _cache[8] || (_cache[8] = function($event) {
        return _ctx.$emit("filter-change", $event);
      }),
      onFilterApply: _cache[9] || (_cache[9] = function($event) {
        return _ctx.$emit("filter-apply");
      }),
      onOperatorChange: _cache[10] || (_cache[10] = function($event) {
        return _ctx.$emit("operator-change", $event);
      }),
      onMatchmodeChange: _cache[11] || (_cache[11] = function($event) {
        return _ctx.$emit("matchmode-change", $event);
      }),
      onConstraintAdd: _cache[12] || (_cache[12] = function($event) {
        return _ctx.$emit("constraint-add", $event);
      }),
      onConstraintRemove: _cache[13] || (_cache[13] = function($event) {
        return _ctx.$emit("constraint-remove", $event);
      }),
      onApplyClick: _cache[14] || (_cache[14] = function($event) {
        return _ctx.$emit("apply-click", $event);
      }),
      unstyled: _ctx.unstyled,
      pt: _ctx.pt
    }, null, 8, ["column", "index", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore", "filterInputProps", "unstyled", "pt"])) : createCommentVNode("", true)], 64);
  }), 128))], 16), $props.filterDisplay === "row" ? (openBlock(), createElementBlock("tr", mergeProps({
    key: 0,
    role: "row"
  }, _ctx.ptm("headerRow")), [(openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, function(col, i) {
    return openBlock(), createElementBlock(Fragment, {
      key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
    }, [!$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createElementBlock("th", mergeProps({
      key: 0,
      style: $options.getFilterColumnHeaderStyle(col),
      "class": $options.getFilterColumnHeaderClass(col)
    }, _objectSpread$2(_objectSpread$2({}, $options.getColumnPT(col, "root", i)), $options.getColumnPT(col, "headerCell", i))), [$options.columnProp(col, "selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
      key: 0,
      checked: $props.allRowsSelected,
      disabled: $props.empty,
      onChange: _cache[15] || (_cache[15] = function($event) {
        return _ctx.$emit("checkbox-change", $event);
      }),
      column: col,
      unstyled: _ctx.unstyled,
      pt: _ctx.pt
    }, null, 8, ["checked", "disabled", "column", "unstyled", "pt"])) : createCommentVNode("", true), col.children && col.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
      key: 1,
      field: $options.columnProp(col, "filterField") || $options.columnProp(col, "field"),
      type: $options.columnProp(col, "dataType"),
      display: "row",
      showMenu: $options.columnProp(col, "showFilterMenu"),
      filterElement: col.children && col.children.filter,
      filterHeaderTemplate: col.children && col.children.filterheader,
      filterFooterTemplate: col.children && col.children.filterfooter,
      filterClearTemplate: col.children && col.children.filterclear,
      filterApplyTemplate: col.children && col.children.filterapply,
      filterIconTemplate: col.children && col.children.filtericon,
      filterAddIconTemplate: col.children && col.children.filteraddicon,
      filterRemoveIconTemplate: col.children && col.children.filterremoveicon,
      filterClearIconTemplate: col.children && col.children.filterclearicon,
      filters: $props.filters,
      filtersStore: $props.filtersStore,
      filterInputProps: $props.filterInputProps,
      onFilterChange: _cache[16] || (_cache[16] = function($event) {
        return _ctx.$emit("filter-change", $event);
      }),
      onFilterApply: _cache[17] || (_cache[17] = function($event) {
        return _ctx.$emit("filter-apply");
      }),
      filterMenuStyle: $options.columnProp(col, "filterMenuStyle"),
      filterMenuClass: $options.columnProp(col, "filterMenuClass"),
      showOperator: $options.columnProp(col, "showFilterOperator"),
      showClearButton: $options.columnProp(col, "showClearButton"),
      showApplyButton: $options.columnProp(col, "showApplyButton"),
      showMatchModes: $options.columnProp(col, "showFilterMatchModes"),
      showAddButton: $options.columnProp(col, "showAddButton"),
      matchModeOptions: $options.columnProp(col, "filterMatchModeOptions"),
      maxConstraints: $options.columnProp(col, "maxConstraints"),
      onOperatorChange: _cache[18] || (_cache[18] = function($event) {
        return _ctx.$emit("operator-change", $event);
      }),
      onMatchmodeChange: _cache[19] || (_cache[19] = function($event) {
        return _ctx.$emit("matchmode-change", $event);
      }),
      onConstraintAdd: _cache[20] || (_cache[20] = function($event) {
        return _ctx.$emit("constraint-add", $event);
      }),
      onConstraintRemove: _cache[21] || (_cache[21] = function($event) {
        return _ctx.$emit("constraint-remove", $event);
      }),
      onApplyClick: _cache[22] || (_cache[22] = function($event) {
        return _ctx.$emit("apply-click", $event);
      }),
      column: col,
      unstyled: _ctx.unstyled,
      pt: _ctx.pt
    }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filterIconTemplate", "filterAddIconTemplate", "filterRemoveIconTemplate", "filterClearIconTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints", "column", "unstyled", "pt"])) : createCommentVNode("", true)], 16)) : createCommentVNode("", true)], 64);
  }), 128))], 16)) : createCommentVNode("", true)], 64)) : (openBlock(true), createElementBlock(Fragment, {
    key: 1
  }, renderList($options.getHeaderRows(), function(row2, i) {
    return openBlock(), createElementBlock("tr", mergeProps({
      key: i,
      role: "row"
    }, _objectSpread$2(_objectSpread$2({}, _ctx.ptm("headerRow")), $options.getRowPT(row2, "root", i))), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.getHeaderColumns(row2), function(col, j) {
      return openBlock(), createElementBlock(Fragment, {
        key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
      }, [!$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) && typeof col.children !== "string" ? (openBlock(), createBlock(_component_DTHeaderCell, {
        key: 0,
        column: col,
        onColumnClick: _cache[23] || (_cache[23] = function($event) {
          return _ctx.$emit("column-click", $event);
        }),
        onColumnMousedown: _cache[24] || (_cache[24] = function($event) {
          return _ctx.$emit("column-mousedown", $event);
        }),
        groupRowsBy: $props.groupRowsBy,
        groupRowSortField: $props.groupRowSortField,
        sortMode: $props.sortMode,
        sortField: $props.sortField,
        sortOrder: $props.sortOrder,
        multiSortMeta: $props.multiSortMeta,
        allRowsSelected: $props.allRowsSelected,
        empty: $props.empty,
        onCheckboxChange: _cache[25] || (_cache[25] = function($event) {
          return _ctx.$emit("checkbox-change", $event);
        }),
        filters: $props.filters,
        filterDisplay: $props.filterDisplay,
        filtersStore: $props.filtersStore,
        onFilterChange: _cache[26] || (_cache[26] = function($event) {
          return _ctx.$emit("filter-change", $event);
        }),
        onFilterApply: _cache[27] || (_cache[27] = function($event) {
          return _ctx.$emit("filter-apply");
        }),
        onOperatorChange: _cache[28] || (_cache[28] = function($event) {
          return _ctx.$emit("operator-change", $event);
        }),
        onMatchmodeChange: _cache[29] || (_cache[29] = function($event) {
          return _ctx.$emit("matchmode-change", $event);
        }),
        onConstraintAdd: _cache[30] || (_cache[30] = function($event) {
          return _ctx.$emit("constraint-add", $event);
        }),
        onConstraintRemove: _cache[31] || (_cache[31] = function($event) {
          return _ctx.$emit("constraint-remove", $event);
        }),
        onApplyClick: _cache[32] || (_cache[32] = function($event) {
          return _ctx.$emit("apply-click", $event);
        }),
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["column", "groupRowsBy", "groupRowSortField", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore", "unstyled", "pt"])) : createCommentVNode("", true)], 64);
    }), 128))], 16);
  }), 128))], 16);
}
script$1$1.render = render$1;
function _typeof$1(o) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1(o);
}
var _excluded = ["expanded"];
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == _typeof$1(i) ? i : String(i);
}
function _toPrimitive$1(t, r) {
  if ("object" != _typeof$1(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof$1(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var script$d = {
  name: "DataTable",
  "extends": script$c,
  emits: ["value-change", "update:first", "update:rows", "page", "update:sortField", "update:sortOrder", "update:multiSortMeta", "sort", "filter", "row-click", "row-dblclick", "update:selection", "row-select", "row-unselect", "update:contextMenuSelection", "row-contextmenu", "row-unselect-all", "row-select-all", "select-all-change", "column-resize-end", "column-reorder", "row-reorder", "update:expandedRows", "row-collapse", "row-expand", "update:expandedRowGroups", "rowgroup-collapse", "rowgroup-expand", "update:filters", "state-restore", "state-save", "cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "update:editingRows", "row-edit-init", "row-edit-save", "row-edit-cancel"],
  provide: function provide15() {
    return {
      $columns: this.d_columns,
      $columnGroups: this.d_columnGroups
    };
  },
  data: function data16() {
    return {
      d_first: this.first,
      d_rows: this.rows,
      d_sortField: this.sortField,
      d_sortOrder: this.sortOrder,
      d_nullSortOrder: this.nullSortOrder,
      d_multiSortMeta: this.multiSortMeta ? _toConsumableArray(this.multiSortMeta) : [],
      d_groupRowsSortMeta: null,
      d_selectionKeys: null,
      d_columnOrder: null,
      d_editingRowKeys: null,
      d_editingMeta: {},
      d_filters: this.cloneFilters(this.filters),
      d_columns: new _default({
        type: "Column"
      }),
      d_columnGroups: new _default({
        type: "ColumnGroup"
      })
    };
  },
  rowTouched: false,
  anchorRowIndex: null,
  rangeRowIndex: null,
  documentColumnResizeListener: null,
  documentColumnResizeEndListener: null,
  lastResizeHelperX: null,
  resizeColumnElement: null,
  columnResizing: false,
  colReorderIconWidth: null,
  colReorderIconHeight: null,
  draggedColumn: null,
  draggedColumnElement: null,
  draggedRowIndex: null,
  droppedRowIndex: null,
  rowDragging: null,
  columnWidthsState: null,
  tableWidthState: null,
  columnWidthsRestored: false,
  watch: {
    first: function first2(newValue) {
      this.d_first = newValue;
    },
    rows: function rows2(newValue) {
      this.d_rows = newValue;
    },
    sortField: function sortField(newValue) {
      this.d_sortField = newValue;
    },
    sortOrder: function sortOrder(newValue) {
      this.d_sortOrder = newValue;
    },
    nullSortOrder: function nullSortOrder(newValue) {
      this.d_nullSortOrder = newValue;
    },
    multiSortMeta: function multiSortMeta(newValue) {
      this.d_multiSortMeta = newValue;
    },
    selection: {
      immediate: true,
      handler: function handler4(newValue) {
        if (this.dataKey) {
          this.updateSelectionKeys(newValue);
        }
      }
    },
    editingRows: {
      immediate: true,
      handler: function handler5(newValue) {
        if (this.dataKey) {
          this.updateEditingRowKeys(newValue);
        }
      }
    },
    filters: {
      deep: true,
      handler: function handler6(newValue) {
        this.d_filters = this.cloneFilters(newValue);
      }
    }
  },
  mounted: function mounted14() {
    this.$el.setAttribute(this.attributeSelector, "");
    if (this.responsiveLayout === "stack" && !this.scrollable && !this.unstyled) {
      this.createResponsiveStyle();
    }
    if (this.isStateful()) {
      this.restoreState();
      this.resizableColumns && this.restoreColumnWidths();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  beforeUnmount: function beforeUnmount8() {
    this.unbindColumnResizeEvents();
    this.destroyStyleElement();
    this.destroyResponsiveStyle();
    this.d_columns.clear();
    this.d_columnGroups.clear();
  },
  updated: function updated9() {
    if (this.isStateful()) {
      this.saveState();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  methods: {
    columnProp: function columnProp7(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    onPage: function onPage(event2) {
      var _this = this;
      this.clearEditingMetaData();
      this.d_first = event2.first;
      this.d_rows = event2.rows;
      var pageEvent = this.createLazyLoadEvent(event2);
      pageEvent.pageCount = event2.pageCount;
      pageEvent.page = event2.page;
      this.$emit("update:first", this.d_first);
      this.$emit("update:rows", this.d_rows);
      this.$emit("page", pageEvent);
      this.$nextTick(function() {
        _this.$emit("value-change", _this.processedData);
      });
    },
    onColumnHeaderClick: function onColumnHeaderClick(e) {
      var _this2 = this;
      var event2 = e.originalEvent;
      var column = e.column;
      if (this.columnProp(column, "sortable")) {
        var targetNode = event2.target;
        var columnField = this.columnProp(column, "sortField") || this.columnProp(column, "field");
        if (DomHandler.getAttribute(targetNode, "data-p-sortable-column") === true || DomHandler.getAttribute(targetNode, "data-pc-section") === "headertitle" || DomHandler.getAttribute(targetNode, "data-pc-section") === "headercontent" || DomHandler.getAttribute(targetNode, "data-pc-section") === "sorticon" || DomHandler.getAttribute(targetNode.parentElement, "data-pc-section") === "sorticon" || DomHandler.getAttribute(targetNode.parentElement.parentElement, "data-pc-section") === "sorticon" || targetNode.closest('[data-p-sortable-column="true"]') && !targetNode.closest('[data-pc-section="filtermenubutton"]') && !DomHandler.isClickable(event2.target)) {
          DomHandler.clearSelection();
          if (this.sortMode === "single") {
            if (this.d_sortField === columnField) {
              if (this.removableSort && this.d_sortOrder * -1 === this.defaultSortOrder) {
                this.d_sortOrder = null;
                this.d_sortField = null;
              } else {
                this.d_sortOrder = this.d_sortOrder * -1;
              }
            } else {
              this.d_sortOrder = this.defaultSortOrder;
              this.d_sortField = columnField;
            }
            this.$emit("update:sortField", this.d_sortField);
            this.$emit("update:sortOrder", this.d_sortOrder);
            this.resetPage();
          } else if (this.sortMode === "multiple") {
            var metaKey = event2.metaKey || event2.ctrlKey;
            if (!metaKey) {
              this.d_multiSortMeta = this.d_multiSortMeta.filter(function(meta) {
                return meta.field === columnField;
              });
            }
            this.addMultiSortField(columnField);
            this.$emit("update:multiSortMeta", this.d_multiSortMeta);
          }
          this.$emit("sort", this.createLazyLoadEvent(event2));
          this.$nextTick(function() {
            _this2.$emit("value-change", _this2.processedData);
          });
        }
      }
    },
    sortSingle: function sortSingle(value) {
      var _this3 = this;
      this.clearEditingMetaData();
      if (this.groupRowsBy && this.groupRowsBy === this.sortField) {
        this.d_multiSortMeta = [{
          field: this.sortField,
          order: this.sortOrder || this.defaultSortOrder
        }, {
          field: this.d_sortField,
          order: this.d_sortOrder
        }];
        return this.sortMultiple(value);
      }
      var data17 = _toConsumableArray(value);
      var resolvedFieldData = /* @__PURE__ */ new Map();
      var _iterator = _createForOfIteratorHelper(data17), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var item2 = _step.value;
          resolvedFieldData.set(item2, ObjectUtils.resolveFieldData(item2, this.d_sortField));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var comparer = ObjectUtils.localeComparator();
      data17.sort(function(data1, data22) {
        var value1 = resolvedFieldData.get(data1);
        var value2 = resolvedFieldData.get(data22);
        return ObjectUtils.sort(value1, value2, _this3.d_sortOrder, comparer, _this3.d_nullSortOrder);
      });
      return data17;
    },
    sortMultiple: function sortMultiple(value) {
      var _this4 = this;
      this.clearEditingMetaData();
      if (this.groupRowsBy && (this.d_groupRowsSortMeta || this.d_multiSortMeta.length && this.groupRowsBy === this.d_multiSortMeta[0].field)) {
        var firstSortMeta = this.d_multiSortMeta[0];
        !this.d_groupRowsSortMeta && (this.d_groupRowsSortMeta = firstSortMeta);
        if (firstSortMeta.field !== this.d_groupRowsSortMeta.field) {
          this.d_multiSortMeta = [this.d_groupRowsSortMeta].concat(_toConsumableArray(this.d_multiSortMeta));
        }
      }
      var data17 = _toConsumableArray(value);
      data17.sort(function(data1, data22) {
        return _this4.multisortField(data1, data22, 0);
      });
      return data17;
    },
    multisortField: function multisortField(data1, data22, index2) {
      var value1 = ObjectUtils.resolveFieldData(data1, this.d_multiSortMeta[index2].field);
      var value2 = ObjectUtils.resolveFieldData(data22, this.d_multiSortMeta[index2].field);
      var comparer = ObjectUtils.localeComparator();
      if (value1 === value2) {
        return this.d_multiSortMeta.length - 1 > index2 ? this.multisortField(data1, data22, index2 + 1) : 0;
      }
      return ObjectUtils.sort(value1, value2, this.d_multiSortMeta[index2].order, comparer, this.d_nullSortOrder);
    },
    addMultiSortField: function addMultiSortField(field2) {
      var index2 = this.d_multiSortMeta.findIndex(function(meta) {
        return meta.field === field2;
      });
      if (index2 >= 0) {
        if (this.removableSort && this.d_multiSortMeta[index2].order * -1 === this.defaultSortOrder)
          this.d_multiSortMeta.splice(index2, 1);
        else
          this.d_multiSortMeta[index2] = {
            field: field2,
            order: this.d_multiSortMeta[index2].order * -1
          };
      } else {
        this.d_multiSortMeta.push({
          field: field2,
          order: this.defaultSortOrder
        });
      }
      this.d_multiSortMeta = _toConsumableArray(this.d_multiSortMeta);
    },
    getActiveFilters: function getActiveFilters(filters) {
      var removeEmptyFilters = function removeEmptyFilters2(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
        if (value.constraints) {
          var filteredConstraints = value.constraints.filter(function(constraint) {
            return constraint.value !== null;
          });
          if (filteredConstraints.length > 0) {
            return [key, _objectSpread$1(_objectSpread$1({}, value), {}, {
              constraints: filteredConstraints
            })];
          }
        } else if (value.value !== null) {
          return [key, value];
        }
        return void 0;
      };
      var filterValidEntries = function filterValidEntries2(entry) {
        return entry !== void 0;
      };
      var entries = Object.entries(filters).map(removeEmptyFilters).filter(filterValidEntries);
      return Object.fromEntries(entries);
    },
    filter: function filter3(data17) {
      var _this5 = this;
      if (!data17) {
        return;
      }
      this.clearEditingMetaData();
      var activeFilters = this.getActiveFilters(this.filters);
      var globalFilterFieldsArray;
      if (activeFilters["global"]) {
        globalFilterFieldsArray = this.globalFilterFields || this.columns.map(function(col) {
          return _this5.columnProp(col, "filterField") || _this5.columnProp(col, "field");
        });
      }
      var filteredValue = [];
      for (var i = 0; i < data17.length; i++) {
        var localMatch = true;
        var globalMatch = false;
        var localFiltered = false;
        for (var prop in activeFilters) {
          if (Object.prototype.hasOwnProperty.call(activeFilters, prop) && prop !== "global") {
            localFiltered = true;
            var filterField = prop;
            var filterMeta = activeFilters[filterField];
            if (filterMeta.operator) {
              var _iterator2 = _createForOfIteratorHelper(filterMeta.constraints), _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                  var filterConstraint = _step2.value;
                  localMatch = this.executeLocalFilter(filterField, data17[i], filterConstraint);
                  if (filterMeta.operator === FilterOperator.OR && localMatch || filterMeta.operator === FilterOperator.AND && !localMatch) {
                    break;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            } else {
              localMatch = this.executeLocalFilter(filterField, data17[i], filterMeta);
            }
            if (!localMatch) {
              break;
            }
          }
        }
        if (localMatch && activeFilters["global"] && !globalMatch && globalFilterFieldsArray) {
          for (var j = 0; j < globalFilterFieldsArray.length; j++) {
            var globalFilterField = globalFilterFieldsArray[j];
            globalMatch = FilterService.filters[activeFilters["global"].matchMode || FilterMatchMode.CONTAINS](ObjectUtils.resolveFieldData(data17[i], globalFilterField), activeFilters["global"].value, this.filterLocale);
            if (globalMatch) {
              break;
            }
          }
        }
        var matches = void 0;
        if (activeFilters["global"]) {
          matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
        } else {
          matches = localFiltered && localMatch;
        }
        if (matches) {
          filteredValue.push(data17[i]);
        }
      }
      if (filteredValue.length === this.value.length || Object.keys(activeFilters).length == 0) {
        filteredValue = data17;
      }
      var filterEvent = this.createLazyLoadEvent();
      filterEvent.filteredValue = filteredValue;
      this.$emit("filter", filterEvent);
      this.$nextTick(function() {
        _this5.$emit("value-change", _this5.processedData);
      });
      return filteredValue;
    },
    executeLocalFilter: function executeLocalFilter(field2, rowData, filterMeta) {
      var filterValue = filterMeta.value;
      var filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
      var dataFieldValue = ObjectUtils.resolveFieldData(rowData, field2);
      var filterConstraint = FilterService.filters[filterMatchMode];
      return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
    },
    onRowClick: function onRowClick2(e) {
      var event2 = e.originalEvent;
      var body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      var focusedItem = DomHandler.findSingle(body, 'tr[data-p-selectable-row="true"][tabindex="0"]');
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-click", e);
      if (this.selectionMode) {
        var rowData = e.data;
        var rowIndex2 = this.d_first + e.index;
        if (this.isMultipleSelectionMode() && event2.shiftKey && this.anchorRowIndex != null) {
          DomHandler.clearSelection();
          this.rangeRowIndex = rowIndex2;
          this.selectRange(event2);
        } else {
          var selected = this.isSelected(rowData);
          var metaSelection = this.rowTouched ? false : this.metaKeySelection;
          this.anchorRowIndex = rowIndex2;
          this.rangeRowIndex = rowIndex2;
          if (metaSelection) {
            var metaKey = event2.metaKey || event2.ctrlKey;
            if (selected && metaKey) {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", null);
              } else {
                var selectionIndex = this.findIndexInSelection(rowData);
                var _selection = this.selection.filter(function(val, i) {
                  return i != selectionIndex;
                });
                this.$emit("update:selection", _selection);
              }
              this.$emit("row-unselect", {
                originalEvent: event2,
                data: rowData,
                index: rowIndex2,
                type: "row"
              });
            } else {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", rowData);
              } else if (this.isMultipleSelectionMode()) {
                var _selection2 = metaKey ? this.selection || [] : [];
                _selection2 = [].concat(_toConsumableArray(_selection2), [rowData]);
                this.$emit("update:selection", _selection2);
              }
              this.$emit("row-select", {
                originalEvent: event2,
                data: rowData,
                index: rowIndex2,
                type: "row"
              });
            }
          } else {
            if (this.selectionMode === "single") {
              if (selected) {
                this.$emit("update:selection", null);
                this.$emit("row-unselect", {
                  originalEvent: event2,
                  data: rowData,
                  index: rowIndex2,
                  type: "row"
                });
              } else {
                this.$emit("update:selection", rowData);
                this.$emit("row-select", {
                  originalEvent: event2,
                  data: rowData,
                  index: rowIndex2,
                  type: "row"
                });
              }
            } else if (this.selectionMode === "multiple") {
              if (selected) {
                var _selectionIndex = this.findIndexInSelection(rowData);
                var _selection3 = this.selection.filter(function(val, i) {
                  return i != _selectionIndex;
                });
                this.$emit("update:selection", _selection3);
                this.$emit("row-unselect", {
                  originalEvent: event2,
                  data: rowData,
                  index: rowIndex2,
                  type: "row"
                });
              } else {
                var _selection4 = this.selection ? [].concat(_toConsumableArray(this.selection), [rowData]) : [rowData];
                this.$emit("update:selection", _selection4);
                this.$emit("row-select", {
                  originalEvent: event2,
                  data: rowData,
                  index: rowIndex2,
                  type: "row"
                });
              }
            }
          }
        }
      }
      this.rowTouched = false;
      if (focusedItem) {
        var _event$target, _event$target2, _event$target3;
        if (((_event$target = event2.target) === null || _event$target === void 0 ? void 0 : _event$target.getAttribute("data-pc-section")) === "rowtogglericon" || ((_event$target2 = event2.target) === null || _event$target2 === void 0 || (_event$target2 = _event$target2.parentElement) === null || _event$target2 === void 0 ? void 0 : _event$target2.getAttribute("data-pc-section")) === "rowtogglericon")
          return;
        var targetRow = (_event$target3 = event2.target) === null || _event$target3 === void 0 ? void 0 : _event$target3.closest('tr[data-p-selectable-row="true"]');
        focusedItem.tabIndex = "-1";
        targetRow.tabIndex = "0";
      }
    },
    onRowDblClick: function onRowDblClick2(e) {
      var event2 = e.originalEvent;
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-dblclick", e);
    },
    onRowRightClick: function onRowRightClick2(event2) {
      if (this.contextMenu) {
        DomHandler.clearSelection();
        event2.originalEvent.target.focus();
      }
      this.$emit("update:contextMenuSelection", event2.data);
      this.$emit("row-contextmenu", event2);
    },
    onRowTouchEnd: function onRowTouchEnd2() {
      this.rowTouched = true;
    },
    onRowKeyDown: function onRowKeyDown2(e, slotProps) {
      var event2 = e.originalEvent;
      var rowData = e.data;
      var rowIndex2 = e.index;
      var metaKey = event2.metaKey || event2.ctrlKey;
      if (this.selectionMode) {
        var row2 = event2.target;
        switch (event2.code) {
          case "ArrowDown":
            this.onArrowDownKey(event2, row2, rowIndex2, slotProps);
            break;
          case "ArrowUp":
            this.onArrowUpKey(event2, row2, rowIndex2, slotProps);
            break;
          case "Home":
            this.onHomeKey(event2, row2, rowIndex2, slotProps);
            break;
          case "End":
            this.onEndKey(event2, row2, rowIndex2, slotProps);
            break;
          case "Enter":
          case "NumpadEnter":
            this.onEnterKey(event2, rowData, rowIndex2);
            break;
          case "Space":
            this.onSpaceKey(event2, rowData, rowIndex2, slotProps);
            break;
          case "Tab":
            this.onTabKey(event2, rowIndex2);
            break;
          default:
            if (event2.code === "KeyA" && metaKey) {
              var data17 = this.dataToRender(slotProps.rows);
              this.$emit("update:selection", data17);
              event2.preventDefault();
            }
            break;
        }
      }
    },
    onArrowDownKey: function onArrowDownKey3(event2, row2, rowIndex2, slotProps) {
      var nextRow = this.findNextSelectableRow(row2);
      nextRow && this.focusRowChange(row2, nextRow);
      if (event2.shiftKey) {
        var data17 = this.dataToRender(slotProps.rows);
        var nextRowIndex = rowIndex2 + 1 >= data17.length ? data17.length - 1 : rowIndex2 + 1;
        this.onRowClick({
          originalEvent: event2,
          data: data17[nextRowIndex],
          index: nextRowIndex
        });
      }
      event2.preventDefault();
    },
    onArrowUpKey: function onArrowUpKey3(event2, row2, rowIndex2, slotProps) {
      var prevRow = this.findPrevSelectableRow(row2);
      prevRow && this.focusRowChange(row2, prevRow);
      if (event2.shiftKey) {
        var data17 = this.dataToRender(slotProps.rows);
        var prevRowIndex = rowIndex2 - 1 <= 0 ? 0 : rowIndex2 - 1;
        this.onRowClick({
          originalEvent: event2,
          data: data17[prevRowIndex],
          index: prevRowIndex
        });
      }
      event2.preventDefault();
    },
    onHomeKey: function onHomeKey3(event2, row2, rowIndex2, slotProps) {
      var firstRow = this.findFirstSelectableRow();
      firstRow && this.focusRowChange(row2, firstRow);
      if (event2.ctrlKey && event2.shiftKey) {
        var data17 = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data17.slice(0, rowIndex2 + 1));
      }
      event2.preventDefault();
    },
    onEndKey: function onEndKey3(event2, row2, rowIndex2, slotProps) {
      var lastRow = this.findLastSelectableRow();
      lastRow && this.focusRowChange(row2, lastRow);
      if (event2.ctrlKey && event2.shiftKey) {
        var data17 = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data17.slice(rowIndex2, data17.length));
      }
      event2.preventDefault();
    },
    onEnterKey: function onEnterKey3(event2, rowData, rowIndex2) {
      this.onRowClick({
        originalEvent: event2,
        data: rowData,
        index: rowIndex2
      });
      event2.preventDefault();
    },
    onSpaceKey: function onSpaceKey3(event2, rowData, rowIndex2, slotProps) {
      this.onEnterKey(event2, rowData, rowIndex2);
      if (event2.shiftKey && this.selection !== null) {
        var data17 = this.dataToRender(slotProps.rows);
        var index2;
        if (this.selection.length > 0) {
          var firstSelectedRowIndex, lastSelectedRowIndex;
          firstSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[0], data17);
          lastSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[this.selection.length - 1], data17);
          index2 = rowIndex2 <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
        } else {
          index2 = ObjectUtils.findIndexInList(this.selection, data17);
        }
        var _selection = index2 !== rowIndex2 ? data17.slice(Math.min(index2, rowIndex2), Math.max(index2, rowIndex2) + 1) : rowData;
        this.$emit("update:selection", _selection);
      }
    },
    onTabKey: function onTabKey3(event2, rowIndex2) {
      var body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      var rows3 = DomHandler.find(body, 'tr[data-p-selectable-row="true"]');
      if (event2.code === "Tab" && rows3 && rows3.length > 0) {
        var firstSelectedRow = DomHandler.findSingle(body, 'tr[data-p-highlight="true"]');
        var focusedItem = DomHandler.findSingle(body, 'tr[data-p-selectable-row="true"][tabindex="0"]');
        if (firstSelectedRow) {
          firstSelectedRow.tabIndex = "0";
          focusedItem && focusedItem !== firstSelectedRow && (focusedItem.tabIndex = "-1");
        } else {
          rows3[0].tabIndex = "0";
          focusedItem !== rows3[0] && (rows3[rowIndex2].tabIndex = "-1");
        }
      }
    },
    findNextSelectableRow: function findNextSelectableRow(row2) {
      var nextRow = row2.nextElementSibling;
      if (nextRow) {
        if (DomHandler.getAttribute(nextRow, "data-p-selectable-row") === true)
          return nextRow;
        else
          return this.findNextSelectableRow(nextRow);
      } else {
        return null;
      }
    },
    findPrevSelectableRow: function findPrevSelectableRow(row2) {
      var prevRow = row2.previousElementSibling;
      if (prevRow) {
        if (DomHandler.getAttribute(prevRow, "data-p-selectable-row") === true)
          return prevRow;
        else
          return this.findPrevSelectableRow(prevRow);
      } else {
        return null;
      }
    },
    findFirstSelectableRow: function findFirstSelectableRow() {
      var firstRow = DomHandler.findSingle(this.$refs.table, 'tr[data-p-selectable-row="true"]');
      return firstRow;
    },
    findLastSelectableRow: function findLastSelectableRow() {
      var rows3 = DomHandler.find(this.$refs.table, 'tr[data-p-selectable-row="true"]');
      return rows3 ? rows3[rows3.length - 1] : null;
    },
    focusRowChange: function focusRowChange(firstFocusableRow, currentFocusedRow) {
      firstFocusableRow.tabIndex = "-1";
      currentFocusedRow.tabIndex = "0";
      DomHandler.focus(currentFocusedRow);
    },
    toggleRowWithRadio: function toggleRowWithRadio2(event2) {
      var rowData = event2.data;
      if (this.isSelected(rowData)) {
        this.$emit("update:selection", null);
        this.$emit("row-unselect", {
          originalEvent: event2.originalEvent,
          data: rowData,
          index: event2.index,
          type: "radiobutton"
        });
      } else {
        this.$emit("update:selection", rowData);
        this.$emit("row-select", {
          originalEvent: event2.originalEvent,
          data: rowData,
          index: event2.index,
          type: "radiobutton"
        });
      }
    },
    toggleRowWithCheckbox: function toggleRowWithCheckbox2(event2) {
      var rowData = event2.data;
      if (this.isSelected(rowData)) {
        var selectionIndex = this.findIndexInSelection(rowData);
        var _selection = this.selection.filter(function(val, i) {
          return i != selectionIndex;
        });
        this.$emit("update:selection", _selection);
        this.$emit("row-unselect", {
          originalEvent: event2.originalEvent,
          data: rowData,
          index: event2.index,
          type: "checkbox"
        });
      } else {
        var _selection5 = this.selection ? _toConsumableArray(this.selection) : [];
        _selection5 = [].concat(_toConsumableArray(_selection5), [rowData]);
        this.$emit("update:selection", _selection5);
        this.$emit("row-select", {
          originalEvent: event2.originalEvent,
          data: rowData,
          index: event2.index,
          type: "checkbox"
        });
      }
    },
    toggleRowsWithCheckbox: function toggleRowsWithCheckbox(event2) {
      if (this.selectAll !== null) {
        this.$emit("select-all-change", event2);
      } else {
        var originalEvent = event2.originalEvent, checked3 = event2.checked;
        var _selection = [];
        if (checked3) {
          _selection = this.frozenValue ? [].concat(_toConsumableArray(this.frozenValue), _toConsumableArray(this.processedData)) : this.processedData;
          this.$emit("row-select-all", {
            originalEvent,
            data: _selection
          });
        } else {
          this.$emit("row-unselect-all", {
            originalEvent
          });
        }
        this.$emit("update:selection", _selection);
      }
    },
    isSingleSelectionMode: function isSingleSelectionMode() {
      return this.selectionMode === "single";
    },
    isMultipleSelectionMode: function isMultipleSelectionMode() {
      return this.selectionMode === "multiple";
    },
    isSelected: function isSelected4(rowData) {
      if (rowData && this.selection) {
        if (this.dataKey) {
          return this.d_selectionKeys ? this.d_selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(rowData) > -1;
          else
            return this.equals(rowData, this.selection);
        }
      }
      return false;
    },
    findIndexInSelection: function findIndexInSelection2(rowData) {
      return this.findIndex(rowData, this.selection);
    },
    findIndex: function findIndex2(rowData, collection) {
      var index2 = -1;
      if (collection && collection.length) {
        for (var i = 0; i < collection.length; i++) {
          if (this.equals(rowData, collection[i])) {
            index2 = i;
            break;
          }
        }
      }
      return index2;
    },
    updateSelectionKeys: function updateSelectionKeys(selection) {
      this.d_selectionKeys = {};
      if (Array.isArray(selection)) {
        var _iterator3 = _createForOfIteratorHelper(selection), _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
            var data17 = _step3.value;
            this.d_selectionKeys[String(ObjectUtils.resolveFieldData(data17, this.dataKey))] = 1;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else {
        this.d_selectionKeys[String(ObjectUtils.resolveFieldData(selection, this.dataKey))] = 1;
      }
    },
    updateEditingRowKeys: function updateEditingRowKeys(editingRows) {
      if (editingRows && editingRows.length) {
        this.d_editingRowKeys = {};
        var _iterator4 = _createForOfIteratorHelper(editingRows), _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
            var data17 = _step4.value;
            this.d_editingRowKeys[String(ObjectUtils.resolveFieldData(data17, this.dataKey))] = 1;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } else {
        this.d_editingRowKeys = null;
      }
    },
    equals: function equals4(data1, data22) {
      return this.compareSelectionBy === "equals" ? data1 === data22 : ObjectUtils.equals(data1, data22, this.dataKey);
    },
    selectRange: function selectRange(event2) {
      var rangeStart, rangeEnd;
      if (this.rangeRowIndex > this.anchorRowIndex) {
        rangeStart = this.anchorRowIndex;
        rangeEnd = this.rangeRowIndex;
      } else if (this.rangeRowIndex < this.anchorRowIndex) {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.anchorRowIndex;
      } else {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.rangeRowIndex;
      }
      if (this.lazy && this.paginator) {
        rangeStart -= this.first;
        rangeEnd -= this.first;
      }
      var value = this.processedData;
      var _selection = [];
      for (var i = rangeStart; i <= rangeEnd; i++) {
        var rangeRowData = value[i];
        _selection.push(rangeRowData);
        this.$emit("row-select", {
          originalEvent: event2,
          data: rangeRowData,
          type: "row"
        });
      }
      this.$emit("update:selection", _selection);
    },
    exportCSV: function exportCSV2(options2, data17) {
      var _this6 = this;
      var csv = "\uFEFF";
      if (!data17) {
        data17 = this.processedData;
        if (options2 && options2.selectionOnly)
          data17 = this.selection || [];
        else if (this.frozenValue)
          data17 = data17 ? [].concat(_toConsumableArray(this.frozenValue), _toConsumableArray(data17)) : this.frozenValue;
      }
      var headerInitiated = false;
      for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "field")) {
          if (headerInitiated)
            csv += this.csvSeparator;
          else
            headerInitiated = true;
          csv += '"' + (this.columnProp(column, "exportHeader") || this.columnProp(column, "header") || this.columnProp(column, "field")) + '"';
        }
      }
      if (data17) {
        data17.forEach(function(record) {
          csv += "\n";
          var rowInitiated = false;
          for (var _i = 0; _i < _this6.columns.length; _i++) {
            var _column = _this6.columns[_i];
            if (_this6.columnProp(_column, "exportable") !== false && _this6.columnProp(_column, "field")) {
              if (rowInitiated)
                csv += _this6.csvSeparator;
              else
                rowInitiated = true;
              var cellData = ObjectUtils.resolveFieldData(record, _this6.columnProp(_column, "field"));
              if (cellData != null) {
                if (_this6.exportFunction) {
                  cellData = _this6.exportFunction({
                    data: cellData,
                    field: _this6.columnProp(_column, "field")
                  });
                } else
                  cellData = String(cellData).replace(/"/g, '""');
              } else
                cellData = "";
              csv += '"' + cellData + '"';
            }
          }
        });
      }
      var footerInitiated = false;
      for (var _i2 = 0; _i2 < this.columns.length; _i2++) {
        var _column2 = this.columns[_i2];
        if (_i2 === 0)
          csv += "\n";
        if (this.columnProp(_column2, "exportable") !== false && this.columnProp(_column2, "exportFooter")) {
          if (footerInitiated)
            csv += this.csvSeparator;
          else
            footerInitiated = true;
          csv += '"' + (this.columnProp(_column2, "exportFooter") || this.columnProp(_column2, "footer") || this.columnProp(_column2, "field")) + '"';
        }
      }
      DomHandler.exportCSV(csv, this.exportFilename);
    },
    resetPage: function resetPage() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
    },
    onColumnResizeStart: function onColumnResizeStart(event2) {
      var containerLeft = DomHandler.getOffset(this.$el).left;
      this.resizeColumnElement = event2.target.parentElement;
      this.columnResizing = true;
      this.lastResizeHelperX = event2.pageX - containerLeft + this.$el.scrollLeft;
      this.bindColumnResizeEvents();
    },
    onColumnResize: function onColumnResize(event2) {
      var containerLeft = DomHandler.getOffset(this.$el).left;
      this.$el.setAttribute("data-p-unselectable-text", "true");
      !this.isUnstyled && DomHandler.addClass(this.$el, "p-unselectable-text");
      this.$refs.resizeHelper.style.height = this.$el.offsetHeight + "px";
      this.$refs.resizeHelper.style.top = "0px";
      this.$refs.resizeHelper.style.left = event2.pageX - containerLeft + this.$el.scrollLeft + "px";
      this.$refs.resizeHelper.style.display = "block";
    },
    onColumnResizeEnd: function onColumnResizeEnd() {
      var delta = this.$refs.resizeHelper.offsetLeft - this.lastResizeHelperX;
      var columnWidth = this.resizeColumnElement.offsetWidth;
      var newColumnWidth = columnWidth + delta;
      var minWidth = this.resizeColumnElement.style.minWidth || 15;
      if (columnWidth + delta > parseInt(minWidth, 10)) {
        if (this.columnResizeMode === "fit") {
          var nextColumn = this.resizeColumnElement.nextElementSibling;
          var nextColumnWidth = nextColumn.offsetWidth - delta;
          if (newColumnWidth > 15 && nextColumnWidth > 15) {
            this.resizeTableCells(newColumnWidth, nextColumnWidth);
          }
        } else if (this.columnResizeMode === "expand") {
          var tableWidth = this.$refs.table.offsetWidth + delta + "px";
          var updateTableWidth = function updateTableWidth2(el) {
            !!el && (el.style.width = el.style.minWidth = tableWidth);
          };
          this.resizeTableCells(newColumnWidth);
          updateTableWidth(this.$refs.table);
          if (!this.virtualScrollerDisabled) {
            var body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
            var frozenBody = this.$refs.frozenBodyRef && this.$refs.frozenBodyRef.$el;
            updateTableWidth(body);
            updateTableWidth(frozenBody);
          }
        }
        this.$emit("column-resize-end", {
          element: this.resizeColumnElement,
          delta
        });
      }
      this.$refs.resizeHelper.style.display = "none";
      this.resizeColumn = null;
      this.$el.setAttribute("data-p-unselectable-text", "true");
      !this.isUnstyled && DomHandler.removeClass(this.$el, "p-unselectable-text");
      this.unbindColumnResizeEvents();
      if (this.isStateful()) {
        this.saveState();
      }
    },
    resizeTableCells: function resizeTableCells(newColumnWidth, nextColumnWidth) {
      var colIndex = DomHandler.index(this.resizeColumnElement);
      var widths = [];
      var headers = DomHandler.find(this.$refs.table, 'thead[data-pc-section="thead"] > tr > th');
      headers.forEach(function(header) {
        return widths.push(DomHandler.getOuterWidth(header));
      });
      this.destroyStyleElement();
      this.createStyleElement();
      var innerHTML = "";
      var selector = '[data-pc-name="datatable"]['.concat(this.attributeSelector, '] > [data-pc-section="wrapper"] ').concat(this.virtualScrollerDisabled ? "" : '> [data-pc-name="virtualscroller"]', ' > table[data-pc-section="table"]');
      widths.forEach(function(width2, index2) {
        var colWidth = index2 === colIndex ? newColumnWidth : nextColumnWidth && index2 === colIndex + 1 ? nextColumnWidth : width2;
        var style = "width: ".concat(colWidth, "px !important; max-width: ").concat(colWidth, "px !important");
        innerHTML += "\n                    ".concat(selector, ' > thead[data-pc-section="thead"] > tr > th:nth-child(').concat(index2 + 1, "),\n                    ").concat(selector, ' > tbody[data-pc-section="tbody"] > tr > td:nth-child(').concat(index2 + 1, "),\n                    ").concat(selector, ' > tfoot[data-pc-section="tfoot"] > tr > td:nth-child(').concat(index2 + 1, ") {\n                        ").concat(style, "\n                    }\n                ");
      });
      this.styleElement.innerHTML = innerHTML;
    },
    bindColumnResizeEvents: function bindColumnResizeEvents() {
      var _this7 = this;
      if (!this.documentColumnResizeListener) {
        this.documentColumnResizeListener = document.addEventListener("mousemove", function() {
          if (_this7.columnResizing) {
            _this7.onColumnResize(event);
          }
        });
      }
      if (!this.documentColumnResizeEndListener) {
        this.documentColumnResizeEndListener = document.addEventListener("mouseup", function() {
          if (_this7.columnResizing) {
            _this7.columnResizing = false;
            _this7.onColumnResizeEnd();
          }
        });
      }
    },
    unbindColumnResizeEvents: function unbindColumnResizeEvents() {
      if (this.documentColumnResizeListener) {
        document.removeEventListener("document", this.documentColumnResizeListener);
        this.documentColumnResizeListener = null;
      }
      if (this.documentColumnResizeEndListener) {
        document.removeEventListener("document", this.documentColumnResizeEndListener);
        this.documentColumnResizeEndListener = null;
      }
    },
    onColumnHeaderMouseDown: function onColumnHeaderMouseDown(e) {
      var event2 = e.originalEvent;
      var column = e.column;
      if (this.reorderableColumns && this.columnProp(column, "reorderableColumn") !== false) {
        if (event2.target.nodeName === "INPUT" || event2.target.nodeName === "TEXTAREA" || DomHandler.getAttribute(event2.target, '[data-pc-section="columnresizer"]'))
          event2.currentTarget.draggable = false;
        else
          event2.currentTarget.draggable = true;
      }
    },
    onColumnHeaderDragStart: function onColumnHeaderDragStart(e) {
      var event2 = e.originalEvent, column = e.column;
      if (this.columnResizing) {
        event2.preventDefault();
        return;
      }
      this.colReorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.$refs.reorderIndicatorUp);
      this.colReorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.$refs.reorderIndicatorUp);
      this.draggedColumn = column;
      this.draggedColumnElement = this.findParentHeader(event2.target);
      event2.dataTransfer.setData("text", "b");
    },
    onColumnHeaderDragOver: function onColumnHeaderDragOver(e) {
      var event2 = e.originalEvent, column = e.column;
      var dropHeader = this.findParentHeader(event2.target);
      if (this.reorderableColumns && this.draggedColumnElement && dropHeader && !this.columnProp(column, "frozen")) {
        event2.preventDefault();
        var containerOffset = DomHandler.getOffset(this.$el);
        var dropHeaderOffset = DomHandler.getOffset(dropHeader);
        if (this.draggedColumnElement !== dropHeader) {
          var targetLeft = dropHeaderOffset.left - containerOffset.left;
          var columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
          this.$refs.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (this.colReorderIconHeight - 1) + "px";
          this.$refs.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + "px";
          if (event2.pageX > columnCenter) {
            this.$refs.reorderIndicatorUp.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = 1;
          } else {
            this.$refs.reorderIndicatorUp.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = -1;
          }
          this.$refs.reorderIndicatorUp.style.display = "block";
          this.$refs.reorderIndicatorDown.style.display = "block";
        }
      }
    },
    onColumnHeaderDragLeave: function onColumnHeaderDragLeave(e) {
      var event2 = e.originalEvent;
      if (this.reorderableColumns && this.draggedColumnElement) {
        event2.preventDefault();
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
      }
    },
    onColumnHeaderDrop: function onColumnHeaderDrop(e) {
      var _this8 = this;
      var event2 = e.originalEvent, column = e.column;
      event2.preventDefault();
      if (this.draggedColumnElement) {
        var dragIndex = DomHandler.index(this.draggedColumnElement);
        var dropIndex = DomHandler.index(this.findParentHeader(event2.target));
        var allowDrop = dragIndex !== dropIndex;
        if (allowDrop && (dropIndex - dragIndex === 1 && this.dropPosition === -1 || dropIndex - dragIndex === -1 && this.dropPosition === 1)) {
          allowDrop = false;
        }
        if (allowDrop) {
          var isSameColumn = function isSameColumn2(col1, col2) {
            return _this8.columnProp(col1, "columnKey") || _this8.columnProp(col2, "columnKey") ? _this8.columnProp(col1, "columnKey") === _this8.columnProp(col2, "columnKey") : _this8.columnProp(col1, "field") === _this8.columnProp(col2, "field");
          };
          var dragColIndex = this.columns.findIndex(function(child) {
            return isSameColumn(child, _this8.draggedColumn);
          });
          var dropColIndex = this.columns.findIndex(function(child) {
            return isSameColumn(child, column);
          });
          var widths = [];
          var headers = DomHandler.find(this.$el, 'thead[data-pc-section="thead"] > tr > th');
          headers.forEach(function(header) {
            return widths.push(DomHandler.getOuterWidth(header));
          });
          var movedItem = widths.find(function(_, index2) {
            return index2 === dragColIndex;
          });
          var remainingItems = widths.filter(function(_, index2) {
            return index2 !== dragColIndex;
          });
          var reorderedWidths = [].concat(_toConsumableArray(remainingItems.slice(0, dropColIndex)), [movedItem], _toConsumableArray(remainingItems.slice(dropColIndex)));
          this.addColumnWidthStyles(reorderedWidths);
          if (dropColIndex < dragColIndex && this.dropPosition === 1) {
            dropColIndex++;
          }
          if (dropColIndex > dragColIndex && this.dropPosition === -1) {
            dropColIndex--;
          }
          ObjectUtils.reorderArray(this.columns, dragColIndex, dropColIndex);
          this.updateReorderableColumns();
          this.$emit("column-reorder", {
            originalEvent: event2,
            dragIndex: dragColIndex,
            dropIndex: dropColIndex
          });
        }
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
        this.draggedColumnElement.draggable = false;
        this.draggedColumnElement = null;
        this.draggedColumn = null;
        this.dropPosition = null;
      }
    },
    findParentHeader: function findParentHeader(element) {
      if (element.nodeName === "TH") {
        return element;
      } else {
        var parent = element.parentElement;
        while (parent.nodeName !== "TH") {
          parent = parent.parentElement;
          if (!parent)
            break;
        }
        return parent;
      }
    },
    findColumnByKey: function findColumnByKey(columns2, key) {
      if (columns2 && columns2.length) {
        for (var i = 0; i < columns2.length; i++) {
          var column = columns2[i];
          if (this.columnProp(column, "columnKey") === key || this.columnProp(column, "field") === key) {
            return column;
          }
        }
      }
      return null;
    },
    onRowMouseDown: function onRowMouseDown2(event2) {
      if (DomHandler.getAttribute(event2.target, "data-pc-section") === "rowreordericon" || DomHandler.getAttribute(event2.target.parentElement, "data-pc-section") === "rowreordericon")
        event2.currentTarget.draggable = true;
      else
        event2.currentTarget.draggable = false;
    },
    onRowDragStart: function onRowDragStart2(e) {
      var event2 = e.originalEvent;
      var index2 = e.index;
      this.rowDragging = true;
      this.draggedRowIndex = index2;
      event2.dataTransfer.setData("text", "b");
    },
    onRowDragOver: function onRowDragOver2(e) {
      var event2 = e.originalEvent;
      var index2 = e.index;
      if (this.rowDragging && this.draggedRowIndex !== index2) {
        var rowElement = event2.currentTarget;
        var rowY = DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
        var pageY = event2.pageY;
        var rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
        var prevRowElement = rowElement.previousElementSibling;
        if (pageY < rowMidY) {
          rowElement.setAttribute("data-p-datatable-dragpoint-bottom", "false");
          !this.isUnstyled && DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
          this.droppedRowIndex = index2;
          if (prevRowElement) {
            prevRowElement.setAttribute("data-p-datatable-dragpoint-bottom", "true");
            !this.isUnstyled && DomHandler.addClass(prevRowElement, "p-datatable-dragpoint-bottom");
          } else {
            rowElement.setAttribute("data-p-datatable-dragpoint-top", "true");
            !this.isUnstyled && DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
          }
        } else {
          if (prevRowElement) {
            prevRowElement.setAttribute("data-p-datatable-dragpoint-bottom", "false");
            !this.isUnstyled && DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
          } else {
            rowElement.setAttribute("data-p-datatable-dragpoint-top", "true");
            !this.isUnstyled && DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
          }
          this.droppedRowIndex = index2 + 1;
          rowElement.setAttribute("data-p-datatable-dragpoint-bottom", "true");
          !this.isUnstyled && DomHandler.addClass(rowElement, "p-datatable-dragpoint-bottom");
        }
        event2.preventDefault();
      }
    },
    onRowDragLeave: function onRowDragLeave2(event2) {
      var rowElement = event2.currentTarget;
      var prevRowElement = rowElement.previousElementSibling;
      if (prevRowElement) {
        prevRowElement.setAttribute("data-p-datatable-dragpoint-bottom", "false");
        !this.isUnstyled && DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
      }
      rowElement.setAttribute("data-p-datatable-dragpoint-bottom", "false");
      !this.isUnstyled && DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
      rowElement.setAttribute("data-p-datatable-dragpoint-top", "false");
      !this.isUnstyled && DomHandler.removeClass(rowElement, "p-datatable-dragpoint-top");
    },
    onRowDragEnd: function onRowDragEnd2(event2) {
      this.rowDragging = false;
      this.draggedRowIndex = null;
      this.droppedRowIndex = null;
      event2.currentTarget.draggable = false;
    },
    onRowDrop: function onRowDrop2(event2) {
      if (this.droppedRowIndex != null) {
        var dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
        var processedData2 = _toConsumableArray(this.processedData);
        ObjectUtils.reorderArray(processedData2, this.draggedRowIndex + this.d_first, dropIndex + this.d_first);
        this.$emit("row-reorder", {
          originalEvent: event2,
          dragIndex: this.draggedRowIndex,
          dropIndex,
          value: processedData2
        });
      }
      this.onRowDragLeave(event2);
      this.onRowDragEnd(event2);
      event2.preventDefault();
    },
    toggleRow: function toggleRow2(event2) {
      var _this9 = this;
      var expanded = event2.expanded, rest = _objectWithoutProperties(event2, _excluded);
      var rowData = event2.data;
      var expandedRows;
      if (this.dataKey) {
        var value = ObjectUtils.resolveFieldData(rowData, this.dataKey);
        expandedRows = this.expandedRows ? _objectSpread$1({}, this.expandedRows) : {};
        expanded ? expandedRows[value] = true : delete expandedRows[value];
      } else {
        expandedRows = this.expandedRows ? _toConsumableArray(this.expandedRows) : [];
        expanded ? expandedRows.push(rowData) : expandedRows = expandedRows.filter(function(d) {
          return !_this9.equals(rowData, d);
        });
      }
      this.$emit("update:expandedRows", expandedRows);
      expanded ? this.$emit("row-expand", rest) : this.$emit("row-collapse", rest);
    },
    toggleRowGroup: function toggleRowGroup(e) {
      var event2 = e.originalEvent;
      var data17 = e.data;
      var groupFieldValue = ObjectUtils.resolveFieldData(data17, this.groupRowsBy);
      var _expandedRowGroups = this.expandedRowGroups ? _toConsumableArray(this.expandedRowGroups) : [];
      if (this.isRowGroupExpanded(data17)) {
        _expandedRowGroups = _expandedRowGroups.filter(function(group) {
          return group !== groupFieldValue;
        });
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-collapse", {
          originalEvent: event2,
          data: groupFieldValue
        });
      } else {
        _expandedRowGroups.push(groupFieldValue);
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-expand", {
          originalEvent: event2,
          data: groupFieldValue
        });
      }
    },
    isRowGroupExpanded: function isRowGroupExpanded2(rowData) {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        var groupFieldValue = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isStateful: function isStateful() {
      return this.stateKey != null;
    },
    getStorage: function getStorage() {
      switch (this.stateStorage) {
        case "local":
          return window.localStorage;
        case "session":
          return window.sessionStorage;
        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    },
    saveState: function saveState() {
      var storage = this.getStorage();
      var state = {};
      if (this.paginator) {
        state.first = this.d_first;
        state.rows = this.d_rows;
      }
      if (this.d_sortField) {
        state.sortField = this.d_sortField;
        state.sortOrder = this.d_sortOrder;
      }
      if (this.d_multiSortMeta) {
        state.multiSortMeta = this.d_multiSortMeta;
      }
      if (this.hasFilters) {
        state.filters = this.filters;
      }
      if (this.resizableColumns) {
        this.saveColumnWidths(state);
      }
      if (this.reorderableColumns) {
        state.columnOrder = this.d_columnOrder;
      }
      if (this.expandedRows) {
        state.expandedRows = this.expandedRows;
      }
      if (this.expandedRowGroups) {
        state.expandedRowGroups = this.expandedRowGroups;
      }
      if (this.selection) {
        state.selection = this.selection;
        state.selectionKeys = this.d_selectionKeys;
      }
      if (Object.keys(state).length) {
        storage.setItem(this.stateKey, JSON.stringify(state));
      }
      this.$emit("state-save", state);
    },
    restoreState: function restoreState() {
      var storage = this.getStorage();
      var stateString = storage.getItem(this.stateKey);
      var dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
      var reviver = function reviver2(key, value) {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      };
      if (stateString) {
        var restoredState = JSON.parse(stateString, reviver);
        if (this.paginator) {
          this.d_first = restoredState.first;
          this.d_rows = restoredState.rows;
        }
        if (restoredState.sortField) {
          this.d_sortField = restoredState.sortField;
          this.d_sortOrder = restoredState.sortOrder;
        }
        if (restoredState.multiSortMeta) {
          this.d_multiSortMeta = restoredState.multiSortMeta;
        }
        if (restoredState.filters) {
          this.$emit("update:filters", restoredState.filters);
        }
        if (this.resizableColumns) {
          this.columnWidthsState = restoredState.columnWidths;
          this.tableWidthState = restoredState.tableWidth;
        }
        if (this.reorderableColumns) {
          this.d_columnOrder = restoredState.columnOrder;
        }
        if (restoredState.expandedRows) {
          this.$emit("update:expandedRows", restoredState.expandedRows);
        }
        if (restoredState.expandedRowGroups) {
          this.$emit("update:expandedRowGroups", restoredState.expandedRowGroups);
        }
        if (restoredState.selection) {
          this.d_selectionKeys = restoredState.d_selectionKeys;
          this.$emit("update:selection", restoredState.selection);
        }
        this.$emit("state-restore", restoredState);
      }
    },
    saveColumnWidths: function saveColumnWidths(state) {
      var widths = [];
      var headers = DomHandler.find(this.$el, 'thead[data-pc-section="thead"] > tr > th');
      headers.forEach(function(header) {
        return widths.push(DomHandler.getOuterWidth(header));
      });
      state.columnWidths = widths.join(",");
      if (this.columnResizeMode === "expand") {
        state.tableWidth = DomHandler.getOuterWidth(this.$refs.table) + "px";
      }
    },
    addColumnWidthStyles: function addColumnWidthStyles(widths) {
      this.createStyleElement();
      var innerHTML = "";
      var selector = '[data-pc-name="datatable"]['.concat(this.attributeSelector, '] > [data-pc-section="wrapper"] ').concat(this.virtualScrollerDisabled ? "" : '> [data-pc-name="virtualscroller"]', ' > table[data-pc-section="table"]');
      widths.forEach(function(width2, index2) {
        var style = "width: ".concat(width2, "px !important; max-width: ").concat(width2, "px !important");
        innerHTML += "\n        ".concat(selector, ' > thead[data-pc-section="thead"] > tr > th:nth-child(').concat(index2 + 1, "),\n        ").concat(selector, ' > tbody[data-pc-section="tbody"] > tr > td:nth-child(').concat(index2 + 1, "),\n        ").concat(selector, ' > tfoot[data-pc-section="tfoot"] > tr > td:nth-child(').concat(index2 + 1, ") {\n            ").concat(style, "\n        }\n    ");
      });
      this.styleElement.innerHTML = innerHTML;
    },
    restoreColumnWidths: function restoreColumnWidths() {
      if (this.columnWidthsState) {
        var widths = this.columnWidthsState.split(",");
        if (this.columnResizeMode === "expand" && this.tableWidthState) {
          this.$refs.table.style.width = this.tableWidthState;
          this.$refs.table.style.minWidth = this.tableWidthState;
        }
        if (ObjectUtils.isNotEmpty(widths)) {
          this.addColumnWidthStyles(widths);
        }
      }
    },
    onCellEditInit: function onCellEditInit2(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete: function onCellEditComplete2(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel: function onCellEditCancel2(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit: function onRowEditInit3(event2) {
      var _editingRows = this.editingRows ? _toConsumableArray(this.editingRows) : [];
      _editingRows.push(event2.data);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave: function onRowEditSave3(event2) {
      var _editingRows = _toConsumableArray(this.editingRows);
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel: function onRowEditCancel3(event2) {
      var _editingRows = _toConsumableArray(this.editingRows);
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange: function onEditingMetaChange2(event2) {
      var data17 = event2.data, field2 = event2.field, index2 = event2.index, editing2 = event2.editing;
      var editingMeta = _objectSpread$1({}, this.d_editingMeta);
      var meta = editingMeta[index2];
      if (editing2) {
        !meta && (meta = editingMeta[index2] = {
          data: _objectSpread$1({}, data17),
          fields: []
        });
        meta["fields"].push(field2);
      } else if (meta) {
        var fields = meta["fields"].filter(function(f) {
          return f !== field2;
        });
        !fields.length ? delete editingMeta[index2] : meta["fields"] = fields;
      }
      this.d_editingMeta = editingMeta;
    },
    clearEditingMetaData: function clearEditingMetaData() {
      if (this.editMode) {
        this.d_editingMeta = {};
      }
    },
    createLazyLoadEvent: function createLazyLoadEvent(event2) {
      return {
        originalEvent: event2,
        first: this.d_first,
        rows: this.d_rows,
        sortField: this.d_sortField,
        sortOrder: this.d_sortOrder,
        multiSortMeta: this.d_multiSortMeta,
        filters: this.d_filters
      };
    },
    hasGlobalFilter: function hasGlobalFilter() {
      return this.filters && Object.prototype.hasOwnProperty.call(this.filters, "global");
    },
    onFilterChange: function onFilterChange2(filters) {
      this.d_filters = filters;
    },
    onFilterApply: function onFilterApply() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
      this.$emit("update:filters", this.d_filters);
      if (this.lazy) {
        this.$emit("filter", this.createLazyLoadEvent());
      }
    },
    cloneFilters: function cloneFilters() {
      var cloned = {};
      if (this.filters) {
        Object.entries(this.filters).forEach(function(_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2), prop = _ref4[0], value = _ref4[1];
          cloned[prop] = value.operator ? {
            operator: value.operator,
            constraints: value.constraints.map(function(constraint) {
              return _objectSpread$1({}, constraint);
            })
          } : _objectSpread$1({}, value);
        });
      }
      return cloned;
    },
    updateReorderableColumns: function updateReorderableColumns() {
      var _this10 = this;
      var columnOrder = [];
      this.columns.forEach(function(col) {
        return columnOrder.push(_this10.columnProp(col, "columnKey") || _this10.columnProp(col, "field"));
      });
      this.d_columnOrder = columnOrder;
    },
    createStyleElement: function createStyleElement() {
      var _this$$primevue;
      this.styleElement = document.createElement("style");
      this.styleElement.type = "text/css";
      DomHandler.setAttribute(this.styleElement, "nonce", (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.csp) === null || _this$$primevue === void 0 ? void 0 : _this$$primevue.nonce);
      document.head.appendChild(this.styleElement);
    },
    createResponsiveStyle: function createResponsiveStyle() {
      if (!this.responsiveStyleElement) {
        var _this$$primevue2;
        this.responsiveStyleElement = document.createElement("style");
        this.responsiveStyleElement.type = "text/css";
        DomHandler.setAttribute(this.responsiveStyleElement, "nonce", (_this$$primevue2 = this.$primevue) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.config) === null || _this$$primevue2 === void 0 || (_this$$primevue2 = _this$$primevue2.csp) === null || _this$$primevue2 === void 0 ? void 0 : _this$$primevue2.nonce);
        document.head.appendChild(this.responsiveStyleElement);
        var tableSelector = ".p-datatable-wrapper ".concat(this.virtualScrollerDisabled ? "" : "> .p-virtualscroller", " > .p-datatable-table");
        var selector = ".p-datatable[".concat(this.attributeSelector, "] > ").concat(tableSelector);
        var gridLinesSelector = ".p-datatable[".concat(this.attributeSelector, "].p-datatable-gridlines > ").concat(tableSelector);
        var innerHTML = "\n@media screen and (max-width: ".concat(this.breakpoint, ") {\n    ").concat(selector, " > .p-datatable-thead > tr > th,\n    ").concat(selector, " > .p-datatable-tfoot > tr > td {\n        display: none;\n    }\n\n    ").concat(selector, " > .p-datatable-tbody > tr > td {\n        display: flex;\n        width: 100%;\n        align-items: center;\n        justify-content: space-between;\n    }\n\n    ").concat(selector, " > .p-datatable-tbody > tr > td:not(:last-child) {\n        border: 0 none;\n    }\n\n    ").concat(gridLinesSelector, " > .p-datatable-tbody > tr > td:last-child {\n        border-top: 0;\n        border-right: 0;\n        border-left: 0;\n    }\n\n    ").concat(selector, " > .p-datatable-tbody > tr > td > .p-column-title {\n        display: block;\n    }\n}\n");
        this.responsiveStyleElement.innerHTML = innerHTML;
      }
    },
    destroyResponsiveStyle: function destroyResponsiveStyle() {
      if (this.responsiveStyleElement) {
        document.head.removeChild(this.responsiveStyleElement);
        this.responsiveStyleElement = null;
      }
    },
    destroyStyleElement: function destroyStyleElement() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement);
        this.styleElement = null;
      }
    },
    dataToRender: function dataToRender(data17) {
      var _data = data17 || this.processedData;
      if (_data && this.paginator) {
        var first3 = this.lazy ? 0 : this.d_first;
        return _data.slice(first3, first3 + this.d_rows);
      }
      return _data;
    },
    getVirtualScrollerRef: function getVirtualScrollerRef() {
      return this.$refs.virtualScroller;
    },
    hasSpacerStyle: function hasSpacerStyle(style) {
      return ObjectUtils.isNotEmpty(style);
    }
  },
  computed: {
    columns: function columns() {
      var cols = this.d_columns.get(this);
      if (this.reorderableColumns && this.d_columnOrder) {
        var orderedColumns = [];
        var _iterator5 = _createForOfIteratorHelper(this.d_columnOrder), _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
            var columnKey = _step5.value;
            var column = this.findColumnByKey(cols, columnKey);
            if (column && !this.columnProp(column, "hidden")) {
              orderedColumns.push(column);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        return [].concat(orderedColumns, _toConsumableArray(cols.filter(function(item2) {
          return orderedColumns.indexOf(item2) < 0;
        })));
      }
      return cols;
    },
    columnGroups: function columnGroups() {
      return this.d_columnGroups.get(this);
    },
    headerColumnGroup: function headerColumnGroup() {
      var _this$columnGroups, _this11 = this;
      return (_this$columnGroups = this.columnGroups) === null || _this$columnGroups === void 0 ? void 0 : _this$columnGroups.find(function(group) {
        return _this11.columnProp(group, "type") === "header";
      });
    },
    footerColumnGroup: function footerColumnGroup() {
      var _this$columnGroups2, _this12 = this;
      return (_this$columnGroups2 = this.columnGroups) === null || _this$columnGroups2 === void 0 ? void 0 : _this$columnGroups2.find(function(group) {
        return _this12.columnProp(group, "type") === "footer";
      });
    },
    hasFilters: function hasFilters() {
      return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
    },
    processedData: function processedData() {
      var _this$virtualScroller;
      var data17 = this.value || [];
      if (!this.lazy && !((_this$virtualScroller = this.virtualScrollerOptions) !== null && _this$virtualScroller !== void 0 && _this$virtualScroller.lazy)) {
        if (data17 && data17.length) {
          if (this.hasFilters) {
            data17 = this.filter(data17);
          }
          if (this.sorted) {
            if (this.sortMode === "single")
              data17 = this.sortSingle(data17);
            else if (this.sortMode === "multiple")
              data17 = this.sortMultiple(data17);
          }
        }
      }
      return data17;
    },
    totalRecordsLength: function totalRecordsLength() {
      if (this.lazy) {
        return this.totalRecords;
      } else {
        var data17 = this.processedData;
        return data17 ? data17.length : 0;
      }
    },
    empty: function empty2() {
      var data17 = this.processedData;
      return !data17 || data17.length === 0;
    },
    paginatorTop: function paginatorTop() {
      return this.paginator && (this.paginatorPosition !== "bottom" || this.paginatorPosition === "both");
    },
    paginatorBottom: function paginatorBottom() {
      return this.paginator && (this.paginatorPosition !== "top" || this.paginatorPosition === "both");
    },
    sorted: function sorted() {
      return this.d_sortField || this.d_multiSortMeta && this.d_multiSortMeta.length > 0;
    },
    allRowsSelected: function allRowsSelected() {
      var _this13 = this;
      if (this.selectAll !== null) {
        return this.selectAll;
      } else {
        var val = this.frozenValue ? [].concat(_toConsumableArray(this.frozenValue), _toConsumableArray(this.processedData)) : this.processedData;
        return ObjectUtils.isNotEmpty(val) && this.selection && Array.isArray(this.selection) && val.every(function(v) {
          return _this13.selection.some(function(s) {
            return _this13.equals(s, v);
          });
        });
      }
    },
    attributeSelector: function attributeSelector2() {
      return UniqueComponentId();
    },
    groupRowSortField: function groupRowSortField() {
      return this.sortMode === "single" ? this.sortField : this.d_groupRowsSortMeta ? this.d_groupRowsSortMeta.field : null;
    },
    virtualScrollerDisabled: function virtualScrollerDisabled2() {
      return ObjectUtils.isEmpty(this.virtualScrollerOptions) || !this.scrollable;
    }
  },
  components: {
    DTPaginator: script$o,
    DTTableHeader: script$1$1,
    DTTableBody: script$7,
    DTTableFooter: script$5,
    DTVirtualScroller: script$v,
    ArrowDownIcon: script$E,
    ArrowUpIcon: script$D,
    SpinnerIcon: script$G
  }
};
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : String(i);
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i))
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  var _component_DTPaginator = resolveComponent("DTPaginator");
  var _component_DTTableHeader = resolveComponent("DTTableHeader");
  var _component_DTTableBody = resolveComponent("DTTableBody");
  var _component_DTTableFooter = resolveComponent("DTTableFooter");
  var _component_DTVirtualScroller = resolveComponent("DTVirtualScroller");
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root"),
    "data-scrollselectors": ".p-datatable-wrapper"
  }, _ctx.ptm("root"), {
    "data-pc-name": "datatable"
  }), [renderSlot(_ctx.$slots, "default"), _ctx.loading ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    "class": _ctx.cx("loadingOverlay")
  }, _ctx.ptm("loadingOverlay")), [_ctx.$slots.loading ? renderSlot(_ctx.$slots, "loading", {
    key: 0
  }) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [_ctx.$slots.loadingicon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.loadingicon), {
    key: 0,
    "class": normalizeClass(_ctx.cx("loadingIcon"))
  }, null, 8, ["class"])) : _ctx.loadingIcon ? (openBlock(), createElementBlock("i", mergeProps({
    key: 1,
    "class": [_ctx.cx("loadingIcon"), "pi-spin", _ctx.loadingIcon]
  }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
    key: 2,
    spin: "",
    "class": _ctx.cx("loadingIcon")
  }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))], 64))], 16)) : createCommentVNode("", true), _ctx.$slots.header ? (openBlock(), createElementBlock("div", mergeProps({
    key: 1,
    "class": _ctx.cx("header")
  }, _ctx.ptm("header")), [renderSlot(_ctx.$slots, "header")], 16)) : createCommentVNode("", true), $options.paginatorTop ? (openBlock(), createBlock(_component_DTPaginator, {
    key: 2,
    rows: $data.d_rows,
    first: $data.d_first,
    totalRecords: $options.totalRecordsLength,
    pageLinkSize: _ctx.pageLinkSize,
    template: _ctx.paginatorTemplate,
    rowsPerPageOptions: _ctx.rowsPerPageOptions,
    currentPageReportTemplate: _ctx.currentPageReportTemplate,
    "class": normalizeClass(_ctx.cx("paginator")),
    onPage: _cache[0] || (_cache[0] = function($event) {
      return $options.onPage($event);
    }),
    alwaysShow: _ctx.alwaysShowPaginator,
    unstyled: _ctx.unstyled,
    pt: _ctx.ptm("paginator")
  }, createSlots({
    _: 2
  }, [_ctx.$slots.paginatorstart ? {
    name: "start",
    fn: withCtx(function() {
      return [renderSlot(_ctx.$slots, "paginatorstart")];
    }),
    key: "0"
  } : void 0, _ctx.$slots.paginatorend ? {
    name: "end",
    fn: withCtx(function() {
      return [renderSlot(_ctx.$slots, "paginatorend")];
    }),
    key: "1"
  } : void 0, _ctx.$slots.paginatorfirstpagelinkicon ? {
    name: "firstpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorfirstpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "2"
  } : void 0, _ctx.$slots.paginatorprevpagelinkicon ? {
    name: "prevpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorprevpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "3"
  } : void 0, _ctx.$slots.paginatornextpagelinkicon ? {
    name: "nextpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatornextpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "4"
  } : void 0, _ctx.$slots.paginatorlastpagelinkicon ? {
    name: "lastpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorlastpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "5"
  } : void 0, _ctx.$slots.paginatorjumptopagedropdownicon ? {
    name: "jumptopagedropdownicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorjumptopagedropdownicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "6"
  } : void 0, _ctx.$slots.paginatorrowsperpagedropdownicon ? {
    name: "rowsperpagedropdownicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorrowsperpagedropdownicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "7"
  } : void 0]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "class", "alwaysShow", "unstyled", "pt"])) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
    "class": _ctx.cx("wrapper"),
    style: [_ctx.sx("wrapper"), {
      maxHeight: $options.virtualScrollerDisabled ? _ctx.scrollHeight : ""
    }]
  }, _ctx.ptm("wrapper")), [createVNode(_component_DTVirtualScroller, mergeProps({
    ref: "virtualScroller"
  }, _ctx.virtualScrollerOptions, {
    items: $options.processedData,
    columns: $options.columns,
    style: _ctx.scrollHeight !== "flex" ? {
      height: _ctx.scrollHeight
    } : void 0,
    scrollHeight: _ctx.scrollHeight !== "flex" ? void 0 : "100%",
    disabled: $options.virtualScrollerDisabled,
    loaderDisabled: "",
    inline: "",
    autoSize: "",
    showSpacer: false,
    pt: _ctx.ptm("virtualScroller")
  }), {
    content: withCtx(function(slotProps) {
      return [createBaseVNode("table", mergeProps({
        ref: "table",
        role: "table",
        "class": [_ctx.cx("table"), _ctx.tableClass],
        style: [_ctx.tableStyle, slotProps.spacerStyle]
      }, _objectSpread(_objectSpread({}, _ctx.tableProps), _ctx.ptm("table"))), [createVNode(_component_DTTableHeader, {
        columnGroup: $options.headerColumnGroup,
        columns: slotProps.columns,
        rowGroupMode: _ctx.rowGroupMode,
        groupRowsBy: _ctx.groupRowsBy,
        groupRowSortField: $options.groupRowSortField,
        reorderableColumns: _ctx.reorderableColumns,
        resizableColumns: _ctx.resizableColumns,
        allRowsSelected: $options.allRowsSelected,
        empty: $options.empty,
        sortMode: _ctx.sortMode,
        sortField: $data.d_sortField,
        sortOrder: $data.d_sortOrder,
        multiSortMeta: $data.d_multiSortMeta,
        filters: $data.d_filters,
        filtersStore: _ctx.filters,
        filterDisplay: _ctx.filterDisplay,
        filterInputProps: _ctx.filterInputProps,
        onColumnClick: _cache[1] || (_cache[1] = function($event) {
          return $options.onColumnHeaderClick($event);
        }),
        onColumnMousedown: _cache[2] || (_cache[2] = function($event) {
          return $options.onColumnHeaderMouseDown($event);
        }),
        onFilterChange: $options.onFilterChange,
        onFilterApply: $options.onFilterApply,
        onColumnDragstart: _cache[3] || (_cache[3] = function($event) {
          return $options.onColumnHeaderDragStart($event);
        }),
        onColumnDragover: _cache[4] || (_cache[4] = function($event) {
          return $options.onColumnHeaderDragOver($event);
        }),
        onColumnDragleave: _cache[5] || (_cache[5] = function($event) {
          return $options.onColumnHeaderDragLeave($event);
        }),
        onColumnDrop: _cache[6] || (_cache[6] = function($event) {
          return $options.onColumnHeaderDrop($event);
        }),
        onColumnResizestart: _cache[7] || (_cache[7] = function($event) {
          return $options.onColumnResizeStart($event);
        }),
        onCheckboxChange: _cache[8] || (_cache[8] = function($event) {
          return $options.toggleRowsWithCheckbox($event);
        }),
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["columnGroup", "columns", "rowGroupMode", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "allRowsSelected", "empty", "sortMode", "sortField", "sortOrder", "multiSortMeta", "filters", "filtersStore", "filterDisplay", "filterInputProps", "onFilterChange", "onFilterApply", "unstyled", "pt"]), _ctx.frozenValue ? (openBlock(), createBlock(_component_DTTableBody, {
        key: 0,
        ref: "frozenBodyRef",
        value: _ctx.frozenValue,
        frozenRow: true,
        columns: slotProps.columns,
        first: $data.d_first,
        dataKey: _ctx.dataKey,
        selection: _ctx.selection,
        selectionKeys: $data.d_selectionKeys,
        selectionMode: _ctx.selectionMode,
        contextMenu: _ctx.contextMenu,
        contextMenuSelection: _ctx.contextMenuSelection,
        rowGroupMode: _ctx.rowGroupMode,
        groupRowsBy: _ctx.groupRowsBy,
        expandableRowGroups: _ctx.expandableRowGroups,
        rowClass: _ctx.rowClass,
        rowStyle: _ctx.rowStyle,
        editMode: _ctx.editMode,
        compareSelectionBy: _ctx.compareSelectionBy,
        scrollable: _ctx.scrollable,
        expandedRowIcon: _ctx.expandedRowIcon,
        collapsedRowIcon: _ctx.collapsedRowIcon,
        expandedRows: _ctx.expandedRows,
        expandedRowGroups: _ctx.expandedRowGroups,
        editingRows: _ctx.editingRows,
        editingRowKeys: $data.d_editingRowKeys,
        templates: _ctx.$slots,
        responsiveLayout: _ctx.responsiveLayout,
        isVirtualScrollerDisabled: true,
        onRowgroupToggle: $options.toggleRowGroup,
        onRowClick: _cache[9] || (_cache[9] = function($event) {
          return $options.onRowClick($event);
        }),
        onRowDblclick: _cache[10] || (_cache[10] = function($event) {
          return $options.onRowDblClick($event);
        }),
        onRowRightclick: _cache[11] || (_cache[11] = function($event) {
          return $options.onRowRightClick($event);
        }),
        onRowTouchend: $options.onRowTouchEnd,
        onRowKeydown: $options.onRowKeyDown,
        onRowMousedown: $options.onRowMouseDown,
        onRowDragstart: _cache[12] || (_cache[12] = function($event) {
          return $options.onRowDragStart($event);
        }),
        onRowDragover: _cache[13] || (_cache[13] = function($event) {
          return $options.onRowDragOver($event);
        }),
        onRowDragleave: _cache[14] || (_cache[14] = function($event) {
          return $options.onRowDragLeave($event);
        }),
        onRowDragend: _cache[15] || (_cache[15] = function($event) {
          return $options.onRowDragEnd($event);
        }),
        onRowDrop: _cache[16] || (_cache[16] = function($event) {
          return $options.onRowDrop($event);
        }),
        onRowToggle: _cache[17] || (_cache[17] = function($event) {
          return $options.toggleRow($event);
        }),
        onRadioChange: _cache[18] || (_cache[18] = function($event) {
          return $options.toggleRowWithRadio($event);
        }),
        onCheckboxChange: _cache[19] || (_cache[19] = function($event) {
          return $options.toggleRowWithCheckbox($event);
        }),
        onCellEditInit: _cache[20] || (_cache[20] = function($event) {
          return $options.onCellEditInit($event);
        }),
        onCellEditComplete: _cache[21] || (_cache[21] = function($event) {
          return $options.onCellEditComplete($event);
        }),
        onCellEditCancel: _cache[22] || (_cache[22] = function($event) {
          return $options.onCellEditCancel($event);
        }),
        onRowEditInit: _cache[23] || (_cache[23] = function($event) {
          return $options.onRowEditInit($event);
        }),
        onRowEditSave: _cache[24] || (_cache[24] = function($event) {
          return $options.onRowEditSave($event);
        }),
        onRowEditCancel: _cache[25] || (_cache[25] = function($event) {
          return $options.onRowEditCancel($event);
        }),
        editingMeta: $data.d_editingMeta,
        onEditingMetaChange: $options.onEditingMetaChange,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["value", "columns", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange", "unstyled", "pt"])) : createCommentVNode("", true), createVNode(_component_DTTableBody, {
        ref: "bodyRef",
        value: $options.dataToRender(slotProps.rows),
        "class": normalizeClass(slotProps.styleClass),
        columns: slotProps.columns,
        empty: $options.empty,
        first: $data.d_first,
        dataKey: _ctx.dataKey,
        selection: _ctx.selection,
        selectionKeys: $data.d_selectionKeys,
        selectionMode: _ctx.selectionMode,
        contextMenu: _ctx.contextMenu,
        contextMenuSelection: _ctx.contextMenuSelection,
        rowGroupMode: _ctx.rowGroupMode,
        groupRowsBy: _ctx.groupRowsBy,
        expandableRowGroups: _ctx.expandableRowGroups,
        rowClass: _ctx.rowClass,
        rowStyle: _ctx.rowStyle,
        editMode: _ctx.editMode,
        compareSelectionBy: _ctx.compareSelectionBy,
        scrollable: _ctx.scrollable,
        expandedRowIcon: _ctx.expandedRowIcon,
        collapsedRowIcon: _ctx.collapsedRowIcon,
        expandedRows: _ctx.expandedRows,
        expandedRowGroups: _ctx.expandedRowGroups,
        editingRows: _ctx.editingRows,
        editingRowKeys: $data.d_editingRowKeys,
        templates: _ctx.$slots,
        responsiveLayout: _ctx.responsiveLayout,
        virtualScrollerContentProps: slotProps,
        isVirtualScrollerDisabled: $options.virtualScrollerDisabled,
        onRowgroupToggle: $options.toggleRowGroup,
        onRowClick: _cache[26] || (_cache[26] = function($event) {
          return $options.onRowClick($event);
        }),
        onRowDblclick: _cache[27] || (_cache[27] = function($event) {
          return $options.onRowDblClick($event);
        }),
        onRowRightclick: _cache[28] || (_cache[28] = function($event) {
          return $options.onRowRightClick($event);
        }),
        onRowTouchend: $options.onRowTouchEnd,
        onRowKeydown: function onRowKeydown($event) {
          return $options.onRowKeyDown($event, slotProps);
        },
        onRowMousedown: $options.onRowMouseDown,
        onRowDragstart: _cache[29] || (_cache[29] = function($event) {
          return $options.onRowDragStart($event);
        }),
        onRowDragover: _cache[30] || (_cache[30] = function($event) {
          return $options.onRowDragOver($event);
        }),
        onRowDragleave: _cache[31] || (_cache[31] = function($event) {
          return $options.onRowDragLeave($event);
        }),
        onRowDragend: _cache[32] || (_cache[32] = function($event) {
          return $options.onRowDragEnd($event);
        }),
        onRowDrop: _cache[33] || (_cache[33] = function($event) {
          return $options.onRowDrop($event);
        }),
        onRowToggle: _cache[34] || (_cache[34] = function($event) {
          return $options.toggleRow($event);
        }),
        onRadioChange: _cache[35] || (_cache[35] = function($event) {
          return $options.toggleRowWithRadio($event);
        }),
        onCheckboxChange: _cache[36] || (_cache[36] = function($event) {
          return $options.toggleRowWithCheckbox($event);
        }),
        onCellEditInit: _cache[37] || (_cache[37] = function($event) {
          return $options.onCellEditInit($event);
        }),
        onCellEditComplete: _cache[38] || (_cache[38] = function($event) {
          return $options.onCellEditComplete($event);
        }),
        onCellEditCancel: _cache[39] || (_cache[39] = function($event) {
          return $options.onCellEditCancel($event);
        }),
        onRowEditInit: _cache[40] || (_cache[40] = function($event) {
          return $options.onRowEditInit($event);
        }),
        onRowEditSave: _cache[41] || (_cache[41] = function($event) {
          return $options.onRowEditSave($event);
        }),
        onRowEditCancel: _cache[42] || (_cache[42] = function($event) {
          return $options.onRowEditCancel($event);
        }),
        editingMeta: $data.d_editingMeta,
        onEditingMetaChange: $options.onEditingMetaChange,
        unstyled: _ctx.unstyled,
        pt: _ctx.pt
      }, null, 8, ["value", "class", "columns", "empty", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "virtualScrollerContentProps", "isVirtualScrollerDisabled", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange", "unstyled", "pt"]), $options.hasSpacerStyle(slotProps.spacerStyle) ? (openBlock(), createElementBlock("tbody", mergeProps({
        key: 1,
        "class": _ctx.cx("virtualScrollerSpacer"),
        style: {
          height: "calc(".concat(slotProps.spacerStyle.height, " - ").concat(slotProps.rows.length * slotProps.itemSize, "px)")
        }
      }, _ctx.ptm("virtualScrollerSpacer")), null, 16)) : createCommentVNode("", true), createVNode(_component_DTTableFooter, {
        columnGroup: $options.footerColumnGroup,
        columns: slotProps.columns,
        pt: _ctx.pt
      }, null, 8, ["columnGroup", "columns", "pt"])], 16)];
    }),
    _: 1
  }, 16, ["items", "columns", "style", "scrollHeight", "disabled", "pt"])], 16), _ctx.$slots.footer ? (openBlock(), createElementBlock("div", mergeProps({
    key: 3,
    "class": _ctx.cx("footer")
  }, _ctx.ptm("footer")), [renderSlot(_ctx.$slots, "footer")], 16)) : createCommentVNode("", true), $options.paginatorBottom ? (openBlock(), createBlock(_component_DTPaginator, {
    key: 4,
    rows: $data.d_rows,
    first: $data.d_first,
    totalRecords: $options.totalRecordsLength,
    pageLinkSize: _ctx.pageLinkSize,
    template: _ctx.paginatorTemplate,
    rowsPerPageOptions: _ctx.rowsPerPageOptions,
    currentPageReportTemplate: _ctx.currentPageReportTemplate,
    "class": normalizeClass(_ctx.cx("paginator")),
    onPage: _cache[43] || (_cache[43] = function($event) {
      return $options.onPage($event);
    }),
    alwaysShow: _ctx.alwaysShowPaginator,
    unstyled: _ctx.unstyled,
    pt: _ctx.ptm("paginator")
  }, createSlots({
    _: 2
  }, [_ctx.$slots.paginatorstart ? {
    name: "start",
    fn: withCtx(function() {
      return [renderSlot(_ctx.$slots, "paginatorstart")];
    }),
    key: "0"
  } : void 0, _ctx.$slots.paginatorend ? {
    name: "end",
    fn: withCtx(function() {
      return [renderSlot(_ctx.$slots, "paginatorend")];
    }),
    key: "1"
  } : void 0, _ctx.$slots.paginatorfirstpagelinkicon ? {
    name: "firstpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorfirstpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "2"
  } : void 0, _ctx.$slots.paginatorprevpagelinkicon ? {
    name: "prevpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorprevpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "3"
  } : void 0, _ctx.$slots.paginatornextpagelinkicon ? {
    name: "nextpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatornextpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "4"
  } : void 0, _ctx.$slots.paginatorlastpagelinkicon ? {
    name: "lastpagelinkicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorlastpagelinkicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "5"
  } : void 0, _ctx.$slots.paginatorjumptopagedropdownicon ? {
    name: "jumptopagedropdownicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorjumptopagedropdownicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "6"
  } : void 0, _ctx.$slots.paginatorrowsperpagedropdownicon ? {
    name: "rowsperpagedropdownicon",
    fn: withCtx(function(slotProps) {
      return [renderSlot(_ctx.$slots, "paginatorrowsperpagedropdownicon", {
        "class": normalizeClass(slotProps["class"])
      })];
    }),
    key: "7"
  } : void 0]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "class", "alwaysShow", "unstyled", "pt"])) : createCommentVNode("", true), createBaseVNode("div", mergeProps({
    ref: "resizeHelper",
    "class": _ctx.cx("resizeHelper"),
    style: {
      "display": "none"
    }
  }, _ctx.ptm("resizeHelper")), null, 16), _ctx.reorderableColumns ? (openBlock(), createElementBlock("span", mergeProps({
    key: 5,
    ref: "reorderIndicatorUp",
    "class": _ctx.cx("reorderIndicatorUp"),
    style: {
      "position": "absolute",
      "display": "none"
    }
  }, _ctx.ptm("reorderIndicatorUp")), [(openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.reorderindicatorupicon || "ArrowDownIcon")))], 16)) : createCommentVNode("", true), _ctx.reorderableColumns ? (openBlock(), createElementBlock("span", mergeProps({
    key: 6,
    ref: "reorderIndicatorDown",
    "class": _ctx.cx("reorderIndicatorDown"),
    style: {
      "position": "absolute",
      "display": "none"
    }
  }, _ctx.ptm("reorderIndicatorDown")), [(openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.reorderindicatordownicon || "ArrowUpIcon")))], 16)) : createCommentVNode("", true)], 16);
}
script$d.render = render;
var ColumnStyle = {};
var script$1 = {
  name: "BaseColumn",
  "extends": script$N,
  props: {
    columnKey: {
      type: null,
      "default": null
    },
    field: {
      type: [String, Function],
      "default": null
    },
    sortField: {
      type: [String, Function],
      "default": null
    },
    filterField: {
      type: [String, Function],
      "default": null
    },
    dataType: {
      type: String,
      "default": "text"
    },
    sortable: {
      type: Boolean,
      "default": false
    },
    header: {
      type: null,
      "default": null
    },
    footer: {
      type: null,
      "default": null
    },
    style: {
      type: null,
      "default": null
    },
    "class": {
      type: String,
      "default": null
    },
    headerStyle: {
      type: null,
      "default": null
    },
    headerClass: {
      type: String,
      "default": null
    },
    bodyStyle: {
      type: null,
      "default": null
    },
    bodyClass: {
      type: String,
      "default": null
    },
    footerStyle: {
      type: null,
      "default": null
    },
    footerClass: {
      type: String,
      "default": null
    },
    showFilterMenu: {
      type: Boolean,
      "default": true
    },
    showFilterOperator: {
      type: Boolean,
      "default": true
    },
    showClearButton: {
      type: Boolean,
      "default": true
    },
    showApplyButton: {
      type: Boolean,
      "default": true
    },
    showFilterMatchModes: {
      type: Boolean,
      "default": true
    },
    showAddButton: {
      type: Boolean,
      "default": true
    },
    filterMatchModeOptions: {
      type: Array,
      "default": null
    },
    maxConstraints: {
      type: Number,
      "default": 2
    },
    excludeGlobalFilter: {
      type: Boolean,
      "default": false
    },
    filterHeaderClass: {
      type: String,
      "default": null
    },
    filterHeaderStyle: {
      type: null,
      "default": null
    },
    filterMenuClass: {
      type: String,
      "default": null
    },
    filterMenuStyle: {
      type: null,
      "default": null
    },
    selectionMode: {
      type: String,
      "default": null
    },
    expander: {
      type: Boolean,
      "default": false
    },
    colspan: {
      type: Number,
      "default": null
    },
    rowspan: {
      type: Number,
      "default": null
    },
    rowReorder: {
      type: Boolean,
      "default": false
    },
    rowReorderIcon: {
      type: String,
      "default": void 0
    },
    reorderableColumn: {
      type: Boolean,
      "default": true
    },
    rowEditor: {
      type: Boolean,
      "default": false
    },
    frozen: {
      type: Boolean,
      "default": false
    },
    alignFrozen: {
      type: String,
      "default": "left"
    },
    exportable: {
      type: Boolean,
      "default": true
    },
    exportHeader: {
      type: String,
      "default": null
    },
    exportFooter: {
      type: String,
      "default": null
    },
    filterMatchMode: {
      type: String,
      "default": null
    },
    hidden: {
      type: Boolean,
      "default": false
    }
  },
  style: ColumnStyle,
  provide: function provide16() {
    return {
      $parentInstance: this
    };
  }
};
var script = {
  name: "Column",
  "extends": script$1,
  inject: ["$columns"],
  mounted: function mounted15() {
    var _this$$columns;
    (_this$$columns = this.$columns) === null || _this$$columns === void 0 || _this$$columns.add(this.$);
  },
  unmounted: function unmounted5() {
    var _this$$columns2;
    (_this$$columns2 = this.$columns) === null || _this$$columns2 === void 0 || _this$$columns2["delete"](this.$);
  },
  render: function render2() {
    return null;
  }
};
const _imports_0$1 = "" + new URL("experience-Dbcvuxou.png", import.meta.url).href;
const _sfc_main$3 = {
  components: {
    DataTable: script$d,
    Column: script
  },
  data() {
    return {
      items: [
        {
          date: "Август 2021 — по настоящее время",
          organization: `(*) TEXT.RU биржа копирайтинга. 

                (*) Копирайтер/Рерайтер/Корректор. 

                (*) Написание и редактирование текстов по предварительно согласованному техническому заданию.`
        },
        {
          date: "Июль 2016 — январь 2021",
          organization: `(*) ООО «Профессиональные сервисные решения» (г.Липецк).

                (*) Мастер, старший мастер производства химической очистки промышленного теплообменного оборудования.

                (*) Должностные обязанности:
                    -  Составление, оформление и подписание необходимой технической документации;
                    -  Определение списка необходимого оборудования и товарно-материальных ценностей для выполнения работ;
                    -  Составление проекта производства работ и его согласование с заказчиком;
                    -  Осуществление координации работ при реализации проектов.`
        },
        {
          date: "Январь 2015 — июнь 2016",
          organization: `(*) TEXT.RU биржа копирайтинга. 

                (*) Копирайтер/Рерайтер/Корректор. 

                (*) Написание и редактирование текстов по предварительно согласованному техническому заданию.`
        },
        {
          date: "Март 2010 — декабрь 2014",
          organization: `(*) ООО «ЭКОС» (г.Липецк). 

                (*) Cлесарь-ремонтник. 

                (*) Химическая очистка промышленного теплообменного оборудования.`
        },
        {
          date: "Ноябрь 2006 — март 2010",
          organization: `(*) ОАО «Индезит интернешнл» (г.Липецк). 

                (*) Слесарь механосборочных работ, бригадир. 

                (*) Должностные обязанности:
                 - Выполнение работ на сборочной линии завода стиральных машин;
                 - Руководство бригадой и производственным процессом на сборочной линии завода стиральных машин;
                 - Ремонт стиральных машин на промежуточной ремонтной зоне сборочной линии.`
        }
      ]
    };
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-b84cde61"), n = n(), popScopeId(), n);
const _hoisted_1$3 = { class: "main" };
const _hoisted_2$3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "head-container" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    class: "img-exp",
    src: _imports_0$1,
    alt: "experience"
  }),
  /* @__PURE__ */ createBaseVNode("h1", null, "Опыт работы")
], -1));
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Column = resolveComponent("Column");
  const _component_DataTable = resolveComponent("DataTable");
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    _hoisted_2$3,
    createVNode(_component_DataTable, {
      class: "table",
      value: $data.items
    }, {
      default: withCtx(() => [
        createVNode(_component_Column, {
          style: { "background-color": "rgb(113, 194, 224)", "border": "1px solid #043d75", "padding": "5px" },
          field: "date",
          header: "Даты/Сроки"
        }),
        createVNode(_component_Column, {
          style: { "background-color": "rgb(113, 194, 224)", "border": "1px solid #043d75", "padding": "5px", "white-space": "pre-line" },
          field: "organization",
          header: "Организация/Должность/Должностные обязанности"
        })
      ]),
      _: 1
    }, 8, ["value"])
  ]);
}
const Experience = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-b84cde61"]]);
const _sfc_main$2 = {};
const _hoisted_1$2 = { class: "main" };
const _hoisted_2$2 = /* @__PURE__ */ createBaseVNode("div", { class: "post" }, [
  /* @__PURE__ */ createBaseVNode("h1", null, "Портфолио"),
  /* @__PURE__ */ createBaseVNode("p", null, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem nam, libero eveniet debitis quibusdam vitae minus porro distinctio praesentium alias unde nulla quod reprehenderit ratione consectetur veritatis, eum aut! Obcaecati!")
], -1);
const _hoisted_3$1 = [
  _hoisted_2$2
];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, _hoisted_3$1);
}
const Portfolio = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {};
const _hoisted_1$1 = { class: "main" };
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("div", { class: "post" }, [
  /* @__PURE__ */ createBaseVNode("h1", null, "О себе"),
  /* @__PURE__ */ createBaseVNode("p", null, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem nam, libero eveniet debitis quibusdam vitae minus porro distinctio praesentium alias unde nulla quod reprehenderit ratione consectetur veritatis, eum aut! Obcaecati!")
], -1);
const _hoisted_3 = [
  _hoisted_2$1
];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, _hoisted_3);
}
const AboutMe = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _imports_0 = "" + new URL("connection-afwOJBgE.png", import.meta.url).href;
const _sfc_main = {};
const _hoisted_1 = { class: "main" };
const _hoisted_2 = /* @__PURE__ */ createStaticVNode('<div class="head-container" data-v-39aa4bf5><img src="' + _imports_0 + '" alt="connect" data-v-39aa4bf5><h1 data-v-39aa4bf5>Как со мной связаться</h1></div><div class="connect-container" data-v-39aa4bf5><div data-v-39aa4bf5><ul data-v-39aa4bf5><li data-v-39aa4bf5>Набрать номер телефона:</li><li class="contacts" data-v-39aa4bf5><i class="pi pi-phone" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="tel:+79628685863" data-v-39aa4bf5>+7(962)868-58-63</a></p></li><li class="contacts" data-v-39aa4bf5><i class="pi pi-phone" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="tel:+79046853431" data-v-39aa4bf5>+7(904)685-34-31</a></p></li><li data-v-39aa4bf5>Написать на электронный почтовый ящик:</li><li class="contacts" data-v-39aa4bf5><i class="pi pi-at" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="mailto:save1831537@gmail.com" data-v-39aa4bf5>save1831537@gmail.com</a></p></li></ul></div><div data-v-39aa4bf5><ul data-v-39aa4bf5><li data-v-39aa4bf5>Мои мессенджеры:</li><li class="contacts" data-v-39aa4bf5><i class="pi pi-whatsapp" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="https://api.whatsapp.com/send?phone=79628685863" data-v-39aa4bf5>WhatsApp +7 (962) 868-58-63</a></p></li><li class="contacts" data-v-39aa4bf5><i class="pi pi-whatsapp" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="https://api.whatsapp.com/send?phone=79046853431" data-v-39aa4bf5>WhatsApp +7 (904) 685-34-31</a></p></li><li class="contacts" data-v-39aa4bf5><i class="pi pi-telegram" data-v-39aa4bf5></i><p data-v-39aa4bf5><a href="tg://resolve?domain=save1831" data-v-39aa4bf5>Telegram +7 (904) 685-34-31</a></p></li></ul></div></div>', 2);
const _hoisted_4 = [
  _hoisted_2
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, _hoisted_4);
}
const Contacts = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-39aa4bf5"]]);
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/education",
    name: "education",
    component: Education
  },
  {
    path: "/experience",
    name: "experience",
    component: Experience
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: Portfolio
  },
  {
    path: "/about",
    name: "about",
    component: AboutMe
  },
  {
    path: "/contacts",
    name: "contacts",
    component: Contacts
  }
];
const router = createRouter({
  routes,
  history: createWebHashHistory()
});
const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.component("Navbar", Navbar);
app.component("Button", script$F);
app.mount("#app");
