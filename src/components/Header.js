import React from "react";

const Header = () => {
  return (
    <header className=" pt-2 max-h-[136px]">
      <div className="flex flex-row items-center justify-end gap-4 text-xs px-14">
        <span>Help</span>
        <span>Orders & Returns</span>
        <span>Hi, John</span>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 px-14 py-3">
        <span className="text-3xl font-bold">ECOMMERCE</span>
        <div className="flex flex-row items-center text-sm justify-between font-semibold max-w-lg w-full">
          <span>Categories</span>
          <span>Sale</span>
          <span>Clearance</span>
          <span>New Stock</span>
          <span>Trending</span>
        </div>
        <div className="flex flex-row items-center justify-end gap-8 ">
          <img src="/search.svg" alt="" className="h-4 w-4 " />

          <img src="/shopping.svg" alt="" className="h-4 w-4 " />
        </div>
      </div>
      <div className="text-center bg-slate-200 text-gray-800 text-sm py-1">
        &lt; Get 10 % off on business sign up &gt;
      </div>
    </header>
  );
};

export default Header;
