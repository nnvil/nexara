<script lang="ts">
    export let sectionTitle: string = "";
</script>

<div id="sidebar-section">
    {#if sectionTitle}
        <div id="sidebar-section-title">
            {sectionTitle}
        </div>
    {/if}
    <div id="sidebar-section-categories">
        <slot></slot>
    </div>
</div>

<style>
    #sidebar-section,
    #sidebar-section-categories {
        display: flex;
        flex-direction: column;
    }

    #sidebar-section {
        gap: 6px;
        border-radius: var(--border-radius);
    }

    #sidebar-section-title {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--gray);
        padding-left: 8px;
    }

    @media screen and (max-width: 750px) {
        #sidebar-section-categories {
            background: var(--button);
            border-radius: var(--border-radius);
            overflow-x: hidden;
        }

        #sidebar-section-title {
            padding-left: calc(7px * 1.5);
        }
    }
</style>
