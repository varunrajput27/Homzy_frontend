import React, { useEffect, useState } from "react";
import axios from "axios";

const Soldout = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoldOut = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sale/all`);
        const soldOut = Array.isArray(res.data.properties)
          ? res.data.properties.filter(
              p => p.statusFilter === "SoldOut" || p.listingType === "Sold Out"
            )
          : [];
        setProperties(soldOut);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Sold Out properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchSoldOut();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
        Sold Out Properties ({properties.length})
      </h2>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {properties.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <div>
              <span className="font-semibold text-gray-600">Title: </span>
              <span className="text-gray-800">{p.basicDetails?.title}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Owner: </span>
              <span className="text-gray-800">{p.contactInfo?.owner}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Price: </span>
              <span className="text-gray-800">
                {p.basicDetails?.price || p.basicDetails?.monthlyRent || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Location: </span>
              <span className="text-gray-800">{p.location?.fullAddress}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet / Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Owner</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Location</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4 text-gray-700 font-medium">{p.basicDetails?.title}</td>
                <td className="py-2 px-4 text-gray-700">{p.contactInfo?.owner}</td>
                <td className="py-2 px-4 text-gray-700">
                  {p.basicDetails?.price || p.basicDetails?.monthlyRent || "N/A"}
                </td>
                <td className="py-2 px-4 text-gray-700">{p.location?.fullAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Soldout;
