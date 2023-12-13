import { Children } from 'react';
import './Modal.css'


export default function Modal({ handleClose, show, children}: ModalProps)  {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    

    return (
        <div className={showHideClassName}>
            <section className='model-main'>
                {children}
                <button type="button" onClick={handleClose}>
                    Close
                </button>
            </section>
        </div>
    );
}
