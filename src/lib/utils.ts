export function initInertControls(selector: string, signal: AbortSignal): void {
    document.querySelectorAll(selector).forEach((control) => {
        control.addEventListener('auxclick', event => event.preventDefault(), { signal });
        control.addEventListener('click', event => event.preventDefault(), { signal });
    });
}

export function registerPageScript(init: (signal: AbortSignal) => void): void {
    let controller: AbortController | undefined;

    function handlePageLoad() {
        teardown();
        controller = new AbortController();
        init(controller.signal);
    }

    function teardown() {
        controller?.abort();
    }

    document.addEventListener('astro:before-swap', teardown);
    document.addEventListener('astro:page-load', handlePageLoad);
}
