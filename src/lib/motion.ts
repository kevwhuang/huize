import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { REDUCED_MOTION_QUERY } from '@lib/constants';

type ScrolledListener = (isScrolled: boolean) => void;

const COUNT_DURATION = readSeconds('--duration-count', 1.7);
const MS_PER_SECOND = 1_000;
const PERCENT_SCALE = 100;
const REVEAL_BLUR = 6;
const REVEAL_DURATION = readSeconds('--duration-reveal', 0.9);
const REVEAL_EASE = 'power3.out';
const REVEAL_OFFSET = readPixels('--reveal-offset', 56);
const REVEAL_PROPERTIES = ['filter', 'scale', 'transform', 'transition', 'translate'];
const REVEAL_SCALE = 0.92;
const REVEAL_STAGGER = readSeconds('--reveal-step', 0.1);
const REVEAL_START_RATIO = 0.88;
const ROOT_FONT_SIZE_FALLBACK = 16;
const SCROLLED_OFFSET = 14;

const REVEAL_ROOT_OVERSCAN = 99_999;
const REVEAL_ROOT_MARGIN = `${REVEAL_ROOT_OVERSCAN}px 0px -${PERCENT_SCALE - REVEAL_START_RATIO * PERCENT_SCALE}% 0px`;
const REVEAL_START = `top ${REVEAL_START_RATIO * PERCENT_SCALE}%`;

const REVEAL_TO: gsap.TweenVars = {
    clearProps: 'filter,transform,transition',
    duration: REVEAL_DURATION,
    ease: REVEAL_EASE,
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
};

const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
const scrolledListeners = new Set<ScrolledListener>();

let motionTweens: gsap.core.Animation[] = [];
let revealObservers: IntersectionObserver[] = [];

function animateCount(element: HTMLElement, prefersReducedMotion: boolean) {
    const counter = { value: 0 };
    const prefix = element.dataset.prefix ?? '';
    const suffix = element.dataset.suffix ?? '';
    const target = Number.parseInt(element.dataset.countTo ?? '0', 10);

    function format(value: number) {
        return prefix + Math.round(value) + suffix;
    }

    const finalText = format(target);

    // The markup server-renders the real figure so the page reads correctly without JS. Guard on an
    // explicit marker rather than on the text, or that correct initial value would cancel the count.
    if (element.dataset.counted !== undefined || prefersReducedMotion) {
        element.textContent = finalText;

        return;
    }

    element.dataset.counted = '';

    motionTweens.push(gsap.to(counter, {
        duration: COUNT_DURATION,
        ease: REVEAL_EASE,
        onUpdate: () => {
            element.textContent = format(counter.value);
        },
        scrollTrigger: {
            once: true,
            start: REVEAL_START,
            trigger: element,
        },
        value: target,
    }));
}

function getRevealFrom(element: HTMLElement): gsap.TweenVars {
    const from: gsap.TweenVars = { filter: `blur(${REVEAL_BLUR}px)`, opacity: 0, transition: 'none' };
    const parent = element.parentElement;

    const direction = element.dataset.scroll || (isStaggerParent(parent) ? parent?.dataset.scroll : '');

    switch (direction) {
        case 'down':
            return { ...from, y: -REVEAL_OFFSET };
        case 'left':
            return { ...from, x: -REVEAL_OFFSET };
        case 'right':
            return { ...from, x: REVEAL_OFFSET };
        case 'scale':
            return { ...from, scale: REVEAL_SCALE };
        default:
            return { ...from, y: REVEAL_OFFSET };
    }
}

function getRevealTargets() {
    return [...getStaggerParents().flatMap(getStaggerChildren), ...getSingleReveals()];
}

function getSingleReveals() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));

    return elements.filter(element => isAnimatable(element) && !isStaggerParent(element) && !isStaggerParent(element.parentElement));
}

function getStaggerChildren(parent: HTMLElement) {
    return Array.from(parent.querySelectorAll<HTMLElement>(':scope > *')).filter(child => !isStaggerParent(child));
}

function getStaggerParents() {
    return Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-stagger]')).filter(isAnimatable);
}

function handleFocusIn(event: FocusEvent) {
    if (!(event.target instanceof HTMLElement)) return;

    const hiddenElements: HTMLElement[] = [];

    let node: HTMLElement | null = event.target;

    while (node) {
        if (node.style.opacity === '0') hiddenElements.push(node);

        node = node.parentElement;
    }

    revealInstantly(hiddenElements);
}

function hideReveals() {
    getRevealTargets().forEach(element => gsap.set(element, getRevealFrom(element)));
}

function initReveals(prefersReducedMotion: boolean) {
    const singleReveals = getSingleReveals();
    const staggerGroups = getStaggerParents().map(parent => ({ children: getStaggerChildren(parent), parent }));

    const targets = [...staggerGroups.flatMap(group => group.children), ...singleReveals];

    if (prefersReducedMotion) {
        revealInstantly(targets);

        return;
    }

    targets.forEach(element => gsap.set(element, getRevealFrom(element)));

    staggerGroups.forEach(({ children, parent }) => {
        const stagger = Number.parseFloat(parent.dataset.scrollStagger ?? '');

        const step = Number.isFinite(stagger) ? stagger : REVEAL_STAGGER;

        revealOnEnter(parent, () => gsap.to(children, { ...REVEAL_TO, stagger: step }));
    });

    singleReveals.forEach(element => revealOnEnter(element, () => gsap.to(element, { ...REVEAL_TO })));
}

function initScrolled() {
    ScrollTrigger.create({
        end: 'max',
        onRefresh: updateScrolled,
        onUpdate: updateScrolled,
        start: 0,
    });

    updateScrolled();
}

function isAnimatable(element: Element) {
    return !element.closest('footer');
}

function isScrolled() {
    return window.scrollY > SCROLLED_OFFSET;
}

function isStaggerParent(element: Element | null) {
    return element instanceof HTMLElement && element.dataset.scrollStagger !== undefined;
}

function readPixels(token: string, fallback: number) {
    const value = readToken(token);

    const pixels = value.endsWith('rem') ? Number.parseFloat(value) * getRootFontSize() : Number.parseFloat(value);

    return Number.isFinite(pixels) ? pixels : fallback;
}

function readSeconds(token: string, fallback: number) {
    const value = readToken(token);

    const seconds = value.endsWith('ms') ? Number.parseFloat(value) / MS_PER_SECOND : Number.parseFloat(value);

    return Number.isFinite(seconds) ? seconds : fallback;
}

function getRootFontSize() {
    return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || ROOT_FONT_SIZE_FALLBACK;
}

function readToken(token: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function refreshAfterAssets() {
    const pendingImages = [...document.images].filter(image => !image.complete).map(image => image.decode().catch(() => undefined));

    Promise.all([document.fonts.ready, ...pendingImages]).then(() => ScrollTrigger.refresh());
}

function revealInstantly(elements: HTMLElement[]) {
    if (!elements.length) return;

    gsap.getTweensOf(elements).forEach(tween => tween.kill());

    elements.forEach((element) => {
        REVEAL_PROPERTIES.forEach(property => element.style.removeProperty(property));
        element.style.opacity = '1';
    });
}

function revealOnEnter(trigger: HTMLElement, createTween: () => gsap.core.Tween) {
    const observer = new IntersectionObserver((entries) => {
        if (!entries.some(entry => entry.isIntersecting)) return;

        observer.disconnect();
        motionTweens.push(createTween());
    }, { rootMargin: REVEAL_ROOT_MARGIN });

    revealObservers.push(observer);
    observer.observe(trigger);
}

function updateScrolled() {
    const scrolled = isScrolled();

    scrolledListeners.forEach(listener => listener(scrolled));
}

document.addEventListener('focusin', handleFocusIn);
gsap.registerPlugin(ScrollTrigger);
reducedMotionQuery.addEventListener('change', initMotion);

if (!reducedMotionQuery.matches) hideReveals();

export function initMotion(): void {
    const prefersReducedMotion = reducedMotionQuery.matches;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    motionTweens.forEach(tween => tween.kill());
    motionTweens = [];
    revealObservers.forEach(observer => observer.disconnect());
    revealObservers = [];
    document.querySelectorAll<HTMLElement>('[data-count-to]').forEach(element => animateCount(element, prefersReducedMotion));
    initReveals(prefersReducedMotion);
    initScrolled();
    refreshAfterAssets();
}

export function watchScrolled(listener: ScrolledListener): void {
    scrolledListeners.add(listener);
    listener(isScrolled());
}
