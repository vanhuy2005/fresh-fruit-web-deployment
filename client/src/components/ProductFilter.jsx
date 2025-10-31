import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const ProductFilter = ({ onApplyFilter, initialValues }) => {
  const categories = ["Trái cây", "Rau củ"];

  const origins = ["Trong nước", "Nước ngoài"];

  const [showOriginDropdown, setShowOriginDropdown] = React.useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [selectedOrigin, setSelectedOrigin] = React.useState(
    initialValues?.origin && origins.includes(initialValues.origin)
      ? origins.indexOf(initialValues.origin)
      : 0
  );
  const [selectedType, setSelectedType] = React.useState(
    initialValues?.category && categories.includes(initialValues.category)
      ? categories.indexOf(initialValues.category)
      : 0
  );
  const [minPrice, setMinPrice] = React.useState(initialValues?.minPrice || "");
  const [maxPrice, setMaxPrice] = React.useState(initialValues?.maxPrice || "");
  const originRef = React.useRef(null);
  const typeRef = React.useRef(null);

  const handleKeyPress = (e) => {
    // Chỉ cho phép nhập số và một số phím đặc biệt
    if (
      !/[\d\b]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginDropdown(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-fit flex flex-wrap items-end gap-3 p-3 rounded-2xl bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30 shadow-sm border border-gray-100/80">
      {/* Nguồn gốc */}
      <div className="flex flex-col gap-1.5 min-w-[200px]" ref={originRef}>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <IoLocationOutline className="w-4 h-4 text-green-600" />
          <span>Nguồn gốc</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOriginDropdown(!showOriginDropdown)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-300 text-left text-sm cursor-pointer flex items-center justify-between"
          >
            <span className="text-gray-700">{origins[selectedOrigin]}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showOriginDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showOriginDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
              {origins.map((origin, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 hover:bg-green-50 cursor-pointer text-gray-700 ${selectedOrigin === index ? "bg-green-50 font-semibold" : ""}`}
                  onClick={() => {
                    setSelectedOrigin(index);
                    setShowOriginDropdown(false);
                  }}
                >
                  {origin}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Danh mục */}
      <div className="flex flex-col gap-1.5 min-w-[200px]" ref={typeRef}>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <BiCategory className="w-4 h-4 text-green-600" />
          <span>Danh mục</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-300 text-left text-sm cursor-pointer flex items-center justify-between"
          >
            <span className="text-gray-700">{categories[selectedType]}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showTypeDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showTypeDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
              {categories.map((type, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 hover:bg-green-50 cursor-pointer text-gray-700 ${selectedType === index ? "bg-green-50 font-semibold" : ""}`}
                  onClick={() => {
                    setSelectedType(index);
                    setShowTypeDropdown(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <RiMoneyDollarCircleLine className="w-4 h-4 text-green-600" />
          <span>Khoảng giá</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-[90px] px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-300 text-gray-600 text-sm"
          />
          <span className="text-gray-400 font-medium">-</span>
          <input
            type="text"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-[90px] px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-300 text-gray-600 text-sm"
          />
        </div>
      </div>

      {/* Nút áp dụng */}
      <button
        onClick={() => {
          const filterData = {
            origin: origins[selectedOrigin],
            category: categories[selectedType],
            minPrice: minPrice ? Number(minPrice) : null,
            maxPrice: maxPrice ? Number(maxPrice) : null,
          };
          console.log("Applying filter:", filterData);
          onApplyFilter(filterData);
        }}
        className="h-[40px] relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-5 rounded-xl font-medium tracking-tight transition-all duration-500 hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] transform group border border-green-400/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className="relative z-10 text-sm">Áp dụng</span>
      </button>
    </div>
  );
};

export default ProductFilter;
