import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { getSession } from '@lib/auth';
import { revealEverything } from '@lib/motion';

type Operation = AddOperation | DeleteOperation | EditOperation;

interface AddOperation {
    addition: Addition;
    anchors: CardAnchor[];
    collection: string;
    kind: 'add';
}

interface Addition {
    fields: Record<string, string>;
    id: string;
    scope: string;
}

interface CardAnchor {
    card: HTMLElement;
    parent: Element | null;
    sibling: Element | null;
}

interface Changes {
    items: Set<string>;
    keys: Set<string>;
}

interface DeleteOperation {
    anchors: CardAnchor[];
    isDetached: boolean;
    item: string;
    kind: 'delete';
}

interface EditOperation {
    after: string;
    before: string;
    key: string;
    kind: 'edit';
}

interface StoredEdits {
    additions: Record<string, Addition[]>;
    deletions: string[];
    edits: Record<string, string>;
}

const ACTIVE_CLASS = 'editor-active';
const ASTRO_SCOPE_PREFIX = 'data-astro-cid-';
const BODY_CLASS = 'editor-on';
const CHANGED_CLASS = 'editor-changed';
const CHANGE_SUFFIX = ' 处修改';
const CHROME_SELECTOR = 'body > footer, body > header';
const COLLECTION_PATTERN = /^[a-z]+$/;
const CONFIRM_CLASS = 'editor-panel__toggle--confirm';
const CONFIRM_DELAY = 4_000;
const CONFIRM_PREFIX = '放弃 ';
const CONFIRM_SUFFIX = '？';
const CONTROL_GAP = 8;
const CONTROL_SELECTOR = 'a, button, nav, summary';
const COUNT_LIMIT = 99;
const DIRTY_CLASS = 'editor-panel__toggle--dirty';
const EDITING_CLASS = 'editor-panel--editing';
const EDITOR_ROLE = 'editor';
const EDITS_KEY = 'huize_edits';
const FIELD_PATTERN = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*$/;
const FLASH_CLASS = 'editor-flash';
const FLASH_DELAY = 1_400;
const HEADER_SELECTOR = 'header';
const HIDDEN_CLASS = 'editor-hidden';
const ITEM_PATTERN = /^[a-z]+\/[a-z0-9-]+$/;
const KEY_PATTERN = /^[a-z]+\/[a-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
const LABEL_PENDING = '，待保存 ';
const MAX_ADDITIONS = 100;
const MAX_DELETIONS = 200;
const MAX_EDITS = 500;
const MAX_EDIT_LENGTH = 300;
const MEDIA_CLASS = 'editor-placeholder-media';
const MODIFIER_KEY = /mac/i.test(navigator.userAgent) ? 'Meta' : 'Alt';

const PLACEHOLDERS: Record<string, Record<string, string>> = {
    bases: { name: '基地名称' },
    institutions: { address: '机构地址', name: '机构名称' },
    investors: { facts: '投资方介绍', name: '投资方名称' },
    news: { summary: '摘要内容', title: '新闻标题' },
};

const PLACEHOLDER_TEXT = '内容';
const RESET_PROPERTIES = ['filter', 'opacity', 'scale', 'transform', 'transition', 'translate'];
const REVEAL_GAP = 24;
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const STATUS_ADDED = '已添加卡片';
const STATUS_ADD_LIMIT = '已达新增上限';
const STATUS_CANCELLED = '已放弃全部修改';
const STATUS_DELETED = '已删除卡片';
const STATUS_DELETE_LIMIT = '已达删除上限';
const STATUS_DISABLED = '管理模式已关闭';
const STATUS_DISCARDED = '已还原此处文字';
const STATUS_EDITING = '编辑中';
const STATUS_EDIT_LIMIT = '已达修改上限';
const STATUS_ENABLED = '管理模式已开启';
const STATUS_LOCATED = '，已定位到该处';
const STATUS_PENDING = '修改待保存';
const STATUS_QUOTA = '存储空间不足';
const STATUS_REDONE = '已重做';
const STATUS_REVERTED = '已还原为原始内容';
const STATUS_SAVED_PREFIX = '已保存 ';
const STATUS_STORAGE = '存储不可用';
const STATUS_UNDONE = '已撤销';
const TARGET_CLASS = 'editor-target';
const TIMEZONE = 'Asia/Shanghai';
const TOGGLE_LABEL = '管理模式';
const UNSAVED_SUFFIX = '，修改未保存';

const cappedCollections = new Set<string>();
const operations: Operation[] = [];
const originals = new Map<string, string>();
const tabStops = new Set<HTMLElement>();

let acceptControl: HTMLButtonElement | null = null;
let activeElement: HTMLElement | null = null;
let activeSnapshot = '';
let addControl: HTMLElement | null = null;
let badgeControl: HTMLElement | null = null;
let cancelControl: HTMLButtonElement | null = null;
let cluster: HTMLElement | null = null;
let confirmTimer: number | undefined;
let cursor = 0;
let deleteControl: HTMLElement | null = null;
let flashed: HTMLElement | null = null;
let flashTimer: number | undefined;
let floaterControl: HTMLElement | null = null;
let floaterId: HTMLElement | null = null;
let floaterKey: HTMLElement | null = null;
let hasPlaintextSupport: boolean | undefined;
let hoveredControl: HTMLElement | null = null;
let hoveredItem: HTMLElement | null = null;
let hoveredList: HTMLElement | null = null;
let hoveredTarget: HTMLElement | null = null;
let isConfirming = false;
let isEditing = false;
let isTapping = false;
let overlay: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let redoControl: HTMLButtonElement | null = null;
let sessionCheck: Promise<boolean> | undefined;
let statusLine: HTMLElement | null = null;
let toggleControl: HTMLButtonElement | null = null;
let undoControl: HTMLButtonElement | null = null;

function acceptEdits() {
    clearConfirm();
    clearFlash();
    recordActive();

    const changes = countChanges();

    if (changes === 0) return;

    const merged = buildEdits();

    const capped = getCapStatus(merged);

    if (capped) {
        setStatus(`${capped}${UNSAVED_SUFFIX}`);

        return;
    }

    if (!storeEdits(merged)) {
        setStatus(`${isStorageAvailable() ? STATUS_QUOTA : STATUS_STORAGE}${UNSAVED_SUFFIX}`);

        return;
    }

    operations.length = 0;
    cursor = 0;
    Object.entries(merged.edits).forEach(([key, value]) => applyValue(key, value));
    setStatus(`${STATUS_SAVED_PREFIX}${changes}${CHANGE_SUFFIX}`);
    syncCluster();
    refreshMotion();
}

function activate(element: HTMLElement) {
    if (activeElement === element) return;

    clearConfirm();
    recordActive();

    const key = element.dataset.edit ?? '';

    if (!originals.has(key)) originals.set(key, readValue(element));

    activeElement = element;
    activeSnapshot = readValue(element);
    element.classList.add(ACTIVE_CLASS);
    element.setAttribute('contenteditable', supportsPlaintextOnly() ? 'plaintext-only' : 'true');
    element.focus();
    setStatus(STATUS_EDITING);
    positionFloater();
}

function addCard(list: HTMLElement) {
    clearConfirm();
    recordActive();

    const collection = list.dataset.editList ?? '';

    const template = findTemplate(list, collection);

    if (!COLLECTION_PATTERN.test(collection) || !template) return;

    const pending = buildEdits();

    if ((pending.additions[collection] ?? []).length >= MAX_ADDITIONS) {
        setStatus(STATUS_ADD_LIMIT);
        syncCluster();

        return;
    }

    const addition = { fields: collectFields(template, collection), id: crypto.randomUUID(), scope: getScope(list) };

    const cards = insertCards(list, collection, [addition]);

    if (cards.length === 0) return;

    pushOperation({ addition, anchors: cards.map(createAnchor), collection, kind: 'add' });
    setStatus(STATUS_ADDED);
    setTabStops(isEditing);
    updateCounts();
    syncCluster();
    refreshMotion();
}

async function applyForEditor() {
    if (await checkEditor()) applyStoredEdits();
}

function applyOperation(operation: Operation) {
    if (operation.kind === 'add') attachCards(operation.anchors);
    else if (operation.kind === 'delete') removeCard(operation);
    else applyValue(operation.key, operation.after);
}

function applyStoredEdits() {
    if (!document.body) {
        document.addEventListener('DOMContentLoaded', applyStoredEdits, { once: true });

        return;
    }

    const stored = readEdits();

    Object.entries(stored.additions).forEach(([collection, additions]) => restoreCards(collection, additions));
    stored.deletions.forEach(hideItem);
    Object.entries(stored.edits).forEach(([key, value]) => applyValue(key, value));
    updateCaps(stored);
    updateCounts();
    refreshMotion();
}

function applyValue(key: string, value: string) {
    document.querySelectorAll<HTMLElement>(`[data-edit="${key}"], [data-edit-view="${key}"]`).forEach((element) => {
        if (!originals.has(key)) originals.set(key, readValue(element));

        writeValue(element, value);
    });
}

function attachCards(anchors: CardAnchor[]) {
    anchors.forEach(({ card, parent, sibling }) => {
        if (sibling?.isConnected) sibling.after(card);
        else parent?.append(card);
    });
}

function blankMedia(node: HTMLElement) {
    node.classList.add(MEDIA_CLASS);
    node.style.removeProperty('background-image');

    if (!(node instanceof HTMLImageElement)) return;

    node.removeAttribute('sizes');
    node.removeAttribute('src');
    node.removeAttribute('srcset');
    node.alt = '';
}

function buildEdits() {
    const merged = readEdits();

    getPending().forEach((operation) => {
        if (operation.kind === 'add') {
            merged.additions[operation.collection] = [...(merged.additions[operation.collection] ?? []), operation.addition];
        } else if (operation.kind === 'delete') {
            mergeDeletion(merged, operation.item);
        } else {
            mergeEdit(merged, operation.key, operation.after);
        }
    });

    return merged;
}

function cancelEdits() {
    clearConfirm();
    clearFlash();
    discardActive();
    revertPending();
    setStatus(STATUS_CANCELLED);
    updateCounts();
    syncCluster();
    refreshMotion();
}

function cancelTap() {
    isTapping = false;
}

function checkEditor() {
    sessionCheck ??= resolveEditor();

    return sessionCheck;
}

function clearConfirm() {
    clearConfirmTimer();

    if (!isConfirming) return;

    isConfirming = false;
    syncCluster();
}

function clearConfirmTimer() {
    window.clearTimeout(confirmTimer);
    confirmTimer = undefined;
}

function clearFlash() {
    window.clearTimeout(flashTimer);

    flashTimer = undefined;
    flashed?.classList.remove(FLASH_CLASS);
    flashed = null;
}

function collectChanges(): Changes {
    const additions = new Set<string>();
    const baselines = new Map<string, string>();
    const deletions = new Set<string>();
    const stored = readEdits();
    const values = new Map<string, string>();

    getPending().forEach((operation) => {
        if (operation.kind === 'add') {
            additions.add(`${operation.collection}/${operation.addition.id}`);
        } else if (operation.kind === 'delete') {
            if (additions.delete(operation.item)) dropFields(values, operation.item);
            else deletions.add(operation.item);
        } else {
            if (!baselines.has(operation.key)) baselines.set(operation.key, operation.before);

            values.set(operation.key, operation.after);
        }
    });

    const keys = Array.from(values)
        .filter(([key, value]) => value !== getBaseline(stored, key, baselines.get(key)))
        .map(([key]) => key);

    return { items: new Set([...additions, ...deletions]), keys: new Set(keys) };
}

function collectFields(template: HTMLElement, collection: string) {
    const fields: Record<string, string> = {};

    template.querySelectorAll<HTMLElement>('[data-edit]').forEach((node) => {
        const field = getFieldName(node.dataset.edit ?? '');

        if (field) fields[field] = getPlaceholder(collection, field);
    });

    if (template.querySelector('time')) fields.date = getToday();

    return fields;
}

function collectText(element: Element): string {
    return Array.from(element.childNodes).map((node) => {
        if (node instanceof HTMLBRElement) return '\n';
        if (node instanceof Element) return collectText(node);

        return node.textContent ?? '';
    }).join('');
}

function confirmExit() {
    clearConfirmTimer();

    isConfirming = true;
    setStatus(getToggleLabel(countChanges()));
    syncCluster();

    confirmTimer = window.setTimeout(clearConfirm, CONFIRM_DELAY);
}

function countChanges() {
    const { items, keys } = collectChanges();

    return items.size + keys.size;
}

function countItems(collection: string, scope: string | undefined) {
    const items = new Set<string>();
    const selector = `${scope ? `[data-edit-scope="${scope}"] ` : ''}[data-edit-item^="${collection}/"]`;

    document.querySelectorAll<HTMLElement>(selector).forEach((item) => {
        if (!item.classList.contains(HIDDEN_CLASS)) items.add(item.dataset.editItem ?? '');
    });

    return items.size;
}

function countTotal(collection: string, total: string) {
    const pending = buildEdits();

    return Number(total) + (pending.additions[collection]?.length ?? 0) - pending.deletions.filter(item => item.startsWith(`${collection}/`)).length;
}

function createAnchor(card: HTMLElement) {
    return { card, parent: card.parentElement, sibling: card.previousElementSibling };
}

function createBreak(element: HTMLElement) {
    const existing = element.querySelector('br');

    if (existing) return existing.cloneNode();

    const line = document.createElement('br');
    const scope = Array.from(element.attributes).find(attribute => attribute.name.startsWith(ASTRO_SCOPE_PREFIX));

    if (scope) line.setAttribute(scope.name, scope.value);

    return line;
}

function createCard(template: HTMLElement, collection: string, id: string, fields: Record<string, string>) {
    const card = template.cloneNode(true) as HTMLElement;
    const date = fields.date;

    card.classList.remove(ACTIVE_CLASS, CHANGED_CLASS, FLASH_CLASS, HIDDEN_CLASS, TARGET_CLASS);
    card.dataset.editItem = `${collection}/${id}`;
    RESET_PROPERTIES.forEach(property => card.style.removeProperty(property));
    stripIdentifiers(card);

    card.querySelectorAll<HTMLElement>('[data-edit]').forEach((node) => {
        const field = getFieldName(node.dataset.edit ?? '');

        node.classList.remove(ACTIVE_CLASS, CHANGED_CLASS, FLASH_CLASS, TARGET_CLASS);
        node.removeAttribute('contenteditable');
        node.removeAttribute('tabindex');
        node.dataset.edit = `${collection}/${id}.${field}`;
        writeValue(node, fields[field] ?? getPlaceholder(collection, field));
    });

    card.querySelectorAll<HTMLElement>('[style*="background-image"]').forEach(blankMedia);
    card.querySelectorAll('img').forEach(blankMedia);

    if (date) card.querySelectorAll('time').forEach(node => setDate(node, date));

    return card;
}

function createEdits(): StoredEdits {
    return { additions: {}, deletions: [], edits: {} };
}

function deactivate() {
    if (!activeElement) return;

    const element = activeElement;

    activeElement = null;
    element.classList.remove(ACTIVE_CLASS);
    element.removeAttribute('contenteditable');
    positionFloater();
}

function deleteCard(card: HTMLElement) {
    clearConfirm();
    recordActive();

    const item = card.dataset.editItem ?? '';

    if (!ITEM_PATTERN.test(item)) return;

    const [collection = '', id = ''] = item.split('/');
    const pending = buildEdits();

    const isAdded = (pending.additions[collection] ?? []).some(addition => addition.id === id);

    if (!isAdded && !pending.deletions.includes(item) && pending.deletions.length >= MAX_DELETIONS) {
        setStatus(STATUS_DELETE_LIMIT);
        syncCluster();

        return;
    }

    const anchors = isAdded ? Array.from(document.querySelectorAll<HTMLElement>(`[data-edit-item="${item}"]`)).map(createAnchor) : [];

    const operation: DeleteOperation = { anchors, isDetached: isAdded, item, kind: 'delete' };

    removeCard(operation);
    hoveredItem = null;
    setTarget(null);
    pushOperation(operation);
    setStatus(STATUS_DELETED);
    updateCounts();
    syncCluster();
    refreshMotion();
}

function detachCards(anchors: CardAnchor[]) {
    anchors.forEach(({ card }) => card.remove());
}

function discardActive() {
    if (!activeElement) return;

    const element = activeElement;

    deactivate();
    writeValue(element, activeSnapshot);
    setStatus(STATUS_DISCARDED);
}

function dropFields(values: Map<string, string>, item: string) {
    Array.from(values.keys())
        .filter(key => key.startsWith(`${item}.`))
        .forEach(key => values.delete(key));
}

function findEditable(node: Element) {
    const target = node.closest<HTMLElement>('[data-edit]');

    return target && isHookable(target) ? target : null;
}

function findItemTarget(item: string, anchors: CardAnchor[]) {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(`[data-edit-item="${item}"]`));

    const visible = cards.find(card => !card.classList.contains(HIDDEN_CLASS));

    if (visible) return visible;

    const fallback = cards[0]?.parentElement ?? anchors.find(anchor => anchor.parent?.isConnected)?.parent ?? null;

    return fallback instanceof HTMLElement ? fallback : null;
}

function findOperationTarget(operation: Operation) {
    if (operation.kind === 'edit') return document.querySelector<HTMLElement>(`[data-edit="${operation.key}"], [data-edit-view="${operation.key}"]`);

    const item = operation.kind === 'add' ? `${operation.collection}/${operation.addition.id}` : operation.item;

    return findItemTarget(item, operation.anchors);
}

function findTemplate(list: HTMLElement, collection: string) {
    const items = Array.from(list.querySelectorAll<HTMLElement>(`[data-edit-item^="${collection}/"]`));

    return items.filter(item => !item.classList.contains(HIDDEN_CLASS)).at(-1) ?? items.at(-1) ?? null;
}

function flashTarget(element: HTMLElement) {
    clearFlash();

    flashed = element;
    element.classList.add(FLASH_CLASS);
    flashTimer = window.setTimeout(clearFlash, FLASH_DELAY);
}

function formatCount(changes: number) {
    return changes > COUNT_LIMIT ? `${COUNT_LIMIT}+` : String(changes);
}

function getBaseline(stored: StoredEdits, key: string, fallback: string | undefined) {
    return stored.edits[key] ?? originals.get(key) ?? fallback;
}

function getCapStatus(stored: StoredEdits) {
    if (Object.values(stored.additions).some(entries => entries.length > MAX_ADDITIONS)) return STATUS_ADD_LIMIT;
    if (stored.deletions.length > MAX_DELETIONS) return STATUS_DELETE_LIMIT;
    if (Object.keys(stored.edits).length > MAX_EDITS) return STATUS_EDIT_LIMIT;

    return '';
}

function getControlPosition(rect: DOMRect, size: number, placement: string) {
    if (placement !== 'inside') return { left: rect.right - size - CONTROL_GAP, top: rect.top + CONTROL_GAP };

    const bottom = Math.min(rect.bottom, window.innerHeight) - size - CONTROL_GAP;

    return { left: rect.right - size - CONTROL_GAP, top: Math.max(bottom, rect.top + CONTROL_GAP) };
}

function getFieldName(key: string) {
    return key.split('.').slice(1).join('.');
}

function getHeaderOffset() {
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);

    return (header?.getBoundingClientRect().height ?? 0) + REVEAL_GAP;
}

function getPending() {
    return operations.slice(0, cursor);
}

function getPlaceholder(collection: string, field: string) {
    const placeholders = PLACEHOLDERS[collection] ?? {};
    const [root = ''] = field.split('.');

    return placeholders[field] ?? placeholders[root] ?? PLACEHOLDER_TEXT;
}

function getScope(list: HTMLElement) {
    return list.closest<HTMLElement>('[data-edit-scope]')?.dataset.editScope ?? '';
}

function getToday() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date()).replace(/-/g, '.');
}

function getToggleLabel(changes: number) {
    if (isConfirming) return `${CONFIRM_PREFIX}${changes}${CHANGE_SUFFIX}${CONFIRM_SUFFIX}`;
    if (changes === 0) return TOGGLE_LABEL;

    return `${TOGGLE_LABEL}${LABEL_PENDING}${changes}${CHANGE_SUFFIX}`;
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (!hasPending()) return;

    event.preventDefault();
}

function handleClick(event: MouseEvent) {
    if (!(event.target instanceof Element) || isEditorChrome(event.target)) return;

    const target = isEditing ? findEditable(event.target) : null;

    const link = target ? null : event.target.closest('a[href]');

    if (link instanceof HTMLAnchorElement && isNavigation(link, event)) {
        if (!hasPending()) return;

        recordActive();

        if (countChanges() > 0 && !isConfirming) {
            event.preventDefault();
            confirmExit();

            return;
        }

        clearConfirm();
        clearFlash();
        revertPending();
        updateCounts();
        syncCluster();

        return;
    }

    if (!isEditing) return;

    if (event.target.closest('a, button') || target) event.preventDefault();
    if (target) activate(target);
}

function handleEscape() {
    if (activeElement) {
        discardActive();

        return;
    }

    if (isEditing) toggleEditing();
}

function handleFocusIn(event: FocusEvent) {
    if (!isEditing || !(event.target instanceof Element) || isEditorChrome(event.target)) return;

    trackTarget(event.target);
}

function handleFocusOut(event: FocusEvent) {
    if (!activeElement || event.target !== activeElement) return;
    if (event.relatedTarget instanceof Element && isEditorChrome(event.relatedTarget)) return;

    recordActive();
}

function handleKeydown(event: KeyboardEvent) {
    isTapping = !activeElement && !isTyping() && isModifierTap(event);

    if (event.key === 'Escape') {
        handleEscape();

        return;
    }

    if (!isEditing) return;

    if (activeElement) {
        if (event.key === 'Enter' && (event.altKey || event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            recordActive();
        }

        return;
    }

    if (isUndoKey(event)) {
        event.preventDefault();
        undoOperation();

        return;
    }

    if (isRedoKey(event)) {
        event.preventDefault();
        redoOperation();

        return;
    }

    if (!(event.target instanceof Element) || isEditorChrome(event.target)) return;

    const target = findEditable(event.target);

    if (event.key === 'Enter' && target) {
        event.preventDefault();
        activate(target);

        return;
    }

    if (event.key !== 'Tab' || event.shiftKey || !event.target.closest('[data-edit], [data-edit-item], [data-edit-list]')) return;

    const control = [addControl, deleteControl].find(candidate => candidate && !candidate.hidden);

    if (control) {
        event.preventDefault();
        control.focus();
    }
}

function handleKeyup(event: KeyboardEvent) {
    if (!isTapping || activeElement || event.key !== MODIFIER_KEY) return;

    isTapping = false;
    toggleEditing();
}

function handlePaste(event: ClipboardEvent) {
    if (!activeElement || supportsPlaintextOnly()) return;

    event.preventDefault();
    document.execCommand('insertText', false, event.clipboardData?.getData('text/plain') ?? '');
}

function handlePointerOver(event: PointerEvent) {
    if (!isEditing || !(event.target instanceof Element)) return;

    hoveredControl = isEditorChrome(event.target) ? event.target.closest<HTMLElement>('[data-editor]') : null;

    if (hoveredControl) syncControls();
    else trackTarget(event.target);
}

function handlePreparation() {
    if (hasPending()) cancelEdits();
}

function hasPending() {
    if (activeElement && readValue(activeElement) !== activeSnapshot) return true;

    return countChanges() > 0;
}

function hideItem(item: string) {
    document.querySelectorAll(`[data-edit-item="${item}"]`).forEach(node => node.classList.add(HIDDEN_CLASS));
}

function insertCards(list: HTMLElement, collection: string, additions: Addition[]) {
    const inserted: HTMLElement[] = [];
    const scope = getScope(list);
    const template = findTemplate(list, collection);

    if (!template) return inserted;

    const cards = document.createDocumentFragment();

    additions.forEach((addition) => {
        if (addition.scope !== scope || list.querySelector(`[data-edit-item="${collection}/${addition.id}"]`)) return;

        const card = createCard(template, collection, addition.id, addition.fields);

        cards.append(card);
        inserted.push(card);
    });

    template.after(cards);

    return inserted;
}

function isAddition(value: unknown): value is { fields: unknown; id: string; scope: unknown } {
    return isRecord(value) && typeof value.id === 'string' && SLUG_PATTERN.test(value.id);
}

function isEditorChrome(node: Element) {
    return Boolean(overlay?.contains(node)) || Boolean(panel?.contains(node));
}

function isHookable(element: HTMLElement) {
    return !element.closest(CONTROL_SELECTOR) && !element.closest(CHROME_SELECTOR);
}

function isModifierTap(event: KeyboardEvent) {
    const modifiers = [event.altKey, event.ctrlKey, event.metaKey, event.shiftKey].filter(Boolean);

    return event.key === MODIFIER_KEY && modifiers.length === 1;
}

function isNavigation(link: HTMLAnchorElement, event: MouseEvent) {
    if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
    if (link.hasAttribute('download') || (link.target !== '' && link.target !== '_self')) return false;

    const url = new URL(link.href, location.href);

    if (url.origin !== location.origin) return false;

    return url.pathname !== location.pathname || url.search !== location.search;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRedoKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    if (event.ctrlKey && !event.shiftKey && key === 'y') return true;

    return (event.ctrlKey || event.metaKey) && event.shiftKey && key === 'z';
}

function isStorageAvailable() {
    try {
        localStorage.getItem(EDITS_KEY);

        return true;
    } catch {
        return false;
    }
}

function isTyping() {
    const node = document.activeElement;

    if (!(node instanceof HTMLElement)) return false;

    return node.isContentEditable || node instanceof HTMLInputElement || node instanceof HTMLSelectElement || node instanceof HTMLTextAreaElement;
}

function isUndoKey(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
}

function markChanges() {
    const { items, keys } = collectChanges();

    document.querySelectorAll(`.${CHANGED_CLASS}`).forEach(node => node.classList.remove(CHANGED_CLASS));
    items.forEach(item => document.querySelectorAll(`[data-edit-item="${item}"]`).forEach(node => node.classList.add(CHANGED_CLASS)));
    keys.forEach(key => document.querySelectorAll(`[data-edit="${key}"], [data-edit-view="${key}"]`).forEach(node => node.classList.add(CHANGED_CLASS)));

    return items.size + keys.size;
}

function mergeDeletion(stored: StoredEdits, item: string) {
    const [collection = '', id = ''] = item.split('/');

    const additions = stored.additions[collection] ?? [];

    const remaining = additions.filter(addition => addition.id !== id);

    if (remaining.length === additions.length) {
        if (!stored.deletions.includes(item)) stored.deletions.push(item);

        return;
    }

    if (remaining.length > 0) stored.additions[collection] = remaining;
    else delete stored.additions[collection];

    Object.keys(stored.edits)
        .filter(key => key.startsWith(`${item}.`))
        .forEach(key => delete stored.edits[key]);
}

function mergeEdit(stored: StoredEdits, key: string, value: string) {
    if (!KEY_PATTERN.test(key)) return;

    if (value === originals.get(key)) delete stored.edits[key];
    else stored.edits[key] = value.slice(0, MAX_EDIT_LENGTH);
}

function parseAdditions(value: unknown) {
    const additions: Record<string, Addition[]> = {};

    if (!isRecord(value)) return additions;

    Object.entries(value).forEach(([collection, entries]) => {
        if (!COLLECTION_PATTERN.test(collection) || !Array.isArray(entries)) return;

        const parsed = entries
            .filter(isAddition)
            .slice(0, MAX_ADDITIONS)
            .map(entry => ({
                fields: parseFields(entry.fields),
                id: entry.id,
                scope: typeof entry.scope === 'string' ? entry.scope.slice(0, MAX_EDIT_LENGTH) : '',
            }));

        if (parsed.length > 0) additions[collection] = parsed;
    });

    return additions;
}

function parseDeletions(value: unknown) {
    if (!Array.isArray(value)) return [];

    return [...new Set(value.filter((item): item is string => typeof item === 'string' && ITEM_PATTERN.test(item)))].slice(0, MAX_DELETIONS);
}

function parseFields(value: unknown) {
    const fields: Record<string, string> = {};

    if (!isRecord(value)) return fields;

    Object.entries(value).forEach(([field, text]) => {
        if (FIELD_PATTERN.test(field) && typeof text === 'string') fields[field] = text.slice(0, MAX_EDIT_LENGTH);
    });

    return fields;
}

function parseValues(value: unknown) {
    const values: Record<string, string> = {};

    if (!isRecord(value)) return values;

    Object.entries(value)
        .filter((entry): entry is [string, string] => KEY_PATTERN.test(entry[0]) && typeof entry[1] === 'string')
        .slice(0, MAX_EDITS)
        .forEach(([key, text]) => {
            values[key] = text.slice(0, MAX_EDIT_LENGTH);
        });

    return values;
}

function positionControl(control: HTMLElement | null, anchor: HTMLElement | null, placement: string) {
    if (!control) return;

    if (!anchor || !isEditing) {
        control.hidden = true;

        return;
    }

    control.hidden = false;

    const rect = anchor.getBoundingClientRect();
    const size = control.offsetWidth;

    const { left, top } = getControlPosition(rect, size, placement);

    control.style.left = `${Math.round(Math.min(Math.max(left, CONTROL_GAP), window.innerWidth - size - CONTROL_GAP))}px`;
    control.style.top = `${Math.round(Math.min(Math.max(top, CONTROL_GAP), window.innerHeight - size - CONTROL_GAP))}px`;
}

function positionFloater() {
    if (!floaterControl) return;

    const anchor = activeElement ?? hoveredTarget;

    if (!anchor || !isEditing) {
        floaterControl.hidden = true;

        return;
    }

    if (floaterId) floaterId.textContent = anchor.dataset.editId ?? '';
    if (floaterKey) floaterKey.textContent = anchor.dataset.edit ?? '';
    floaterControl.hidden = false;

    const rect = anchor.getBoundingClientRect();

    const left = Math.min(Math.max(rect.left, CONTROL_GAP), window.innerWidth - floaterControl.offsetWidth - CONTROL_GAP);
    const top = rect.top - floaterControl.offsetHeight - CONTROL_GAP;

    floaterControl.style.left = `${Math.round(left)}px`;
    floaterControl.style.top = `${Math.round(top < CONTROL_GAP ? rect.bottom + CONTROL_GAP : top)}px`;
}

function pushEdit(key: string, snapshot: string, value: string) {
    operations.length = cursor;

    const index = operations.findIndex(operation => operation.kind === 'edit' && operation.key === key);

    const [existing] = index === -1 ? [] : operations.splice(index, 1);

    const before = existing?.kind === 'edit' ? existing.before : snapshot;

    const isReverted = value === getBaseline(readEdits(), key, before);

    if (!isReverted) operations.push({ after: value, before, key, kind: 'edit' });

    cursor = operations.length;

    return isReverted;
}

function pushOperation(operation: Operation) {
    operations.length = cursor;
    operations.push(operation);
    cursor = operations.length;
}

function readEdits(): StoredEdits {
    try {
        const raw = localStorage.getItem(EDITS_KEY);

        const parsed: unknown = raw ? JSON.parse(raw) : null;

        if (!isRecord(parsed)) return createEdits();

        return {
            additions: parseAdditions(parsed.additions),
            deletions: parseDeletions(parsed.deletions),
            edits: parseValues(parsed.edits),
        };
    } catch {
        return createEdits();
    }
}

function readValue(element: HTMLElement) {
    return collectText(element).trim();
}

function recordActive() {
    if (!activeElement) return;

    const element = activeElement;

    const key = element.dataset.edit ?? '';
    const value = readValue(element);

    deactivate();

    if (value === activeSnapshot) {
        setStatus('');

        return;
    }

    const isReverted = pushEdit(key, activeSnapshot, value);

    applyValue(key, value);
    setStatus(isReverted ? STATUS_REVERTED : STATUS_PENDING);
    syncCluster();
}

function redoOperation() {
    clearConfirm();
    recordActive();

    const operation = operations[cursor];

    if (!operation) return;

    cursor++;
    applyOperation(operation);
    setTabStops(isEditing);
    updateCounts();
    syncCluster();
    refreshMotion();
    setStatus(`${STATUS_REDONE}${revealOperation(operation) ? STATUS_LOCATED : ''}`);
}

function refreshMotion() {
    if (ScrollTrigger.getAll().length > 0) ScrollTrigger.refresh();
}

function removeCard(operation: DeleteOperation) {
    if (operation.isDetached) detachCards(operation.anchors);
    else hideItem(operation.item);
}

async function resolveEditor() {
    const session = await getSession();

    return session?.user.role === EDITOR_ROLE;
}

function restoreCard(operation: DeleteOperation) {
    if (operation.isDetached) attachCards(operation.anchors);
    else showItem(operation.item);
}

function restoreCards(collection: string, additions: Addition[]) {
    document.querySelectorAll<HTMLElement>(`[data-edit-list="${collection}"]`).forEach(list => insertCards(list, collection, additions));
}

function revealOperation(operation: Operation) {
    const element = findOperationTarget(operation);

    if (!element) return false;

    flashTarget(element);
    scrollToTarget(element);

    return true;
}

function revertOperation(operation: Operation) {
    if (operation.kind === 'add') detachCards(operation.anchors);
    else if (operation.kind === 'delete') restoreCard(operation);
    else applyValue(operation.key, operation.before);
}

function revertPending() {
    while (cursor > 0) {
        cursor--;

        const operation = operations[cursor];

        if (operation) revertOperation(operation);
    }

    operations.length = 0;
    setTabStops(isEditing);
}

function scrollToTarget(element: HTMLElement) {
    const offset = getHeaderOffset();
    const rect = element.getBoundingClientRect();

    if (rect.top >= offset && rect.bottom <= window.innerHeight) return;

    window.scrollTo({ top: Math.max(window.scrollY + rect.top - offset, 0) });
}

function setDate(element: HTMLTimeElement, display: string) {
    element.dateTime = display.replace(/\./g, '-');
    element.textContent = display;
}

function setStatus(message: string) {
    if (statusLine) statusLine.textContent = message;
}

function setTabStops(isEditing: boolean) {
    if (!isEditing) {
        tabStops.forEach(element => element.removeAttribute('tabindex'));
        tabStops.clear();

        return;
    }

    document.querySelectorAll<HTMLElement>('[data-edit]').forEach((element) => {
        if (element.hasAttribute('tabindex') || !isHookable(element)) return;

        element.tabIndex = 0;
        tabStops.add(element);
    });
}

function setTarget(element: HTMLElement | null) {
    hoveredTarget?.classList.remove(TARGET_CLASS);
    hoveredTarget = element;
    hoveredTarget?.classList.add(TARGET_CLASS);
}

function showItem(item: string) {
    document.querySelectorAll(`[data-edit-item="${item}"]`).forEach(node => node.classList.remove(HIDDEN_CLASS));
}

function startEditing() {
    clearConfirm();
    isEditing = true;
    revealEverything();
    setTabStops(true);
    syncEditing();
    setStatus(STATUS_ENABLED);
    syncCluster();
}

function stopEditing() {
    clearConfirm();
    clearFlash();
    recordActive();
    hoveredControl = null;
    hoveredItem = null;
    hoveredList = null;
    isEditing = false;
    isTapping = false;
    setTarget(null);
    setTabStops(false);
    syncEditing();
    setStatus(STATUS_DISABLED);
    syncCluster();
    refreshMotion();
}

function storeEdits(edits: StoredEdits) {
    const additions: Record<string, Addition[]> = {};

    Object.entries(edits.additions).forEach(([collection, entries]) => {
        additions[collection] = entries.slice(0, MAX_ADDITIONS).map(entry => ({
            fields: parseFields(entry.fields),
            id: entry.id,
            scope: entry.scope,
        }));
    });

    const payload: StoredEdits = {
        additions,
        deletions: edits.deletions.slice(0, MAX_DELETIONS),
        edits: Object.fromEntries(Object.entries(edits.edits).slice(0, MAX_EDITS).map(([key, value]) => [key, value.slice(0, MAX_EDIT_LENGTH)])),
    };

    const isEmpty = Object.keys(payload.additions).length === 0 && payload.deletions.length === 0 && Object.keys(payload.edits).length === 0;

    try {
        if (isEmpty) localStorage.removeItem(EDITS_KEY);
        else localStorage.setItem(EDITS_KEY, JSON.stringify(payload));

        updateCaps(payload);

        return true;
    } catch {
        return false;
    }
}

function stripIdentifiers(card: HTMLElement) {
    [card, ...card.querySelectorAll<HTMLElement>('[data-edit-id], [data-edit-item-id]')].forEach((node) => {
        delete node.dataset.editId;
        delete node.dataset.editItemId;
    });
}

function supportsPlaintextOnly() {
    if (hasPlaintextSupport === undefined) {
        const probe = document.createElement('div');

        probe.setAttribute('contenteditable', 'plaintext-only');
        hasPlaintextSupport = probe.contentEditable === 'plaintext-only';
    }

    return hasPlaintextSupport;
}

function syncCluster() {
    updateCaps(buildEdits());

    const changes = markChanges();

    if (acceptControl) acceptControl.disabled = changes === 0;
    if (cancelControl) cancelControl.disabled = operations.length === 0;
    if (redoControl) redoControl.disabled = cursor >= operations.length;
    if (undoControl) undoControl.disabled = cursor === 0;

    syncControls();
    syncToggle(changes);
}

function syncControls() {
    const isCapped = cappedCollections.has(hoveredList?.dataset.editList ?? '');

    positionControl(addControl, isCapped ? null : hoveredList, 'inside');
    positionControl(deleteControl, hoveredItem, 'corner');
    positionFloater();

    if (hoveredControl) {
        [addControl, deleteControl].forEach((control) => {
            if (control && control !== hoveredControl) control.hidden = true;
        });
    }
}

function syncEditing() {
    document.body.classList.toggle(BODY_CLASS, isEditing);
    panel?.classList.toggle(EDITING_CLASS, isEditing);
    toggleControl?.setAttribute('aria-pressed', String(isEditing));

    if (!cluster) return;

    cluster.hidden = !isEditing;
    cluster.inert = !isEditing;
}

function syncToggle(changes: number) {
    if (!toggleControl) return;

    toggleControl.classList.toggle(CONFIRM_CLASS, isConfirming);
    toggleControl.classList.toggle(DIRTY_CLASS, changes > 0 && !isConfirming);
    toggleControl.setAttribute('aria-label', getToggleLabel(changes));

    if (!badgeControl) return;

    badgeControl.hidden = changes === 0;
    badgeControl.textContent = formatCount(changes);
}

function toggleEditing() {
    if (isEditing) stopEditing();
    else startEditing();
}

function trackTarget(element: Element) {
    hoveredItem = element.closest<HTMLElement>(`[data-edit-item]:not(.${HIDDEN_CLASS})`);
    hoveredList = element.closest<HTMLElement>('[data-edit-list]');
    setTarget(findEditable(element));
    syncControls();
}

function undoOperation() {
    clearConfirm();
    recordActive();

    const operation = operations[cursor - 1];

    if (!operation) return;

    cursor--;
    revertOperation(operation);
    setTabStops(isEditing);
    updateCounts();
    syncCluster();
    refreshMotion();
    setStatus(`${STATUS_UNDONE}${revealOperation(operation) ? STATUS_LOCATED : ''}`);
}

function updateCaps(stored: StoredEdits) {
    cappedCollections.clear();

    Object.entries(stored.additions).forEach(([collection, entries]) => {
        if (entries.length >= MAX_ADDITIONS) cappedCollections.add(collection);
    });
}

function updateCounts() {
    document.querySelectorAll<HTMLElement>('[data-edit-count]').forEach((element) => {
        const collection = element.dataset.editCount ?? '';
        const total = element.dataset.editCountTotal;

        const count = total === undefined ? countItems(collection, element.dataset.editCountScope) : countTotal(collection, total);

        element.textContent = `${element.dataset.prefix ?? ''}${count}${element.dataset.suffix ?? ''}`;

        if (element.dataset.countTo !== undefined) {
            element.dataset.countTo = String(count);
            element.dataset.counted = '';
        }
    });
}

function writeValue(element: HTMLElement, value: string) {
    const [first = '', ...rest] = value.split('\n');
    const line = createBreak(element);

    element.textContent = first;
    rest.forEach(text => element.append(line.cloneNode(), text));
}

document.addEventListener('astro:after-swap', applyForEditor);
document.addEventListener('astro:before-preparation', handlePreparation);

applyForEditor();

export async function initEditor(signal: AbortSignal): Promise<void> {
    clearConfirmTimer();
    clearFlash();

    activeElement = null;
    cursor = 0;
    hoveredControl = null;
    hoveredItem = null;
    hoveredList = null;
    hoveredTarget = null;
    isConfirming = false;
    isTapping = false;
    operations.length = 0;
    overlay = document.querySelector<HTMLElement>('.editor-controls');
    panel = document.querySelector<HTMLElement>('.editor-panel');
    tabStops.clear();

    if (!overlay || !panel) return;

    const isEditor = await checkEditor();

    if (!isEditor) {
        overlay.remove();
        panel.remove();
        overlay = null;
        panel = null;

        return;
    }

    acceptControl = panel.querySelector<HTMLButtonElement>('[data-editor="accept"]');
    addControl = overlay.querySelector<HTMLElement>('[data-editor="add"]');
    badgeControl = panel.querySelector<HTMLElement>('[data-editor="badge"]');
    cancelControl = panel.querySelector<HTMLButtonElement>('[data-editor="cancel"]');
    cluster = panel.querySelector<HTMLElement>('[data-editor="cluster"]');
    deleteControl = overlay.querySelector<HTMLElement>('[data-editor="delete"]');
    floaterControl = overlay.querySelector<HTMLElement>('[data-editor="floater"]');
    floaterId = overlay.querySelector<HTMLElement>('[data-editor="floater-id"]');
    floaterKey = overlay.querySelector<HTMLElement>('[data-editor="floater-key"]');
    redoControl = panel.querySelector<HTMLButtonElement>('[data-editor="redo"]');
    statusLine = panel.querySelector<HTMLElement>('[data-editor="status"]');
    toggleControl = panel.querySelector<HTMLButtonElement>('[data-editor="toggle"]');
    undoControl = panel.querySelector<HTMLButtonElement>('[data-editor="undo"]');
    panel.hidden = false;

    acceptControl?.addEventListener('click', acceptEdits, { signal });
    cancelControl?.addEventListener('click', cancelEdits, { signal });
    redoControl?.addEventListener('click', redoOperation, { signal });
    toggleControl?.addEventListener('click', toggleEditing, { signal });
    undoControl?.addEventListener('click', undoOperation, { signal });

    addControl?.addEventListener('click', () => {
        if (hoveredList) addCard(hoveredList);
    }, { signal });

    deleteControl?.addEventListener('click', () => {
        if (hoveredItem) deleteCard(hoveredItem);
    }, { signal });

    overlay.addEventListener('mousedown', event => event.preventDefault(), { signal });
    panel.addEventListener('mousedown', event => event.preventDefault(), { signal });

    document.addEventListener('auxclick', handleClick, { capture: true, signal });
    document.addEventListener('click', handleClick, { capture: true, signal });
    document.addEventListener('focusin', handleFocusIn, { signal });
    document.addEventListener('focusout', handleFocusOut, { signal });
    document.addEventListener('keydown', handleKeydown, { signal });
    document.addEventListener('keyup', handleKeyup, { signal });
    document.addEventListener('paste', handlePaste, { signal });
    document.addEventListener('pointerdown', cancelTap, { signal });
    document.addEventListener('pointerover', handlePointerOver, { signal });
    window.addEventListener('beforeunload', handleBeforeUnload, { signal });
    window.addEventListener('blur', cancelTap, { signal });
    window.addEventListener('resize', syncControls, { signal });
    window.addEventListener('scroll', syncControls, { passive: true, signal });

    if (isEditing) revealEverything();

    syncEditing();
    setTabStops(isEditing);
    setStatus('');
    syncCluster();
}
