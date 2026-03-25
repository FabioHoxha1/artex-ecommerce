import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useEffect, useState } from "react";
import { countDownOnTheLastDayOfTheMonth, countDownToTheEndOfTheMonth } from "../../../utils/countDownFns";
import dealOfTheMonthImg from "../../../assets/livingRoomCategory.jpg";
import { FaQuestion } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const DealOfTheMonth = () => {
  const [isOfferOn, setIsOfferOn] = useState(false);
  const [offerProduct, setOfferProduct] = useState({
    title: "borsalino chair",
    discountPercentValue: 97,
    imgUrl: dealOfTheMonthImg,
  });

  const { title, discountPercentValue, imgUrl } = offerProduct;
  const navigate = useNavigate();

  const [periodToLastDayOfTheMonth, setPeriodsToLastDayOfTheMonth] = useState({ days: 0, mins: 0, secs: 0, hours: 0 });

  const startDateInDateFormat = new Date();
  let currentMonth = startDateInDateFormat.getMonth();
  let currentYear = startDateInDateFormat.getFullYear();
  let lastDayOfTheCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

  const [isCurrentDateLastDayOfTheMonth, setIsCurrentDateLastDayOfTheMonth] = useState(
    new Date().getDate() === lastDayOfTheCurrentMonth.getDate()
  );

  useEffect(() => {
    if (!isCurrentDateLastDayOfTheMonth) {
      setIsOfferOn(false);

      let clearCountDownToLastDayOfTheMonth = setInterval(() => {
        countDownToTheEndOfTheMonth(
          clearCountDownToLastDayOfTheMonth,
          lastDayOfTheCurrentMonth,
          setIsCurrentDateLastDayOfTheMonth,
          setPeriodsToLastDayOfTheMonth
        );
      }, 1000);
    } else if (isCurrentDateLastDayOfTheMonth) {
      setIsOfferOn(true);

      let clearLastDayOfMonthCount = setInterval(() => {
        countDownOnTheLastDayOfTheMonth(
          clearLastDayOfMonthCount,
          lastDayOfTheCurrentMonth,
          setIsCurrentDateLastDayOfTheMonth,
          setPeriodsToLastDayOfTheMonth
        );
      }, 1000);
    }
  }, [isCurrentDateLastDayOfTheMonth]);

  return (
    <section className="mb-20">
      <h1 className="font-bold text-[36px] mb-8 text-center ">Featured Product of the Month</h1>
      <div className="w-[100%] md:w-[100%] lg:gap-0  lg:justify-between bg-neutralColor  pb-14 gap-9 lg:order-1 flex flex-col lg:pl-0  lg:flex-row md:py-0 lg:min-h-[480px]  lg:pr-[1%]">
        <div className="w-[100%] lg:max-h-[600px] max-h-[620px] md:h-[600px] h-auto md:min-h-[600px] relative lg:mx-0 mx-auto lg:basis-[55%]">
          {imgUrl.length < 0 ? (
            <div className="w-[100%] border-b-2 border-LightSecondaryColor h-auto flex flex-col items-center gap-4 py-20 md:py-0 md:h-[100%] justify-center lg:border-b-0 lg:border-r-2">
              <FaQuestion className="w-20 h-20 md:w-40 md:h-40" />
              <h2 className="text-lg md:text-xl lg:text-2xl"> Product image</h2>
              <h2 className="text-lg md:text-xl lg:text-2xl"> Coming soon ...</h2>
            </div>
          ) : (
            <>
              <img className="w-[100%]  h-[100%]" alt="monthly-deal" src={dealOfTheMonthImg} />

              {isOfferOn && (
                <div className="flex justify-center items-center absolute w-16 tablet:w-24 tablet:h-24 md:w-28 md:h-28  h-16 z-[100] top-4 left-4 rounded-[50%] hover:opacity-100 bg-lightPrimaryColor text-white  shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]  ">
                  <span className="text-sm tablet:text-base font-bold md:text-base">{discountPercentValue}% OFF</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="lg:basis-[45%] tablet:pl-[6%] pl-[4%] md:pl-[4%] md:order-2 flex-col flex gap-5 md:pb-8 lg:mt-8">
          <h2 className="text-3xl tablet:text-4xl  md:text-4xl font-bold mr-[35%] leading-[120%] tablet:leading-[130%] md:leading-[140%] lg:leading-[120%] md:mr-[60%] lg:mr-[25%] max-w-[400px]">
            Get &nbsp;
            <span className="text-primaryColor font-bold">
              {isOfferOn ? `${discountPercentValue}% discount` : "a huge discount"}
            </span>
            &nbsp; from this Furniture set
          </h2>
          <h3 className="text-primaryColor mt-2 font-RobotoSlab  font-medium  text-xl tablet:text-2xl md:text-2xl xl:text-3xl">
            {" "}
            {isOfferOn ? "Offer ends by :" : "Offer begins by :"}{" "}
          </h3>
          <div className="flex gap-[0.9rem] lg:[0.8rem] w-[96%] lg:gap-[0.9rem] lg:w-[100%] tablet:w-[88%]  md:w[92%] tablet:py-4 max-w-[372px]  md:max-w-[392px] lg:max-w-[400px] items-start bg-primaryColor text-white font-bold font-RobotoCondensed py-2 justify-center mr-auto">
            <div className="flex flex-col gap-[2px] items-center">
              <span className="text-2xl tablet:text-3xl lg:text-3xl ">{periodToLastDayOfTheMonth.days}</span>
              <span className="text-xs tablet:text-sm  lg:text-sm  tracking-wider">DAYS</span>
            </div>
            <span className="text-2xl tablet:text-3xl lg:text-3xl">:</span>
            <div className="flex flex-col gap-[2px] items-center">
              <span className="text-2xl tablet:text-3xl lg:text-3xl ">{periodToLastDayOfTheMonth.hours}</span>
              <span className="text-xs tablet:text-sm  lg:text-sm tracking-wider">HOURS</span>
            </div>
            <span className="text-2xl tablet:text-3xl lg:text-3xl">:</span>
            <div className="flex flex-col gap-[2px] items-center">
              <span className="text-2xl tablet:text-3xl lg:text-3xl  ">{periodToLastDayOfTheMonth.mins}</span>
              <span className="text-xs tablet:text-sm  lg:text-sm tracking-wider">MINUTES</span>
            </div>
            <span className="text-2xl tablet:text-3xl lg:text-3xl">:</span>
            <div className="flex flex-col gap-[2px] items-center">
              <span className="text-2xl tablet:text-3xl lg:text-3xl  ">{periodToLastDayOfTheMonth.secs}</span>
              <span className="text-xs tablet:text-sm  lg:text-sm tracking-wider">SECONDS</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            <div className=" flex gap-2 items-center">
              <h3 className="font-bold text-[20px] md:text-[24px] lg:text-[20px] xl:text-2xl font-RobotoSlab  tracking-[0.5px]">
                Title :
              </h3>
              <h3 className="font-bold capitalize font-RobotoSlab text-xl tablet:text-2xl lg:text-2xl">
                {isOfferOn ? title : <span className="font-bold text-[16px]">???</span>}
              </h3>
            </div>
            <div className="flex gap-2 items-center">
              <h3 className="font-bold text-[20px] md:text-[24px] lg:text-[20px] xl:text-2xl tracking-[0.5px] font-RobotoSlab ">
                Pricing :
              </h3>
            </div>
          </div>

          {isOfferOn && (
            <button 
              className=" text-primaryColor min-w-[150px] max-w-[180px] bg-transparent border-[1px] border-primaryColor cursor-pointer rounded-sm h-[52px] tablet:[52px] tablet:w-[180px] w-[25%] gap-2 justify-center  flex items-center font-bold font-RobotoCondensed hover:text-white hover:border-transparent hover:bg-primaryColor hover:duration-500 hover:transition"
              onClick={() => navigate("/shop")}
            >
              <span>Request Quote</span>
              <BsArrowRight />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};