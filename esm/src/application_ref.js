/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObservableWrapper, PromiseWrapper } from '../src/facade/async';
import { ListWrapper } from '../src/facade/collection';
import { BaseException, ExceptionHandler, unimplemented } from '../src/facade/exceptions';
import { isBlank, isPresent, isPromise } from '../src/facade/lang';
import { APP_INITIALIZER, PLATFORM_INITIALIZER } from './application_tokens';
import { Console } from './console';
import { Injectable, Injector, OpaqueToken, Optional, ReflectiveInjector } from './di';
import { CompilerFactory } from './linker/compiler';
import { ComponentFactory } from './linker/component_factory';
import { ComponentFactoryResolver } from './linker/component_factory_resolver';
import { wtfCreateScope, wtfLeave } from './profile/profile';
import { Testability, TestabilityRegistry } from './testability/testability';
import { NgZone } from './zone/ng_zone';
var _devMode = true;
var _runModeLocked = false;
var _platform;
/**
 * Disable Angular's development mode, which turns off assertions and other
 * checks within the framework.
 *
 * One important assertion this disables verifies that a change detection pass
 * does not result in additional changes to any bindings (also known as
 * unidirectional data flow).
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function enableProdMode() {
    if (_runModeLocked) {
        // Cannot use BaseException as that ends up importing from facade/lang.
        throw new BaseException('Cannot enable prod mode after platform setup.');
    }
    _devMode = false;
}
/**
 * Locks the run mode of Angular. After this has been called,
 * it can't be changed any more. I.e. `isDevMode()` will always
 * return the same value.
 *
 * @deprecated This is a noop now. {@link isDevMode} automatically locks the run mode on first call.
 */
export function lockRunMode() {
    console.warn('lockRunMode() is deprecated and not needed any more.');
}
/**
 * Returns whether Angular is in development mode. After called once,
 * the value is locked and won't change any more.
 *
 * By default, this is true, unless a user calls `enableProdMode` before calling this.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function isDevMode() {
    _runModeLocked = true;
    return _devMode;
}
/**
 * Creates a platform.
 * Platforms have to be eagerly created via this function.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function createPlatform(injector) {
    if (isPresent(_platform) && !_platform.disposed) {
        throw new BaseException('There can be only one platform. Destroy the previous one to create a new one.');
    }
    _platform = injector.get(PlatformRef);
    const inits = injector.get(PLATFORM_INITIALIZER, null);
    if (isPresent(inits))
        inits.forEach(init => init());
    return _platform;
}
/**
 * Creates a fatory for a platform
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function createPlatformFactory(parentPlaformFactory, name, providers = []) {
    const marker = new OpaqueToken(`Platform: ${name}`);
    return (extraProviders = []) => {
        if (!getPlatform()) {
            if (parentPlaformFactory) {
                parentPlaformFactory(providers.concat(extraProviders).concat({ provide: marker, useValue: true }));
            }
            else {
                createPlatform(ReflectiveInjector.resolveAndCreate(providers.concat(extraProviders).concat({ provide: marker, useValue: true })));
            }
        }
        return assertPlatform(marker);
    };
}
/**
 * Checks that there currently is a platform
 * which contains the given token as a provider.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function assertPlatform(requiredToken) {
    var platform = getPlatform();
    if (isBlank(platform)) {
        throw new BaseException('No platform exists!');
    }
    if (isPresent(platform) && isBlank(platform.injector.get(requiredToken, null))) {
        throw new BaseException('A platform with a different configuration has been created. Please destroy it first.');
    }
    return platform;
}
/**
 * Dispose the existing platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function disposePlatform() {
    if (isPresent(_platform) && !_platform.disposed) {
        _platform.dispose();
    }
}
/**
 * Returns the current platform.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function getPlatform() {
    return isPresent(_platform) && !_platform.disposed ? _platform : null;
}
/**
 * Shortcut for ApplicationRef.bootstrap.
 * Requires a platform to be created first.
 *
 * @deprecated Use {@link bootstrapModuleFactory} instead.
 */
export function coreBootstrap(componentFactory, injector) {
    throw new BaseException('coreBootstrap is deprecated. Use bootstrapModuleFactory instead.');
}
/**
 * Resolves the componentFactory for the given component,
 * waits for asynchronous initializers and bootstraps the component.
 * Requires a platform to be created first.
 *
 * @deprecated Use {@link bootstrapModule} instead.
 */
export function coreLoadAndBootstrap(componentType, injector) {
    throw new BaseException('coreLoadAndBootstrap is deprecated. Use bootstrapModule instead.');
}
/**
 * The Angular platform is the entry point for Angular on a web page. Each page
 * has exactly one platform, and services (such as reflection) which are common
 * to every Angular application running on the page are bound in its scope.
 *
 * A page's platform is initialized implicitly when {@link bootstrap}() is called, or
 * explicitly by calling {@link createPlatform}().
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export class PlatformRef {
    /**
     * Creates an instance of an `@NgModule` for the given platform
     * for offline compilation.
     *
     * ## Simple Example
     *
     * ```typescript
     * my_module.ts:
     *
     * @NgModule({
     *   imports: [BrowserModule]
     * })
     * class MyModule {}
     *
     * main.ts:
     * import {MyModuleNgFactory} from './my_module.ngfactory';
     * import {browserPlatform} from '@angular/platform-browser';
     *
     * let moduleRef = browserPlatform().bootstrapModuleFactory(MyModuleNgFactory);
     * ```
     *
     * @experimental APIs related to application bootstrap are currently under review.
     */
    bootstrapModuleFactory(moduleFactory) {
        throw unimplemented();
    }
    /**
     * Creates an instance of an `@NgModule` for a given platform using the given runtime compiler.
     *
     * ## Simple Example
     *
     * ```typescript
     * @NgModule({
     *   imports: [BrowserModule]
     * })
     * class MyModule {}
     *
     * let moduleRef = browserPlatform().bootstrapModule(MyModule);
     * ```
     * @stable
     */
    bootstrapModule(moduleType, compilerOptions = []) {
        throw unimplemented();
    }
    /**
     * Retrieve the platform {@link Injector}, which is the parent injector for
     * every Angular application on the page and provides singleton providers.
     */
    get injector() { throw unimplemented(); }
    ;
    get disposed() { throw unimplemented(); }
}
function _callAndReportToExceptionHandler(exceptionHandler, callback) {
    try {
        const result = callback();
        if (isPromise(result)) {
            return result.catch((e) => {
                exceptionHandler.call(e);
                // rethrow as the exception handler might not do it
                throw e;
            });
        }
        else {
            return result;
        }
    }
    catch (e) {
        exceptionHandler.call(e);
        // rethrow as the exception handler might not do it
        throw e;
    }
}
export class PlatformRef_ extends PlatformRef {
    constructor(_injector) {
        super();
        this._injector = _injector;
        /** @internal */
        this._applications = [];
        /** @internal */
        this._disposeListeners = [];
        this._disposed = false;
    }
    registerDisposeListener(dispose) { this._disposeListeners.push(dispose); }
    get injector() { return this._injector; }
    get disposed() { return this._disposed; }
    dispose() {
        ListWrapper.clone(this._applications).forEach((app) => app.dispose());
        this._disposeListeners.forEach((dispose) => dispose());
        this._disposed = true;
    }
    /** @internal */
    _applicationDisposed(app) { ListWrapper.remove(this._applications, app); }
    bootstrapModuleFactory(moduleFactory) {
        // Note: We need to create the NgZone _before_ we instantiate the module,
        // as instantiating the module creates some providers eagerly.
        // So we create a mini parent injector that just contains the new NgZone and
        // pass that as parent to the NgModuleFactory.
        const ngZone = new NgZone({ enableLongStackTrace: isDevMode() });
        // Attention: Don't use ApplicationRef.run here,
        // as we want to be sure that all possible constructor calls are inside `ngZone.run`!
        return ngZone.run(() => {
            const ngZoneInjector = ReflectiveInjector.resolveAndCreate([{ provide: NgZone, useValue: ngZone }], this.injector);
            const moduleRef = moduleFactory.create(ngZoneInjector);
            const exceptionHandler = moduleRef.injector.get(ExceptionHandler, null);
            if (!exceptionHandler) {
                throw new Error('No ExceptionHandler. Is platform module (BrowserModule) included?');
            }
            ObservableWrapper.subscribe(ngZone.onError, (error) => {
                exceptionHandler.call(error.error, error.stackTrace);
            });
            return _callAndReportToExceptionHandler(exceptionHandler, () => {
                const appInits = moduleRef.injector.get(APP_INITIALIZER, null);
                const asyncInitPromises = [];
                if (isPresent(appInits)) {
                    for (let i = 0; i < appInits.length; i++) {
                        const initResult = appInits[i]();
                        if (isPromise(initResult)) {
                            asyncInitPromises.push(initResult);
                        }
                    }
                }
                const appRef = moduleRef.injector.get(ApplicationRef);
                return Promise.all(asyncInitPromises).then(() => {
                    appRef.asyncInitDone();
                    return moduleRef;
                });
            });
        });
    }
    bootstrapModule(moduleType, compilerOptions = []) {
        const compilerFactory = this.injector.get(CompilerFactory);
        const compiler = compilerFactory.createCompiler(compilerOptions instanceof Array ? compilerOptions : [compilerOptions]);
        return compiler.compileModuleAsync(moduleType)
            .then((moduleFactory) => this.bootstrapModuleFactory(moduleFactory));
    }
}
/** @nocollapse */
PlatformRef_.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PlatformRef_.ctorParameters = [
    { type: Injector, },
];
/**
 * A reference to an Angular application running on a page.
 *
 * For more about Angular applications, see the documentation for {@link bootstrap}.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export class ApplicationRef {
    /**
     * Retrieve the application {@link Injector}.
     */
    get injector() { return unimplemented(); }
    ;
    /**
     * Retrieve the application {@link NgZone}.
     */
    get zone() { return unimplemented(); }
    ;
    /**
     * Get a list of component types registered to this application.
     */
    get componentTypes() { return unimplemented(); }
    ;
}
export class ApplicationRef_ extends ApplicationRef {
    constructor(_platform, _zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _testabilityRegistry, _testability) {
        super();
        this._platform = _platform;
        this._zone = _zone;
        this._console = _console;
        this._injector = _injector;
        this._exceptionHandler = _exceptionHandler;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._testabilityRegistry = _testabilityRegistry;
        this._testability = _testability;
        /** @internal */
        this._bootstrapListeners = [];
        /** @internal */
        this._disposeListeners = [];
        /** @internal */
        this._rootComponents = [];
        /** @internal */
        this._rootComponentTypes = [];
        /** @internal */
        this._changeDetectorRefs = [];
        /** @internal */
        this._runningTick = false;
        /** @internal */
        this._enforceNoNewChanges = false;
        /** @internal */
        this._asyncInitDonePromise = PromiseWrapper.completer();
        this._enforceNoNewChanges = isDevMode();
        ObservableWrapper.subscribe(this._zone.onMicrotaskEmpty, (_) => { this._zone.run(() => { this.tick(); }); });
    }
    registerBootstrapListener(listener) {
        this._bootstrapListeners.push(listener);
    }
    registerDisposeListener(dispose) { this._disposeListeners.push(dispose); }
    registerChangeDetector(changeDetector) {
        this._changeDetectorRefs.push(changeDetector);
    }
    unregisterChangeDetector(changeDetector) {
        ListWrapper.remove(this._changeDetectorRefs, changeDetector);
    }
    /**
     * @internal
     */
    asyncInitDone() { this._asyncInitDonePromise.resolve(null); }
    waitForAsyncInitializers() { return this._asyncInitDonePromise.promise; }
    run(callback) {
        return this._zone.run(() => _callAndReportToExceptionHandler(this._exceptionHandler, callback));
    }
    bootstrap(componentOrFactory) {
        return this.run(() => {
            let componentFactory;
            if (componentOrFactory instanceof ComponentFactory) {
                componentFactory = componentOrFactory;
            }
            else {
                componentFactory =
                    this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
            }
            this._rootComponentTypes.push(componentFactory.componentType);
            var compRef = componentFactory.create(this._injector, [], componentFactory.selector);
            compRef.onDestroy(() => { this._unloadComponent(compRef); });
            var testability = compRef.injector.get(Testability, null);
            if (isPresent(testability)) {
                compRef.injector.get(TestabilityRegistry)
                    .registerApplication(compRef.location.nativeElement, testability);
            }
            this._loadComponent(compRef);
            if (isDevMode()) {
                this._console.log(`Angular 2 is running in the development mode. Call enableProdMode() to enable the production mode.`);
            }
            return compRef;
        });
    }
    /** @internal */
    _loadComponent(componentRef) {
        this._changeDetectorRefs.push(componentRef.changeDetectorRef);
        this.tick();
        this._rootComponents.push(componentRef);
        this._bootstrapListeners.forEach((listener) => listener(componentRef));
    }
    /** @internal */
    _unloadComponent(componentRef) {
        if (!ListWrapper.contains(this._rootComponents, componentRef)) {
            return;
        }
        this.unregisterChangeDetector(componentRef.changeDetectorRef);
        ListWrapper.remove(this._rootComponents, componentRef);
    }
    get injector() { return this._injector; }
    get zone() { return this._zone; }
    tick() {
        if (this._runningTick) {
            throw new BaseException('ApplicationRef.tick is called recursively');
        }
        var s = ApplicationRef_._tickScope();
        try {
            this._runningTick = true;
            this._changeDetectorRefs.forEach((detector) => detector.detectChanges());
            if (this._enforceNoNewChanges) {
                this._changeDetectorRefs.forEach((detector) => detector.checkNoChanges());
            }
        }
        finally {
            this._runningTick = false;
            wtfLeave(s);
        }
    }
    dispose() {
        // TODO(alxhub): Dispose of the NgZone.
        ListWrapper.clone(this._rootComponents).forEach((ref) => ref.destroy());
        this._disposeListeners.forEach((dispose) => dispose());
        this._platform._applicationDisposed(this);
    }
    get componentTypes() { return this._rootComponentTypes; }
}
/** @internal */
ApplicationRef_._tickScope = wtfCreateScope('ApplicationRef#tick()');
/** @nocollapse */
ApplicationRef_.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationRef_.ctorParameters = [
    { type: PlatformRef_, },
    { type: NgZone, },
    { type: Console, },
    { type: Injector, },
    { type: ExceptionHandler, },
    { type: ComponentFactoryResolver, },
    { type: TestabilityRegistry, decorators: [{ type: Optional },] },
    { type: Testability, decorators: [{ type: Optional },] },
];
//# sourceMappingURL=application_ref.js.map