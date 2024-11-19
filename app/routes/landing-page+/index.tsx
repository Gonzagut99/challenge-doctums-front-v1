import { Header} from '~/components/custom/landing/Header'; 
import HeroSection from '~/components/custom/landing/HeroSection';
import { ButtonCeleste, ButtonYellow } from '~/components/custom/landing/Buttons';
import BenefitsSection from '~/components/custom/landing/BenefitsSection';
function Index() {
    return (
        <>
        
        <div className='md:h-[660px]'>
        <Header />
        <HeroSection/>
        </div>
        <div className='relative'>
        <BenefitsSection/>
        {/* <ButtonCeleste>Button Celeste</ButtonCeleste>
        <ButtonYellow>Button Yellow</ButtonYellow> */}
        </div>

        
        
        </>
    );
    
}
export default Index;