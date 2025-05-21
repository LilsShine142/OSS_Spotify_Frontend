import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import ModalForm from "../../components/ModalForm/ModalForm";
function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const navigate = useNavigate();

  const columns = [
    { name: "name", label: "Họ tên", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "dob", label: "Ngày sinh", type: "date", required: false },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
      ],
      required: false,
    },
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      options: [
        { label: "Quản trị viên", value: "admin" },
        { label: "Người dùng", value: "user" },
        // Các role khác nếu cần
      ],
      required: true,
    },
    { name: "profile_pic", label: "Ảnh đại diện", type: "file" },
    {
      name: "isHidden",
      label: "Ẩn người dùng",
      type: "checkbox",
    },
    { name: "password", label: "Mật khẩu", type: "password", required: true },
    {
      name: "confirmPassword",
      label: "Xác nhận mật khẩu",
      type: "password",
      required: true,
    },
  ];

  const fetchUsers = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/user_management/getallusers/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API response:", res.data);
      const data = res.data.results?.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.response?.data?.error || "Lấy dữ liệu người dùng thất bại.");
      console.error("Error fetching users:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      console.log("Deleting user with ID:", id);
      try {
        await axios.delete(
          `http://127.0.0.1:8000/user_management/deleteuser/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchUsers();
        alert("Xóa người dùng thành công.");
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || "Xóa người dùng thất bại.";
        alert(errorMsg);
        console.error("Error deleting user:", error.response);
      }
    }
  };

  // Functions to handle modal
  const handleOpenModal = () => {
    setInitialData(null); // Reset initial data for adding new user
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setInitialData({
      id: user._id,
      fullName: user.name,
      email: user.email,
      position: user.role,
      coefficient: user.coefficient || "",
      avatar: user.profile_pic || "",
      gender: user.gender || "male",
    });
    setShowModal(true);
  };

  const handleSubmitUser = async (formData) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        role: formData.position,
        coefficient: formData.coefficient,
        profile_pic: formData.avatar,
        gender: formData.gender || "male",
      };

      if (formData.id) {
        // Update existing user
        await axios.put(
          `http://127.0.0.1:8000/user_management/updateuser/${formData.id}/`,
          apiData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Cập nhật người dùng thành công!");
      } else {
        // Create new user
        await axios.post(
          "http://127.0.0.1:8000/user_management/createuser/",
          apiData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Thêm người dùng thành công!");
      }

      fetchUsers(); // Refresh user list
      return true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Thao tác người dùng thất bại.";
      alert(errorMsg);
      console.error("Error submitting user:", error.response);
      throw error;
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.name
          ? user.name.toLowerCase().includes(search.toLowerCase())
          : false
      )
    : [];

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">
          Quản lý người dùng
        </h1>
        <div className="flex gap-4">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
            title="Làm mới danh sách"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        className="w-full p-3 mb-6 bg-[#121212] text-white rounded-md border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={loading}
      />

      <div className="rounded-lg overflow-hidden shadow-md shadow-black/50">
        <table className="w-full text-left text-sm bg-[#181818] border border-gray-800">
          <thead className="bg-[#282828] text-gray-400 uppercase select-none">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Ảnh</th>
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Giới tính</th>
              <th className="py-3 px-4 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 animate-pulse"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={user.profile_pic || "/default-avatar.png"}
                      alt={user.name || "Unknown"}
                      className="w-12 h-12 rounded-full object-cover shadow"
                    />
                  </td>
                  <td
                    className="py-3 px-4 font-medium truncate"
                    title={user.name || "Unknown"}
                  >
                    {user.name || "Unknown"}
                  </td>
                  <td className="py-3 px-4 truncate" title={user.email}>
                    {user.email}
                  </td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 capitalize">
                    {user.gender === "male" ? "Nam" : "Nữ"}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa người dùng"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa người dùng"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Component */}
      <ModalForm
        show={showModal}
        setShow={setShowModal}
        onSubmit={handleSubmitUser}
        initialData={initialData}
        columns={columns}
        isAddingPosition={false}
      />
    </div>
  );
}

export default UserList;
