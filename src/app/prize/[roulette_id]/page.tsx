"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Wheel } from "react-custom-roulette";
import Fireworks from "@fireworks-js/react";
import ConfettiExplosion from "react-confetti-explosion";

import { Button } from "@/components/button";
import { api } from "@/services/api";
import { handleError } from "@/utils/handle-error";
import { Loading } from "@/components/loading";

const backgroundColors = [
  "#B5927F",
  "#CEAA9A",
  "#DABCB2",
  "#EBCDC3",
  "#E8DBD5",
];
const textColors = ["#333"];
const outerBorderColor = "#eeeeee";
const outerBorderWidth = 10;
const innerBorderColor = "#30261a";
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = "#eeeeee";
const radiusLineWidth = 8;
const fontFamily = "Nunito";
const fontSize = 20;
const textDistance = 60;
const spinDuration = 1.0;

type Props = {
  params: {
    roulette_id: string;
  };
};

export default function Page(props: Props) {
  const { params } = props;
  const { roulette_id } = params;

  const [loading, setLoading] = useState(true);
  const [commitingPrize, setCommitingPrize] = useState(false);
  const [roulette, setRoulette] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        option: product.name,
      })),
    [products]
  );

  const handleDidMount = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/prize", {
        params: { id: roulette_id },
      });
      setRoulette(data.roulette);
      setProducts(data.products);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [roulette_id]);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = useCallback(async () => {
    try {
      setCommitingPrize(true);

      await api.post(
        "/api/prize",
        {
          product_prizeed_id: data[prizeNumber].id,
        },
        { params: { id: roulette_id } }
      );

      const response = await api.get("/api/prize", {
        params: { id: roulette_id },
      });
      setRoulette(response.data.roulette);
    } catch (error) {
      handleError(error);
    } finally {
      setCommitingPrize(false);
    }
  }, [data, prizeNumber, roulette_id]);

  useEffect(() => {
    handleDidMount();
  }, [handleDidMount]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {commitingPrize && <Loading />}

      <div className="h-full w-full flex flex-col justify-center items-center gap-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            {roulette.product_prizeed_id
              ? `Parabéns ${roulette.costumer_name}!!!`
              : `Bem vindo ${roulette.costumer_name}!!!`}
          </h1>
          <span className="text-base">
            {roulette.product_prizeed_id
              ? `Seu brinde foi ${roulette.product?.name}`
              : "Gira a roleta para ver qual será o seu brinde"}
          </span>
        </div>

        {!!roulette.product && (
          <ConfettiExplosion
            style={{ zIndex: 10 }}
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
          />
        )}

        {data.length && (
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStopSpinning}
            backgroundColors={backgroundColors}
            textColors={textColors}
            fontFamily={fontFamily}
            fontSize={fontSize}
            outerBorderColor={outerBorderColor}
            outerBorderWidth={outerBorderWidth}
            innerRadius={innerRadius}
            innerBorderColor={innerBorderColor}
            innerBorderWidth={innerBorderWidth}
            radiusLineColor={radiusLineColor}
            radiusLineWidth={radiusLineWidth}
            spinDuration={spinDuration}
            textDistance={textDistance}
            pointerProps={{
              src: "/roulette-pointer-off.png",
            }}
          />
        )}

        <Button disabled={!!roulette.product} onClick={handleSpinClick}>
          Girar
        </Button>
      </div>

      {!!roulette.product && (
        <Fireworks
          options={{
            rocketsPoint: {
              min: 0,
              max: 100,
            },
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 10,
          }}
        />
      )}
    </>
  );
}
