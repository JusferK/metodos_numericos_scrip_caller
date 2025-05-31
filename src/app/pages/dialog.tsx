import { ReactNode } from 'react';
import { Dialog } from 'primereact/dialog';

export interface DialogProps {
    children: ReactNode;
    visible: boolean;
    hideHandler: (value: boolean) => void;
}

const DialogComponent = ({ visible, children, hideHandler }: DialogProps) => {

    return (
        <Dialog
            header="Header"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={() => hideHandler(false)}
            modal={true}
            draggable={false}
        >
            {children}
        </Dialog>
    );

};

export default DialogComponent;