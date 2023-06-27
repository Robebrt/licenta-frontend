import React from 'react';
import '../style/modal.css'

const Modal = ({ onCloseModal, message }) => {
    const handleClose = () => {
        onCloseModal();
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p className="modal-text">{message}</p>
                <div className="modal-buttons">
                    <button className="modal-button cancel-button" onClick={handleClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;