import { FaLongArrowAltRight } from "react-icons/fa"
import { SingleProductBox } from "../../../components/singleProductBox"
import { Link } from "react-router-dom"

export const HomepageCategoryProducts = ({ subcategoryProducts }) => {
  return (
    <div className="w-[92%] lg:w-[96%] tablet:w-[88%] mx-auto">
      {/* evenly spaced subcategories */}
      <div className="flex flex-wrap justify-evenly gap-6 pb-4">
        {subcategoryProducts.map((item, index) => (
          <div key={index} className="w-[280px] flex-shrink-0">
            <h3 className="text-lg font-semibold capitalize mb-3 text-center">
              {item.subcategory}
            </h3>
            <SingleProductBox productsData={item.product} />
          </div>
        ))}
      </div>

      {/* "Shop for more" link */}
      <div className="flex justify-center items-center mt-8">
        <Link
          to="/shop"
          className="flex items-center gap-3 text-lg lg:text-2xl text-primaryColor font-semibold hover:underline transition underline-offset-[6px] decoration-2"
        >
          <span>Shop for more</span>
          <FaLongArrowAltRight className="w-6 lg:w-10 h-6 lg:h-10 fill-primaryColor" />
        </Link>
      </div>
    </div>
  )
}
