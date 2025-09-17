import { useEffect, useState } from "react";
import { getSurveyDetails } from "../API/index.js";

export default function TicketUserInfo({ filter, ticket }) {
  const [newData, setNewData] = useState(null);
  const [oldData, setOldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const normalizeImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("cloudflarestorage.com")) {
      const fileName = url.split("/").pop();
      return `https://www.magneetarsolutions.com/${fileName}`;
    }
    return url;
  };

  useEffect(() => {
    if (!ticket?.ticket_id) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getSurveyDetails(ticket.ticket_id);

        if (res.success && res.data) {
          const data = res.data.data;

          setNewData({
            consumer: data.consumer || {},
            connection: data.connection || {},
            property: data.property || {},
          });

          setOldData({
            consumer: data.temp_consumer || {},
            connection: data.temp_connection || {},
            property: data.temp_property || {},
          });
        } else {
          setError(res.error || "Failed to fetch data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticket]);


  const renderSection = (sectionName, obj) => {
    if (!obj || Object.keys(obj).length === 0) return null;

    const fields = Object.entries(obj).filter(
      ([key, value]) =>
        key !== "images" &&
        value &&
        (typeof value !== "string" ||
          (!value.startsWith("http") && !value.startsWith("data:image")))
    );

    let propertyImages = [];
    if (sectionName === "property") {
      if (Array.isArray(obj.images)) {
        propertyImages = obj.images;
      } else if (typeof obj.images === "string") {
        propertyImages = [obj.images];
      } else if (obj.image_url) {
        propertyImages = [obj.image_url];
      }
    }

    if (sectionName === "property") {
      return (
        <div className="mb-3">
          <div className="grid grid-cols-2 gap-4 flex-1">
            {fields.map(([key, value]) => (
              <div key={key}>
                <p className="text-xs font-semibold capitalize">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-gray-600">
                  {value !== null && value !== "" ? String(value) : "N/A"}
                </p>
              </div>
            ))}
          </div>

          {propertyImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {propertyImages.map((url, index) => (
                <div key={index}>
                  <p className="text-[10px] font-semibold text-gray-600 capitalize mb-1">
                    image {index + 1}
                  </p>
                  <img
                    src={normalizeImageUrl(url)}
                    alt={`property-image-${index}`}
                    className="w-full h-40 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedImage(normalizeImageUrl(url))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    const images = Object.entries(obj).filter(
      ([key, value]) =>
        value &&
        typeof value === "string" &&
        (value.startsWith("http") || value.startsWith("data:image"))
    );

    return (
      <div className="mb-3">
        <div className="flex gap-4">
          <div className="grid grid-cols-2 gap-4 flex-1">
            {fields.map(([key, value]) => (
              <div key={key}>
                <p className="text-xs font-semibold capitalize">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-gray-600">
                  {value !== null && value !== "" ? String(value) : "N/A"}
                </p>
              </div>
            ))}
          </div>

          {images.length > 0 && (
            <div className="w-40 flex flex-col gap-2">
              {images.map(([key, value]) => (
                <div key={key}>
                  <p className="text-[10px] font-semibold text-gray-600 capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </p>
                  <img
                    src={normalizeImageUrl(value)}
                    alt={key}
                    className="w-full h-28 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedImage(normalizeImageUrl(value))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGrid = (data) => {
    if (!data)
      return <p className="text-xs text-gray-400">No data available</p>;

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="p-2 border rounded">
          <h5 className="font-bold text-sm mb-2 uppercase text-blue-600 pb-2">Consumer</h5>
          {renderSection("consumer", data.consumer)}
        </div>

        <div className="p-2 border rounded">
          <h5 className="font-bold text-sm mb-2 uppercase text-blue-600 pb-2">Connection</h5>
          {renderSection("connection", data.connection)}
        </div>

        <div className="p-2 border rounded">
          <h5 className="font-bold text-sm mb-2 uppercase text-blue-600 pb-2">Property</h5>
          {renderSection("property", data.property)}
        </div>
      </div>
    );
  };

const renderSplitGrid = (newData, oldData) => {
  if (!newData && !oldData)
    return <p className="text-xs text-gray-400">No data available</p>;

  return (
    <div>
       <div className="grid grid-cols-2 font-semibold text-center text-sm uppercase">
        <div className="p-2 border-gray-300">New Data</div>
        <div className="p-2">Old Data</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="p-2 px-10 bg-[#d7dbfd44]">
          <h5 className="font-semibold text-sm mb-2 pt-4 text-blue-500 uppercase">
            New Consumer
          </h5>
          {renderSection("consumer", newData?.consumer)}
        </div>
        <div className="p-2 px-10 bg-gray-50 border-l border-[#46464644]">
          <h5 className="font-semibold text-sm mb-2 pt-4 text-green-600 uppercase">
            Old Consumer
          </h5>
          {renderSection("consumer", oldData?.consumer)}
        </div>
      </div>

 
      <div className="grid grid-cols-2">
        <div className="p-2 px-10 bg-[#d7dbfd44]">
          <h5 className="font-semibold text-sm mb-2 text-blue-500 uppercase">
            New Connection
          </h5>
          {renderSection("connection", newData?.connection)}
        </div>
        <div className="p-2 px-10 bg-gray-50 border-l border-[#46464644]">
          <h5 className="font-semibold text-sm mb-2 text-green-600 uppercase">
            Old Connection
          </h5>
          {renderSection("connection", oldData?.connection)}
        </div>
      </div>

   
      <div className="grid grid-cols-2">
        <div className="p-2 px-10 bg-[#d7dbfd44]">
          <h5 className="font-semibold text-sm mb-2 text-blue-500 uppercase">
            New Property
          </h5>
          {renderSection("property", newData?.property)}
        </div>
        <div className="p-2 px-10 bg-gray-50 border-l border-[#46464644]">
          <h5 className="font-semibold text-sm mb-2 text-green-600 uppercase">
            Old Property
          </h5>
          {renderSection("property", oldData?.property)}
        </div>
      </div>
    </div>
  );
};


  if (loading) return <p className="text-sm text-gray-500"></p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <>
      {filter === "new" && (
        <div className="p-4 bg-gray-50 custom-scrollbar rounded">
          {renderGrid(newData)}
        </div>
      )}
      {filter === "old" && (
        <div className="p-4 bg-gray-50 custom-scrollbar rounded">
          {renderGrid(oldData)}
        </div>
      )}
      {filter === "split" && (
        <div className="p-4 custom-scrollbar">
          {renderSplitGrid(newData, oldData)}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="enlarged"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
}
