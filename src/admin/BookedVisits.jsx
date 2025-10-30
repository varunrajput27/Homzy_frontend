import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const BookedVisits = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getId = (id) => (id && id.$oid ? id.$oid : id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/alluserwithbooking`
        );
        const usersData = userRes.data.users || [];

        const propertyRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/rentandsale`
        );
        const propertiesData = propertyRes.data.properties || [];

        const usersWithBookings = usersData.map((user) => {
          const bookedProps = [];
          if (Array.isArray(user.booking_history)) {
            user.booking_history.forEach((booking) => {
              const bookingId = getId(booking._id || booking);
              const prop = propertiesData.find((p) => getId(p._id) === bookingId);
              if (prop) bookedProps.push({ ...prop, _id: getId(prop._id), status: "" });
            });
          }

          return {
            ...user,
            _id: getId(user._id || user.userId || user.id),
            bookedProperties: bookedProps,
          };
        });

        setUsers(usersWithBookings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (prop, userIdx, propIdx) => {
    try {
      const id = getId(prop._id);
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      let url = "";
      let statusLabel = "";

      if (prop.listingType?.toLowerCase() === "for rent") {
        url = `${apiBase}/api/rent/approverent/${id}`;
        statusLabel = "Rent Out";
      } else if (prop.listingType?.toLowerCase() === "for sale") {
        url = `${apiBase}/api/sale/approvesale/${id}`;
        statusLabel = "Sold Out";
      } else {
        toast.error("Unknown listing type");
        return;
      }

      await axios.put(url);
      toast.success(`Approved: ${prop.basicDetails?.title}`);

      setUsers((prev) => {
        const updated = [...prev];
        updated[userIdx].bookedProperties[propIdx].status = "approved";
        updated[userIdx].bookedProperties[propIdx].listingType = statusLabel;
        return updated;
      });
    } catch (err) {
      console.error("Error approving:", err.response?.data || err);
      toast.error("Failed to approve. Try again.");
    }
  };

  const handleDecline = async (prop, userIdx, propIdx) => {
    const user = users[userIdx];
    const userId = user._id;
    const propId = prop._id;
    const apiBase = import.meta.env.VITE_API_BASE_URL;

    if (!userId || !propId) return;

    toast((t) => (
      <div>
        Decline booking for <strong>{prop.basicDetails?.title}</strong>?
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await axios.delete(
                  `${apiBase}/api/user/declinebooking/${userId}/${propId}`
                );
                setUsers((prev) => {
                  const updated = [...prev];
                  updated[userIdx].bookedProperties[propIdx].status = "declined";
                  return updated;
                });
                toast.success(response.data.message || "Declined successfully!", { duration: 2000 });
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to decline booking", { duration: 3000 });
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-black px-3 py-1 rounded cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>;

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />

      {users.length === 0 ? (
        <p className="text-gray-600 text-center">No users with bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-100 transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    👤 {user.fullname}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">📧 {user.email}</p>
                  <p className="text-gray-500 text-sm mt-1">📞 {user.phone}</p>
                </div>
              </div>

              {/* Properties Grid */}
              {user.bookedProperties.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  This user has not booked any properties yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {user.bookedProperties.map((prop, pidx) => (
                    <div
                      key={pidx}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col"
                    >
                      <div className="h-36 sm:h-40 md:h-44 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={prop.images?.[0]?.url || "https://via.placeholder.com/400x250"}
                          alt={prop.basicDetails?.title || "Property"}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 truncate">
                          {prop.basicDetails?.title || "Untitled Property"}
                        </h3>
                        <ul className="text-gray-600 text-xs sm:text-sm space-y-0.5 mb-2 flex-1">
                          <li><span className="font-medium">Type:</span> {prop.propertyType || "-"}</li>
                          <li><span className="font-medium">BHK:</span> {prop.basicDetails?.bhkType || "-"}</li>
                          <li><span className="font-medium">City:</span> {prop.location?.city || "-"}</li>
                          <li><span className="font-medium">Owner:</span> {prop.contactInfo?.owner || "-"}</li>
                        </ul>

                        <div
                          className={`text-center font-semibold py-1 rounded-md text-white mb-2 text-sm ${
                            prop.listingType === "For Rent"
                              ? "bg-blue-500"
                              : prop.listingType === "For Sale"
                              ? "bg-purple-500"
                              : prop.listingType === "Sold Out"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {prop.listingType}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-auto">
                          <button
                            className={`px-3 py-1.5 rounded-lg w-full sm:w-[48%] text-white font-semibold text-sm transition ${
                              prop.status === "approved" || prop.status === "declined"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => handleApprove(prop, idx, pidx)}
                            disabled={prop.status === "approved" || prop.status === "declined"}
                          >
                            Approve
                          </button>

                          <button
                            className={`px-3 py-1.5 rounded-lg w-full sm:w-[48%] text-white font-semibold text-sm transition ${
                              prop.status === "approved" || prop.status === "declined"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                            onClick={() => handleDecline(prop, idx, pidx)}
                            disabled={prop.status === "approved" || prop.status === "declined"}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedVisits;
