
import { Command } from "cmdk";
import { useEffect, useState } from "react";
import React from 'react';

interface Props {
    projects: any[];
    posts: any[];
    lang: string;
}

export default function CommandPalette({ projects, posts, lang = "en" }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const t = {
        placeholder: lang === "id" ? "Ketik perintah atau cari..." : "Type a command or search...",
        noResults: lang === "id" ? "Tidak ada hasil." : "No results found.",
        nav: lang === "id" ? "Navigasi" : "Navigation",
        theme: lang === "id" ? "Tema" : "Theme",
        system: lang === "id" ? "Sistem" : "System",
        projects: lang === "id" ? "Proyek" : "Projects",
        blog: lang === "id" ? "Blog" : "Blog",
    };

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            modal={false}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0_0_rgba(0,0,0,1)] z-[100] flex flex-col max-h-[60vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        >
            <div className="border-b-4 border-black p-4 flex items-center gap-3 bg-white">
                <i className="ri-terminal-box-fill text-2xl"></i>
                <Command.Input
                    placeholder={t.placeholder}
                    className="w-full bg-transparent border-none outline-none font-mono text-xl uppercase placeholder:text-gray-400"
                />
                <div className="px-2 py-1 bg-gray-200 border border-black text-xs font-bold font-mono rounded">
                    ESC
                </div>
            </div>

            <Command.List className="overflow-y-auto p-2 flex flex-col gap-1 max-h-[400px]">
                <Command.Empty className="p-4 text-center text-gray-500 font-mono">
                    {t.noResults}
                </Command.Empty>

                <Command.Group heading={t.nav} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 font-mono [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-gray-400">
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-home-4-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>HOME</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/about`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-user-3-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>ABOUT</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/projects`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-briefcase-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>PROJECTS</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/achievements`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-trophy-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>ACHIEVEMENTS</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/dashboard`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-dashboard-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>DASHBOARD</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/contact`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-mail-send-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>CONTACT</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = `/${lang}/estimator`)}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-calculator-fill text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>ESTIMATOR</span>
                    </Command.Item>
                </Command.Group>

                <Command.Group heading={t.projects} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 font-mono [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-gray-400">
                    {projects.map((project) => (
                        <Command.Item
                            key={project.id}
                            onSelect={() => runCommand(() => window.location.href = `/${lang}/projects/${project.id}`)}
                            className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                        >
                            <i className="ri-briefcase-2-line text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                            <span>{project.data.title.toUpperCase()}</span>
                        </Command.Item>
                    ))}
                </Command.Group>

                <Command.Group heading={t.blog} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 font-mono [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-gray-400">
                    {posts.map((post) => (
                        <Command.Item
                            key={post.id}
                            onSelect={() => runCommand(() => window.location.href = `/${lang}/blog/${post.slug}`)}
                            className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                        >
                            <i className="ri-article-line text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                            <span>{post.data.title.toUpperCase()}</span>
                        </Command.Item>
                    ))}
                </Command.Group>

                <Command.Group heading={t.system} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 py-1 font-mono [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-gray-400">
                    <Command.Item
                        onSelect={() => runCommand(() => document.getElementById("theme-toggle")?.click())}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-contrast-drop-line text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>TOGGLE THEME</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = window.location.pathname.replace(`/${lang}`, '/en'))}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-translate text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>SWITCH TO ENGLISH</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => window.location.href = window.location.pathname.replace(`/${lang}`, '/id'))}
                        className="w-full text-left px-4 py-3 font-bold font-mono border-2 border-transparent flex items-center gap-3 group transition-colors aria-selected:bg-neo-black aria-selected:text-white aria-selected:border-black cursor-pointer"
                    >
                        <i className="ri-translate text-lg text-gray-500 group-aria-selected:text-neo-yellow"></i>
                        <span>GANTI KE INDONESIA</span>
                    </Command.Item>
                </Command.Group>
            </Command.List>

            <div className="border-t-4 border-black p-2 bg-neo-black text-white flex justify-between px-4 text-xs font-mono uppercase">
                <span>Navigation & Actions</span>
                <span className="opacity-50">ARHAM.exe SYSTEM</span>
            </div>
        </Command.Dialog>
    );
}
