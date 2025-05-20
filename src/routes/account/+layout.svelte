<script lang="ts">
    import Sidebar from "$components/sidebar/Sidebar.svelte";

    import SidebarTab from "$components/sidebar/SidebarTab.svelte";
    import SidebarSection from "$components/sidebar/SidebarSection.svelte";

    import IconUser from "@tabler/icons-svelte/IconUser.svelte";
    import IconLink from "@tabler/icons-svelte/IconLink.svelte";

    import IconLock from "@tabler/icons-svelte/IconLock.svelte";

    import IconLogout from "@tabler/icons-svelte/IconLogout.svelte";
    import IconCalendarEvent from "@tabler/icons-svelte/IconCalendarEvent.svelte";
    import { user } from "$lib/stores/user";

    $: username = $user?.username || "";
</script>

<Sidebar
    pageName="account"
    homeNavPath="/account"
    homeTitle={`Witaj, ${username}!`}
>
    <svelte:fragment slot="navigation">
        <SidebarSection>
            <SidebarTab
                path="/account/settings"
                title="Moje konto"
                icon={IconUser}
            />
            <SidebarTab
                path="/account/privacy"
                title="Prywatność"
                icon={IconLock}
            />
            <!-- <SidebarTab
                path="/account/connections"
                title="Połączone konta" 
                icon={IconLink}
            /> -->
        </SidebarSection>

        <!-- <SidebarSection>
            <SidebarTab
                path="/account/calendar"
                title="Wydarzenia"
                icon={IconCalendarEvent}
            />
        </SidebarSection> -->

        <SidebarSection>
            <SidebarTab
                path="/account/logout"
                title="Wyloguj się"
                icon={IconLogout}
                iconColor="light-red"
                textColor="light-red"
            />
        </SidebarSection>
    </svelte:fragment>

    <slot slot="content"></slot>
</Sidebar>
