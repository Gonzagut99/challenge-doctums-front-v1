import { redirect, type LinksFunction, type MetaFunction } from '@remix-run/node';
import { ClientOnly } from 'remix-utils/client-only';
import App from '../app.client';
import { SoundProvider } from '~/components/custom/music/SoundContext';

export const links: LinksFunction = () => {
    return [
        {
            rel: 'stylesheet',
            href: 'styles/globals.css',
        }
    ]
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Phaser Remix Template' },
        { name: 'description', content: 'A Phaser 3 Remix project template that demonstrates Remix with React communication and uses Vite for bundling.' },
    ];
};

export const loader = async () => {
    return redirect('/landing-page');
  };

export default function Index() {
    // console.log(JSON.stringify(loadAllData()));
    return (
        <ClientOnly fallback={<h3>Loading Game...</h3>}>
            
            { () => (
                <App /> 
            )}
        </ClientOnly>
    );
}
