'use client';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import EbullicionPage from '@/app/pages';
import Liquids from '@/app/pages/liquids';
import DialogComponent from '@/app/pages/dialog';
import { useState } from 'react';
import { Component } from '@/app/interface/IComponent';
import { Card } from 'primereact/card';
import { imageBodyTemplate } from '@/app/pages/liquids';
import { Button } from 'primereact/button';
import Calculation from '@/app/pages/calculation';


export default function Home() {

    const [visible, setVisible] = useState<boolean>(false);
    const [liquidSelected, setLiquidSelected] = useState<Component>({} as Component);
    const [showCalculation, setShowCalculation] = useState<boolean>(false);

    const footer = (
        <>
            <Button label="Calcular" icon="pi pi-calculator" onClick={() => setShowCalculation(true)} />
        </>
    );

    const convertToView = () => {
        return (
            <Card
                title={liquidSelected.name}
                subTitle={liquidSelected.uso}
                footer={footer}
                header={() => imageBodyTemplate(liquidSelected)}
                className="md:w-25rem"
            >
                <p className="m-0">
                    La temperatura de este liquida esta entre {liquidSelected.tMin} y {liquidSelected.tMax}
                </p>
            </Card>
        );
    }

  return (
      <main>
          <EbullicionPage />
          {
              showCalculation ? (
                  <>
                      <Calculation
                          components={liquidSelected}
                          setShowCalculation={setShowCalculation}
                          setVisible={setVisible}
                      />
                  </>
              ) : (
                  <>
                      <Liquids
                          methodHandler={setLiquidSelected}
                          dialogShowHandler={setVisible}
                      />
                      <DialogComponent
                          visible={visible}
                          hideHandler={setVisible}
                      >
                          {convertToView()}
                      </DialogComponent>
                  </>
              )
          }
      </main>
  )
};