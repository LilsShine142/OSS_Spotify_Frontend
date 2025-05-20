import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleRegister } from '@/services/authService';

// ✅ Zod schema với kiểm tra trên 15 tuổi
const userSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  dob: z
    .string()
    .min(1, 'Ngày sinh là bắt buộc')
    .refine((val) => {
      const dob = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      const d = now.getDate() - dob.getDate();
      return age > 15 || (age === 15 && (m > 0 || (m === 0 && d >= 0)));
    }, {
      message: 'Người dùng phải lớn hơn 15 tuổi',
    }),
  gender: z.enum(['Male', 'Female'], {
    required_error: 'Giới tính là bắt buộc',
  }),
  role: z.enum(['user', 'admin'], {
    required_error: 'Vai trò là bắt buộc',
  }),
});

function ManageNewUser() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      dob: '',
      gender: undefined,
      role: undefined,
    },
  });

  const onSubmit = async (data) => {
    try {
     
      const res = await handleRegister(data)
      if(res.message == "success"){
        toast.success('Tạo tài khoản thành công');
        reset({
          name: '',
          email: '',
          password: '',
          dob: '',
          gender: undefined, // reset về undefined
          role: undefined,   // reset về undefined
        });
      }
     
    } catch (err) {
      console.error(err);
      toast.error('Tạo tài khoản thất bại');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tạo tài khoản mới</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        <div>
          <Label>Họ tên</Label>
          <Input {...register('name')} autoComplete="off" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" {...register('email')} autoComplete="new-email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <Label>Mật khẩu</Label>
          <Input type="password" {...register('password')} autoComplete="new-password" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <Label>Ngày sinh</Label>
          <Input type="date" {...register('dob')} />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
        </div>

        <div>
          <Label>Giới tính</Label>
          <Select
            onValueChange={(val) => setValue('gender', val, { shouldValidate: true, shouldDirty: true })}
            value={watch('gender') || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Nam</SelectItem>
              <SelectItem value="Female">Nữ</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        <div>
          <Label>Vai trò</Label>
          <Select
            onValueChange={(val) => setValue('role', val, { shouldValidate: true, shouldDirty: true })}
            value={watch('role') || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="w-full text-green-500 hover:bg-gray-200">
          Tạo tài khoản
        </Button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ManageNewUser;
