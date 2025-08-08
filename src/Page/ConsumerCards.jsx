import React from "react";
import { FaUser, FaHome, FaPlug, FaClipboardList } from "react-icons/fa";

export default function ConsumerDetailCards({ consumer }) {
  if (!consumer) return null;

  const propertyImages = consumer.images?.length
    ? consumer.images.map((img) => img.uri)
    : [
        "https://777properties.com/wp-content/uploads/2023/11/pexels-pixabay-269077-jpg.webp",
        "https://777properties.com/wp-content/uploads/2023/11/pexels-pixabay-269077-jpg.webp",
      ];

  const InfoFourCol = ({ labels, values }) => (
    <div className="mb-4">
      <div className="grid grid-cols-4 gap-4 text-xs text-gray-500">
        {labels.map((label, i) => (
          <p key={i}>{label}</p>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-800">
        {values.map((value, i) => (
          <p key={i}>{value || "-"}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 mt-10">
   
      <div className="bg-white rounded-lg p-5 w-full">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-blue-600 mb-4 border-b pb-1">
          <FaUser />Consumer Info
        </h2>
        <InfoFourCol
          labels={["Consumer Code", "Name", "Phone", "CNIC"]}
          values={[
            consumer.consumer.consumer_code,
            consumer.consumer.full_name,
            consumer.consumer.phone,
            consumer.consumer.cnic,
          ]}
        />
        <InfoFourCol
          labels={["Zone", "Address", "UC", "Ward"]}
          values={[
            consumer.consumer.zone,
            consumer.consumer.address,
            consumer.consumer.uc,
            consumer.consumer.ward,
          ]}
        />
        <InfoFourCol
          labels={["WhatsApp", "Email", "Reg. Date", "WASA Employee"]}
          values={[
            consumer.consumer.whatsapp,
            consumer.consumer.email,
            consumer.consumer.registration_date,
            consumer.consumer.wasa_employee ? "Yes" : "No",
          ]}
        />
        <InfoFourCol
          labels={["Remarks", "Active", "Latitude", "Longitude"]}
          values={[
            consumer.consumer.remarks,
            consumer.consumer.is_active ? "Yes" : "No",
            consumer.consumer.location?.latitude,
            consumer.consumer.location?.longitude,
          ]}
        />
      </div>

     
      <div className="bg-white rounded-lg p-5 w-full">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-blue-600 mb-4 border-b pb-1">
          <FaHome/>Property Details
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InfoFourCol
              labels={["Category", "Ferrule Size", "Water Quality", "Water Connection"]}
              values={[
                consumer.premiseDetails.category,
                consumer.premiseDetails.ferrule_size,
                consumer.premiseDetails.water_quality,
                consumer.premiseDetails.water_connection ? "Yes" : "No",
              ]}
            />
            <InfoFourCol
              labels={["Stories", "Legal", "Plot Size", "Status"]}
              values={[
                consumer.premiseDetails.stories,
                consumer.premiseDetails.legal ? "Yes" : "No",
                consumer.premiseDetails.plot_size,
                consumer.premiseDetails.status,
              ]}
            />
            <InfoFourCol
              labels={["Well", "Bore Aquifer", "Domestic", "Commercial"]}
              values={[
                consumer.premiseDetails.well ? "Yes" : "No",
                consumer.premiseDetails.bore_aquifer ? "Yes" : "No",
                consumer.premiseDetails.domestic ? "Yes" : "No",
                consumer.premiseDetails.commercial ? "Yes" : "No",
              ]}
            />
          </div>

     
          <div className="">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Images</h3>
            <div className="flex flex-col gap-3">
              {propertyImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Property ${idx + 1}`}
                  className="w-44 h-20 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

     
      <div className=" bg-white rounded-lg p-5 w-full">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-blue-600 mb-4 border-b pb-1">
          <FaPlug/>Connection Details
        </h2>
        <InfoFourCol
          labels={["Connection Status", "Meter No", "Water Unit", "Sewerage Unit"]}
          values={[
            consumer.connection_details.connection_status,
            consumer.connection_details.meter_number,
            consumer.connection_details.water_unit,
            consumer.connection_details.sewerage_unit,
          ]}
        />
        <InfoFourCol
          labels={["Water Cat. (Existing)", "Water Cat. (Proposed)", "Legal", "Installed At"]}
          values={[
            consumer.connection_details.water_category_existing,
            consumer.connection_details.water_category_proposed,
            consumer.connection_details.legal ? "Yes" : "No",
            consumer.connection_details.installed_at,
          ]}
        />
        <InfoFourCol
          labels={["Sewerage Cat. (Existing)", "Sewerage Cat. (Proposed)", "Inspected At", "Remarks"]}
          values={[
            consumer.connection_details.sewerage_category_existing,
            consumer.connection_details.sewerage_category_proposed,
            consumer.connection_details.last_inspected_at,
            consumer.connection_details.remarks,
          ]}
        />
      </div>

      <div className="bg-white rounded-lg p-5 w-full">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-blue-600 mb-4 border-b pb-1">
          <FaClipboardList/>Survey Info
        </h2>
        <InfoFourCol
          labels={["Surveyor ID", "Survey Type", "Survey Status", "Supervisor ID"]}
          values={[
            consumer.survey_data.surveyor_id,
            consumer.survey_data.survey_type,
            consumer.survey_data.survey_status,
            consumer.survey_data.supervisor_id,
          ]}
        />
        <InfoFourCol
          labels={["Supervisor Comment", "Remarks", "Latitude", "Longitude"]}
          values={[
            consumer.survey_data.supervisor_comment,
            consumer.survey_data.remarks,
            consumer.survey_data.gps_latitude,
            consumer.survey_data.gps_longitude,
          ]}
        />
      </div>
    </div>
  );
}