import { Component } from '@/app/interface/IComponent';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import styles from './calculation.module.css';
import { RequestBody } from '@/app/api/ebullicion/route';
import { ProgressSpinner } from 'primereact/progressspinner';

export interface CalculationProps {
    components: Component;
    setShowCalculation: (value: boolean) => void;
    setVisible: (value: boolean) => void;
}

const Calculation = ({ components, setShowCalculation, setVisible }:CalculationProps) => {

    const { A, B, C } = components;
    const [showProcess, setShowProccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pression, setPression] = useState({ value: '' });
    const [result, setResult] = useState<string | null>(null);

    const sendForm = async () => {
        if (pression.value.trim() === '') return;
        setShowProccess(true);
        setIsLoading(true);

        const request: RequestBody = {
            A,
            B,
            C,
            P2nd: Number(pression.value)
        };

        try {
            const res = await fetch('/api/ebullicion', {
                body: JSON.stringify(request),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            setResult(data.output || data.error || 'Sin respuesta');
        } catch (err) {
            setResult('Error al llamar al backend');
        } finally {
            setIsLoading(false);
        }

    }

    const goBack = () => {
        setResult(null)
        setShowProccess(false);
        setPression({ value: '' });
        setShowCalculation(false);
        setVisible(false);
    }


    return (
        <section className={styles.section}>
            <label htmlFor="pression">Ingresa la presion que deseas averiguar</label>
            <div className={styles.data_container}>
                <InputText
                    keyfilter="int"
                    value={pression.value}
                    onChange={(e) => setPression({ value: e.target.value })}
                />
                <Button
                    label="Calcular"
                    icon="pi pi-calculator"
                    onClick={sendForm}
                />
            </div>

            {
                showProcess && (
                    <>
                        {
                            isLoading ? (
                                <ProgressSpinner
                                    style={{width: '50px', height: '50px'}}
                                    strokeWidth="8"
                                    fill="var(--surface-ground)" animationDuration=".5s"
                                />
                            ) : (
                                <pre style={{ marginTop: 20, background: '#f5f5f5', padding: 10 }}>
                                    {result}
                                </pre>
                            )
                        }
                    </>
                )
            }

            <footer>
                <Button
                    label="Volver atras"
                    icon="pi pi-calculator"
                    onClick={goBack}
                />
            </footer>
        </section>
    )

}

export default Calculation;