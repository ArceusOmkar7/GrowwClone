"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonLabel,
  IonItem,
  IonInput,
  IonRange,
  IonNote,
  IonIcon,
  IonMenu,
  IonMenuButton,
  IonList,
} from "@ionic/react";
import { searchOutline, menuOutline } from "ionicons/icons";
import { Chart, registerables } from "chart.js";
import "./Home.css";
import { calculateSIP } from "../components/Calaculator";

Chart.register(...registerables);

const Home: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    calculateSIP(
      expectedReturnRate,
      timePeriod,
      monthlyInvestment,
      setInvestedAmount,
      setEstimatedReturns,
      setTotalValue
    );
  }, [monthlyInvestment, expectedReturnRate, timePeriod]);

  // const resetCalculator = () => {
  //   setShowResults(false);
  //   calculateSIP(
  //     expectedReturnRate,
  //     timePeriod,
  //     monthlyInvestment,
  //     setInvestedAmount,
  //     setEstimatedReturns,
  //     setTotalValue
  //   );
  // };

  const toggleResults = () => {
    setShowResults(!showResults);
    if (!showResults) {
      setTimeout(createDoughnutChart, 100);
    }
  };

  const createDoughnutChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Invested amount", "Est. returns"],
          datasets: [
            {
              data: [investedAmount, estimatedReturns],
              backgroundColor: ["#00b386", "#bec0cc"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: "70%",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  };

  const formatCurrency = (value: number): string => {
    return value
      .toLocaleString("en-IN", {
        maximumFractionDigits: 0,
        style: "currency",
        currency: "INR",
      })
      .replace("₹", "");
  };

  return (
    <>
      <IonMenu contentId="main-content" className="menu ion-padding" side="end">
        <IonHeader>
          <IonToolbar>
            <div>Logo</div>
            <div>
              Simple & Free Investing
              <IonButton>Login/Register</IonButton>
            </div>
          </IonToolbar>
          <IonContent>
            <IonList>
              <IonItem>Filter Stocks</IonItem>
              <IonItem>Filter Mutual Funds</IonItem>
              <IonItem>Filter US Stocks</IonItem>
              <IonItem>Smart Save</IonItem>
              <IonItem>Compare Funds</IonItem>
              <IonItem>Credit</IonItem>
              <IonItem>View in App</IonItem>
              <IonItem>Help and Support</IonItem>
            </IonList>
          </IonContent>
        </IonHeader>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear">
              <span className="logo-text">
                <img src="https://resources.groww.in/web-assets/img/website-logo/groww-logo-light.svg" />
              </span>
            </IonButton>
            <IonButton slot="end" fill="clear">
              <IonIcon slot="icon-only" icon={searchOutline} />
            </IonButton>
            <IonMenuButton slot="end" color="danger">
              <IonIcon slot="icon-only" icon={menuOutline} />
            </IonMenuButton>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="calculator-container">
            <h1>SIP Calculator</h1>

            <div className="toggle-container">
              <div>
                <IonButton shape="round" color={"success"}>
                  <IonLabel>SIP</IonLabel>
                </IonButton>
                <IonButton shape="round" fill="outline" color={"success"}>
                  <IonLabel>Lumpsum</IonLabel>
                </IonButton>
              </div>
            </div>

            <div className="input-section">
              <IonItem lines="none" className="input-item">
                <IonLabel>Monthly investment</IonLabel>
                <IonInput
                  type="number"
                  value={monthlyInvestment}
                  onIonChange={(e) =>
                    setMonthlyInvestment(Number.parseInt(e.detail.value!, 10))
                  }
                  placeholder="Enter amount"
                  className="amount-input"
                ></IonInput>
                <span className="currency-symbol">₹</span>
              </IonItem>

              <div className="slider-container">
                <IonRange
                  min={500}
                  max={100000}
                  step={500}
                  value={monthlyInvestment}
                  onIonChange={(e) =>
                    setMonthlyInvestment(e.detail.value as number)
                  }
                  className="custom-range"
                ></IonRange>
              </div>

              <IonItem lines="none" className="input-item">
                <IonLabel>Expected return rate (p.a)</IonLabel>
                <IonInput
                  type="number"
                  value={expectedReturnRate}
                  onIonChange={(e) =>
                    setExpectedReturnRate(Number.parseFloat(e.detail.value!))
                  }
                  placeholder="Enter rate"
                  className="rate-input"
                ></IonInput>
                <span className="percentage-symbol">%</span>
              </IonItem>

              <div className="slider-container">
                <IonRange
                  min={1}
                  max={30}
                  step={0.5}
                  value={expectedReturnRate}
                  onIonChange={(e) =>
                    setExpectedReturnRate(e.detail.value as number)
                  }
                  className="custom-range"
                ></IonRange>
              </div>

              <IonItem lines="none" className="input-item">
                <IonLabel>Time period</IonLabel>
                <IonInput
                  type="number"
                  value={timePeriod}
                  onIonChange={(e) =>
                    setTimePeriod(Number.parseInt(e.detail.value!, 10))
                  }
                  placeholder="Years"
                  className="time-input"
                ></IonInput>
                <span className="year-symbol">Yr</span>
              </IonItem>

              <div className="slider-container">
                <IonRange
                  min={1}
                  max={30}
                  step={1}
                  value={timePeriod}
                  onIonChange={(e) => setTimePeriod(e.detail.value as number)}
                  className="custom-range"
                ></IonRange>
              </div>
            </div>

            {!showResults && (
              <div className="invested-amount">
                <IonItem lines="none">
                  <IonLabel>Invested amount</IonLabel>
                  <IonNote slot="end" className="amount-value">
                    ₹{formatCurrency(investedAmount)}
                  </IonNote>
                </IonItem>
              </div>
            )}

            {showResults && (
              <div className="results-container">
                <IonItem lines="none">
                  <IonLabel>Invested amount</IonLabel>
                  <IonNote slot="end" className="amount-value">
                    ₹{formatCurrency(investedAmount)}
                  </IonNote>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Est. returns</IonLabel>
                  <IonNote slot="end" className="amount-value">
                    ₹{formatCurrency(estimatedReturns)}
                  </IonNote>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Total value</IonLabel>
                  <IonNote slot="end" className="amount-value">
                    ₹{formatCurrency(totalValue)}
                  </IonNote>
                </IonItem>

                <div className="chart-container">
                  <canvas ref={chartRef}></canvas>
                  <div className="legend">
                    <div className="legend-item">
                      <span className="legend-color invested"></span>
                      <span className="legend-text">Invested amount</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color returns"></span>
                      <span className="legend-text">Est. returns</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <IonButton
              expand="block"
              className="start-sip-button"
              onClick={toggleResults}
            >
              CALCULATE
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
