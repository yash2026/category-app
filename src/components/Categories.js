// components/Categories.js
import { faker } from "@faker-js/faker";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const { currentUser, logout } = useAuth();
  const itemsPerPage = 6;
  const maxPagesToShow = 7;

  useEffect(() => {
    const generatedCategories = Array.from({ length: 100 }, (_, index) => ({
      id: index.toString(),
      name: faker.commerce.department(),
    }));
    setCategories(generatedCategories);

    const fetchSelectedCategories = async () => {
      if (currentUser?.uid) {
        const categoryRef = ref(
          db,
          `users/${currentUser.uid}/selectedCategories`
        );
        const snapshot = await get(categoryRef);
        if (snapshot.exists()) {
          setSelectedCategories(snapshot.val() || []);
        }
      }
    };
    fetchSelectedCategories();
  }, [currentUser?.uid]);

  const handleSelect = async (category) => {
    let updatedCategories;

    if (selectedCategories.includes(category.id)) {
      // If already selected, deselect it
      updatedCategories = selectedCategories.filter((id) => id !== category.id);
    } else {
      // If not selected, add it
      updatedCategories = [...selectedCategories, category.id];
    }

    setSelectedCategories(updatedCategories);

    if (currentUser?.uid) {
      const categoryRef = ref(
        db,
        `users/${currentUser.uid}/selectedCategories`
      );
      await set(categoryRef, updatedCategories); // Save to Realtime Database
    }
  };

  const displayedCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Helper function to render pagination with a max of 7 pages and dynamic start position
  const renderPagination = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max pages to show, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages based on the current page
      if (page <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (page + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = page - Math.floor(maxPagesToShow / 2);
        endPage = page + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-2 ${
            i === page ? "font-bold text-black" : "text-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button onClick={() => setPage(1)} className="px-2 text-gray-600">
              1
            </button>
            <span className="px-2 text-gray-500">...</span>
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <button
              onClick={() => setPage(totalPages)}
              className="px-2 text-gray-600"
            >
              {totalPages}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex items-center justify-center flex-col border-2 rounded-2xl max-h-[658px] h-[658px] my-4 max-w-xl w-full">
      <div className="flex flex-col items-center ">
        <h2 className="text-3xl font-semibold mb-4">
          Please mark your interests!
        </h2>
        <p className="text-center text-gray-700 mb-1">
          We will keep you notified.
        </p>
      </div>
      <div className="h-px bg-gray-200 max-w-[456px] w-full mb-8" />
      <h3 className="text-lg font-semibold mb-4 self-start px-20">
        My saved interests!
      </h3>
      <ul className="space-y-4 mb-6 px-20 self-start">
        {displayedCategories.map((category) => (
          <li
            key={category.id}
            onClick={() => handleSelect(category)}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              className="w-5 h-5 text-black border-gray-300 rounded"
              checked={selectedCategories.includes(category.id)} // Add logic to check if category is selected
              readOnly
            />
            <span className="text-gray-800">{category.name}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`${
            page === 1 ? "text-gray-400" : "text-blue-500"
          } text-sm px-2`}
        >
          &lt;&lt; &lt;
        </button>
        {renderPagination()}
        <button
          disabled={page * itemsPerPage >= categories.length}
          onClick={() => setPage(page + 1)}
          className={`${
            page * itemsPerPage >= categories.length
              ? "text-gray-400"
              : "text-blue-500"
          } text-sm px-2`}
        >
          &gt; &gt;&gt;
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={logout} className="text-gray-600 text-sm underline">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Categories;
