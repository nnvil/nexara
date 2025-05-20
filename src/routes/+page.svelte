<script lang="ts">
    import Discord from "$components/icons/Discord.svelte";
    import Nexara from "$components/icons/nexara.svelte";
    import { socialLinks } from "$lib/env";
</script>

<svelte:head>
    <title>nexara</title>
    <meta property="og:title" content="nexara" />
</svelte:head>

<div id="wrapper">
    <div id="navbar">
        <nav>
            <a class="nav-tab" href="/">
                <Nexara size={30} />
            </a>
            <a href="/login">
                <button>Zaloguj się</button>
            </a>
        </nav>
    </div>
    <div id="content" class="center">
        <div class="heading">
            <Nexara color={"var(--brand)"} size={80} />
            <h1>nexara</h1>
        </div>
        <p>
            Społeczność pasjonatów technologii, wolnego oprogramowania i
            prywatności. Dążymy do stworzenia inspirującego i wspierającego
            środowiska, w którym każdy może się rozwijać.
        </p>
        <a href={socialLinks.discord}>
            <button><Discord size={24} /> Dołącz do nas</button>
        </a>
    </div>
</div>

<style>
    #navbar {
        display: flex;
        flex-direction: row;
        padding: var(--padding);
        width: 100%;
        max-width: calc(var(--max-width) / 2);
    }

    nav {
        display: flex;
        background-color: var(--button);
        border-radius: var(--border-radius-lg);
        padding: var(--padding) calc(var(--padding) * 2);
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    #wrapper {
        z-index: 1;
        border-radius: var(--border-radius);
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
    }

    #content {
        margin-top: -1rem;
        display: flex;
        gap: var(--padding);
        text-align: center;
        max-width: calc(var(--max-width) / 1.5);
        font-weight: 500;
    }

    .heading {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-size: 44px;
    }

    p {
        font-size: 20px;
    }

    a {
        text-decoration: none;
        text-decoration-line: none;
    }

    a:hover {
        color: var(--brand);
    }

    button {
        all: unset;
        margin-top: var(--padding);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 500px;
        color: white;
        cursor: pointer;
        gap: 5px;
        font-weight: 500;
        transition:
            0.2s background,
            color;
        box-shadow: 0 0 0 2px var(--brand) inset;
    }

    button:hover {
        background-color: var(--brand);
        color: black;
    }

    nav button {
        padding: 8px 16px;
        margin: 0;
        background-color: var(--white);
        box-shadow: none;
        color: black;
    }
</style>
