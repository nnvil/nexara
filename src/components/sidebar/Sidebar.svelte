<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { currentPageTitle } from "$lib/stores/pageTitle";

    const defaultNavPage = () => {
        if (browser && window.innerWidth <= 750) {
            return "/account";
        } else {
            return "/account/settings";
        }
    };

    import IconArrowLeft from "@tabler/icons-svelte/IconArrowLeft.svelte";

    export let pageName: "account";
    export let homeNavPath: string;
    export let homeTitle: string;

    let screenWidth: number;

    $: isMobile = screenWidth <= 750;
    $: isHome = $page.url.pathname === homeNavPath;
    $: {
        if (browser && !isMobile && isHome) {
            goto(defaultNavPage(), { replaceState: true });
        }
    }
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div id="{pageName}-page" class="sidebar-page">
    <div class="sidebar-sidebar" class:back-visible={!isHome && isMobile}>
        <div class="sidebar-header">
            {#if isMobile}
                {#if !isHome}
                    <a
                        class="back-button"
                        href={homeNavPath}
                        role="button"
                        aria-label="back"
                    >
                        <IconArrowLeft />
                    </a>
                {/if}
                <h3
                    class="sidebar-page-title"
                    aria-level="1"
                    tabindex="-1"
                    data-first-focus
                >
                    {#if !isHome}
                        {$currentPageTitle}
                    {:else}
                        {homeTitle}
                    {/if}
                </h3>
            {:else}
                <h2 class="sidebar-page-title" aria-level="1">
                    {homeTitle}
                </h2>
            {/if}
        </div>

        <nav
            class="sidebar-navigation"
            class:visible-mobile={isMobile && isHome}
        >
            <slot name="navigation"></slot>
            <!--  -->
        </nav>
    </div>

    {#if !isMobile || !isHome}
        <main
            id="{pageName}-page-content"
            class="sidebar-page-content"
            tabindex="-1"
            data-first-focus
        >
            <slot class="content" name="content"></slot>
        </main>
    {/if}
</div>

<style>
    .sidebar-page {
        --sidebar-nav-width: 250px;
        --sidebar-padding: 26px;
        --sidebar-padding-small: calc(var(--sidebar-padding) - var(--padding));
        display: grid;
        width: 100%;
        grid-template-columns: var(--sidebar-nav-width) 1fr;
        overflow: hidden;
        padding-left: var(--sidebar-padding);
        column-gap: calc(var(--sidebar-padding) / 2);
    }

    .sidebar-page-content {
        display: flex;
        flex-direction: column;
        width: fit-content;
        padding: calc(var(--sidebar-padding) / 2);
        overflow-y: scroll;
    }

    .sidebar-sidebar,
    .sidebar-navigation {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }

    .sidebar-sidebar {
        width: var(--sidebar-nav-width);
        padding-top: var(--sidebar-padding);
    }

    .sidebar-sidebar.back-visible {
        overflow: visible;
    }

    .sidebar-sidebar {
        gap: var(--padding);
    }

    .sidebar-navigation {
        gap: var(--padding);
        padding-bottom: var(--padding);
    }

    .sidebar-header {
        --back-padding: calc(var(--padding) / 2);
    }

    .back-button {
        display: flex;
        align-items: center;
        color: var(--secondary);
        gap: var(--back-padding);
        padding: var(--back-padding);

        position: absolute;
        left: var(--back-padding);
    }

    .back-button:active {
        background: var(--nav-hover);
        border-radius: var(--border-radius);
    }

    .back-button :global(svg) {
        stroke-width: 1.8px;
        height: 22px;
        width: 22px;
        will-change: transform;
    }

    @media screen and (max-width: 1000px) {
        .sidebar-page {
            column-gap: 0;
        }
    }

    @media screen and (max-width: 750px) {
        .sidebar-page {
            --sidebar-nav-width: 100%;
            display: flex;
            flex-direction: column;
            grid-template-columns: 1fr;
            padding: 0;
        }

        .sidebar-navigation {
            padding: var(--padding);
            padding-bottom: calc(var(--padding) * 2);
            display: none;
        }

        .sidebar-navigation.visible-mobile {
            display: flex;
        }

        .sidebar-page-content {
            padding: var(--padding) 0;
            padding-top: 0;
            max-width: unset;
        }

        .sidebar-header {
            display: flex;
            align-items: center;
            position: sticky;
            padding: var(--padding);
            gap: 4px;
            justify-content: center;
        }

        .sidebar-sidebar {
            gap: 0px;
            padding: 0;
        }

        .sidebar-page-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            text-align: center;
            letter-spacing: -0.3px;
            font-size: 16.5px;
        }
    }
</style>
