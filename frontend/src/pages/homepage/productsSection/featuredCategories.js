"use client"
import { BsArrowRight } from "react-icons/bs"
import bedroomCategoryBgImg from "../../../assets/bedRoomCategory.jpg"
import kidsCategoryBgImg from "../../../assets/kidsCategory.jpg"
import firstOrderCategoryBgImg from "../../../assets/firstOrderCategory.jpg"
import livingRoomCategoryBgImg from "../../../assets/livingRoomCategory.jpg"
import { useNavigate } from "react-router-dom"

export const FeaturedCategories = () => {
  const navigateShop = useNavigate()

  const categoriesFaceArr = [
    { title: "Outdoor", src: kidsCategoryBgImg },
    { title: "Indoor", src: firstOrderCategoryBgImg },
    { title: "Decor", src: bedroomCategoryBgImg },
    { title: "Home", src: livingRoomCategoryBgImg },
  ]
  return (
    <section className="my-16 xs:my-20 md:my-24">
      <h2 className="text-[28px] xs:text-[36px] md:text-[44px] lg:text-[48px] text-center mb-8 xs:mb-10 md:mb-12 font-bold mx-4">
        Featured Categories
      </h2>
      <div className="grid grid-cols-2 gap-3 xs:gap-4 md:gap-6 px-3 xs:px-4 md:flex md:flex-row md:w-[92%] lg:w-[96%] xl:w-[92%] md:mx-auto md:justify-between md:flex-wrap">
        {categoriesFaceArr.map((category, index) => {
          return (
            <article key={index} className="w-[100%] md:mx-0 md:w-[100%] cursor-pointer md:basis-[48%]">
              <div
                style={{ backgroundImage: `url(${category.src})` }}
                className="w-[100%] bg-neutralColor bg-cover bg-no-repeat bg-center relative category-img-container h-[200px] xs:h-[280px] tablet:h-[350px] md:h-[400px] lg:h-[450px]"
              >
                <div className="product-img-overlay hidden absolute top-0 left-0 z-50 bg-[#0000005d] w-[100%] h-[100%]"></div>
                <button
                  onClick={() => navigateShop("/shop")}
                  className="absolute left-[10%] xs:left-[25%] top-[35%] xs:top-[40%] bg-primaryColor text-white hidden cursor-pointer rounded-sm h-[40px] xs:h-[48px] md:h-[52px] w-[80%] xs:w-[50%] gap-2 xs:gap-3 justify-center z-[100] items-center category-shop-link text-sm xs:text-base md:text-lg"
                >
                  <span> Shop Now</span>
                  <BsArrowRight />
                </button>
              </div>
              <h2 className="text-[18px] xs:text-[24px] md:text-[28px] lg:text-[32px] mt-3 xs:mt-4 font-bold capitalize">
                {category.title}
              </h2>
            </article>
          )
        })}
      </div>
      <div className="flex flex-col w-[100%] mt-16 xs:mt-20 md:mt-24 gap-10 xs:gap-12 md:gap-16">
        <article className="bg-[#e5e5e5] text-secondaryColor h-[130px] xs:h-[160px] md:h-[180px] lg:h-[200px] flex justify-center items-center px-[4%]">
          <h1 className="font-bold text-[18px] xs:text-[24px] md:text-[28px] lg:text-[32px] tablet:w-[55%] md:w-[55%] lg:w-[40%] text-center">
            Refresh your space with our latest arrivals and offers.
          </h1>
        </article>
        <article className="bg-[#e5e5e5] text-secondaryColor h-[130px] xs:h-[160px] md:h-[180px] lg:h-[200px] flex justify-center items-center px-[4%]">
          <h1 className="font-bold tablet:w-[55%] md:w-[55%] text-[18px] xs:text-[24px] md:text-[28px] lg:text-[32px] lg:w-[40%] text-center">
            Explore exclusive deals on sets categories.
          </h1>
        </article>
      </div>
    </section>
  )
}
