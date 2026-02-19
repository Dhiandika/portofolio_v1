import React, { useEffect, useState } from 'react';

import { makePage } from '@keystatic/astro/ui';
import config from '../../keystatic.config';

export const KeystaticAdmin = () => {
    const [mountState, setMountState] = useState<'init' | 'mounted' | 'error'>('init');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        console.log('KeystaticWrapper: Mounting...');
        console.log('KeystaticWrapper: Config check:', config);
        try {
            setMountState('mounted');
        } catch (e: any) {
            console.error('KeystaticWrapper: Mount Error', e);
            setErrorMessage(e.message);
            setMountState('error');
        }
    }, []);

    if (mountState === 'init') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
                <p>Initializing Keystatic Admin...</p>
            </div>
        );
    }

    if (mountState === 'error') {
        return (
            <div style={{ padding: 40, background: 'red', color: 'white', height: '100vh' }}>
                <h1>Keystatic Initialization Failed</h1>
                <p>Error: {errorMessage}</p>
            </div>
        );
    }

    try {
        const Admin = makePage(config);
        return <Admin />;
    } catch (e: any) {
        console.error('KeystaticWrapper: Render Crash', e);
        return (
            <div style={{ padding: 40, background: '#fff', color: 'red', height: '100vh', overflow: 'auto' }}>
                <h1>Keystatic Runtime Trap</h1>
                <pre>{e.message}</pre>
                <pre>{e.stack}</pre>
            </div>
        );
    }
};
