import { Component } from '@/app/interface/IComponent';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
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
    const [showProcess, setShowProcess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pression, setPression] = useState({ value: '' });
    const [result, setResult] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const logEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const sendForm = () => {

        if (pression.value.trim() === '') return;
        setShowProcess(true);

        setLogs([]);

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }


        const url = `/api/ebullicion-real-time/stream?A=${A}&B=${B}&C=${C}&P2nd=${Number(pression.value)}`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            const newLog = event.data;
            setLogs((prevLogs) => [...prevLogs, newLog]);

            if (newLog.includes('MATLAB finalizó')) {
                setIsLoading(false);
                eventSource.close();
            }
        };


        eventSource.onerror = (error) => {
            setLogs((prevLogs) => [...prevLogs, '[Error en SSE]']);
            eventSource.close();
        };
    };

    const goBack = () => {
        setResult(null)
        setShowProcess(false);
        setPression({ value: '' });
        setShowCalculation(false);
        setVisible(false);
    }

    return (
        <section className={styles.section}>
            <label htmlFor="pression">Ingresa la presion que deseas averiguar</label>
            <div className={styles.data_container}>
                <InputText
                    keyfilter="num"
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
                    <div className={styles.real_time_box}>
                        {logs.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
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