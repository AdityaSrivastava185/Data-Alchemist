import { Sparkles } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div>
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <Sparkles className="h-8 w-8 text-background" />
            </div>
            <div>
              <h1 className="text-3xl font-bold ">Data Alchemist</h1>
              <p className="">
                Transform your spreadsheet chaos into organized, validated data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
