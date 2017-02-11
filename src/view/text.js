/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isDevMode } from '../application_ref';
import { BindingType, NodeType, asElementData, asTextData } from './types';
import { checkAndUpdateBinding, sliceErrorStack, unwrapValue } from './util';
/**
 * @param {?} ngContentIndex
 * @param {?} constants
 * @return {?}
 */
export function textDef(ngContentIndex, constants) {
    // skip the call to sliceErrorStack itself + the call to this function.
    var /** @type {?} */ source = isDevMode() ? sliceErrorStack(2, 3) : '';
    var /** @type {?} */ bindings = new Array(constants.length - 1);
    for (var /** @type {?} */ i = 1; i < constants.length; i++) {
        bindings[i - 1] = {
            type: BindingType.Interpolation,
            name: undefined,
            nonMinifiedName: undefined,
            securityContext: undefined,
            suffix: constants[i]
        };
    }
    return {
        type: NodeType.Text,
        // will bet set by the view definition
        index: undefined,
        reverseChildIndex: undefined,
        parent: undefined,
        childFlags: undefined,
        childMatchedQueries: undefined,
        bindingIndex: undefined,
        disposableIndex: undefined,
        // regular values
        flags: 0,
        matchedQueries: {}, ngContentIndex: ngContentIndex,
        childCount: 0, bindings: bindings,
        disposableCount: 0,
        element: undefined,
        provider: undefined,
        text: { prefix: constants[0], source: source },
        pureExpression: undefined,
        query: undefined,
        ngContent: undefined
    };
}
/**
 * @param {?} view
 * @param {?} renderHost
 * @param {?} def
 * @return {?}
 */
export function createText(view, renderHost, def) {
    var /** @type {?} */ parentNode = def.parent != null ? asElementData(view, def.parent).renderElement : renderHost;
    var /** @type {?} */ renderNode;
    var /** @type {?} */ renderer = view.root.renderer;
    renderNode = renderer.createText(def.text.prefix);
    if (parentNode) {
        renderer.appendChild(parentNode, renderNode);
    }
    return { renderText: renderNode };
}
/**
 * @param {?} view
 * @param {?} def
 * @param {?} v0
 * @param {?} v1
 * @param {?} v2
 * @param {?} v3
 * @param {?} v4
 * @param {?} v5
 * @param {?} v6
 * @param {?} v7
 * @param {?} v8
 * @param {?} v9
 * @return {?}
 */
export function checkAndUpdateTextInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var /** @type {?} */ bindings = def.bindings;
    var /** @type {?} */ changed = false;
    // Note: fallthrough is intended!
    switch (bindings.length) {
        case 10:
            if (checkAndUpdateBinding(view, def, 9, v9))
                changed = true;
        case 9:
            if (checkAndUpdateBinding(view, def, 8, v8))
                changed = true;
        case 8:
            if (checkAndUpdateBinding(view, def, 7, v7))
                changed = true;
        case 7:
            if (checkAndUpdateBinding(view, def, 6, v6))
                changed = true;
        case 6:
            if (checkAndUpdateBinding(view, def, 5, v5))
                changed = true;
        case 5:
            if (checkAndUpdateBinding(view, def, 4, v4))
                changed = true;
        case 4:
            if (checkAndUpdateBinding(view, def, 3, v3))
                changed = true;
        case 3:
            if (checkAndUpdateBinding(view, def, 2, v2))
                changed = true;
        case 2:
            if (checkAndUpdateBinding(view, def, 1, v1))
                changed = true;
        case 1:
            if (checkAndUpdateBinding(view, def, 0, v0))
                changed = true;
    }
    if (changed) {
        var /** @type {?} */ value = '';
        // Note: fallthrough is intended!
        switch (bindings.length) {
            case 10:
                value = _addInterpolationPart(v9, bindings[9]);
            case 9:
                value = _addInterpolationPart(v8, bindings[8]) + value;
            case 8:
                value = _addInterpolationPart(v7, bindings[7]) + value;
            case 7:
                value = _addInterpolationPart(v6, bindings[6]) + value;
            case 6:
                value = _addInterpolationPart(v5, bindings[5]) + value;
            case 5:
                value = _addInterpolationPart(v4, bindings[4]) + value;
            case 4:
                value = _addInterpolationPart(v3, bindings[3]) + value;
            case 3:
                value = _addInterpolationPart(v2, bindings[2]) + value;
            case 2:
                value = _addInterpolationPart(v1, bindings[1]) + value;
            case 1:
                value = _addInterpolationPart(v0, bindings[0]) + value;
        }
        value = def.text.prefix + value;
        var /** @type {?} */ renderNode = asTextData(view, def.index).renderText;
        view.root.renderer.setText(renderNode, value);
    }
}
/**
 * @param {?} view
 * @param {?} def
 * @param {?} values
 * @return {?}
 */
export function checkAndUpdateTextDynamic(view, def, values) {
    var /** @type {?} */ bindings = def.bindings;
    var /** @type {?} */ changed = false;
    for (var /** @type {?} */ i = 0; i < values.length; i++) {
        // Note: We need to loop over all values, so that
        // the old values are updates as well!
        if (checkAndUpdateBinding(view, def, i, values[i])) {
            changed = true;
        }
    }
    if (changed) {
        var /** @type {?} */ value = '';
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            value = value + _addInterpolationPart(values[i], bindings[i]);
        }
        value = def.text.prefix + value;
        var /** @type {?} */ renderNode = asTextData(view, def.index).renderText;
        view.root.renderer.setText(renderNode, value);
    }
}
/**
 * @param {?} value
 * @param {?} binding
 * @return {?}
 */
function _addInterpolationPart(value, binding) {
    value = unwrapValue(value);
    var /** @type {?} */ valueStr = value != null ? value.toString() : '';
    return valueStr + binding.suffix;
}
//# sourceMappingURL=text.js.map