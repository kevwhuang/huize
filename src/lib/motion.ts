import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { REDUCED_MOTION_QUERY } from '@lib/constants';

type ScrolledListener = (isScrolled: boolean) => void;

const MS_PER_SECOND = 1_000;
const REVEAL_BLUR = 6;
const REVEAL_EASE = 'power3.out';
const REVEAL_PROPERTIES = ['filter', 'scale', 'transform', 'transition', 'translate'];
const REVEAL_ROOT_MARGIN = '99999px 0px -15% 0px';
const REVEAL_SCALE = 0.92;
const REVEAL_SPAN = 0.7;
const REVEAL_START = 'top 85%';
const ROOT_FONT_SIZE_FALLBACK = 16;
const SCROLLED_OFFSET = 14;

const countDuration = readSeconds('--duration-count', 1.7);
const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
const revealDuration = readSeconds('--duration-reveal', 0.9);
const revealOffset = readPixels('--reveal-offset', 56);
const revealStagger = readSeconds('--reveal-step', 0.1);
const scrolledListeners = new Set<ScrolledListener>();

const revealToState: gsap.TweenVars = {
    clearProps: 'filter,transform,transition',
    duration: revealDuration,
    ease: REVEAL_EASE,
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
};

let horizontalOffset = revealOffset;
let initializedBody: HTMLElement | null = null;
let motionTweens: gsap.core.Animation[] = [];
let revealObservers: IntersectionObserver[] = [];

function animateCount(element: HTMLElement, prefersReducedMotion: boolean) {
    const counter = { value: 0 };
    const prefix = element.dataset.prefix ?? '';
    const suffix = element.dataset.suffix ?? '';

    function format(value: number) {
        return prefix + Math.round(value) + suffix;
    }

    function readTarget() {
        return Number.parseInt(element.dataset.countTo ?? '0', 10);
    }

    if (element.dataset.counted !== undefined || prefersReducedMotion) {
        element.textContent = format(readTarget());

        return;
    }

    element.dataset.counted = '';

    motionTweens.push(gsap.to(counter, {
        duration: countDuration,
        ease: REVEAL_EASE,
        onUpdate: () => {
            element.textContent = format(counter.value * readTarget());
        },
        scrollTrigger: {
            once: true,
            start: REVEAL_START,
            trigger: element,
        },
        value: 1,
    }));
}

function getRevealFrom(element: HTMLElement) {
    const from: gsap.TweenVars = { filter: `blur(${REVEAL_BLUR}px)`, opacity: 0, transition: 'none' };
    const parent = element.parentElement;

    const direction = element.dataset.scroll || (isStaggerParent(parent) ? parent?.dataset.scroll : '');

    switch (direction) {
        case 'down':
            return { ...from, y: -revealOffset };
        case 'left':
            return { ...from, x: -horizontalOffset };
        case 'right':
            return { ...from, x: horizontalOffset };
        case 'scale':
            return { ...from, scale: REVEAL_SCALE };
        default:
            return { ...from, y: revealOffset };
    }
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

        const step = Number.isFinite(stagger) ? stagger : revealStagger;

        const span = step * Math.max(children.length - 1, 0);

        const staggerVars = span > REVEAL_SPAN ? { amount: REVEAL_SPAN } : step;

        revealOnEnter(parent, () => gsap.to(children, { ...revealToState, stagger: staggerVars }));
    });

    singleReveals.forEach(element => revealOnEnter(element, () => gsap.to(element, { ...revealToState })));
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

function readGutter() {
    const shell = document.querySelector('.shell');

    const gutter = shell ? Number.parseFloat(getComputedStyle(shell).paddingInlineStart) : Number.NaN;

    return Number.isFinite(gutter) ? gutter : revealOffset;
}

function readPixels(token: string, fallback: number) {
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || ROOT_FONT_SIZE_FALLBACK;
    const value = readToken(token);

    const pixels = value.endsWith('rem') ? Number.parseFloat(value) * rootFontSize : Number.parseFloat(value);

    return Number.isFinite(pixels) ? pixels : fallback;
}

function readSeconds(token: string, fallback: number) {
    const value = readToken(token);

    const seconds = value.endsWith('ms') ? Number.parseFloat(value) / MS_PER_SECOND : Number.parseFloat(value);

    return Number.isFinite(seconds) ? seconds : fallback;
}

function readToken(token: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

async function refreshAfterAssets() {
    const pendingImages = [...document.images]
        .filter(image => !image.complete)
        .map(image => image.decode().catch(() => undefined));

    await Promise.all([document.fonts.ready, ...pendingImages]);
    ScrollTrigger.refresh();
}

function revealInstantly(elements: HTMLElement[]) {
    if (!elements.length) return;

    gsap.killTweensOf(elements);

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

function startMotion() {
    const prefersReducedMotion = reducedMotionQuery.matches;

    horizontalOffset = Math.min(revealOffset, readGutter());
    initializedBody = document.body;
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

function updateScrolled() {
    scrolledListeners.forEach(listener => listener(isScrolled()));
}

document.addEventListener('focusin', handleFocusIn);
gsap.registerPlugin(ScrollTrigger);
reducedMotionQuery.addEventListener('change', startMotion);

startMotion();

export function initMotion(): void {
    if (initializedBody === document.body) return;

    startMotion();
}

export function revealEverything(): void {
    const targets = [...getStaggerParents().flatMap(getStaggerChildren), ...getSingleReveals()];

    revealInstantly(targets.filter(element => element.style.opacity === '0'));
}

export function watchScrolled(listener: ScrolledListener): void {
    scrolledListeners.add(listener);
    listener(isScrolled());
}
