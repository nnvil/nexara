<script lang="ts">
    import { page } from "$app/stores";
    import { currentPageTitle } from "$lib/stores/pageTitle";

    import IconChevronRight from "@tabler/icons-svelte/IconChevronRight.svelte";

    export let path: string;
    export let title: string;
    export let icon: ConstructorOfATypedSvelteComponent;
    export let iconColor: "light-gray" | "light-red" = "light-gray";
    export let textColor: "secondary" | "light-red" = "secondary";

    $: isActive = $page.url.pathname === path;
    $: if (isActive) {
        currentPageTitle.set(title);
    }
</script>

<a class="subnav-button" href={path} class:active={isActive} role="button">
    <div class="subnav-tab" style="--icon-color: var(--{iconColor})">
        <div class="tab-icon">
            <svelte:component this={icon} />
        </div>
        <div class="subnav-tab-text" style="color: var(--{textColor})">
            {title}
        </div>
    </div>
    <div class="subnav-tab-chevron">
        <IconChevronRight />
    </div>
</a>

<style>
    .subnav-button {
        --small-padding: 4px;
        --big-padding: 6px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: calc(var(--small-padding) * 2);
        padding: var(--big-padding);
        font-weight: 500;
        border-radius: var(--border-radius);
        overflow: hidden;

        text-decoration: none;
        text-decoration-line: none;

        cursor: pointer;
    }

    .subnav-tab {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: calc(var(--big-padding) * 1.5);
        font-weight: 500;
    }

    .tab-icon {
        padding: var(--small-padding);
    }

    .subnav-button .tab-icon :global(svg) {
        stroke-width: 2px;
        stroke: var(--brand);
        height: 20px;
        width: 20px;
    }

    .subnav-button:not(.active) .tab-icon :global(svg) {
        stroke: var(--icon-color);
    }

    .subnav-tab-chevron :global(svg) {
        display: none;
        stroke: var(--light-gray);
        height: 18px;
        width: 18px;
    }

    @media (hover: hover) {
        .subnav-button:hover {
            background: var(--nav-hover);
        }
    }

    .subnav-button:active,
    .subnav-button:focus:hover:not(.active) {
        background: var(--nav-press);
    }

    .subnav-button.active {
        background: var(--nav-hover);
        cursor: default;
    }

    .subnav-tab-text {
        font-size: 14.5px;
    }

    @media screen and (max-width: 750px) {
        .subnav-button {
            --big-padding: 7px;
            background: none;
            padding: var(--big-padding) 11px;
            border-radius: 0;
        }

        .subnav-tab-chevron :global(svg) {
            display: block;
        }
    }
</style>
