import { INavbarData } from "./helper";

export const navbarDataHome: INavbarData = 
{
    routeLink: 'home',
    icon: 'fa fa-home',
    label: 'Home'
};

export const navbarDataToDoList: INavbarData = 
{
    routeLink: 'https://to-do.live.com/tasks/inbox',
    icon: 'fa fa-tasks',
    label: 'ToDoList'
};

export const navbarData: INavbarData[] = [
    {
        routeLink: 'movies-desktop',
        icon: 'fa fa-film',
        label: 'Movies'
    },
    {
        routeLink: 'animes-desktop',
        icon: 'fa fa-rocket',
        label: 'Animes'
    },
    {
        routeLink: 'series-desktop',
        icon: 'fa fa-television',
        label: 'Series'
    },
    {
        routeLink: 'notes-desktop',
        icon: 'fa fa-sticky-note',
        label: 'Notes'
    },
    {
        routeLink: 'clockings-desktop',
        icon: 'fa fa-clock-o',
        label: 'Clockings'
    },
    {
        routeLink: 'expirations-desktop',
        icon: 'fa fa-calendar',
        label: 'Expirations'
    },
    {
        routeLink: 'debts-desktop',
        icon: 'fa fa-money',
        label: 'Debts'
    },
    {
        routeLink: 'files',
        icon: 'fa fa-file',
        label: 'Files'
    },
    {
        routeLink: 'passwords-desktop',
        icon: 'fa fa-unlock-alt',
        label: 'Passwords'
    },
    {
        routeLink: 'medications-desktop',
        icon: 'fa fa-plus-square',
        label: 'Medications'
    },
    {
        routeLink: 'documents-desktop',
        icon: 'fa fa-file-text-o',
        label: 'Documents'
    }
];