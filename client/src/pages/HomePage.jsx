import React from "react";
import CategoryItem from "../components/CategoryItem";


const categories = [
  { href: "/Health", name: "Health Insurance", imageUrl: "/health.png" },
  { href: "/Accident", name: "Accidental Insurance", imageUrl: "/accident.png" },
  { href: "/Life", name: "Life Insurance", imageUrl: "/life.png" },
  { href: "/Cancer", name: "Cancer Insurance", imageUrl: "/cancer.png" },
  { href: "/Vehicle", name: "Vehical Insurance", imageUrl: "/vehical.png" },
  { href: "/Mahila", name: "Mahila Insurance", imageUrl: "/mahila.png" }, 
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-5xl font-bold text-emerald-400 mb-4">
          BlockSure Got You Covered
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          WE CARE FOR YOU  
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
