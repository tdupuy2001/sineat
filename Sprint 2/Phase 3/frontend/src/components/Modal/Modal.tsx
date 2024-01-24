import { Children } from 'react';
import './Modal.css'


export default function Modal({ handleClose, show, children, canGoBack, handleBack}: ModalProps)  {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    

    return (
        <div className={showHideClassName}>
            <section className='model-main'>
                {children}
                <button className='btn-close' type="button" onClick={handleClose}>
                    Close
                </button>
                {canGoBack && (
                    <button className='button-retour-hist' onClick={handleBack}> Retour </button>
                )}
            </section>
        </div>
    );
}
