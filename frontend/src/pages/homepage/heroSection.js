"use client"
import heroImg from "../../assets/heroBg.jpg"
import { useNavigate } from "react-router-dom"

export const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <>
      <div
        style={{ backgroundImage: `url(${heroImg})` }}
        className="w-full bg-neutralColor h-screen bg-cover bg-no-repeat bg-center top-0 relative flex justify-center items-center"
      >
        <div className="overlay absolute top-0 left-0 right-0 w-full h-full bg-opacity-50 bg-[#000000]"></div>
        <div className="justify-center items-center w-[95%] xs:w-[90%] mx-auto flex max-w-[500px] relative tablet flex-col gap-3 xs:gap-4 tablet:gap-5 h-full text-white md:gap-6 px-2">
          <h2 className="text-[26px] xs:text-[32px] tablet:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold text-center leading-tight">
            Design Your Spaces, <br /> Your Way
          </h2>
          <p className="text-center text-sm xs:text-base md:text-lg lg:text-xl px-2">
            Upgrade your home and offices with our curated selection of furniture and decor
          </p>
          <button
            className="lg:w-[12rem] lg:h-[72px] xl:w-[13rem] w-[9rem] xs:w-[10rem] h-[48px] xs:h-[52px] md:h-[60px] md:w-[11rem] font-medium lg:font-bold border-[2px] lg:border-[3px] hover:text-white hover:bg-primaryColor hover:border-transparent hover:font-normal transition-colors duration-500 ease-in-out border-lighterPrimaryColor text-lighterPrimaryColor px-2 text-sm xs:text-base md:text-lg"
            onClick={() => navigate("/shop")}
          >
            Shop now
          </button>
        </div>
      </div>
    </>
  )
}
