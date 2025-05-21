import React, { useState, useEffect } from "react";
import SelectOption from "../SelectOption";
import { uploadToCloudinary } from "../../../services/CloudUploadService/CloudService";

const ModalForm = ({
  show,
  setShow,
  onSubmit,
  initialData,
  columns,
  isAddingPosition,
}) => {
  const [formData, setFormData] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultFormData = columns.reduce((acc, col) => {
        acc[col.name] = col.defaultValue || "";
        return acc;
      }, {});

      setFormData(defaultFormData);
    }
  }, [initialData, columns]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
      setIsClosing(false);
    }, 400);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "position") {
        const positionColumn = columns.find((col) => col.name === "position");
        const selectedPosition = positionColumn?.options?.find(
          (option) => option.label === value
        );

        if (selectedPosition) {
          newData.coefficient = selectedPosition.coefficient || "0";
          newData.positionId = selectedPosition.positionId;
          newData.salaryId = selectedPosition.salaryId;
          newData.position = selectedPosition.label;
          newData.createdAt = initialData?.createdAt;
          newData.updatedAt = initialData?.updatedAt;
          newData.statusId = initialData?.statusId;
        }
      }

      return newData;
    });
  };

  const handleFileChange = async (e, name) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const imageUrl = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      setFormData((prev) => ({ ...prev, [name]: imageUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Có lỗi xảy ra khi tải lên ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      console.log("Form submitted successfully:", formData);
      handleClose();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu");
    }
  };

  const renderInputField = (col) => {
    switch (col.type) {
      case "select":
        return (
          <SelectOption
            name={col.name}
            value={formData[col.name] || ""}
            onChange={handleChange}
            options={col.options || []}
            placeholder={col.placeholder}
          />
        );
      case "file":
        return (
          <div className="space-y-2">
            <input
              type="file"
              name={col.name}
              onChange={(e) => handleFileChange(e, col.name)}
              className="w-full border p-2 rounded-md text-sm"
              accept="image/*"
              disabled={isUploading}
            />
            {isUploading && (
              <>
                {uploadProgress < 100 ? (
                  // Thanh tiến trình upload
                  <div className="relative w-full h-3 rounded-full bg-gray-200 overflow-hidden transition-opacity duration-500">
                    <div
                      className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium">
                      {uploadProgress}%
                    </div>
                  </div>
                ) : (
                  // Hiển thị sau khi upload xong, nhưng đang chờ Cloudinary phản hồi
                  <div className="w-full text-center text-sm text-gray-600 mt-2 animate-pulse">
                    Đang xử lý ảnh...
                  </div>
                )}
              </>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full min-h-[150px] flex items-center justify-center bg-gray-50">
              {formData[col.name] ? (
                <img
                  src={formData[col.name]}
                  alt="Preview"
                  className="max-h-[200px] max-w-full object-contain rounded"
                />
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  Preview ảnh sẽ hiển thị ở đây
                </p>
              )}
            </div>
          </div>
        );
      default:
        return (
          <input
            type={col.type || "text"}
            name={col.name}
            value={formData[col.name] || ""}
            onChange={handleChange}
            className={`w-full border p-2 rounded-md text-sm focus:outline-blue-500 text-black${
              (!isAddingPosition &&
                !formData.id &&
                col.name === "coefficient") ||
              (formData.id &&
                (col.name === "base" || col.name === "coefficient"))
                ? "select-none bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            required={col.required}
            readOnly={
              (!isAddingPosition &&
                !formData.id &&
                col.name === "coefficient") ||
              (formData.id &&
                (col.name === "base" || col.name === "coefficient"))
            }
          />
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black/50 transition-opacity duration-400 overflow-y-auto py-8 ${
        show && !isClosing ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl p-6 transition-all duration-400 transform ${
          show && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData?.id ? "Chỉnh sửa" : "Thêm mới"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4"
        >
          {columns.map((col) => (
            <div
              key={col.name}
              className={`${
                col.type === "file" ? "sm:col-span-2" : ""
              } space-y-1`}
            >
              <label className="block text-sm font-medium text-gray-700">
                {col.label}
              </label>
              {renderInputField(col)}
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-end space-x-3 pt-4 border-t mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isUploading}
            >
              {initialData?.id ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
