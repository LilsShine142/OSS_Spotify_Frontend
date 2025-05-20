import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { EyeOff, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { fetchUsers, updateStatus } from '@/services/adminService';
// import { toast } from 'sonner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterIsHidden, setFilterIsHidden] = useState('all'); // all, hidden, visible
  const [filterRole, setFilterRole] = useState('');
  const [filterGender, setFilterGender] = useState('all'); // all, male, female
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetchUsers();
      if (res?.results?.data) {
        setUsers(res.results.data);
      } else {
        console.error("Không có dữ liệu người dùng hoặc kết quả không đúng định dạng.");
      }
    };

    getUsers();
  }, []);


  const handleToggleHide = async (id, currentIsHidden) => {
    const user = users.find(u => u._id === id);

    // ❌ Không cho phép ẩn hoặc hiện admin
    if (user?.role === 'admin') {
      toast.error("Role Admin không thể thay đổi trạng thái")
      return;
    }

    try {
      const newIsHidden = !currentIsHidden;

      const res = await updateStatus(id, newIsHidden);
      if (res.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === id ? { ...user, isHidden: newIsHidden } : user
          )
        );
      }else{
        toast.error("Role Admin không thể thay đổi trạng thái")
      }
    } catch (err) {
      console.error('Error toggling user visibility:', err);
    }
  };


  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    // Tìm kiếm theo tên, email, hoặc vai trò
    const matchesSearch = search
      ? user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      : true;

    // Lọc theo trạng thái ẩn/hiện
    const matchesIsHidden =
      filterIsHidden === 'all' ||
      (filterIsHidden === 'hidden' && user.isHidden === true) ||
      (filterIsHidden === 'visible' && user.isHidden === false);

    // Lọc theo vai trò
    const matchesRole = filterRole
      ? user.role.toLowerCase().includes(filterRole.toLowerCase())
      : true;

    // Lọc theo giới tính
    const matchesGender =
      filterGender === 'all' ||
      (filterGender === 'male' && user.gender === 'Male') ||
      (filterGender === 'female' && user.gender === 'Female');

    return matchesSearch && matchesIsHidden && matchesRole && matchesGender;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Quản lý người dùng</h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={filterIsHidden} onValueChange={setFilterIsHidden}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="visible">Hiển thị</SelectItem>
            <SelectItem value="hidden">Đã ẩn</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Lọc theo vai trò..."
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full"
        />

        <Select value={filterGender} onValueChange={setFilterGender}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giới tính</SelectItem>
            <SelectItem value="male">Nam</SelectItem>
            <SelectItem value="female">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user._id}
            className={`border-[5px] ${user.isHidden ? 'border-red-300' : 'border-green-300'} hover:shadow-md transition`}
          >
            <CardContent className="p-4 space-y-1">
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-sm">
                Vai trò:{' '}
                <span
                  className={`font-medium ${
                    user.role === 'admin' ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-sm">
                Trạng thái:{' '}
                <span className={user.isHidden ? 'text-red-500' : 'text-green-600 font-medium'}>
                  {user.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant={user.isHidden ? 'secondary' : 'destructive'}
                  size="sm"
                  onClick={() => handleToggleHide(user._id, user.isHidden)}
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  {user.isHidden ? 'Hiện' : 'Ẩn'}
                </Button>

                <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                  <Info className="w-4 h-4 mr-1" />
                  Chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Thông tin người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 bg-gray-50 p-4 rounded-md">
              <p>
                <strong>Họ tên:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Giới tính:</strong>{' '}
                <span className="capitalize text-blue-600">
                  {selectedUser.gender === 'Male' ? 'Nam' : selectedUser.gender === 'Female' ? 'Nữ' : 'Không xác định'}
                </span>
              </p>
              <p>
                <strong>Ngày sinh:</strong>{' '}
                {new Date(selectedUser.dob).toLocaleDateString('vi-VN')}
              </p>
              <p>
                <strong>Vai trò:</strong>{' '}
                <span className="text-purple-600">{selectedUser.role}</span>
              </p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                <span className={selectedUser.isHidden ? 'text-red-600' : 'text-green-600'}>
                  {selectedUser.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                </span>
              </p>
              <p>
                <strong>Ngày cập nhật:</strong>{' '}
                {new Date(selectedUser.updated_at).toLocaleString('vi-VN')}
              </p>
              <p>
                <strong>Premium hết hạn:</strong>{' '}
                {selectedUser.premium_expired_at ? (
                  new Date(selectedUser.premium_expired_at).toLocaleString('vi-VN')
                ) : (
                  <span className="italic text-gray-500">Chưa đăng ký</span>
                )}
              </p>
              <p>
                <strong>ID người dùng:</strong>{' '}
                <span className="text-sm text-muted-foreground">{selectedUser._id}</span>
              </p>
              {selectedUser.profile_pic ? (
                <div>
                  <strong>Ảnh đại diện:</strong>
                  <img
                    src={selectedUser.profile_pic}
                    alt="Avatar"
                    className="mt-2 rounded-full w-24 h-24 object-cover border shadow"
                  />
                </div>
              ) : (
                <p>
                  <strong>Ảnh đại diện:</strong>{' '}
                  <span className="italic text-gray-500">Chưa cập nhật</span>
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={1000} // 👈 thời gian ẩn toast sau 1 giây
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </div>
  );
}

export default ManageUsers;