import { Header} from '~/components/custom/landing/Header'; 
import HeroSection from '~/components/custom/landing/HeroSection';
import BenefitsSection from '~/components/custom/landing/BenefitsSection';
import { useEffect, useState } from 'react';
import { ButtonCeleste, ButtonYellow } from '~/components/custom/landing/Buttons';
import HeroInfo from '~/components/custom/landing/HeroInfo';
import PricingSection from '~/components/custom/landing/PricingSection';
import Footer from '~/components/custom/landing/Footer';
import GameRules from '~/components/custom/landing/GameRules';
import Team from '~/components/custom/landing/TeamSection';

function Index() {
    const [benefitsSection, setBenefitsSection] = useState<JSX.Element | null>(null);

    useEffect(() => {
        BenefitsSection().then(setBenefitsSection);
    }, []);

    return (
        <>
        
        <div className='h-[500px] md:h-[660px]'>
        <Header />
        
        <HeroSection/>
        </div>
        <div className='relative mx-2'>
        {benefitsSection} 
        </div>
       
        <HeroInfo/>
        <PricingSection/>
        <GameRules/>
        <Team/>
        <Footer/>
        </>
    );
    
}
export default Index;