import HeroSection from '~/components/custom/landing/HeroSection';
import BenefitsSection from '~/components/custom/landing/BenefitsSection';
import { useEffect, useState } from 'react';
import HeroInfo from '~/components/custom/landing/HeroInfo';
import PricingSection from '~/components/custom/landing/PricingSection';
import Footer from '~/components/custom/landing/Footer';
import Team from '~/components/custom/landing/TeamSection';
import { Header } from '~/components/custom/landing/Header';

function Index() {
    const [benefitsSection, setBenefitsSection] = useState<JSX.Element | null>(null);

    useEffect(() => {
        BenefitsSection().then(setBenefitsSection);
    }, []);

    return (
        <div style={{
            backgroundImage: "url(/assets/landing/img/gradiente.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
        }}>
            <Header />
        <div className='h-[500px] md:h-[660px]'>        
        <HeroSection/>
        </div>
        <div className='relative mx-2'>
        {benefitsSection} 
        </div>
        <HeroInfo/>
        <PricingSection/>
        <Team/>
        <Footer/>
        </div>
    );
    
}
export default Index;