import { useContext, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import {PencilRuler , AreaChart, Link as LinkLucide, Folders, Percent, Link2, CreditCard, User, Settings, PiggyBank, HelpCircle } from "lucide-react";
import utmizeIcon from '../../../public/utmize-icon.png';
import  {ThemeProvider, useTheme} from '@/Components/ThemeContextProvider';
import ToggleTheme from '@/Components/ToggleTheme';

const navLinks = [
    {
        name: 'Dashboard',
        href: route('dashboard'),
        icon: <AreaChart size={14}/>
    },
    {
        name: 'Campanhas',
        href: route('campanhas.contas'),
        icon: <Folders size={14}/>
    },
    {
        name:'Regras',
        href: route('regras'),
        icon: <PencilRuler size={14}/>
    },
    {
        name: 'Integrações',
        href: route('integracoes'),
        icon: <Link2 size={14}/>
    },
    {
        name: 'Taxas',
        href: route('taxas'),
        icon: <Percent size={14}/>
    },
    {
        name: 'Assinatura',
        href: route('assinatura'),
        icon: <CreditCard size={14}/>
    },
    {
        name:'Minha Conta',
        href: route('profile.edit'),
        icon: <User size={14}/>
    },
    {
        name:'Avançado',
        href: route('avancado'),
        icon: <Settings size={14}/>
    },
    {
        name:'Indique e Ganhe 10%',
        href:route('indique-e-ganhe'),
        icon: <PiggyBank size={14}/>
    },
    {
        name:'Ajuda',
        href: route('ajuda'),
        icon: <HelpCircle size={14}/>
    }
   

]


export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <ThemeProvider defaultTheme='dark'> 
        <div className="min-h-screen w-screen flex-col md:flex-row bg-background flex">
            <div className='mb-8 md:mb-0'>
            <nav className="bg-card md:h-screen md:w-52  w-screen h-20 border-b border-r border-border fixed md:flex z-10">
                <div className="px-4 sm: h-full w-full t">
                    <div className="flex md:flex-col h-full w-full justify-between">
                        <div className="flex flex-col gap-4 w-full justify-center">
                            <div className="shrink-0 self-start flex justify-center flex-col md:flex-row md:self-center -mb-4">
                                <Link href="/"> 
                                    <img src={utmizeIcon} alt="Utmize" className="size-20"/>
                                </Link>
                            </div>
                            
                            <div className="hidden text-left gap-4 md:flex-col md:-my-px md:flex">
                                {navLinks.map((link, index) => (
                                    <NavLink key={index} className='flex gap-1 text-card-foreground items-center' href={link.href}>
                                        {link.icon}
                                        {link.name}
                                    </NavLink>
                                ))}
                            <ToggleTheme />
                            </div>
                        </div>
 
                        <div className="hidden md:flex w-full md:items-center">
                            <div className="ms-3 relative mb-4">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-muted-foreground bg-card w-full hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center md:hidden">
                            <ToggleTheme></ToggleTheme>
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-gray-500 hover:bg-background focus:outline-none focus:bg-background focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-background'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link, index) => (
                            <ResponsiveNavLink key={index} href={link.href} active={route().current(link.href)}>
                                {link.name}
                            </ResponsiveNavLink>
                        ))
}
                    </div>

                    <div className="pt-4 pb-1 border-t border-border">
                        <div className="px-4">
                            <div className="font-medium text-base text-muted-foreground">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            </div>

            <div className='flex-1 ml-0 md:ml-52 md:w-[calc(100vw-13rem)]'>
                {header && (
                    <header className="bg-background shadow">
                        <div className="max-w-full mx-auto">
                            {header}
                        </div>
                    </header>
                )}

                <main className='px-4 md:px-0'>{children}</main>
            </div>
        </div>
        </ThemeProvider>
    );
}
