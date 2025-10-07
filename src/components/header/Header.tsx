import "./header.css";

import chevron_down from '../../assets/icons/chevron_down.svg';
import tabler_icon from '../../assets/icons/tabler_icon.svg';
import plus from '../../assets/icons/plus.svg';


export default function Header() {
    return (
        <>
            <div className="app-header-container">
                <div className='ae-d-flex'>
                    

                    <div className='ae-d-flex ae-flex-1 ae-justify-space-between'>
                        <div className="ae-d-flex ae-align-center ae-gap-5"><img src={tabler_icon} alt="tabler-icon" /><span>Page Title</span></div>
                        <div><button className="ae-btn ae-btn-outline-dark ae-gap-5"><img src={plus} alt="plus" /><span className="ae-btn-text">New Project</span></button></div>
                    </div>
                </div>
            </div>
        </>
    )
}
