import { Component } from '@/app/interface/IComponent';
import { JSX, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import styles from './liquids.module.css';

export interface LiquidsProps {
    methodHandler: (component: Component) => void;
    dialogShowHandler: (value: boolean) => void;
}

export const imageBodyTemplate = (liquid: Component) => {
    return <Image width="200" height="200" src={liquid.image} alt={liquid.image} />
};

const Liquids = ({ methodHandler, dialogShowHandler }: LiquidsProps) => {

    const [liquids, setLiquids] = useState<Component[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        try {
            const res = await fetch('/api/liquidos');
            const data = await res.json();
            setLiquids(data);
        } catch (err) {
            setLiquids([]);
        } finally {
            setIsLoading(false);
        }
    };

    const primeReactButton = (liquid: Component) => {
        return <Button label="Calcular ebullcion" onClick={(): void => clickHandler(liquid)} />;
    };


    const clickHandler = (liquid: Component) => {
        methodHandler(liquid);
        dialogShowHandler(true);
    }

    useEffect(() => {
        setIsLoading(true);

        setTimeout(() => {
            getData()
                .then((): void => setIsLoading(false));
        }, 1000);
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <section className={styles.spinner}>
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </section>
                ) : (
                    <section className={styles.sections}>
                        <DataTable value={liquids} header={'Liquidos'}>
                            <Column field="name" header="Nombre"></Column>
                            <Column body={imageBodyTemplate} header="Imagen"></Column>
                            <Column field="A" header="Constante A"></Column>
                            <Column field="B" header="Constante B"></Column>
                            <Column field="C" header="Constante C"></Column>
                            <Column field="tMin" header="Temperatura minima"></Column>
                            <Column field="tMax" header="Temperatura maxima"></Column>
                            <Column field="uso" header="Uso del liquido"></Column>
                            <Column header="Acciones" body={(liquid: Component): JSX.Element => primeReactButton(liquid) }></Column>
                        </DataTable>
                    </section>
                )
            }
        </>
    );
};

export default Liquids;