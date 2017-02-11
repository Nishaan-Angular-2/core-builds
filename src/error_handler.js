/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ERROR_ORIGINAL_ERROR, getDebugContext, getOriginalError } from './errors';
/**
 * \@whatItDoes Provides a hook for centralized exception handling.
 *
 * \@description
 *
 * The default implementation of `ErrorHandler` prints error messages to the `console`. To
 * intercept error handling, write a custom exception handler that replaces this default as
 * appropriate for your app.
 *
 * ### Example
 *
 * ```
 * class MyErrorHandler implements ErrorHandler {
 *   handleError(error) {
 *     // do something with the exception
 *   }
 * }
 *
 * \@NgModule({
 *   providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
 * })
 * class MyModule {}
 * ```
 *
 * \@stable
 */
var ErrorHandler = (function () {
    /**
     * @param {?=} rethrowError
     */
    function ErrorHandler(rethrowError) {
        if (rethrowError === void 0) { rethrowError = true; }
        /**
         * @internal
         */
        this._console = console;
        this.rethrowError = rethrowError;
    }
    /**
     * @param {?} error
     * @return {?}
     */
    ErrorHandler.prototype.handleError = function (error) {
        this._console.error("EXCEPTION: " + this._extractMessage(error));
        if (error instanceof Error) {
            var /** @type {?} */ originalError = this._findOriginalError(error);
            var /** @type {?} */ originalStack = this._findOriginalStack(error);
            var /** @type {?} */ context = this._findContext(error);
            if (originalError) {
                this._console.error("ORIGINAL EXCEPTION: " + this._extractMessage(originalError));
            }
            if (originalStack) {
                this._console.error('ORIGINAL STACKTRACE:');
                this._console.error(originalStack);
            }
            if (context) {
                this._console.error('ERROR CONTEXT:');
                this._console.error(context);
            }
        }
        // We rethrow exceptions, so operations like 'bootstrap' will result in an error
        // when an error happens. If we do not rethrow, bootstrap will always succeed.
        if (this.rethrowError)
            throw error;
    };
    /**
     * \@internal
     * @param {?} error
     * @return {?}
     */
    ErrorHandler.prototype._extractMessage = function (error) {
        return error instanceof Error ? error.message : error.toString();
    };
    /**
     * \@internal
     * @param {?} error
     * @return {?}
     */
    ErrorHandler.prototype._findContext = function (error) {
        if (error) {
            return getDebugContext(error) ? getDebugContext(error) :
                this._findContext(getOriginalError(error));
        }
        return null;
    };
    /**
     * \@internal
     * @param {?} error
     * @return {?}
     */
    ErrorHandler.prototype._findOriginalError = function (error) {
        var /** @type {?} */ e = getOriginalError(error);
        while (e && getOriginalError(e)) {
            e = getOriginalError(e);
        }
        return e;
    };
    /**
     * \@internal
     * @param {?} error
     * @return {?}
     */
    ErrorHandler.prototype._findOriginalStack = function (error) {
        var /** @type {?} */ e = error;
        var /** @type {?} */ stack = e.stack;
        while (e instanceof Error && getOriginalError(e)) {
            e = getOriginalError(e);
            if (e instanceof Error && e.stack) {
                stack = e.stack;
            }
        }
        return stack;
    };
    return ErrorHandler;
}());
export { ErrorHandler };
function ErrorHandler_tsickle_Closure_declarations() {
    /**
     * \@internal
     * @type {?}
     */
    ErrorHandler.prototype._console;
    /**
     * \@internal
     * @type {?}
     */
    ErrorHandler.prototype.rethrowError;
}
/**
 * @param {?} message
 * @param {?} originalError
 * @return {?}
 */
export function wrappedError(message, originalError) {
    var /** @type {?} */ msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
    var /** @type {?} */ error = Error(msg);
    ((error))[ERROR_ORIGINAL_ERROR] = originalError;
    return error;
}
//# sourceMappingURL=error_handler.js.map