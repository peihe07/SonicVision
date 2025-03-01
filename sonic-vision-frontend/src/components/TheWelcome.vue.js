"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var WelcomeItem_vue_1 = require("./WelcomeItem.vue");
var IconDocumentation_vue_1 = require("./icons/IconDocumentation.vue");
var IconTooling_vue_1 = require("./icons/IconTooling.vue");
var IconEcosystem_vue_1 = require("./icons/IconEcosystem.vue");
var IconCommunity_vue_1 = require("./icons/IconCommunity.vue");
var IconSupport_vue_1 = require("./icons/IconSupport.vue");
var openReadmeInEditor = function () { return fetch('/__open-in-editor?file=README.md'); }; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {[typeof WelcomeItem, typeof WelcomeItem, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(WelcomeItem_vue_1.default, new WelcomeItem_vue_1.default({}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
__VLS_2.slots.default;
{
    var __VLS_thisSlot = __VLS_2.slots.icon;
    /** @type {[typeof DocumentationIcon, ]} */ ;
    // @ts-ignore
    var __VLS_3 = __VLS_asFunctionalComponent(IconDocumentation_vue_1.default, new IconDocumentation_vue_1.default({}));
    var __VLS_4 = __VLS_3.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_3), false));
}
{
    var __VLS_thisSlot = __VLS_2.slots.heading;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://vuejs.org/",
    target: "_blank",
    rel: "noopener",
});
var __VLS_2;
/** @type {[typeof WelcomeItem, typeof WelcomeItem, ]} */ ;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(WelcomeItem_vue_1.default, new WelcomeItem_vue_1.default({}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_6), false));
__VLS_8.slots.default;
{
    var __VLS_thisSlot = __VLS_8.slots.icon;
    /** @type {[typeof ToolingIcon, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(IconTooling_vue_1.default, new IconTooling_vue_1.default({}));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_9), false));
}
{
    var __VLS_thisSlot = __VLS_8.slots.heading;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://vite.dev/guide/features.html",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://code.visualstudio.com/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://github.com/johnsoncodehk/volar",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://vitest.dev/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://www.cypress.io/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://playwright.dev/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)(__assign({ onClick: (__VLS_ctx.openReadmeInEditor) }, { href: "javascript:void(0)" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
var __VLS_8;
/** @type {[typeof WelcomeItem, typeof WelcomeItem, ]} */ ;
// @ts-ignore
var __VLS_12 = __VLS_asFunctionalComponent(WelcomeItem_vue_1.default, new WelcomeItem_vue_1.default({}));
var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_12), false));
__VLS_14.slots.default;
{
    var __VLS_thisSlot = __VLS_14.slots.icon;
    /** @type {[typeof EcosystemIcon, ]} */ ;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent(IconEcosystem_vue_1.default, new IconEcosystem_vue_1.default({}));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_15), false));
}
{
    var __VLS_thisSlot = __VLS_14.slots.heading;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://pinia.vuejs.org/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://router.vuejs.org/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://test-utils.vuejs.org/",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://github.com/vuejs/devtools",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://github.com/vuejs/awesome-vue",
    target: "_blank",
    rel: "noopener",
});
var __VLS_14;
/** @type {[typeof WelcomeItem, typeof WelcomeItem, ]} */ ;
// @ts-ignore
var __VLS_18 = __VLS_asFunctionalComponent(WelcomeItem_vue_1.default, new WelcomeItem_vue_1.default({}));
var __VLS_19 = __VLS_18.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_18), false));
__VLS_20.slots.default;
{
    var __VLS_thisSlot = __VLS_20.slots.icon;
    /** @type {[typeof CommunityIcon, ]} */ ;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(IconCommunity_vue_1.default, new IconCommunity_vue_1.default({}));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_21), false));
}
{
    var __VLS_thisSlot = __VLS_20.slots.heading;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://chat.vuejs.org",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://stackoverflow.com/questions/tagged/vue.js",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://bsky.app/profile/vuejs.org",
    target: "_blank",
    rel: "noopener",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://x.com/vuejs",
    target: "_blank",
    rel: "noopener",
});
var __VLS_20;
/** @type {[typeof WelcomeItem, typeof WelcomeItem, ]} */ ;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(WelcomeItem_vue_1.default, new WelcomeItem_vue_1.default({}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_24), false));
__VLS_26.slots.default;
{
    var __VLS_thisSlot = __VLS_26.slots.icon;
    /** @type {[typeof SupportIcon, ]} */ ;
    // @ts-ignore
    var __VLS_27 = __VLS_asFunctionalComponent(IconSupport_vue_1.default, new IconSupport_vue_1.default({}));
    var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_27), false));
}
{
    var __VLS_thisSlot = __VLS_26.slots.heading;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "https://vuejs.org/sponsor/",
    target: "_blank",
    rel: "noopener",
});
var __VLS_26;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            WelcomeItem: WelcomeItem_vue_1.default,
            DocumentationIcon: IconDocumentation_vue_1.default,
            ToolingIcon: IconTooling_vue_1.default,
            EcosystemIcon: IconEcosystem_vue_1.default,
            CommunityIcon: IconCommunity_vue_1.default,
            SupportIcon: IconSupport_vue_1.default,
            openReadmeInEditor: openReadmeInEditor,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
