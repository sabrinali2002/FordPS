import Modal from 'react-bootstrap/Modal';

export default function ModalPopup({showModal,toggleModal,header,body,footer}){
    return (<Modal show={showModal} onHide={()=>{toggleModal()}}>
    <Modal.Header closeButton>{header}</Modal.Header>
    <Modal.Body>
        {body}
    </Modal.Body>
    {footer?<Modal.Footer>
        {footer}
    </Modal.Footer>:<></>}
</Modal>)
}