import React from "react";
import { useAppContext } from "../context/AppContext";
import { categories } from "../images";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Truy cập vào các
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {" "}
            Danh Mục
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Khám phá các sản phẩm tươi ngon, chất lượng được tổ chức theo loại để
          thuận tiện cho bạn
        </p>
      </div>

      {/* Categories Grid - max 5 items in one row */}
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center">
          {categories.map((category, index) => {
            return (
              <div
                key={index}
                className="group w-full max-w-[250px] aspect-[3/4] cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 bg-white shadow-md hover:shadow-xl"
                onClick={() => {
                  navigate(`/products/${category.path.toLowerCase()}`);
                  scrollTo(0, 0);
                }}
              >
                {/* Image Container - Clean design without icon */}
                <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-white to-gray-50">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    style={{ transform: `scale(${category.scale || 1})` }}
                  />
                </div>

                {/* Thin Green Line */}
                <div className="h-0.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"></div>

                {/* Text Content - More padding */}
                <div className="p-4 text-center bg-white flex-grow flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    {category.text}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
